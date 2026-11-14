import fs from "fs";
import path from "path";

const appData = process.env.APPDATA;
const themePath = path.join(appData, "FanCord", "themes", "My-Custom-Theme.theme.css");

if (fs.existsSync(themePath)) {
    let content = fs.readFileSync(themePath, "utf8");
    if (!content.includes("@fancord-config")) {
        // Embed the base custom config
        const baseConfig = {
            name: "My-Custom-Theme",
            author: ".FAN",
            description: "A personalized custom theme created with FanCord Theme Studio.",
            version: "1.0.0",
            useImage: true,
            imageUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
            bgFit: "cover",
            bgPosition: "center center",
            bgBlur: 0,
            bgBrightness: 100,
            bgContrast: 100,
            bgSaturation: 100,
            overlayOpacity: 0.35,
            glassBlur: 8,
            wallpaperScope: "full",
            chatOpacity: 0.25,
            sidebarOpacity: 0.45,
            serversOpacity: 0.6,
            headerOpacity: 0.75,
            inputOpacity: 0.7,
            settingsOpacity: 0.85,
            membersOpacity: 0.45,
            popoutsOpacity: 0.85,
            foldersOpacity: 0.65,
            voiceCallOpacity: 0.35,
            profilePanelOpacity: 0.75,
            loungeOpacity: 0.35,
            friendsOpacity: 0.15,
            nowPlayingOpacity: 0.25,
            accentColor: "#8a5cf6",
            chatBg: "#120e1e",
            sidebarBg: "#0d0a15",
            serversBg: "#08060e",
            headerBg: "#161124",
            inputBg: "#1e1730",
            primaryText: "#f3e8ff",
            mutedText: "#a78bfa",
            hoverBg: "rgba(138, 92, 246, 0.15)",
            borderRadius: 8,
            speakerGlowColor: "#23a55a",
            mentionColor: "#8a5cf6",
            fontFamily: "default",
            customFontName: "MyCustomFont",
            customFontData: "",
            neonGlow: true,
            neonIntensity: 14,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        };

        const configComment = `\n/* @fancord-config: ${JSON.stringify(baseConfig)} */\n`;
        // Insert after the BD header
        const endHeaderIdx = content.indexOf("*/");
        if (endHeaderIdx !== -1) {
            content = content.slice(0, endHeaderIdx + 2) + configComment + content.slice(endHeaderIdx + 2);
            fs.writeFileSync(themePath, content, "utf8");
            console.log("Successfully embedded @fancord-config into My-Custom-Theme.theme.css");
        }
    } else {
        console.log("@fancord-config already present");
    }
}

