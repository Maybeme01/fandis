import { openUserProfile } from "@utils/discord";
import { useAwaiter } from "@utils/react";
import { User } from "@vencord/discord-types";
import { useState } from "@webpack/common";
import type { ReactNode } from "react";

import {
    cdnAvatarUrl,
    cdnGuildIconUrl,
    getActivityFeed,
    getDistribution,
    getMessageTab,
    getVoiceTab,
    StalklyActivityEvent,
} from "./api";
import { asButton, formatDuration, formatEventType, formatRelativeTime, hideOnError } from "./utils";

const EVENT_LABELS: Record<string, string> = {
    VOICE_JOIN: "Joined voice",
    VOICE_LEAVE: "Left voice",
    VOICE_MOVE: "Moved voice channel",
    MIC_ON: "Unmuted",
    MIC_OFF: "Muted",
};

const EVENT_COLORS: Record<string, string> = {
    VOICE_JOIN: "vc-stalkly-evt-join",
    MIC_ON: "vc-stalkly-evt-join",
    STATUS_ONLINE: "vc-stalkly-evt-join",
    VOICE_LEAVE: "vc-stalkly-evt-leave",
    MIC_OFF: "vc-stalkly-evt-leave",
    STATUS_DND: "vc-stalkly-evt-leave",
    VOICE_MOVE: "vc-stalkly-evt-move",
    STATUS_IDLE: "vc-stalkly-evt-idle",
    STATUS_OFFLINE: "vc-stalkly-evt-default",
};

function eventMeta(type: string) {
    return {
        label: EVENT_LABELS[type] ?? formatEventType(type),
        className: EVENT_COLORS[type] ?? "vc-stalkly-evt-default",
    };
}

function Section({ title, extra, children }: { title: string; extra?: ReactNode; children: ReactNode; }) {
    return (
        <div className="vc-stalkly-section">
            <div className="vc-stalkly-section-header">
                <span className="vc-stalkly-section-title">{title}</span>
                {extra}
            </div>
            {children}
        </div>
    );
}

function SectionStatus({ pending, empty }: { pending: boolean; empty?: boolean; }) {
    return <span className="vc-stalkly-muted">{pending ? "Loading…" : (empty ? "No data yet" : "Unavailable")}</span>;
}

/** A titled list: its rows once loaded, otherwise loading / no data / unavailable. */
function ListSection<T>({ title, pending, failed, items, children }: {
    title: string; pending: boolean; failed: boolean; items: T[]; children: (item: T) => ReactNode;
}) {
    return (
        <Section title={title}>
            {pending || failed || items.length === 0
                ? <SectionStatus pending={pending} empty={!failed} />
                : <div className="vc-stalkly-table">{items.map(children)}</div>}
        </Section>
    );
}

function RowIcon({ src, name, round }: { src?: string; name: string; round?: boolean; }) {
    const cls = round ? "vc-stalkly-row-icon vc-stalkly-row-icon-round" : "vc-stalkly-row-icon";
    return src
        ? <img src={src} alt={name} className={cls} onError={hideOnError} />
        : <div className={`${cls} vc-stalkly-row-icon-fallback`}>{name.charAt(0)}</div>;
}

function RowText({ name, sub }: { name: string; sub: string; }) {
    return (
        <div className="vc-stalkly-row-info">
            <span className="vc-stalkly-row-name">{name}</span>
            <span className="vc-stalkly-row-sub">{sub}</span>
        </div>
    );
}

function ChannelRow({ channel, right }: {
    channel: { name: string; guild_id: string; guild_name: string; guild_icon?: string; }; right: ReactNode;
}) {
    return (
        <div className="vc-stalkly-table-row">
            <RowIcon src={cdnGuildIconUrl(channel.guild_id, channel.guild_icon)} name={channel.guild_name} />
            <RowText name={channel.name} sub={channel.guild_name} />
            <div className="vc-stalkly-row-stats">{right}</div>
        </div>
    );
}

