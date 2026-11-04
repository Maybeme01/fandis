/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getQuestifySettings, useQuestifySettings } from "@fanplugins/questify/settings/access";
import { resetDangerousSettings } from "@fanplugins/questify/settings/dangerous";
import { autoCompleteQuestTaskTypes, defaultAutoCompleteQuestTypes, isDesktopCompatible } from "@fanplugins/questify/settings/def";
import { validateIgnoredQuests } from "@fanplugins/questify/settings/ignoredQuests";
import { QuestTaskType } from "@fanplugins/questify/utils/types";
import { Alerts, q } from "@fanplugins/questify/utils/ui";
import type { JSX } from "react";

import { ManaButton, type ManaSelectOption, SettingsCard, SettingsDescription, SettingsHeader, SettingsNotice, SettingsParagraph, SettingsSelect, SettingsSubheader, SettingsSubtleSwitch } from "./shared";

type QuestDisableSettingKey =
    | "disableAccountPanelPromo"
    | "disableAccountPanelQuestProgress"
    | "disableFriendsListPromo"
    | "disableMembersListPromo"
    | "disableOrbsAndQuestsBadges"
    | "disableRelocationNotices"
    | "disableSponsoredBanner";

type QuestModifySettingKey =
    | "autoCompleteQuestsSimultaneously"
    | "resumeInterruptedQuests"
    | "completeVideoQuestsQuicker"
    | "preventVideoQuestsPausing"
    | "hideNonAutoCompletableQuests"
    | "makeMobileVideoQuestsDesktopCompatible";

interface QuestDisableOption {
    key: QuestDisableSettingKey;
    label: string;
}

const disableFeatureOptions = [
    {
        key: "disableSponsoredBanner",
        label: "البانر الترويجي الممول",
    },
    {
        key: "disableRelocationNotices",
        label: "إشعارات النقل",
    },
    {
        key: "disableFriendsListPromo",
        label: "إعلانات قائمة الأصدقاء",
    },
    {
        key: "disableMembersListPromo",
        label: "شارات قائمة الأعضاء",
    },
    {
        key: "disableAccountPanelPromo",
        label: "إعلانات لوحة الحساب",
    },
    {
        key: "disableAccountPanelQuestProgress",
        label: "شريط تقدم لوحة الحساب",
    },
    {
        key: "disableOrbsAndQuestsBadges",
        label: "شارات المهمات والأوربز",
    },
] as const satisfies readonly QuestDisableOption[];

const disableManaOptions: ManaSelectOption[] = disableFeatureOptions.map(({ key, label }) => ({
    id: key,
    label,
    value: key,
}));

const autoCompleteQuestTypeLabels = {
    [QuestTaskType.WATCH_VIDEO]: "مشاهدة فيديو",
    [QuestTaskType.WATCH_VIDEO_ON_MOBILE]: "مشاهدة فيديو (جوال)",
    [QuestTaskType.ACHIEVEMENT_IN_ACTIVITY]: "إنجاز في نشاط",
    [QuestTaskType.PLAY_ACTIVITY]: "لعب نشاط",
    [QuestTaskType.PLAY_ON_DESKTOP]: "لعب على الكمبيوتر",
    [QuestTaskType.PLAY_ON_PLAYSTATION]: "لعب على بلايستيشن",
    [QuestTaskType.PLAY_ON_XBOX]: "لعب على إكس بوكس",
} as const satisfies Record<typeof autoCompleteQuestTaskTypes[number], string>;

const autoCompleteQuestTypeOptions = autoCompleteQuestTaskTypes.map(questType => ({
    label: autoCompleteQuestTypeLabels[questType],
    value: questType,
})) satisfies { label: string; value: QuestTaskType; }[];

const autoCompleteQuestTypeManaOptions: ManaSelectOption[] = autoCompleteQuestTypeOptions.map(({ label, value }) => ({
    id: String(value),
    label,
    value: String(value),
    disabled: !isDesktopCompatible(value),
}));

