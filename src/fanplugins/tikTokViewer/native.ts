/*
 * TikTok Native Docked Panel for FanCord
 * Located in: src/fanplugins/tikTokViewer/native.ts
 */

import { BrowserWindow, app } from "electron";
import fs from "fs";
import path from "path";

let tikTokWin: BrowserWindow | null = null;
const TITLEBAR_OFFSET = 36;
const DEFAULT_WIDTH = 580;

function getConfigPath(): string {
    try {
        return path.join(app.getPath("userData"), "fancord-tiktok-panel.json");
    } catch {
        return path.join(process.env.APPDATA || ".", "fancord-tiktok-panel.json");
    }
}

function loadSavedWidth(): number {
    try {
        const file = getConfigPath();
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file, "utf8"));
            if (typeof data.width === "number" && data.width >= 360 && data.width <= 1400) {
                return data.width;
            }
        }
    } catch {}
    return DEFAULT_WIDTH;
}

function saveCurrentWidth(width: number) {
    try {
        const file = getConfigPath();
        fs.writeFileSync(file, JSON.stringify({ width }), "utf8");
    } catch {}
}

let currentPanelWidth = loadSavedWidth();

function getDiscordWindow(): BrowserWindow | null {
    const wins = BrowserWindow.getAllWindows();
    return wins.find(w => {
        if (w.isDestroyed()) return false;
        if (tikTokWin && w.id === tikTokWin.id) return false;
        const url = w.webContents?.getURL() || "";
        return url.includes("discord.com") || url.includes("/app");
    }) || wins[0] || null;
}

