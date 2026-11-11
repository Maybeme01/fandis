/*
 * FanCord UI Tweaks
 * Hides GitHub and Web icons from all Plugin Settings globally.
 */

import definePlugin, { StartAt } from "@utils/types";

export default definePlugin({
    name: "HideSocialIcons",
    description: "يخفي أيقونات GitHub وموقع الويب من جميع إعدادات البلوقنات.",
    authors: [{ name: "FAN", id: 0n }],
    enabledByDefault: true,
    startAt: StartAt.Init,

    start() {
        if (typeof document === "undefined") return;

        // حقن كود CSS عام يستهدف الأيقونات بجوار زر Reset ويخفيها
        const style = document.createElement("style");
        style.id = "fancord-hide-social-icons";
        style.textContent = `
            /* استهداف الروابط التي تظهر بجوار زر Reset في نافذة الإعدادات */
            div[class*="vc-settings-footer"] a[href*="github.com"],
            div[class*="vc-settings-footer"] a[href*="http"],
            div[class*="footer_"] a[href*="github.com"],
            div[class*="footer_"] a[href*="http"],
            /* محدد عام لأي أيقونات SVG تمثل GitHub أو الويب في الإعدادات */
            [class*="vc-settings"] svg path[d*="M12 .3a12"],
            [class*="vc-settings"] svg path[d*="M12 2C6.48 2 2"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    stop() {
        document.getElementById("fancord-hide-social-icons")?.remove();
    }
});