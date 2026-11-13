/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { findByCodeLazy, findStoreLazy } from "@webpack";
import { ChannelStore, GuildMemberStore, GuildStore, MediaEngineStore, SelectedChannelStore, showToast, UserStore, VoiceStateStore } from "@webpack/common";

import { drawRoomToCanvas, type ParticipantInfo, type RoomRenderData } from "./canvasRenderer";
import { settings } from "./settings";

interface NativeType {
    getVideosPath: () => Promise<string>;
    getDesktopSourceId?: () => Promise<string>;
    saveRecording: (fileName: string, buffer: Uint8Array) => Promise<{ success: boolean; filePath: string }>;
    openFolder: (targetPath?: string) => Promise<boolean>;
    getLoopbackDevices?: () => Promise<{ name: string; id: string }[]>;
    startLoopbackCapture?: (targetDevice?: string) => Promise<{ success: boolean; port: number; sampleRate: number; deviceName: string }>;
    stopLoopbackCapture?: () => Promise<boolean>;
}

const getNative = (): NativeType | undefined => {
    return (VencordNative?.pluginHelpers as any)?.VoiceRoomRecorder;
};

const SpeakingStore = findStoreLazy("SpeakingStore");
const getDesktopSources = findByCodeLazy("desktop sources");

class VoiceRecorderEngine {
    private recording = false;
    private paused = false;
    private startTime = 0;
    private pausedElapsed = 0;
    private pauseTimestamp = 0;
    private activeChannelId: string | null = null;
    private channelName = "";
    private guildName = "";

    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private animFrameId: number | null = null;
    private renderIntervalId: any = null;

    private audioCtx: AudioContext | null = null;
    private audioDest: MediaStreamAudioDestinationNode | null = null;
    private micStream: MediaStream | null = null;
    private systemStreams: MediaStream[] = [];
    private loopbackAbortController: AbortController | null = null;
    private loopbackScriptNode: ScriptProcessorNode | null = null;

    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: BlobPart[] = [];

    private speakingUsers = new Set<string>();
    private listeners = new Set<() => void>();

    public isRecording(): boolean {
        return this.recording;
    }

    public isPaused(): boolean {
        return this.paused;
    }

    public static async getAudioInputDevices(): Promise<{ deviceId: string; label: string }[]> {
        try {
            const discordInputs = (MediaEngineStore as any)?.getInputDevices?.() || {};
            const devices = await navigator.mediaDevices.enumerateDevices();
            const list: { deviceId: string; label: string }[] = [];
            const seen = new Set<string>();

            for (const d of devices) {
                if (d.kind === "audioinput") {
                    const label = d.label || discordInputs[d.deviceId]?.name || `مايكروفون ${list.length + 1}`;
                    list.push({ deviceId: d.deviceId, label });
                    seen.add(d.deviceId);
                }
            }

            for (const [id, dev] of Object.entries(discordInputs as Record<string, any>)) {
                if (id && id !== "default" && !seen.has(id)) {
                    list.push({ deviceId: id, label: dev.name || id });
                    seen.add(id);
                }
            }

            return list;
        } catch {
            return [];
        }
    }

    public static async getAudioOutputDevices(): Promise<{ deviceId: string; label: string }[]> {
        const list: { deviceId: string; label: string }[] = [];
        const seen = new Set<string>();

        // 1. Prefer native WASAPI playback devices
        try {
            const native = getNative();
            if (native?.getLoopbackDevices) {
                const devs = await native.getLoopbackDevices();
                if (devs && devs.length > 0) {
                    for (const d of devs) {
                        if (!seen.has(d.name)) {
                            list.push({ deviceId: d.name, label: d.name });
                            seen.add(d.name);
                        }
                    }
                    return list;
                }
            }
        } catch {
            // fallback
        }

        // 2. Fallback to Discord MediaEngine output devices
        try {
            const discordOutputs = (MediaEngineStore as any)?.getOutputDevices?.() || {};
            const devices = await navigator.mediaDevices.enumerateDevices();

            for (const [id, dev] of Object.entries(discordOutputs as Record<string, any>)) {
                const name = dev.name || id;
                if (id && id !== "default" && !seen.has(name)) {
                    list.push({ deviceId: name, label: name });
                    seen.add(name);
                }
            }

            for (const d of devices) {
                if (d.kind === "audiooutput" && !seen.has(d.label)) {
                    const label = d.label || `سماعة ${list.length + 1}`;
                    list.push({ deviceId: label, label });
                    seen.add(label);
                }
            }

            return list;
        } catch {
            return [];
        }
    }

