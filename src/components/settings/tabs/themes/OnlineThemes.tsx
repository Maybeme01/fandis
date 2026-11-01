/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "@api/Settings";
import { Button } from "@components/Button";
import { FormSwitch } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { Link } from "@components/Link";
import { Notice } from "@components/Notice";
import { Paragraph } from "@components/Paragraph";
import { classNameFactory } from "@utils/css";
import { Margins } from "@utils/margins";
import { useAwaiter } from "@utils/react";
import { React, showToast, TextInput, useEffect, useMemo, useState } from "@webpack/common";

import { STORE_THEMES, StoreTheme } from "./themeStoreList";

const cl = classNameFactory("vc-settings-theme-");

export function Validator({ link, onValidate }: { link: string; onValidate: (valid: boolean) => void; }) {
    const [res, err, pending] = useAwaiter(() => fetch(link).then(res => {
        if (res.status > 300) throw `${res.status} ${res.statusText}`;
        const contentType = res.headers.get("Content-Type");
        if (!contentType?.startsWith("text/css") && !contentType?.startsWith("text/plain")) {
            onValidate(false);
            throw "Not a CSS file. Remember to use the raw link!";
        }

        onValidate(true);
        return "Okay!";
    }));

    const text = pending
        ? "Checking..."
        : err
            ? `Error: ${err instanceof Error ? err.message : String(err)}`
            : "Valid!";

    return (
        <Paragraph style={{
            color: pending ? "var(--text-muted)" : err ? "var(--text-feedback-critical)" : "var(--status-positive)"
        }}>
            {text}
        </Paragraph>
    );
}

