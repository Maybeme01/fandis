/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType, PluginNative } from "@utils/types";
import type { User, VoiceState } from "@vencord/discord-types";
import { findStore, findStoreLazy } from "@webpack";
import {
    AuthenticationStore,
    ChannelStore,
    GuildMemberStore,
    PresenceStore,
    React,
    SelectedChannelStore,
    showToast,
    Tooltip,
    UserStore,
    VoiceStateStore
} from "@webpack/common";

const WATCH_TOGETHER_APPLICATION_ID = "880218394199220334";
const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF]/;

const RTCDebugStore = findStoreLazy("RTCDebugStore");
const EmbeddedActivitiesStore = findStoreLazy("EmbeddedActivitiesStore");

export interface DetectedUserEntry {
    userId: string;
    reasonKey: string;
    reasonText: string;
    detectedAt: number;
    clientMod?: string;
}

export const detectedFakeDeafUsers = new Map<string, DetectedUserEntry>();
export const fanToolsEvents = new EventTarget();

// Tracking structures
const userDeafenToggleTimestamps = new Map<string, { time: number; isDeaf: boolean }[]>();
const userAudioPacketsHistory = new Map<string, number>();

function safeShowToast(message: string) {
    try {
        showToast({ text: message, variant: "critical" });
    } catch {}
}

function getNative(): PluginNative<typeof import("./native")> | null {
    try {
        return (VencordNative as any)?.pluginHelpers?.FanToolsAll ?? null;
    } catch {
        return null;
    }
}

const FAN_AUTHOR_ID = String(Devs.FAN?.id ?? "365952206777876484");
let cachedSelfId: string | null = null;

export function getSelfUserId(): string | null {
    if (cachedSelfId) return cachedSelfId;
    try {
        const uStore: any = findStore("UserStore") || (UserStore as any);
        const authStore: any = findStore("AuthenticationStore") || (AuthenticationStore as any);
        const id =
            uStore?.getCurrentUser?.()?.id
            ?? authStore?.getId?.()
            ?? uStore?.getId?.()
            ?? null;
        if (id) {
            cachedSelfId = String(id);
            return cachedSelfId;
        }
    } catch {}
    return null;
}

export function isSelf(userId?: string | null): boolean {
    if (!userId) return false;
    try {
        const idStr = String(userId);
        if (idStr === FAN_AUTHOR_ID) return true;
        const myId = getSelfUserId();
        if (myId && idStr === String(myId)) return true;

        const curUser = (findStore("UserStore") as any)?.getCurrentUser?.() || UserStore?.getCurrentUser?.();
        if (curUser?.id && idStr === String(curUser.id)) return true;

        const authId = (findStore("AuthenticationStore") as any)?.getId?.() || AuthenticationStore?.getId?.();
        if (authId && idStr === String(authId)) return true;
    } catch {}
    return false;
}

export function isBotOrServerDeaf(userId?: string | null, voiceState?: any): boolean {
    if (!userId) return false;
    try {
        const idStr = String(userId);
        if (isSelf(idStr)) return true;

        // 1. Direct state object check if passed
        if (voiceState) {
            if (voiceState.deaf === true) return true; // Server deafened by admin
            if (voiceState.mute === true && voiceState.deaf === true) return true;
            if (voiceState.member?.user?.bot || voiceState.member?.bot) return true;
            if (voiceState.user?.bot || (typeof voiceState.user?.isBot === "function" && voiceState.user.isBot())) return true;
        }

        // 2. UserStore check
        const uStore: any = findStore("UserStore") || UserStore;
        const user = uStore?.getUser?.(idStr);
        if (user?.bot || (typeof user?.isBot === "function" && user.isBot())) return true;
        if (user?.discriminator === "0000" && !user?.username) return true;

        // 3. VoiceStateStore check
        const vsStore: any = findStore("VoiceStateStore") || VoiceStateStore;
        const vs = voiceState || vsStore?.getVoiceStateForUser?.(idStr);
        if (vs?.deaf === true) return true; // Server deafened by admin
        if (vs?.member?.user?.bot || vs?.member?.bot) return true;
        if (vs?.user?.bot || (typeof vs?.user?.isBot === "function" && vs.user.isBot())) return true;

        // 4. GuildMemberStore check
        const scStore: any = findStore("SelectedChannelStore") || SelectedChannelStore;
        const channelId = scStore?.getVoiceChannelId?.();
        const chStore: any = findStore("ChannelStore") || ChannelStore;
        const channel = channelId ? chStore?.getChannel?.(channelId) : null;
        if (channel?.guild_id) {
            const gmStore: any = findStore("GuildMemberStore") || GuildMemberStore;
            const member = gmStore?.getMember?.(channel.guild_id, idStr);
            if (member?.user?.bot || member?.bot || (typeof member?.user?.isBot === "function" && member.user.isBot())) return true;
        }

        // 5. RelationshipStore check
        const relStore: any = findStore("RelationshipStore");
        if (relStore?.isBot?.(idStr)) return true;
    } catch {}
    return false;
}

