/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ThemeCreatorModal.css";

import { Settings } from "@api/Settings";
import { initThemes } from "@api/Themes";
import { copyWithToast } from "@utils/discord";
import { isArabicMode, t } from "@utils/esharqI18n";
import { Modal, openModal, React, showToast, UserStore, useState } from "@webpack/common";

export interface ThemeConfig {
    name: string;
    author: string;
    description: string;
    version: string;

    // Background Image & Animated GIF
    useImage: boolean;
    imageUrl: string;
    bgFit: "cover" | "contain" | "repeat" | "center";
    bgBlur: number;
    bgBrightness: number;
    overlayOpacity: number;
    glassBlur: number;
    wallpaperScope: "full" | "chat" | "chatAndSidebar" | "sidebar";

    // Granular Opacities
    chatOpacity: number;
    sidebarOpacity: number;
    serversOpacity: number;
    headerOpacity: number;
    inputOpacity: number;
    settingsOpacity: number;
    membersOpacity: number;
    popoutsOpacity: number;
    foldersOpacity?: number;
    voiceCallOpacity?: number;

    // Colors
    accentColor: string;
    chatBg: string;
    sidebarBg: string;
    serversBg: string;
    headerBg: string;
    inputBg: string;
    primaryText: string;
    mutedText: string;
    hoverBg: string;
    borderRadius: number;

    // Visual Flair & Typography
    fontFamily: string;
    customFontName: string;
    customFontData: string;
    neonGlow: boolean;
    glassBorders: boolean;
    customScrollbars: boolean;
    compactMessages: boolean;
}

export function getFontOptions() {
    return [
        {
            id: "default",
            name: t("ديسكورد الافتراضي (Discord Default)", "Discord Default"),
            family: "",
            desc: t("خط النظام الافتراضي المدمج في ديسكورد", "Default system font built into Discord")
        },
        {
            id: "custom",
            name: t("📁 خط مخصص مرفوع من جهازك (Custom Uploaded)", "📁 Custom Uploaded Font File"),
            family: "custom",
            desc: t("استخدام ملف خط خاص قمت برفعه بصيغة TTF أو WOFF2", "Use a custom font file uploaded from your PC (.ttf, .otf, .woff2)")
        },
        {
            id: "Cairo",
            name: t("خط كايرو العصري (Cairo)", "Cairo Modern"),
            family: "'Cairo', sans-serif",
            googleFont: "Cairo:wght@400;600;700;800",
            desc: t("خط عربي حديث، جريء وممتاز للعناوين والواجهات", "Modern, bold font excellent for titles and apps")
        },
        {
            id: "Tajawal",
            name: t("خط تجوال الأنيق والناعم (Tajawal)", "Tajawal Elegant"),
            family: "'Tajawal', sans-serif",
            googleFont: "Tajawal:wght@400;500;700",
            desc: t("انسيابي، مريح جداً للقراءة والدردشة الطويلة", "Smooth, highly legible and comfortable for reading")
        },
        {
            id: "Almarai",
            name: t("خط المراعي المتزن (Almarai)", "Almarai Professional"),
            family: "'Almarai', sans-serif",
            googleFont: "Almarai:wght@400;700;800",
            desc: t("أنيق، فخم ومتناسق مع الشاشات العريضة", "Balanced, elegant and clean for widescreen layouts")
        },
        {
            id: "Readex Pro",
            name: t("خط ريدكس برو الحديث (Readex Pro)", "Readex Pro"),
            family: "'Readex Pro', sans-serif",
            googleFont: "Readex+Pro:wght@400;600;700",
            desc: t("تصميم هندسي حديث فائق النقاء والوضوح", "Modern geometric design with optimal clarity")
        },
        {
            id: "Alexandria",
            name: t("خط الإسكندرية (Alexandria)", "Alexandria"),
            family: "'Alexandria', sans-serif",
            googleFont: "Alexandria:wght@400;600;700",
            desc: t("حروف هندسية واضحة ومتباعدة بدقة", "Clean geometric characters with precise spacing")
        },
        {
            id: "Inter",
            name: t("خط إنتر العالمي (Inter)", "Inter Modern"),
            family: "'Inter', sans-serif",
            googleFont: "Inter:wght@400;500;600;700",
            desc: t("الخط المفضل لأشهر واجهات وتطبيقات التقنية", "The gold standard typeface for modern apps")
        },
        {
            id: "JetBrains Mono",
            name: t("خط المبرمجين (JetBrains Mono)", "JetBrains Mono"),
            family: "'JetBrains Mono', monospace",
            googleFont: "JetBrains+Mono:wght@400;600;700",
            desc: t("خط أحادي المسافة فخم ومريح لعشاق البرمجة", "Developer-focused monospaced typeface")
        },
        {
            id: "Outfit",
            name: t("خط آوتفت العصري (Outfit)", "Outfit Dynamic"),
            family: "'Outfit', sans-serif",
            googleFont: "Outfit:wght@400;600;700",
            desc: t("خط ناعم وديناميكي يضفي لمسة عصرية جذابة", "Dynamic contemporary sans-serif typeface")
        }
    ];
}

export function getCompleteAesthetics() {
    return [
        {
            id: "sakura",
            name: t("🌸 ساكورا الأنمي الوردية", "🌸 Anime Sakura"),
            badge: t("GIF متحرك", "Animated GIF"),
            desc: t(
                "ألوان وردية أنمي لطيفة مع تساقط زهور الكرز المتحركة وزجاج ناعم وخط تجوال",
                "Cute anime pink aesthetic with animated falling cherry blossoms, soft glass and Tajawal font"
            ),
            accentColor: "#f472b6",
            chatBg: "#1c1017",
            sidebarBg: "#150a10",
            serversBg: "#0f060b",
            headerBg: "#22131c",
            inputBg: "#2a1623",
            primaryText: "#fce7f3",
            mutedText: "#f9a8d4",
            hoverBg: "rgba(244, 114, 182, 0.18)",
            borderRadius: 14,
            useImage: true,
            imageUrl: "https://media.giphy.com/media/3oEduV4SOS9mmmIOkw/giphy.gif",
            wallpaperScope: "full" as const,
            chatOpacity: 0.22,
            sidebarOpacity: 0.45,
            serversOpacity: 0.6,
            headerOpacity: 0.75,
            inputOpacity: 0.7,
            settingsOpacity: 0.85,
            membersOpacity: 0.45,
            popoutsOpacity: 0.85,
            foldersOpacity: 0.6,
            voiceCallOpacity: 0.35,
            glassBlur: 10,
            bgBlur: 0,
            bgBrightness: 100,
            overlayOpacity: 0.35,
            fontFamily: "Tajawal",
            neonGlow: true,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        },
        {
            id: "cyberpunk",
            name: t("⚡ سايبربنك نيون 2077", "⚡ Cyberpunk 2077"),
            badge: t("نيون مستقبلي", "Futuristic Neon"),
            desc: t(
                "أضواء نيون سيان وفوشي ساطعة مع خلفية أمطار المدينة المستقبلية وخط كايرو وتوهج نيون",
                "Vibrant cyan and magenta neon lights with cyberpunk rain city animated GIF and neon luminescence"
            ),
            accentColor: "#00f5ff",
            chatBg: "#0a0e17",
            sidebarBg: "#06090f",
            serversBg: "#030508",
            headerBg: "#0f1422",
            inputBg: "#131b2e",
            primaryText: "#e0f7fa",
            mutedText: "#ff007f",
            hoverBg: "rgba(0, 245, 255, 0.2)",
            borderRadius: 6,
            useImage: true,
            imageUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
            wallpaperScope: "full" as const,
            chatOpacity: 0.18,
            sidebarOpacity: 0.4,
            serversOpacity: 0.55,
            headerOpacity: 0.7,
            inputOpacity: 0.65,
            settingsOpacity: 0.8,
            membersOpacity: 0.4,
            popoutsOpacity: 0.8,
            foldersOpacity: 0.55,
            voiceCallOpacity: 0.3,
            glassBlur: 8,
            bgBlur: 0,
            bgBrightness: 105,
            overlayOpacity: 0.4,
            fontFamily: "Cairo",
            neonGlow: true,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        },
        {
            id: "lofi",
            name: t("🌧️ لوفي ومطر الاسترخاء", "🌧️ Lo-Fi Chill Rain"),
            badge: t("استرخاء وهدوء", "Chill & Focus"),
            desc: t(
                "أجواء دافئة مريحة للدراسة والألعاب مع نافذة المطر المتحركة وخط ريدكس برو وزجاج ضبابي",
                "Warm soothing tones with relaxing animated rainy window GIF, Readex Pro font and frosted glass"
            ),
            accentColor: "#f59e0b",
            chatBg: "#14101a",
            sidebarBg: "#0e0b12",
            serversBg: "#09070c",
            headerBg: "#1a1522",
            inputBg: "#221c2d",
            primaryText: "#fef3c7",
            mutedText: "#d1a8ff",
            hoverBg: "rgba(245, 158, 11, 0.16)",
            borderRadius: 12,
            useImage: true,
            imageUrl: "https://media.giphy.com/media/L3ERvA6jWCd0qO4NdX/giphy.gif",
            wallpaperScope: "full" as const,
            chatOpacity: 0.25,
            sidebarOpacity: 0.5,
            serversOpacity: 0.65,
            headerOpacity: 0.8,
            inputOpacity: 0.75,
            settingsOpacity: 0.85,
            membersOpacity: 0.5,
            popoutsOpacity: 0.85,
            foldersOpacity: 0.65,
            voiceCallOpacity: 0.35,
            glassBlur: 12,
            bgBlur: 1,
            bgBrightness: 95,
            overlayOpacity: 0.4,
            fontFamily: "Readex Pro",
            neonGlow: false,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        },
        {
            id: "cosmic",
            name: t("🌌 سديم الفضاء الملكي", "🌌 Cosmic Deep Space"),
            badge: t("فضاء ساحر", "Deep Space"),
            desc: t(
                "ألوان ملكية بنفسجية عميقة مع سديم النجوم الفضائية المتحرك وخط المراعي وحدود أكريليك",
                "Deep royal purple aesthetic with animated galaxy stars nebula GIF, Almarai font and acrylic borders"
            ),
            accentColor: "#a855f7",
            chatBg: "#0e0a1a",
            sidebarBg: "#090612",
            serversBg: "#05030a",
            headerBg: "#140e26",
            inputBg: "#1c1433",
            primaryText: "#f3e8ff",
            mutedText: "#c084fc",
            hoverBg: "rgba(168, 85, 247, 0.2)",
            borderRadius: 12,
            useImage: true,
            imageUrl: "https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif",
            wallpaperScope: "full" as const,
            chatOpacity: 0.2,
            sidebarOpacity: 0.45,
            serversOpacity: 0.6,
            headerOpacity: 0.75,
            inputOpacity: 0.7,
            settingsOpacity: 0.85,
            membersOpacity: 0.45,
            popoutsOpacity: 0.85,
            foldersOpacity: 0.6,
            voiceCallOpacity: 0.35,
            glassBlur: 10,
            bgBlur: 0,
            bgBrightness: 110,
            overlayOpacity: 0.35,
            fontFamily: "Almarai",
            neonGlow: true,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        },
        {
            id: "obsidian",
            name: t("🖤 أسود نقي أوليد", "🖤 OLED Obsidian Stealth"),
            badge: t("توفير فائق للطاقة", "Battery Saver"),
            desc: t(
                "سواد فاحم نقي 100% بدون خلفية لراحة فائقة لشاشات OLED ومظهر تقني احترافي",
                "Pure absolute 100% black dark mode optimized for OLED screens with zero light glare"
            ),
            accentColor: "#5865f2",
            chatBg: "#000000",
            sidebarBg: "#000000",
            serversBg: "#000000",
            headerBg: "#050505",
            inputBg: "#0d0d0d",
            primaryText: "#ffffff",
            mutedText: "#8e9297",
            hoverBg: "rgba(255, 255, 255, 0.08)",
            borderRadius: 8,
            useImage: false,
            imageUrl: "",
            wallpaperScope: "full" as const,
            chatOpacity: 1,
            sidebarOpacity: 1,
            serversOpacity: 1,
            headerOpacity: 1,
            inputOpacity: 1,
            settingsOpacity: 1,
            membersOpacity: 1,
            popoutsOpacity: 1,
            foldersOpacity: 1,
            voiceCallOpacity: 1,
            glassBlur: 0,
            bgBlur: 0,
            bgBrightness: 100,
            overlayOpacity: 0,
            fontFamily: "JetBrains Mono",
            neonGlow: true,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        },
        {
            id: "emerald",
            name: t("🌲 غابة الزمرد الهادئة", "🌲 Emerald Zen Forest"),
            badge: t("طبيعة وتركيز", "Nature & Zen"),
            desc: t(
                "طبيعة هادئة وألوان خضراء زمردية تريح العين لساعات طويلة من العمل والدراسة",
                "Tranquil emerald greenery designed to soothe eye strain during long gaming or work sessions"
            ),
            accentColor: "#10b981",
            chatBg: "#061a14",
            sidebarBg: "#04130f",
            serversBg: "#020a08",
            headerBg: "#08221b",
            inputBg: "#0d2e24",
            primaryText: "#d1fae5",
            mutedText: "#6ee7b7",
            hoverBg: "rgba(16, 185, 129, 0.16)",
            borderRadius: 10,
            useImage: false,
            imageUrl: "",
            wallpaperScope: "full" as const,
            chatOpacity: 0.25,
            sidebarOpacity: 0.45,
            serversOpacity: 0.6,
            headerOpacity: 0.75,
            inputOpacity: 0.7,
            settingsOpacity: 0.85,
            membersOpacity: 0.45,
            popoutsOpacity: 0.85,
            foldersOpacity: 0.6,
            voiceCallOpacity: 0.35,
            glassBlur: 8,
            bgBlur: 0,
            bgBrightness: 100,
            overlayOpacity: 0.35,
            fontFamily: "Tajawal",
            neonGlow: false,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        },
        {
            id: "crimson",
            name: t("🩸 القرمزي الملكي الأسطوري", "🩸 Royal Crimson Blood"),
            badge: t("قوة وفخامة", "Royal Gaming"),
            desc: t(
                "أحمر ياقوتي وأسود فخم بتوهج نيون حماسي للألعاب وخط كايرو",
                "Bold ruby crimson and deep obsidian noir with energetic gaming neon luminescence"
            ),
            accentColor: "#ff2e4c",
            chatBg: "#160a0c",
            sidebarBg: "#100709",
            serversBg: "#0a0405",
            headerBg: "#1c0d10",
            inputBg: "#240f13",
            primaryText: "#ffe5e9",
            mutedText: "#ff6b81",
            hoverBg: "rgba(255, 46, 76, 0.18)",
            borderRadius: 8,
            useImage: false,
            imageUrl: "",
            wallpaperScope: "full" as const,
            chatOpacity: 0.25,
            sidebarOpacity: 0.45,
            serversOpacity: 0.6,
            headerOpacity: 0.75,
            inputOpacity: 0.7,
            settingsOpacity: 0.85,
            membersOpacity: 0.45,
            popoutsOpacity: 0.85,
            foldersOpacity: 0.6,
            voiceCallOpacity: 0.35,
            glassBlur: 8,
            bgBlur: 0,
            bgBrightness: 100,
            overlayOpacity: 0.35,
            fontFamily: "Cairo",
            neonGlow: true,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        },
        {
            id: "nordic",
            name: t("❄️ صقيع القطب الشمالي", "❄️ Nordic Arctic Frost"),
            badge: t("شتاء هادئ", "Arctic Chill"),
            desc: t(
                "أزرق ثلجي ناصع مع رمادي قطبي أنيق ومريح للعين وخط إنتر",
                "Crisp glacier cyan frost with tranquil arctic dusk slate grey and Inter typography"
            ),
            accentColor: "#88c0d0",
            chatBg: "#2e3440",
            sidebarBg: "#242933",
            serversBg: "#1e222a",
            headerBg: "#3b4252",
            inputBg: "#434c5e",
            primaryText: "#eceff4",
            mutedText: "#81a1c1",
            hoverBg: "rgba(136, 192, 208, 0.16)",
            borderRadius: 8,
            useImage: false,
            imageUrl: "",
            wallpaperScope: "full" as const,
            chatOpacity: 0.3,
            sidebarOpacity: 0.5,
            serversOpacity: 0.65,
            headerOpacity: 0.8,
            inputOpacity: 0.75,
            settingsOpacity: 0.85,
            membersOpacity: 0.5,
            popoutsOpacity: 0.85,
            foldersOpacity: 0.65,
            voiceCallOpacity: 0.35,
            glassBlur: 8,
            bgBlur: 0,
            bgBrightness: 100,
            overlayOpacity: 0.35,
            fontFamily: "Inter",
            neonGlow: false,
            glassBorders: true,
            customScrollbars: true,
            compactMessages: false
        }
    ];
}

