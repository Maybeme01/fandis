/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@webpack/common";

export function RecorderIcon({ className, isRecording }: { className?: string; isRecording?: boolean; }) {
    return (
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <polygon points="23 7 16 12 23 17 23 7" fill="currentColor" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            {isRecording && <span className="fc-rec-dot" />}
        </div>
    );
}