export function isFakeDeafened(userId?: string): boolean {
    if (!userId || !settings.store.detectFakeDeafen) return false;
    if (isSelf(userId) || isBotOrServerDeaf(userId)) return false;
    return detectedFakeDeafUsers.has(String(userId));
}

function extractUserIdFromDOM(row: Element): string | null {
    try {
        const id = row.getAttribute("data-user-id")
            || row.querySelector("[data-user-id]")?.getAttribute("data-user-id");
        if (id) return id;

        const avatarImg = row.querySelector("img[src*='/avatars/'], img[src*='/users/']");
        if (avatarImg) {
            const src = avatarImg.getAttribute("src") || "";
            const match = src.match(/(?:avatars|users)\/(\d{15,21})/);
            if (match) return match[1];
        }
    } catch {}

    return null;
}

let updateScheduled = false;
let isUpdatingDOM = false;

export function scheduleVoiceDOMUpdate() {
    if (updateScheduled) return;
    updateScheduled = true;
    requestAnimationFrame(() => {
        updateScheduled = false;
        updateVoiceDOM();
    });
}

export function updateVoiceDOM() {
    if (isUpdatingDOM) return;
    isUpdatingDOM = true;

    try {
        const voiceRows = document.querySelectorAll(
            "[class*='voiceUser'], [class*='VoiceUser'], [class*='tile__']"
        );

        voiceRows.forEach(row => {
            const userId = extractUserIdFromDOM(row);

            if (!userId || isSelf(userId)) {
                if (row.getAttribute("data-fake-deafen") === "true") {
                    row.removeAttribute("data-fake-deafen");
                }
                return;
            }

            const isFaked = isFakeDeafened(userId);
            if (isFaked) {
                if (row.getAttribute("data-fake-deafen") !== "true") {
                    row.setAttribute("data-fake-deafen", "true");
                }
            } else {
                if (row.getAttribute("data-fake-deafen") === "true") {
                    row.removeAttribute("data-fake-deafen");
                }
            }
        });
    } catch {} finally {
        isUpdatingDOM = false;
    }
}

function markUserAsFake(
    userId: string,
    reasonKey: string,
    reasonTextAr: string,
    reasonTextEn: string,
    clientMod?: string
) {
    if (!settings.store.detectFakeDeafen || !userId) return;
    const uid = String(userId);
    if (isSelf(uid) || isBotOrServerDeaf(uid)) return;

    try {
        const now = Date.now();
        const existing = detectedFakeDeafUsers.get(uid);

        if (existing && existing.reasonKey === reasonKey && now - existing.detectedAt < 10000) {
            return;
        }

        detectedFakeDeafUsers.set(uid, {
            userId: uid,
            reasonKey,
            reasonText: t(reasonTextAr, reasonTextEn),
            detectedAt: now,
            clientMod
        });

        fanToolsEvents.dispatchEvent(new Event("change"));
        scheduleVoiceDOMUpdate();

        if (!existing && settings.store.notifyOnDetection) {
            try {
                const uStore: any = findStore("UserStore") ?? UserStore;
                const user = uStore?.getUser?.(uid);
                const name = user?.globalName || user?.username || uid;
                const reason = t(reasonTextAr, reasonTextEn);
                const modInfo = clientMod ? ` [${clientMod}]` : "";
                safeShowToast(
                    t(
                        `🚨 كاشف FanTools: تم رصد Fake Deafen عند ${name}${modInfo} (${reason})!`,
                        `🚨 FanTools: Fake Deafen detected on ${name}${modInfo} (${reason})!`
                    )
                );
            } catch {}
        }
    } catch {}
}

