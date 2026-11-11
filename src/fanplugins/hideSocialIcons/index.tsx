import definePlugin, { StartAt } from "@utils/types";

export default definePlugin({
    name: "HideSocialIcons",
    description: "إخفاء أيقونات GitHub وموقع الويب من إعدادات الإضافات.",
    authors: [{ name: "FAN", id: 0n }],
    enabledByDefault: true,
    startAt: StartAt.Init,

    start() {
        const style = document.createElement("style");
        style.id = "hide-social-icons-style";
        style.textContent = `
            .vc-settings-footer-links {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    stop() {
        document.getElementById("hide-social-icons-style")?.remove();
    }
});