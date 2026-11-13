/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface ParticipantInfo {
    id: string;
    username: string;
    globalName: string;
    avatarUrl: string;
    isSpeaking: boolean;
    isMuted: boolean;
    isDeafened: boolean;
    isStreaming: boolean;
    isCameraOn: boolean;
}

export interface RoomRenderData {
    channelName: string;
    guildName: string;
    durationSeconds: number;
    participants: ParticipantInfo[];
}

const avatarCache = new Map<string, HTMLImageElement>();
const loadingUrls = new Set<string>();

function getAvatarImage(url: string): HTMLImageElement | null {
    if (!url) return null;
    const existing = avatarCache.get(url);
    if (existing) {
        return existing.complete && existing.naturalWidth > 0 ? existing : null;
    }
    if (loadingUrls.has(url)) return null;

    loadingUrls.add(url);

    // Fetch as blob to guarantee NO cross-origin canvas tainting!
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("fetch failed");
            return res.blob();
        })
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                avatarCache.set(url, img);
                loadingUrls.delete(url);
            };
            img.onerror = () => {
                loadingUrls.delete(url);
            };
            img.src = blobUrl;
        })
        .catch(() => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                avatarCache.set(url, img);
                loadingUrls.delete(url);
            };
            img.onerror = () => {
                loadingUrls.delete(url);
            };
            img.src = url;
        });

    return null;
}

