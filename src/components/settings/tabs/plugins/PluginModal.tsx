/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./PluginModal.css";

import { generateId } from "@api/Commands";
import { hasAnyVisibleSettings, isSettingHidden } from "@api/PluginManager";
import { useSettings } from "@api/Settings";
import { BaseText } from "@components/BaseText";
import { Button } from "@components/Button";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { debounce } from "@shared/debounce";
import { classNameFactory } from "@utils/css";
import { fetchUserProfile, openUserProfile } from "@utils/discord";
import { proxyLazy } from "@utils/lazy";
import { Margins } from "@utils/margins";
import { classes, isObjectEmpty } from "@utils/misc";
import definePlugin, { OptionType, Plugin, PluginTag } from "@utils/types";
import { RenderModalProps, User } from "@vencord/discord-types";
import { findComponentByCodeLazy, findCssClassesLazy } from "@webpack";
import { Clickable, Constants, FluxDispatcher, Modal, openModal, React, RestAPI, showToast, Tooltip, useEffect, useMemo, UserStore, UserSummaryItem, UserUtils, useState } from "@webpack/common";
import { Constructor } from "type-fest";

import { PluginMeta } from "~plugins";

import { OptionComponentMap } from "./components";
import { openContributorModal } from "./ContributorModal";
import { FavoriteButton } from "./PluginModalButtons";

const cl = classNameFactory("vc-plugin-modal-");

const AvatarStyles = findCssClassesLazy("moreUsers", "avatar", "clickableAvatar");
const CloseButton = findComponentByCodeLazy("CLOSE_BUTTON_LABEL");
const ConfirmModal = findComponentByCodeLazy('parentComponent:"ConfirmModal"');
const WarningIcon = findComponentByCodeLazy("3.15H3.29c-1.74");
const UserRecord: Constructor<Partial<User>> = proxyLazy(() => UserStore.getCurrentUser().constructor) as any;
const _pluginModalDef = definePlugin({
    name: "PluginModalInternal",
    description: "Internal Plugin Modal Component",
    authors: []
});
void _pluginModalDef;

interface PluginModalProps extends RenderModalProps {
    plugin: Plugin;
    onRestartNeeded(key: string): void;
}

export function makeDummyUser(user: { username: string; id?: string; avatar?: string; bot?: boolean; }) {
    const newUser = new UserRecord({
        username: user.username,
        id: user.id ?? generateId(),
        avatar: user.avatar,
        /** To stop discord making unwanted requests... */
        bot: user.bot ?? !user.id,
    });

    // Only dispatch if not a real user ID
    if (!user.id || user.id.startsWith("-") || user.id.startsWith("dummy")) {
        FluxDispatcher.dispatch({
            type: "USER_UPDATE",
            user: newUser,
        });
    }

    return newUser;
}

function PluginTags({ tags }: { tags: PluginTag[]; }) {
    return (
        <div className={cl("tags")}>
            {tags.map(tag => (
                <div key={tag} className={cl("tag")}>{tag}</div>
            ))}
        </div>
    );
}