function injectCustomUI() {
    if (!tikTokWin || tikTokWin.isDestroyed()) return;

    // 1. تنسيقات الستايل وإظهار أزرار الفيديو
    const customCss = `
        #fancord-top-bar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 42px !important;
            background-color: #111214 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-left: 2px solid rgba(255, 255, 255, 0.08) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 12px !important;
            z-index: 2147483647 !important;
            user-select: none !important;
            font-family: -apple-system, BlinkMacSystemFont, "gg sans", "Segoe UI", Roboto, sans-serif !important;
            box-sizing: border-box !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        html, body {
            height: 100% !important;
            overflow: hidden !important;
        }
        body {
            padding-top: 42px !important;
            height: calc(100vh - 42px) !important;
            border-left: 2px solid rgba(255, 255, 255, 0.08) !important;
            box-sizing: border-box !important;
        }
        .fancord-btn {
            background: transparent;
            border: none;
            color: #949ba4;
            cursor: pointer;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.15s ease;
        }
        .fancord-btn:hover {
            background-color: #2b2d31;
            color: #dbdee1;
        }
        .fancord-close-btn:hover {
            background-color: #da373c !important;
            color: #ffffff !important;
        }

        /* إخفاء القائمة الجانبية اليسرى وتوسيع الفيديو */
        html.fancord-hide-sidebar [data-e2e*="side-nav"],
        html.fancord-hide-sidebar [data-e2e*="sidebar"],
        html.fancord-hide-sidebar [data-e2e="nav-side-bar"],
        html.fancord-hide-sidebar div[class*="SideNavContainer"],
        html.fancord-hide-sidebar div[class*="DivNavWrapper"],
        html.fancord-hide-sidebar div[class*="SideNav"],
        html.fancord-hide-sidebar aside {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
            visibility: hidden !important;
        }
        html.fancord-hide-sidebar main,
        html.fancord-hide-sidebar div[class*="MainContainer"],
        html.fancord-hide-sidebar div[class*="DivBodyContainer"] {
            margin-left: 0 !important;
            padding-left: 0 !important;
            width: 100% !important;
        }

        /* إظهار أزرار التحكم الأصلية لتيك توك في حال وجودها */
        div[class*="DivVideoControlContainer"],
        div[class*="DivBottomControl"],
        div[class*="DivSeekBar"],
        div[class*="DivVolumeControl"],
        div[class*="VolumeControl"],
        div[class*="xgplayer-controls"],
        div[class*="xgplayer-volume"] {
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
        }

        /* شريط التحكم العائم الشامل في الفيديو من FanCord */
        #fancord-video-bar {
            position: fixed !important;
            bottom: 10px !important;
            left: 12px !important;
            right: 76px !important;
            height: 40px !important;
            background: rgba(17, 18, 20, 0.88) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
            padding: 0 10px !important;
            gap: 8px !important;
            z-index: 2147483646 !important;
            color: #ffffff !important;
            user-select: none !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;
            transition: opacity 0.25s ease, transform 0.25s ease !important;
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        #fancord-video-bar.fancord-faded {
            opacity: 0 !important;
            pointer-events: none !important;
            transform: translateY(6px) !important;
        }
        .fancord-bar-btn {
            background: transparent !important;
            border: none !important;
            color: #f2f3f5 !important;
            cursor: pointer !important;
            padding: 4px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 4px !important;
            transition: background 0.15s ease !important;
            flex-shrink: 0 !important;
        }
        .fancord-bar-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            color: #ffffff !important;
        }
        .fancord-seek-slider {
            flex: 1 !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            background: rgba(255, 255, 255, 0.25) !important;
            border-radius: 3px !important;
            height: 4px !important;
            outline: none !important;
            cursor: pointer !important;
            transition: height 0.15s ease !important;
        }
        .fancord-seek-slider:hover {
            height: 6px !important;
        }
        .fancord-seek-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 12px !important;
            height: 12px !important;
            border-radius: 50% !important;
            background: #fe2c55 !important;
            cursor: pointer !important;
            box-shadow: 0 0 6px rgba(254, 44, 85, 0.8) !important;
        }
        .fancord-vol-slider {
            width: 65px !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            background: rgba(255, 255, 255, 0.25) !important;
            border-radius: 3px !important;
            height: 4px !important;
            outline: none !important;
            cursor: pointer !important;
            flex-shrink: 0 !important;
        }
        .fancord-vol-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 11px !important;
            height: 11px !important;
            border-radius: 50% !important;
            background: #5865f2 !important;
            cursor: pointer !important;
        }
        .fancord-time-txt {
            font-size: 11px !important;
            color: #b5bac1 !important;
            font-variant-numeric: tabular-nums !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
        }
        .fancord-speed-btn {
            font-size: 11px !important;
            font-weight: 700 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            background: rgba(255,255,255,0.08) !important;
            cursor: pointer !important;
            white-space: nowrap !important;
            border: none !important;
            color: #dbdee1 !important;
            flex-shrink: 0 !important;
        }
        .fancord-speed-btn:hover {
            background: rgba(255,255,255,0.18) !important;
            color: #fff !important;
        }
    `;

    tikTokWin.webContents.insertCSS(customCss);

    // 2. كود الشريط العلوي + شريط التحكم في الفيديو
    const customJs = `
        (() => {
            let isSidebarHidden = true;

            function findSidebar() {
                const selectors = [
                    '[data-e2e="nav-side-bar"]',
                    '[data-e2e*="side-nav"]',
                    '[data-e2e*="sidebar"]',
                    'div[class*="SideNavContainer"]',
                    'div[class*="DivNavWrapper"]',
                    'div[class*="SideNav"]',
                    'aside',
                    'nav'
                ];
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el && el.getBoundingClientRect().width > 20 && el.getBoundingClientRect().width < 320) {
                        return el;
                    }
                }
                const links = document.querySelectorAll('a[href*="/explore"], a[href="/"]');
                for (const link of links) {
                    const container = link.closest('aside, nav, div[class*="Container"], div[class*="Wrapper"]');
                    if (container) {
                        const rect = container.getBoundingClientRect();
                        if (rect.left <= 20 && rect.width > 20 && rect.width < 320) {
                            return container;
                        }
                    }
                }
                return null;
            }

            function updateSidebarState() {
                if (isSidebarHidden) {
                    document.documentElement.classList.add("fancord-hide-sidebar");
                    document.body?.classList.add("fancord-hide-sidebar");
                } else {
                    document.documentElement.classList.remove("fancord-hide-sidebar");
                    document.body?.classList.remove("fancord-hide-sidebar");
                }

                const sb = findSidebar();
                if (sb) {
                    if (isSidebarHidden) {
                        sb.style.setProperty("display", "none", "important");
                        sb.style.setProperty("width", "0px", "important");
                        sb.style.setProperty("visibility", "hidden", "important");
                    } else {
                        sb.style.removeProperty("display");
                        sb.style.removeProperty("width");
                        sb.style.removeProperty("visibility");
                    }
                }

                const toggleBtn = document.getElementById("fancord-sidebar-toggle-btn");
                if (toggleBtn) {
                    toggleBtn.style.color = isSidebarHidden ? "#949ba4" : "#5865f2";
                    toggleBtn.style.backgroundColor = isSidebarHidden ? "transparent" : "#2b2d31";
                }
            }

            // إنشاء الشريط العلوي
            if (!document.getElementById("fancord-top-bar")) {
                const bar = document.createElement("div");
                bar.id = "fancord-top-bar";
                bar.innerHTML = \`
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button id="fancord-sidebar-toggle-btn" class="fancord-btn" title="إظهار / إخفاء القائمة الجانبية">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                            </svg>
                        </button>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" style="flex-shrink: 0;">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47V11.2a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.45-1.55 4.75 4.75 0 0 1-1.12-2.78h3.57v1.7z" />
                        </svg>
                        <span style="font-weight: 700; font-size: 13px; color: #f2f3f5; letter-spacing: 0.3px;">TikTok</span>
                        <span style="color: #4e5058; font-size: 13px;">|</span>
                        <span style="font-weight: 600; font-size: 12px; color: #5865f2;">FanCord</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <button id="fancord-reload-btn" class="fancord-btn" title="إعادة تحميل (Reload)">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                            </svg>
                        </button>
                        <button id="fancord-close-btn" class="fancord-btn fancord-close-btn" title="إغلاق (Esc)">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"/>
                            </svg>
                        </button>
                    </div>
                \`;
                document.body.prepend(bar);

                document.getElementById("fancord-sidebar-toggle-btn")?.addEventListener("click", () => {
                    isSidebarHidden = !isSidebarHidden;
                    updateSidebarState();
                });

                document.getElementById("fancord-reload-btn")?.addEventListener("click", () => {
                    window.location.reload();
                });

                document.getElementById("fancord-close-btn")?.addEventListener("click", () => {
                    console.log("__FANCORD_TIKTOK_CLOSE__");
                });
            }

            updateSidebarState();

            // 3. إنشاء شريط التحكم المباشر بالفيديو والصوت (FanCord Video Bar)
            function getActiveVideo() {
                const videos = Array.from(document.querySelectorAll("video"));
                if (!videos.length) return null;
                const playing = videos.find(v => !v.paused && v.readyState > 2);
                if (playing) return playing;
                const vh = window.innerHeight / 2;
                return videos.sort((a, b) => {
                    const ra = a.getBoundingClientRect();
                    const rb = b.getBoundingClientRect();
                    return Math.abs((ra.top + ra.height / 2) - vh) - Math.abs((rb.top + rb.height / 2) - vh);
                })[0];
            }

            function formatTime(sec) {
                if (!sec || isNaN(sec)) return "0:00";
                const m = Math.floor(sec / 60);
                const s = Math.floor(sec % 60);
                return m + ":" + (s < 10 ? "0" : "") + s;
            }

            if (!document.getElementById("fancord-video-bar")) {
                const vBar = document.createElement("div");
                vBar.id = "fancord-video-bar";
                vBar.innerHTML = \`
                    <!-- زر التشغيل والإيقاف المؤقت -->
                    <button id="fancord-play-btn" class="fancord-bar-btn" title="تشغيل / إيقاف مؤقت (Space)">
                        <svg id="fancord-play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg id="fancord-pause-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                    </button>

                    <!-- عداد الوقت -->
                    <span id="fancord-time-display" class="fancord-time-txt">0:00 / 0:00</span>

                    <!-- شريط تقديم وتأخير الفيديو -->
                    <input id="fancord-seek-bar" class="fancord-seek-slider" type="range" min="0" max="100" value="0" step="0.1" title="تقديم وتأخير الفيديو">

                    <!-- زر ومؤشر كتم الصوت -->
                    <button id="fancord-mute-btn" class="fancord-bar-btn" title="كتم / تشغيل الصوت (M)">
                        <svg id="fancord-vol-high" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                        <svg id="fancord-vol-mute" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: none; color: #fe2c55;">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                    </button>

                    <!-- شريط التحكم بمستوى الصوت -->
                    <input id="fancord-vol-bar" class="fancord-vol-slider" type="range" min="0" max="1" step="0.05" value="0.8" title="مستوى الصوت">

                    <!-- زر السرعة -->
                    <button id="fancord-speed-btn" class="fancord-speed-btn" title="سرعة التشغيل">1x</button>
                \`;
                document.body.appendChild(vBar);

                const playBtn = document.getElementById("fancord-play-btn");
                const playIcon = document.getElementById("fancord-play-icon");
                const pauseIcon = document.getElementById("fancord-pause-icon");
                const timeDisp = document.getElementById("fancord-time-display");
                const seekBar = document.getElementById("fancord-seek-bar");
                const muteBtn = document.getElementById("fancord-mute-btn");
                const volHigh = document.getElementById("fancord-vol-high");
                const volMute = document.getElementById("fancord-vol-mute");
                const volBar = document.getElementById("fancord-vol-bar");
                const speedBtn = document.getElementById("fancord-speed-btn");

                let isSeeking = false;
                const speeds = [1, 1.25, 1.5, 2];
                let speedIdx = 0;

                // استرجاع الإعدادات المحفوظة للصوت
                const savedVol = parseFloat(localStorage.getItem("fancord_tiktok_vol") || "0.8");
                volBar.value = savedVol.toString();

                function updateVolumeUI(vol, muted) {
                    if (muted || vol === 0) {
                        volHigh.style.display = "none";
                        volMute.style.display = "block";
                    } else {
                        volHigh.style.display = "block";
                        volMute.style.display = "none";
                    }
                }

                // زر التشغيل والإيقاف المؤقت
                playBtn.addEventListener("click", () => {
                    const v = getActiveVideo();
                    if (!v) return;
                    if (v.paused) v.play(); else v.pause();
                });

                // شريط التقديم والتأخير
                seekBar.addEventListener("input", (e) => {
                    isSeeking = true;
                    const v = getActiveVideo();
                    if (v && v.duration) {
                        const target = (parseFloat(e.target.value) / 100) * v.duration;
                        timeDisp.textContent = formatTime(target) + " / " + formatTime(v.duration);
                    }
                });

                seekBar.addEventListener("change", (e) => {
                    const v = getActiveVideo();
                    if (v && v.duration) {
                        v.currentTime = (parseFloat(e.target.value) / 100) * v.duration;
                    }
                    isSeeking = false;
                });

                // زر ومؤشر الصوت
                muteBtn.addEventListener("click", () => {
                    const v = getActiveVideo();
                    if (!v) return;
                    v.muted = !v.muted;
                    localStorage.setItem("fancord_tiktok_muted", v.muted ? "true" : "false");
                    updateVolumeUI(v.volume, v.muted);
                });

                volBar.addEventListener("input", (e) => {
                    const val = parseFloat(e.target.value);
                    const v = getActiveVideo();
                    if (v) {
                        v.volume = val;
                        v.muted = (val === 0);
                    }
                    localStorage.setItem("fancord_tiktok_vol", val.toString());
                    localStorage.setItem("fancord_tiktok_muted", val === 0 ? "true" : "false");
                    updateVolumeUI(val, val === 0);
                });

                // زر تبديل السرعة
                speedBtn.addEventListener("click", () => {
                    speedIdx = (speedIdx + 1) % speeds.length;
                    const curSpeed = speeds[speedIdx];
                    speedBtn.textContent = curSpeed + "x";
                    const v = getActiveVideo();
                    if (v) v.playbackRate = curSpeed;
                });

                // مزامنة حالة الفيديو دورياً
                setInterval(() => {
                    const v = getActiveVideo();
                    if (!v) return;

                    // تطبيق مستوى الصوت المحفوظ على أي فيديو جديد
                    if (!v.__fancordInitialized) {
                        v.volume = parseFloat(volBar.value);
                        v.muted = localStorage.getItem("fancord_tiktok_muted") === "true";
                        v.playbackRate = speeds[speedIdx];
                        v.__fancordInitialized = true;
                    }

                    if (!isSeeking && v.duration) {
                        seekBar.value = ((v.currentTime / v.duration) * 100).toString();
                        timeDisp.textContent = formatTime(v.currentTime) + " / " + formatTime(v.duration);
                    }

                    if (v.paused) {
                        playIcon.style.display = "block";
                        pauseIcon.style.display = "none";
                    } else {
                        playIcon.style.display = "none";
                        pauseIcon.style.display = "block";
                    }

                    updateVolumeUI(v.volume, v.muted);
                }, 200);

                // إخفاء الشريط تلقائياً عند عدم تحريك الفأرة
                let hideTimeout = null;
                function resetHideTimer() {
                    vBar.classList.remove("fancord-faded");
                    clearTimeout(hideTimeout);
                    hideTimeout = setTimeout(() => {
                        vBar.classList.add("fancord-faded");
                    }, 3500);
                }

                window.addEventListener("mousemove", resetHideTimer);
                vBar.addEventListener("mouseenter", () => {
                    clearTimeout(hideTimeout);
                    vBar.classList.remove("fancord-faded");
                });
                vBar.addEventListener("mouseleave", resetHideTimer);
                resetHideTimer();

                // اختصارات لوحة المفاتيح
                window.addEventListener("keydown", (e) => {
                    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
                    const v = getActiveVideo();
                    if (!v) return;

                    if (e.code === "Space" || e.key === "k") {
                        e.preventDefault();
                        if (v.paused) v.play(); else v.pause();
                        resetHideTimer();
                    } else if (e.key === "m" || e.key === "M") {
                        v.muted = !v.muted;
                        updateVolumeUI(v.volume, v.muted);
                        resetHideTimer();
                    } else if (e.key === "ArrowRight") {
                        v.currentTime = Math.min(v.duration, v.currentTime + 5);
                        resetHideTimer();
                    } else if (e.key === "ArrowLeft") {
                        v.currentTime = Math.max(0, v.currentTime - 5);
                        resetHideTimer();
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        const nVol = Math.min(1, v.volume + 0.1);
                        v.volume = nVol;
                        v.muted = false;
                        volBar.value = nVol.toString();
                        localStorage.setItem("fancord_tiktok_vol", nVol.toString());
                        updateVolumeUI(nVol, false);
                        resetHideTimer();
                    } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        const nVol = Math.max(0, v.volume - 0.1);
                        v.volume = nVol;
                        volBar.value = nVol.toString();
                        localStorage.setItem("fancord_tiktok_vol", nVol.toString());
                        updateVolumeUI(nVol, nVol === 0);
                        resetHideTimer();
                    }
                });
            }
        })();
    `;

    tikTokWin.webContents.executeJavaScript(customJs);
}

