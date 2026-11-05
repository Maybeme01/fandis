/*
 * VoiceLogger Plugin for FanCord
 * Native Discord Theme Integration, Interactive Profiles, Servers & Channels Navigation,
 * In-UI Settings, Target Notifications, Bilingual Support (Arabic & English), RTL/LTR Layouts
 * Located in: src/fanplugins/voiceLogger/index.tsx
 */

import { HeaderBarButton } from "@api/HeaderBar";
import { showNotification } from "@api/Notifications";
import { definePluginSettings, Settings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps, findStore } from "@webpack";
import { NavigationRouter, openUserProfileModal, React, RelationshipStore } from "@webpack/common";

interface LocaleStrings {
    panelTitle: string;
    tabLogs: string;
    tabSettings: string;
    searchPlaceholder: string;
    filterAll: string;
    filterJoin: string;
    filterLeave: string;
    noLogsTitle: string;
    noLogsSearch: string;
    noLogsEmpty: string;
    noLogsFriendsOnly: (count: number) => string;
    noLogsTargetOnly: string;
    noLogsPaused: string;
    joinText: string;
    leaveText: string;
    roomLabel: string;
    durationLabel: string;
    clearAllLogs: string;
    clearSuccess: string;
    resetPosTooltip: string;
    resetPosBtn: string;
    resetPosSuccess: string;
    pluginDesc: string;
    pausedBadge: string;
    closeTooltip: string;

    // Settings
    masterTitle: string;
    masterDesc: string;
    friendsTitle: string;
    friendsDesc: string;
    targetsTitle: string;
    targetsDesc: string;
    targetIdsLabel: string;
    targetIdsPlaceholder: string;
    targetNotifyTitle: string;
    targetNotifyDesc: string;
    serversTitle: string;
    serversDesc: string;
    serverIdsLabel: string;
    serverIdsPlaceholder: string;

    // Notifications
    notifyJoinTitle: string;
    notifyJoinBody: (user: string, channel: string, guild?: string) => string;
    notifyLeaveTitle: string;
    notifyLeaveBody: (user: string, channel: string, guild?: string, duration?: string) => string;

    // Duration
    lessThanSecond: string;
    hoursShort: string;
    minutesShort: string;
    secondsShort: string;
}

const LOCALES: { ar: LocaleStrings; en: LocaleStrings } = {
    ar: {
        panelTitle: "سجلات الرومات الصوتية",
        tabLogs: "السجلات المباشرة",
        tabSettings: "الفلاتر والإعدادات",
        searchPlaceholder: "🔍 بحث سريع بالاسم، المعرف، أو الروم...",
        filterAll: "الكل",
        filterJoin: "انضمام فقط 📥",
        filterLeave: "مغادرة فقط 📤",
        noLogsTitle: "لا توجد أي سجلات حالياً",
        noLogsSearch: "لا توجد نتائج مطابقة لبحثك",
        noLogsEmpty: "سيتم تسجيل دخول وخروج الأعضاء من الرومات هنا تلقائياً",
        noLogsFriendsOnly: (count) => `مراقبة الأصدقاء فقط مفعّلة (لديك ${count} صديق متعرف عليهم). بانتظار دخول أحدهم لروم صوتي...`,
        noLogsTargetOnly: "مراقبة أشخاص محددين بالـ ID مفعّلة. بانتظار نشاط منهم...",
        noLogsPaused: "مراقبة الرومات الصوتية متوقفة حالياً من الإعدادات",
        joinText: "انضمام",
        leaveText: "مغادرة",
        roomLabel: "الروم:",
        durationLabel: "مدة التواجد:",
        clearAllLogs: "مسح جميع السجلات",
        clearSuccess: "تم مسح جميع السجلات بنجاح",
        resetPosTooltip: "إعادة ضبط موضع النافذة إلى أعلى الشاشة",
        resetPosBtn: "إعادة ضبط موضع النافذة (Reset Position)",
        resetPosSuccess: "تمت إعادة ضبط موضع النافذة إلى أعلى الشاشة بنجاح",
        pluginDesc: "سجل متقدم للرومات الصوتية، مدمج كلياً بثيم ديسكورد، ينزل من الأعلى، مع إمكانية فتح البروفايلات والانتقال للسيرفرات والرومات وإشعارات فئات محددة.",
        pausedBadge: "متوقف ⏸",
        closeTooltip: "إغلاق النافذة",

        masterTitle: "🔘 تشغيل مراقبة الرومات الصوتية (Master Switch)",
        masterDesc: "المفتاح الرئيسي لتشغيل أو إيقاف تسجيل نشاط الرومات كلياً. عند الإطفاء لن يتم تسجيل أي حدث.",
        friendsTitle: "👥 مراقبة الأصدقاء فقط (Friends Only)",
        friendsDesc: "عند التفعيل، يتم تسجيل نشاط قائمة أصدقائك فقط في أي روم يدخلونه وتجاهل الغرباء.",
        targetsTitle: "🎯 مراقبة أشخاص محددين بالـ ID",
        targetsDesc: "حصر المراقبة بدقة على المعرفات المدخلة أدناه وتجاهل أي شخص آخر.",
        targetIdsLabel: "معرفات الأشخاص (User IDs):",
        targetIdsPlaceholder: "مثال: 774057223508492308, 153811173161068545",
        targetNotifyTitle: "🔔 إرسال إشعار ديسكورد عند دخول/خروج المستهدفين",
        targetNotifyDesc: "إظهار إشعار فوري على شاشة الديسكورد عند انضمام أو مغادرة أي شخص من المعرفات المحددة.",
        serversTitle: "🌐 حصر المراقبة بسيرفرات محددة (اختياري)",
        serversDesc: "الوضع الطبيعي (مغلق) يراقب في جميع السيرفرات تلقائياً. عند التفعيل فقط، يتم حصر التسجيل في معرفات السيرفرات المكتوبة أدناه.",
        serverIdsLabel: "معرفات السيرفرات المحددة (Server IDs):",
        serverIdsPlaceholder: "مثال: 123456789012345678, 987654321098765432",

        notifyJoinTitle: "📥 انضمام إلى الروم الصوتي",
        notifyJoinBody: (user, channel, guild) => `${user} انضم إلى [${channel}]${guild ? ` في سيرفر ${guild}` : ""}`,
        notifyLeaveTitle: "📤 مغادرة الروم الصوتي",
        notifyLeaveBody: (user, channel, guild, duration) => `${user} غادر [${channel}]${guild ? ` في سيرفر ${guild}` : ""}${duration ? ` (المدة: ${duration})` : ""}`,

        lessThanSecond: "أقل من ثانية",
        hoursShort: "س",
        minutesShort: "د",
        secondsShort: "ث"
    },
    en: {
        panelTitle: "Voice Channel Logs",
        tabLogs: "Live Logs",
        tabSettings: "Filters & Settings",
        searchPlaceholder: "🔍 Quick search by name, ID, or channel...",
        filterAll: "All",
        filterJoin: "Joins 📥",
        filterLeave: "Leaves 📤",
        noLogsTitle: "No voice logs available",
        noLogsSearch: "No matching results for your search",
        noLogsEmpty: "Members joining or leaving voice channels will be recorded here automatically",
        noLogsFriendsOnly: (count) => `Friends-only filter active (${count} friends detected). Waiting for friend voice activity...`,
        noLogsTargetOnly: "Target user IDs filter active. Waiting for voice activity from specified users...",
        noLogsPaused: "Voice monitoring is currently paused in settings",
        joinText: "Joined",
        leaveText: "Left",
        roomLabel: "Room:",
        durationLabel: "Duration:",
        clearAllLogs: "Clear All Logs",
        clearSuccess: "All logs have been cleared successfully",
        resetPosTooltip: "Reset panel position to top of window",
        resetPosBtn: "Reset Window Position",
        resetPosSuccess: "Window position has been reset to top successfully",
        pluginDesc: "Advanced voice room activity logger with profiles, server/channel navigation, target notifications, and bilingual Arabic/English support.",
        pausedBadge: "Paused ⏸",
        closeTooltip: "Close window",

        masterTitle: "🔘 Voice Logger Master Switch",
        masterDesc: "Master switch to enable or pause all voice activity monitoring.",
        friendsTitle: "👥 Monitor Friends Only",
        friendsDesc: "When enabled, only logs users on your friends list and ignores everyone else.",
        targetsTitle: "🎯 Monitor Specific User IDs",
        targetsDesc: "Restrict logging exclusively to the target user IDs entered below.",
        targetIdsLabel: "Target User IDs:",
        targetIdsPlaceholder: "e.g. 774057223508492308, 153811173161068545",
        targetNotifyTitle: "🔔 Discord Notification for Target Users",
        targetNotifyDesc: "Show a native Discord popup notification whenever a target user joins or leaves a voice channel.",
        serversTitle: "🌐 Restrict to Specific Servers (Optional)",
        serversDesc: "Default (OFF) tracks all servers. When enabled, only logs voice channels in the server IDs listed below.",
        serverIdsLabel: "Specific Server IDs:",
        serverIdsPlaceholder: "e.g. 123456789012345678, 987654321098765432",

        notifyJoinTitle: "📥 Voice Channel Join",
        notifyJoinBody: (user, channel, guild) => `${user} joined [${channel}]${guild ? ` in ${guild}` : ""}`,
        notifyLeaveTitle: "📤 Voice Channel Leave",
        notifyLeaveBody: (user, channel, guild, duration) => `${user} left [${channel}]${guild ? ` in ${guild}` : ""}${duration ? ` (Duration: ${duration})` : ""}`,

        lessThanSecond: "Less than a second",
        hoursShort: "h",
        minutesShort: "m",
        secondsShort: "s"
    }
};

