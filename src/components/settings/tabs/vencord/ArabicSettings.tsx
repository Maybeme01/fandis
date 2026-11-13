/*
 * FanCord Arabic Localization Settings
 */

import { Settings, useSettings } from "@api/Settings";
import { Divider } from "@components/Divider";
import { FormSwitch } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import ArabicUI from "@plugins/arabicUi";
import { writeEsharqPref } from "@utils/esharqPrefs";
import { Margins } from "@utils/margins";
import { promptToRestart } from "@utils/promptToRestart";
import { React } from "@webpack/common";

export function ArabicSettings() {
    const { plugins } = useSettings(["plugins"]);
    const isArabicEnabled = plugins?.ArabicUI?.enabled ?? false;
    const { font } = ArabicUI.settings.use(["font"]);

    const fontOptions = [
        { label: "افتراضي ديسكورد (Discord default)", value: "default" },
        { label: "خط كيرو (Cairo)", value: "cairo" },
        { label: "خط تجوال (Tajawal)", value: "tajawal" },
        { label: "خط أميري (Amiri)", value: "amiri" },
        { label: "خط وزير متن (Vazirmatn)", value: "vazirmatn" },
    ];

    return (
        <>
            <Divider className={Margins.top20} />

            <Heading className={Margins.top20}>اللغة والتعريب (Arabic Localization)</Heading>
            <Paragraph className={Margins.bottom16}>
                تفعيل واجهة ديسكورد باللغة العربية مع دعم كامل للخطوط العربية وترجمة القوائم وإضافات FanCord.
            </Paragraph>

            <FormSwitch
                value={isArabicEnabled}
                onChange={v => {
                    Settings.plugins.ArabicUI ??= {} as any;
                    Settings.plugins.ArabicUI.enabled = v;
                    writeEsharqPref("pluginsArabic", v);
                    promptToRestart();
                }}
                description="تعريب شامل لواجهة ديسكورد، إعدادات السيرفرات، الرومات، وإضافات FanCord."
            >
                تفعيل واجهة الديسكورد العربية (Enable Arabic UI)
            </FormSwitch>

            {isArabicEnabled && (
                <div style={{ marginTop: "12px", marginBottom: "16px", padding: "12px", backgroundColor: "var(--background-secondary, #2b2d31)", borderRadius: "8px" }}>
                    <div style={{ color: "var(--header-primary, #f2f3f5)", fontWeight: "600", fontSize: "14px", marginBottom: "6px" }}>
                        نوع الخط العربي (Arabic Font)
                    </div>
                    <div style={{ color: "var(--text-muted, #949ba4)", fontSize: "12px", marginBottom: "10px" }}>
                        اختر الخط المناسب للنصوص العربية في الواجهة والقوائم (يتطلب إعادة تشغيل التطبيق).
                    </div>
                    <select
                        value={font || "default"}
                        onChange={e => {
                            ArabicUI.settings.store.font = e.target.value;
                            promptToRestart();
                        }}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: "var(--input-background, #1e1f22)",
                            color: "var(--text-default, #dbdee1)",
                            border: "1px solid var(--input-border, #3b3e45)",
                            borderRadius: "6px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        {fontOptions.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ backgroundColor: "#1e1f22", color: "#dbdee1" }}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
}