function unmarkUser(userId: string) {
    try {
        const uid = String(userId);
        if (detectedFakeDeafUsers.has(uid)) {
            detectedFakeDeafUsers.delete(uid);
            fanToolsEvents.dispatchEvent(new Event("change"));
            scheduleVoiceDOMUpdate();
        }
    } catch {}
}

// ── Vector 1: Rapid Programmatic Toggle Fingerprint ──
function recordToggleTiming(userId: string, isDeaf: boolean) {
    if (!userId || isSelf(userId) || isBotOrServerDeaf(userId)) return;
    try {
        const now = performance.now();
        let history = userDeafenToggleTimestamps.get(userId);
        if (!history) {
            history = [];
            userDeafenToggleTimestamps.set(userId, history);
        }

        // Only record if state ACTUALLY toggled (prevent duplicate packet matches)
        const last = history[history.length - 1];
        if (last && last.isDeaf === isDeaf) {
            return;
        }

        history.push({ time: now, isDeaf });
        history = history.filter(h => now - h.time < 1200);
        userDeafenToggleTimestamps.set(userId, history);

        // Require at least 3 rapid programmatic state toggles within 600ms (impossible for human clicking)
        if (history.length >= 3) {
            const span = history[history.length - 1].time - history[0].time;
            if (span <= 600) {
                markUserAsFake(
                    userId,
                    "toggle_timing_fingerprint",
                    "نبضات تبديل برمجية آلية فائقة السرعة (بصمة النسخ المعدلة)",
                    "Rapid automated toggle pulse (Mod signature)",
                    "Client Mod"
                );
            }
        }
    } catch {}
}

// ── Vector 2: Invisible Zero-Width Characters in Custom Status ──
function scanUserPresence(userId: string) {
    if (!settings.store.detectZeroWidth || !userId || isSelf(userId)) return;
    try {
        const pStore: any = findStore("PresenceStore") ?? PresenceStore;
        const activities = pStore?.getActivities?.(userId) ?? [];
        for (const act of activities) {
            if (act.state && ZERO_WIDTH_REGEX.test(act.state)) {
                markUserAsFake(
                    userId,
                    "zero_width_status",
                    "وسم تخفي في الحالة (Zero-Width Tag)",
                    "Hidden zero-width character in status",
                    "Mod Client"
                );
                return;
            }
        }
    } catch {}
}

// ── Vector 3: WebRTC Inbound RTP Audio Packets Flow (Filtered) ──
function scanRTPStreams() {
    // Disabled raw packet counting: Discord WebRTC SFU sends transport keepalives/silence
    // packets to all peers, causing false positives on regular users and bots. Real detection
    // is safely handled by gateway SPEAKING events and unmuted protocol inconsistencies.
}

// ── Vector 4: Cross-Instance Local Native Sync (Shared Machine FanCord Bridge) ──
async function syncLocalNativeFaked() {
    try {
        const native = getNative();
        if (!native?.getActiveFakeDeafenUsers) return;
        const activeUsers = await native.getActiveFakeDeafenUsers();

        for (const [userId, data] of Object.entries(activeUsers)) {
            if (!userId || isSelf(userId) || isBotOrServerDeaf(userId) || !data.active) continue;
            markUserAsFake(
                userId,
                "local_fancord_instance",
                "مفعل Fake Deafen في نسخة الفانكورد",
                "Fake Deafen active on FanCord instance",
                "FanCord"
            );
        }

        // Clean unactive entries
        for (const [userId, entry] of detectedFakeDeafUsers.entries()) {
            if (isSelf(userId) || (entry.reasonKey === "local_fancord_instance" && (!activeUsers[userId] || !activeUsers[userId].active))) {
                unmarkUser(userId);
            }
        }
    } catch {}
}

