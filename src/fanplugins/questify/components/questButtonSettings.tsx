/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getQuestifySettings, useQuestifySettings } from "@fanplugins/questify/settings/access";
import { type QuestButtonAction, type QuestButtonDisplayMode, type QuestButtonIncludedTypes, type QuestButtonIndicatorMode } from "@fanplugins/questify/settings/def";
import { startAutoFetchingQuests } from "@fanplugins/questify/settings/fetching";
import { validateIgnoredQuests } from "@fanplugins/questify/settings/ignoredQuests";
import { QuestRewardType, QuestTaskType } from "@fanplugins/questify/utils/types";
import { canShowBadge, canShowButton, canShowPill } from "@fanplugins/questify/utils/ui";
import type { JSX } from "react";

import { enabledOnStartup } from "..";
import { DummyQuestButton } from "./questButton";
import { type ManaSelectOption, SettingsCard, SettingsColorPicker, SettingsDescription, SettingsHeader, SettingsRow, SettingsRowItem, SettingsSelect, SettingsSubheader } from "./shared";

interface QuestButtonIncludedTypeOption {
    label: string;
    value: QuestTaskType | QuestRewardType;
}

const questButtonDisplayOptions = [
    { label: "دائماً", value: "always" },
    { label: "المتاحة", value: "unclaimed" },
    { label: "أبداً", value: "never" },
] as const satisfies readonly { label: string; value: QuestButtonDisplayMode; }[];

const questButtonIndicatorOptions = [
    { label: "شريط جانبي", value: "pill" },
    { label: "شارة رقمية", value: "badge" },
    { label: "كلاهما", value: "both" },
    { label: "بدون", value: "none" },
] as const satisfies readonly { label: string; value: QuestButtonIndicatorMode; }[];

const questButtonClickOptions = [
    { label: "فتح المهمات", value: "open-quests" },
    { label: "قائمة الخيارات", value: "context-menu" },
    { label: "إعدادات الإضافة", value: "plugin-settings" },
    { label: "لا شيء", value: "nothing" },
] as const satisfies readonly { label: string; value: QuestButtonAction; }[];

const questButtonRewardTypeOptions = [
    { label: "أوربز (Orbs)", value: QuestRewardType.VIRTUAL_CURRENCY },
    { label: "أكواد نيترو", value: QuestRewardType.FRACTIONAL_PREMIUM },
    { label: "أكواد مكافآت", value: QuestRewardType.REWARD_CODE },
    { label: "عناصر داخل الألعاب", value: QuestRewardType.IN_GAME },
    { label: "مقتنيات الملف الشخصي", value: QuestRewardType.COLLECTIBLE },
] as const satisfies readonly QuestButtonIncludedTypeOption[];

const questButtonQuestTypeOptions = [
    { label: "مشاهدة فيديو", value: QuestTaskType.WATCH_VIDEO },
    { label: "مشاهدة فيديو (جوال)", value: QuestTaskType.WATCH_VIDEO_ON_MOBILE },
    { label: "إنجاز في نشاط", value: QuestTaskType.ACHIEVEMENT_IN_ACTIVITY },
    { label: "إنجاز في لعبة", value: QuestTaskType.ACHIEVEMENT_IN_GAME },
    { label: "لعب نشاط", value: QuestTaskType.PLAY_ACTIVITY },
    { label: "لعب على الكمبيوتر", value: QuestTaskType.PLAY_ON_DESKTOP },
    { label: "لعب على الكمبيوتر (V2)", value: QuestTaskType.PLAY_ON_DESKTOP_V2 },
    { label: "بث على الكمبيوتر", value: QuestTaskType.STREAM_ON_DESKTOP },
    { label: "لعب على بلايستيشن", value: QuestTaskType.PLAY_ON_PLAYSTATION },
    { label: "لعب على إكس بوكس", value: QuestTaskType.PLAY_ON_XBOX },
] as const satisfies readonly QuestButtonIncludedTypeOption[];

function toManaOptions<T extends string | number>(options: readonly { label: string; value: T; }[]): ManaSelectOption[] {
    return options.map(({ label, value }) => ({
        id: String(value),
        label,
        value: String(value),
    }));
}

const questButtonDisplayManaOptions = toManaOptions(questButtonDisplayOptions);
const questButtonIndicatorManaOptions = toManaOptions(questButtonIndicatorOptions);
const questButtonClickManaOptions = toManaOptions(questButtonClickOptions);
const questButtonRewardTypeManaOptions = toManaOptions(questButtonRewardTypeOptions);
const questButtonQuestTypeManaOptions = toManaOptions(questButtonQuestTypeOptions);

