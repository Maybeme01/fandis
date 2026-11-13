/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { FormSwitch } from "@components/FormSwitch";
import { isArabicMode } from "@utils/esharqI18n";
import { ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalRoot, openModal, type RenderModalProps } from "@utils/esharqModals";
import { Button, ChannelStore, MediaEngineStore, React, SelectedChannelStore, useEffect, useState } from "@webpack/common";

import { RecorderEngine } from "../recorderEngine";
import { settings } from "../settings";

function formatSeconds(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const mm = m < 10 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${mm}:${ss}`;
}

export function RecorderModal(props: RenderModalProps) {
    const [, forceUpdate] = useState(0);
    const [inputDevices, setInputDevices] = useState<{ deviceId: string; label: string }[]>([]);
    const [outputDevices, setOutputDevices] = useState<{ deviceId: string; label: string }[]>([]);
    const [activeDiscordDevices, setActiveDiscordDevices] = useState(() => RecorderEngine.getActiveDiscordDevices());

    useEffect(() => {
        const update = () => {
            void RecorderEngine.getAudioInputDevices().then(setInputDevices);
            void RecorderEngine.getAudioOutputDevices().then(setOutputDevices);
            setActiveDiscordDevices(RecorderEngine.getActiveDiscordDevices());
        };
        update();
        (MediaEngineStore as any)?.addChangeListener?.(update);
        return () => {
            (MediaEngineStore as any)?.removeChangeListener?.(update);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = RecorderEngine.subscribe(() => {
            forceUpdate(v => v + 1);
        });
        const interval = setInterval(() => {
            if (RecorderEngine.isRecording()) {
                forceUpdate(v => v + 1);
            }
        }, 1000);
        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const isRecording = RecorderEngine.isRecording();
    const isPaused = RecorderEngine.isPaused();
    const duration = RecorderEngine.getDuration();
    const currentVoiceId = SelectedChannelStore.getVoiceChannelId();
    const currentVoiceChannel = currentVoiceId ? ChannelStore.getChannel(currentVoiceId) : null;
    const roomInfo = RecorderEngine.getCurrentRoomInfo();

    const isAr = isArabicMode();
    const s = isAr ? {
        modalTitle: "مسجل الروم الصوتي | Voice Room Recorder",
        recordingPaused: "⏸️ التسجيل متوقف مؤقتاً",
        recordingActive: "🔴 جاري التسجيل الحي للروم",
        recordingInactive: "⚪ التسجيل غير نشط حالياً",
        connectedRoom: (ch: string, g: string, count: number) => <>الروم المتصل: <strong style={{ color: "#fff" }}>{ch}</strong> ({g}) — {count} أشخاص متواجدين</>,
        readyToRecord: (ch: string) => <>أنت متصل في روم: <strong style={{ color: "#fff" }}>{ch}</strong>. جاهز لبدء التسجيل.</>,
        notConnected: "لست متصلاً بأي روم صوتي حالياً. انضم لروم صوتي لبدء التسجيل تلقائياً.",
        startBtn: "▶️ بدء التسجيل الآن",
        stopBtn: "⏹️ إيقاف وحفظ الفيديو",
        pauseBtn: "⏸️ إيقاف مؤقت",
        resumeBtn: "▶️ استئناف التسجيل",
        openFolderBtn: "📁 فتح مجلد التسجيلات (Videos\\FanCord)",
        sectionTitle: "إعدادات التسجيل التلقائي",
        autoRecordTitle: "التسجيل التلقائي فور دخول الروم",
        autoRecordDesc: "يبدأ التسجيل تلقائياً عند دخول أي روم صوتي، ويتوقف ويحفظ الفيديو فور خروجك.",
        sysAudioTitle: "تسجيل أصوات أعضاء الروم (System Loopback)",
        sysAudioDesc: "تسجيل أصوات جميع الأعضاء المتواجدين في الروم الصوتي بوضوح عبر مسار صوت النظام أو كابلات الصوت الافتراضية.",
        roomAudioLabel: "🔊 مسار التقاط صوت الروم (يدعم SteelSeries Sonar / Voicemeeter / Stereo Mix):",
        autoRoomOption: (dev: string) => `✨ تلقائي ذكي: سحب متزامن مع سماعة ديسكورد (${dev})`,
        commRoomOption: "📞 سماعة المحادثات الافتراضية بنظام ويندوز (Windows Default Communications)",
        defaultRoomOption: "🎧 جهاز الصوت الافتراضي للنظام (Windows Default Audio)",
        outputGroupLabel: "── أجهزة الإخراج والسماعات (Windows Playback Devices) ──",
        micTitle: "تسجيل صوت المايك مع الروم",
        micDesc: "تسجيل صوت الميكروفون الخاص بك مدمجاً مع أصوات أعضاء الروم.",
        micLabel: "🎤 جهاز الميكروفون المستخدم في التسجيل:",
        autoMicOption: (dev: string) => `🎙️ تلقائي: مايك ديسكورد النشط (${dev})`,
        inputGroupLabel: "── أجهزة الميكروفون المتاحة (Microphone Inputs) ──",
        notifyTitle: "إشعار عند حفظ التسجيل",
        notifyDesc: "إظهار إشعار منبثق عند انتهاء التسجيل وحفظ ملف الفيديو في مسار الفيديوهات.",
        closeBtn: "إغلاق"
    } : {
        modalTitle: "Voice Room Recorder",
        recordingPaused: "⏸️ Recording Paused",
        recordingActive: "🔴 Live Recording Active",
        recordingInactive: "⚪ Recording Inactive",
        connectedRoom: (ch: string, g: string, count: number) => <>Connected Channel: <strong style={{ color: "#fff" }}>{ch}</strong> ({g}) — {count} participants</>,
        readyToRecord: (ch: string) => <>Connected to: <strong style={{ color: "#fff" }}>{ch}</strong>. Ready to record.</>,
        notConnected: "Not connected to a voice channel. Join a voice room to begin recording.",
        startBtn: "▶️ Start Recording Now",
        stopBtn: "⏹️ Stop & Save Video",
        pauseBtn: "⏸️ Pause",
        resumeBtn: "▶️ Resume",
        openFolderBtn: "📁 Open Recordings Folder (Videos\\FanCord)",
        sectionTitle: "AUTOMATIC RECORDING SETTINGS",
        autoRecordTitle: "Auto Record on Channel Join",
        autoRecordDesc: "Automatically starts recording upon joining any voice room, and saves when you leave.",
        sysAudioTitle: "Record Room Members Audio (System Loopback)",
        sysAudioDesc: "Captures audio from all voice room members cleanly via system loopback.",
        roomAudioLabel: "🔊 Voice Room Audio Capture Source (supports SteelSeries Sonar / Voicemeeter / Stereo Mix):",
        autoRoomOption: (dev: string) => `✨ Smart Auto: Synchronized with Discord Output (${dev})`,
        commRoomOption: "📞 Windows Default Communications Device",
        defaultRoomOption: "🎧 Windows Default Audio Playback Device",
        outputGroupLabel: "── Windows Playback Devices ──",
        micTitle: "Record Microphone with Room",
        micDesc: "Captures your local microphone mixed together with room members.",
        micLabel: "🎤 Recording Microphone Device:",
        autoMicOption: (dev: string) => `🎙️ Auto: Active Discord Microphone (${dev})`,
        inputGroupLabel: "── Available Microphones ──",
        notifyTitle: "Notification on Save",
        notifyDesc: "Shows a notification when recording finishes and saves in Videos\\FanCord.",
        closeBtn: "Close"
    };

    return (
        <ModalRoot {...props} size="medium">
            <ModalHeader>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px" }}>🎥</span>
                        <span style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>
                            {s.modalTitle}
                        </span>
                    </div>
                    <ModalCloseButton onClick={props.onClose} />
                </div>
            </ModalHeader>

            <ModalContent style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Live Status Card */}
                <div
                    style={{
                        padding: "16px",
                        borderRadius: "8px",
                        backgroundColor: isRecording ? "rgba(242, 63, 67, 0.08)" : "rgba(255, 255, 255, 0.03)",
                        border: isRecording ? "1px solid rgba(242, 63, 67, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {isRecording ? (
                                <>
                                    <span className="fc-rec-dot" style={{ position: "relative", insetInlineEnd: 0, top: 0 }} />
                                    <span style={{ color: "#f23f43", fontWeight: "bold" }}>
                                        {isPaused ? s.recordingPaused : s.recordingActive}
                                    </span>
                                </>
                            ) : (
                                <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>
                                    {s.recordingInactive}
                                </span>
                            )}
                        </div>
                        {isRecording && (
                            <span className="fc-rec-timer">
                                {formatSeconds(duration)}
                            </span>
                        )}
                    </div>

                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        {isRecording ? (
                            <div>
                                {s.connectedRoom(roomInfo.channelName, roomInfo.guildName, roomInfo.count)}
                            </div>
                        ) : currentVoiceChannel ? (
                            <div>
                                {s.readyToRecord(currentVoiceChannel.name)}
                            </div>
                        ) : (
                            <div>
                                {s.notConnected}
                            </div>
                        )}
                    </div>
                </div>

                {/* Primary Action Controls */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {!isRecording ? (
                        <Button
                            color={Button.Colors.GREEN}
                            disabled={!currentVoiceId}
                            onClick={() => {
                                void RecorderEngine.start(currentVoiceId);
                            }}
                        >
                            {s.startBtn}
                        </Button>
                    ) : (
                        <>
                            <Button
                                color={Button.Colors.RED}
                                onClick={() => {
                                    void RecorderEngine.stop();
                                }}
                            >
                                {s.stopBtn}
                            </Button>
                            <Button
                                color={Button.Colors.PRIMARY}
                                onClick={() => {
                                    if (isPaused) {
                                        RecorderEngine.resume();
                                    } else {
                                        RecorderEngine.pause();
                                    }
                                }}
                            >
                                {isPaused ? s.resumeBtn : s.pauseBtn}
                            </Button>
                        </>
                    )}

                    <Button
                        color={Button.Colors.PRIMARY}
                        onClick={() => {
                            void RecorderEngine.openFolder();
                        }}
                    >
                        {s.openFolderBtn}
                    </Button>
                </div>

                {/* Settings Toggles */}
                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)", textTransform: "uppercase" }}>
                        {s.sectionTitle}
                    </div>

                    {/* Discord Auto Sync Info Card */}
                    <div style={{
                        backgroundColor: "rgba(88, 101, 242, 0.1)",
                        border: "1px solid rgba(88, 101, 242, 0.3)",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        margin: "4px 0 8px 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#5865f2" }}>
                                🎯 {isAr ? "الربط التلقائي بأجهزة ديسكورد" : "Discord Auto Sync"}
                            </span>
                            {(settings.store.roomAudioDeviceId !== "auto" || settings.store.micAudioDeviceId !== "auto") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        settings.store.roomAudioDeviceId = "auto";
                                        settings.store.micAudioDeviceId = "auto";
                                        forceUpdate(n => n + 1);
                                    }}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#5865f2",
                                        border: "1px solid rgba(88, 101, 242, 0.5)",
                                        borderRadius: "4px",
                                        padding: "2px 8px",
                                        fontSize: "11px",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    🔄 {isAr ? "استعادة التلقائي (يوصى به)" : "Reset to Auto (Recommended)"}
                                </button>
                            )}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-normal)", display: "flex", flexDirection: "column", gap: "3px" }}>
                            <div>
                                🎙️ <span style={{ color: "var(--text-muted)" }}>{isAr ? "مايك ديسكورد النشط:" : "Discord Mic:"}</span>{" "}
                                <strong style={{ color: "#fff" }}>{activeDiscordDevices.inputName}</strong>
                            </div>
                            <div>
                                🔊 <span style={{ color: "var(--text-muted)" }}>{isAr ? "سماعة ديسكورد (صوت أعضاء الروم):" : "Discord Speaker (Room Audio):"}</span>{" "}
                                <strong style={{ color: "#fff" }}>{activeDiscordDevices.outputName}</strong>
                            </div>
                        </div>
                    </div>

                    <FormSwitch
                        title={s.autoRecordTitle}
                        description={s.autoRecordDesc}
                        value={settings.store.autoRecord}
                        onChange={v => {
                            settings.store.autoRecord = v;
                            forceUpdate(n => n + 1);
                        }}
                    />

                    <FormSwitch
                        title={s.sysAudioTitle}
                        description={s.sysAudioDesc}
                        value={settings.store.recordSystemAudio}
                        onChange={v => {
                            settings.store.recordSystemAudio = v;
                            forceUpdate(n => n + 1);
                        }}
                    />

                    {settings.store.recordSystemAudio && (
                        <div style={{ margin: "4px 0 10px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ fontSize: "12px", color: "var(--text-normal)", fontWeight: "600" }}>
                                {s.roomAudioLabel}
                            </div>
                            <select
                                style={{
                                    backgroundColor: "var(--background-secondary, #2b2d31)",
                                    color: "var(--text-normal, #fff)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    borderRadius: "4px",
                                    padding: "6px 10px",
                                    fontSize: "13px",
                                    outline: "none",
                                    cursor: "pointer",
                                    width: "100%"
                                }}
                                value={settings.store.roomAudioDeviceId}
                                onChange={e => {
                                    settings.store.roomAudioDeviceId = e.target.value;
                                    forceUpdate(n => n + 1);
                                }}
                            >
                                <option value="auto">
                                    {s.autoRoomOption(activeDiscordDevices.outputName)}
                                </option>
                                <option value="communications">
                                    {s.commRoomOption}
                                </option>
                                <option value="default">
                                    {s.defaultRoomOption}
                                </option>
                                {outputDevices.length > 0 && (
                                    <optgroup label={s.outputGroupLabel}>
                                        {outputDevices.map(d => (
                                            <option key={d.deviceId} value={d.deviceId}>
                                                🔊 {d.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                        </div>
                    )}

                    <FormSwitch
                        title={s.micTitle}
                        description={s.micDesc}
                        value={settings.store.recordMic}
                        onChange={v => {
                            settings.store.recordMic = v;
                            forceUpdate(n => n + 1);
                        }}
                    />

                    {settings.store.recordMic && (
                        <div style={{ margin: "4px 0 10px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ fontSize: "12px", color: "var(--text-normal)", fontWeight: "600" }}>
                                {s.micLabel}
                            </div>
                            <select
                                style={{
                                    backgroundColor: "var(--background-secondary, #2b2d31)",
                                    color: "var(--text-normal, #fff)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    borderRadius: "4px",
                                    padding: "6px 10px",
                                    fontSize: "13px",
                                    outline: "none",
                                    cursor: "pointer",
                                    width: "100%"
                                }}
                                value={settings.store.micAudioDeviceId}
                                onChange={e => {
                                    settings.store.micAudioDeviceId = e.target.value;
                                    forceUpdate(n => n + 1);
                                }}
                            >
                                <option value="auto">
                                    {s.autoMicOption(activeDiscordDevices.inputName)}
                                </option>
                                <optgroup label={s.inputGroupLabel}>
                                    {inputDevices.map(d => (
                                        <option key={d.deviceId} value={d.deviceId}>
                                            🎙️ {d.label}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                    )}

                    <FormSwitch
                        title={s.notifyTitle}
                        description={s.notifyDesc}
                        value={settings.store.notifyOnSave}
                        onChange={v => {
                            settings.store.notifyOnSave = v;
                            forceUpdate(n => n + 1);
                        }}
                    />
                </div>
            </ModalContent>

            <ModalFooter>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        FanCord Voice Recorder • Devs.FAN (ff9o)
                    </span>
                    <Button
                        color={Button.Colors.PRIMARY}
                        onClick={props.onClose}
                    >
                        {s.closeBtn}
                    </Button>
                </div>
            </ModalFooter>
        </ModalRoot>
    );
}

export function openRecorderModal() {
    openModal(props => <RecorderModal {...props} />);
}
