/*
 * FanCord Settings Backup & Cloud Sync
 */

import { downloadSettingsBackup, exportSettings, importSettings, uploadSettingsBackup } from "@api/SettingsSync/offline";
import { DataStore } from "@api/index";
import { Button } from "@components/Button";
import { Divider } from "@components/Divider";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Notice } from "@components/Notice";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { React, TextInput, Toasts, useEffect, useState } from "@webpack/common";

const STORAGE_KEY = "fancord_gdrive_webhook_url";

const GOOGLE_APPS_SCRIPT_CODE = `const FILE_NAME = "fancord_backup.json";

function doPost(e) {
  try {
    const contents = e.postData.contents;
    JSON.parse(contents);
    const files = DriveApp.getFilesByName(FILE_NAME);
    let file;
    if (files.hasNext()) {
      file = files.next();
      file.setContent(contents);
    } else {
      file = DriveApp.createFile(FILE_NAME, contents, MimeType.PLAIN_TEXT);
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, updated: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const files = DriveApp.getFilesByName(FILE_NAME);
    if (!files.hasNext()) {
      return ContentService.createTextOutput(JSON.stringify({ error: "No backup file found in Google Drive." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const file = files.next();
    const content = file.getBlob().getDataAsString();
    return ContentService
      .createTextOutput(content)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

function showToast(type: any, message: string) {
    Toasts.show({
        type,
        message,
        id: Toasts.genId()
    });
}

function BackupAndRestoreTab() {
    const [webhookUrl, setWebhookUrl] = useState("");
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [guideLang, setGuideLang] = useState<"en" | "ar">("en");

    useEffect(() => {
        DataStore.get<string>(STORAGE_KEY).then(val => {
            if (val && typeof val === "string") {
                setWebhookUrl(val);
            } else {
                try {
                    const fallback = (typeof window !== "undefined" && window.localStorage?.getItem(STORAGE_KEY)) || "";
                    if (fallback) setWebhookUrl(fallback);
                } catch {}
            }
        }).catch(() => {});
    }, []);

    const handleSaveUrl = (value: string) => {
        const clean = typeof value === "string" ? value : (value as any)?.target?.value ?? "";
        setWebhookUrl(clean);
        DataStore.set(STORAGE_KEY, clean.trim()).catch(() => {});
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                window.localStorage.setItem(STORAGE_KEY, clean.trim());
            }
        } catch {}
    };

    const copyScriptToClipboard = () => {
        navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE)
            .then(() => showToast(Toasts.Type.SUCCESS, guideLang === "ar" ? "تم نسخ كود السكربت بنجاح!" : "Script code copied to clipboard!"))
            .catch(() => showToast(Toasts.Type.FAILURE, guideLang === "ar" ? "فشل نسخ الكود، انسخه يدوياً." : "Failed to copy code. Please copy manually."));
    };

    const handleCloudBackup = async () => {
        const url = webhookUrl.trim();
        if (!url) {
            showToast(Toasts.Type.FAILURE, guideLang === "ar" ? "يرجى إدخال رابط Web App أولاً." : "Please enter your Google Apps Script Web App URL first.");
            return;
        }

        try {
            setIsBackingUp(true);
            const backupData = await exportSettings({ type: "all", syncDataStore: true });
            
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: backupData
            });

            const resJson = await response.json().catch(() => null);
            if (response.ok && resJson?.success !== false) {
                showToast(Toasts.Type.SUCCESS, guideLang === "ar" ? "تم حفظ النسخة في Google Drive بنجاح!" : "Backup successfully saved to Google Drive!");
            } else {
                throw new Error(resJson?.error || `Server responded with status ${response.status}`);
            }
        } catch (err: any) {
            showToast(Toasts.Type.FAILURE, `${guideLang === "ar" ? "فشل النسخ الاحتياطي" : "Backup failed"}: ${err.message || err}`);
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleCloudRestore = async () => {
        const url = webhookUrl.trim();
        if (!url) {
            showToast(Toasts.Type.FAILURE, guideLang === "ar" ? "يرجى إدخال رابط Web App أولاً." : "Please enter your Google Apps Script Web App URL first.");
            return;
        }

        try {
            setIsRestoring(true);
            const response = await fetch(`${url}?t=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch backup: HTTP ${response.status}`);
            }

            const rawText = await response.text();
            await importSettings(rawText, "all");
            showToast(Toasts.Type.SUCCESS, guideLang === "ar" ? "تم استرجاع الإعدادات بنجاح! أعد تشغيل ديسكورد." : "Settings restored from Google Drive! Restart Discord to apply.");
        } catch (err: any) {
            showToast(Toasts.Type.FAILURE, `${guideLang === "ar" ? "فشل الاسترجاع" : "Restore failed"}: ${err.message || err}`);
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <SettingsTab>
            <Heading className={Margins.top16}>Backup & Restore</Heading>
            <Paragraph className={Margins.bottom20}>
                Import and export your FanCord settings locally as a JSON file, or synchronize them seamlessly with your Google Drive.
            </Paragraph>

            <Notice.Warning className={Margins.bottom20}>
                Importing or restoring a settings backup will overwrite your current settings. Make sure to export a backup first if you want to keep your current configuration.
            </Notice.Warning>

            {/* Google Drive Cloud Sync */}
            <Heading>Google Drive Cloud Sync</Heading>
            <Paragraph className={Margins.bottom12}>
                Enter your Google Apps Script Web App URL to upload and download your configuration directly to/from your personal Google Drive storage.
            </Paragraph>

            <div className={Margins.bottom16}>
                <TextInput
                    value={webhookUrl}
                    onChange={handleSaveUrl}
                    placeholder="https://script.google.com/macros/s/.../exec"
                />
            </div>

            <Flex gap="8px" className={Margins.bottom20} style={{ flexWrap: "wrap" }}>
                <Button
                    onClick={handleCloudBackup}
                    disabled={isBackingUp || !webhookUrl}
                    size="small"
                    variant="primary"
                >
                    {isBackingUp ? (guideLang === "ar" ? "جاري الرفع..." : "Backing up...") : "Backup to Google Drive"}
                </Button>
                <Button
                    onClick={handleCloudRestore}
                    disabled={isRestoring || !webhookUrl}
                    size="small"
                    variant="secondary"
                >
                    {isRestoring ? (guideLang === "ar" ? "جاري الاسترجاع..." : "Restoring...") : "Restore from Google Drive"}
                </Button>
                <Button
                    onClick={() => setShowGuide(!showGuide)}
                    size="small"
                    style={{ background: showGuide ? "var(--brand-experiment-500, #5865f2)" : undefined }}
                >
                    {showGuide ? "Hide Guide ▲" : "📖 Setup Guide ▼"}
                </Button>
            </Flex>

            {/* دليل الشرح التفاعلي */}
            {showGuide && (
                <div style={{
                    backgroundColor: "var(--background-secondary, #2b2d31)",
                    border: "1px solid var(--border-subtle, #3e4046)",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "24px"
                }}>
                    {/* أزرار اختيار اللغة */}
                    <Flex gap="8px" align="center" justify="space-between" style={{ marginBottom: "14px", flexWrap: "wrap" }}>
                        <Heading style={{ fontSize: "16px", margin: 0, color: "var(--text-normal, #f2f3f5)" }}>
                            {guideLang === "ar" ? "دليل إعداد المزامنة مع Google Drive" : "Google Drive Sync Setup Guide"}
                        </Heading>
                        <Flex gap="6px">
                            <Button
                                size="small"
                                variant={guideLang === "en" ? "primary" : "secondary"}
                                onClick={() => setGuideLang("en")}
                            >
                                English
                            </Button>
                            <Button
                                size="small"
                                variant={guideLang === "ar" ? "primary" : "secondary"}
                                onClick={() => setGuideLang("ar")}
                            >
                                العربية
                            </Button>
                        </Flex>
                    </Flex>

                    {/* نص الشرح باللغة المختارة */}
                    {guideLang === "en" ? (
                        <Paragraph style={{ lineHeight: "1.8", color: "var(--text-muted, #dbdee1)" }}>
                            <strong>1.</strong> Go to the official site: <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link, #00a8fc)", textDecoration: "underline", fontWeight: "bold" }}>script.google.com</a> and sign in with your Google account.<br />
                            <strong>2.</strong> Click on <strong>New project</strong> in the top-left corner.<br />
                            <strong>3.</strong> Erase any template code in the editor, copy the script below, and paste it there.<br />
                            <strong>4.</strong> In the top navigation bar, click <strong>Deploy</strong> and select <strong>New deployment</strong>.<br />
                            <strong>5.</strong> Click the gear icon ⚙️ next to "Select type" and choose <strong>Web app</strong>.<br />
                            <strong>6.</strong> Set the configuration as follows:
                            <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
                                <li>• <strong>Execute as:</strong> Select <code>Me (your account)</code></li>
                                <li>• <strong>Who has access:</strong> Select <code>Anyone</code> <em>(Crucial for Discord to connect without OAuth barriers)</em>.</li>
                            </ul>
                            <strong>7.</strong> Click <strong>Deploy</strong>, grant required permissions (Authorize access), then <strong>copy the Web app URL</strong> (ending in <code>/exec</code>) and paste it into the field above!
                        </Paragraph>
                    ) : (
                        <Paragraph style={{ lineHeight: "1.8", color: "var(--text-muted, #dbdee1)", direction: "rtl", textAlign: "right" }}>
                            <strong>1.</strong> توجّه إلى الرابط الرسمي: <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link, #00a8fc)", textDecoration: "underline", fontWeight: "bold" }}>script.google.com</a> وسجّل الدخول بحساب Google.<br />
                            <strong>2.</strong> اضغط على زر <strong>New project</strong> (مشروع جديد) في الزاوية العلوية.<br />
                            <strong>3.</strong> امسح أي كود موجود في المحرر، ثم انسخ كود السكربت الموجود بالأسفل واضعه مكانه.<br />
                            <strong>4.</strong> من القائمة العلوية اضغط على <strong>Deploy</strong> ثم اختر <strong>New deployment</strong>.<br />
                            <strong>5.</strong> اضغط على أيقونة الترس ⚙️ بجانب "Select type" واختر <strong>Web app</strong>.<br />
                            <strong>6.</strong> اضبط الخيارات التالية بدقة:
                            <ul style={{ paddingRight: "20px", marginTop: "6px", textAlign: "right" }}>
                                <li>• <strong>Execute as:</strong> اختر <code>Me (حسابك الشخصي)</code></li>
                                <li>• <strong>Who has access:</strong> اختر <code>Anyone (أي شخص)</code> <em>(مهم جداً ليتمكن ديسكورد من الاتصال بالرابط)</em>.</li>
                            </ul>
                            <strong>7.</strong> اضغط <strong>Deploy</strong>، وافق على الصلاحيات (Authorize access)، ثم <strong>انسخ رابط الـ Web app</strong> (الذي ينتهي بـ <code>/exec</code>) وضعه في الحقل بالأعلى!
                        </Paragraph>
                    )}

                    <Flex gap="8px" align="center" justify="space-between" style={{ marginTop: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
                        <Heading style={{ fontSize: "14px", margin: 0 }}>
                            {guideLang === "ar" ? "كود السكربت (Google Apps Script):" : "Script Code (Google Apps Script):"}
                        </Heading>
                        <Button size="small" variant="primary" onClick={copyScriptToClipboard}>
                            📋 {guideLang === "ar" ? "نسخ الكود بالكامل" : "Copy Script Code"}
                        </Button>
                    </Flex>

                    <pre style={{
                        backgroundColor: "var(--background-tertiary, #1e1f22)",
                        color: "#00d26a",
                        padding: "12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        maxHeight: "220px",
                        overflowY: "auto",
                        userSelect: "text",
                        border: "1px solid var(--border-subtle, #313338)",
                        whiteSpace: "pre-wrap",
                        fontFamily: "Consolas, monospace",
                        direction: "ltr",
                        textAlign: "left"
                    }}>
                        {GOOGLE_APPS_SCRIPT_CODE}
                    </pre>
                </div>
            )}

            <Divider className={Margins.bottom20} />

            {/* Local Import */}
            <Heading>Import Settings (Local)</Heading>
            <Paragraph className={Margins.bottom16}>
                Select a previously exported JSON file to restore your configuration from your local device.
            </Paragraph>

            <Flex gap="8px" className={Margins.bottom20} style={{ flexWrap: "wrap" }}>
                <Button onClick={() => uploadSettingsBackup("all")} size="small" variant="secondary">
                    Import All Settings
                </Button>
                <Button onClick={() => uploadSettingsBackup("plugins")} size="small">
                    Import Plugins
                </Button>
                <Button onClick={() => uploadSettingsBackup("css")} size="small">
                    Import QuickCSS
                </Button>
                <Button onClick={() => uploadSettingsBackup("datastore")} size="small">
                    Import DataStore
                </Button>
            </Flex>

            <Divider className={Margins.bottom20} />

            {/* Local Export */}
            <Heading>Export Settings (Local)</Heading>
            <Paragraph className={Margins.bottom16}>
                Download your current settings as a backup JSON file on your machine.
            </Paragraph>

            <Flex gap="8px" style={{ flexWrap: "wrap" }}>
                <Button onClick={() => downloadSettingsBackup("all")} size="small" variant="secondary">
                    Export All Settings
                </Button>
                <Button onClick={() => downloadSettingsBackup("plugins")} size="small">
                    Export Plugins
                </Button>
                <Button onClick={() => downloadSettingsBackup("css")} size="small">
                    Export QuickCSS
                </Button>
                <Button onClick={() => downloadSettingsBackup("datastore")} size="small">
                    Export DataStore
                </Button>
            </Flex>
        </SettingsTab>
    );
}

export default wrapTab(BackupAndRestoreTab, "Backup & Restore");