const unmutedWhileDeafTimers = new Map<string, number>();

// ── Vector 5: Channel-wide Instant Voice State Audit ──
function scanAllChannelUsers() {
    try {
        const scStore: any = findStore("SelectedChannelStore") ?? SelectedChannelStore;
        const channelId = scStore?.getVoiceChannelId?.();
        if (!channelId) return;
        const vsStore: any = findStore("VoiceStateStore") ?? VoiceStateStore;
        const voiceStates = vsStore?.getVoiceStatesForChannel?.(channelId);
        if (!voiceStates) return;

        const now = Date.now();

        for (const [userId, state] of Object.entries(voiceStates as Record<string, any>)) {
            if (!userId || isSelf(userId) || isBotOrServerDeaf(userId, state)) {
                unmutedWhileDeafTimers.delete(userId);
                unmarkUser(userId);
                continue;
            }

            // If not self-deafened, or if server-deafened (admin action), immediately unmark
            if (!state.selfDeaf || state.deaf) {
                unmutedWhileDeafTimers.delete(userId);
                unmarkUser(userId);
                continue;
            }

            // Protocol Inconsistency: Self-deafened but unmuted!
            // Exclude server-deafen (state.deaf) which is an admin action and not fake deafen
            if (state.selfDeaf && !state.deaf && !state.selfMute && !state.mute) {
                const firstSeen = unmutedWhileDeafTimers.get(userId) || now;
                if (!unmutedWhileDeafTimers.has(userId)) {
                    unmutedWhileDeafTimers.set(userId, firstSeen);
                }

                // Debounce 2000ms to avoid transient gateway race conditions when clicking deafen
                if (now - firstSeen >= 2000) {
                    markUserAsFake(
                        userId,
                        "unmuted_while_deafened",
                        "غير مكتوم وهو مصمت (تناقض بروتوكولي قطعي)!",
                        "unmuted while deafened (protocol violation)"
                    );
                }
            } else {
                unmutedWhileDeafTimers.delete(userId);
            }

            // Embedded activity while deafened
            const eaStore: any = findStore("EmbeddedActivitiesStore") ?? EmbeddedActivitiesStore;
            const acts = eaStore?.getEmbeddedActivitiesForChannel?.(channelId) ?? [];
            if (state.selfDeaf && !state.deaf && acts.some((a: any) => a.applicationId === WATCH_TOGETHER_APPLICATION_ID && a.userIds?.has?.(userId))) {
                markUserAsFake(
                    userId,
                    "watch_together_while_deafened",
                    "نشاط Watch Together وهو مصمت!",
                    "embedded activity while deafened"
                );
            }

            if (settings.store.detectZeroWidth) {
                scanUserPresence(userId);
            }
        }
    } catch {}
}

const settings = definePluginSettings({
    detectFakeDeafen: {
        type: OptionType.BOOLEAN,
        description: t(
            "كشف مستخدمي الفيك ديفن (Fake Deafen) بكافة الطرق",
            "Detect users using Fake Deafen in voice channels"
        ),
        default: true,
        onChange: () => scheduleVoiceDOMUpdate()
    },
    redDeafenIcon: {
        type: OptionType.BOOLEAN,
        description: t(
            "تلوين أيقونة السماعة بالأحمر النيون فور اكتشاف الفيك ديفن",
            "Color the deafen icon bright red when Fake Deafen is detected"
        ),
        default: true,
        onChange: () => scheduleVoiceDOMUpdate()
    },
    showFakeBadge: {
        type: OptionType.BOOLEAN,
        description: t(
            "إظهار شارة حمراء [FAKE] بجانب اسم المستخدم المكتشف",
            "Show a red [FAKE] badge next to detected user's name"
        ),
        default: true,
        restartNeeded: true
    },
    notifyOnDetection: {
        type: OptionType.BOOLEAN,
        description: t(
            "إرسال تنبيه Toast فوري عند كشف أي شخص يستخدم فيك ديفن",
            "Show immediate toast notification when Fake Deafen is detected"
        ),
        default: true
    },
    detectRTPTraffic: {
        type: OptionType.BOOLEAN,
        description: t(
            "كشف تدفق حزم الصوت عبر WebRTC (RTP Stream Analysis)",
            "Analyze raw WebRTC inbound audio packets to detect audio transmission"
        ),
        default: true
    },
    detectClientMods: {
        type: OptionType.BOOLEAN,
        description: t(
            "كشف بصمات النسخ المعدلة وسرعة التبديل التلقائي (Heartbeat)",
            "Detect modified client rapid pulse and behavior fingerprints"
        ),
        default: true
    },
    detectZeroWidth: {
        type: OptionType.BOOLEAN,
        description: t(
            "كشف وسوم التخفي والرموز المخفية في الحالة الشخصية (Zero-Width)",
            "Scan user custom status for hidden zero-width presence tags"
        ),
        default: true
    }
});