function isArabic(): boolean {
    try {
        if (Settings.plugins?.ArabicUI?.enabled) return true;
        if (document.documentElement.lang?.toLowerCase().startsWith("ar")) return true;
        if (document.getElementById("vc-arabic-ui-font-style")) return true;
    } catch {}
    return false;
}

function getStrings(): LocaleStrings {
    return isArabic() ? LOCALES.ar : LOCALES.en;
}

export const settings = definePluginSettings({
    resetPosition: {
        type: OptionType.COMPONENT,
        description: isArabic() ? "إعادة تعيين مكان نافذة السجلات إلى الموضع الافتراضي (أعلى الشاشة)" : "Reset Voice Logger window position to default (top of window)",
        component: () => React.createElement("button", {
            onClick: () => {
                try {
                    localStorage.removeItem("fancord_vl_pos");
                } catch {}
                const panel = document.getElementById("fancord-voicelogs-panel");
                if (panel) {
                    panel.style.top = "56px";
                    panel.style.right = "24px";
                    panel.style.left = "auto";
                    panel.style.transform = "none";
                    const t = getStrings();
                    showNotification({
                        title: "VoiceLogger",
                        body: t.resetPosSuccess,
                        color: "#5865f2"
                    });
                }
            },
            style: {
                backgroundColor: "var(--brand-experiment, #5865f2)",
                color: "#ffffff",
                padding: "10px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
                transition: "background-color 0.2s ease"
            }
        }, getStrings().resetPosBtn)
    }
});

interface VoiceLog {
    id: string;
    type: "JOIN" | "LEAVE";
    userId: string;
    username: string;
    avatarUrl?: string;
    guildId?: string;
    guildName?: string;
    channelId?: string;
    channelName: string;
    timestamp: number;
    duration?: number;
}

interface FilterSettings {
    masterEnabled: boolean;
    trackOnlyFriends: boolean;
    enableTargetUsers: boolean;
    targetUserIds: string;
    notifyTargetUsers: boolean;
    filterSpecificServers: boolean;
    specificServerIds: string;
}

let activeFilters: FilterSettings = {
    masterEnabled: true,
    trackOnlyFriends: false,
    enableTargetUsers: false,
    targetUserIds: "",
    notifyTargetUsers: true,
    filterSpecificServers: false,
    specificServerIds: ""
};

let logs: VoiceLog[] = [];
let searchQuery = "";
let eventTypeFilter: "ALL" | "JOIN" | "LEAVE" = "ALL";
const activeSessions = new Map<string, { channelId: string; channelName: string; guildId: string; guildName: string; joinTime: number }>();
let isPanelOpen = false;
let currentTab: "logs" | "settings" = "logs";
let currentAppliedLang: "ar" | "en" | null = null;

let onWindowMouseMove: ((e: MouseEvent) => void) | null = null;
let onWindowMouseUp: (() => void) | null = null;

function loadFilters() {
    try {
        const savedV5 = localStorage.getItem("fancord_vl_filters_v5");
        if (savedV5) {
            activeFilters = { ...activeFilters, ...JSON.parse(savedV5) };
            return;
        }

        const savedV4 = localStorage.getItem("fancord_vl_filters_v4");
        if (savedV4) {
            const parsed = JSON.parse(savedV4);
            activeFilters.masterEnabled = parsed.masterEnabled ?? true;
            activeFilters.trackOnlyFriends = parsed.trackOnlyFriends ?? false;
            activeFilters.enableTargetUsers = parsed.enableTargetUsers ?? false;
            activeFilters.targetUserIds = parsed.targetUserIds ?? "";
            activeFilters.notifyTargetUsers = parsed.notifyTargetUsers ?? true;
            activeFilters.filterSpecificServers = Boolean(parsed.filterSpecificServers && parsed.specificServerIds);
            activeFilters.specificServerIds = parsed.specificServerIds ?? "";
            saveFilters();
        }
    } catch {}
}

function saveFilters() {
    try {
        localStorage.setItem("fancord_vl_filters_v5", JSON.stringify(activeFilters));
    } catch {}
}

function saveLogs() {
    try {
        localStorage.setItem("fancord_voice_logs_v5", JSON.stringify(logs.slice(-200)));
    } catch {}
}

function loadLogs() {
    try {
        const s = localStorage.getItem("fancord_voice_logs_v5") || localStorage.getItem("fancord_voice_logs_v4");
        if (s) logs = JSON.parse(s);
    } catch {}
}