export default function PluginModal({ plugin, onRestartNeeded, onClose, transitionState }: PluginModalProps) {
    const pluginSettings = useSettings([`plugins.${plugin.name}.*`]).plugins[plugin.name];
    const hasSettings = hasAnyVisibleSettings(plugin);

    // avoid layout shift by showing dummy users while loading users
    const fallbackAuthors = useMemo(() => [makeDummyUser({ username: "Loading...", id: "-1465912127305809920" })], []);
    const [authors, setAuthors] = useState<Partial<User>[]>([]);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const resolvedAuthors: Partial<User>[] = [];
            for (const user of plugin.authors.slice(0, 6)) {
                try {
                    let author: any = null;
                    const idStr = user.id ? String(user.id) : "";

                    if (idStr && idStr !== "0") {
                        const cur = UserStore?.getCurrentUser?.();
                        if (cur && (cur.id === idStr || idStr === "365952206777876484") && cur.avatar) {
                            author = cur;
                        }

                        // Try UserUtils.getUser
                        if (!author || !author.avatar) {
                            try {
                                if (typeof UserUtils?.getUser === "function") {
                                    author = await UserUtils.getUser(idStr);
                                }
                            } catch {}
                        }

                        // Try fetchUserProfile without cache
                        if (!author || !author.avatar) {
                            try {
                                const prof: any = await fetchUserProfile(idStr, void 0, false);
                                if (prof?.user?.avatar) {
                                    author = UserStore?.getUser?.(idStr) || new UserRecord(prof.user);
                                }
                            } catch {}
                        }

                        // Try UserStore directly
                        if (!author || !author.avatar) {
                            const u = UserStore?.getUser?.(idStr);
                            if (u?.avatar) author = u;
                        }

                        // Try RestAPI
                        if (!author || !author.avatar) {
                            try {
                                const res = await (RestAPI as any)?.get?.({
                                    url: Constants?.Endpoints?.USER?.(idStr) ?? `/users/${idStr}`
                                });
                                if (res?.body) {
                                    FluxDispatcher.dispatch({ type: "USER_UPDATE", user: res.body });
                                    author = new UserRecord(res.body);
                                }
                            } catch {}
                        }
                    }

                    if (!author) {
                        author = makeDummyUser({
                            username: user.name,
                            id: idStr ? `dummy_${idStr}` : undefined,
                            bot: false
                        });
                    }

                    if (author) {
                        resolvedAuthors.push(author);
                    }
                } catch {
                    continue;
                }
            }

            if (isMounted && resolvedAuthors.length > 0) {
                setAuthors(resolvedAuthors);
            }
        })();

        return () => { isMounted = false; };
    }, [plugin.authors]);

    function handleResetClick() {
        openWarningModal(plugin, onRestartNeeded);
    }

    function renderSettings() {
        const { settings } = plugin;
        if (!hasSettings || !settings)
            return <Paragraph>There are no settings for this plugin.</Paragraph>;

        const options = Object.entries(settings.def).map(([key, setting]) => {
            if (setting.type === OptionType.CUSTOM) return null;

            if (isSettingHidden(settings, setting)) return null;

            function onChange(newValue: any) {
                const option = plugin.settings!.def[key];
                if (!option || option.type === OptionType.CUSTOM) return;

                pluginSettings[key] = newValue;

                if (option.restartNeeded) onRestartNeeded(key);
            }

            const Component = OptionComponentMap[setting.type];
            return (
                <ErrorBoundary noop key={key}>
                    <Component
                        id={key}
                        setting={setting}
                        onChange={debounce(onChange)}
                        pluginSettings={pluginSettings}
                        definedSettings={settings}
                        closePluginSettings={onClose}
                    />
                </ErrorBoundary>
            );
        });

        return (
            <div className="vc-plugins-settings">
                {options}
            </div>
        );
    }

    function renderMoreUsers(_label: string) {
        const remainingAuthors = plugin.authors.slice(6);

        return (
            <Tooltip text={remainingAuthors.map(u => u.name).join(", ")}>
                {({ onMouseEnter, onMouseLeave }) => (
                    <div
                        className={AvatarStyles.moreUsers}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        +{remainingAuthors.length}
                    </div>
                )}
            </Tooltip>
        );
    }

    const pluginMeta = PluginMeta[plugin.name];
    const isEquicordPlugin = pluginMeta?.folderName?.startsWith("src/equicordplugins/") ?? false;

    return (
        <Modal
            transitionState={transitionState}
            onClose={onClose}
            size="lg"
            title={
                <div className={cl("header")}>
                    <BaseText tag="h1" weight="semibold" size="lg">{plugin.name}</BaseText>
                </div>
            }
            subtitle={
                <div className={cl("info")}>
                    <div>
                        <Paragraph size="md">{plugin.description}</Paragraph>
                        {!!plugin.tags?.length && <PluginTags tags={plugin.tags} />}
                    </div>
                </div>
            }
        >
            {!!plugin.settingsAboutComponent && (
                <div className={classes(Margins.top16, cl("about-box"))}>
                    <section>
                        <ErrorBoundary message="An error occurred while rendering this plugin's custom Info Component">
                            <plugin.settingsAboutComponent />
                        </ErrorBoundary>
                    </section>
                </div>
            )}
            <div className={"vc-settings-modal-content"}>
                <section>
                    <Heading tag="h3" className={classes(Margins.top8, Margins.bottom8)}>Authors</Heading>
                    <div style={{ width: "fit-content" }}>
                        <ErrorBoundary noop>
                            <UserSummaryItem
                                users={authors.length ? authors : fallbackAuthors}
                                guildId={undefined}
                                renderIcon={false}
                                showDefaultAvatarsForNullUsers
                                renderMoreUsers={renderMoreUsers}
                                renderUser={(user: User) => {
                                    const idStr = String(user?.id || "");
                                    const isTargetFf9o = idStr === "365952206777876484" || idStr.includes("365952206777876484") || user?.username === "ff9o";
                                    let avatarSrc = "";

                                    if (user?.avatar) {
                                        const ext = String(user.avatar).startsWith("a_") ? "gif" : "png";
                                        avatarSrc = `https://cdn.discordapp.com/avatars/${isTargetFf9o ? "365952206777876484" : idStr}/${user.avatar}.${ext}?size=80`;
                                    } else if (typeof user?.getAvatarURL === "function") {
                                        const url = user.getAvatarURL(void 0, 80, true) || "";
                                        if (url && !url.includes("/embed/avatars/")) {
                                            avatarSrc = url;
                                        }
                                    }

                                    if (!avatarSrc && isTargetFf9o) {
                                        const cur = UserStore?.getCurrentUser?.();
                                        if (cur && (cur.id === "365952206777876484" || cur.username === "ff9o") && cur.avatar) {
                                            const ext = String(cur.avatar).startsWith("a_") ? "gif" : "png";
                                            avatarSrc = `https://cdn.discordapp.com/avatars/${cur.id}/${cur.avatar}.${ext}?size=80`;
                                        } else {
                                            const liveUser = UserStore?.getUser?.("365952206777876484");
                                            if (liveUser?.avatar) {
                                                const ext = String(liveUser.avatar).startsWith("a_") ? "gif" : "png";
                                                avatarSrc = `https://cdn.discordapp.com/avatars/365952206777876484/${liveUser.avatar}.${ext}?size=80`;
                                            }
                                        }
                                    }

                                    if (!avatarSrc) {
                                        avatarSrc = "https://cdn.discordapp.com/embed/avatars/0.png";
                                    }

                                    return (
                                        <Clickable
                                            className={AvatarStyles.clickableAvatar}
                                            onClick={() => {
                                                const targetUserId = isTargetFf9o
                                                    ? "365952206777876484"
                                                    : (idStr && idStr !== "0" && !idStr.startsWith("-") && !idStr.startsWith("dummy") ? idStr : "");
                                                if (targetUserId) {
                                                    void openUserProfile(targetUserId);
                                                } else {
                                                    openContributorModal(user);
                                                }
                                            }}
                                        >
                                            <img
                                                onError={e => {
                                                    (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                                                }}
                                                className={AvatarStyles.avatar}
                                                src={avatarSrc}
                                                alt={user.username || "ff9o"}
                                                title={user.username || "ff9o"}
                                                style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                                            />
                                        </Clickable>
                                    );
                                }}
                            />
                        </ErrorBoundary>
                    </div>
                </section>

                <section>
                    <BaseText size="lg" weight="semibold" color="text-strong" className={classes(Margins.top16, Margins.bottom8)}>Settings</BaseText>
                    {renderSettings()}
                </section>
            </div>
            <div>
                <Flex flexDirection="column" style={{ width: "100%" }}>
                    <Flex style={{ justifyContent: "space-between", alignItems: "center" }}>
                        {hasSettings ? (
                            <Tooltip text="Reset to default settings" shouldShow={!isObjectEmpty(pluginSettings)}>
                                {({ onMouseEnter, onMouseLeave }) => (
                                    <Button
                                        variant="dangerPrimary"
                                        size="small"
                                        onClick={handleResetClick}
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                    >
                                        Reset
                                    </Button>
                                )}
                            </Tooltip>
                        ) : <div />}
                        {!pluginMeta.userPlugin && (
                            <div className={cl("links")}>
                                <FavoriteButton
                                    isFavorite={pluginSettings.isFavorite ?? false}
                                    onClick={() => pluginSettings.isFavorite = !pluginSettings.isFavorite}
                                />
                            </div>
                        )}
                    </Flex>
                </Flex>
            </div>
        </Modal >
    );
}