export const THEME_PRESETS = [
    {
        name: "Midnight Violet",
        nameAr: "ليلكي ملكي فاخر",
        descAr: "طابع بنفسجي ليلي فخم يمنح ديسكورد مظهراً ملكياً مريحاً للعين.",
        descEn: "Royal midnight purple aesthetic offering relaxed viewing comfort.",
        accentColor: "#8a5cf6",
        chatBg: "#120e1e",
        sidebarBg: "#0d0a15",
        serversBg: "#08060e",
        headerBg: "#161124",
        inputBg: "#1e1730",
        primaryText: "#f3e8ff",
        mutedText: "#a78bfa",
        hoverBg: "rgba(138, 92, 246, 0.15)",
        borderRadius: 8
    },
    {
        name: "Cyberpunk Neon",
        nameAr: "سايبربنك نيون مستقبلي",
        descAr: "ألوان نيون سيان وفوشي ساطعة ومفعمة بالحيوية للألعاب والتقنية.",
        descEn: "Vibrant cyan & hot pink neon highlights for gamers and tech enthusiasts.",
        accentColor: "#00f5ff",
        chatBg: "#0a0e17",
        sidebarBg: "#06090f",
        serversBg: "#030508",
        headerBg: "#0f1422",
        inputBg: "#121b2b",
        primaryText: "#e0f7fa",
        mutedText: "#ff007f",
        hoverBg: "rgba(0, 245, 255, 0.15)",
        borderRadius: 4
    },
    {
        name: "AMOLED Obsidian",
        nameAr: "أسود نقي أوليد",
        descAr: "أسود مطلق 100% موفر للطاقة على شاشات OLED ومريح جداً في الظلام.",
        descEn: "Pure 100% deep black mode for OLED battery saving and dark environments.",
        accentColor: "#5865f2",
        chatBg: "#000000",
        sidebarBg: "#000000",
        serversBg: "#000000",
        headerBg: "#050505",
        inputBg: "#111111",
        primaryText: "#ffffff",
        mutedText: "#8e9297",
        hoverBg: "rgba(255, 255, 255, 0.08)",
        borderRadius: 6
    },
    {
        name: "Crimson Blood",
        nameAr: "أحمر قرمزي أسطوري",
        descAr: "ألوان دموية قوية بلمسات حمراء حماسية وعصرية.",
        descEn: "Fierce crimson red and rich dark contrast for energetic gaming vibe.",
        accentColor: "#ff2e4c",
        chatBg: "#160a0c",
        sidebarBg: "#100709",
        serversBg: "#0a0405",
        headerBg: "#1c0d10",
        inputBg: "#240f13",
        primaryText: "#ffe5e9",
        mutedText: "#ff6b81",
        hoverBg: "rgba(255, 46, 76, 0.15)",
        borderRadius: 8
    },
    {
        name: "Emerald Forest",
        nameAr: "غابة الزمرد الهادئة",
        descAr: "طبيعة ساحرة بألوان خضراء زمردية هادئة تساعد على التركيز.",
        descEn: "Soothing natural emerald hues designed for deep focus and studying.",
        accentColor: "#10b981",
        chatBg: "#061a14",
        sidebarBg: "#04130f",
        serversBg: "#020a08",
        headerBg: "#08221b",
        inputBg: "#0b2b22",
        primaryText: "#d1fae5",
        mutedText: "#6ee7b7",
        hoverBg: "rgba(16, 185, 129, 0.15)",
        borderRadius: 8
    },
    {
        name: "Sunset Amber",
        nameAr: "غروب كهرماني دافئ",
        descAr: "دفء شمس الغروب البرتقالية الذهبية مع خلفيات داكنة دافئة.",
        descEn: "Warm golden twilight amber glowing over cozy dark surfaces.",
        accentColor: "#f59e0b",
        chatBg: "#1c120c",
        sidebarBg: "#140d08",
        serversBg: "#0d0805",
        headerBg: "#241810",
        inputBg: "#2b1c12",
        primaryText: "#fef3c7",
        mutedText: "#fbbf24",
        hoverBg: "rgba(245, 158, 11, 0.15)",
        borderRadius: 8
    },
    {
        name: "Sakura Blossom",
        nameAr: "زهور الساكورا اليابانية",
        descAr: "طابع وردي لطيف مستوحى من زهور الكرز والأنمي الياباني.",
        descEn: "Delicate cherry blossom petal pink aesthetics inspired by Japanese anime.",
        accentColor: "#f472b6",
        chatBg: "#1e1319",
        sidebarBg: "#160d12",
        serversBg: "#0f090c",
        headerBg: "#251820",
        inputBg: "#2e1a26",
        primaryText: "#fce7f3",
        mutedText: "#f9a8d4",
        hoverBg: "rgba(244, 114, 182, 0.15)",
        borderRadius: 12
    },
    {
        name: "Deep Ocean",
        nameAr: "أزرق محيطي هادئ",
        descAr: "أمواج المحيط العميقة بلمسات تركواز هادئة وأنيقة.",
        descEn: "Deep nautical blue waves with serene modern cyan accents.",
        accentColor: "#38bdf8",
        chatBg: "#0a1526",
        sidebarBg: "#070e1a",
        serversBg: "#040810",
        headerBg: "#0d1b32",
        inputBg: "#11233f",
        primaryText: "#e0f2fe",
        mutedText: "#7dd3fc",
        hoverBg: "rgba(56, 189, 248, 0.15)",
        borderRadius: 8
    }
];

export const SAMPLE_GIF_PRESETS = [
    {
        id: "cyberpunk",
        name: "Cyberpunk City",
        nameAr: "مدينة سايبربنك نيون",
        nameEn: "Cyberpunk Neon City",
        descAr: "أمطار نيون ومباني مستقبلية متحركة",
        descEn: "Cyberpunk neon rains & high-tech towers",
        url: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif"
    },
    {
        id: "lofi",
        name: "Lo-Fi Rainy Window",
        nameAr: "مطر لوفي مريح ودافئ",
        nameEn: "Lo-Fi Cozy Rainy Window",
        descAr: "قطرات مطر دافئة ونافذة ليلية هادئة للاسترخاء",
        descEn: "Gentle rain droplets on window glass",
        url: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
    },
    {
        id: "nebula",
        name: "Cosmic Space Nebula",
        nameAr: "فضاء وسديم كوني",
        nameEn: "Cosmic Space Nebula",
        descAr: "سحب سديمية كونية ونجوم لامعة متحركة",
        descEn: "Deep cosmic clouds & glowing starfield",
        url: "https://media.giphy.com/media/BHNfhgU63qrks/giphy.gif"
    },
    {
        id: "sakura",
        name: "Sakura Falling",
        nameAr: "تساقط زهور الساكورا",
        nameEn: "Sakura Falling Petals",
        descAr: "تساقط بتلات الكرز الوردي بنعومة أنمي",
        descEn: "Gentle anime pink cherry blossom petals",
        url: "https://media.giphy.com/media/W6dHvprT7oks6BpX5R/giphy.gif"
    },
    {
        id: "synthwave",
        name: "Synthwave Sunset",
        nameAr: "أمواج سينثويف ريترو",
        nameEn: "Retro Synthwave Sunset",
        descAr: "شمس ريترو وشبكة ليزر بنفسجية متحركة",
        descEn: "Retro 80s neon sunset with glowing wireframe grid",
        url: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif"
    },
    {
        id: "tokyo",
        name: "Tokyo Anime Rain",
        nameAr: "أمطار طوكيو بالأنمي",
        nameEn: "Tokyo Anime Night Rain",
        descAr: "شوارع طوكيو الليلية الهادئة تحت المطر",
        descEn: "Peaceful Tokyo city streets under night rain",
        url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif"
    },
    {
        id: "matrix",
        name: "Matrix Cyber Code",
        nameAr: "شفرات ماتريكس الرقمية",
        nameEn: "Matrix Digital Cyber Rain",
        descAr: "رموز رقمية خضراء تسقط بأسلوب الماتريكس",
        descEn: "Classic falling green digital terminal code",
        url: "https://media.giphy.com/media/A06UFEx8jxEwU/giphy.gif"
    },
    {
        id: "galaxy",
        name: "Deep Purple Galaxy",
        nameAr: "مجرة ليلكية فخمة",
        nameEn: "Royal Purple Galaxy Stars",
        descAr: "أمواج المجرة البنفسجية الملكية الساحرة",
        descEn: "Majestic purple galactic swirls & stardust",
        url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif"
    }
];