export function QuestButtonSetting(): JSX.Element {
    const questButton = useQuestifySettings([
        "disableQuestsEverything",
        "questButtonDisplay",
        "questButtonIncludedTypes",
        "questButtonIndicator",
        "questButtonBadgeCount",
        "questButtonBadgeColor",
        "questButtonLeftClickAction",
        "questButtonMiddleClickAction",
        "questButtonRightClickAction",
    ]);

    const disabled = questButton.disableQuestsEverything;
    const includedTypes = questButton.questButtonIncludedTypes as QuestButtonIncludedTypes;

    const selectedRewardTypes = questButtonRewardTypeOptions
        .filter(({ value }) => includedTypes[value])
        .map(({ value }) => String(value));

    const selectedQuestTypes = questButtonQuestTypeOptions
        .filter(({ value }) => includedTypes[value])
        .map(({ value }) => String(value));

    function updateQuestButtonDisplay(value: string | string[] | null) {
        if (typeof value !== "string") return;

        getQuestifySettings().questButtonDisplay = value as QuestButtonDisplayMode;
        startAutoFetchingQuests(true);
    }

    function updateQuestButtonIndicator(value: string | string[] | null) {
        if (typeof value !== "string") return;

        getQuestifySettings().questButtonIndicator = value as QuestButtonIndicatorMode;
        startAutoFetchingQuests(true);
    }

    function updateQuestButtonAction(key: "questButtonLeftClickAction" | "questButtonMiddleClickAction" | "questButtonRightClickAction", value: string | string[] | null) {
        if (typeof value !== "string") return;

        getQuestifySettings()[key] = value as QuestButtonAction;
    }

    function updateBadgeColor(value: number | null) {
        getQuestifySettings().questButtonBadgeColor = value;
    }

    function updateIncludedTypes(options: readonly QuestButtonIncludedTypeOption[], value: string | string[] | null) {
        const selectedValues = new Set(Array.isArray(value) ? value : value ? [value] : []);
        const nextIncludedTypes = { ...getQuestifySettings().questButtonIncludedTypes };

        for (const option of options) {
            nextIncludedTypes[option.value] = selectedValues.has(String(option.value));
        }

        getQuestifySettings().questButtonIncludedTypes = nextIncludedTypes;
        validateIgnoredQuests();
    }

    return (
        <SettingsCard>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsHeader> Quest Button </SettingsHeader>
                    <SettingsDescription> Show a Quest Button in the server list with an optional indicator for unclaimed and unignored Quests. </SettingsDescription>
                </SettingsRowItem>
                {enabledOnStartup && <SettingsRowItem width="content">
                    <DummyQuestButton
                        badgeColor={questButton.questButtonBadgeColor}
                        leftClickAction={questButton.questButtonLeftClickAction}
                        middleClickAction={questButton.questButtonMiddleClickAction}
                        rightClickAction={questButton.questButtonRightClickAction}
                        showBadge={canShowBadge(questButton.questButtonIndicator)}
                        showPill={canShowPill(questButton.questButtonIndicator)}
                        visible={canShowButton(questButton.questButtonDisplay)}
                    />
                </SettingsRowItem>}
            </SettingsRow>
            <SettingsSubheader className="no-top-margin"> Button Behavior </SettingsSubheader>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label="عند النقر باليسار:"
                        options={questButtonClickManaOptions}
                        value={questButton.questButtonLeftClickAction}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={value => updateQuestButtonAction("questButtonLeftClickAction", value)}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label="عند النقر بالزر الأوسط:"
                        options={questButtonClickManaOptions}
                        value={questButton.questButtonMiddleClickAction}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={value => updateQuestButtonAction("questButtonMiddleClickAction", value)}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label="عند النقر باليمين:"
                        options={questButtonClickManaOptions}
                        value={questButton.questButtonRightClickAction}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={value => updateQuestButtonAction("questButtonRightClickAction", value)}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label="ظهور الزر:"
                        options={questButtonDisplayManaOptions}
                        value={questButton.questButtonDisplay}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={updateQuestButtonDisplay}
                        tooltip={{
                            position: "top",
                            text: "Always shows the Quest Button whenever this feature is enabled."
                                + "\n\nUnclaimed only shows it while you have relevant unclaimed Quest rewards."
                                + "\n\nNever hides the Quest Button."
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label="مؤشر المهمات المتاحة:"
                        options={questButtonIndicatorManaOptions}
                        value={questButton.questButtonIndicator}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={updateQuestButtonIndicator}
                        tooltip={{
                            position: "top",
                            text: "Pill shows Discord's unread-style marker beside the Quest Button."
                                + "\n\nBadge shows the number of relevant unclaimed Quest rewards."
                                + "\n\nBoth shows the pill and badge together."
                                + "\n\nNone hides unclaimed indicators."
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsColorPicker
                        label="لون الشارة:"
                        className="quest-button-color-picker"
                        color={questButton.questButtonBadgeColor}
                        disabled={disabled}
                        onChange={updateBadgeColor}
                        showEyeDropper={true}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsSubheader> Quest Relevancy </SettingsSubheader>
            <SettingsSelect
                label="أنواع المكافآت المضمنة:"
                wrapTags={true}
                options={questButtonRewardTypeManaOptions}
                value={selectedRewardTypes}
                closeOnSelect={false}
                maxOptionsVisible={questButtonRewardTypeManaOptions.length}
                selectionMode="multiple"
                disabled={disabled}
                fullWidth={true}
                onSelectionChange={value => updateIncludedTypes(questButtonRewardTypeOptions, value)}
                tooltip={{
                    position: "top",
                    text: "Only count Quests with these reward types as unclaimed when determining button visibility, badge count, and alert behavior."
                }}
            />
            <SettingsSelect
                label="أنواع المهمات المضمنة:"
                labelClassName="margin-top-9"
                wrapTags={true}
                options={questButtonQuestTypeManaOptions}
                value={selectedQuestTypes}
                closeOnSelect={false}
                maxOptionsVisible={questButtonQuestTypeManaOptions.length}
                selectionMode="multiple"
                disabled={disabled}
                fullWidth={true}
                onSelectionChange={value => updateIncludedTypes(questButtonQuestTypeOptions, value)}
                tooltip={{
                    position: "top",
                    text: "Only count Quests with these task types as unclaimed when determining button visibility, badge count, and alert behavior."
                }}
            />
        </SettingsCard>
    );
}
