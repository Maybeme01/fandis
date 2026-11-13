/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    autoRecord: {
        description: "Automatically start recording when joining a voice channel, and stop/save when leaving",
        type: OptionType.BOOLEAN,
        default: true
    },
    recordSystemAudio: {
        description: "Record all voice channel members' audio in high quality (supports SteelSeries Sonar / Voicemeeter / Stereo Mix)",
        type: OptionType.BOOLEAN,
        default: true
    },
    roomAudioDeviceId: {
        description: "Voice room audio capture device (Smart Auto or selected playback device)",
        type: OptionType.STRING,
        default: "auto"
    },
    recordMic: {
        description: "Record your microphone mixed with voice room members",
        type: OptionType.BOOLEAN,
        default: true
    },
    micAudioDeviceId: {
        description: "Microphone device used for recording",
        type: OptionType.STRING,
        default: "auto"
    },
    notifyOnSave: {
        description: "Show immediate notification when recording is completed and saved in Videos/FanCord",
        type: OptionType.BOOLEAN,
        default: true
    }
});
