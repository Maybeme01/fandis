/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./PluginModalButtons.css";

import { StarFilled, StarOutlined } from "@components/Icons";
import { classNameFactory } from "@utils/css";
import { getTheme, Theme } from "@utils/discord";
import { Clickable, Tooltip } from "@webpack/common";

const cl = classNameFactory("vc-settings-modal-");

const getThemeClass = () => getTheme() !== Theme.Light ? "dark" : "light";

interface Props {
    text: string;
    href: string;
}

export const GithubButton = (_props: Props) => null;
export const WebsiteButton = (_props: Props) => null;

export function FavoriteButton({ isFavorite, onClick }: { isFavorite: boolean; onClick: () => void; }) {
    const Icon = isFavorite ? StarFilled : StarOutlined;

    return (
        <Tooltip text={isFavorite ? "Unfavorite plugin" : "Favorite plugin - pins it to the top of the plugin list"}>
            {props =>
                <Clickable {...props} onClick={onClick} className={cl("favorite-button", isFavorite && "favorite-button-active", getThemeClass())}>
                    <Icon aria-hidden className={cl("link-icon", "favorite-icon")} />
                </Clickable>
            }
        </Tooltip>
    );
}
