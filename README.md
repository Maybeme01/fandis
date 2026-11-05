<div align="center">

# 🌟 FanCord

**تعديل حديث، سريع، وغني بالميزات لتطبيق ديسكورد مع دعم كامل للغة العربية وإضافات حصرية.**
**A modern, lightweight, and feature-rich Discord client mod with first-class Arabic support and exclusive plugins.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Built with pnpm](https://img.shields.io/badge/Built%20with-pnpm-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)

[المميزات](#-المميزات--features) • [التثبيت](#-التثبيت--installation) • [البناء المصدري](#-البناء-المصدري--building-from-source) • [الإضافات الحصرية](#-الإضافات-الحصرية--fanplugins) • [الشكر والتقدير](#-الشكر-والتقدير--credits)

---

</div>

## 🌐 المميزات / Features

### 🇸🇦 دعم اللغة العربية والواجهة (Arabic & RTL Support)
- **واجهة معربة بالكامل:** دعم مخصص للاتجاه من اليمين إلى اليسار (RTL) مع خطوط مخصصة وتحسينات لمحاذاة النصوص.
- **إعدادات متقدمة للغة:** قسم مخصص لإدارة إعدادات اللغة العربية والمظهر العربي داخل تطبيق ديسكورد.

### ⚡ خفيف وفائق السرعة (Lightweight & Fast)
- مبني على أسس معمارية حديثة مع زمن تشغيل فوري وبناء سريع بأقل استهلاك للموارد والذاكرة.
- أكثر من 500 إضافة جاهزة للاستخدام مع إمكانية التفعيل والتعطيل بنقرة زر واحدة.

### 🎨 سمات ومظهر مخصص (Themes & Styling)
- دعم كامل لـ QuickCSS وOnline Themes المحدثة تلقائياً.
- تأثيرات زجاجية وحواف ناعمة متوافقة مع أنظمة Windows وmacOS وLinux.

---

## 🧩 الإضافات الحصرية / FanPlugins

يحتوي FanCord على حزمة حصرية من الإضافات المطورة خصيصاً للمستخدمين:

| الإضافة / Plugin | الوصف العربي | English Description |
| :--- | :--- | :--- |
| **fastPing** | فحص سريع ومباشر للاتصال والاستجابة في الخوادم والقنوات. | Fast ping and latency inspector for voice and text channels. |
| **obsRemoteControl** | التحكم في بث OBS والتسجيل والمشاهد مباشرة من داخل ديسكورد. | Control OBS Studio stream, recording, and scenes directly from Discord. |
| **questify** | إكمال تلقائي لمهام ديسكورد وجوائزها بسهولة وأمان. | Automatic progress and tracking for Discord quests and rewards. |
| **tikTokViewer** | معاينة وتضمين مقاطع تيك توك المباشرة داخل المحادثات. | Rich preview and direct playback for TikTok links in chat. |
| **voiceLogger** | تسجيل وتتبع أحداث القنوات الصوتية (الدخول، الخروج، والانتقال) مع دعم ثنائي اللغة. | Comprehensive voice channel event logger with bilingual UI. |

---

## 🚀 التثبيت / Installation

### التثبيت التلقائي عبر المثبت (Automatic via Installer)
1. قم بتحميل المثبت أو تشغيله مباشرة من خلال السكربت:
   ```bash
   pnpm inject
   ```
2. لتثبيت FanCord على **Discord Canary**:
   ```bash
   node scripts/runInstaller.mjs -- -install -branch canary
   ```
3. لتثبيت FanCord على **Discord Stable**:
   ```bash
   node scripts/runInstaller.mjs -- -install -branch stable
   ```

---

## 🛠️ البناء المصدري / Building From Source

### المتطلبات الأساسية (Prerequisites)
- [Node.js](https://nodejs.org/) الإصدار 18 أو أحدث.
- [pnpm](https://pnpm.io/) مثبت في نظامك.

### خطوات البناء (Build Steps)
1. **استنساخ المستودع وتثبيت التبعيات:**
   ```bash
   git clone https://github.com/FanCord/FanCord.git
   cd FanCord
   pnpm install
   ```

2. **بناء نسخة سطح المكتب (Desktop):**
   ```bash
   pnpm build
   ```

3. **بناء نسخة المتصفح وإضافة الويب (Browser & Userscript):**
   ```bash
   pnpm buildWeb
   ```

4. **بناء النسخة المستقلة (Standalone):**
   ```bash
   pnpm buildStandalone
   ```

5. **فحص الأخطاء والتوافق:**
   ```bash
   pnpm lint:intl       # فحص الترجمة
   pnpm lint:patches    # فحص توافق الترقيعات
   pnpm lint-styles     # فحص ملفات CSS
   pnpm testTsc         # فحص أنواع TypeScript
   ```

---

## 🤝 الشكر والتقدير / Credits & Attribution

مشروع **FanCord** مبني على أسس قوية ومفتوحة المصدر بفضل الجهود الكبيرة لمجتمعات المطورين:
- [Vencord](https://github.com/Vendicated/Vencord) - الابتكار الأساسي والمعمارية الرئيسية.
- [Equicord](https://github.com/Equicord/Equicord) - التحسينات والميزات الإضافية.
- وجميع المطورين والمساهمين في مجتمع تعديلات ديسكورد مفتوحة المصدر.

---

## 📄 الترخيص / License

هذا المشروع مرخص تحت رخصة **GNU General Public License v3.0**. راجع ملف [LICENSE](LICENSE) للمزيد من التفاصيل.