    public static getActiveDiscordDevices(): { inputName: string; outputName: string } {
        try {
            const inputId = (MediaEngineStore as any)?.getInputDeviceId?.() || "default";
            const outputId = (MediaEngineStore as any)?.getOutputDeviceId?.() || "default";
            const inputDevs = (MediaEngineStore as any)?.getInputDevices?.() || {};
            const outputDevs = (MediaEngineStore as any)?.getOutputDevices?.() || {};

            const inputName = inputDevs[inputId]?.name || (inputId === "default" ? "مايكروفون ديسكورد التلقائي" : inputId);
            const outputName = outputDevs[outputId]?.name || (outputId === "default" ? "سماعة ديسكورد التلقائية" : outputId);

            return { inputName, outputName };
        } catch {
            return { inputName: "تلقائي", outputName: "تلقائي" };
        }
    }

    public async getAudioInputDevices(): Promise<{ deviceId: string; label: string }[]> {
        return VoiceRecorderEngine.getAudioInputDevices();
    }

    public async getAudioOutputDevices(): Promise<{ deviceId: string; label: string }[]> {
        return VoiceRecorderEngine.getAudioOutputDevices();
    }

    public getActiveDiscordDevices(): { inputName: string; outputName: string } {
        return VoiceRecorderEngine.getActiveDiscordDevices();
    }

    public getActiveChannelId(): string | null {
        return this.activeChannelId;
    }

    public getDuration(): number {
        if (!this.recording) return 0;
        if (this.paused) return Math.floor(this.pausedElapsed);
        return Math.floor(this.pausedElapsed + ((Date.now() - this.startTime) / 1000));
    }

    public getCurrentRoomInfo(): { channelName: string; guildName: string; count: number } {
        return {
            channelName: this.channelName || "Voice Room",
            guildName: this.guildName || "Direct / Server",
            count: this.getParticipants().length
        };
    }