function hexToRgba(hex: string, alpha: number): string {
    if (!hex) return `rgba(0, 0, 0, ${alpha})`;
    if (hex.startsWith("rgba")) return hex;
    if (hex.startsWith("rgb")) {
        return hex.replace("rgb", "rgba").replace(")", `, ${alpha})`);
    }
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    if (c.length >= 6) {
        const num = parseInt(c.slice(0, 6), 16);
        return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${Number(alpha.toFixed(2))})`;
    }
    return `rgba(0, 0, 0, ${alpha})`;
}

export function parseThemeCssToConfig(cssText: string): Partial<ThemeConfig> {
    const trimmed = (cssText || "").trim();
    const newCfg: Partial<ThemeConfig> = {};

    if (!trimmed) return newCfg;

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
            return JSON.parse(trimmed);
        } catch {
            // fallthrough
        }
    }

    const nameM = trimmed.match(/@name\s+([^\r\n]+)/);
    if (nameM) newCfg.name = nameM[1].trim();

    const authorM = trimmed.match(/@author\s+([^\r\n]+)/);
    if (authorM) newCfg.author = authorM[1].trim();

    const descM = trimmed.match(/@description\s+([^\r\n]+)/);
    if (descM) newCfg.description = descM[1].trim();

    const brandM = trimmed.match(/--brand-experiment:\s*([^;!]+)/);
    if (brandM) newCfg.accentColor = brandM[1].trim();

    const bgPrimaryM = trimmed.match(/--background-primary:\s*([^;!]+)/);
    if (bgPrimaryM) newCfg.chatBg = bgPrimaryM[1].trim();

    const bgSecM = trimmed.match(/--background-secondary:\s*([^;!]+)/);
    if (bgSecM) newCfg.sidebarBg = bgSecM[1].trim();

    const bgTertM = trimmed.match(/--background-tertiary:\s*([^;!]+)/);
    if (bgTertM) newCfg.serversBg = bgTertM[1].trim();

    const bgFloatM = trimmed.match(/--background-floating:\s*([^;!]+)/);
    if (bgFloatM) newCfg.headerBg = bgFloatM[1].trim();

    const textNormM = trimmed.match(/--text-normal:\s*([^;!]+)/);
    if (textNormM) newCfg.primaryText = textNormM[1].trim();

    const textMutM = trimmed.match(/--text-muted:\s*([^;!]+)/);
    if (textMutM) newCfg.mutedText = textMutM[1].trim();

    const radiusM = trimmed.match(/--radius-round:\s*(\d+)px/);
    if (radiusM) newCfg.borderRadius = parseInt(radiusM[1], 10);

    const imgM = trimmed.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (imgM) {
        newCfg.imageUrl = imgM[1];
        newCfg.useImage = true;
    }

    return newCfg;
}

export function generateThemeCss(config: ThemeConfig): string {
    const meta = [
        "/**",
        ` * @name ${config.name.trim() || "My Custom Theme"}`,
        ` * @author ${config.author.trim() || "FAN"}`,
        ` * @description ${config.description.trim() || "Custom theme created with FanCord Theme Creator"}`,
        ` * @version ${config.version.trim() || "1.0.0"}`,
        " * @source FanCord Theme Creator",
        " */",
        ""
    ].join("\n");

    const fontOptions = getFontOptions();
    const selectedFont = fontOptions.find(f => f.id === config.fontFamily);

    let fontImport = "";
    let fontRule = "";

    if (config.fontFamily === "custom" && config.customFontData) {
        const familyName = config.customFontName.trim() || "CustomUploadedFont";
        fontImport = [
            "@font-face {",
            `    font-family: '${familyName}';`,
            `    src: url('${config.customFontData}') format('truetype');`,
            "    font-weight: normal;",
            "    font-style: normal;",
            "    font-display: swap;",
            "}\n\n"
        ].join("\n");
        fontRule = `/* Custom Uploaded Font */\n* {\n    font-family: '${familyName}', sans-serif !important;\n}\n\n`;
    } else if (selectedFont && (selectedFont as any).googleFont) {
        fontImport = `@import url('https://fonts.googleapis.com/css2?family=${(selectedFont as any).googleFont}&display=swap');\n\n`;
        fontRule = `/* Custom Typography */\n* {\n    font-family: ${selectedFont.family} !important;\n}\n\n`;
    }

    const chatBgTrans = config.useImage ? hexToRgba(config.chatBg, config.chatOpacity ?? 0.25) : config.chatBg;
    const sidebarBgTrans = config.useImage ? hexToRgba(config.sidebarBg, config.sidebarOpacity ?? 0.45) : config.sidebarBg;
    const serversBgTrans = config.useImage ? hexToRgba(config.serversBg, config.serversOpacity ?? 0.6) : config.serversBg;
    const headerBgTrans = config.useImage ? hexToRgba(config.headerBg, config.headerOpacity ?? 0.75) : config.headerBg;
    const inputBgTrans = config.useImage ? hexToRgba(config.inputBg || config.sidebarBg, config.inputOpacity ?? 0.7) : (config.inputBg || config.sidebarBg);
    const settingsBgTrans = config.useImage ? hexToRgba(config.chatBg, config.settingsOpacity ?? 0.85) : config.chatBg;
    const membersBgTrans = config.useImage ? hexToRgba(config.sidebarBg, config.membersOpacity ?? 0.45) : config.sidebarBg;
    const popoutsBgTrans = config.useImage ? hexToRgba(config.headerBg, config.popoutsOpacity ?? 0.85) : config.headerBg;
    const foldersBgTrans = config.useImage ? hexToRgba(config.serversBg, config.foldersOpacity ?? 0.65) : config.serversBg;
    const voiceCallBgTrans = config.useImage ? hexToRgba(config.chatBg, config.voiceCallOpacity ?? 0.35) : config.chatBg;

    const coreVars = [
        ":root, .theme-dark, .theme-light {",
        "    /* FanCord Theme Accent & Brand Colors */",
        `    --brand-experiment: ${config.accentColor} !important;`,
        `    --brand-500: ${config.accentColor} !important;`,
        `    --brand-560: ${config.accentColor} !important;`,
        `    --brand-600: ${config.accentColor} !important;`,
        `    --brand-default: ${config.accentColor} !important;`,
        `    --button-positive-background: ${config.accentColor} !important;`,
        `    --button-positive-background-hover: ${config.accentColor} !important;`,
        "",
        "    /* Layout Colors & Translucency */",
        `    --background-primary: ${chatBgTrans} !important;`,
        `    --background-secondary: ${sidebarBgTrans} !important;`,
        `    --background-secondary-alt: ${sidebarBgTrans} !important;`,
        `    --background-tertiary: ${serversBgTrans} !important;`,
        `    --background-floating: ${headerBgTrans} !important;`,
        `    --background-accent: ${headerBgTrans} !important;`,
        "    --background-call: transparent !important;",
        "    --call-background: transparent !important;",
        `    --tile-background: ${voiceCallBgTrans} !important;`,
        "    --video-background: transparent !important;",
        `    --folder-background: ${foldersBgTrans} !important;`,
        `    --expanded-folder-background: ${foldersBgTrans} !important;`,
        "",
        "    /* Modern Discord Semantic Tokens (2024 - 2026) */",
        `    --bg-base-primary: ${chatBgTrans} !important;`,
        `    --bg-base-secondary: ${sidebarBgTrans} !important;`,
        `    --bg-base-tertiary: ${serversBgTrans} !important;`,
        `    --bg-surface-raised: ${sidebarBgTrans} !important;`,
        `    --bg-surface-overlay: ${headerBgTrans} !important;`,
        `    --bg-overlay-chat: ${chatBgTrans} !important;`,
        `    --bg-overlay-floating: ${headerBgTrans} !important;`,
        `    --bg-mod-subtle: ${config.hoverBg} !important;`,
        "",
        "    /* Neutral ramp overrides */",
        `    --neutral-69: ${chatBgTrans} !important;`,
        `    --neutral-66: ${sidebarBgTrans} !important;`,
        `    --neutral-64: ${sidebarBgTrans} !important;`,
        `    --neutral-62: ${serversBgTrans} !important;`,
        "",
        "    /* Text & Icon Colors */",
        `    --text-normal: ${config.primaryText} !important;`,
        `    --header-primary: ${config.primaryText} !important;`,
        `    --text-default: ${config.primaryText} !important;`,
        `    --text-strong: ${config.primaryText} !important;`,
        "",
        `    --text-muted: ${config.mutedText} !important;`,
        `    --text-subtle: ${config.mutedText} !important;`,
        `    --header-secondary: ${config.mutedText} !important;`,
        `    --channels-default: ${config.mutedText} !important;`,
        `    --interactive-normal: ${config.mutedText} !important;`,
        `    --interactive-hover: ${config.primaryText} !important;`,
        `    --interactive-active: ${config.accentColor} !important;`,
        "",
        `    --background-modifier-hover: ${config.hoverBg} !important;`,
        `    --background-modifier-selected: ${config.hoverBg} !important;`,
        `    --background-modifier-active: ${config.hoverBg} !important;`,
        "",
        `    --radius-round: ${config.borderRadius}px !important;`,
        `    --radius-sm: ${Math.min(config.borderRadius, 4)}px !important;`,
        `    --radius-md: ${Math.min(config.borderRadius, 8)}px !important;`,
        `    --radius-lg: ${config.borderRadius}px !important;`,
        "}"
    ].join("\n");

    let visualEffectsCss = "";

    // Neon Glow
    if (config.neonGlow) {
        visualEffectsCss += `
/* Neon Accent Glow */
[class*="selected_"][class*="channel_"] [class*="link_"],
[class*="interactive_"]:focus-within,
[class*="button_"][class*="lookFilled_"][class*="colorBrand_"],
.fancord-neon-glow {
    box-shadow: 0 0 12px ${hexToRgba(config.accentColor, 0.55)} !important;
}
[class*="modeSelected_"] [class*="link_"] {
    border-right: 3px solid ${config.accentColor} !important;
    box-shadow: inset 0 0 12px ${hexToRgba(config.accentColor, 0.25)} !important;
}
`;
    }

    // Acrylic Borders
    if (config.glassBorders) {
        visualEffectsCss += `
/* Frosted Acrylic Glass Borders */
[class*="channelTextArea_"],
[class*="sidebar_"],
[class*="membersWrap_"],
[class*="contentRegion_"],
[class*="standardSidebarView_"],
[class*="menu_"],
[class*="userPopoutOuter_"],
[class*="container_"] > [class*="content_"] {
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
`;
    }

    // Sleek Scrollbars
    if (config.customScrollbars) {
        visualEffectsCss += `
/* Sleek Minimalist Scrollbars */
::-webkit-scrollbar {
    width: 6px !important;
    height: 6px !important;
}
::-webkit-scrollbar-track {
    background: transparent !important;
}
::-webkit-scrollbar-thumb {
    background: ${hexToRgba(config.accentColor, 0.45)} !important;
    border-radius: 10px !important;
    transition: background 0.2s ease !important;
}
::-webkit-scrollbar-thumb:hover {
    background: ${config.accentColor} !important;
}
`;
    }

    // Compact Messages
    if (config.compactMessages) {
        visualEffectsCss += `
/* Compact Message Spacing */
[class*="message_"] {
    padding-top: 0.125rem !important;
    padding-bottom: 0.125rem !important;
}
`;
    }

    let imageCss = "";
    if (config.useImage && config.imageUrl.trim()) {
        const url = config.imageUrl.trim();
        const fit = config.bgFit === "cover" ? "cover" : config.bgFit === "contain" ? "contain" : config.bgFit === "repeat" ? "auto" : "cover";
        const repeat = config.bgFit === "repeat" ? "repeat" : "no-repeat";
        const scope = config.wallpaperScope || "full";

        if (scope === "full" || scope === "chatAndSidebar") {
            imageCss = [
                "",
                "/* ── Fullscreen Wallpaper & Transparency Engine ── */",
                "html {",
                "    background: transparent !important;",
                "    background-color: transparent !important;",
                "}",
                "",
                "html::before,",
                "body::before {",
                '    content: "" !important;',
                "    position: fixed !important;",
                "    top: 0 !important;",
                "    left: 0 !important;",
                "    right: 0 !important;",
                "    bottom: 0 !important;",
                "    width: 100vw !important;",
                "    height: 100vh !important;",
                `    background-image: url("${url}") !important;`,
                `    background-size: ${fit} !important;`,
                "    background-position: center center !important;",
                `    background-repeat: ${repeat} !important;`,
                "    background-attachment: fixed !important;",
                `    filter: blur(${config.bgBlur}px) brightness(${config.bgBrightness}%) !important;`,
                "    opacity: 1 !important;",
                "    visibility: visible !important;",
                "    pointer-events: none !important;",
                "    z-index: -1 !important;",
                "}",
                "",
                "html::after,",
                "body::after {",
                '    content: "" !important;',
                "    position: fixed !important;",
                "    top: 0 !important;",
                "    left: 0 !important;",
                "    right: 0 !important;",
                "    bottom: 0 !important;",
                "    width: 100vw !important;",
                "    height: 100vh !important;",
                `    background-color: rgba(0, 0, 0, ${config.overlayOpacity}) !important;`,
                "    pointer-events: none !important;",
                "    z-index: -1 !important;",
                "}",
                "",
                "/* Clear Discord's Opaque Containers */",
                "body,",
                "#app-mount,",
                '[class*="appDevToolsWrapper_"],',
                '[class*="app_"],',
                '[class*="visualRefresh_"],',
                '[class*="layers_"],',
                '[class*="layer_"],',
                '[class*="base_"],',
                '[class*="container_"],',
                '[class*="chat_"],',
                '[class*="chatContent_"],',
                '[class*="content_"],',
                '[class*="pageWrapper_"],',
                '[class*="messagesWrapper_"],',
                '[class*="scrollerContent_"],',
                '[class*="scrollerInner_"],',
                'main[class*="chatContent_"],',
                '[class*="bg_"],',
                '[class*="guilds_"] [class*="scroller_"],',
                '[class*="guilds_"] [class*="tree_"],',
                '[class*="guilds_"] nav,',
                '[class*="guilds_"] ul {',
                "    background: transparent !important;",
                "    background-color: transparent !important;",
                "}",
                "",
                "/* Chat Messages Glass Area */",
                '[class*="chatContent_"],',
                '[class*="messagesWrapper_"] {',
                `    background-color: ${chatBgTrans} !important;`,
                "}",
                "",
                "/* Sidebar & Channels Glass Area */",
                '[class*="sidebar_"] {',
                `    background-color: ${sidebarBgTrans} !important;`,
                "}",
                "",
                '[class*="sidebar_"] [class*="container_"],',
                '[class*="sidebar_"] [class*="scroller_"],',
                '[class*="privateChannels_"] {',
                "    background-color: transparent !important;",
                "}",
                "",
                "/* Server List Rail Glass Area */",
                'nav[class*="guilds_"],',
                '[class*="guilds_"] {',
                scope === "chatAndSidebar"
                    ? `    background-color: ${config.serversBg} !important;`
                    : `    background-color: ${serversBgTrans} !important;`,
                "}",
                "",
                "/* Server Folders & Folder Icons Translucency */",
                '[class*="expandedFolderBackground_"] {',
                `    background-color: ${foldersBgTrans} !important;`,
                "    border: 1px solid rgba(255, 255, 255, 0.12) !important;",
                ...(config.glassBlur > 0 ? [
                    `    backdrop-filter: blur(${Math.max(4, config.glassBlur)}px) !important;`,
                    `    -webkit-backdrop-filter: blur(${Math.max(4, config.glassBlur)}px) !important;`
                ] : []),
                "}",
                "",
                '[class*="folder_"],',
                '[class*="folderIconWrapper_"],',
                '[class*="closedFolderIconWrapper_"],',
                '[class*="expandedFolderIconWrapper_"] {',
                "    background-color: transparent !important;",
                "}",
                "",
                '[class*="folderIconWrapper_"] [class*="closedFolderIconWrapper_"] {',
                `    background-color: ${hexToRgba(config.serversBg, 0.75)} !important;`,
                "}",
                "",
                "/* Voice Channels, Video Calls, Screenshare & Lounge Containers */",
                '[class*="chat_"] [class*="wrapper_"],',
                '[class*="chat_"] [class*="content_"],',
                '[class*="chat_"] > [class*="content_"],',
                '[class*="callContainer_"],',
                '[class*="wrapper_"]:has([class*="callContainer_"]),',
                '[class*="wrapper_"]:has([class*="videoGrid_"]),',
                '[class*="root_"][class*="callContainer_"],',
                '[class*="videoGridWrapper_"],',
                '[class*="videoGrid_"],',
                '[class*="container_"][class*="grid_"],',
                '[class*="tileRow_"],',
                '[class*="row_"][class*="tileRow_"],',
                '[class*="gradientContainer_"],',
                '[class*="gradientBackground_"],',
                '[class*="stageSection_"],',
                '[class*="stageContainer_"],',
                '[class*="wrapper_"][class*="stage_"],',
                '[class*="scroller_"][class*="camera_"],',
                '[class*="voiceEffects_"],',
                '[class*="wrapper_"][class*="voiceChannelEffect_"],',
                '[class*="channelBottomBarArea_"],',
                '[class*="bottomControls_"],',
                '[class*="videoControls_"],',
                '[class*="container_"][class*="panels_"] [class*="connection_"],',
                '[class*="container_"][class*="panels_"] [class*="container_"],',
                '[class*="container_"][class*="floating_"],',
                '[class*="callWrapper_"] {',
                "    background: transparent !important;",
                "    background-color: transparent !important;",
                "}",
                "",
                "/* Voice & Video Tiles Glassmorphism */",
                '[class*="tile_"],',
                '[class*="tileRow_"] > div,',
                '[class*="videoGrid_"] [class*="tile_"],',
                '[class*="container_"][class*="mainCard_"],',
                '[class*="card_"][class*="voiceChannelCard_"] {',
                `    background-color: ${voiceCallBgTrans} !important;`,
                `    border-radius: ${config.borderRadius || 12}px !important;`,
                "    border: 1px solid rgba(255, 255, 255, 0.08) !important;",
                ...(config.glassBlur > 0 ? [
                    `    backdrop-filter: blur(${Math.max(4, config.glassBlur)}px) saturate(120%) !important;`,
                    `    -webkit-backdrop-filter: blur(${Math.max(4, config.glassBlur)}px) saturate(120%) !important;`
                ] : []),
                "}",
                "",
                "/* Settings Windows Translucency */",
                '[class*="standardSidebarView_"],',
                '[class*="contentRegion_"],',
                '[class*="contentRegionScroller_"],',
                '[class*="sidebarRegion_"],',
                '[class*="sidebarRegionScroller_"] {',
                `    background-color: ${settingsBgTrans} !important;`,
                "}",
                "",
                "/* Members List Glass Area */",
                '[class*="membersWrap_"],',
                '[class*="members_"] {',
                `    background-color: ${membersBgTrans} !important;`,
                "}",
                "",
                "/* Popouts, Menus & Profiles */",
                '[class*="menu_"],',
                '[class*="userPopoutOuter_"],',
                '[class*="popout_"],',
                '[class*="messagesPopoutWrap_"] {',
                `    background-color: ${popoutsBgTrans} !important;`,
                "}",
                "",
                "/* User Voice / Status Control Panel */",
                '[class*="panels_"] {',
                `    background-color: ${sidebarBgTrans} !important;`,
                "}",
                "",
                "/* Channel Top Title Header */",
                '[class*="title_"][class*="themed_"],',
                '[class*="subtitleContainer_"] {',
                `    background-color: ${headerBgTrans} !important;`,
                "}",
                "",
                "/* Message Text Input Box */",
                '[class*="channelTextArea_"],',
                '[class*="scrollableContainer_"] {',
                `    background-color: ${inputBgTrans} !important;`,
                "}",
                ...(config.glassBlur > 0 ? [
                    "",
                    "/* Glassmorphism Backdrop Blur */",
                    '[class*="sidebar_"],',
                    'nav[class*="guilds_"],',
                    '[class*="chatContent_"],',
                    '[class*="title_"][class*="themed_"],',
                    '[class*="membersWrap_"],',
                    '[class*="standardSidebarView_"],',
                    '[class*="panels_"],',
                    '[class*="callContainer_"] {',
                    `    backdrop-filter: blur(${config.glassBlur}px) saturate(120%) !important;`,
                    `    -webkit-backdrop-filter: blur(${config.glassBlur}px) saturate(120%) !important;`,
                    "}"
                ] : [])
            ].join("\n");
        } else if (scope === "chat") {
            // Chat Area Only Wallpaper
            imageCss = [
                "",
                "/* ── Chat-Only Wallpaper Engine ── */",
                '[class*="chatContent_"],',
                '[class*="chat_"] > [class*="content_"],',
                '[class*="chat_"] [class*="wrapper_"],',
                '[class*="callContainer_"],',
                'main[class*="chatContent_"] {',
                "    position: relative !important;",
                "    background: transparent !important;",
                "}",
                "",
                '[class*="chatContent_"]::before,',
                '[class*="chat_"] > [class*="content_"]::before,',
                '[class*="callContainer_"]::before,',
                '[class*="messagesWrapper_"]::before {',
                '    content: "" !important;',
                "    position: absolute !important;",
                "    inset: 0 !important;",
                `    background-image: url("${url}") !important;`,
                `    background-size: ${fit} !important;`,
                "    background-position: center center !important;",
                `    background-repeat: ${repeat} !important;`,
                "    background-attachment: fixed !important;",
                `    filter: blur(${config.bgBlur}px) brightness(${config.bgBrightness}%) !important;`,
                "    z-index: 0 !important;",
                "    pointer-events: none !important;",
                "}",
                "",
                '[class*="chatContent_"]::after,',
                '[class*="messagesWrapper_"]::after {',
                '    content: "" !important;',
                "    position: absolute !important;",
                "    inset: 0 !important;",
                `    background-color: rgba(0, 0, 0, ${config.overlayOpacity}) !important;`,
                "    z-index: 0 !important;",
                "    pointer-events: none !important;",
                "}",
                "",
                "/* Chat Messages Glass Layer */",
                '[class*="scroller_"][class*="messages_"] {',
                `    background-color: ${chatBgTrans} !important;`,
                "    position: relative !important;",
                "    z-index: 1 !important;",
                "}",
                "",
                "/* Channels and Servers are solid opaque */",
                '[class*="sidebar_"] {',
                `    background-color: ${config.sidebarBg} !important;`,
                "}",
                'nav[class*="guilds_"] {',
                `    background-color: ${config.serversBg} !important;`,
                "}",
                '[class*="title_"][class*="themed_"] {',
                `    background-color: ${config.headerBg} !important;`,
                "}",
                '[class*="channelTextArea_"] {',
                `    background-color: ${config.inputBg || config.sidebarBg} !important;`,
                "}"
            ].join("\n");
        } else if (scope === "sidebar") {
            // Channels Sidebar Only Wallpaper
            imageCss = [
                "",
                "/* ── Channels Sidebar-Only Wallpaper Engine ── */",
                '[class*="sidebar_"] {',
                "    position: relative !important;",
                "    background: transparent !important;",
                "}",
                "",
                '[class*="sidebar_"]::before {',
                '    content: "" !important;',
                "    position: absolute !important;",
                "    inset: 0 !important;",
                `    background-image: url("${url}") !important;`,
                `    background-size: ${fit} !important;`,
                "    background-position: center center !important;",
                `    background-repeat: ${repeat} !important;`,
                "    background-attachment: fixed !important;",
                `    filter: blur(${config.bgBlur}px) brightness(${config.bgBrightness}%) !important;`,
                "    z-index: 0 !important;",
                "    pointer-events: none !important;",
                "}",
                "",
                '[class*="sidebar_"]::after {',
                '    content: "" !important;',
                "    position: absolute !important;",
                "    inset: 0 !important;",
                `    background-color: rgba(0, 0, 0, ${config.overlayOpacity}) !important;`,
                "    z-index: 0 !important;",
                "    pointer-events: none !important;",
                "}",
                "",
                '[class*="chatContent_"] {',
                `    background-color: ${config.chatBg} !important;`,
                "}",
                'nav[class*="guilds_"] {',
                `    background-color: ${config.serversBg} !important;`,
                "}"
            ].join("\n");
        }
    }

    return `${meta}\n${fontImport}${fontRule}${coreVars}${visualEffectsCss}${imageCss}\n`;
}

function downloadThemeFile(fileName: string, content: string) {
    const cleanName = fileName.endsWith(".theme.css") ? fileName : `${fileName}.theme.css`;
    const blob = new Blob([content], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

export function ThemeCreatorModal({ onClose, transitionState, initialConfig }: {
    onClose: () => void;
    transitionState: any;
    initialConfig?: Partial<ThemeConfig>;
}) {
    const curUser = UserStore?.getCurrentUser?.();
    const defaultAuthor = curUser?.globalName || curUser?.username || "FAN";
    const arabicActive = isArabicMode();

    const [activeTab, setActiveTab] = useState<"presets" | "colors" | "image" | "effects" | "guide" | "meta">("presets");
    const [mockupView, setMockupView] = useState<"wallpaper" | "chat" | "settings" | "popout" | "voice">("chat");
    const [livePreviewActive, setLivePreviewActive] = useState(true);
    const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

    const defaultConfig: ThemeConfig = {
        name: "My-Custom-Theme",
        author: defaultAuthor,
        description: "A personalized custom theme created with FanCord Theme Studio.",
        version: "1.0.0",

        useImage: true,
        imageUrl: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
        bgFit: "cover",
        bgBlur: 0,
        bgBrightness: 100,
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

        fontFamily: "default",
        customFontName: "MyCustomFont",
        customFontData: "",
        neonGlow: true,
        glassBorders: true,
        customScrollbars: true,
        compactMessages: false
    };

    const [config, setConfig] = useState<ThemeConfig>({
        ...defaultConfig,
        ...(initialConfig ?? {})
    });

    const isGif = config.imageUrl.startsWith("data:image/gif")
        || config.imageUrl.toLowerCase().includes(".gif")
        || config.imageUrl.includes("giphy.com")
        || config.imageUrl.includes("tenor.com");

    const getHighlightLabel = (key: string | null) => {
        if (key) {
            switch (key) {
                case "chat":
                    return t("🎯 جاري تعديل: منطقة الدردشة وقراءة الرسائل", "Modifying: Main Chat & Messages Area");
                case "sidebar":
                    return t("🎯 جاري تعديل: قائمة القنوات والرومات الصوتية", "Modifying: Channels & Voice Sidebar");
                case "servers":
                    return t("🎯 جاري تعديل: شريط السيرفرات والأيقونات الأيسر", "Modifying: Left Server Icons Rail");
                case "header":
                    return t("🎯 جاري تعديل: شريط العنوان العلوي والهيدر", "Modifying: Channel Header Titlebar");
                case "input":
                    return t("🎯 جاري تعديل: صندوق كتابة وإرسال الرسائل", "Modifying: Message Composer Input Box");
                case "accent":
                    return t("🎯 جاري تعديل: الأزرار والمنشن والأيقونات التمييزية والتوهج", "Modifying: Buttons, Mentions, Neon Glow & Accent");
                case "text":
                    return t("🎯 جاري تعديل: ألوان نصوص الرسائل والأسماء", "Modifying: Message Texts & Usernames");
                case "wallpaper": {
                    const scopeName = scope === "full" ? t("كامل ديسكورد", "Full Window") : scope === "chat" ? t("الدردشة فقط", "Chat Only") : scope === "chatAndSidebar" ? t("الدردشة والقنوات", "Chat & Sidebar") : t("القنوات فقط", "Sidebar Only");
                    return t(`🎯 جاري تعديل: خلفية ديسكورد والـ GIF | النطاق: ${scopeName}`, `Modifying: Wallpaper & GIF | Scope: ${scopeName}`);
                }
                case "radius":
                    return t(`🎯 جاري تعديل: انحناء ودائرية الحواف (${config.borderRadius}px)`, `Modifying: Corner Roundness (${config.borderRadius}px)`);
                case "fonts":
                    return t(`🎯 جاري تعديل: الخطوط وتنسيق النصوص (${config.fontFamily || "ديسكورد"})`, `Modifying: Fonts & Typography (${config.fontFamily || "Default"})`);
                case "settings":
                    return t(`🎯 جاري تعديل: شفافية نوافذ وقوائم الإعدادات (${Math.round((config.settingsOpacity ?? 0.85) * 100)}%)`, `Modifying: Settings Windows Opacity (${Math.round((config.settingsOpacity ?? 0.85) * 100)}%)`);
                case "members":
                    return t(`🎯 جاري تعديل: شفافية قائمة الأعضاء (${Math.round((config.membersOpacity ?? 0.45) * 100)}%)`, `Modifying: Members List Opacity (${Math.round((config.membersOpacity ?? 0.45) * 100)}%)`);
                case "popouts":
                    return t(`🎯 جاري تعديل: شفافية القوائم والملفات الشخصية (${Math.round((config.popoutsOpacity ?? 0.85) * 100)}%)`, `Modifying: Popouts & Profiles Opacity (${Math.round((config.popoutsOpacity ?? 0.85) * 100)}%)`);
                case "folders":
                    return t(`🎯 جاري تعديل: شفافية مجلدات السيرفرات (${Math.round((config.foldersOpacity ?? 0.65) * 100)}%)`, `Modifying: Server Folders Opacity (${Math.round((config.foldersOpacity ?? 0.65) * 100)}%)`);
                case "voice":
                    return t(`🎯 جاري تعديل: شفافية قنوات ومكالمات الصوت والفيديو (${Math.round((config.voiceCallOpacity ?? 0.35) * 100)}%)`, `Modifying: Voice & Video Calls Opacity (${Math.round((config.voiceCallOpacity ?? 0.35) * 100)}%)`);
                default:
                    break;
            }
        }

        // Active Tab Contextual Guidance when not actively hovering an element
        switch (activeTab) {
            case "image": {
                const scopeName = scope === "full" ? t("كامل ديسكورد", "Full Discord") : scope === "chat" ? t("منطقة الدردشة فقط", "Chat Area Only") : scope === "chatAndSidebar" ? t("الدردشة وقائمة الرومات", "Chat & Channels") : t("قائمة الرومات فقط", "Channels Sidebar Only");
                return t(
                    `🖼️ تعديل: خلفية ديسكورد والـ GIF | النطاق: [${scopeName}] | تعتيم: [${Math.round(config.overlayOpacity * 100)}%] | إضاءة: [${Math.round(config.bgBrightness)}%]`,
                    `🖼️ Modifying: Wallpaper & GIF | Scope: [${scopeName}] | Tint: [${Math.round(config.overlayOpacity * 100)}%] | Brightness: [${Math.round(config.bgBrightness)}%]`
                );
            }
            case "colors":
                return t(
                    `🎨 تعديل: ألوان ديسكورد والشفافية | اللون المميز: [${config.accentColor}] | شفافية الشات: [${Math.round((config.chatOpacity ?? 0.25) * 100)}%]`,
                    `🎨 Modifying: Colors & Opacities | Accent: [${config.accentColor}] | Chat Opacity: [${Math.round((config.chatOpacity ?? 0.25) * 100)}%]`
                );
            case "effects":
                return t(
                    `💎 تعديل: الخطوط وتوهج النيون | الخط: [${config.fontFamily || "ديسكورد"}] | التوهج: [${config.neonGlow ? "مفعل ✨" : "معطل"}] | الحواف: [${config.borderRadius}px]`,
                    `💎 Modifying: Fonts & Flair | Font: [${config.fontFamily || "Default"}] | Neon: [${config.neonGlow ? "Active ✨" : "Off"}] | Radius: [${config.borderRadius}px]`
                );
            case "presets":
                return t(
                    "🌟 اختر أي قالب متكامل جاهز ليتم تطبيقه فوراً على ديسكورد والمعاينة",
                    "Pick any curated complete theme to apply instantly to Discord & preview"
                );
            default:
                return t("💡 انقر على أي جزء في ديسكورد باليمين أو مرر الماوس لتعديله فوراً", "Click any element in the mockup or hover over settings to edit it");
        }
    };

    // Cleanup live preview and custom font style on unmount
    React.useEffect(() => {
        return () => {
            document.getElementById("fancord-theme-live-preview")?.remove();
            document.getElementById("fancord-custom-font-preview")?.remove();
        };
    }, []);

    // Toggle live preview across entire Discord
    const toggleLivePreview = (enabled: boolean) => {
        setLivePreviewActive(enabled);
        const previewEl = document.getElementById("fancord-theme-live-preview");
        if (enabled) {
            let el = previewEl as HTMLStyleElement | null;
            if (!el) {
                el = document.createElement("style");
                el.id = "fancord-theme-live-preview";
                document.head.appendChild(el);
            }
            el.textContent = generateThemeCss(config);
            showToast({
                text: t("⚡ وضع المعاينة المباشرة على ديسكورد نشط الآن!", "⚡ Real-time Live Discord Preview is active!"),
                variant: "default"
            });
        } else {
            previewEl?.remove();
        }
    };

    // Update live preview style when config changes if live is active
    React.useEffect(() => {
        if (livePreviewActive) {
            let previewEl = document.getElementById("fancord-theme-live-preview") as HTMLStyleElement | null;
            if (!previewEl) {
                previewEl = document.createElement("style");
                previewEl.id = "fancord-theme-live-preview";
                document.head.appendChild(previewEl);
            }
            previewEl.textContent = generateThemeCss(config);
        } else {
            document.getElementById("fancord-theme-live-preview")?.remove();
        }
    }, [config, livePreviewActive]);

    const applyColorPreset = (preset: typeof THEME_PRESETS[0]) => {
        setConfig(prev => ({
            ...prev,
            accentColor: preset.accentColor,
            chatBg: preset.chatBg,
            sidebarBg: preset.sidebarBg,
            serversBg: preset.serversBg,
            headerBg: preset.headerBg,
            inputBg: preset.inputBg,
            primaryText: preset.primaryText,
            mutedText: preset.mutedText,
            hoverBg: preset.hoverBg,
            borderRadius: preset.borderRadius
        }));
    };

    const applyCompleteAesthetic = (aesthetic: ReturnType<typeof getCompleteAesthetics>[0]) => {
        setConfig(prev => ({
            ...prev,
            name: aesthetic.name.replace(/^[^\w\s\u0600-\u06FF]+/, "").trim() || aesthetic.id,
            accentColor: aesthetic.accentColor,
            chatBg: aesthetic.chatBg,
            sidebarBg: aesthetic.sidebarBg,
            serversBg: aesthetic.serversBg,
            headerBg: aesthetic.headerBg,
            inputBg: aesthetic.inputBg,
            primaryText: aesthetic.primaryText,
            mutedText: aesthetic.mutedText,
            hoverBg: aesthetic.hoverBg,
            borderRadius: aesthetic.borderRadius,
            useImage: aesthetic.useImage,
            imageUrl: aesthetic.imageUrl,
            wallpaperScope: aesthetic.wallpaperScope,
            chatOpacity: aesthetic.chatOpacity,
            sidebarOpacity: aesthetic.sidebarOpacity,
            serversOpacity: aesthetic.serversOpacity,
            headerOpacity: aesthetic.headerOpacity,
            inputOpacity: aesthetic.inputOpacity,
            settingsOpacity: aesthetic.settingsOpacity,
            membersOpacity: aesthetic.membersOpacity,
            popoutsOpacity: aesthetic.popoutsOpacity,
            glassBlur: aesthetic.glassBlur,
            bgBlur: aesthetic.bgBlur,
            bgBrightness: aesthetic.bgBrightness,
            overlayOpacity: aesthetic.overlayOpacity,
            fontFamily: aesthetic.fontFamily,
            neonGlow: aesthetic.neonGlow,
            glassBorders: aesthetic.glassBorders,
            customScrollbars: aesthetic.customScrollbars,
            compactMessages: aesthetic.compactMessages
        }));

        showToast({
            text: t(`✨ تم تطبيق قالب "${aesthetic.name}" بالكامل بنجاح!`, `✨ Applied "${aesthetic.name}" aesthetic completely!`),
            variant: "success"
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isUploadedGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setConfig(prev => ({ ...prev, useImage: true, imageUrl: reader.result as string }));
                setMockupView("chat");
                showToast({
                    text: isUploadedGif
                        ? t("✨ تم تحميل خلفية GIF متحركة بنجاح!", "✨ Animated GIF wallpaper loaded successfully!")
                        : t("🖼️ تم تحميل الصورة بنجاح ودمجها في الثيم!", "🖼️ Image loaded and embedded into theme!"),
                    variant: "success"
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFontFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "");
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                const dataUrl = reader.result;
                const fontName = cleanName || "CustomFont";
                setConfig(prev => ({
                    ...prev,
                    fontFamily: "custom",
                    customFontName: fontName,
                    customFontData: dataUrl
                }));

                // Inject live preview for custom font
                let styleEl = document.getElementById("fancord-custom-font-preview") as HTMLStyleElement | null;
                if (!styleEl) {
                    styleEl = document.createElement("style");
                    styleEl.id = "fancord-custom-font-preview";
                    document.head.appendChild(styleEl);
                }
                styleEl.textContent = `
                    @font-face {
                        font-family: '${fontName}';
                        src: url('${dataUrl}') format('truetype');
                        font-weight: normal;
                        font-style: normal;
                        font-display: swap;
                    }
                `;

                showToast({
                    text: t(`✨ تم رفع وتطبيق الخط "${file.name}" بنجاح!`, `✨ Custom font "${file.name}" loaded successfully!`),
                    variant: "success"
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImportFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text || text.trim().length === 0) {
                showToast({
                    text: t("الحافظة فارغة! انسخ كود ثيم أولاً.", "Clipboard is empty! Copy theme code first."),
                    variant: "critical"
                });
                return;
            }

            const newCfg = parseThemeCssToConfig(text);
            if (Object.keys(newCfg).length > 0) {
                setConfig(prev => ({ ...prev, ...newCfg }));
                showToast({
                    text: t(`✨ تم استيراد وقراءة ألوان الثيم بنجاح! (${Object.keys(newCfg).length} خاصية)`, `✨ Successfully imported ${Object.keys(newCfg).length} theme properties!`),
                    variant: "success"
                });
            } else {
                showToast({
                    text: t("لم يتم العثور على متغيرات CSS صالحة في الحافظة.", "No valid CSS theme variables found in clipboard."),
                    variant: "critical"
                });
            }
        } catch (err: any) {
            showToast({
                text: t("تعذر القراءة من الحافظة: " + String(err?.message || err), "Clipboard read error: " + String(err?.message || err)),
                variant: "critical"
            });
        }
    };

    const handleSaveAndApply = async () => {
        try {
            const rawName = config.name.trim() || "My-Custom-Theme";
            const safeFileName = rawName.replace(/[/\\?%*:|"<>]/g, "-") + ".theme.css";
            const cssContent = generateThemeCss(config);

            // Write theme file to disk
            await VencordNative.themes.uploadTheme(safeFileName, cssContent);

            // Disable any conflicting local black or template themes so transparency & wallpaper take full effect
            const conflictingPresets = [
                "أسود.theme.css",
                "سايبربنك.theme.css",
                "صقيع.theme.css",
                "Cosmic Deep Space.theme.css",
                "OLED Obsidian Stealth.theme.css",
                "My-Custom-Theme.theme.css",
                "Anime Sakura.theme.css",
                "Cyberpunk 2077.theme.css",
                "Lo-Fi Chill Rain.theme.css",
                "Emerald Zen Forest.theme.css",
                "Royal Crimson Blood.theme.css",
                "Nordic Arctic Frost.theme.css"
            ];
            const currentEnabled = Settings.enabledThemes ?? [];
            const cleanList = currentEnabled.filter(t => t !== safeFileName && !conflictingPresets.includes(t));

            // Set this theme as active
            Settings.enabledThemes = [...cleanList, safeFileName];

            // Immediately apply active custom theme into the live DOM
            let activeStyle = document.getElementById("fancord-active-custom-theme") as HTMLStyleElement | null;
            if (!activeStyle) {
                activeStyle = document.createElement("style");
                activeStyle.id = "fancord-active-custom-theme";
                document.head.appendChild(activeStyle);
            }
            activeStyle.textContent = cssContent;

            // Trigger Vencord's internal theme reload
            try {
                await initThemes();
            } catch {
                // Ignore if not yet initialized
            }

            // Remove any temporary live preview elements
            document.getElementById("fancord-theme-live-preview")?.remove();
            document.getElementById("fancord-custom-font-preview")?.remove();

            showToast({
                text: t(`✨ تم حفظ وتفعيل الثيم "${rawName}" على ديسكورد فوراً!`, `✨ Theme "${rawName}" saved and applied to Discord immediately!`),
                variant: "success"
            });
            onClose();
        } catch (err: any) {
            showToast({
                text: t("تعذر حفظ الثيم: " + String(err?.message || err), "Failed to save theme: " + String(err?.message || err)),
                variant: "critical"
            });
        }
    };

    const handleExportFile = () => {
        const rawName = config.name.trim() || "My-Custom-Theme";
        const safeFileName = rawName.replace(/[/\\?%*:|"<>]/g, "-") + ".theme.css";
        const cssContent = generateThemeCss(config);
        downloadThemeFile(safeFileName, cssContent);
        showToast({
            text: t("تم تنزيل ملف الثيم! يمكنك الآن إرساله لأصدقائك.", "Theme file downloaded! You can now share it with friends."),
            variant: "success"
        });
    };

    const handleCopyCss = () => {
        const cssContent = generateThemeCss(config);
        copyWithToast(
            cssContent,
            t("تم نسخ كود الثيم بالكامل في الحافظة!", "Theme CSS code copied to clipboard!")
        );
    };

    const handleResetDefaults = () => {
        setConfig(defaultConfig);
        showToast({
            text: t("تمت استعادة الإعدادات الافتراضية بنجاح.", "Restored default theme settings."),
            variant: "default"
        });
    };

    const fontOptions = getFontOptions();
    const completeAesthetics = getCompleteAesthetics();
    const selectedFont = fontOptions.find(f => f.id === config.fontFamily);

    const activeFontFamily = config.fontFamily === "custom" && config.customFontData
        ? (config.customFontName || "CustomFont")
        : (selectedFont?.family || undefined);

    const scope = config.wallpaperScope || "full";

    React.useLayoutEffect(() => {
        const rootEl = document.querySelector(".fancord-tc-modal-root") as HTMLElement | null;
        if (!rootEl) return;

        // Traverse upwards to find the dialog root and remove Discord size clamps
        const dialogEl = (
            rootEl.closest('[role="dialog"]') ||
            rootEl.closest('[class*="root_"]') ||
            rootEl.closest('[class*="modal_"]') ||
            rootEl.parentElement?.parentElement
        ) as HTMLElement | null;

        if (dialogEl) {
            dialogEl.style.setProperty("width", "96vw", "important");
            dialogEl.style.setProperty("max-width", "1760px", "important");
            dialogEl.style.setProperty("min-width", "1100px", "important");
            dialogEl.style.setProperty("height", "94vh", "important");
            dialogEl.style.setProperty("max-height", "96vh", "important");
            dialogEl.style.setProperty("border-radius", "16px", "important");
            dialogEl.style.setProperty("overflow", "hidden", "important");
        }

        // Unclamp all Discord intermediate containers and scrollers
        let curr = rootEl.parentElement;
        while (curr && curr !== dialogEl && curr !== document.body) {
            curr.style.setProperty("padding", "0px", "important");
            curr.style.setProperty("height", "100%", "important");
            curr.style.setProperty("max-height", "none", "important");
            curr.style.setProperty("overflow", "hidden", "important");
            curr.style.setProperty("display", "flex", "important");
            curr.style.setProperty("flex-direction", "column", "important");
            curr.style.setProperty("flex", "1", "important");
            curr = curr.parentElement;
        }
    }, [activeTab]);

    return (
        <Modal
            transitionState={transitionState}
            onClose={() => {
                document.getElementById("fancord-theme-live-preview")?.remove();
                document.getElementById("fancord-custom-font-preview")?.remove();
                onClose();
            }}
            size="xxl"
            title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: 48, boxSizing: "border-box" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 24 }}>🎨</span>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "var(--header-primary)" }}>
                                {t("محرر واستوديو الثيمات الفاخر (FanCord Theme Studio)", "FanCord Theme Studio & Customizer")}
                            </h2>
                        </div>
                    </div>
                    {livePreviewActive && (
                        <div className="fancord-tc-live-banner" style={{ flexShrink: 0 }}>
                            <span className="fancord-tc-live-dot" />
                            <span>{t("المعاينة الحية نشطة على كامل ديسكورد", "Discord Live Preview Active")}</span>
                        </div>
                    )}
                </div>
            }
            subtitle={
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                    {t(
                        "صمّم ثيم ديسكورد بالكامل: ألوان الواجهة، خلفيات وصور GIF متحركة، زجاج شفاف Glassmorphism، خطوط مخصصة، وتوهج نيون.",
                        "Craft your personal theme: colors, animated GIFs, glassmorphism blur, custom typography & neon flair."
                    )}
                </p>
            }
        >
            <div className="fancord-tc-modal-root fancord-theme-creator-modal">
                <div className="fancord-tc-container">
                    {/* Quick Color Presets Row */}
                    <div className="fancord-tc-presets-section">
                        <span className="fancord-tc-presets-title">
                            <span>✨</span>
                            {t("تدرجات ألوان سريعة بلمسة واحدة:", "Quick Color Presets:")}
                        </span>
                        <div className="fancord-tc-presets-grid">
                            {THEME_PRESETS.map(preset => (
                                <button
                                    key={preset.name}
                                    type="button"
                                    className="fancord-tc-preset-pill"
                                    onClick={() => applyColorPreset(preset)}
                                    title={arabicActive ? preset.descAr : preset.descEn}
                                >
                                    <span
                                        className="fancord-tc-preset-dot"
                                        style={{ backgroundColor: preset.accentColor }}
                                    />
                                    {arabicActive ? preset.nameAr : preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="fancord-tc-tabs">
                        <button
                            type="button"
                            className={`fancord-tc-tab-btn ${activeTab === "presets" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("presets");
                                setMockupView("chat");
                            }}
                        >
                            <span>🌟</span>
                            {t("قوالب متكاملة جاهزة", "Curated Showcase")}
                        </button>
                        <button
                            type="button"
                            className={`fancord-tc-tab-btn ${activeTab === "colors" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("colors");
                                setMockupView("chat");
                            }}
                        >
                            <span>🎨</span>
                            {t("الألوان والشفافية", "Colors & Opacity")}
                        </button>
                        <button
                            type="button"
                            className={`fancord-tc-tab-btn ${activeTab === "image" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("image");
                                setMockupView("chat");
                            }}
                        >
                            <span>🖼️</span>
                            {t("الخلفية وصور GIF", "Wallpaper & GIFs")}
                        </button>
                        <button
                            type="button"
                            className={`fancord-tc-tab-btn ${activeTab === "effects" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("effects");
                                setMockupView("chat");
                            }}
                        >
                            <span>💎</span>
                            {t("الخطوط والمؤثرات", "Fonts & Flair")}
                        </button>
                        <button
                            type="button"
                            className={`fancord-tc-tab-btn ${activeTab === "guide" ? "active" : ""}`}
                            onClick={() => setActiveTab("guide")}
                        >
                            <span>📖</span>
                            {t("دليل الثيمات", "Theme Guide")}
                        </button>
                        <button
                            type="button"
                            className={`fancord-tc-tab-btn ${activeTab === "meta" ? "active" : ""}`}
                            onClick={() => setActiveTab("meta")}
                        >
                            <span>📝</span>
                            {t("التصدير والاستيراد", "Export & Import")}
                        </button>
                    </div>

                    {/* Main Split: Settings + Live Preview (Mockup is Pinned on the right for ALL tabs) */}
                    <div className="fancord-tc-main-split">
                        <div className="fancord-tc-settings-col">
                            {/* TAB 0: CURATED COMPLETE AESTHETICS */}
                            {activeTab === "presets" && (
                                <div className="fancord-tc-card">
                                    <span className="fancord-tc-card-title">
                                        <span>🌟</span>
                                        {t("ثيمات وقوالب متكاملة بنقرة واحدة (ألوان + خلفية متحركة + خطوط + مؤثرات)", "Curated Complete Themes Showcase")}
                                    </span>
                                    <p style={{ margin: "0", fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
                                        {t(
                                            "اختر أي قالب لتطبيقه بالكامل فوراً: سيقوم بضبط درجات الألوان، وتعيين الخلفية أو الـ GIF المتحرك المتناسق، واختيار الخط والمؤثرات بنقرة واحدة لتراها مباشرة في المعاينة على اليمين!",
                                            "Pick any complete theme: automatically configures colors, matching animated wallpaper, typography and effects in 1-click to see them live on the right!"
                                        )}
                                    </p>

                                    <div className="fancord-tc-showcase-grid">
                                        {completeAesthetics.map(aes => (
                                            <div
                                                key={aes.id}
                                                className="fancord-tc-showcase-card"
                                                style={{ borderTop: `3px solid ${aes.accentColor}` }}
                                                onClick={() => applyCompleteAesthetic(aes)}
                                            >
                                                <div className="fancord-tc-showcase-header">
                                                    <span className="fancord-tc-showcase-name">{aes.name}</span>
                                                    <span className="fancord-tc-badge" style={{ backgroundColor: hexToRgba(aes.accentColor, 0.2), color: aes.accentColor }}>
                                                        {aes.badge}
                                                    </span>
                                                </div>
                                                <p className="fancord-tc-showcase-desc">{aes.desc}</p>
                                                <div className="fancord-tc-showcase-footer">
                                                    <div style={{ display: "flex", gap: 5 }}>
                                                        <span className="fancord-tc-mini-dot" style={{ backgroundColor: aes.accentColor }} />
                                                        <span className="fancord-tc-mini-dot" style={{ backgroundColor: aes.chatBg }} />
                                                        <span className="fancord-tc-mini-dot" style={{ backgroundColor: aes.sidebarBg }} />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="fancord-tc-showcase-btn"
                                                        style={{ backgroundColor: aes.accentColor }}
                                                    >
                                                        {t("تطبيق القالب", "Apply")}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 1: COLORS & OPACITIES */}
                            {activeTab === "colors" && (
                                <>
                                    <div className="fancord-tc-card">
                                        <span className="fancord-tc-card-title">
                                            <span>🎯</span>
                                            {t("تخصيص ألوان الواجهة", "Interface Colors")}
                                        </span>
                                        <div className="fancord-tc-color-grid">
                                            {/* Accent Color */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("accent")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("اللون التمييزي / الأزرار", "Accent / Brand")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("أزرار وتوهج", "Buttons & Glow")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.accentColor }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.accentColor.startsWith("#") ? config.accentColor : "#8a5cf6"}
                                                            onChange={e => setConfig(p => ({ ...p, accentColor: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("accent")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.accentColor}
                                                        onChange={e => setConfig(p => ({ ...p, accentColor: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("accent")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Chat Background */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("chat")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("خلفية منطقة الشات", "Chat Background")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("المحادثة", "Chat")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.chatBg }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.chatBg.startsWith("#") ? config.chatBg : "#120e1e"}
                                                            onChange={e => setConfig(p => ({ ...p, chatBg: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("chat")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.chatBg}
                                                        onChange={e => setConfig(p => ({ ...p, chatBg: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("chat")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Sidebar Background */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("sidebar")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("خلفية القنوات / السايدبار", "Channels & Sidebar")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("القنوات", "Channels")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.sidebarBg }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.sidebarBg.startsWith("#") ? config.sidebarBg : "#0d0a15"}
                                                            onChange={e => setConfig(p => ({ ...p, sidebarBg: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("sidebar")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.sidebarBg}
                                                        onChange={e => setConfig(p => ({ ...p, sidebarBg: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("sidebar")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Servers Bar */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("servers")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("شريط السيرفرات (الأيسر)", "Servers List Rail")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("السيرفرات", "Servers")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.serversBg }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.serversBg.startsWith("#") ? config.serversBg : "#08060e"}
                                                            onChange={e => setConfig(p => ({ ...p, serversBg: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("servers")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                            title={config.serversBg}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.serversBg}
                                                        onChange={e => setConfig(p => ({ ...p, serversBg: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("servers")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Header / Popouts */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("header")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("الهيدر وشريط العنوان", "Header Titlebar")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("العنوان", "Header")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.headerBg }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.headerBg.startsWith("#") ? config.headerBg : "#161124"}
                                                            onChange={e => setConfig(p => ({ ...p, headerBg: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("header")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.headerBg}
                                                        onChange={e => setConfig(p => ({ ...p, headerBg: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("header")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Message Box Input */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("input")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("خلفية صندوق الكتابة", "Message Box Input")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("الكتابة", "Input")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.inputBg || "#1e1730" }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={(config.inputBg || "#1e1730").startsWith("#") ? config.inputBg : "#1e1730"}
                                                            onChange={e => setConfig(p => ({ ...p, inputBg: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("input")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.inputBg || "#1e1730"}
                                                        onChange={e => setConfig(p => ({ ...p, inputBg: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("input")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Hover Highlight */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("accent")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("لون التحديد عند التأشير (Hover)", "Hover Highlight")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("تأشير", "Hover")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.hoverBg }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.hoverBg.startsWith("#") ? config.hoverBg : "#8a5cf6"}
                                                            onChange={e => setConfig(p => ({ ...p, hoverBg: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("accent")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.hoverBg}
                                                        onChange={e => setConfig(p => ({ ...p, hoverBg: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("accent")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Primary Text */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("text")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("لون النصوص الأساسية", "Primary Text Color")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("النصوص", "Text")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.primaryText }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.primaryText.startsWith("#") ? config.primaryText : "#f3e8ff"}
                                                            onChange={e => setConfig(p => ({ ...p, primaryText: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("text")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.primaryText}
                                                        onChange={e => setConfig(p => ({ ...p, primaryText: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("text")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Muted Text */}
                                            <div
                                                className="fancord-tc-color-item"
                                                onMouseEnter={() => setHighlightedElement("text")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-color-header-row">
                                                    <label className="fancord-tc-color-label">{t("لون النصوص الفرعية والرموز", "Muted Text & Icons")}</label>
                                                    <span className="fancord-tc-target-badge">🎯 {t("فرعي", "Muted")}</span>
                                                </div>
                                                <div className="fancord-tc-color-input-wrap">
                                                    <div className="fancord-tc-color-swatch" style={{ backgroundColor: config.mutedText }}>
                                                        <input
                                                            type="color"
                                                            className="fancord-tc-native-color"
                                                            value={config.mutedText.startsWith("#") ? config.mutedText : "#a78bfa"}
                                                            onChange={e => setConfig(p => ({ ...p, mutedText: e.target.value }))}
                                                            onFocus={() => setHighlightedElement("text")}
                                                            onBlur={() => setHighlightedElement(null)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="fancord-tc-hex-input"
                                                        value={config.mutedText}
                                                        onChange={e => setConfig(p => ({ ...p, mutedText: e.target.value }))}
                                                        onFocus={() => setHighlightedElement("text")}
                                                        onBlur={() => setHighlightedElement(null)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Granular Transparencies for Discord Panels */}
                                    <div className="fancord-tc-card">
                                        <span className="fancord-tc-card-title">
                                            <span>🪟</span>
                                            {t("التحكم الكامل في شفافية جميع أقسام ديسكورد", "Granular Section Transparency Sliders")}
                                        </span>

                                        <div className="fancord-tc-sliders-grid">
                                            {/* Chat Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("chat")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة منطقة الشات والرسائل", "Chat Messages Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.chatOpacity ?? 0.25) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.0}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.chatOpacity ?? 0.25}
                                                    onChange={e => setConfig(p => ({ ...p, chatOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("chat")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Sidebar Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("sidebar")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة قائمة القنوات والرومات (Sidebar)", "Channels & Voice Sidebar Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.sidebarOpacity ?? 0.45) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.0}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.sidebarOpacity ?? 0.45}
                                                    onChange={e => setConfig(p => ({ ...p, sidebarOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("sidebar")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Servers Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("servers")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة شريط السيرفرات الأيسر", "Server Rail Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.serversOpacity ?? 0.6) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.0}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.serversOpacity ?? 0.6}
                                                    onChange={e => setConfig(p => ({ ...p, serversOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("servers")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Settings Windows Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("settings")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة نافذة وقوائم الإعدادات (Settings)", "Settings Windows & Modals Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.settingsOpacity ?? 0.85) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.2}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.settingsOpacity ?? 0.85}
                                                    onChange={e => setConfig(p => ({ ...p, settingsOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("settings")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Members List Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("members")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة قائمة الأعضاء الجانبية", "Members List Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.membersOpacity ?? 0.45) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.1}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.membersOpacity ?? 0.45}
                                                    onChange={e => setConfig(p => ({ ...p, membersOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("members")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Popouts & Menus Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("popouts")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة القوائم والبروفايل المنبثق (Popouts)", "Popouts & Context Menus Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.popoutsOpacity ?? 0.85) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.3}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.popoutsOpacity ?? 0.85}
                                                    onChange={e => setConfig(p => ({ ...p, popoutsOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("popouts")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Message Input Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("input")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة صندوق كتابة الرسائل (Input)", "Message Composer Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.inputOpacity ?? 0.7) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.1}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.inputOpacity ?? 0.7}
                                                    onChange={e => setConfig(p => ({ ...p, inputOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("input")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Server Folders & Rail Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("folders")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة مجلدات وأيقونات السيرفرات (Folders)", "Server Folders & Rail Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.foldersOpacity ?? 0.65) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.0}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.foldersOpacity ?? 0.65}
                                                    onChange={e => setConfig(p => ({ ...p, foldersOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("folders")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Voice & Video Calls Opacity */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => {
                                                    setHighlightedElement("voice");
                                                    setMockupView("voice");
                                                }}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("عتامة قنوات ومكالمات الصوت والفيديو (Voice)", "Voice & Video Calls Opacity")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round((config.voiceCallOpacity ?? 0.35) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.0}
                                                    max={1.0}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.voiceCallOpacity ?? 0.35}
                                                    onChange={e => {
                                                        setConfig(p => ({ ...p, voiceCallOpacity: Number(e.target.value) }));
                                                        setMockupView("voice");
                                                    }}
                                                    onFocus={() => {
                                                        setHighlightedElement("voice");
                                                        setMockupView("voice");
                                                    }}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Roundness / Border Radius */}
                                            <div
                                                className="fancord-tc-slider-row"
                                                onMouseEnter={() => setHighlightedElement("radius")}
                                                onMouseLeave={() => setHighlightedElement(null)}
                                            >
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("استدارة الحواف والبطاقات", "Border Radius / Roundness")}</span>
                                                    <span className="fancord-tc-slider-val">{config.borderRadius}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={24}
                                                    step={2}
                                                    className="fancord-tc-range"
                                                    value={config.borderRadius}
                                                    onChange={e => setConfig(p => ({ ...p, borderRadius: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("radius")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TAB 2: BACKGROUND IMAGE, GIF & SCOPE (ALWAYS ACTIVE & FULLY EDITABLE) */}
                            {activeTab === "image" && (
                                <div
                                    className="fancord-tc-card"
                                    onMouseEnter={() => setHighlightedElement("wallpaper")}
                                    onMouseLeave={() => setHighlightedElement(null)}
                                >
                                    {/* Master Wallpaper / GIF Switch Card */}
                                    <div className="fancord-tc-master-switch-card">
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={{ fontSize: 26 }}>🖼️</span>
                                            <div>
                                                <strong style={{ fontSize: 14, color: "var(--header-primary)" }}>
                                                    {t("خلفية ديسكورد وصور الـ GIF المتحركة", "Custom Wallpaper & Animated GIF Engine")}
                                                </strong>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                                                    {config.useImage && config.imageUrl
                                                        ? t("الخلفية مفعلة وتعمل مباشرة على ديسكورد والمعاينة", "Wallpaper is active and rendering in live preview")
                                                        : t("اختر أي GIF من الأسفل أو ارفع صورة لتفعيلها تلقائياً", "Pick any GIF below or upload an image to activate automatically")}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span
                                                className={`fancord-tc-status-pill ${config.useImage && config.imageUrl ? "active" : ""}`}
                                            >
                                                {config.useImage && config.imageUrl
                                                    ? (isGif ? t("✨ GIF متحرك نشط", "✨ Animated GIF Active") : t("🖼️ صورة مفعلة", "🖼️ Image Active"))
                                                    : t("○ غير مفعلة", "○ Inactive")}
                                            </span>
                                            <label className="fancord-tc-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={config.useImage}
                                                    onChange={e => setConfig(p => ({ ...p, useImage: e.target.checked }))}
                                                />
                                                <span className="fancord-tc-slider-toggle" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Active Wallpaper Thumbnail & Controls Bar */}
                                    {config.imageUrl && (
                                        <div className="fancord-tc-active-img-bar">
                                            <div
                                                className="fancord-tc-thumb-preview"
                                                style={{ backgroundImage: `url("${config.imageUrl}")` }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <strong style={{ fontSize: 12.5, color: "var(--header-primary)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                                    {config.imageUrl.startsWith("data:") ? t("ملف مرفوع من جهازك", "Uploaded local file") : config.imageUrl}
                                                </strong>
                                                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                                    {isGif ? t("نوع الملف: GIF متحرك متكرر السلاسة", "Format: Smooth Animated Loop GIF") : t("نوع الملف: صورة ثابتة", "Format: Static Image Wallpaper")}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="fancord-tc-preset-pill"
                                                style={{ color: "#ff4d4d", borderColor: "#ff4d4d", padding: "6px 12px" }}
                                                onClick={() => setConfig(p => ({ ...p, imageUrl: "", useImage: false }))}
                                            >
                                                <span>🗑️</span>
                                                {t("مسح الخلفية", "Remove Wallpaper")}
                                            </button>
                                        </div>
                                    )}

                                    {/* Scope Selector: Where should the wallpaper appear? */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "var(--background-tertiary)", padding: 12, borderRadius: 8 }}>
                                        <label className="fancord-tc-color-label" style={{ fontWeight: 700 }}>
                                            🎯 {t("نطاق ظهور الخلفية في واجهة ديسكورد (Display Scope):", "Where should the background / GIF appear?")}
                                        </label>
                                        <div className="fancord-tc-scope-grid">
                                            <button
                                                type="button"
                                                className={`fancord-tc-scope-btn ${scope === "full" ? "active" : ""}`}
                                                onClick={() => setConfig(p => ({ ...p, useImage: true, wallpaperScope: "full" }))}
                                            >
                                                <span>🌐</span>
                                                <div>
                                                    <strong>{t("كامل ديسكورد (الشات + القنوات + السيرفرات)", "Entire Discord (Full Window)")}</strong>
                                                    <p>{t("تمتد الخلفية عبر الشاشة بأكملها بنعومة وانسيابية", "Wallpaper spans across all windows and panels")}</p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                className={`fancord-tc-scope-btn ${scope === "chat" ? "active" : ""}`}
                                                onClick={() => setConfig(p => ({ ...p, useImage: true, wallpaperScope: "chat" }))}
                                            >
                                                <span>💬</span>
                                                <div>
                                                    <strong>{t("منطقة الدردشة فقط (Chat Only)", "Chat Messages Area Only")}</strong>
                                                    <p>{t("تظهر الخلفية خلف الرسائل فقط، بينما القنوات والسيرفرات داكنة", "Only chat area has wallpaper, sidebars stay solid")}</p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                className={`fancord-tc-scope-btn ${scope === "chatAndSidebar" ? "active" : ""}`}
                                                onClick={() => setConfig(p => ({ ...p, useImage: true, wallpaperScope: "chatAndSidebar" }))}
                                            >
                                                <span>📑</span>
                                                <div>
                                                    <strong>{t("الدردشة + قائمة القنوات (بدون شريط السيرفرات)", "Chat & Channels Sidebar")}</strong>
                                                    <p>{t("تظهر بالدردشة والقنوات مع إبقاء شريط السيرفرات ثابتاً", "Wallpaper shows behind chat & channels, excluding servers")}</p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                className={`fancord-tc-scope-btn ${scope === "sidebar" ? "active" : ""}`}
                                                onClick={() => setConfig(p => ({ ...p, useImage: true, wallpaperScope: "sidebar" }))}
                                            >
                                                <span>📁</span>
                                                <div>
                                                    <strong>{t("قائمة القنوات والرومات فقط (Sidebar Only)", "Channels Sidebar Only")}</strong>
                                                    <p>{t("تظهر الخلفية خلف قائمة الرومات فقط بنمط فريد", "Wallpaper applies exclusively behind channels list")}</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Upload and URL Input Row */}
                                    <div className="fancord-tc-image-row">
                                        <input
                                            type="text"
                                            className="fancord-tc-url-input"
                                            placeholder={t("أدخل رابط صورة أو GIF مباشر (URL)...", "Enter direct Image or GIF URL...")}
                                            value={config.imageUrl}
                                            onChange={e => {
                                                setConfig(p => ({ ...p, useImage: true, imageUrl: e.target.value }));
                                                setMockupView("chat");
                                            }}
                                            onFocus={() => {
                                                setHighlightedElement("wallpaper");
                                            }}
                                            onBlur={() => setHighlightedElement(null)}
                                        />
                                        <label className="fancord-tc-upload-btn">
                                            <span>📁</span>
                                            {t("رفع من الجهاز (صور أو GIF)", "Upload Image / GIF")}
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp,image/gif,image/*"
                                                style={{ display: "none" }}
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>

                                    {/* Quick GIF Presets Cards Gallery */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                                        <label className="fancord-tc-color-label" style={{ fontWeight: 700 }}>
                                            {t("⚡ قوالب خلفيات متحركة GIF جاهزة بنقرة واحدة:", "Instant Animated GIF Wallpapers Gallery:")}
                                        </label>
                                        <div className="fancord-tc-gif-gallery-grid">
                                            {SAMPLE_GIF_PRESETS.map(sample => (
                                                <div
                                                    key={sample.id}
                                                    className={`fancord-tc-gif-card ${config.imageUrl === sample.url ? "active" : ""}`}
                                                    onClick={() => {
                                                        setConfig(p => ({ ...p, useImage: true, imageUrl: sample.url }));
                                                        setMockupView("chat");
                                                    }}
                                                >
                                                    <div
                                                        className="fancord-tc-gif-card-thumb"
                                                        style={{ backgroundImage: `url("${sample.url}")` }}
                                                    >
                                                        <span className="fancord-tc-gif-pill-badge">GIF</span>
                                                        {config.imageUrl === sample.url && (
                                                            <span className="fancord-tc-gif-active-badge">✓</span>
                                                        )}
                                                    </div>
                                                    <div className="fancord-tc-gif-card-info">
                                                        <strong>{arabicActive ? sample.nameAr : sample.nameEn}</strong>
                                                        <p>{arabicActive ? sample.descAr : sample.descEn}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Visual Fine-Tuning Sliders */}
                                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
                                        <label className="fancord-tc-color-label" style={{ fontWeight: 700 }}>
                                            🎛️ {t("تعديل إضاءة وضبابية وزجاج الخلفية:", "Wallpaper Brightness, Tint & Glass Adjustments:")}
                                        </label>
                                        <div className="fancord-tc-sliders-grid">
                                            {/* Darkness Overlay Slider */}
                                            <div className="fancord-tc-slider-row">
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("تعتيم الخلفية (لحماية وضوح نصوص الرسائل)", "Darkness Overlay Tint")}</span>
                                                    <span className="fancord-tc-slider-val">{Math.round(config.overlayOpacity * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0.0}
                                                    max={0.9}
                                                    step={0.05}
                                                    className="fancord-tc-range"
                                                    value={config.overlayOpacity}
                                                    onChange={e => setConfig(p => ({ ...p, useImage: true, overlayOpacity: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("wallpaper")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Glassmorphism Blur Slider */}
                                            <div className="fancord-tc-slider-row">
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("تغبيش الزجاج (Glassmorphism Backdrop Blur)", "Glassmorphism Backdrop Blur")}</span>
                                                    <span className="fancord-tc-slider-val">{config.glassBlur ?? 8}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={30}
                                                    step={1}
                                                    className="fancord-tc-range"
                                                    value={config.glassBlur ?? 8}
                                                    onChange={e => setConfig(p => ({ ...p, useImage: true, glassBlur: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("wallpaper")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Wallpaper Blur Slider */}
                                            <div className="fancord-tc-slider-row">
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("ضبابية الصورة نفسها (Wallpaper Blur)", "Wallpaper Blur Effect")}</span>
                                                    <span className="fancord-tc-slider-val">{config.bgBlur}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={25}
                                                    step={1}
                                                    className="fancord-tc-range"
                                                    value={config.bgBlur}
                                                    onChange={e => setConfig(p => ({ ...p, useImage: true, bgBlur: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("wallpaper")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>

                                            {/* Brightness Slider */}
                                            <div className="fancord-tc-slider-row">
                                                <div className="fancord-tc-slider-header">
                                                    <span>🎯 {t("سطوع وإضاءة الصورة (Brightness)", "Image Brightness")}</span>
                                                    <span className="fancord-tc-slider-val">{config.bgBrightness}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={40}
                                                    max={140}
                                                    step={5}
                                                    className="fancord-tc-range"
                                                    value={config.bgBrightness}
                                                    onChange={e => setConfig(p => ({ ...p, useImage: true, bgBrightness: Number(e.target.value) }))}
                                                    onFocus={() => setHighlightedElement("wallpaper")}
                                                    onBlur={() => setHighlightedElement(null)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background Fit Mode */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                                        <label className="fancord-tc-color-label">{t("طريقة احتواء وملاءمة الصورة (Fit Mode)", "Wallpaper Fit Mode")}</label>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            {(["cover", "contain", "repeat", "center"] as const).map(mode => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    className={`fancord-tc-preset-pill ${config.bgFit === mode ? "active" : ""}`}
                                                    style={{
                                                        borderColor: config.bgFit === mode ? "var(--brand-experiment)" : undefined,
                                                        background: config.bgFit === mode ? "var(--brand-experiment)" : undefined,
                                                        color: config.bgFit === mode ? "#fff" : undefined
                                                    }}
                                                    onClick={() => setConfig(p => ({ ...p, useImage: true, bgFit: mode }))}
                                                >
                                                    {mode.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: FONTS, UPLOAD CUSTOM FONT & FLAIR */}
                            {activeTab === "effects" && (
                                <div className="fancord-tc-card">
                                    <span className="fancord-tc-card-title">
                                        <span>🔤</span>
                                        {t("الخطوط وتنسيق النصوص ورفع خط خاص (Typography)", "Custom Fonts & Custom Upload")}
                                    </span>
                                    <p style={{ margin: "0", fontSize: 12.5, color: "var(--text-muted)" }}>
                                        {t(
                                            "اختر خطك المفضل أو ارفع ملف خط مخصص من جهازك بصيغة (.ttf, .otf, .woff2) ليتم دمجه بالكامل في الثيم ورؤيته فوراً بالمعاينة.",
                                            "Select a built-in font or upload your own custom font file (.ttf, .otf, .woff2) to embed directly into the theme and see it live."
                                        )}
                                    </p>

                                    {/* Upload Custom Font Card */}
                                    <div className="fancord-tc-upload-font-card">
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 20 }}>📁</span>
                                                <div>
                                                    <strong>{t("رفع ملف خط من جهازك (Upload Font File)", "Upload Custom Font File (.ttf, .otf, .woff2)")}</strong>
                                                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                                                        {config.customFontData
                                                            ? t(`الخط الحالي المرفوع: "${config.customFontName}"`, `Active uploaded font: "${config.customFontName}"`)
                                                            : t("يدعم صيغ TTF و OTF و WOFF2 ويتم حفظه داخل الثيم", "Supports TTF, OTF, WOFF2 and embeds safely")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <label className="fancord-tc-upload-btn">
                                                    <span>📤</span>
                                                    {t("اختيار ملف خط...", "Browse Font...")}
                                                    <input
                                                        type="file"
                                                        accept=".ttf,.otf,.woff,.woff2,font/*"
                                                        style={{ display: "none" }}
                                                        onChange={handleFontFileUpload}
                                                    />
                                                </label>
                                                {config.customFontData && (
                                                    <button
                                                        type="button"
                                                        className="fancord-tc-preset-pill"
                                                        style={{ color: "#ff4d4d", borderColor: "#ff4d4d" }}
                                                        onClick={() => setConfig(p => ({ ...p, customFontData: "", fontFamily: "default" }))}
                                                    >
                                                        {t("حذف", "Remove")}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Font Options Grid */}
                                    <div
                                        className="fancord-tc-fonts-grid"
                                        onMouseEnter={() => setHighlightedElement("fonts")}
                                        onMouseLeave={() => setHighlightedElement(null)}
                                    >
                                        {fontOptions.map(font => (
                                            <div
                                                key={font.id}
                                                className={`fancord-tc-font-card ${config.fontFamily === font.id ? "active" : ""}`}
                                                onClick={() => setConfig(p => ({ ...p, fontFamily: font.id }))}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span className="fancord-tc-font-name" style={{ fontFamily: font.family === "custom" ? (config.customFontName || undefined) : (font.family || undefined) }}>
                                                        {font.name}
                                                    </span>
                                                    {config.fontFamily === font.id && (
                                                        <span style={{ color: "var(--brand-experiment)", fontWeight: 700 }}>✓</span>
                                                    )}
                                                </div>
                                                <span className="fancord-tc-font-desc">{font.desc}</span>
                                                <div
                                                    className="fancord-tc-font-sample"
                                                    style={{ fontFamily: font.family === "custom" ? (config.customFontName || undefined) : (font.family || undefined) }}
                                                >
                                                    {arabicActive
                                                        ? "أهلاً بك في ديسكورد FanCord الفاخر! 123"
                                                        : "The quick brown fox jumps over the lazy dog 123"}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Visual Flair Toggles */}
                                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                                        <span className="fancord-tc-card-title">
                                            <span>✨</span>
                                            {t("مؤثرات بصرية جمالية إضافية (Visual Flair)", "Additional Aesthetic Toggles")}
                                        </span>

                                        {/* Neon Glow Toggle */}
                                        <div
                                            className="fancord-tc-toggle-row"
                                            onMouseEnter={() => setHighlightedElement("accent")}
                                            onMouseLeave={() => setHighlightedElement(null)}
                                        >
                                            <div>
                                                <strong>{t("🌟 توهج نيون تمييزي (Neon Accent Glow)", "Neon Accent Glow")}</strong>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                                                    {t("إضاءة وهالة نيون محيطية ناعمة حول القنوات النشطة والمنشن والأزرار التفاعلية.", "Adds subtle luminescence glow around active channels, mentions, and brand buttons.")}
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={config.neonGlow}
                                                onChange={e => setConfig(p => ({ ...p, neonGlow: e.target.checked }))}
                                            />
                                        </div>

                                        {/* Frosted Acrylic Borders */}
                                        <div className="fancord-tc-toggle-row">
                                            <div>
                                                <strong>{t("💎 حدود زجاجية أكريليك (Frosted Acrylic Borders)", "Frosted Acrylic Borders")}</strong>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                                                    {t("إضافة حدود زجاجية رفيعة شبه شفافة حول القوائم وصندوق الرسائل لتعزيز طابع الزجاج.", "Adds sleek semi-transparent glass borders around panels, menus, and message composer.")}
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={config.glassBorders}
                                                onChange={e => setConfig(p => ({ ...p, glassBorders: e.target.checked }))}
                                            />
                                        </div>

                                        {/* Sleek Minimalist Scrollbars */}
                                        <div className="fancord-tc-toggle-row">
                                            <div>
                                                <strong>{t("📜 شريط تمرير سكرول بار عصري ونحيف (Sleek Scrollbars)", "Sleek Minimalist Scrollbars")}</strong>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                                                    {t("استبدال شريط التمرير الافتراضي الضخم بشريط كبسولي نحيف وأنيق بلون الثيم.", "Replaces chunky scrollbars with smooth minimalist pill scrollbars styled with accent color.")}
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={config.customScrollbars}
                                                onChange={e => setConfig(p => ({ ...p, customScrollbars: e.target.checked }))}
                                            />
                                        </div>

                                        {/* Compact Messages */}
                                        <div className="fancord-tc-toggle-row">
                                            <div>
                                                <strong>{t("📐 عرض رسائل مدمج ومكثف (Compact Message Spacing)", "Compact Message Spacing")}</strong>
                                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                                                    {t("تقليص المسافات الرأسية بين الرسائل لعرض كمية أكبر من المحادثات في الشاشة.", "Tightens vertical message paddings to fit more chat content comfortably.")}
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={config.compactMessages}
                                                onChange={e => setConfig(p => ({ ...p, compactMessages: e.target.checked }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: THEME GUIDE & OVERVIEW */}
                            {activeTab === "guide" && (
                                <div className="fancord-tc-guide-card">
                                    <span className="fancord-tc-guide-title">
                                        <span>📖</span>
                                        {t("نبذة ودليل شامل عن استوديو ثيمات FanCord", "Comprehensive Guide to FanCord Themes")}
                                    </span>
                                    <p className="fancord-tc-guide-text">
                                        {t(
                                            "استوديو ثيمات FanCord يمنحك القوة والحرية الكاملة لإعادة تصميم واجهة الديسكورد وتخصيصها بأسلوبك. يتم بناء وتصدير كل ثيم بصيغة BetterDiscord / Vencord CSS القياسية مما يجعله سريعاً بنسبة 100% دون أي ثقل على معالج أو رامات جهازك.",
                                            "FanCord Theme Studio gives you absolute freedom to redesign Discord's visual style. Themes are built with standard BetterDiscord/Vencord CSS meta format, making them blazing fast with zero lag."
                                        )}
                                    </p>

                                    <div className="fancord-tc-guide-tips">
                                        <div className="fancord-tc-guide-tip-item">
                                            <span className="fancord-tc-guide-tip-icon">✨</span>
                                            <div>
                                                <strong>{t("دعم كامل لصور الـ GIF المتحركة ونطاق العرض:", "Full Animated GIF & Scope Customization:")}</strong>
                                                <p style={{ margin: "2px 0 0", color: "var(--text-muted)" }}>
                                                    {t(
                                                        "يمكنك تحديد نطاق ظهور الصورة أو الـ GIF (كامل ديسكورد، منطقة الشات فقط، أو قائمة الرومات) مع دعم كامل لصور GIF المتحركة.",
                                                        "Target your wallpaper or animated GIF precisely: full window, chat only, or channels sidebar."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="fancord-tc-guide-tip-item">
                                            <span className="fancord-tc-guide-tip-icon">📁</span>
                                            <div>
                                                <strong>{t("رفع واستخدام الخطوط الخاصة من جهازك:", "Upload & Embed Custom Font Files:")}</strong>
                                                <p style={{ margin: "2px 0 0", color: "var(--text-muted)" }}>
                                                    {t(
                                                        "يمكنك رفع أي ملف خط بصيغة TTF أو WOFF2 من حاسوبك وسيقوم النظام بتشفيره وتضمينه مباشرة في الثيم ليعمل على الفور.",
                                                        "Upload any local font (.ttf, .otf, .woff2) from your computer and FanCord will embed it into the theme seamlessly."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="fancord-tc-guide-tip-item">
                                            <span className="fancord-tc-guide-tip-icon">💎</span>
                                            <div>
                                                <strong>{t("تأثير الزجاج الشفاف (Glassmorphism & Aero):", "Glassmorphism Transparency:")}</strong>
                                                <p style={{ margin: "2px 0 0", color: "var(--text-muted)" }}>
                                                    {t(
                                                        "تحكم كامل في شفافية الشات، الرومات، شريط السيرفرات، قائمة الأعضاء، ونوافذ الإعدادات مع تمويه ضبابي فاخر.",
                                                        "Granular control over chat, channels, servers, members list and settings windows opacity with frosted glass backdrop blur."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="fancord-tc-guide-tip-item">
                                            <span className="fancord-tc-guide-tip-icon">🎯</span>
                                            <div>
                                                <strong>{t("المؤشر التفاعلي الحي والمعاينة المباشرة:", "Live Interactive Indicator & Direct Preview:")}</strong>
                                                <p style={{ margin: "2px 0 0", color: "var(--text-muted)" }}>
                                                    {t(
                                                        "مرر الماوس فوق أي خيار ليضيء قسمه مباشرة في المعاينة! كما يمكنك تفعيل 'المعاينة الحية' لترى ديسكورد الفعلي يتغير خلف النافذة لحظة بلحظة.",
                                                        "Hovering over any setting immediately highlights that specific element. You can also toggle 'Live Preview' to see Discord transform in real time behind the modal."
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="fancord-tc-guide-tip-item">
                                            <span className="fancord-tc-guide-tip-icon">📤</span>
                                            <div>
                                                <strong>{t("الاستيراد الذكي والمشاركة:", "Smart Import & Instant Sharing:")}</strong>
                                                <p style={{ margin: "2px 0 0", color: "var(--text-muted)" }}>
                                                    {t(
                                                        "يمكنك نسخ كود أي ثيم من صديقك والضغط على 'استيراد من الحافظة' ليتم قراءة الألوان والخلفيات تلقائياً وتعديلها بحرية تامة.",
                                                        "Copy any theme CSS code, click 'Import from Clipboard', and FanCord will automatically parse its variables so you can customize it."
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: METADATA, EXPORT & SMART IMPORT */}
                            {activeTab === "meta" && (
                                <div className="fancord-tc-card">
                                    <span className="fancord-tc-card-title">
                                        <span>📝</span>
                                        {t("بيانات الثيم وحقوق المشاركة والاستيراد", "Theme Metadata & Smart Import")}
                                    </span>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <label className="fancord-tc-color-label">{t("اسم الثيم (Theme Name)", "Theme Name")}</label>
                                        <input
                                            type="text"
                                            className="fancord-tc-url-input"
                                            value={config.name}
                                            onChange={e => setConfig(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <label className="fancord-tc-color-label">{t("اسم المصمم / الصانع (Author)", "Author Name")}</label>
                                        <input
                                            type="text"
                                            className="fancord-tc-url-input"
                                            value={config.author}
                                            onChange={e => setConfig(p => ({ ...p, author: e.target.value }))}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <label className="fancord-tc-color-label">{t("وصف الثيم (Description)", "Description")}</label>
                                        <input
                                            type="text"
                                            className="fancord-tc-url-input"
                                            value={config.description}
                                            onChange={e => setConfig(p => ({ ...p, description: e.target.value }))}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <label className="fancord-tc-color-label">{t("رقم الإصدار (Version)", "Version")}</label>
                                        <input
                                            type="text"
                                            className="fancord-tc-url-input"
                                            value={config.version}
                                            onChange={e => setConfig(p => ({ ...p, version: e.target.value }))}
                                        />
                                    </div>

                                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--background-modifier-accent)", display: "flex", gap: 10 }}>
                                        <button
                                            type="button"
                                            className="fancord-tc-action-btn fancord-tc-btn-secondary"
                                            style={{ flex: 1 }}
                                            onClick={handleImportFromClipboard}
                                        >
                                            <span>📥</span>
                                            {t("استيراد ثيم من الحافظة (Import from Clipboard)", "Import from Clipboard")}
                                        </button>
                                        <button
                                            type="button"
                                            className="fancord-tc-action-btn fancord-tc-btn-secondary"
                                            style={{ flex: 1 }}
                                            onClick={handleCopyCss}
                                        >
                                            <span>📋</span>
                                            {t("نسخ كود الـ CSS بالكامل", "Copy Full CSS")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Live Preview Mockup Column (ALWAYS VISIBLE & PINNED) */}
                        <div className="fancord-tc-preview-col">
                            <div className="fancord-tc-preview-header">
                                <div className="fancord-tc-preview-title">
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span>{t("معاينة تفاعلية حية:", "Live Mockup Preview:")}</span>
                                        {isGif && (
                                            <span className="fancord-tc-gif-badge" style={{ fontSize: 10, padding: "2px 8px" }}>
                                                GIF
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 11, color: "var(--brand-experiment)", fontWeight: 700 }}>● Live Mockup</span>
                                </div>

                                {/* View Switcher Buttons on top of mockup */}
                                <div className="fancord-tc-mockup-tabs">
                                    <button
                                        type="button"
                                        className={`fancord-tc-mockup-tab-btn ${mockupView === "chat" ? "active" : ""}`}
                                        onClick={() => setMockupView("chat")}
                                        title={t("معاينة واجهة ديسكورد والشات المتكاملة", "Full Discord App Preview")}
                                    >
                                        <span>💬</span>
                                        {t("ديسكورد", "Discord")}
                                    </button>
                                    <button
                                        type="button"
                                        className={`fancord-tc-mockup-tab-btn ${mockupView === "voice" ? "active" : ""}`}
                                        onClick={() => setMockupView("voice")}
                                        title={t("معاينة مكالمات الصوت والفيديو والرومات", "Voice & Video Calls Preview")}
                                    >
                                        <span>🔊</span>
                                        {t("المكالمات", "Voice & Calls")}
                                    </button>
                                    <button
                                        type="button"
                                        className={`fancord-tc-mockup-tab-btn ${mockupView === "settings" ? "active" : ""}`}
                                        onClick={() => setMockupView("settings")}
                                        title={t("معاينة نافذة الإعدادات", "Settings Windows Preview")}
                                    >
                                        <span>⚙️</span>
                                        {t("الإعدادات", "Settings")}
                                    </button>
                                    <button
                                        type="button"
                                        className={`fancord-tc-mockup-tab-btn ${mockupView === "popout" ? "active" : ""}`}
                                        onClick={() => setMockupView("popout")}
                                        title={t("معاينة القوائم المنبثقة والبروفايل", "Popouts & Menus Preview")}
                                    >
                                        <span>👤</span>
                                        {t("القوائم", "Popouts")}
                                    </button>
                                    <button
                                        type="button"
                                        className={`fancord-tc-mockup-tab-btn ${mockupView === "wallpaper" ? "active" : ""}`}
                                        onClick={() => setMockupView("wallpaper")}
                                        title={t("معاينة الخلفية أو صورة الـ GIF بالكامل", "Full Wallpaper & GIF Preview")}
                                    >
                                        <span>🖼️</span>
                                        {t("الخلفية", "Wallpaper")}
                                    </button>
                                </div>

                                {/* Live Highlighting Indicator Bar */}
                                <div className={`fancord-tc-indicator-bar ${highlightedElement ? "active" : ""}`}>
                                    <span>{getHighlightLabel(highlightedElement)}</span>
                                </div>
                            </div>

                            <div className="fancord-tc-mockup-wrapper">
                                {/* Wallpaper / GIF Layer with img fallback for guaranteed animation & hardware acceleration */}
                                {config.useImage && config.imageUrl && (
                                    <div
                                        className={`fancord-tc-mockup-bg ${highlightedElement === "wallpaper" ? "highlighted" : ""} scope-${scope}`}
                                        style={{
                                            filter: `blur(${config.bgBlur}px) brightness(${config.bgBrightness}%)`
                                        }}
                                    >
                                        <img
                                            src={config.imageUrl}
                                            alt="Live Wallpaper"
                                            className="fancord-tc-mockup-img-layer"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: config.bgFit === "contain" ? "contain" : "cover",
                                                objectPosition: "center",
                                                display: "block"
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Darkness Tint Layer */}
                                {config.useImage && config.imageUrl && (
                                    <div
                                        className={`fancord-tc-mockup-tint scope-${scope}`}
                                        style={{ backgroundColor: `rgba(0, 0, 0, ${config.overlayOpacity})` }}
                                    />
                                )}

                                {/* Interactive Scope Indicator Badge */}
                                {config.useImage && config.imageUrl && (
                                    <div
                                        className={`fancord-tc-mock-scope-banner ${highlightedElement === "wallpaper" ? "highlighted" : ""}`}
                                        onClick={() => {
                                            setActiveTab("image");
                                            setHighlightedElement("wallpaper");
                                        }}
                                        title={t("انقر لتعديل نطاق الخلفية وصور الـ GIF", "Click to edit Wallpaper & Scope")}
                                    >
                                        <span>✨ {t("نطاق الخلفية النشط:", "Active Scope:")}</span>
                                        <strong>
                                            {scope === "full"
                                                ? t("🌐 كامل ديسكورد", "Full Discord")
                                                : scope === "chat"
                                                ? t("💬 الدردشة فقط", "Chat Area Only")
                                                : scope === "chatAndSidebar"
                                                ? t("📑 الدردشة والرومات", "Chat & Channels")
                                                : t("📁 الرومات فقط", "Sidebar Only")}
                                        </strong>
                                    </div>
                                )}

                                {/* VIEW 0: Dedicated Fullscreen Wallpaper & GIF Showcase */}
                                {mockupView === "wallpaper" && (
                                    <div className="fancord-tc-mock-wallpaper-view">
                                        {!config.useImage || !config.imageUrl ? (
                                            <div className="fancord-tc-mock-empty-wp">
                                                <span style={{ fontSize: 38 }}>🖼️</span>
                                                <strong style={{ fontSize: 14, color: config.primaryText }}>
                                                    {t("الخلفية متوقفة حالياً", "Wallpaper is Disabled")}
                                                </strong>
                                                <p style={{ margin: "4px 0 0", fontSize: 11.5, color: config.mutedText }}>
                                                    {t(
                                                        "قم باختيار صورة أو GIF من القائمة على اليسار لتظهر هنا فوراً في المعاينة",
                                                        "Select any image or animated GIF from the left panel to preview it here"
                                                    )}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="fancord-tc-mock-wp-overlay-container">
                                                <div className="fancord-tc-mock-wp-header-badges">
                                                    <span className="fancord-tc-wp-badge-pill scope">
                                                        {scope === "full"
                                                            ? t("🌐 كامل ديسكورد (Full)", "Full Discord")
                                                            : scope === "chat"
                                                            ? t("💬 الدردشة فقط", "Chat Only")
                                                            : scope === "chatAndSidebar"
                                                            ? t("📑 الدردشة والقنوات", "Chat & Channels")
                                                            : t("📁 القنوات فقط", "Channels Only")}
                                                    </span>
                                                    {isGif && <span className="fancord-tc-wp-badge-pill gif">✨ Animated GIF</span>}
                                                    <span className="fancord-tc-wp-badge-pill scope" style={{ color: config.accentColor, borderColor: config.accentColor }}>
                                                        {config.bgFit} | {Math.round(config.bgBrightness)}% | Blur {config.bgBlur}px
                                                    </span>
                                                </div>

                                                {/* Floating Glass Discord Preview Card on Top of GIF */}
                                                <div
                                                    className="fancord-tc-mock-wp-floating-card"
                                                    style={{
                                                        backgroundColor: hexToRgba(config.chatBg, Math.max(0.2, config.chatOpacity ?? 0.25)),
                                                        backdropFilter: config.glassBlur ? `blur(${config.glassBlur}px)` : undefined,
                                                        borderRadius: config.borderRadius || 8,
                                                        border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.12)" : undefined,
                                                        fontFamily: activeFontFamily
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div
                                                            style={{
                                                                width: 34,
                                                                height: 34,
                                                                borderRadius: "50%",
                                                                backgroundColor: config.accentColor,
                                                                boxShadow: config.neonGlow ? `0 0 12px ${config.accentColor}` : undefined,
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                                                                <span style={{ color: config.accentColor, fontWeight: 700, fontSize: 13 }}>
                                                                    {config.author || "FAN"}
                                                                </span>
                                                                <span style={{ color: config.mutedText, fontSize: 10 }}>Live Preview</span>
                                                            </div>
                                                            <p style={{ margin: "2px 0 0", color: config.primaryText, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                {t("معاينة حية ومباشرة للـ GIF والخلفية بالكامل!", "Live wallpaper & animated GIF preview!")}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
                                                        <button
                                                            type="button"
                                                            style={{
                                                                backgroundColor: config.accentColor,
                                                                color: "#fff",
                                                                border: "none",
                                                                borderRadius: 4,
                                                                padding: "4px 10px",
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                boxShadow: config.neonGlow ? `0 0 10px ${config.accentColor}` : undefined
                                                            }}
                                                        >
                                                            Accent Button
                                                        </button>
                                                        {config.neonGlow && (
                                                            <span
                                                                style={{
                                                                    backgroundColor: hexToRgba(config.accentColor, 0.25),
                                                                    color: config.accentColor,
                                                                    padding: "2px 6px",
                                                                    borderRadius: 3,
                                                                    fontSize: 10,
                                                                    fontWeight: 700,
                                                                    boxShadow: `0 0 8px ${hexToRgba(config.accentColor, 0.5)}`
                                                                }}
                                                            >
                                                                @Mention
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* VIEW: Voice & Video Call Mockup */}
                                {mockupView === "voice" && (
                                    <div
                                        className="fancord-tc-mockup-voice-view"
                                        style={{ fontFamily: activeFontFamily }}
                                    >
                                        {/* Voice Channel Header */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "10px 14px",
                                                backgroundColor: hexToRgba(config.headerBg, config.headerOpacity ?? 0.75),
                                                borderBottom: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.08)" : undefined,
                                                color: config.primaryText,
                                                fontSize: 13,
                                                fontWeight: 700
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ color: "#3ba55d" }}>🔊</span>
                                                <span>snow. / Veon Lounge</span>
                                                <span
                                                    style={{
                                                        backgroundColor: "#ed4245",
                                                        color: "#fff",
                                                        fontSize: 9,
                                                        padding: "1px 5px",
                                                        borderRadius: 3,
                                                        fontWeight: 800
                                                    }}
                                                >
                                                    LIVE
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: config.mutedText }}>
                                                <span>👥 4 in voice</span>
                                            </div>
                                        </div>

                                        {/* Video / Stream Grid */}
                                        <div
                                            style={{
                                                flex: 1,
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gridTemplateRows: "1fr 1fr",
                                                gap: 12,
                                                padding: 14,
                                                minHeight: 0
                                            }}
                                        >
                                            {/* Tile 1: Stream Tile */}
                                            <div
                                                className={`fancord-tc-mock-element ${highlightedElement === "voice" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: hexToRgba(config.chatBg, config.voiceCallOpacity ?? 0.35),
                                                    borderRadius: config.borderRadius || 8,
                                                    border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.12)" : undefined,
                                                    backdropFilter: config.glassBlur ? `blur(${config.glassBlur}px)` : undefined,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "relative",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                <div style={{ fontSize: 28, marginBottom: 4 }}>🖥️</div>
                                                <span style={{ fontSize: 12, fontWeight: 700, color: config.primaryText }}>Watch Stream</span>
                                                <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, color: config.mutedText, backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 }}>
                                                    Chris Killer
                                                </span>
                                            </div>

                                            {/* Tile 2: User Speaking with Accent Ring */}
                                            <div
                                                className={`fancord-tc-mock-element ${highlightedElement === "voice" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: hexToRgba(config.chatBg, config.voiceCallOpacity ?? 0.35),
                                                    borderRadius: config.borderRadius || 8,
                                                    border: `1.5px solid ${config.accentColor}`,
                                                    boxShadow: config.neonGlow ? `0 0 12px ${hexToRgba(config.accentColor, 0.4)}` : undefined,
                                                    backdropFilter: config.glassBlur ? `blur(${config.glassBlur}px)` : undefined,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "relative"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: "50%",
                                                        backgroundColor: config.accentColor,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 18,
                                                        color: "#fff",
                                                        boxShadow: "0 0 0 3px #3ba55d"
                                                    }}
                                                >
                                                    👑
                                                </div>
                                                <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, color: config.primaryText, backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 }}>
                                                    {config.author || "FAN"}
                                                </span>
                                            </div>

                                            {/* Tile 3: User Avatar Tile */}
                                            <div
                                                className={`fancord-tc-mock-element ${highlightedElement === "voice" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: hexToRgba(config.chatBg, config.voiceCallOpacity ?? 0.35),
                                                    borderRadius: config.borderRadius || 8,
                                                    border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.12)" : undefined,
                                                    backdropFilter: config.glassBlur ? `blur(${config.glassBlur}px)` : undefined,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "relative"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "50%",
                                                        backgroundColor: "#3ba55d",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 16,
                                                        color: "#fff"
                                                    }}
                                                >
                                                    🎮
                                                </div>
                                                <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, color: config.mutedText, backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 }}>
                                                    GamerPro
                                                </span>
                                            </div>

                                            {/* Tile 4: Bot Tile */}
                                            <div
                                                className={`fancord-tc-mock-element ${highlightedElement === "voice" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: hexToRgba(config.chatBg, config.voiceCallOpacity ?? 0.35),
                                                    borderRadius: config.borderRadius || 8,
                                                    border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.12)" : undefined,
                                                    backdropFilter: config.glassBlur ? `blur(${config.glassBlur}px)` : undefined,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "relative"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "50%",
                                                        backgroundColor: "#faa61a",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 16,
                                                        color: "#fff"
                                                    }}
                                                >
                                                    🎵
                                                </div>
                                                <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, color: config.mutedText, backgroundColor: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 4 }}>
                                                    MusicBot
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom Call Controls Bar */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 12,
                                                padding: "10px 14px",
                                                backgroundColor: hexToRgba(config.headerBg, 0.8),
                                                backdropFilter: "blur(12px)",
                                                borderTop: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.08)" : undefined
                                            }}
                                        >
                                            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📹</div>
                                            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎤</div>
                                            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎧</div>
                                            <div style={{ width: 38, height: 34, borderRadius: 17, backgroundColor: "#ed4245", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>📞</div>
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Full Discord App Mockup (Servers + Channels + Chat + Members) */}
                                {mockupView !== "wallpaper" && mockupView !== "voice" && (
                                    <div
                                        className="fancord-tc-mockup-app"
                                        style={{ fontFamily: activeFontFamily }}
                                    >
                                        {/* Guilds / Servers Rail */}
                                        <div
                                            className={`fancord-tc-mock-guilds fancord-tc-mock-element ${highlightedElement === "servers" ? "highlighted" : ""}`}
                                            style={{
                                                backgroundColor: (scope === "chat" || scope === "sidebar" || scope === "chatAndSidebar")
                                                    ? config.serversBg
                                                    : (config.useImage && config.imageUrl ? hexToRgba(config.serversBg, config.serversOpacity ?? 0.6) : config.serversBg),
                                                backdropFilter: (config.glassBlur && config.useImage && config.imageUrl && scope === "full") ? `blur(${config.glassBlur}px)` : undefined,
                                                borderRight: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.08)" : undefined
                                            }}
                                            onClick={() => {
                                                setActiveTab("colors");
                                                setHighlightedElement("servers");
                                            }}
                                        >
                                            <span className="fancord-tc-mock-col-badge">{t("السيرفرات", "Servers")}</span>
                                            <div
                                                className={`fancord-tc-mock-guild-icon active fancord-tc-mock-element ${highlightedElement === "accent" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: config.accentColor,
                                                    color: "#fff",
                                                    boxShadow: config.neonGlow ? `0 0 14px ${config.accentColor}, inset 0 0 8px rgba(255,255,255,0.4)` : undefined
                                                }}
                                            >
                                                F
                                            </div>

                                            {/* Mock Server Folder */}
                                            <div
                                                className={`fancord-tc-mock-folder fancord-tc-mock-element ${highlightedElement === "folders" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: hexToRgba(config.serversBg, config.foldersOpacity ?? 0.65),
                                                    backdropFilter: config.glassBlur ? `blur(${config.glassBlur}px)` : undefined
                                                }}
                                                onClick={() => {
                                                    setActiveTab("colors");
                                                    setHighlightedElement("folders");
                                                }}
                                                title={t("مجلد سيرفرات (Server Folder)", "Server Folder")}
                                            >
                                                <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.25)", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>1</div>
                                                <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.25)", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>2</div>
                                            </div>

                                            <div
                                                className="fancord-tc-mock-guild-icon"
                                                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: config.mutedText }}
                                            >
                                                🎮
                                            </div>
                                            <div
                                                className="fancord-tc-mock-guild-icon"
                                                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: config.mutedText }}
                                            >
                                                🎵
                                            </div>
                                        </div>

                                        {/* Channels Sidebar */}
                                        <div
                                            className={`fancord-tc-mock-channels fancord-tc-mock-element ${highlightedElement === "sidebar" ? "highlighted" : ""}`}
                                            style={{
                                                backgroundColor: scope === "chat"
                                                    ? config.sidebarBg
                                                    : (config.useImage && config.imageUrl ? hexToRgba(config.sidebarBg, config.sidebarOpacity ?? 0.45) : config.sidebarBg),
                                                backdropFilter: (config.glassBlur && config.useImage && config.imageUrl && (scope === "full" || scope === "sidebar" || scope === "chatAndSidebar")) ? `blur(${config.glassBlur}px)` : undefined,
                                                borderRight: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.08)" : undefined
                                            }}
                                            onClick={() => {
                                                setActiveTab("colors");
                                                setHighlightedElement("sidebar");
                                            }}
                                        >
                                            <span className="fancord-tc-mock-col-badge">{t("الرومات", "Channels")}</span>
                                            <div
                                                className="fancord-tc-mock-header"
                                                style={{ color: config.primaryText }}
                                            >
                                                FanCord Server
                                            </div>
                                            <div
                                                className={`fancord-tc-mock-channel fancord-tc-mock-element ${highlightedElement === "accent" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: config.hoverBg,
                                                    color: config.accentColor,
                                                    fontWeight: 700,
                                                    borderRadius: Math.min(config.borderRadius, 4),
                                                    boxShadow: config.neonGlow ? `0 0 10px ${hexToRgba(config.accentColor, 0.6)}, inset 0 0 6px ${hexToRgba(config.accentColor, 0.3)}` : undefined,
                                                    borderRight: config.neonGlow ? `3px solid ${config.accentColor}` : undefined
                                                }}
                                            >
                                                <span>#</span> general
                                            </div>
                                            <div
                                                className="fancord-tc-mock-channel"
                                                style={{ color: config.mutedText }}
                                            >
                                                <span>#</span> voice-chat
                                            </div>
                                            <div
                                                className="fancord-tc-mock-channel"
                                                style={{ color: config.mutedText }}
                                            >
                                                <span>🔊</span> Lounge
                                            </div>
                                        </div>

                                        {/* Chat Area */}
                                        <div
                                            className={`fancord-tc-mock-chat fancord-tc-mock-element ${highlightedElement === "chat" ? "highlighted" : ""}`}
                                            style={{
                                                backgroundColor: scope === "sidebar"
                                                    ? config.chatBg
                                                    : (config.useImage && config.imageUrl ? hexToRgba(config.chatBg, config.chatOpacity ?? 0.25) : config.chatBg),
                                                backdropFilter: (config.glassBlur && config.useImage && config.imageUrl && (scope === "full" || scope === "chat" || scope === "chatAndSidebar")) ? `blur(${config.glassBlur}px)` : undefined
                                            }}
                                            onClick={() => {
                                                setActiveTab("colors");
                                                setHighlightedElement("chat");
                                            }}
                                        >
                                            <div
                                                className={`fancord-tc-mock-chat-header fancord-tc-mock-element ${highlightedElement === "header" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: config.headerBg,
                                                    color: config.primaryText,
                                                    borderRadius: Math.min(config.borderRadius, 4),
                                                    borderBottom: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.08)" : undefined,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}
                                            >
                                                <span># general</span>
                                                <span className="fancord-tc-mock-col-badge chat">{t("الدردشة", "Chat")}</span>
                                            </div>

                                            <div className="fancord-tc-mock-messages">
                                                <div
                                                    className="fancord-tc-mock-msg"
                                                    style={{
                                                        backgroundColor: config.hoverBg,
                                                        borderRadius: Math.min(config.borderRadius, 6),
                                                        border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.06)" : undefined,
                                                        padding: config.compactMessages ? "4px 8px" : undefined
                                                    }}
                                                >
                                                    <div
                                                        className="fancord-tc-mock-avatar"
                                                        style={{
                                                            backgroundColor: config.accentColor,
                                                            boxShadow: config.neonGlow ? `0 0 8px ${config.accentColor}` : undefined
                                                        }}
                                                    />
                                                    <div className="fancord-tc-mock-msg-content">
                                                        <div className="fancord-tc-mock-author-row">
                                                            <span
                                                                className={`fancord-tc-mock-author-name fancord-tc-mock-element ${highlightedElement === "accent" ? "highlighted" : ""}`}
                                                                style={{ color: config.accentColor }}
                                                            >
                                                                {config.author || "FAN"}
                                                            </span>
                                                            <span
                                                                className="fancord-tc-mock-author-time"
                                                                style={{ color: config.mutedText }}
                                                            >
                                                                Today at 10:45 AM
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`fancord-tc-mock-text fancord-tc-mock-element ${highlightedElement === "text" ? "highlighted" : ""}`}
                                                            style={{ color: config.primaryText }}
                                                        >
                                                            {t("هذه معاينة حية لثيمك المخصص الفاخر!", "This is a live preview of your custom theme!")}
                                                        </span>
                                                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                                                            <button
                                                                type="button"
                                                                className={`fancord-tc-mock-sample-btn fancord-tc-mock-element ${highlightedElement === "accent" ? "highlighted" : ""}`}
                                                                style={{
                                                                    backgroundColor: config.accentColor,
                                                                    borderRadius: Math.min(config.borderRadius, 4),
                                                                    boxShadow: config.neonGlow ? `0 0 12px ${config.accentColor}` : undefined
                                                                }}
                                                            >
                                                                FanCord Accent
                                                            </button>
                                                            {config.neonGlow && (
                                                                <span
                                                                    className="fancord-tc-mock-mention-pill"
                                                                    style={{
                                                                        backgroundColor: hexToRgba(config.accentColor, 0.2),
                                                                        color: config.accentColor,
                                                                        boxShadow: `0 0 8px ${hexToRgba(config.accentColor, 0.5)}`
                                                                    }}
                                                                >
                                                                    @FAN
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contextual Floating Frosted Settings Dialog Overlay */}
                                            {(mockupView === "settings" || highlightedElement === "settings") && (
                                                <div
                                                    className={`fancord-tc-mock-floating-modal fancord-tc-mock-element ${highlightedElement === "settings" ? "highlighted" : ""}`}
                                                    style={{
                                                        backgroundColor: hexToRgba(config.chatBg, config.settingsOpacity ?? 0.85),
                                                        backdropFilter: (config.glassBlur && config.useImage && config.imageUrl) ? `blur(${config.glassBlur}px)` : undefined,
                                                        borderRadius: config.borderRadius || 8,
                                                        border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.16)" : undefined,
                                                        boxShadow: `0 16px 36px rgba(0, 0, 0, 0.75), 0 0 20px ${hexToRgba(config.accentColor, 0.35)}`
                                                    }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setActiveTab("colors");
                                                        setHighlightedElement("settings");
                                                    }}
                                                >
                                                    <div
                                                        className="fancord-tc-mock-modal-header"
                                                        style={{
                                                            backgroundColor: hexToRgba(config.headerBg, Math.min(1, (config.settingsOpacity ?? 0.85) + 0.08)),
                                                            borderBottom: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.1)" : undefined
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                            <span>⚙️</span>
                                                            <strong style={{ fontSize: 11.5, color: config.primaryText }}>Discord Settings Window</strong>
                                                        </div>
                                                        <span style={{ fontSize: 10, color: config.accentColor, fontWeight: 700 }}>
                                                            {Math.round((config.settingsOpacity ?? 0.85) * 100)}% Opacity
                                                        </span>
                                                    </div>
                                                    <div className="fancord-tc-mock-modal-body">
                                                        <div
                                                            className="fancord-tc-mock-modal-sidebar"
                                                            style={{
                                                                backgroundColor: hexToRgba(config.sidebarBg, Math.min(1, (config.settingsOpacity ?? 0.85) + 0.1)),
                                                                borderRight: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.08)" : undefined
                                                            }}
                                                        >
                                                            <div className="fancord-tc-mock-modal-item active" style={{ color: config.accentColor, backgroundColor: config.hoverBg }}>🎨 Themes</div>
                                                            <div className="fancord-tc-mock-modal-item" style={{ color: config.mutedText }}>Appearance</div>
                                                            <div className="fancord-tc-mock-modal-item" style={{ color: config.mutedText }}>Voice</div>
                                                        </div>
                                                        <div className="fancord-tc-mock-modal-content">
                                                            <span style={{ fontSize: 11, fontWeight: 700, color: config.primaryText }}>Glass Window Opacity</span>
                                                            <p style={{ margin: "2px 0 6px", fontSize: 10, color: config.mutedText, lineHeight: 1.3 }}>
                                                                {t("معاينة حية ومباشرة لشفافية النوافذ والإعدادات", "Live preview of modal and settings window opacity")}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                style={{
                                                                    backgroundColor: config.accentColor,
                                                                    color: "#fff",
                                                                    border: "none",
                                                                    borderRadius: 4,
                                                                    padding: "3px 8px",
                                                                    fontSize: 10,
                                                                    fontWeight: 700,
                                                                    boxShadow: config.neonGlow ? `0 0 8px ${config.accentColor}` : undefined
                                                                }}
                                                            >
                                                                Setting Button
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Contextual Floating Frosted Profile Popout Overlay */}
                                            {(mockupView === "popout" || highlightedElement === "popouts") && (
                                                <div
                                                    className={`fancord-tc-mock-floating-popout fancord-tc-mock-element ${highlightedElement === "popouts" ? "highlighted" : ""}`}
                                                    style={{
                                                        backgroundColor: hexToRgba(config.headerBg, config.popoutsOpacity ?? 0.85),
                                                        backdropFilter: (config.glassBlur && config.useImage && config.imageUrl) ? `blur(${config.glassBlur}px)` : undefined,
                                                        borderRadius: config.borderRadius || 8,
                                                        border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.16)" : undefined,
                                                        boxShadow: `0 16px 36px rgba(0, 0, 0, 0.75), 0 0 20px ${hexToRgba(config.accentColor, 0.35)}`
                                                    }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setActiveTab("colors");
                                                        setHighlightedElement("popouts");
                                                    }}
                                                >
                                                    <div
                                                        className="fancord-tc-mock-popout-banner"
                                                        style={{ backgroundColor: config.accentColor, height: 38 }}
                                                    />
                                                    <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: -20 }}>
                                                            <div
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: config.accentColor,
                                                                    border: "2px solid #111",
                                                                    boxShadow: config.neonGlow ? `0 0 8px ${config.accentColor}` : undefined,
                                                                    position: "relative"
                                                                }}
                                                            >
                                                                <span className="fancord-tc-mock-online-dot" />
                                                            </div>
                                                            <div style={{ marginTop: 12 }}>
                                                                <div style={{ fontSize: 12, fontWeight: 700, color: config.primaryText }}>{config.author || "FAN"}</div>
                                                                <span style={{ fontSize: 9.5, color: config.mutedText }}>@fan_user · {Math.round((config.popoutsOpacity ?? 0.85) * 100)}% Opacity</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                                                            <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, backgroundColor: hexToRgba(config.accentColor, 0.25), color: config.accentColor }}>
                                                                ADMIN
                                                            </span>
                                                            <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, backgroundColor: "rgba(255, 255, 255, 0.1)", color: config.primaryText }}>
                                                                VIP
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div
                                                className={`fancord-tc-mock-input fancord-tc-mock-element ${highlightedElement === "input" ? "highlighted" : ""}`}
                                                style={{
                                                    backgroundColor: config.inputBg || config.sidebarBg,
                                                    color: config.mutedText,
                                                    borderRadius: Math.min(config.borderRadius, 6),
                                                    border: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.1)" : undefined,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setActiveTab("colors");
                                                    setHighlightedElement("input");
                                                }}
                                            >
                                                <span>Message #general...</span>
                                                <span className="fancord-tc-mock-col-badge input-badge">{t("كتابة", "Input")}</span>
                                            </div>
                                        </div>

                                        {/* Members List Column */}
                                        <div
                                            className={`fancord-tc-mock-members fancord-tc-mock-element ${highlightedElement === "members" ? "highlighted" : ""}`}
                                            style={{
                                                backgroundColor: config.useImage && config.imageUrl ? hexToRgba(config.sidebarBg, config.membersOpacity ?? 0.45) : config.sidebarBg,
                                                backdropFilter: (config.glassBlur && config.useImage && config.imageUrl) ? `blur(${config.glassBlur}px)` : undefined,
                                                borderLeft: config.glassBorders ? "1px solid rgba(255, 255, 255, 0.08)" : undefined
                                            }}
                                            onClick={() => {
                                                setActiveTab("colors");
                                                setHighlightedElement("members");
                                            }}
                                        >
                                            <span className="fancord-tc-mock-col-badge">{t("الأعضاء", "Members")}</span>
                                            <span className="fancord-tc-mock-member-category" style={{ color: config.mutedText }}>
                                                ONLINE — 3
                                            </span>
                                            <div className="fancord-tc-mock-member-item">
                                                <div className="fancord-tc-mock-member-avatar" style={{ backgroundColor: config.accentColor }}>
                                                    <span className="fancord-tc-mock-online-dot" />
                                                </div>
                                                <span style={{ color: config.accentColor, fontWeight: 700 }}>{config.author || "FAN"}</span>
                                            </div>
                                            <div className="fancord-tc-mock-member-item">
                                                <div className="fancord-tc-mock-member-avatar" style={{ backgroundColor: "#3ba55d" }}>
                                                    <span className="fancord-tc-mock-online-dot" />
                                                </div>
                                                <span style={{ color: config.primaryText }}>GamerPro</span>
                                            </div>
                                            <div className="fancord-tc-mock-member-item">
                                                <div className="fancord-tc-mock-member-avatar" style={{ backgroundColor: "#faa61a" }}>
                                                    <span className="fancord-tc-mock-online-dot" />
                                                </div>
                                                <span style={{ color: config.primaryText }}>MusicBot</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="fancord-tc-footer">
                        <div className="fancord-tc-footer-left">
                            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: "var(--text-normal)", fontWeight: 600 }}>
                                <input
                                    type="checkbox"
                                    checked={livePreviewActive}
                                    onChange={e => toggleLivePreview(e.target.checked)}
                                />
                                <span>⚡ {t("معاينة حية ومباشرة على ديسكورد بالكامل", "Live Preview on entire Discord")}</span>
                            </label>
                        </div>

                        <div className="fancord-tc-footer-right">
                            <button
                                type="button"
                                className="fancord-tc-action-btn fancord-tc-btn-secondary"
                                onClick={handleImportFromClipboard}
                                title={t("استيراد ثيم من الحافظة", "Import theme from clipboard")}
                            >
                                <span>📥</span>
                                {t("استيراد", "Import")}
                            </button>

                            <button
                                type="button"
                                className="fancord-tc-action-btn fancord-tc-btn-secondary"
                                onClick={handleResetDefaults}
                                title={t("استعادة الإعدادات الافتراضية", "Reset Defaults")}
                            >
                                <span>🔄</span>
                                {t("استعادة الافتراضي", "Reset")}
                            </button>

                            <button
                                type="button"
                                className="fancord-tc-action-btn fancord-tc-btn-secondary"
                                onClick={handleCopyCss}
                            >
                                <span>📋</span>
                                {t("نسخ الكود", "Copy CSS")}
                            </button>

                            <button
                                type="button"
                                className="fancord-tc-action-btn fancord-tc-btn-secondary"
                                onClick={handleExportFile}
                            >
                                <span>📤</span>
                                {t("تصدير (.theme.css)", "Export File")}
                            </button>

                            <button
                                type="button"
                                className="fancord-tc-action-btn fancord-tc-btn-primary"
                                onClick={handleSaveAndApply}
                                title={t("حفظ وتفعيل الثيم فوراً على ديسكورد", "Save & Apply Theme immediately to Discord")}
                            >
                                <span>💾</span>
                                {t("حفظ وتفعيل الثيم", "Save & Apply")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export function openThemeCreatorModal(initialConfig?: Partial<ThemeConfig>) {
    openModal(modalProps => (
        <ThemeCreatorModal
            {...modalProps}
            initialConfig={initialConfig}
        />
    ));
}