function PersonRow({ userId, avatar, name, guildName, right }: {
    userId: string; avatar?: string; name: string; guildName: string; right: ReactNode;
}) {
    return (
        <div className="vc-stalkly-table-row vc-stalkly-table-row-clickable" {...asButton(() => openUserProfile(userId))}>
            <RowIcon src={cdnAvatarUrl(userId, avatar)} name={name} round />
            <RowText name={name} sub={guildName} />
            <div className="vc-stalkly-row-stats">{right}</div>
        </div>
    );
}

function ActivityChart({ msgs, voice, labels }: { msgs: number[]; voice: number[]; labels: string[]; }) {
    const width = 280;
    const height = 64;

    const toPoints = (series: number[]) => {
        const max = Math.max(1, ...series);
        const step = series.length > 1 ? width / (series.length - 1) : width;
        return series
            .map((v, i) => `${(i * step).toFixed(1)},${(height - (v / max) * height).toFixed(1)}`)
            .join(" ");
    };

    return (
        <div>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="vc-stalkly-chart-svg">
                <polyline points={toPoints(voice)} className="vc-stalkly-chart-line vc-stalkly-chart-line-voice" />
                <polyline points={toPoints(msgs)} className="vc-stalkly-chart-line vc-stalkly-chart-line-msgs" />
            </svg>
            <div className="vc-stalkly-chart-axis">
                <span>{labels[0]}</span>
                <span>{labels[Math.floor(labels.length / 2)]}</span>
                <span>{labels[labels.length - 1]}</span>
            </div>
        </div>
    );
}

const CHART_MODES = {
    hourly: { label: "Hourly", axis: ["00:00", "12:00", "23:00"] },
    weekly: { label: "Weekly", axis: ["Mon", "Thu", "Sun"] },
} as const;
type ChartMode = keyof typeof CHART_MODES;

function ActivityDistributionSection({ userId }: { userId: string; }) {
    const [mode, setMode] = useState<ChartMode>("hourly");
    const [dist, error, pending] = useAwaiter(() => getDistribution(userId), { deps: [userId], fallbackValue: null });

    if (pending || error || !dist) {
        return (
            <Section title="Activity Distribution">
                <SectionStatus pending={pending} />
            </Section>
        );
    }

    const toggle = (
        <div className="vc-stalkly-chart-toggle">
            {(Object.keys(CHART_MODES) as ChartMode[]).map(m => (
                <button
                    key={m}
                    className={m === mode ? "vc-stalkly-toggle-btn vc-stalkly-toggle-btn-active" : "vc-stalkly-toggle-btn"}
                    onClick={() => setMode(m)}
                >
                    {CHART_MODES[m].label}
                </button>
            ))}
        </div>
    );

    return (
        <Section title="Activity Distribution" extra={toggle}>
            <div className="vc-stalkly-chart-legend">
                <span className="vc-stalkly-legend-item"><span className="vc-stalkly-legend-dot vc-stalkly-legend-dot-msgs" />Messages</span>
                <span className="vc-stalkly-legend-item"><span className="vc-stalkly-legend-dot vc-stalkly-legend-dot-voice" />Voice</span>
            </div>
            <ActivityChart
                msgs={mode === "hourly" ? dist.msgs_hourly : dist.msgs_weekly}
                voice={mode === "hourly" ? dist.voice_hourly : dist.voice_weekly}
                labels={[...CHART_MODES[mode].axis]}
            />
        </Section>
    );
}

function VoiceSection({ userId }: { userId: string; }) {
    const [voice, error, pending] = useAwaiter(() => getVoiceTab(userId), { deps: [userId], fallbackValue: null });
    const failed = !pending && (!!error || !voice);

    return (
        <>
            <ListSection
                title="Voice — Top Channels"
                pending={pending}
                failed={failed}
                items={voice?.top_channels.filter(c => c.sessions > 0 || c.seconds > 0) ?? []}
            >
                {c => (
                    <ChannelRow
                        key={c.channel_id}
                        channel={c}
                        right={<><span>{c.sessions} sess.</span><span>{formatDuration(c.seconds)}</span></>}
                    />
                )}
            </ListSection>

            <ListSection
                title="Voice — Frequent Contacts"
                pending={pending}
                failed={failed}
                items={voice?.contacts.filter(c => c.sessions > 0 || c.total_seconds > 0) ?? []}
            >
                {c => (
                    <PersonRow
                        key={c.user_id}
                        userId={c.user_id}
                        avatar={c.avatar}
                        name={c.name}
                        guildName={c.guild_name}
                        right={
                            <>
                                <span>{c.sessions} sess.</span>
                                <span>{formatDuration(c.total_seconds)}</span>
                                <span className="vc-stalkly-row-sub">avg {formatDuration(c.avg_seconds)}</span>
                            </>
                        }
                    />
                )}
            </ListSection>
        </>
    );
}