export function QuestFeaturesSetting(): JSX.Element {
    const questFeatures = useQuestifySettings([
        "disableQuestsEverything",
        "disableSponsoredBanner",
        "disableRelocationNotices",
        "disableFriendsListPromo",
        "disableMembersListPromo",
        "disableAccountPanelPromo",
        "disableAccountPanelQuestProgress",
        "disableOrbsAndQuestsBadges",
        "resumeInterruptedQuests",
        "allowChangingDangerousSettings",
        "makeMobileVideoQuestsDesktopCompatible",
        "autoCompleteQuestsSimultaneously",
        "autoCompleteQuestTypes",
        "completeVideoQuestsQuicker",
        "preventVideoQuestsPausing",
        "hideNonAutoCompletableQuests",
    ]);

    const selectedDisableValues = disableFeatureOptions
        .filter(({ key }) => questFeatures[key])
        .map(({ key }) => key);

    const selectedAutoCompleteQuestTypeValues = autoCompleteQuestTypeOptions
        .filter(({ value }) => isDesktopCompatible(value) && questFeatures.autoCompleteQuestTypes[value] === true)
        .map(({ value }) => String(value));

    function updateDisableValue(value: string | string[] | null) {
        const selectedKeys = new Set(Array.isArray(value) ? value : value ? [value] : []);

        for (const { key } of disableFeatureOptions) {
            getQuestifySettings()[key] = selectedKeys.has(key);
        }
    }

    function confirmDangerousSettingChange(body: string, onConfirm: () => void) {
        Alerts.show({
            title: "هل أنت متأكد؟",
            body,
            confirmText: "Continue",
            confirmVariant: "critical-primary",
            cancelText: "Cancel",
            onConfirm,
        });
    }

    function updateAutoCompleteQuestTypes(value: string | string[] | null) {
        const selectedValues = new Set(Array.isArray(value) ? value : value ? [value] : []);
        const nextAutoCompleteQuestTypes = { ...defaultAutoCompleteQuestTypes };

        for (const { value: questType } of autoCompleteQuestTypeOptions) {
            const nextValue = selectedValues.has(String(questType))
                && isDesktopCompatible(questType);

            nextAutoCompleteQuestTypes[questType] = nextValue;
        }

        getQuestifySettings().autoCompleteQuestTypes = nextAutoCompleteQuestTypes;
        validateIgnoredQuests();
    }

    function updateDisableEverything(checked: boolean) {
        function setDisableEverything() {
            getQuestifySettings().disableQuestsEverything = checked;
        }

        if (checked) {
            confirmDangerousSettingChange(
                "This will completely disable Quest functionality.",
                () => {
                    resetDangerousSettings();
                    setDisableEverything();
                }
            );
        } else {
            setDisableEverything();
        }
    }

    function updateDangerousAccess(checked: boolean) {
        function setDangerousAccess() {
            getQuestifySettings().allowChangingDangerousSettings = checked;
        }

        if (checked) {
            confirmDangerousSettingChange(
                "This will allow changing dangerous settings.",
                setDangerousAccess
            );
        } else {
            resetDangerousSettings();
            setDangerousAccess();
        }
    }

    function updateModifyValue(key: QuestModifySettingKey, checked: boolean) {
        getQuestifySettings()[key] = checked;

        if (key === "hideNonAutoCompletableQuests" || key === "makeMobileVideoQuestsDesktopCompatible") {
            validateIgnoredQuests();
        }
    }

    return (
        <SettingsCard>
            <SettingsHeader> Quest Features </SettingsHeader>
            <SettingsDescription> Modify how Quests behave to enhance or remove functionality. </SettingsDescription>
            <SettingsSubheader> Disable Features </SettingsSubheader>
            <SettingsSubtleSwitch
                checked={questFeatures.disableQuestsEverything}
                label="تعطيل نظام المهمات بالكامل:"
                onChange={updateDisableEverything}
                bottomSpacing="10"
                tooltip={{
                    position: "top",
                    text: "This will disable all plugin enhancements, hide the Quests page and Quest elements across Discord, and prevent Discord from fetching Quest data. This will not affect the shop as Orbs are too intrinsically tied to it as a secondary currency."
                }}
            />
            <SettingsSelect
                label="تعطيل ميزات معينة:"
                wrapTags={true}
                options={disableManaOptions}
                value={selectedDisableValues}
                closeOnSelect={false}
                maxOptionsVisible={7}
                selectionMode="multiple"
                disabled={questFeatures.disableQuestsEverything}
                onSelectionChange={updateDisableValue}
                tooltip={{
                    position: "top",
                    text: "Sponsored Banner is a paid-for Quest banner at the top of the Quests page."
                        + "\n\nRelocation Notices are indicators such as in the Discovery page about Quests moving to DMs."
                        + "\n\nFriends List Promo is a card that displays on the \"Active Now\" section of your Friends List while a user you share a server with is playing a game with an active Quest."
                        + "\n\nMembers List Promo is an icon that displays on members in a server's Members List while they are playing a game with an active Quest."
                        + "\n\nAccount Panel Promo is a paid-for Quest promotion that appears above your user account panel."
                        + "\n\nAccount Panel Progress is the active or completed Quest progress shown above your user account panel."
                        + "\n\nQuest & Orbs Badges are badges on user profiles for when someone has completed at least one Quest or bought the Orbs badge respectively."
                }}
            />
            <SettingsSubheader> Modify Features </SettingsSubheader>
            <SettingsNotice className={["notice-card-red", questFeatures.disableQuestsEverything ? "dimmed-settings-item" : undefined, questFeatures.allowChangingDangerousSettings ? undefined : "notice-card-solo", "no-bottom-margin"].filter(c => c !== undefined)}>
                <SettingsParagraph>
                    من المعروف أن ديسكورد يعاقب مستخدمي الأدوات التي تعدل طريقة إكمال المهمات. تعديل إكمال المهمات يخالف <a href="https://discord.com/safety/platform-manipulation-policy-explainer" target="_blank" rel="noreferrer">شروط الخدمة</a>.
                </SettingsParagraph>
                <br />
                <SettingsParagraph>
                    تتراوح العقوبة بين فقدان مؤقت أو دائم للوصول للمهمات ومكافآتها. <strong>كما تسجل العقوبة كمخالفة رسمية على حالة الحساب وتستمر لمدة سنتين.</strong>
                </SettingsParagraph>
                <br />
                <SettingsParagraph>
                    بسبب أساليب المراقبة المتعددة لدى ديسكورد، يصعب تجنب الرصد تماماً. المتابعة تكون على مسؤوليتك الخاصة.
                </SettingsParagraph>
                <br />
                <SettingsParagraph>
                    فعّل الخيار التالي للوصول إلى الإعدادات المتقدمة والحساسة على مسؤوليتك.
                </SettingsParagraph>
                <div className={q("settings-button", "allow-dangerous-button")}>
                    <ManaButton
                        text={questFeatures.allowChangingDangerousSettings
                            ? "إعادة ضبط وتعطيلالسماح بتعديل الإعدادات الخطرة..."
                            : "السماح بتعديل الإعدادات الخطرة..."}
                        variant={questFeatures.allowChangingDangerousSettings ? "critical-secondary" : "critical-primary"}
                        fullWidth={true}
                        disabled={questFeatures.disableQuestsEverything}
                        onClick={() => updateDangerousAccess(!questFeatures.allowChangingDangerousSettings)}
                        size="sm"
                    />
                </div>
                <div style={{ display: questFeatures.allowChangingDangerousSettings ? undefined : "none" }}>
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.hideNonAutoCompletableQuests}
                        label="إخفاء المهمات غير القابلة للإكمال التلقائي:"
                        onChange={checked => updateModifyValue("hideNonAutoCompletableQuests", checked)}
                        topSpacing="10"
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "إخفاء المهمات غير المكتملة (سواء المتاحة أو المتجاهلة) إذا كانت لا تدعم مهمة إكمال تلقائي على هذه المنصة ومفعلة في قائمة أنواع المهمات. يُستثنى من ذلك المهمات المستلمة والمنتهية والمكتملة. استخدم خيارات ترتيب الحالات المخفية لإخفائها."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.completeVideoQuestsQuicker}
                        label="تسريع الإكمال التلقائي لمهام الفيديو:"
                        onChange={checked => updateModifyValue("completeVideoQuestsQuicker", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "يسمح ديسكورد بإكمال مهام الفيديو بمجرد مرور وقت يقل بمقدار 24 ثانية عن مدة الفيديو منذ تسجيلك في المهمة."
                                + "\n\nهذا يعني أنه إذا كانت مدة مهمة الفيديو 24 ثانية أو أقل، أو إذا سجلت فيها وعدت لاحقاً لإنهائها، فيمكن إكمالها فوراً."
                                + "\n\nينطبق هذا الإعداد فقط على الإكمال التلقائي لمهام الفيديو ويعتمد على إعداد الإكمال أدناه. الإكمال اليدوي يتطلب الانتظار طوال المدة."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.preventVideoQuestsPausing}
                        label="منع إيقاف مهام الفيديو مؤقتاً عند فقدان التركيز:"
                        onChange={checked => updateModifyValue("preventVideoQuestsPausing", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "يفرض ديسكورد البقاء داخل نافذة التطبيق لتشغيل فيديوهات المهام واستمرارها."
                                + "\n\nيمنع هذا الخيار إيقاف الفيديو مؤقتاً ويتيح استمرار التقدم بشكل طبيعي حتى عند الانتقال لنوافذ أخرى."
                                + "\n\nينطبق هذا الإعداد فقط على المشاهدة اليدوية لمهام الفيديو."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.makeMobileVideoQuestsDesktopCompatible}
                        label="إتاحة إكمال بعض مهام الفيديو المخصصة للجوال على الكمبيوتر:"
                        onChange={checked => updateModifyValue("makeMobileVideoQuestsDesktopCompatible", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "Some mobile-only Video Quests can be enrolled in on desktop, but still must be completed on mobile. This setting will allow those to be completed on desktop."
                                + "\n\nSome mobile-only Video Quests are only enrollable on mobile. For this setting to affect those, you must enroll in those Quests on your mobile device before returning to desktop and refreshing your Quests."
                                + "\n\nThis setting, when enabled independently, applies only to manually completing Video Quests. Auto-completing mobile Video Quests from desktop relies on the auto-complete setting below, and will implicitly enable this setting as well."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.autoCompleteQuestsSimultaneously}
                        label="إكمال المهمات في آن واحد بدلاً من التتابع:"
                        onChange={checked => updateModifyValue("autoCompleteQuestsSimultaneously", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "افتراضياً، يتم إدراج المهمات المتعددة في قائمة انتظار لتُنجز واحدة تلو الأخرى بالترتيب."
                                + "\n\nيتيح هذا الخيار تشغيل كافة المهمات القابلة للإكمال في نفس الوقت بشكل متزامن."
                                + "\n\nينطبق هذا الخيار فقط على الإكمال التلقائي ويعتمد على تفعيل الإعداد أدناه."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.resumeInterruptedQuests}
                        label="استئناف الإكمال التلقائي المنقطع بعد إعادة التشغيل:"
                        onChange={checked => updateModifyValue("resumeInterruptedQuests", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "يستأنف هذا الخيار تلقائياً أي عمليات إكمال منقطعة بسبب إعادة تشغيل ديسكورد، بما في ذلك إعادة جدولة المهمات التي كانت في قائمة الانتظار ولم تبدأ بعد."
                        }}
                    />
                    <SettingsSelect
                        label="إكمال أنواع محددة من المهمات تلقائياً:"
                        labelClassName="margin-top-9"
                        wrapTags={true}
                        options={autoCompleteQuestTypeManaOptions}
                        value={selectedAutoCompleteQuestTypeValues}
                        closeOnSelect={false}
                        maxOptionsVisible={7}
                        selectionMode="multiple"
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        onSelectionChange={updateAutoCompleteQuestTypes}
                        tooltip={{
                            position: "top",
                            wider: true,
                            text: "مهام مشاهدة الفيديو على الجوال تعمل فقط مع المهام التي تقبل التسجيل من الكمبيوتر. إذا كانت المهمة محصورة في التسجيل عبر الجوال، فيجب التسجيل فيها من هاتفك أولاً ثم تحديث المهمات على الكمبيوتر."
                                + "\n\nترسل مهام الفيديو عادة سجل تتبع (Stack Trace) مع تقارير التقدم، مما يمكن ديسكورد من التحقق من الدوال المستدعاة. يقوم Questify بمسح هذا السجل، لكن غيابه التام قد يكون ملحوظاً أيضاً."
                                + "\n\nمهام اللعب على الكمبيوتر أو بلايستيشن أو إكس بوكس والأنشطة مدعومة فقط في تطبيق ديسكورد المكتبي الرسمي؛ التطبيقات الخارجية والمعدلة لا تدعم هذه الأنواع بسبب قيود ديسكورد."
                                + "\n\nترسل مهام الألعاب بصمة رقمية للعبة مع نبضات التحقق (Heartbeat). يترك Questify هذه القيمة فارغة لعدم إمكانية تزييفها بدقة، لكن غيابها قد يلفت الانتباه."
                                + "\n\nمهام إنجازات الأنشطة لا تكتمل تلقائياً إلا فورياً في وقتها، وقد تغلق هذه الطريقة في أي وقت من قِبل ديسكورد."
                                + "\n\nيتم الإكمال التلقائي بالنقر على زر المهمة في صفحة المهمات، وتُنجز حسب ترتيب طابور الانتظار ما لم يتم تفعيل خيار الإنجاز المتزامن أعلاه."
                                + "\n\nالإكمال التلقائي هو الخيار الأكثر حساسية وخطورة بين الإعدادات المتاحة. تفعيله واستخدامه يكون على مسؤوليتك الخاصة بالكامل."
                        }}
                    />
                </div>
            </SettingsNotice>
        </SettingsCard>
    );
}