export function toggleTikTok(): boolean {
    if (tikTokWin && !tikTokWin.isDestroyed()) {
        tikTokWin.close();
        tikTokWin = null;
        return false;
    }

    const discordWin = getDiscordWindow();
    const bounds = discordWin ? discordWin.getBounds() : { x: 100, y: 100, width: 1200, height: 800 };

    currentPanelWidth = loadSavedWidth();

    tikTokWin = new BrowserWindow({
        width: currentPanelWidth,
        height: Math.max(500, bounds.height - TITLEBAR_OFFSET - 4),
        x: bounds.x + bounds.width - currentPanelWidth,
        y: bounds.y + TITLEBAR_OFFSET,
        parent: discordWin || undefined,
        frame: false,
        resizable: true,
        minWidth: 380,
        maxWidth: 1200,
        skipTaskbar: true,
        backgroundColor: "#111214",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            partition: "persist:fancord_tiktok"
        }
    });

    // استخدام هوية Chrome Desktop رسمية لتيك توك
    const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    tikTokWin.webContents.setUserAgent(DESKTOP_UA);

    tikTokWin.loadURL("https://www.tiktok.com");

    tikTokWin.webContents.on("dom-ready", injectCustomUI);
    tikTokWin.webContents.on("did-navigate-in-page", injectCustomUI);

    tikTokWin.on("resize", () => {
        if (!tikTokWin || tikTokWin.isDestroyed()) return;
        const [newWidth] = tikTokWin.getSize();
        if (newWidth !== currentPanelWidth) {
            currentPanelWidth = newWidth;
            saveCurrentWidth(newWidth);
        }
    });

    tikTokWin.webContents.on("console-message", (_event, _level, message) => {
        if (message.includes("__FANCORD_TIKTOK_CLOSE__")) {
            tikTokWin?.close();
        }
    });

    tikTokWin.webContents.on("before-input-event", (_event, input) => {
        if (input.key === "Escape") {
            tikTokWin?.close();
        }
    });

    if (discordWin) {
        const syncBounds = () => {
            if (!tikTokWin || tikTokWin.isDestroyed() || !discordWin || discordWin.isDestroyed()) return;
            const b = discordWin.getBounds();
            tikTokWin.setBounds({
                x: b.x + b.width - currentPanelWidth,
                y: b.y + TITLEBAR_OFFSET,
                width: currentPanelWidth,
                height: Math.max(500, b.height - TITLEBAR_OFFSET - 4)
            });
        };

        discordWin.on("move", syncBounds);
        discordWin.on("resize", syncBounds);
    }

    tikTokWin.on("closed", () => {
        tikTokWin = null;
    });

    return true;
}

export function closeTikTok() {
    if (tikTokWin && !tikTokWin.isDestroyed()) {
        tikTokWin.close();
        tikTokWin = null;
    }
}