/*
 * TikTok Viewer Plugin for FanCord
 * Located in: src/fanplugins/tikTokViewer/index.tsx
 */

import { HeaderBarButton } from "@api/HeaderBar";
import definePlugin from "@utils/types";
import { React } from "@webpack/common";

function TikTokIcon(props: any) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47V11.2a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.45-1.55 4.75 4.75 0 0 1-1.12-2.78h3.57v1.7z" />
        </svg>
    );
}

function handleToggle() {
    const Native = (VencordNative?.pluginHelpers as any)?.TikTokViewer ??
                   (VencordNative?.pluginHelpers as any)?.tikTokViewer;

    if (Native?.toggleTikTok) {
        Native.toggleTikTok().catch(() => {
            window.open("https://www.tiktok.com", "FanCordTikTok", "width=440,height=800,menubar=no,toolbar=no");
        });
    } else {
        window.open("https://www.tiktok.com", "FanCordTikTok", "width=440,height=800,menubar=no,toolbar=no");
    }
}

function TikTokHeaderButton() {
    return (
        <HeaderBarButton
            icon={TikTokIcon}
            tooltip="تيك توك المدمج (TikTok)"
            onClick={handleToggle}
        />
    );
}

export default definePlugin({
    name: "TikTokViewer",
    description: "لوحة جانبية مدمجة لتصفح تيك توك داخل نافذة ديسكورد مباشرة مع حفظ الحساب",
    authors: [{ name: "FAN", id: 0n }],
    enabledByDefault: false,

    headerBarButton: {
        icon: TikTokIcon,
        render: () => <TikTokHeaderButton />
    },

    toolboxActions: {
        "تبديل لوحة تيك توك (TikTok Drawer)": () => handleToggle()
    },

    start() {
        this.keyHandler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && (e.key === "t" || e.key === "T")) {
                e.preventDefault();
                handleToggle();
            }
        };
        window.addEventListener("keydown", this.keyHandler);
    },

    stop() {
        if (this.keyHandler) {
            window.removeEventListener("keydown", this.keyHandler);
        }
        const Native = (VencordNative?.pluginHelpers as any)?.TikTokViewer;
        Native?.closeTikTok?.();
    }
});