function MessagesSection({ userId }: { userId: string; }) {
    const [msgs, error, pending] = useAwaiter(() => getMessageTab(userId), { deps: [userId], fallbackValue: null });
    const failed = !pending && (!!error || !msgs);

    return (
        <>
            <ListSection
                title="Messages — Top Channels"
                pending={pending}
                failed={failed}
                items={msgs?.top_channels.filter(c => c.count > 0) ?? []}
            >
                {c => (
                    <ChannelRow
                        key={c.channel_id}
                        channel={c}
                        right={<><span>{c.count.toLocaleString()} msgs</span><span>{Math.min(100, Math.round(c.share * 100))}%</span></>}
                    />
                )}
            </ListSection>

            <ListSection
                title="Messages — Reply Contacts"
                pending={pending}
                failed={failed}
                items={msgs?.contacts.filter(c => c.count > 0) ?? []}
            >
                {c => (
                    <PersonRow
                        key={c.user_id}
                        userId={c.user_id}
                        avatar={c.avatar}
                        name={c.name}
                        guildName={c.guild_name}
                        right={<span>{c.count} replies</span>}
                    />
                )}
            </ListSection>
        </>
    );
}

function LastSeenWidget({ event }: { event: StalklyActivityEvent; }) {
    const meta = eventMeta(event.type);
    return (
        <Section title="Last Seen">
            <div className="vc-stalkly-lastseen">
                <RowIcon name={event.guild_name ?? "?"} />
                <RowText name={event.guild_name ?? meta.label} sub={event.channel_name ?? meta.label} />
                <div className="vc-stalkly-row-stats">
                    <span>{formatRelativeTime(event.timestamp)}</span>
                    {typeof event.voice_count === "number" && (
                        <span className="vc-stalkly-row-sub">{event.voice_count} people</span>
                    )}
                </div>
            </div>
        </Section>
    );
}

function ActivityFeedSection({ userId }: { userId: string; }) {
    const [page, error, pending] = useAwaiter(() => getActivityFeed(userId, 20), { deps: [userId], fallbackValue: null });
    const failed = !pending && (!!error || !page);
    const events = page?.events ?? [];
    const status = pending || failed || events.length === 0
        ? <SectionStatus pending={pending} empty={!failed} />
        : null;

    return (
        <>
            {status ? <Section title="Last Seen">{status}</Section> : <LastSeenWidget event={events[0]} />}

            <Section title="Recent Activity">
                {status ?? (
                    <div className="vc-stalkly-timeline">
                        {events.map(evt => {
                            const meta = eventMeta(evt.type);
                            return (
                                <div className="vc-stalkly-timeline-row" key={evt.id}>
                                    <span className={`vc-stalkly-timeline-dot ${meta.className}`} />
                                    <div className="vc-stalkly-row-info">
                                        <span className="vc-stalkly-row-name">{meta.label}</span>
                                        <span className="vc-stalkly-row-sub">
                                            {[evt.guild_name, evt.channel_name].filter(Boolean).join(" · ")}
                                            {evt.duration_seconds ? ` · ${formatDuration(evt.duration_seconds)}` : ""}
                                        </span>
                                    </div>
                                    <span className="vc-stalkly-row-sub">{formatRelativeTime(evt.timestamp)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Section>
        </>
    );
}

export default function StalklyDetailSections({ user }: { user: User; }) {
    return (
        <>
            <ActivityFeedSection userId={user.id} />
            <ActivityDistributionSection userId={user.id} />
            <VoiceSection userId={user.id} />
            <MessagesSection userId={user.id} />
        </>
    );
}