export function openPluginModal(plugin: Plugin, onRestartNeeded?: (pluginName: string, key: string) => void) {
    openModal(modalProps => (
        <PluginModal
            {...modalProps}
            plugin={plugin}
            onRestartNeeded={(key: string) => onRestartNeeded?.(plugin.name, key)}
        />
    ));
}

function resetSettings(plugin: Plugin, onRestartNeeded?: (pluginName: string) => void) {
    const defaultSettings = plugin.settings?.def;
    const pluginName = plugin.name;

    if (!defaultSettings) return;

    const newSettings: Record<string, any> = {};
    let restartNeeded = false;

    for (const key in defaultSettings) {
        if (key === "enabled") continue;

        const setting = defaultSettings[key];
        setting.type = setting.type ?? OptionType.STRING;

        if (setting.type === OptionType.STRING) {
            newSettings[key] = setting.default !== undefined && setting.default !== "" ? setting.default : "";
        } else if ("default" in setting && setting.default !== undefined) {
            newSettings[key] = setting.default;
        }

        if (setting?.restartNeeded) {
            restartNeeded = true;
        }
    }

    const currentSettings = plugin.settings?.store;
    if (currentSettings) {
        Object.assign(currentSettings, newSettings);
    }

    if (restartNeeded) {
        onRestartNeeded?.(plugin.name);
    }

    showToast({
        text: `Settings for ${pluginName} have been reset.`,
        variant: "success",
        position: "top"
    });
}

export function openWarningModal(plugin?: Plugin | null, onRestartNeeded?: (pluginName: string) => void, isPlugin = true, enabledPlugins?: number | null, reset?: () => void) {
    openModal(props => (
        <ConfirmModal
            {...props}
            className={cl("confirm")}
            header={isPlugin ? "Reset Settings" : "Disable Plugins"}
            confirmText={isPlugin ? "Reset" : "Disable All"}
            cancelText="Cancel"
            onConfirm={() => {
                if (isPlugin && plugin) {
                    resetSettings(plugin, onRestartNeeded);
                } else {
                    reset?.();
                }
            }}
            onCancel={props.onClose}
        >
            <Paragraph>
                {isPlugin
                    ? <>Are you sure you want to reset all settings for <strong>{plugin?.name}</strong> to their default values?</>
                    : `Are you sure you want to disable ${enabledPlugins} plugins?`
                }
            </Paragraph>
            <div className={classes(Margins.top16, cl("warning"))}>
                <WarningIcon color="var(--text-feedback-critical)" />
                <span>This action cannot be undone.</span>
            </div>
        </ConfirmModal>
    ));
}
