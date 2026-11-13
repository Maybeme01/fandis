/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { app } from "electron";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";

function getSharedFilePath(): string {
    const appData = process.env.APPDATA || (app?.getPath ? app.getPath("appData") : "");
    return join(appData, "FanCord", "active_fake_deafen.json");
}

export async function setFakeDeafenUser(_: any, userId: string, active: boolean): Promise<boolean> {
    if (!userId) return false;
    try {
        const filePath = getSharedFilePath();
        await mkdir(dirname(filePath), { recursive: true }).catch(() => {});

        let data: Record<string, { active: boolean; updatedAt: number }> = {};
        try {
            const raw = await readFile(filePath, "utf8");
            data = JSON.parse(raw);
        } catch {}

        if (active) {
            data[userId] = { active: true, updatedAt: Date.now() };
        } else {
            delete data[userId];
        }

        await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
        return true;
    } catch {
        return false;
    }
}

export async function getActiveFakeDeafenUsers(_: any): Promise<Record<string, { active: boolean; updatedAt: number }>> {
    try {
        const filePath = getSharedFilePath();
        const raw = await readFile(filePath, "utf8");
        const data = JSON.parse(raw);
        const now = Date.now();
        const valid: Record<string, { active: boolean; updatedAt: number }> = {};
        for (const [id, entry] of Object.entries(data as Record<string, any>)) {
            if (entry && entry.active && now - entry.updatedAt < 86400000) {
                valid[id] = entry;
            }
        }
        return valid;
    } catch {
        return {};
    }
}