    public subscribe(fn: () => void): () => void {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    private emitChange() {
        for (const fn of this.listeners) {
            try {
                fn();
            } catch {
                // ignore
            }
        }
    }

    public onSpeaking(userId: string, isSpeaking: boolean) {
        if (isSpeaking) {
            this.speakingUsers.add(userId);
        } else {
            this.speakingUsers.delete(userId);
        }
    }

    public onVoiceStateUpdate() {
        this.emitChange();
    }

    public async openFolder(): Promise<boolean> {
        const native = getNative();
        if (native?.openFolder) {
            return await native.openFolder();
        }
        return false;
    }

    private resolveChannelMetadata(channelId: string) {
        try {
            const channel = ChannelStore.getChannel(channelId);
            if (channel) {
                this.channelName = channel.name || "Voice Room";
                const guild = channel.guild_id ? GuildStore.getGuild(channel.guild_id) : null;
                this.guildName = guild?.name || "Direct Message";
                return;
            }
        } catch {
            // fallback
        }
        this.channelName = "Voice Room";
        this.guildName = "Discord Voice";
    }

    private getParticipants(): ParticipantInfo[] {
        if (!this.activeChannelId) return [];

        try {
            const voiceStates = VoiceStateStore.getVoiceStatesForChannel(this.activeChannelId);
            if (!voiceStates) return [];

            const channel = ChannelStore.getChannel(this.activeChannelId);
            const guildId = channel?.guild_id;

            return Object.values(voiceStates).map((state: any) => {
                const user = UserStore.getUser(state.userId);
                const nick = guildId ? GuildMemberStore.getNick(guildId, state.userId) : null;
                const displayName = nick || user?.globalName || user?.username || `User ${state.userId.slice(-4)}`;
                const username = user?.username ? `@${user.username}` : `@${state.userId}`;
                const avatarUrl = user?.getAvatarURL ? user.getAvatarURL(guildId, 128, false) : "";
                const isSpeaking = Boolean(SpeakingStore?.isSpeaking?.(state.userId) || this.speakingUsers.has(state.userId));

                return {
                    id: state.userId,
                    username,
                    globalName: displayName,
                    avatarUrl,
                    isSpeaking,
                    isMuted: Boolean(state.mute || state.selfMute),
                    isDeafened: Boolean(state.deaf || state.selfDeaf),
                    isStreaming: Boolean(state.selfStream),
                    isCameraOn: Boolean(state.selfVideo)
                };
            });
        } catch {
            return [];
        }
    }

    public async start(channelId?: string): Promise<boolean> {
        if (this.recording) return true;

        const targetChannelId = channelId || SelectedChannelStore.getVoiceChannelId();
        if (!targetChannelId) {
            showToast({ text: "يجب أن تكون داخل روم صوتي لبدء التسجيل", variant: "critical" });
            return false;
        }

        this.activeChannelId = targetChannelId;
        this.resolveChannelMetadata(targetChannelId);
        this.startTime = Date.now();
        this.pausedElapsed = 0;
        this.paused = false;
        this.recordedChunks = [];

        // 1. Setup Canvas (1280x720 30FPS)
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = 1280;
            this.canvas.height = 720;
            this.ctx = this.canvas.getContext("2d");
        }

        // 2. Setup Audio Engine & Mixing
        const mixedAudioTracks: MediaStreamTrack[] = [];
        try {
            this.audioCtx = new AudioContext({ sampleRate: 48000 });
            if (this.audioCtx.state === "suspended") {
                try {
                    await this.audioCtx.resume();
                } catch {}
            }
            this.audioDest = this.audioCtx.createMediaStreamDestination();
            const dest = this.audioDest;

            // A. Capture Microphone (Smart Sync with Discord)
            if (settings.store.recordMic) {
                try {
                    const discordInputs = (MediaEngineStore as any)?.getInputDevices?.() || {};
                    const discordInputId = (MediaEngineStore as any)?.getInputDeviceId?.() || "default";
                    const discordInputName = discordInputs[discordInputId]?.name || "";
                    const chosenMic = settings.store.micAudioDeviceId;

                    let targetDeviceId: string | undefined;

                    try {
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        const audioInputs = devices.filter(d => d.kind === "audioinput");

                        if (chosenMic && chosenMic !== "auto" && chosenMic !== "default") {
                            const exact = audioInputs.find(d => d.deviceId === chosenMic || d.label === chosenMic);
                            if (exact) targetDeviceId = exact.deviceId;
                        } else if (discordInputId !== "default" && discordInputName) {
                            const matched = audioInputs.find(d =>
                                d.deviceId === discordInputId ||
                                (d.label && (
                                    d.label.toLowerCase().includes(discordInputName.toLowerCase()) ||
                                    discordInputName.toLowerCase().includes(d.label.toLowerCase())
                                ))
                            );
                            if (matched) targetDeviceId = matched.deviceId;
                        }
                    } catch {}

                    this.micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false,
                            ...(targetDeviceId ? { deviceId: { exact: targetDeviceId } } : {})
                        }
                    }).catch(async () => {
                        return navigator.mediaDevices.getUserMedia({ audio: true });
                    });

                    if (this.micStream && this.audioCtx) {
                        const micSource = this.audioCtx.createMediaStreamSource(this.micStream);
                        const micGain = this.audioCtx.createGain();
                        micGain.gain.value = 1.0;
                        micSource.connect(micGain);
                        micGain.connect(dest);
                    }
                } catch (err) {
                    console.warn("[VoiceRoomRecorder] Microphone capture failed:", err);
                }
            }

            // B. Capture Room Participants Audio via Windows WASAPI Loopback (SteelSeries Sonar / Voicemeeter / Default Playback)
            if (settings.store.recordSystemAudio) {
                const native = getNative();
                const chosenRoomDevice = settings.store.roomAudioDeviceId;
                const outputDevices = (MediaEngineStore as any)?.getOutputDevices?.() || {};
                const activeOutputId = (MediaEngineStore as any)?.getOutputDeviceId?.() || "default";
                const activeOutputName = outputDevices[activeOutputId]?.name || "";

                const inputDevices = (MediaEngineStore as any)?.getInputDevices?.() || {};
                const activeInputId = (MediaEngineStore as any)?.getInputDeviceId?.() || "default";
                const activeInputName = inputDevices[activeInputId]?.name || "";

                let targetDeviceArg = "";
                // If user selected auto, OR if user mistakenly selected the mic device name as the room device:
                if (!chosenRoomDevice || chosenRoomDevice === "auto" || (activeInputName && chosenRoomDevice === activeInputName)) {
                    // Match Discord's active output device (e.g. SteelSeries Sonar - Chat)
                    targetDeviceArg = (activeOutputId !== "default" && activeOutputName) ? activeOutputName : "";
                } else if (chosenRoomDevice === "communications") {
                    targetDeviceArg = "communications";
                } else if (chosenRoomDevice === "default" || chosenRoomDevice === "loopback") {
                    targetDeviceArg = "";
                } else {
                    targetDeviceArg = chosenRoomDevice;
                }

                let loopbackActive = false;
                if (native?.startLoopbackCapture) {
                    try {
                        const res = await native.startLoopbackCapture(targetDeviceArg);
                        if (res?.success && res.port && this.audioCtx) {
                            loopbackActive = true;
                            this.startLoopbackAudioPipeline(res.port, dest);
                        }
                    } catch (err) {
                        console.warn("[VoiceRoomRecorder] Native loopback start failed:", err);
                    }
                }

                // Fallback to desktop screen audio if native loopback failed
                if (!loopbackActive) {
                    await this.setupDesktopFallbackAudio(dest);
                }
            }

            mixedAudioTracks.push(...dest.stream.getAudioTracks());
        } catch (err) {
            console.error("[VoiceRoomRecorder] Audio initialization error:", err);
        }

        // Ensure AudioContext is running
        if (this.audioCtx && this.audioCtx.state === "suspended") {
            await this.audioCtx.resume().catch(() => {});
        }

        // 3. Draw initial frame to canvas
        if (this.ctx && this.canvas) {
            const initialData: RoomRenderData = {
                channelName: this.channelName,
                guildName: this.guildName,
                durationSeconds: 0,
                participants: this.getParticipants()
            };
            drawRoomToCanvas(this.ctx, this.canvas.width, this.canvas.height, initialData);
        }

        const canvasStream = this.canvas.captureStream(30);
        const combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...mixedAudioTracks
        ]);

        // 4. Setup MediaRecorder
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
            ? "video/webm;codecs=vp9,opus"
            : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
            ? "video/webm;codecs=vp8,opus"
            : "video/webm";

        try {
            this.mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType,
                videoBitsPerSecond: 2_500_000
            });
        } catch {
            this.mediaRecorder = new MediaRecorder(combinedStream);
        }

        this.mediaRecorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) {
                this.recordedChunks.push(e.data);
            }
        };

        this.mediaRecorder.onstop = () => {
            void this.handleSaveRecording();
        };

        this.mediaRecorder.start(1000);
        this.recording = true;

        // 5. Start Canvas Render Loop
        this.startRenderLoop();

        this.emitChange();
        showToast({ text: `بدأ تسجيل الروم الصوتي: ${this.channelName}`, variant: "success" });
        return true;
    }

    private startLoopbackAudioPipeline(port: number, dest: MediaStreamAudioDestinationNode) {
        if (!this.audioCtx) return;

        const RING_SIZE = 48000 * 2 * 2; // 2 seconds stereo Float32 ring buffer
        const ringBuffer = new Float32Array(RING_SIZE);
        let writeIdx = 0;
        let readIdx = 0;

        this.loopbackAbortController = new AbortController();
        const { signal } = this.loopbackAbortController;

        // Background HTTP Stream reader
        void (async () => {
            try {
                const resp = await fetch(`http://127.0.0.1:${port}/audio`, { signal });
                const reader = resp.body?.getReader();
                if (!reader) return;

                let remainder = new Uint8Array(0);
                while (this.recording && !signal.aborted) {
                    const { value, done } = await reader.read();
                    if (done || !value) break;

                    let chunk = value;
                    if (remainder.length > 0) {
                        const merged = new Uint8Array(remainder.length + value.length);
                        merged.set(remainder, 0);
                        merged.set(value, remainder.length);
                        chunk = merged;
                        remainder = new Uint8Array(0);
                    }

                    const unaligned = chunk.length % 4;
                    if (unaligned > 0) {
                        remainder = chunk.slice(chunk.length - unaligned);
                        chunk = chunk.subarray(0, chunk.length - unaligned);
                    }

                    if (chunk.length >= 4) {
                        const floats = new Float32Array(
                            chunk.buffer,
                            chunk.byteOffset,
                            chunk.byteLength / 4
                        );
                        for (let i = 0; i < floats.length; i++) {
                            ringBuffer[writeIdx] = floats[i];
                            writeIdx = (writeIdx + 1) % RING_SIZE;
                        }
                    }
                }
            } catch {
                // Aborted or stream closed
            }
        })();

        // Web Audio ScriptProcessorNode: 2048 samples (~42ms)
        const scriptNode = this.audioCtx.createScriptProcessor(2048, 2, 2);
        this.loopbackScriptNode = scriptNode;

        scriptNode.onaudioprocess = (e: AudioProcessingEvent) => {
            const outL = e.outputBuffer.getChannelData(0);
            const outR = e.outputBuffer.getChannelData(1);

            for (let i = 0; i < outL.length; i++) {
                if (readIdx !== writeIdx) {
                    outL[i] = ringBuffer[readIdx];
                    readIdx = (readIdx + 1) % RING_SIZE;

                    if (readIdx !== writeIdx) {
                        outR[i] = ringBuffer[readIdx];
                        readIdx = (readIdx + 1) % RING_SIZE;
                    } else {
                        outR[i] = 0;
                    }
                } else {
                    outL[i] = 0;
                    outR[i] = 0;
                }
            }
        };

        const roomGain = this.audioCtx.createGain();
        roomGain.gain.value = 1.0;
        scriptNode.connect(roomGain);
        roomGain.connect(dest);

        // Silent connect to hardware destination to keep clock active
        const silentTap = this.audioCtx.createGain();
        silentTap.gain.value = 0;
        scriptNode.connect(silentTap);
        silentTap.connect(this.audioCtx.destination);
    }

    private async setupDesktopFallbackAudio(dest: MediaStreamAudioDestinationNode) {
        let sourceId = "";
        try {
            const native = getNative();
            if (native?.getDesktopSourceId) {
                sourceId = await native.getDesktopSourceId();
            }
        } catch {}

        if (!sourceId) {
            try {
                const mediaEngine = MediaEngineStore?.getMediaEngine?.();
                if (mediaEngine && getDesktopSources) {
                    const sources = await getDesktopSources(mediaEngine, true, ["screen"], null);
                    if (sources?.[0]?.id) {
                        sourceId = sources[0].id;
                    }
                }
            } catch {}
        }

        if (sourceId) {
            try {
                const sysStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        mandatory: {
                            chromeMediaSource: "desktop"
                        }
                    },
                    video: {
                        mandatory: {
                            chromeMediaSource: "desktop",
                            chromeMediaSourceId: sourceId
                        }
                    }
                } as any);

                for (const vt of sysStream.getVideoTracks()) {
                    try { vt.stop(); } catch {}
                }

                if (sysStream.getAudioTracks().length > 0 && this.audioCtx) {
                    this.systemStreams.push(sysStream);
                    const sysSource = this.audioCtx.createMediaStreamSource(new MediaStream([sysStream.getAudioTracks()[0]]));
                    const sysGain = this.audioCtx.createGain();
                    sysGain.gain.value = 1.0;
                    sysSource.connect(sysGain);
                    sysGain.connect(dest);
                }
            } catch (err) {
                console.warn("[VoiceRoomRecorder] Desktop fallback audio capture failed:", err);
            }
        }
    }

    private startRenderLoop() {
        const render = () => {
            if (!this.recording) return;

            try {
                if (this.ctx && this.canvas) {
                    const renderData: RoomRenderData = {
                        channelName: this.channelName,
                        guildName: this.guildName,
                        durationSeconds: this.getDuration(),
                        participants: this.getParticipants()
                    };
                    drawRoomToCanvas(this.ctx, this.canvas.width, this.canvas.height, renderData);
                }
            } catch (err) {
                console.error("[VoiceRoomRecorder] Render loop error:", err);
            }
        };

        render();

        if (this.renderIntervalId) clearInterval(this.renderIntervalId);
        this.renderIntervalId = setInterval(() => {
            render();
        }, 33);
    }

    public pause() {
        if (!this.recording || this.paused) return;
        this.paused = true;
        this.pauseTimestamp = Date.now();
        this.pausedElapsed += (Date.now() - this.startTime) / 1000;
        this.mediaRecorder?.pause();
        this.emitChange();
        showToast({ text: "تم إيقاف التسجيل مؤقتاً", variant: "default" });
    }

    public resume() {
        if (!this.recording || !this.paused) return;
        this.paused = false;
        this.startTime = Date.now();
        this.mediaRecorder?.resume();
        this.emitChange();
        showToast({ text: "تم استئناف التسجيل", variant: "default" });
    }

    public async stop(): Promise<void> {
        if (!this.recording) return;

        this.recording = false;
        this.paused = false;

        if (this.renderIntervalId) {
            clearInterval(this.renderIntervalId);
            this.renderIntervalId = null;
        }
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
            this.mediaRecorder.stop();
        }

        // Clean up loopback pipeline
        if (this.loopbackAbortController) {
            try { this.loopbackAbortController.abort(); } catch {}
            this.loopbackAbortController = null;
        }
        if (this.loopbackScriptNode) {
            try { this.loopbackScriptNode.disconnect(); } catch {}
            this.loopbackScriptNode = null;
        }

        const native = getNative();
        if (native?.stopLoopbackCapture) {
            try { void native.stopLoopbackCapture(); } catch {}
        }

        for (const stream of this.systemStreams) {
            for (const track of stream.getTracks()) {
                try {
                    track.stop();
                } catch {
                    // ignore
                }
            }
        }
        this.systemStreams = [];

        if (this.micStream) {
            for (const track of this.micStream.getTracks()) {
                try {
                    track.stop();
                } catch {
                    // ignore
                }
            }
            this.micStream = null;
        }

        if (this.audioCtx && this.audioCtx.state !== "closed") {
            await this.audioCtx.close().catch(() => {});
            this.audioCtx = null;
        }

        this.audioDest = null;
        this.speakingUsers.clear();
        this.emitChange();
    }

    private async handleSaveRecording() {
        if (!this.recordedChunks.length) return;

        const blob = new Blob(this.recordedChunks, { type: "video/webm" });
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
        const cleanName = (this.channelName || "Room").replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, "_");
        const fileName = `FanCord_Voice_${cleanName}_${dateStr}.webm`;

        const native = getNative();
        if (native?.saveRecording) {
            const res = await native.saveRecording(fileName, buffer);
            if (res.success) {
                if (settings.store.notifyOnSave) {
                    showToast({ text: `تم حفظ تسجيل الروم بنجاح: ${fileName}`, variant: "success" });
                    showNotification({
                        title: "FanCord Voice Recorder",
                        body: `تم حفظ الفيديو في مجلد Videos/FanCord بنجاح!\n${fileName}`
                    });
                }
            } else {
                showToast({ text: "تعذر حفظ الفيديو في مجلد Videos/FanCord", variant: "critical" });
            }
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            showToast({ text: `تم تنزيل تسجيل الروم: ${fileName}`, variant: "success" });
        }

        this.recordedChunks = [];
        this.activeChannelId = null;
    }
}

export const RecorderEngine = new VoiceRecorderEngine();