function StoreCard({ theme, isInstalled, onInstall, onUninstall }: {
    theme: StoreTheme;
    isInstalled: boolean;
    onInstall: () => void;
    onUninstall: () => void;
}) {
    const [imgSrc, setImgSrc] = useState(
        theme.preview && !theme.preview.startsWith("data:")
            ? theme.preview
            : "https://betterdiscord.app/resources/ui/placeholder.png"
    );

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#18191c",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            position: "relative"
        }}>
            {/* حاوية صورة المعاينة مع معالجة الأعطال */}
            <div style={{ width: "100%", height: "170px", position: "relative", overflow: "hidden", backgroundColor: "#1e1f22" }}>
                <img
                    src={imgSrc}
                    alt={theme.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={() => {
                        setImgSrc("https://betterdiscord.app/resources/ui/placeholder.png");
                    }}
                />
            </div>

            {/* الأفاتار الدائري للمطور */}
            <div style={{
                position: "absolute",
                top: "145px",
                left: "16px",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "3px solid #18191c",
                overflow: "hidden",
                backgroundColor: "#2b2d31",
                zIndex: 2
            }}>
                <img
                    src={theme.authorAvatar}
                    alt={theme.author}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                    }}
                />
            </div>

            {/* تفاصيل الثيم */}
            <div style={{ padding: "32px 16px 16px 16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--status-positive)">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span style={{ fontSize: "17px", fontWeight: "700", color: "#fff" }}>
                        {theme.name}
                    </span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    by {theme.author}
                </div>

                <div style={{ fontSize: "13px", color: "var(--text-normal)", marginTop: "8px", lineHeight: "1.4", minHeight: "36px" }}>
                    {theme.description}
                </div>

                {/* التاجات */}
                {theme.tags && theme.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "12px 0" }}>
                        {theme.tags.map(tag => (
                            <span key={tag} style={{
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                color: "var(--text-muted)",
                                fontSize: "11px",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                fontWeight: "500"
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* الإحصائيات */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "var(--text-muted)", margin: "8px 0 16px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--status-positive)", display: "inline-block" }}></span>
                        <span>{theme.likes || "1.2k"} Likes</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--brand-experiment)", display: "inline-block" }}></span>
                        <span>{theme.downloads || "1.5M"} Downloads</span>
                    </div>
                </div>

                {/* أزرار الإجراءات */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {theme.website && (
                            <a href={theme.website} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }} title="Website">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </a>
                        )}
                        {theme.discord && (
                            <a href={theme.discord} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }} title="Discord">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                            </a>
                        )}
                    </div>

                    <button
                        onClick={isInstalled ? onUninstall : onInstall}
                        style={{
                            padding: "8px 24px",
                            borderRadius: "6px",
                            border: "none",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                            backgroundColor: isInstalled ? "#ed4245" : "#5865F2",
                            color: "#fff"
                        }}
                    >
                        {isInstalled ? "Uninstall" : "Download"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export interface OnlineThemesSectionProps {
    enableOnlineThemes: boolean;
    setEnableOnlineThemes: (value: boolean) => void;
    currentThemeLink: string;
    setCurrentThemeLink: (value: string) => void;
    themeLinkValid: boolean;
    setThemeLinkValid: (value: boolean) => void;
    addThemeLink: (link: string) => void;
}

export function OnlineThemesSection({
    enableOnlineThemes,
    setEnableOnlineThemes,
    currentThemeLink,
    setCurrentThemeLink,
    themeLinkValid,
    setThemeLinkValid,
    addThemeLink
}: OnlineThemesSectionProps) {
    const [, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    const [search, setSearch] = useState("");

    // تفويض كافة النطاقات تلقائياً
    useEffect(() => {
        if (!IS_WEB && VencordNative?.csp?.requestAddOverride) {
            void VencordNative.csp.requestAddOverride(
                [
                    "https://betterdiscord.app",
                    "https://raw.githubusercontent.com",
                    "https://avatars.githubusercontent.com",
                    "https://i.imgur.com"
                ],
                ["img-src", "connect-src", "style-src"],
                "Equicord Themes Store"
            );
        }
    }, []);

    // تصفية الثيمات وضمان عدم تكرار أي كرت بالاسم
    const filteredThemes = useMemo(() => {
        const uniqueThemes = Array.from(new Map(STORE_THEMES.map(item => [item.name, item])).values());
        if (!search.trim()) return uniqueThemes;
        const q = search.toLowerCase();
        return uniqueThemes.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.author.toLowerCase().includes(q) ||
            (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
        );
    }, [search]);

    const handleInstall = (url: string) => {
        if (!Settings.themeLinks.includes(url)) {
            Settings.themeLinks = [...Settings.themeLinks, url];
        }
        if (!Settings.enabledThemeLinks.includes(url)) {
            Settings.enabledThemeLinks = [...Settings.enabledThemeLinks, url];
        }
        showToast({ text: "تم تثبيت وتفعيل الثيم بنجاح!", variant: "success" });
        forceUpdate();
    };

    const handleUninstall = (url: string) => {
        Settings.themeLinks = Settings.themeLinks.filter(u => u !== url);
        Settings.enabledThemeLinks = Settings.enabledThemeLinks.filter(u => u !== url);
        showToast({ text: "تم إلغاء تثبيت الثيم", variant: "critical" });
        forceUpdate();
    };

    return (
        <>
            <Heading className={Margins.top20}>Online Themes</Heading>
            <Paragraph className={Margins.bottom16}>
                Load themes directly from URLs instead of local files. Online themes auto-update when the source changes.
            </Paragraph>
            <FormSwitch
                title="Enable Online Themes"
                description="Toggle online theme loading. When disabled, all online themes will be turned off."
                value={enableOnlineThemes}
                onChange={setEnableOnlineThemes}
            />

            {enableOnlineThemes && (
                <>
                    <Heading className={Margins.top20}>متجر ثيمات BetterDiscord</Heading>
                    <Paragraph className={Margins.bottom16}>
                        تصفح وحمل الثيمات الجاهزة مباشرة بضغطة زر واحدة.
                    </Paragraph>

                    <div style={{ marginBottom: "16px" }}>
                        <TextInput
                            placeholder="ابحث في المتجر بالاسم، المطور، أو التاق..."
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    {filteredThemes.length === 0 ? (
                        <Paragraph color="text-muted" className={Margins.bottom16}>
                            لم يتم العثور على ثيمات مطابقة لبحثك.
                        </Paragraph>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                            gap: "20px",
                            marginBottom: "28px"
                        }}>
                            {filteredThemes.map(theme => (
                                <StoreCard
                                    key={theme.name}
                                    theme={theme}
                                    isInstalled={Settings.themeLinks.includes(theme.url)}
                                    onInstall={() => handleInstall(theme.url)}
                                    onUninstall={() => handleUninstall(theme.url)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <Heading className={Margins.top16}>إضافة ثيم برابط مخصص</Heading>
            <Notice.Info className={Margins.bottom16} style={{ width: "100%" }}>
                Looking for themes? Check out <Link href="https://betterdiscord.app/themes">BetterDiscord Themes</Link> or search on <Link href="https://github.com/search?q=discord+theme">GitHub</Link>.
            </Notice.Info>

            <div className={cl("link-row")}>
                <TextInput
                    placeholder="https://example.com/theme.css"
                    value={currentThemeLink}
                    onChange={setCurrentThemeLink}
                    disabled={!enableOnlineThemes}
                />
                <Button onClick={() => addThemeLink(currentThemeLink)} disabled={!themeLinkValid || !enableOnlineThemes}>
                    Add
                </Button>
            </div>
            {currentThemeLink && (
                <div className={Margins.top8}>
                    <Validator link={currentThemeLink} onValidate={setThemeLinkValid} />
                </div>
            )}
        </>
    );
}