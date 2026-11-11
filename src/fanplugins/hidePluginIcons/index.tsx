/*
 * HidePluginIcons Plugin for FanCord
 * Hides the Website and GitHub icons from all plugin settings modals.
 * Located in: src/fanplugins/hidePluginIcons/index.tsx
 */

import definePlugin, { StartAt } from "@utils/types";

export default definePlugin({
    name: "HidePluginIcons",
    description: "يخفي أيقونات موقع الويب و GitHub من نوافذ إعدادات الإضافات.",
    authors: [{ name: "FAN", id: 0n }],
    enabledByDefault: true,
    startAt: StartAt.Init,

    start() {
        const style = document.createElement("style");
        style.id = "fancord-hide-plugin-icons";
        // هذا الـ CSS يستهدف الأزرار التي تحتوي على أيقونات الويب و GitHub في أسفل نافذة الإعدادات
        // ويخفيها. نحن نستهدف الأزرار بناءً على الـ SVG path أو الروابط إذا أمكن، 
        // أو نستهدف الحاوية التي تضمها.
        style.textContent = `
            /* إخفاء الأزرار التي توجه إلى github.com أو تحتوي على أيقونات محددة في الفوتر */
            [class*="footer_"] a[href*="github.com"],
            [class*="footer_"] a[href^="http"]:not([href*="discord.com"]) {
                display: none !important;
            }
            
            /* طريقة بديلة إذا كانت الأزرار ليست روابط <a> بل أزرار <button> */
            [class*="footer_"] button svg path[d^="M12 2C6.477 2 2"], /* GitHub Icon Path */
            [class*="footer_"] button svg path[d^="M12 2C6.48 2 2"] /* Globe/Web Icon Path */
            {
                display: none !important;
            }
            
            /* إخفاء الأزرار الحاوية للأيقونات مباشرة عن طريق تحديد موقعها في الفوتر */
            [class*="footer_"] > div > button:nth-last-child(1),
            [class*="footer_"] > div > button:nth-last-child(2) {
                 display: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    stop() {
        document.getElementById("fancord-hide-plugin-icons")?.remove();
    }
});