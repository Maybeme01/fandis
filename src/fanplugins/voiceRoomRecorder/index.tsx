/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { UserAreaButton, UserAreaRenderProps } from "@api/UserArea";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { React, useEffect, useState } from "@webpack/common";

import { RecorderEngine } from "./recorderEngine";
import { settings } from "./settings";
import { RecorderIcon } from "./ui/RecorderIcon";
import { openRecorderModal } from "./ui/RecorderModal";

function VoiceRecorderUserAreaButton({ iconForeground, hideTooltips, nameplate }: UserAreaRenderProps) {
    const [isRecording, setIsRecording] = useState(() => RecorderEngine.isRecording());

    useEffect(() => {
        return RecorderEngine.subscribe(() => {
            setIsRecording(RecorderEngine.isRecording());
        });
    }, []);

    return (
        <UserAreaButton
            onClick={openRecorderModal}
            role="button"
            tooltipText={hideTooltips ? void 0 : isRecording ? "مسجل الروم الصوتي (جاري التسجيل...)" : "مسجل الروم الصوتي"}
            icon={<RecorderIcon className={iconForeground} isRecording={isRecording} />}
            plated={nameplate != null}
            redGlow={isRecording}
        />
    );
}

export default definePlugin({
    name: "VoiceRoomRecorder",
    description: "Records voice channel video and audio in high quality showing members, usernames, avatars, and speaking status, with auto start/stop and saving in Videos/FanCord",
    authors: [Devs.FAN],
    dependencies: ["UserAreaAPI"],
    settings,

    userAreaButton: {
        icon: RecorderIcon,
        render: VoiceRecorderUserAreaButton
    },

    start() {
        window.addEventListener("beforeunload", () => {
            if (RecorderEngine.isRecording()) {
                void RecorderEngine.stop();
            }
        });
    },

    stop() {
        if (RecorderEngine.isRecording()) {
            void RecorderEngine.stop();
        }
    },

    flux: {
        VOICE_CHANNEL_SELECT({ channelId }: { channelId?: string | null }) {
            if (channelId && channelId !== RecorderEngine.getActiveChannelId()) {
                if (settings.store.autoRecord) {
                    if (RecorderEngine.isRecording()) {
                        void RecorderEngine.stop().then(() => {
                            void RecorderEngine.start(channelId);
                        });
                    } else {
                        void RecorderEngine.start(channelId);
                    }
                }
            } else if (!channelId && RecorderEngine.isRecording()) {
                void RecorderEngine.stop();
            }
        },

        SPEAKING({ userId, speakingFlags }: { userId: string; speakingFlags: number }) {
            RecorderEngine.onSpeaking(userId, speakingFlags > 0);
        },

        VOICE_STATE_UPDATES() {
            RecorderEngine.onVoiceStateUpdate();
        }
    }
});
