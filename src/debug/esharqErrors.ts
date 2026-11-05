/*
 * FanCord / Esharq, a Discord client mod
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface Issue {
    kind: "patch" | "find" | "start" | "render" | "other";
    level: "error" | "warn";
    source: string;
    plugin?: string;
    count: number;
    lastAt: number;
    message: string;
}

const issues: Issue[] = [];
let droppedIssueCount = 0;
const MAX_ISSUES = 300;

export function recordIssue(data: {
    kind: Issue["kind"];
    level?: Issue["level"];
    source: string;
    plugin?: string;
    message: string;
}): void {
    const existing = issues.find(i =>
        i.kind === data.kind &&
        i.source === data.source &&
        i.plugin === data.plugin &&
        i.message === data.message
    );

    if (existing) {
        existing.count++;
        existing.lastAt = performance.now();
        return;
    }

    if (issues.length >= MAX_ISSUES) {
        droppedIssueCount++;
        return;
    }

    issues.unshift({
        kind: data.kind,
        level: data.level ?? "error",
        source: data.source,
        plugin: data.plugin,
        count: 1,
        lastAt: performance.now(),
        message: data.message
    });
}

export function getIssues(): Issue[] {
    return issues;
}

export function getDroppedIssueCount(): number {
    return droppedIssueCount;
}

export function clearIssues(): void {
    issues.length = 0;
    droppedIssueCount = 0;
}