function formatDuration(ms: number): string {
    const t = getStrings();
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}${t.hoursShort}`);
    if (minutes > 0) parts.push(`${minutes}${t.minutesShort}`);
    parts.push(`${seconds}${t.secondsShort}`);
    return parts.join(" ") || t.lessThanSecond;
}

function getFriendsListCount(): number {
    try {
        const relStore = (findStore("RelationshipStore") || RelationshipStore) as any;
        if (relStore) {
            const friendIds = relStore.getFriendIDs?.();
            if (Array.isArray(friendIds)) return friendIds.length;
            if (typeof relStore.getFriendCount === "function") return relStore.getFriendCount();
            const relationships = relStore.getRelationships?.();
            if (relationships) {
                if (relationships instanceof Map) {
                    let count = 0;
                    for (const v of relationships.values()) if (v === 1) count++;
                    return count;
                } else if (typeof relationships === "object") {
                    return Object.values(relationships).filter(v => v === 1).length;
                }
            }
        }
    } catch {}
    return 0;
}

function checkIsFriend(userId: string): boolean {
    try {
        if (!userId) return false;
        const relStore = (findStore("RelationshipStore") || RelationshipStore) as any;
        if (relStore) {
            // 1. فحص الدالة المباشرة isFriend
            if (typeof relStore.isFriend === "function" && relStore.isFriend(userId)) return true;

            // 2. فحص نوع العلاقة getRelationshipType (1 = FRIEND)
            if (typeof relStore.getRelationshipType === "function" && relStore.getRelationshipType(userId) === 1) return true;

            // 3. فحص قائمة معرفات الأصدقاء getFriendIDs
            const friendIds = relStore.getFriendIDs?.();
            if (Array.isArray(friendIds) && friendIds.includes(userId)) return true;

            // 4. فحص خريطة العلاقات getRelationships
            const rels = relStore.getRelationships?.();
            if (rels) {
                if (rels instanceof Map && rels.get(userId) === 1) return true;
                if (typeof rels === "object" && rels[userId] === 1) return true;
            }

            // 5. فحص getMutableRelationships
            const mutableRels = relStore.getMutableRelationships?.();
            if (mutableRels) {
                if (mutableRels instanceof Map && mutableRels.get(userId) === 1) return true;
                if (typeof mutableRels === "object" && mutableRels[userId] === 1) return true;
            }
        }

        // فحص RelationshipStore الاحتياطي
        if (RelationshipStore && RelationshipStore !== relStore) {
            if (RelationshipStore.isFriend?.(userId)) return true;
            if (RelationshipStore.getRelationshipType?.(userId) === 1) return true;
            const ids = RelationshipStore.getFriendIDs?.();
            if (Array.isArray(ids) && ids.includes(userId)) return true;
        }
    } catch (e) {
        console.error("[VoiceLogger] checkIsFriend error:", e);
    }
    return false;
}

function isTargetUser(userId: string): boolean {
    if (!userId || !activeFilters.targetUserIds) return false;
    const targets = activeFilters.targetUserIds
        .split(/[, \n]+/)
        .map(id => id.trim())
        .filter(id => id.length > 0);
    return targets.includes(userId);
}

function shouldLogEvent(userId: string, guildId?: string): boolean {
    // 1. المفتاح العام للمراقبة
    if (!activeFilters.masterEnabled) {
        return false;
    }

    // 2. مراقبة أشخاص محددين بالـ ID فقط
    if (activeFilters.enableTargetUsers) {
        const targets = activeFilters.targetUserIds
            .split(/[, \n]+/)
            .map(id => id.trim())
            .filter(id => id.length > 0);
        if (targets.length === 0 || !targets.includes(userId)) {
            return false;
        }
    }

    // 3. مراقبة الأصدقاء فقط (Friends Only)
    if (activeFilters.trackOnlyFriends) {
        if (!checkIsFriend(userId)) {
            return false;
        }
    }

    // 4. حصر المراقبة في سيرفرات محددة فقط (اختياري)
    if (activeFilters.filterSpecificServers) {
        const allowedGuilds = activeFilters.specificServerIds
            .split(/[, \n]+/)
            .map(id => id.trim())
            .filter(id => id.length > 0);
        if (allowedGuilds.length === 0 || !guildId || !allowedGuilds.includes(guildId)) {
            return false;
        }
    }

    return true;
}

function injectStyles() {
    if (document.getElementById("fancord-voicelogs-styles")) return;

    const css = `
        /* النافذة الرئيسية - مدمجة كلياً بثيم الديسكورد وغير شفافة نهائياً */
        #fancord-voicelogs-panel {
            position: fixed;
            top: 56px;
            right: 24px;
            left: auto;
            width: 460px;
            max-width: 95vw;
            height: 650px;
            max-height: 84vh;
            background-color: var(--background-secondary, #2b2d31) !important;
            background: var(--bg-overlay-floating, var(--background-floating, var(--background-secondary, #2b2d31))) !important;
            border: 1px solid var(--border-subtle, var(--background-modifier-accent, rgba(255, 255, 255, 0.12)));
            border-radius: 12px;
            z-index: 10001;
            display: none;
            flex-direction: column;
            box-shadow: var(--elevation-high, 0 12px 32px rgba(0, 0, 0, 0.55));
            color: var(--text-normal, #dbdee1);
            font-family: var(--font-primary, "gg sans", "Noto Sans", Arial, sans-serif);
            overflow: hidden;
            user-select: none;
            opacity: 1 !important;
        }

        #fancord-voicelogs-panel.fcvl-rtl {
            direction: rtl;
            text-align: right;
        }
        #fancord-voicelogs-panel.fcvl-ltr {
            direction: ltr;
            text-align: left;
        }

        /* انيميشن النزول السلس من الأعلى */
        @keyframes fancordDropdownAnim {
            0% {
                opacity: 0;
                transform: translateY(-24px) scale(0.97);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .fancord-dropdown-open {
            animation: fancordDropdownAnim 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* شريط العنوان والسحب */
        .fcvl-header {
            padding: 14px 18px;
            background-color: var(--background-secondary-alt, #1e1f22);
            border-bottom: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: grab;
            user-select: none;
        }
        .fcvl-header:active {
            cursor: grabbing;
        }
        .fcvl-title-box {
            display: flex;
            align-items: center;
            gap: 10px;
            pointer-events: none;
        }
        .fcvl-title-box h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 800;
            color: var(--header-primary, #ffffff);
            letter-spacing: -0.2px;
        }
        .fcvl-badge {
            background-color: var(--brand-experiment, #5865f2);
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 12px;
            font-family: monospace;
            transition: background-color 0.2s ease;
        }
        .fcvl-badge.paused {
            background-color: var(--text-muted, #72767d);
        }
        .fcvl-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .fcvl-btn-icon {
            background: transparent;
            border: none;
            color: var(--interactive-normal, #b5bac1);
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
        }
        .fcvl-btn-icon:hover {
            color: var(--interactive-hover, #ffffff);
            background: var(--background-modifier-hover, rgba(255, 255, 255, 0.08));
        }
        .fcvl-btn-icon.close:hover {
            color: #ffffff;
            background: var(--button-danger-background, #da373c);
        }

        /* شريط التبويبات المدمجة داخل الواجهة */
        .fcvl-tabs {
            display: flex;
            background-color: var(--background-secondary-alt, #18191c);
            border-bottom: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
        }
        .fcvl-tab-btn {
            flex: 1;
            padding: 12px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--interactive-normal, #b5bac1);
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        .fcvl-tab-btn:hover {
            color: var(--interactive-hover, #ffffff);
            background: var(--background-modifier-hover, rgba(255, 255, 255, 0.04));
        }
        .fcvl-tab-btn.active {
            color: var(--header-primary, #ffffff);
            border-bottom-color: var(--brand-experiment, #5865f2);
            background: var(--background-modifier-selected, rgba(255, 255, 255, 0.06));
        }

        /* محتوى السجلات - خلفية مصمتة وواضحة جداً */
        .fcvl-body {
            padding: 14px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background-color: var(--background-primary, #313338) !important;
            user-select: text;
        }
        .fcvl-body::-webkit-scrollbar { width: 8px; }
        .fcvl-body::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-auto-thumb, rgba(255, 255, 255, 0.2));
            border-radius: 4px;
        }
        .fcvl-body::-webkit-scrollbar-track {
            background-color: var(--scrollbar-auto-track, transparent);
        }

        /* شريط البحث المباشر والفلاتر السريعة */
        .fcvl-search-bar {
            position: sticky;
            top: 0;
            z-index: 2;
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 4px;
            background-color: var(--background-primary, #313338);
            padding-bottom: 4px;
        }
        .fcvl-search-input {
            width: 100%;
            background-color: var(--background-secondary, #2b2d31);
            color: var(--text-normal, #dbdee1);
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 13px;
            box-sizing: border-box;
            transition: border-color 0.2s ease;
        }
        .fcvl-search-input:focus {
            outline: none;
            border-color: var(--brand-experiment, #5865f2);
        }
        .fcvl-quick-filters {
            display: flex;
            gap: 6px;
        }
        .fcvl-filter-pill {
            padding: 4px 10px;
            border-radius: 14px;
            font-size: 11px;
            font-weight: 700;
            background-color: var(--background-secondary, #2b2d31);
            color: var(--interactive-normal, #b5bac1);
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .fcvl-filter-pill:hover {
            color: #ffffff;
            background-color: var(--background-modifier-hover, rgba(255, 255, 255, 0.1));
        }
        .fcvl-filter-pill.active {
            background-color: var(--brand-experiment, #5865f2);
            color: #ffffff;
            border-color: transparent;
        }

        /* بطاقة السجل الواحدة - تفاعلية وعالية التباين */
        .fcvl-card {
            background-color: var(--background-secondary, #2b2d31) !important;
            border: 1px solid var(--border-subtle, var(--background-modifier-accent, rgba(255, 255, 255, 0.1)));
            border-radius: 8px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            position: relative;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
            transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .fcvl-card:hover {
            border-color: var(--brand-experiment, #5865f2);
            transform: translateY(-1px);
        }
        .fcvl-indicator-bar {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 4px;
        }
        .fcvl-rtl .fcvl-indicator-bar {
            right: 0;
            left: auto;
            border-radius: 0 8px 8px 0;
        }
        .fcvl-ltr .fcvl-indicator-bar {
            left: 0;
            right: auto;
            border-radius: 8px 0 0 8px;
        }

        .fcvl-card-join .fcvl-indicator-bar {
            background-color: var(--status-positive, #23a55a);
        }
        .fcvl-card-leave .fcvl-indicator-bar {
            background-color: var(--status-danger, #f23f43);
        }

        /* تفاصيل المستخدم والوقت */
        .fcvl-card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .fcvl-user-box {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            cursor: pointer;
        }
        .fcvl-avatar {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.12));
            transition: transform 0.15s ease;
            flex-shrink: 0;
        }
        .fcvl-user-box:hover .fcvl-avatar {
            transform: scale(1.15);
        }
        .fcvl-username {
            font-size: 15px;
            font-weight: 800;
            color: var(--header-primary, #ffffff);
            transition: color 0.15s ease;
        }
        .fcvl-user-box:hover .fcvl-username {
            color: var(--text-link, #00a8fc);
            text-decoration: underline;
        }
        .fcvl-userid-badge {
            font-size: 11px;
            color: var(--text-muted, #949ba4);
            background: var(--background-tertiary, #1e1f22);
            padding: 2px 8px;
            border-radius: 10px;
            font-family: Consolas, monospace;
            border: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
        }
        .fcvl-time {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted, #949ba4);
        }

        /* تفاصيل الروم والسيرفر */
        .fcvl-room-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--text-normal, #dbdee1);
            flex-wrap: wrap;
        }
        .fcvl-status-pill {
            font-size: 11px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .fcvl-card-join .fcvl-status-pill {
            background: rgba(35, 165, 90, 0.18);
            color: var(--status-positive, #23a55a);
            border: 1px solid rgba(35, 165, 90, 0.35);
        }
        .fcvl-card-leave .fcvl-status-pill {
            background: rgba(242, 63, 67, 0.18);
            color: var(--status-danger, #f23f43);
            border: 1px solid rgba(242, 63, 67, 0.35);
        }
        
        .fcvl-channel-btn {
            font-weight: 800;
            color: var(--header-primary, #ffffff);
            background: var(--background-modifier-accent, rgba(255, 255, 255, 0.1));
            padding: 3px 8px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .fcvl-channel-btn:hover {
            background-color: var(--brand-experiment, #5865f2);
            color: #ffffff;
            transform: scale(1.02);
            box-shadow: 0 0 8px rgba(88, 101, 242, 0.4);
        }

        .fcvl-guild-btn {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted, #949ba4);
            background: var(--background-tertiary, #1e1f22);
            padding: 3px 8px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
        }
        .fcvl-guild-btn:hover {
            background-color: var(--background-modifier-hover, rgba(255, 255, 255, 0.15));
            color: var(--header-primary, #ffffff);
            border-color: var(--brand-experiment, #5865f2);
            transform: scale(1.03);
        }

        /* مدة الجلوس */
        .fcvl-duration-tag {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-normal, #dbdee1);
            background: var(--background-tertiary, #1e1f22);
            padding: 4px 10px;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
            align-self: flex-start;
        }

        /* لوحة الإعدادات المدمجة بالواجهة */
        .fcvl-settings-view {
            padding: 18px;
            overflow-y: auto;
            flex: 1;
            display: none;
            flex-direction: column;
            gap: 16px;
            background-color: var(--background-primary, #313338) !important;
        }

        .fcvl-setting-card {
            background-color: var(--background-secondary, #2b2d31);
            border: 1px solid var(--border-subtle, var(--background-modifier-accent, rgba(255, 255, 255, 0.08)));
            border-radius: 8px;
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .fcvl-setting-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .fcvl-setting-info {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .fcvl-setting-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--header-primary, #ffffff);
        }
        .fcvl-setting-desc {
            font-size: 12px;
            color: var(--text-muted, #949ba4);
            line-height: 1.4;
        }

        /* سويتش التبديل */
        .fcvl-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
            flex-shrink: 0;
        }
        .fcvl-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .fcvl-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--background-secondary-alt, #4e5058);
            transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 24px;
        }
        .fcvl-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: #ffffff;
            transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
        }
        .fcvl-switch input:checked + .fcvl-slider {
            background-color: var(--brand-experiment, #5865f2);
        }
        .fcvl-switch input:checked + .fcvl-slider:before {
            transform: translateX(20px);
        }

        /* حقول الإدخال */
        .fcvl-input-box {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 4px;
        }
        .fcvl-input-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--header-secondary, #b5bac1);
        }
        .fcvl-input-text {
            background-color: var(--input-background, #1e1f22);
            color: var(--text-normal, #dbdee1);
            border: 1px solid var(--input-border, rgba(0, 0, 0, 0.3));
            border-radius: 6px;
            padding: 10px 12px;
            font-size: 13px;
            direction: ltr;
            text-align: left;
            font-family: Consolas, monospace;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .fcvl-input-text:focus {
            outline: none;
            border-color: var(--brand-experiment, #5865f2);
            box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.25);
        }
        .fcvl-input-text:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        /* شريط التذييل */
        .fcvl-footer {
            padding: 12px 16px;
            background-color: var(--background-secondary, #1e1f22);
            border-top: 1px solid var(--background-modifier-accent, rgba(255, 255, 255, 0.08));
            display: flex;
            gap: 10px;
        }
        .fcvl-clear-btn {
            flex: 1;
            background-color: var(--button-danger-background, #da373c);
            color: #ffffff;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            transition: background-color 0.15s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .fcvl-clear-btn:hover {
            background-color: var(--button-danger-background-hover, #c73237);
        }
    `;

    const styleEl = document.createElement("style");
    styleEl.id = "fancord-voicelogs-styles";
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
}

function setupNativePanel(forceRebuild = false) {
    if (typeof document === "undefined") return;

    const existingPanel = document.getElementById("fancord-voicelogs-panel");
    const activeLang = isArabic() ? "ar" : "en";

    if (existingPanel && !forceRebuild && currentAppliedLang === activeLang) {
        return;
    }

    if (existingPanel) {
        existingPanel.remove();
    }

    injectStyles();

    const t = getStrings();
    currentAppliedLang = activeLang;

    const panel = document.createElement("div");
    panel.id = "fancord-voicelogs-panel";
    panel.className = activeLang === "ar" ? "fcvl-rtl" : "fcvl-ltr";

    let savedTop = "56px";
    let savedRight = "24px";
    let savedLeft = "auto";
    try {
        const savedPos = localStorage.getItem("fancord_vl_pos");
        if (savedPos) {
            const parsed = JSON.parse(savedPos);
            if (parsed.top && (parsed.left || parsed.right)) {
                savedTop = parsed.top;
                savedLeft = parsed.left || "auto";
                savedRight = parsed.right || "auto";
            }
        }
    } catch {}

    panel.style.top = savedTop;
    panel.style.right = savedRight;
    panel.style.left = savedLeft;

    panel.innerHTML = `
        <div class="fcvl-header" id="fcvl-drag-handle">
            <div class="fcvl-title-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--brand-experiment, #5865f2);"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                <h3>${t.panelTitle}</h3>
                <span class="fcvl-badge ${activeFilters.masterEnabled ? '' : 'paused'}" id="fcvl-count-badge">
                    ${activeFilters.masterEnabled ? logs.length : t.pausedBadge}
                </span>
            </div>
            <div class="fcvl-actions">
                <button class="fcvl-btn-icon close" id="fcvl-close-btn" title="${t.closeTooltip}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>

        <div class="fcvl-tabs">
            <button class="fcvl-tab-btn ${currentTab === 'logs' ? 'active' : ''}" id="fcvl-tab-logs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                ${t.tabLogs}
            </button>
            <button class="fcvl-tab-btn ${currentTab === 'settings' ? 'active' : ''}" id="fcvl-tab-settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                ${t.tabSettings}
            </button>
        </div>

        <!-- قسم عرض السجلات -->
        <div class="fcvl-body" id="fcvl-logs-view" style="display: ${currentTab === 'logs' ? 'flex' : 'none'};">
            <div class="fcvl-search-bar">
                <input type="text" class="fcvl-search-input" id="fcvl-search-input" placeholder="${t.searchPlaceholder}" value="${searchQuery}">
                <div class="fcvl-quick-filters">
                    <button class="fcvl-filter-pill ${eventTypeFilter === 'ALL' ? 'active' : ''}" data-filter-type="ALL">${t.filterAll}</button>
                    <button class="fcvl-filter-pill ${eventTypeFilter === 'JOIN' ? 'active' : ''}" data-filter-type="JOIN">${t.filterJoin}</button>
                    <button class="fcvl-filter-pill ${eventTypeFilter === 'LEAVE' ? 'active' : ''}" data-filter-type="LEAVE">${t.filterLeave}</button>
                </div>
            </div>
            <div id="fcvl-cards-container" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>

        <!-- قسم الإعدادات المدمج داخل الواجهة -->
        <div class="fcvl-settings-view" id="fcvl-settings-view" style="display: ${currentTab === 'settings' ? 'flex' : 'none'};">
            <!-- 0. المفتاح الرئيسي للتشغيل والإيقاف -->
            <div class="fcvl-setting-card" style="border-right: 3px solid var(--brand-experiment, #5865f2);">
                <div class="fcvl-setting-header">
                    <div class="fcvl-setting-info">
                        <span class="fcvl-setting-title" style="color:var(--brand-experiment, #5865f2);">${t.masterTitle}</span>
                        <span class="fcvl-setting-desc">${t.masterDesc}</span>
                    </div>
                    <label class="fcvl-switch">
                        <input type="checkbox" id="fcvl-opt-master" ${activeFilters.masterEnabled ? 'checked' : ''}>
                        <span class="fcvl-slider"></span>
                    </label>
                </div>
            </div>

            <!-- 1. مراقبة الأصدقاء فقط أو الكل -->
            <div class="fcvl-setting-card">
                <div class="fcvl-setting-header">
                    <div class="fcvl-setting-info">
                        <span class="fcvl-setting-title">${t.friendsTitle}</span>
                        <span class="fcvl-setting-desc">${t.friendsDesc}</span>
                    </div>
                    <label class="fcvl-switch">
                        <input type="checkbox" id="fcvl-opt-friends-only" ${activeFilters.trackOnlyFriends ? 'checked' : ''}>
                        <span class="fcvl-slider"></span>
                    </label>
                </div>
            </div>

            <!-- 2. مراقبة أيدي شخص معين -->
            <div class="fcvl-setting-card">
                <div class="fcvl-setting-header">
                    <div class="fcvl-setting-info">
                        <span class="fcvl-setting-title">${t.targetsTitle}</span>
                        <span class="fcvl-setting-desc">${t.targetsDesc}</span>
                    </div>
                    <label class="fcvl-switch">
                        <input type="checkbox" id="fcvl-opt-enable-target" ${activeFilters.enableTargetUsers ? 'checked' : ''}>
                        <span class="fcvl-slider"></span>
                    </label>
                </div>
                <div class="fcvl-input-box">
                    <label class="fcvl-input-label">${t.targetIdsLabel}</label>
                    <input type="text" class="fcvl-input-text" id="fcvl-opt-target-ids" 
                           value="${activeFilters.targetUserIds}" 
                           placeholder="${t.targetIdsPlaceholder}">
                </div>
            </div>

            <!-- 3. إشعار ديسكورد عند دخول/خروج المستهدفين -->
            <div class="fcvl-setting-card">
                <div class="fcvl-setting-header">
                    <div class="fcvl-setting-info">
                        <span class="fcvl-setting-title">${t.targetNotifyTitle}</span>
                        <span class="fcvl-setting-desc">${t.targetNotifyDesc}</span>
                    </div>
                    <label class="fcvl-switch">
                        <input type="checkbox" id="fcvl-opt-notify-targets" ${activeFilters.notifyTargetUsers ? 'checked' : ''}>
                        <span class="fcvl-slider"></span>
                    </label>
                </div>
            </div>

            <!-- 4. حصر المراقبة في سيرفرات محددة (اختياري) -->
            <div class="fcvl-setting-card">
                <div class="fcvl-setting-header">
                    <div class="fcvl-setting-info">
                        <span class="fcvl-setting-title">${t.serversTitle}</span>
                        <span class="fcvl-setting-desc">${t.serversDesc}</span>
                    </div>
                    <label class="fcvl-switch">
                        <input type="checkbox" id="fcvl-opt-filter-servers" ${activeFilters.filterSpecificServers ? 'checked' : ''}>
                        <span class="fcvl-slider"></span>
                    </label>
                </div>
                <div class="fcvl-input-box">
                    <label class="fcvl-input-label">${t.serverIdsLabel}</label>
                    <input type="text" class="fcvl-input-text" id="fcvl-opt-server-ids" 
                           value="${activeFilters.specificServerIds}" 
                           placeholder="${t.serverIdsPlaceholder}" 
                           ${activeFilters.filterSpecificServers ? '' : 'disabled'}>
                </div>
            </div>
        </div>

        <div class="fcvl-footer">
            <button class="fcvl-clear-btn" id="fcvl-clear-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                ${t.clearAllLogs}
            </button>
        </div>
    `;

    document.body.appendChild(panel);

    // سحب النافذة بسلاسة
    const dragHandle = document.getElementById("fcvl-drag-handle");
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    dragHandle?.addEventListener("mousedown", (e) => {
        if ((e.target as HTMLElement).closest(".fcvl-actions")) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = panel.getBoundingClientRect();
        panel.style.transform = "none";
        panel.style.left = `${rect.left}px`;
        panel.style.top = `${rect.top}px`;
        panel.style.right = "auto";
        initialLeft = rect.left;
        initialTop = rect.top;
    });

    onWindowMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newLeft = `${initialLeft + dx}px`;
        const newTop = `${initialTop + dy}px`;
        panel.style.left = newLeft;
        panel.style.top = newTop;
        panel.style.right = "auto";
        try {
            localStorage.setItem("fancord_vl_pos", JSON.stringify({ top: newTop, left: newLeft }));
        } catch {}
    };

    onWindowMouseUp = () => {
        isDragging = false;
    };

    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);

    // زر الإغلاق
    document.getElementById("fcvl-close-btn")?.addEventListener("click", () => {
        toggleLogsPanel(false);
    });

    // التنقل بين التبويبات
    const tabLogs = document.getElementById("fcvl-tab-logs");
    const tabSettings = document.getElementById("fcvl-tab-settings");
    const logsView = document.getElementById("fcvl-logs-view");
    const settingsView = document.getElementById("fcvl-settings-view");

    tabLogs?.addEventListener("click", () => {
        currentTab = "logs";
        tabLogs.classList.add("active");
        tabSettings?.classList.remove("active");
        if (logsView) logsView.style.display = "flex";
        if (settingsView) settingsView.style.display = "none";
        renderLogs();
    });

    tabSettings?.addEventListener("click", () => {
        currentTab = "settings";
        tabSettings.classList.add("active");
        tabLogs?.classList.remove("active");
        if (logsView) logsView.style.display = "none";
        if (settingsView) settingsView.style.display = "flex";
    });

    // البحث السريع
    const searchInput = document.getElementById("fcvl-search-input") as HTMLInputElement;
    searchInput?.addEventListener("input", () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        renderLogs();
    });

    // فلاتر نوع الحدث
    const filterPills = panel.querySelectorAll(".fcvl-filter-pill");
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            eventTypeFilter = (pill.getAttribute("data-filter-type") || "ALL") as any;
            renderLogs();
        });
    });

    // تفاعل الضغط على البطاقات (البروفايل، السيرفر، الروم)
    const cardsContainer = document.getElementById("fcvl-cards-container");
    cardsContainer?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;

        // 1. فتح البروفايل
        const userEl = target.closest("[data-click-user]") as HTMLElement;
        if (userEl) {
            const userId = userEl.getAttribute("data-click-user");
            const guildId = userEl.getAttribute("data-guild-id");
            const channelId = userEl.getAttribute("data-channel-id");
            if (userId) {
                try {
                    openUserProfileModal({
                        userId,
                        guildId: guildId || undefined,
                        channelId: channelId || undefined,
                        sourceAnalyticsLocations: ["user profile popout", "VoiceLogger"]
                    });
                } catch {
                    const UserProfileModals = findByProps("openUserProfileModal") as any;
                    UserProfileModals?.openUserProfileModal?.({ userId, guildId, channelId });
                }
            }
            return;
        }

        // 2. الانتقال إلى السيرفر
        const guildEl = target.closest("[data-click-guild]") as HTMLElement;
        if (guildEl) {
            const guildId = guildEl.getAttribute("data-click-guild");
            if (guildId) {
                try {
                    NavigationRouter.transitionTo(`/channels/${guildId}`);
                } catch {
                    const ChannelRouter = findByProps("transitionToGuildSync") as any;
                    ChannelRouter?.transitionToGuildSync?.(guildId);
                }
            }
            return;
        }

        // 3. الانتقال ودخول الروم الصوتي
        const channelEl = target.closest("[data-click-channel]") as HTMLElement;
        if (channelEl) {
            const channelId = channelEl.getAttribute("data-click-channel");
            const guildId = channelEl.getAttribute("data-guild-id");
            if (channelId) {
                try {
                    const path = guildId ? `/channels/${guildId}/${channelId}` : `/channels/@me/${channelId}`;
                    NavigationRouter.transitionTo(path);
                    const ChannelActions = findByProps("selectVoiceChannel") as any;
                    ChannelActions?.selectVoiceChannel?.(channelId);
                } catch (err) {
                    console.error("Failed to navigate to channel:", err);
                }
            }
            return;
        }
    });

    // زر مسح السجلات
    document.getElementById("fcvl-clear-btn")?.addEventListener("click", () => {
        logs = [];
        saveLogs();
        renderLogs();
        const tr = getStrings();
        showNotification({
            title: "VoiceLogger",
            body: tr.clearSuccess,
            color: "#da373c"
        });
    });

    // تحديث وحفظ الإعدادات
    const optMaster = document.getElementById("fcvl-opt-master") as HTMLInputElement;
    const optFriendsOnly = document.getElementById("fcvl-opt-friends-only") as HTMLInputElement;
    const optEnableTarget = document.getElementById("fcvl-opt-enable-target") as HTMLInputElement;
    const optTargetIds = document.getElementById("fcvl-opt-target-ids") as HTMLInputElement;
    const optNotifyTargets = document.getElementById("fcvl-opt-notify-targets") as HTMLInputElement;
    const optFilterServers = document.getElementById("fcvl-opt-filter-servers") as HTMLInputElement;
    const optServerIds = document.getElementById("fcvl-opt-server-ids") as HTMLInputElement;

    const handleFilterChange = () => {
        activeFilters.masterEnabled = optMaster.checked;
        activeFilters.trackOnlyFriends = optFriendsOnly.checked;
        activeFilters.enableTargetUsers = optEnableTarget.checked;
        activeFilters.targetUserIds = optTargetIds.value;
        activeFilters.notifyTargetUsers = optNotifyTargets.checked;
        activeFilters.filterSpecificServers = optFilterServers.checked;
        activeFilters.specificServerIds = optServerIds.value;

        optServerIds.disabled = !activeFilters.filterSpecificServers;

        const countBadge = document.getElementById("fcvl-count-badge");
        if (countBadge) {
            const tr = getStrings();
            countBadge.textContent = activeFilters.masterEnabled ? logs.length.toString() : tr.pausedBadge;
            if (!activeFilters.masterEnabled) {
                countBadge.classList.add("paused");
            } else {
                countBadge.classList.remove("paused");
            }
        }

        saveFilters();
    };

    optMaster?.addEventListener("change", handleFilterChange);
    optFriendsOnly?.addEventListener("change", handleFilterChange);
    optEnableTarget?.addEventListener("change", handleFilterChange);
    optTargetIds?.addEventListener("input", handleFilterChange);
    optNotifyTargets?.addEventListener("change", handleFilterChange);
    optFilterServers?.addEventListener("change", handleFilterChange);
    optServerIds?.addEventListener("input", handleFilterChange);
}

function toggleLogsPanel(forceState?: boolean) {
    // التحقق من اللغة الحالية إذا تغيرت يتم إعادة بناء عناصر الواجهة فوراً
    setupNativePanel(isArabic() ? currentAppliedLang !== "ar" : currentAppliedLang !== "en");

    const panel = document.getElementById("fancord-voicelogs-panel");
    if (!panel) return;

    if (forceState !== undefined) {
        isPanelOpen = forceState;
    } else {
        isPanelOpen = !isPanelOpen;
    }

    if (isPanelOpen) {
        panel.style.display = "flex";
        panel.classList.remove("fancord-dropdown-open");
        void panel.offsetWidth;
        panel.classList.add("fancord-dropdown-open");

        if (currentTab === "logs") {
            renderLogs();
        }
    } else {
        panel.style.display = "none";
    }
}

function renderLogs() {
    const t = getStrings();
    const container = document.getElementById("fcvl-cards-container");
    const countBadge = document.getElementById("fcvl-count-badge");
    if (countBadge) {
        countBadge.textContent = activeFilters.masterEnabled ? logs.length.toString() : t.pausedBadge;
        if (!activeFilters.masterEnabled) {
            countBadge.classList.add("paused");
        } else {
            countBadge.classList.remove("paused");
        }
    }

    if (!container || currentTab !== "logs") return;

    const filteredLogs = logs.filter(log => {
        if (eventTypeFilter !== "ALL" && log.type !== eventTypeFilter) {
            return false;
        }

        if (searchQuery) {
            const matchesUser = log.username.toLowerCase().includes(searchQuery);
            const matchesId = log.userId.includes(searchQuery);
            const matchesChannel = log.channelName.toLowerCase().includes(searchQuery);
            const matchesGuild = log.guildName ? log.guildName.toLowerCase().includes(searchQuery) : false;
            return matchesUser || matchesId || matchesChannel || matchesGuild;
        }
        return true;
    });

    if (filteredLogs.length === 0) {
        const friendCount = getFriendsListCount();
        let emptySubtitle = t.noLogsEmpty;
        if (!activeFilters.masterEnabled) {
            emptySubtitle = t.noLogsPaused;
        } else if (activeFilters.trackOnlyFriends) {
            emptySubtitle = t.noLogsFriendsOnly(friendCount);
        } else if (activeFilters.enableTargetUsers) {
            emptySubtitle = t.noLogsTargetOnly;
        }

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 10px; color:var(--text-muted, #949ba4); gap:12px; text-align:center;">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <span style="font-size:15px; font-weight:700;">${searchQuery ? t.noLogsSearch : t.noLogsTitle}</span>
                <span style="font-size:12px; line-height:1.5;">${searchQuery ? (isArabic() ? "جرّب البحث بكلمة أو رقم مختلف" : "Try searching with a different term or ID") : emptySubtitle}</span>
            </div>
        `;
        return;
    }

    const isAr = isArabic();
    container.innerHTML = filteredLogs.slice().reverse().map(log => {
        const timeStr = new Date(log.timestamp).toLocaleTimeString(isAr ? "ar-SA" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        const isJoin = log.type === "JOIN";
        const avatar = log.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png";

        return `
            <div class="fcvl-card ${isJoin ? "fcvl-card-join" : "fcvl-card-leave"}">
                <div class="fcvl-indicator-bar"></div>
                
                <div class="fcvl-card-top">
                    <div class="fcvl-user-box" data-click-user="${log.userId}" data-guild-id="${log.guildId || ''}" data-channel-id="${log.channelId || ''}" title="${isAr ? 'اضغط لفتح الملف الشخصي للمستخدم' : 'Click to open user profile'}">
                        <img src="${avatar}" class="fcvl-avatar" alt="" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'" />
                        <span class="fcvl-username">${log.username}</span>
                        <span class="fcvl-userid-badge">${log.userId}</span>
                    </div>
                    <span class="fcvl-time"><bdi>${timeStr}</bdi></span>
                </div>

                <div class="fcvl-room-row">
                    <span class="fcvl-status-pill">
                        ${isJoin ? `
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                            ${t.joinText}
                        ` : `
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            ${t.leaveText}
                        `}
                    </span>
                    
                    <span class="fcvl-channel-btn" data-click-channel="${log.channelId || ''}" data-guild-id="${log.guildId || ''}" title="${isAr ? 'اضغط للانتقال ودخول الروم الصوتي' : 'Click to join voice room'}">
                        <span>${t.roomLabel}</span>
                        <strong>${log.channelName}</strong>
                        <span>🔊</span>
                    </span>

                    ${log.guildName && log.guildId ? `
                        <span class="fcvl-guild-btn" data-click-guild="${log.guildId}" title="${isAr ? 'اضغط للانتقال إلى السيرفر' : 'Click to go to server'}">
                            <span>🌐</span>
                            <span>${log.guildName}</span>
                        </span>
                    ` : ""}
                </div>

                ${!isJoin && log.duration !== undefined ? `
                    <div class="fcvl-duration-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--brand-experiment, #5865f2);"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>${t.durationLabel}</span>
                        <bdi style="font-weight:800; color:var(--header-primary, #ffffff);">${formatDuration(log.duration)}</bdi>
                    </div>
                ` : ""}
            </div>
        `;
    }).join("");
}

function LogsIcon(props: any) {
    return React.createElement("svg", {
        width: "22",
        height: "22",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props
    },
        React.createElement("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
        React.createElement("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" })
    );
}

function LogsHeaderButton() {
    const t = getStrings();
    return React.createElement(HeaderBarButton, {
        icon: LogsIcon,
        tooltip: t.panelTitle,
        selected: isPanelOpen,
        onClick: () => toggleLogsPanel()
    });
}

export default definePlugin({
    name: "VoiceLogger",
    description: "سجل متقدم للرومات الصوتية، مدمج كلياً بثيم ديسكورد، ينزل من الأعلى، مع إمكانية فتح البروفايلات وإشعارات المستخدمين المستهدفين ودعم اللغتين العربية والإنجليزية.",
    authors: [{ name: "FAN", id: 0n }],
    dependencies: ["HeaderBarAPI"],
    enabledByDefault: true,
    settings,

    headerBarButton: {
        icon: LogsIcon,
        render: () => React.createElement(LogsHeaderButton, null)
    },

    toolboxActions: {
        "VoiceLogger": () => toggleLogsPanel()
    },

    keyHandler: null as ((e: KeyboardEvent) => void) | null,

    flux: {
        VOICE_STATE_UPDATES(event: any) {
            if (!event.voiceStates) return;

            const UserStore = findStore("UserStore") as any;
            const ChannelStore = findStore("ChannelStore") as any;
            const GuildStore = findStore("GuildStore") as any;

            event.voiceStates.forEach((state: any) => {
                const { userId, channelId, guildId } = state;
                if (!userId) return;

                const willLog = shouldLogEvent(userId, guildId);
                const targetMatch = isTargetUser(userId);

                // إذا لم يكن الحدث مستحقاً للتسجيل ولا هو مستخدم مستهدف، نتجاهله
                if (!willLog && !targetMatch) return;

                const currentSession = activeSessions.get(userId);

                // انضمام إلى روم جديد أو انتقال بين الرومات
                if (channelId && (!currentSession || currentSession.channelId !== channelId)) {
                    const user = UserStore?.getUser(userId);
                    const relNickname = RelationshipStore?.getNickname?.(userId);
                    const username = user ? (user.globalName || user.username) : (relNickname || `مستخدم (${userId.slice(-4)})`);
                    const avatarUrl = user?.getAvatarURL ? user.getAvatarURL(guildId, 48, false) : undefined;
                    const channel = ChannelStore?.getChannel(channelId);
                    const channelName = channel ? channel.name : (isArabic() ? "روم صوتي" : "Voice Room");
                    const guild = GuildStore?.getGuild(guildId);
                    const guildName = guild ? guild.name : "";
                    const now = Date.now();

                    // إذا كان في روم سابق وانتقل: نسجل مغادرة من الروم السابق
                    if (currentSession && willLog) {
                        const duration = now - currentSession.joinTime;
                        logs.push({
                            id: Math.random().toString(),
                            type: "LEAVE",
                            userId,
                            username,
                            avatarUrl,
                            guildId: currentSession.guildId,
                            guildName: currentSession.guildName,
                            channelId: currentSession.channelId,
                            channelName: currentSession.channelName,
                            timestamp: now,
                            duration
                        });
                    }

                    // نسجل الانضمام الجديد
                    activeSessions.set(userId, {
                        channelId,
                        channelName,
                        guildId,
                        guildName,
                        joinTime: now
                    });

                    if (willLog) {
                        logs.push({
                            id: Math.random().toString(),
                            type: "JOIN",
                            userId,
                            username,
                            avatarUrl,
                            guildId,
                            guildName,
                            channelId,
                            channelName,
                            timestamp: now
                        });

                        saveLogs();
                        if (isPanelOpen && currentTab === "logs") renderLogs();
                    }

                    // إرسال إشعار ديسكورد فوري للشخص المستهدف بالـ ID
                    if (activeFilters.notifyTargetUsers && targetMatch) {
                        const tr = getStrings();
                        showNotification({
                            title: tr.notifyJoinTitle,
                            body: tr.notifyJoinBody(username, channelName, guildName),
                            icon: avatarUrl,
                            color: "#23a55a",
                            onClick: () => {
                                try {
                                    openUserProfileModal({
                                        userId,
                                        guildId: guildId || undefined,
                                        channelId: channelId || undefined,
                                        sourceAnalyticsLocations: ["VoiceLogger Notification"]
                                    });
                                } catch {}
                            }
                        });
                    }
                }
                // مغادرة الروم الصوتي بالكامل
                else if (!channelId && (currentSession || state.oldChannelId)) {
                    const user = UserStore?.getUser(userId);
                    const relNickname = RelationshipStore?.getNickname?.(userId);
                    const username = user ? (user.globalName || user.username) : (relNickname || `مستخدم (${userId.slice(-4)})`);
                    const gId = currentSession?.guildId || guildId;
                    const avatarUrl = user?.getAvatarURL ? user.getAvatarURL(gId, 48, false) : undefined;
                    const now = Date.now();
                    const duration = currentSession ? (now - currentSession.joinTime) : undefined;
                    const cId = currentSession?.channelId || state.oldChannelId;
                    const cName = currentSession?.channelName || (cId ? ChannelStore?.getChannel(cId)?.name : (isArabic() ? "روم صوتي" : "Voice Room"));
                    const gName = currentSession?.guildName || (gId ? GuildStore?.getGuild(gId)?.name : "");

                    if (willLog) {
                        logs.push({
                            id: Math.random().toString(),
                            type: "LEAVE",
                            userId,
                            username,
                            avatarUrl,
                            guildId: gId,
                            guildName: gName,
                            channelId: cId,
                            channelName: cName,
                            timestamp: now,
                            duration
                        });

                        saveLogs();
                        if (isPanelOpen && currentTab === "logs") renderLogs();
                    }

                    // إرسال إشعار ديسكورد فوري للشخص المستهدف عند المغادرة
                    if (activeFilters.notifyTargetUsers && targetMatch) {
                        const tr = getStrings();
                        const durStr = duration !== undefined ? formatDuration(duration) : undefined;
                        showNotification({
                            title: tr.notifyLeaveTitle,
                            body: tr.notifyLeaveBody(username, cName, gName, durStr),
                            icon: avatarUrl,
                            color: "#da373c",
                            onClick: () => {
                                try {
                                    openUserProfileModal({
                                        userId,
                                        guildId: gId || undefined,
                                        channelId: cId || undefined,
                                        sourceAnalyticsLocations: ["VoiceLogger Notification"]
                                    });
                                } catch {}
                            }
                        });
                    }

                    activeSessions.delete(userId);
                }
            });
        }
    },

    start() {
        loadFilters();
        loadLogs();
        setupNativePanel();

        this.keyHandler = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.altKey && (e.key === "v" || e.key === "V")) ||
                (e.ctrlKey && e.shiftKey && (e.key === "v" || e.key === "V"))) {
                e.preventDefault();
                toggleLogsPanel();
            }
        };
        window.addEventListener("keydown", this.keyHandler);
    },

    stop() {
        if (this.keyHandler) {
            window.removeEventListener("keydown", this.keyHandler);
            this.keyHandler = null;
        }
        if (onWindowMouseMove) {
            window.removeEventListener("mousemove", onWindowMouseMove);
            onWindowMouseMove = null;
        }
        if (onWindowMouseUp) {
            window.removeEventListener("mouseup", onWindowMouseUp);
            onWindowMouseUp = null;
        }
        document.getElementById("fancord-voicelogs-styles")?.remove();
        document.getElementById("fancord-voicelogs-panel")?.remove();
        isPanelOpen = false;
        currentAppliedLang = null;
    }
});
