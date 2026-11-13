/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChildProcess, execFile, spawn } from "child_process";
import { app, desktopCapturer, shell } from "electron";
import { existsSync } from "fs";
import { mkdir, stat, writeFile } from "fs/promises";
import * as http from "http";
import * as net from "net";
import { join } from "path";

import { LOOPBACK_EXE_BASE64 } from "./loopbackBinary";

export async function getVideosPath(): Promise<string> {
    const videos = (app?.getPath ? app.getPath("videos") : "") || join(process.env.USERPROFILE || "", "Videos");
    const saveDir = join(videos, "FanCord");
    await mkdir(saveDir, { recursive: true }).catch(() => {});
    return saveDir;
}

export async function getDesktopSourceId(_: unknown): Promise<string> {
    try {
        const sources = await desktopCapturer.getSources({ types: ["screen"] });
        return sources[0]?.id || "";
    } catch {
        return "";
    }
}

export async function saveRecording(
    _: unknown,
    fileName: string,
    buffer: Uint8Array
): Promise<{ success: boolean; filePath: string }> {
    try {
        const dir = await getVideosPath();
        const filePath = join(dir, fileName);
        await writeFile(filePath, Buffer.from(buffer));
        return { success: true, filePath };
    } catch {
        return { success: false, filePath: "" };
    }
}

export async function openFolder(_: unknown, targetPath?: string): Promise<boolean> {
    try {
        const folder = targetPath || await getVideosPath();
        await shell.openPath(folder);
        return true;
    } catch {
        return false;
    }
}

async function resolveHelperExe(): Promise<string | null> {
    try {
        const targetDir = app?.getPath ? app.getPath("userData") : join(process.env.APPDATA || "", "FanCord");
        await mkdir(targetDir, { recursive: true }).catch(() => {});
        const targetExe = join(targetDir, "FanCordWasapiLoopback.exe");

        const buf = Buffer.from(LOOPBACK_EXE_BASE64, "base64");
        let shouldWrite = !existsSync(targetExe);
        if (!shouldWrite) {
            try {
                const s = await stat(targetExe);
                if (s.size !== buf.length) shouldWrite = true;
            } catch {
                shouldWrite = true;
            }
        }

        if (shouldWrite) {
            await writeFile(targetExe, buf);
        }

        return targetExe;
    } catch (err) {
        console.error("[VoiceRoomRecorder] Failed to extract loopback helper:", err);
        return null;
    }
}

export async function getLoopbackDevices(_: unknown): Promise<{ name: string; id: string }[]> {
    const exe = await resolveHelperExe();
    if (!exe) return [];

    return new Promise(resolve => {
        execFile(exe, ["--list"], { windowsHide: true }, (err, stdout) => {
            if (err || !stdout) {
                resolve([]);
                return;
            }
            const devices: { name: string; id: string }[] = [];
            const lines = stdout.split(/\r?\n/);
            for (const line of lines) {
                if (line.startsWith("DEVICE:")) {
                    const parts = line.slice(7).split("|");
                    if (parts.length >= 2) {
                        devices.push({ name: parts[0], id: parts[1] });
                    }
                }
            }
            resolve(devices);
        });
    });
}

let activeChild: ChildProcess | null = null;
let activeServer: http.Server | null = null;
const activeSockets = new Set<net.Socket>();
const activeResponses = new Set<http.ServerResponse>();

export function stopLoopbackCapture(): boolean {
    if (activeChild) {
        try {
            activeChild.kill();
        } catch {}
        activeChild = null;
    }

    for (const res of activeResponses) {
        try {
            res.end();
        } catch {}
    }
    activeResponses.clear();

    for (const sock of activeSockets) {
        try {
            sock.destroy();
        } catch {}
    }
    activeSockets.clear();

    if (activeServer) {
        try {
            activeServer.close();
        } catch {}
        activeServer = null;
    }

    return true;
}

export async function startLoopbackCapture(
    _: unknown,
    targetDevice?: string
): Promise<{ success: boolean; port: number; sampleRate: number; deviceName: string }> {
    stopLoopbackCapture();

    const exe = await resolveHelperExe();
    if (!exe) {
        return { success: false, port: 0, sampleRate: 48000, deviceName: "" };
    }

    return new Promise(resolve => {
        try {
            const server = http.createServer((req, res) => {
                if (req.url === "/audio") {
                    res.writeHead(200, {
                        "Content-Type": "application/octet-stream",
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive"
                    });
                    activeResponses.add(res);

                    req.on("close", () => {
                        activeResponses.delete(res);
                    });
                } else {
                    res.writeHead(404);
                    res.end();
                }
            });

            server.on("connection", socket => {
                activeSockets.add(socket);
                socket.on("close", () => activeSockets.delete(socket));
            });

            server.listen(0, "127.0.0.1", () => {
                const addr = server.address() as net.AddressInfo;
                const { port } = addr;
                activeServer = server;

                const args = targetDevice ? [targetDevice] : [];
                const child = spawn(exe, args, {
                    stdio: ["pipe", "pipe", "pipe"],
                    windowsHide: true
                });
                activeChild = child;

                let resolved = false;
                let sampleRate = 48000;
                let deviceName = "Loopback";

                child.stderr.on("data", (data: Buffer) => {
                    const text = data.toString();
                    const match = text.match(/READY:([^|]+)\|(\d+)/);
                    if (match) {
                        deviceName = match[1];
                        sampleRate = parseInt(match[2], 10) || 48000;
                        if (!resolved) {
                            resolved = true;
                            resolve({ success: true, port, sampleRate, deviceName });
                        }
                    }
                });

                child.stdout.on("data", (chunk: Buffer) => {
                    for (const res of activeResponses) {
                        try {
                            res.write(chunk);
                        } catch {}
                    }
                });

                child.on("error", err => {
                    console.error("[VoiceRoomRecorder] Child process error:", err);
                    if (!resolved) {
                        resolved = true;
                        resolve({ success: false, port: 0, sampleRate: 48000, deviceName: "" });
                    }
                });

                child.on("exit", () => {
                    activeChild = null;
                    if (!resolved) {
                        resolved = true;
                        resolve({ success: false, port: 0, sampleRate: 48000, deviceName: "" });
                    }
                });

                // Safety timeout: 2 seconds
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve({ success: Boolean(activeChild), port, sampleRate, deviceName });
                    }
                }, 2000);
            });
        } catch (err) {
            console.error("[VoiceRoomRecorder] Failed to start loopback server:", err);
            resolve({ success: false, port: 0, sampleRate: 48000, deviceName: "" });
        }
    });
}