function formatDuration(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const mm = m < 10 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${mm}:${ss}`;
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

export function drawRoomToCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: RoomRenderData
) {
    // 1. Dark Modern Studio Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#0b0d14");
    bgGrad.addColorStop(0.5, "#111420");
    bgGrad.addColorStop(1, "#181b2a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid dots / mesh accent
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let x = 20; x < width; x += 40) {
        for (let y = 20; y < height; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 2. Top Header Bar
    const headerHeight = 75;
    ctx.fillStyle = "rgba(12, 14, 22, 0.85)";
    ctx.fillRect(0, 0, width, headerHeight);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, headerHeight);
    ctx.lineTo(width, headerHeight);
    ctx.stroke();

    // Red Recording Badge
    const timeNow = Date.now();
    const pulseFactor = 0.5 + 0.5 * Math.sin(timeNow / 250);
    ctx.fillStyle = `rgba(242, 63, 67, ${0.4 + 0.6 * pulseFactor})`;
    ctx.beginPath();
    ctx.arc(32, 38, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f23f43";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("REC", 46, 43);

    // Timer
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px monospace";
    ctx.fillText(formatDuration(data.durationSeconds), 90, 43);

    // Server & Room Info (Center)
    ctx.textAlign = "center";
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#ffffff";
    const roomTitle = `🔊 ${data.channelName || "Voice Room"} — ${data.guildName || "FanCord"}`;
    ctx.fillText(roomTitle, width / 2, 43);

    // Right: Participant Count Badge
    ctx.textAlign = "right";
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#949ba4";
    ctx.fillText(`👥 ${data.participants.length} المتواجدون بالروم`, width - 30, 43);
    ctx.textAlign = "left";

    // 3. Main Area: Participants Grid
    const contentTop = headerHeight + 25;
    const contentBottom = height - 55;
    const contentHeight = contentBottom - contentTop;
    const contentWidth = width - 60;
    const startX = 30;

    const count = Math.max(1, data.participants.length);

    if (data.participants.length === 0) {
        ctx.textAlign = "center";
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillText("في انتظار تواجد الأعضاء بالروم الصوتي...", width / 2, height / 2 - 10);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillText("سيظهر هنا جميع المتصلين مع صورهم وأسمائهم وأصواتهم فور تواجدهم", width / 2, height / 2 + 20);
    }

    let cols = 1;
    let rows = 1;
    if (count === 2) { cols = 2; rows = 1; }
    else if (count <= 4) { cols = 2; rows = 2; }
    else if (count <= 6) { cols = 3; rows = 2; }
    else if (count <= 9) { cols = 3; rows = 3; }
    else { cols = 4; rows = Math.ceil(count / 4); }

    const gap = 16;
    const cardWidth = (contentWidth - (cols - 1) * gap) / cols;
    const cardHeight = (contentHeight - (rows - 1) * gap) / rows;

    data.participants.forEach((p, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const x = startX + c * (cardWidth + gap);
        const y = contentTop + r * (cardHeight + gap);

        // Card container
        roundRect(ctx, x, y, cardWidth, cardHeight, 12);
        ctx.fillStyle = p.isSpeaking ? "rgba(35, 165, 90, 0.12)" : "rgba(24, 28, 42, 0.7)";
        ctx.fill();

        ctx.lineWidth = p.isSpeaking ? 2 : 1;
        ctx.strokeStyle = p.isSpeaking ? "#23a55a" : "rgba(255, 255, 255, 0.1)";
        ctx.stroke();

        // Avatar layout
        const avatarSize = Math.min(cardHeight * 0.45, 76);
        const avatarX = x + cardWidth / 2;
        const avatarY = y + cardHeight * 0.36;

        // Speaking Wave Glow Animation
        if (p.isSpeaking) {
            const waveRadius = avatarSize / 2 + 6 + 4 * Math.sin(timeNow / 180);
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX, avatarY, waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(35, 165, 90, 0.85)";
            ctx.lineWidth = 3;
            ctx.shadowColor = "#23a55a";
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
        }

        // Draw Avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        let drewAvatar = false;
        const img = getAvatarImage(p.avatarUrl);
        if (img) {
            try {
                ctx.drawImage(img, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);
                drewAvatar = true;
            } catch {
                drewAvatar = false;
            }
        }

        if (!drewAvatar) {
            // Fallback gradient with user's initial
            const avGrad = ctx.createLinearGradient(
                avatarX - avatarSize / 2,
                avatarY - avatarSize / 2,
                avatarX + avatarSize / 2,
                avatarY + avatarSize / 2
            );
            avGrad.addColorStop(0, "#5865f2");
            avGrad.addColorStop(1, "#3c45a5");
            ctx.fillStyle = avGrad;
            ctx.fillRect(avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);

            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${Math.round(avatarSize * 0.42)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const initial = (p.globalName || p.username || "U").replace(/^@/, "").charAt(0).toUpperCase();
            ctx.fillText(initial, avatarX, avatarY);
        }
        ctx.restore();

        // User Display Name
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px sans-serif";
        const displayName = p.globalName || p.username || "Unknown";
        const maxTextW = cardWidth - 20;
        ctx.fillText(displayName, avatarX, avatarY + avatarSize / 2 + 22, maxTextW);

        // Username (@username)
        ctx.fillStyle = "#949ba4";
        ctx.font = "13px sans-serif";
        const cleanUname = p.username ? (p.username.startsWith("@") ? p.username : `@${p.username}`) : "";
        ctx.fillText(cleanUname, avatarX, avatarY + avatarSize / 2 + 40, maxTextW);

        // State Badges (Speaking / Muted / Deafened / Video)
        const badgeY = y + cardHeight - 16;
        if (p.isSpeaking) {
            ctx.fillStyle = "#23a55a";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("● يتحدث الآن (Speaking)", avatarX, badgeY);
        } else if (p.isDeafened) {
            ctx.fillStyle = "#f23f43";
            ctx.font = "12px sans-serif";
            ctx.fillText("🎧 مصمت (Deafened)", avatarX, badgeY);
        } else if (p.isMuted) {
            ctx.fillStyle = "#f23f43";
            ctx.font = "12px sans-serif";
            ctx.fillText("🎤 مكتوم (Muted)", avatarX, badgeY);
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "12px sans-serif";
            ctx.fillText("صامت (Listening)", avatarX, badgeY);
        }
    });

    // 4. Bottom Footer Bar (Watermark & Live Audio Visualizer Bars)
    ctx.fillStyle = "rgba(12, 14, 22, 0.9)";
    ctx.fillRect(0, height - 42, width, 42);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height - 42);
    ctx.lineTo(width, height - 42);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.font = "bold 13px sans-serif";
    ctx.fillStyle = "#5865f2";
    ctx.fillText("FanCord", 24, height - 16);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#949ba4";
    ctx.fillText("• تسجيل الروم الصوتي الذكي (Voice Room Studio Recorder)", 90, height - 16);

    // Dynamic Soundwave Bars
    const barsCount = 20;
    const barStartX = width - 240;
    const barW = 4;
    const maxBarH = 18;
    for (let b = 0; b < barsCount; b++) {
        const hasSpeaking = data.participants.some(p => p.isSpeaking);
        const wave = hasSpeaking
            ? Math.abs(Math.sin((timeNow / 120) + b * 0.4))
            : 0.12;
        const barH = Math.max(3, wave * maxBarH);
        const bx = barStartX + b * 10;
        const by = height - 21 - barH / 2;

        ctx.fillStyle = hasSpeaking ? "#23a55a" : "rgba(255, 255, 255, 0.2)";
        roundRect(ctx, bx, by, barW, barH, 2);
        ctx.fill();
    }
}
