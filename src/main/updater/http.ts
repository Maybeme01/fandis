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

import { fetchBuffer, fetchJson } from "@main/utils/http";
import { VENCORD_USER_AGENT } from "@shared/vencordUserAgent";
import { writeFileSync } from "original-fs";

import gitHash from "~git-hash";
import gitRemote from "~git-remote";

import { Updater } from ".";
import { ASAR_FILE } from "./common";

const API_BASE = `https://api.github.com/repos/${gitRemote}`;
let PendingUpdate: string | null = null;

async function githubGet<T = any>(endpoint: string) {
    return fetchJson<T>(API_BASE + endpoint, {
        headers: {
            Accept: "application/vnd.github+json",
            // "All API requests MUST include a valid User-Agent header.
            // Requests with no User-Agent header will be rejected."
            "User-Agent": VENCORD_USER_AGENT
        }
    });
}

async function listUpdates() {
    const isOutdated = await fetchUpdate();
    if (!isOutdated) return [];

    try {
        const data = await githubGet(`/compare/${gitHash}...HEAD`);
        if (data?.commits) {
            return data.commits.map((c: any) => ({
                hash: c.sha,
                author: c.author?.login ?? c.commit?.author?.name ?? "Unknown Author",
                message: c.commit.message.split("\n")[0]
            }));
        }
    } catch {
        // في حال وجود حظر IP على الـ API، يُعرض سجل افتراضي لمنع انهيار النافذة
    }

    return [{
        hash: "latest",
        author: "FanCord",
        message: "New FanCord update available"
    }];
}

async function fetchUpdate() {
    try {
        // 1. فحص الإصدار عبر صفحة Releases المباشرة (بدون أي Rate Limit)
        const res = await fetch(`https://github.com/${gitRemote}/releases/latest`, {
            headers: { "User-Agent": VENCORD_USER_AGENT }
        });
        const tag = res.url.split("/").pop() ?? "";
        const hash = tag.replace(/^v-/, "");

        if (hash && (hash === gitHash || gitHash.startsWith(hash) || hash.startsWith(gitHash)))
            return false;

        PendingUpdate = `https://github.com/${gitRemote}/releases/latest/download/${ASAR_FILE}`;
        return true;
    } catch {
        // 2. خطة بديلة احتياطية
        try {
            const data = await githubGet("/releases/latest");
            if (data?.assets) {
                const hash = data.name?.slice(data.name.lastIndexOf(" ") + 1);
                if (hash === gitHash) return false;
                const asset = data.assets.find((a: any) => a.name === ASAR_FILE);
                PendingUpdate = asset?.browser_download_url ?? `https://github.com/${gitRemote}/releases/latest/download/${ASAR_FILE}`;
                return true;
            }
        } catch (err) {
            console.error("Failed to check for updates:", err);
        }
        return false;
    }
}

async function applyUpdate() {
    if (!PendingUpdate) return true;

    const data = await fetchBuffer(PendingUpdate);
    writeFileSync(__dirname, data, { flush: true });

    PendingUpdate = null;

    return true;
}

const HttpUpdater: Updater = {
    getRepo: async () => `https://github.com/${gitRemote}`,
    listUpdates,
    fetchUpdate,
    applyUpdate
};

export default HttpUpdater;