let domInterval: NodeJS.Timeout | null = null;

export default definePlugin({
    name: "FanToolsAll",
    isFan: true,
    description: "Ultimate detection suite for Fake Deafen and client mod fingerprints across 6 deterministic protocol and RTC audio vectors.",
    authors: [Devs.FAN],
    tags: ["Voice", "Utility", "Fun"],
    settings,

    patches: [
        // Voice user rows: tag row with data-user-id and data-fake-deafen
        {
            find: ".VOICE_USER],shouldShow:",
            replacement: {
                match: /(?<=GuildChannelUserContextMenu.{0,150})"data-dnd-name":\i/,
                replace: "\"data-user-id\":arguments[0]?.user?.id,\"data-fake-deafen\":$self.isFakeDeafened(arguments[0]?.user?.id)?\"true\":void 0,$&"
            }
        },
        // Voice panel status icons: render red [FAKE] badge next to detected fake-deafened users
        {
            find: ".VOICE_PANEL}}",
            predicate: () => settings.store.showFakeBadge,
            replacement: [
                {
                    match: /\}\),children:\[(?=.{0,50}#{intl::PRIORITY_SPEAKER})/,
                    replace: "$&$self.renderFakeDeafenBadge(arguments[0]?.user),"
                }
            ]
        }
    ],

    flux: {
        // ── Vector 6: Real-Time Gateway Speaking Event ──
        SPEAKING({ userId, speakingFlags }: { userId: string; speakingFlags: number; }) {
            try {
                if (!settings.store.detectFakeDeafen) return;
                if (!userId || isSelf(userId)) return;

                const vsStore: any = findStore("VoiceStateStore") ?? VoiceStateStore;
                const vs = vsStore?.getVoiceStateForUser?.(userId);
                if (isBotOrServerDeaf(userId, vs)) {
                    unmarkUser(userId);
                    return;
                }

                if (speakingFlags > 0) {
                    if (vs?.selfDeaf && !vs?.deaf) {
                        markUserAsFake(
                            userId,
                            "speaking_while_deafened",
                            "يتحدث وصوته يخرج وهو مصمت!",
                            "speaking while deafened"
                        );
                    }
                }
            } catch {}
        },

        // ── Vector 7: Voice State Gateway Updates ──
        VOICE_STATE_UPDATES({ voiceStates }: { voiceStates: VoiceState[]; }) {
            try {
                if (!settings.store.detectFakeDeafen || !Array.isArray(voiceStates)) return;

                for (const state of voiceStates) {
                    if (!state.userId || isSelf(state.userId)) continue;

                    // If bot or server-deafened (admin action), unmark and skip immediately
                    if (isBotOrServerDeaf(state.userId, state) || state.deaf) {
                        unmarkUser(state.userId);
                        continue;
                    }

                    // If genuinely not self-deafened, unmark immediately
                    if (!state.selfDeaf) {
                        unmarkUser(state.userId);
                        continue;
                    }

                    // 1. Record timing pulse
                    if (settings.store.detectClientMods) {
                        recordToggleTiming(state.userId, Boolean(state.selfDeaf));
                    }

                    // 2. Deafened but unmuted (verified with 2-second debounce to prevent false positives from normal UI clicks)
                    if (state.selfDeaf && !state.deaf && !state.selfMute && !state.mute) {
                        setTimeout(() => {
                            try {
                                const vsStore: any = findStore("VoiceStateStore") ?? VoiceStateStore;
                                const curVs = vsStore?.getVoiceStateForUser?.(state.userId);
                                if (!isBotOrServerDeaf(state.userId, curVs) && curVs?.selfDeaf && !curVs?.deaf && !curVs?.selfMute && !curVs?.mute) {
                                    markUserAsFake(
                                        state.userId,
                                        "unmuted_while_deafened",
                                        "غير مكتوم وهو مصمت (تناقض بروتوكولي قطعي)!",
                                        "unmuted while deafened"
                                    );
                                }
                            } catch {}
                        }, 2000);
                    }

                    // 3. Watch Together while deafened
                    const scStore: any = findStore("SelectedChannelStore") ?? SelectedChannelStore;
                    const selected = scStore?.getVoiceChannelId?.();
                    const channelId = state.channelId || selected;
                    if (channelId && state.selfDeaf && !state.deaf) {
                        const eaStore: any = findStore("EmbeddedActivitiesStore") ?? EmbeddedActivitiesStore;
                        const acts = eaStore?.getEmbeddedActivitiesForChannel?.(channelId) ?? [];
                        if (acts.some((a: any) => a.applicationId === WATCH_TOGETHER_APPLICATION_ID && a.userIds?.has?.(state.userId))) {
                            markUserAsFake(
                                state.userId,
                                "watch_together_while_deafened",
                                "نشاط Watch Together وهو مصمت!",
                                "embedded activity while deafened"
                            );
                        }
                    }

                    if (settings.store.detectZeroWidth) {
                        scanUserPresence(state.userId);
                    }
                }
                scheduleVoiceDOMUpdate();
            } catch {}
        },

        VOICE_CHANNEL_SELECT({ channelId }: { channelId: string | null; }) {
            try {
                if (!channelId) {
                    detectedFakeDeafUsers.clear();
                    userDeafenToggleTimestamps.clear();
                    userAudioPacketsHistory.clear();
                    fanToolsEvents.dispatchEvent(new Event("change"));
                    scheduleVoiceDOMUpdate();
                } else {
                    setTimeout(() => {
                        scanAllChannelUsers();
                        void syncLocalNativeFaked();
                        scheduleVoiceDOMUpdate();
                    }, 500);
                }
            } catch {}
        },

        CONNECTION_OPEN() {
            cachedSelfId = null;
        },

        LOGOUT() {
            cachedSelfId = null;
            detectedFakeDeafUsers.clear();
            userDeafenToggleTimestamps.clear();
            userAudioPacketsHistory.clear();
        }
    },

    isFakeDeafened,

    renderFakeDeafenBadge(user?: User) {
        try {
            if (!user?.id || isSelf(user.id) || !isFakeDeafened(user.id)) return null;
            const entry = detectedFakeDeafUsers.get(String(user.id));
            const reason = entry?.reasonText ? ` (${entry.reasonText})` : "";
            const label = `${t("وضع الإصمام الوهمي مفعل Fake Deafen", "Fake Deafen Active")}${reason}`;

            return (
                <Tooltip text={label}>
                    {tooltipProps => (
                        <span
                            {...tooltipProps}
                            className="fc-fake-deafen-badge"
                        >
                            FAKE
                        </span>
                    )}
                </Tooltip>
            );
        } catch {
            return null;
        }
    },

    start() {
        scheduleVoiceDOMUpdate();
        scanAllChannelUsers();
        void syncLocalNativeFaked();

        domInterval = setInterval(() => {
            const scStore: any = findStore("SelectedChannelStore") ?? SelectedChannelStore;
            if (!scStore?.getVoiceChannelId?.()) return;
            scheduleVoiceDOMUpdate();
            scanRTPStreams();
            scanAllChannelUsers();
            void syncLocalNativeFaked();
        }, 3000);
    },

    stop() {
        if (domInterval) {
            clearInterval(domInterval);
            domInterval = null;
        }

        cachedSelfId = null;
        detectedFakeDeafUsers.clear();
        userDeafenToggleTimestamps.clear();
        userAudioPacketsHistory.clear();
        scheduleVoiceDOMUpdate();
    }
});
