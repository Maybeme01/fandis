/*
 * TikTok Native Docked Panel for FanCord
 * Located in: src/fanplugins/tikTokViewer/native.ts
 */

import { BrowserWindow, app } from "electron";
import fs from "fs";
import path from "path";

let tikTokWin: BrowserWindow | null = null;
const TITLEBAR_OFFSET = 36;
const DEFAULT_WIDTH = 580; // الحجم الافتراضي الأكبر والأنسب

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

    // 1. تنسيقات الستايل وإخفاء القائمة اليسرى
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
        body {
            padding-top: 42px !important;
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

        /* إخفاء القائمة الجانبية في تيك توك وتوسيع مساحة الفيديو */
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
    `;

    tikTokWin.webContents.insertCSS(customCss);

    // 2. كود الشريط العلوي وزر تبديل القائمة الجانبية
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
                    toggleBtn.title = isSidebarHidden ? "إظهار القائمة الجانبية (Show Sidebar)" : "إخفاء القائمة الجانبية (Hide Sidebar)";
                }
            }

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

            // مراقبة أي تحديث للمحتوى لضمان استمرار إخفاء القائمة
            if (!window.__fancordSidebarObserver) {
                window.__fancordSidebarObserver = new MutationObserver(() => {
                    if (isSidebarHidden) updateSidebarState();
                });
                window.__fancordSidebarObserver.observe(document.body || document.documentElement, {
                    childList: true,
                    subtree: true
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

    tikTokWin.loadURL("https://www.tiktok.com");

    tikTokWin.webContents.on("dom-ready", injectCustomUI);
    tikTokWin.webContents.on("did-navigate-in-page", injectCustomUI);

    // حفظ الحجم تلقائياً عند قيام المستخدم بتكبير أو تصغير اللوحة
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
