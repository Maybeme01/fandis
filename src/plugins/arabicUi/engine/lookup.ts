// --- FanCord Questify Official Engine Dictionary ---
const QUESTIFY_LOOKUP: Record<string, string> = {
    // --- تلميحات الترتيب الفرعي وتنبيهات استبعاد المهمات ---
    "Completed but unclaimed Quests stay below incomplete unclaimed Quests, then this subsort is applied within those groups.": "تبقى المهمات المكتملة ولكن غير المستلمة أسفل المهمات غير المكتملة المتاحة، ثم يُطبّق هذا الترتيب الفرعي داخل تلك المجموعات.",
    "Claimed Quests can be sorted by claim time or by when the Quest was added.": "يمكن ترتيب المهمات المستلمة حسب وقت الاستلام أو حسب وقت إضافة المهمة.",
    "Ignored Quests still keep their ignored group position, then this subsort controls their order inside that group.": "تحتفظ المهمات المتجاهلة بموقع مجموعتها المتجاهلة، ثم يتحكم هذا الترتيب الفرعي في ترتيبها داخل تلك المجموعة.",
    "Expired Quests can be sorted by expiration time or by when the Quest was added.": "يمكن ترتيب المهمات المنتهية حسب وقت انتهاء الصلاحية أو حسب وقت إضافة المهمة.",
    "Some Quests are excluded from your available Quests list due to region or platform restrictions. When a sound is selected, Questify will fetch their Quest configs, apply your included Quest and reward type filters, print the resolved excluded Quest data to console, and play this sound for matching excluded Quests.": "تُستبعد بعض المهمات من قائمة المهمات المتاحة لديك بسبب قيود المنطقة أو المنصة. عند تحديد صوت، سيجلب Questify إعدادات تلك المهمات، ويطبق فلاتر أنواع المهام والمكافآت المضمنة لديك، ويطبع بيانات المهمات المستبعدة في وحدة التحكم (Console)، ويشغل هذا الصوت للمهمات المستبعدة المطابقة.",
    "Some Quests are excluded from your available Quests list due to region or platform restrictions.": "تُستبعد بعض المهمات من قائمة المهمات المتاحة لديك بسبب قيود المنطقة أو المنصة.",
    "When a sound is selected, Questify will fetch their Quest configs, apply your included Quest and reward type filters, print the resolved excluded Quest data to console, and play this sound for matching excluded Quests.": "عند تحديد صوت، سيجلب Questify إعدادات تلك المهمات، ويطبق فلاتر أنواع المهام والمكافآت المضمنة لديك، ويطبع بيانات المهمات المستبعدة في وحدة التحكم (Console)، ويشغل هذا الصوت للمهمات المستبعدة المطابقة.",
    // --- تلميحات زر المهمات وظهوره والمؤشرات ---
    "Always shows the Quest Button whenever this feature is enabled. Unclaimed only shows it while you have relevant unclaimed Quest rewards. Never hides the Quest Button.": "يُظهر خيار 'دائماً' زر المهمات طالما أن الميزة مفعلة. خيار 'المتاحة' يُظهره فقط عند وجود مكافآت مهمات غير مستلمة. خيار 'أبداً' يخفي زر المهمات تماماً.",
    "Always shows the Quest Button whenever this feature is enabled.": "يُظهر خيار 'دائماً' زر المهمات طالما أن الميزة مفعلة.",
    "Unclaimed only shows it while you have relevant unclaimed Quest rewards.": "خيار 'المتاحة' يُظهره فقط عند وجود مكافآت مهمات غير مستلمة.",
    "Never hides the Quest Button.": "خيار 'أبداً' يخفي زر المهمات تماماً.",

    "Pill shows Discord's unread-style marker beside the Quest Button. Badge shows the number of relevant unclaimed Quest rewards. Both shows the pill and badge together. None hides unclaimed indicators.": "يُظهر خيار 'شريط جانبي' علامة تشبه رسائل ديسكورد غير المقروءة بجانب الزر. خيار 'شارة رقمية' يُظهر عدد مكافآت المهمات المتاحة. خيار 'كلاهما' يعرض الشريط والشارة معاً. خيار 'بدون' يخفي مؤشرات المهمات المتاحة.",
    "Pill shows Discord's unread-style marker beside the Quest Button.": "يُظهر خيار 'شريط جانبي' علامة تشبه رسائل ديسكورد غير المقروءة بجانب الزر.",
    "Badge shows the number of relevant unclaimed Quest rewards.": "خيار 'شارة رقمية' يُظهر عدد مكافآت المهمات المتاحة.",
    "Both shows the pill and badge together.": "خيار 'كلاهما' يعرض الشريط والشارة معاً.",
    "None hides unclaimed indicators.": "خيار 'بدون' يخفي مؤشرات المهمات المتاحة.",

    "Only count Quests with these reward types as unclaimed when determining button visibility, badge count, and alert behavior.": "احتساب المهمات التي تحتوي على أنواع المكافآت هذه فقط كمهمات متاحة عند تحديد ظهور الزر، عدد الشارة، وتنبيهات الإشعارات.",
    "Only count Quests with these task types as unclaimed when determining button visibility, badge count, and alert behavior.": "احتساب المهمات التي تحتوي على أنواع المهام هذه فقط كمهمات متاحة عند تحديد ظهور الزر، عدد الشارة، وتنبيهات الإشعارات.",

    // --- تلميحات الفترات الزمنية والبطاقات وإعادة الترتيب ---
    "Discord only fetches Quests on load and when you visit the Quests page. This interval periodically fetches Quests for you while the client stays open, so Quest Button indicators and new Quest alerts can stay up to date throughout the day. This only runs if enabled and if the Quest Button or Quest Notifications settings are configured in a way which makes fetching periodically meaningful.": "يجلب ديسكورد المهمات فقط عند بدء التشغيل أو فتح صفحة المهمات. يقوم هذا الفاصل الزمني بتحديث المهمات دورياً طالما أن التطبيق يعمل، لتبقى شارات وتنبيهات المهمات محدثة طوال اليوم. يعمل هذا الخيار فقط عند تفعيله وبشرط تهيئة زر أو إشعارات المهمات بطريقة تجعل التحديث الدوري مفيداً.",
    "Discord only fetches Quests on load and when you visit the Quests page.": "يجلب ديسكورد المهمات فقط عند بدء التشغيل أو فتح صفحة المهمات.",
    "This interval periodically fetches Quests for you while the client stays open, so Quest Button indicators and new Quest alerts can stay up to date throughout the day.": "يقوم هذا الفاصل الزمني بتحديث المهمات دورياً طالما أن التطبيق يعمل، لتبقى شارات وتنبيهات المهمات محدثة طوال اليوم.",
    "This only runs if enabled and if the Quest Button or Quest Notifications settings are configured in a way which makes fetching periodically meaningful.": "يعمل هذا الخيار فقط عند تفعيله وبشرط تهيئة زر أو إشعارات المهمات بطريقة تجعل التحديث الدوري مفيداً.",

    "Intense and Default use the selected tile color in the asset gradient. Subtle Black keeps a darker neutral gradient for contrast. No Gradient removes the asset gradient, which can make some Quest artwork harder to read.": "يستخدم خيارا 'قوي' و'افتراضي' لون البطاقة المختار في تدرج صورة المهمة. خيار 'أسود خفيف' يوفر تدرجاً داكناً ومحايداً لزيادة التباين. خيار 'بدون تدرج' يلغي التدرج اللوني، مما قد يجعل نصوص بعض صور المهمات صعبة القراءة.",
    "Intense and Default use the selected tile color in the asset gradient.": "يستخدم خيارا 'قوي' و'افتراضي' لون البطاقة المختار في تدرج صورة المهمة.",
    "Subtle Black keeps a darker neutral gradient for contrast.": "خيار 'أسود خفيف' يوفر تدرجاً داكناً ومحايداً لزيادة التباين.",
    "No Gradient removes the asset gradient, which can make some Quest artwork harder to read.": "خيار 'بدون تدرج' يلغي التدرج اللوني، مما قد يجعل نصوص بعض صور المهمات صعبة القراءة.",

    "Loading all assets when the Quests page opens reduces layout shifting while scrolling. Loading during page scroll is closer to Discord's default behavior and may use less work up front.": "تحميل كافة الوسائط عند فتح صفحة المهمات يقلل من انزياح العناصر أثناء التمرير. أما التحميل أثناء التمرير فيشبه السلوك الافتراضي لديسكورد ويستهلك موارد أقل عند الفتح.",
    "Loading all assets when the Quests page opens reduces layout shifting while scrolling.": "تحميل كافة الوسائط عند فتح صفحة المهمات يقلل من انزياح العناصر أثناء التمرير.",
    "Loading during page scroll is closer to Discord's default behavior and may use less work up front.": "أما التحميل أثناء التمرير فيشبه السلوك الافتراضي لديسكورد ويستهلك موارد أقل عند الفتح.",

    "Selecting an occupied position swaps the two statuses. Hidden statuses are removed from the Quest lists.": "اختيار موقع محجوز مسبقاً يؤدي إلى تبديل الموقعين بين الحالتين. أما الحالات المخفية فتُزال تماماً من قوائم المهمات.",
    "Selecting an occupied position swaps the two statuses.": "اختيار موقع محجوز مسبقاً يؤدي إلى تبديل الموقعين بين الحالتين.",
    "Hidden statuses are removed from the Quest lists.": "أما الحالات المخفية فتُزال تماماً من قوائم المهمات.",
    // --- تلميحات ونصوص Questify المتبقية ---
    "Discord is known to punish users of scripts or plugins that modify the completion of Quests. Modifying the completion of Quests is against Discord's": "من المعروف أن ديسكورد يعاقب مستخدمي الأدوات التي تعدل طريقة إكمال المهمات. تعديل طريقة إكمال المهمات يخالف",
    "Modifying the completion of Quests is against Discord's": "تعديل طريقة إكمال المهمات يخالف",
    "This will disable all plugin enhancements, hide the Quests page and Quest elements across Discord, and prevent Discord from fetching Quest data. This will not affect the shop as Orbs are too intrinsically tied to it as a secondary currency.": "سيؤدي هذا إلى تعطيل جميع ميزات الإضافة، وإخفاء صفحة وعناصر المهمات في ديسكورد، ومنع جلب بيانات المهمات. لن يؤثر ذلك على المتجر لأن الأوربز مرتبطة به كعملة ثانوية.",
    "Sponsored Banner is a paid-for Quest banner at the top of the Quests page. Relocation Notices are indicators such as in the Discovery page about Quests moving to DMs. Friends List Promo is a card that displays on the \"Active Now\" section of your Friends List while a user you share a server with is playing a game with an active Quest. Members List Promo is an icon that displays on members in a server's Members List while they are playing a game with an active Quest. Account Panel Promo is a paid-for Quest promotion that appears above your user account panel. Account Panel Progress is the active or completed Quest progress shown above your user account panel. Quest & Orbs Badges are badges on user profiles for when someone has completed at least one Quest or bought the Orbs badge respectively.": "البانر الترويجي هو إعلان مدفوع للمهمات أعلى صفحة المهمات. إشعارات النقل هي تنبيهات في صفحة الاستكشاف بانتقال المهمات للرسائل الخاصة. إعلانات قائمة الأصدقاء هي بطاقة تظهر في قسم \"نشط الآن\" عندما يلعب صديق لعبة بها مهمة نشطة. شارات قائمة الأعضاء هي أيقونة تظهر بجانب الأعضاء أثناء لعبهم لعبة بها مهمة. إعلانات لوحة الحساب هي ترويج للمهمات فوق لوحة الحساب. شريط تقدم لوحة الحساب يعرض تقدم المهمة النشطة أو المكتملة. شارات المهمات والأوربز تظهر في الملف الشخصي لمن أكمل مهمة أو اشترى شارة الأوربز.",
    "Discord allows Video Quests to be completed once 24 seconds less than the duration of the video has passed since you enrolled into the Quest. This means that if a Video Quest is 24 seconds or less, or if you enroll in a Video Quest and return later to complete it, it can be completed immediately. This setting will only apply to auto-completing Video Quests and relies on the auto-complete setting below. Manually completing Video Quests will still require waiting the full duration and is not dependent on enrollment time.": "يسمح ديسكورد بإكمال مهام الفيديو بمجرد مرور وقت يقل بمقدار 24 ثانية عن مدة الفيديو منذ تسجيلك في المهمة. هذا يعني أنه إذا كانت مدة مهمة الفيديو 24 ثانية أو أقل، أو إذا سجلت فيها وعدت لاحقاً لإنهائها، فيمكن إكمالها فوراً. ينطبق هذا الخيار فقط على الإكمال التلقائي لمهام الفيديو ويعتمد على إعداد الإكمال أدناه. الإكمال اليدوي يتطلب الانتظار للمدة الكاملة.",
    "Discord forces you to be tabbed into the client for Video Quests to play their video. This setting prevents the video from pausing and allows completion to progress as normal. This setting applies only to manually completing Video Quests.": "يفرض ديسكورد البقاء داخل نافذة التطبيق لتشغيل فيديوهات المهام واستمرارها. يمنع هذا الإعداد إيقاف الفيديو مؤقتاً ويتيح استمرار التقدم بشكل طبيعي عند فتح نوافذ أخرى. ينطبق هذا الإعداد فقط على الإكمال اليدوي لمهام الفيديو.",
    "Some mobile-only Video Quests can be enrolled in on desktop, but still must be completed on mobile. This setting will allow those to be completed on desktop. Some mobile-only Video Quests are only enrollable on mobile. For this setting to affect those, you must enroll in those Quests on your mobile device before returning to desktop and refreshing your Quests. This setting, when enabled independently, applies only to manually completing Video Quests. Auto-completing mobile Video Quests from desktop relies on the auto-complete setting below, and will implicitly enable this setting as well.": "بعض مهام الفيديو المخصصة للجوال يمكن التسجيل فيها من الكمبيوتر ولكن يجب إكمالها من الجوال، وهذا الخيار يتيح إكمالها على الكمبيوتر. وبعض المهام يتطلب التسجيل من الجوال أولاً؛ لتطبيق الخيار عليها سجّل من هاتفك أولاً ثم حدّث المهمات على الكمبيوتر. عند تفعيل هذا الإعداد منفرداً فإنه ينطبق فقط على الإكمال اليدوي، بينما يعتمد الإكمال التلقائي على الخيار أدناه وسيقوم بتفعيله تلقائياً.",
    "By default, attempting to auto-complete multiple Quests will queue them to be completed in order. This setting will alternatively allow all auto-complete Quests to run at the same time. This setting will only apply to auto-completing Quests and relies on the auto-complete setting below.": "افتراضياً، يتم إدراج المهمات المتعددة في قائمة انتظار لتُنجز بالتتابع واحدة تلو الأخرى. يتيح هذا الخيار تشغيل كافة المهمات القابلة للإكمال في نفس الوقت بشكل متزامن. ينطبق هذا الخيار فقط على الإكمال التلقائي ويعتمد على تفعيل الإعداد أدناه.",
    "Watch Video on Mobile Quests will only work on mobile Quests which are enrollable on desktop. If a Quest is locked to enrollment on mobile, you must first enroll in it on your mobile device before returning to desktop and refreshing your Quests. All video related Quests usually send a stack trace with the progress reports. This means Discord would know exactly which functions were called, and can therefore verify that their own functions initiated the progress. Questify erases this stack trace, but the absence of it will be just as telling as its presence. Play on Desktop, Play on PlayStation, Play on Xbox, and Play Activity Quests are only available on official desktop clients due to a limitation imposed by Discord. 3rd party clients such as web extensions, Vesktop, Equibop, and others, do not support auto-completing these Quest types. All game related Quests usually send a game fingerprint with the heartbeat reports. This means Discord can use data from tens of thousands of users to determine whether other users are likely using a real game or are emulating the executable. There is no reasonable method to spoof this value, so Questify leaves it blank, but the absence of it will be just as telling as poorly spoofing the value. Achievement in Activity Quests can only be auto-completed by completing them immediately. This method may be patched at any time. Auto-completing Quests is done by clicking their respective buttons on the Quests page. Quests will be auto-completed in the order they were queued, unless the simultaneous completion setting is enabled above. Auto-completing Quests is the riskiest dangerous setting available. Enable it at your own risk.": "مهام مشاهدة الفيديو على الجوال تعمل فقط مع المهام التي تقبل التسجيل من الكمبيوتر. إذا كانت المهمة محصورة في التسجيل عبر الجوال، فيجب التسجيل فيها من هاتفك أولاً ثم تحديث المهمات على الكمبيوتر. ترسل مهام الفيديو عادة سجل تتبع (Stack Trace) مع تقارير التقدم، مما يمكن ديسكورد من التحقق من الدوال المستدعاة، ويقوم Questify بمسح هذا السجل لكن غيابه قد يلفت الانتباه أيضاً. مهام اللعب والأنشطة مدعومة فقط في تطبيق ديسكورد المكتبي الرسمي؛ التطبيقات الخارجية والمعدلة لا تدعم إكمالها تلقائياً بسبب قيود ديسكورد. ترسل مهام الألعاب بصمة رقمية مع نبضات التحقق، ويترك Questify هذه القيمة فارغة لعدم إمكانية تزييفها بدقة. مهام إنجازات الأنشطة تكتمل فقط فورياً وقد تُغلق هذه الطريقة في أي وقت. يتم الإكمال التلقائي بالنقر على أزرار المهمات وتُنجز حسب طابور الانتظار ما لم يُفعّل خيار الإنجاز المتزامن أعلاه. الإكمال التلقائي هو الخيار الأكثر حساسية وخطورة، وتفعيله يكون على مسؤوليتك الخاصة بالكامل.",
    "Quest Features": "ميزات المهمات",
    "Modify how Quests behave to enhance or remove functionality.": "تعديل سلوك المهمات لتحسين الميزات أو إزالتها.",
    "Disable Features": "تعطيل الميزات",
    "Completely disable Quest functionality:": "تعطيل نظام المهمات بالكامل:",
    "Disable specific features:": "تعطيل ميزات معينة:",
    "Sponsored Banner": "البانر الترويجي الممول",
    "Relocation Notices": "إشعارات النقل",
    "Friends List Promo": "إعلانات قائمة الأصدقاء",
    "Members List Promo": "شارات قائمة الأعضاء",
    "Account Panel Promo": "إعلانات لوحة الحساب",
    "Account Panel Progress": "شريط تقدم لوحة الحساب",
    "Account Panel Quest Progress": "شريط تقدم المهمة في لوحة الحساب",
    "Quest & Orbs Badges": "شارات المهمات والأوربز",
    "Modify Features": "تعديل السلوك التلقائي",
    "Reset and disallow changing dangerous settings...": "إعادة ضبط وتعطيل الإعدادات الخطرة...",
    "Reset and disable dangerous settings...": "إعادة ضبط وتعطيل الإعدادات الخطرة...",
    "Allow changing dangerous settings...": "السماح بتعديل الإعدادات الخطرة...",
    "Hide Non Auto-Completable Quests:": "إخفاء المهمات غير القابلة للإكمال التلقائي:",
    "Accelerate Video Quest auto-completion:": "تسريع الإكمال التلقائي لمهام الفيديو:",
    "Prevent Video Quests from pausing when losing focus:": "منع إيقاف مهام الفيديو مؤقتاً عند فقدان التركيز:",
    "Make some mobile-only Video Quests completable on desktop:": "إتاحة إكمال بعض مهام الفيديو المخصصة للجوال على الكمبيوتر:",
    "Auto-complete Quests simultaneously rather than sequentially:": "إكمال المهمات في آن واحد بدلاً من التتابع:",
    "Resume interrupted auto-completions after a reload or restart:": "استئناف الإكمال التلقائي المنقطع بعد إعادة التشغيل:",
    "Auto-complete specific Quest types:": "إكمال أنواع محددة من المهمات تلقائياً:",
    "Quest Button": "زر المهمات",
    "Show a Quest Button in the server list with an optional indicator for unclaimed and unignored Quests.": "إظهار زر المهمات في قائمة السيرفرات مع مؤشر للمهمات المتاحة وغير المتجاهلة.",
    "Button Behavior": "سلوك الزر",
    "Left Click Action:": "عند النقر باليسار:",
    "Middle Click Action:": "عند النقر بالزر الأوسط:",
    "Right Click Action:": "عند النقر باليمين:",
    "Open Quests": "فتح المهمات",
    "Context Menu": "قائمة الخيارات",
    "Plugin Settings": "إعدادات الإضافة",
    "Nothing": "لا شيء",
    "Button Visibility:": "ظهور الزر:",
    "Unclaimed Indicator:": "مؤشر المهمات المتاحة:",
    "Badge Color:": "لون الشارة:",
    "Always": "دائماً",
    "Unclaimed": "المتاحة",
    "Never": "أبداً",
    "Both": "كلاهما",
    "Pill": "شريط جانبي",
    "Badge": "شارة رقمية",
    "None": "بدون",
    "Quest Relevancy": "اهتمامات المهمات",
    "Included Reward Types:": "أنواع المكافآت المضمنة:",
    "Included Quest Types:": "أنواع المهمات المضمنة:",
    "Nitro Codes": "أكواد نيترو",
    "Reward Codes": "أكواد مكافآت",
    "In Game Items": "عناصر داخل الألعاب",
    "Profile Collectibles": "مقتنيات الملف الشخصي",
    "Watch Video on Mobile": "مشاهدة فيديو (جوال)",
    "Watch Video": "مشاهدة فيديو",
    "Achievement in Activity": "إنجاز في نشاط",
    "Achievement in Game": "إنجاز في لعبة",
    "Play Activity": "لعب نشاط",
    "Play on Desktop V2": "لعب على الكمبيوتر (V2)",
    "Play on Desktop": "لعب على الكمبيوتر",
    "Stream on Desktop": "بث على الكمبيوتر",
    "Play on PlayStation": "لعب على بلايستيشن",
    "Play on Xbox": "لعب على إكس بوكس",
    "Quest Notifications": "إشعارات المهمات",
    "Configure Quest completed and new Quest detected notifications and alerts.": "تخصيص الإشعارات والتنبيهات عند توفر مهمات جديدة أو اكتمالها.",
    "Quest Completed": "اكتمال المهمة",
    "Show a notification when a Quest is completed:": "إظهار إشعار عند اكتمال المهمة:",
    "Play a sound when a Quest is completed:": "تشغيل صوت عند اكتمال المهمة:",
    "New Quests Detected": "اكتشاف مهمات جديدة",
    "Show a notification when new Quests are detected:": "إظهار إشعار عند اكتشاف مهمات جديدة:",
    "Play a sound when new Quests are detected:": "تشغيل صوت عند توفر مهمات جديدة:",
    "Show a notification when new excluded Quests are detected:": "إشعار عند توفر مهمات مستبعدة جديدة:",
    "Play a sound when new excluded Quests are detected:": "تشغيل صوت عند توفر مهمات مستبعدة جديدة:",
    "Quest Fetch Interval:": "الفترة الزمنية لتحديث المهمات:",
    "Volume:": "مستوى الصوت:",
    "Quest Tiles": "بطاقات المهمات",
    "Highlight Quests with optional theme colors for visibility.": "تمييز بطاقات المهمات بألوان اختيارية للمظهر.",
    "Tile Behavior": "مظهر البطاقة",
    "Gradient Style:": "نمط التدرج:",
    "Asset Preload:": "تحميل الوسائط مسبقاً:",
    "Intense Restyle Gradient": "تدرج لوني قوي",
    "Default Restyle Gradient": "تدرج لوني افتراضي",
    "Subtle Black Gradient": "تدرج أسود خفيف",
    "No Gradient": "بدون تدرج",
    "Load All Quest Assets On Page Load": "تحميل كافة صور المهمات فور فتح الصفحة",
    "Load Quest Assets During Page Scroll": "تحميل صور المهمات أثناء التمرير فقط",
    "Tile Colors": "ألوان البطاقات",
    "Unclaimed:": "المتاحة:",
    "Claimed:": "المستلمة:",
    "Ignored:": "المتجاهلة:",
    "Expired:": "المنتهية:",
    "Claimed": "المستلمة",
    "Ignored": "المتجاهلة",
    "Expired": "المنتهية",
    "Hidden": "المخفية",
    "Reorder Quests": "إعادة ترتيب المهمات",
    "Sort Quests by their status when the Questify sort option is selected on the Quests page. Hidden statuses are filtered out with any sort option.": "ترتيب المهمات حسب حالتها عند اختيار تصنيف Questify داخل صفحة المهمات. تختفي الحالات المعطلة من أي خيار ترتيب.",
    "Status Order": "ترتيب الحالات",
    "First": "أولاً",
    "Second": "ثانياً",
    "Third": "ثالثاً",
    "Fourth": "رابعاً",
    "Subsorts": "الترتيب الفرعي",
    "Unclaimed Subsort:": "ترتيب المتاحة:",
    "Claimed Subsort:": "ترتيب المستلمة:",
    "Ignored Subsort:": "ترتيب المتجاهلة:",
    "Expired Subsort:": "ترتيب المنتهية:",
    "Expiring (Soonest)": "الأقرب انتهاءً",
    "Claimed (Most Recent)": "المستلمة حديثاً",
    "Added (Newest)": "المضافة حديثاً",
    "Expired (Most Recent)": "المنتهية حديثاً",
    "Quest Page Memory": "ذاكرة صفحة المهمات",
    "Remember the selected Quest page sort:": "تذكر خيار الترتيب المختار في صفحة المهمات:",
    "Remember the selected Quest page filters:": "تذكر الفلاتر المختارة في صفحة المهمات:",
    "Search Questify Settings...": "بحث في إعدادات المهمات...",
    "Quest Completed!": "اكتملت المهمة!",
    "Mark All Ignored": "تحديد الكل كمتجاهل",
    "Reset Ignored List": "إعادة ضبط قائمة المتجاهل",
    "Clear Quest Queue": "مسح قائمة انتظار المهمات",
    "Fetch Quests": "تحديث وجلب المهمات",
    "Enroll in Quest": "التسجيل في المهمة",
    "Stop Auto-Complete": "إيقاف الإكمال التلقائي",
    "Start Auto-Complete": "بدء الإكمال التلقائي",
    "Mark as Ignored": "تحديد كمتجاهل",
    "Unmark as Ignored": "إلغاء التحديد كمتجاهل",
    "Copy Quest ID": "نسخ معرف المهمة",
    "Terms of Service": "شروط الخدمة",
    "Discord is known to punish users of scripts or plugins that modify the completion of Quests.": "من المعروف أن ديسكورد يعاقب مستخدمي الأدوات التي تعدل طريقة إكمال المهمات.",
    "The punishment consists of a temporary or permanent loss of access to Quests and their rewards.": "تتراوح العقوبة بين فقدان مؤقت أو دائم للوصول للمهمات ومكافآتها.",
    "The punishment also consists of an account standing violation which lasts 2 years per violation.": "كما تسجل العقوبة كمخالفة رسمية على حالة الحساب وتستمر لمدة سنتين.",
    "Due to the various methods Discord uses to track users, there's no way to realistically evade detection. If you proceed, understand that Discord likely will detect your use at some point.": "بسبب أساليب المراقبة المتعددة لدى ديسكورد، يصعب تجنب الرصد تماماً. المتابعة تكون على مسؤوليتك الخاصة.",
    "Use the following toggle to access potentially dangerous settings at your own risk.": "فعّل الخيار التالي للوصول إلى الإعدادات المتقدمة والحساسة على مسؤوليتك.",
    "Hide incomplete Quests with an unclaimed or ignored status when no auto-complete task is supported on this platform and enabled in the Quest types dropdown. Claimed, expired, and completed Quests are exempt. Use the Status Order Hidden options to hide those Quests.": "إخفاء المهمات غير المكتملة عندما لا تدعم المنصة مهمة إكمال تلقائي مفعلة. تستثنى المهمات المستلمة والمنتهية.",
    "Discord forces you to be tabbed into the client for Video Quests to play their video.": "يفرض ديسكورد البقاء داخل نافذة التطبيق لتشغيل فيديوهات المهام.",
    "This setting prevents the video from pausing and allows completion to progress as normal.": "يمنع هذا الإعداد إيقاف الفيديو مؤقتاً ويتيح استمرار التقدم بشكل طبيعي.",
    "This setting applies only to manually completing Video Quests.": "ينطبق هذا الإعداد فقط على الإكمال اليدوي لمهام الفيديو.",
    "By default, attempting to auto-complete multiple Quests will queue them to be completed in order.": "افتراضياً، يتم إدراج المهمات في قائمة انتظار لتُنجز بالتتابع.",
    "This setting will alternatively allow all auto-complete Quests to run at the same time.": "يتيح هذا الخيار تشغيل كافة مهام الإكمال التلقائي في وقت واحد.",
    "This setting will only apply to auto-completing Quests and relies on the auto-complete setting below.": "ينطبق هذا الخيار فقط على الإكمال التلقائي.",
    "This setting will automatically resume any interrupted auto-completions caused by reloads or restarts, including requeuing Quests which had yet to start auto-completing but had been queued.": "يستأنف هذا الخيار تلقائياً أي عمليات إكمال منقطعة بسبب إعادة تشغيل ديسكورد."
};
/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { DiscordLocalePack } from "@plugins/arabicUi/types";
import { runtimeHashMessageKey } from "@utils/intlHash";

// Single-word chrome labels only (buttons/tabs). Shared with scripts/arabicUi/mergeEnText.mjs.
import chromeAllowlist from "./chromeAllowlist.json";

const plainToArabic = new Map<string, string>();
const hashToArabic = new Map<string, string>();
const englishToArabic = new Map<string, string>();
const englishLowerToArabic = new Map<string, string>();

const ALLOW_CHROME_SINGLE = new Set(chromeAllowlist as string[]);

export function clearDiscordLocales() {
    plainToArabic.clear();
    hashToArabic.clear();
    englishToArabic.clear();
    englishLowerToArabic.clear();
}

export function registerDiscordPack(pack: DiscordLocalePack) {
    for (const [plainKey, arabic] of Object.entries(pack)) {
        if (!plainKey || !arabic) continue;
        plainToArabic.set(plainKey, arabic);
        hashToArabic.set(runtimeHashMessageKey(plainKey), arabic);
    }
}

function isSafeEnglishKey(english: string): boolean {
    const n = english.trim();
    if (n.length < 2) return false;
    const words = n.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return true;
    // Single words: allowlist only (avoids role-name collisions)
    return ALLOW_CHROME_SINGLE.has(n);
}

export function registerEnglishPack(pack: DiscordLocalePack) {
    for (const [english, arabic] of Object.entries(pack)) {
        if (!english || !arabic) continue;
        if (!isSafeEnglishKey(english)) continue;
        const norm = normalizeEnglish(english);
        englishToArabic.set(norm, arabic);
        englishLowerToArabic.set(norm.toLowerCase(), arabic);
    }
}

export function getArabicByPlainKey(plainKey: string): string | undefined {
    return plainToArabic.get(plainKey);
}

export function getArabicByHash(hash: string): string | undefined {
    return hashToArabic.get(hash);
}

export function normalizeEnglish(s: string) {
    return s
        .replace(/\u200b|\u200c|\u200d|\u200e|\u200f|\u202a|\u202b|\u202c|\u202d|\u202e|\u2066|\u2067|\u2068|\u2069/g, "")
        .replace(/\u00a0/g, " ")
        .replace(/\u2026/g, "...")
        .replace(/[\s\r\n\t\f\v]+/g, " ")
        .replace(/[–—]/g, "-")
        .replace(/[‘’´`']/g, "'")
        .replace(/[“”"«»]/g, '"')
        .trim();
}

/** Discord often appends a "Learn more" / brand link; strip EN or already-translated AR tails. */
const LEARN_MORE_TRAIL =
    /(?:\s*[.\u2026]?\s*)?(?:Learn\s+More|Learn\s+more(?:\s+about\s+end-to-end\s+encryption)?|Getting\s+Started\s+guide|تعرف على المزيد(?:\s+حول\s+التشفير\s+من\s+طرف\s+إلى\s+طرف)?|تعرّف على المزيد|اعرف أكثر|اعرف المزيد|دليل البدء)\.?\s*$/iu;

const TROUBLESHOOT_TRAIL =
    /\s*See\s+our\s+(?:Troubleshooting\s+Guide|دليل\s+استكشاف\s+الأخطاء)\s+for\s+more\s+assistance\.?\s*$/iu;

const IGDB_TRAIL = /\s*IGDB\.?\s*$/i;
const NITRO_TRAIL = /\s*Nitro\.?\s*$/i;

function stripTrailingLearnMore(s: string): { body: string; hadLearnMore: boolean; e2ee: boolean } {
    const e2ee = /end-to-end\s+encryption|التشفير\s+من\s+طرف\s+إلى\s+طرف/i.test(s);
    const m = LEARN_MORE_TRAIL.exec(s);
    if (!m || m.index == null || m.index === 0)
        return { body: s, hadLearnMore: false, e2ee: false };
    return { body: s.slice(0, m.index).trimEnd(), hadLearnMore: true, e2ee };
}

function stripTrailingTroubleshoot(s: string): { body: string; had: boolean } {
    const m = TROUBLESHOOT_TRAIL.exec(s);
    if (!m || m.index == null || m.index === 0)
        return { body: s, had: false };
    return { body: s.slice(0, m.index).trimEnd(), had: true };
}

function stripTrailingIgdb(s: string): { body: string; hadIgdb: boolean } {
    const m = IGDB_TRAIL.exec(s);
    if (!m || m.index == null || m.index === 0)
        return { body: s, hadIgdb: false };
    return { body: s.slice(0, m.index).trimEnd(), hadIgdb: true };
}

function stripTrailingNitro(s: string): { body: string; hadNitro: boolean } {
    const m = NITRO_TRAIL.exec(s);
    if (!m || m.index == null || m.index === 0)
        return { body: s, hadNitro: false };
    return { body: s.slice(0, m.index).trimEnd(), hadNitro: true };
}

function lookupEnglishExact(s: string): string | undefined {
    const direct = englishToArabic.get(s) ?? englishLowerToArabic.get(s.toLowerCase());
    if (direct) return direct;
    const norm = normalizeEnglish(s);
    if (!norm) return;
    let hit = englishToArabic.get(norm) ?? englishLowerToArabic.get(norm.toLowerCase());
    if (hit) return hit;

    const bulletMatch = /^[.\u2022\u2023\u25E6\u2043\u2219]\s*(.+)$/.exec(norm);
    if (bulletMatch) {
        const body = bulletMatch[1].trim();
        hit = englishToArabic.get(body) ?? englishLowerToArabic.get(body.toLowerCase());
        if (hit) return `. ${hit}`;
    }

    return undefined;
}

export function protectBidi(arabic: string): string {
    return arabic.replace(
        /\b(Cloud|iOS|Android|Windows|Linux|macOS|QR|API|CSS|FPS|GitHub|GitLab|Codeberg|Imgur|VALORANT|Shiki|IGDB)\b/g,
        "\u2066$1\u2069"
    );
}
function translateWeekday(day: string): string {
    const d = day.trim().toLowerCase();
    const map: Record<string, string> = {
        monday: "الاثنين",
        tuesday: "الثلاثاء",
        wednesday: "الأربعاء",
        thursday: "الخميس",
        friday: "الجمعة",
        saturday: "السبت",
        sunday: "الأحد",
    };
    return map[d] ?? day.trim();
}

function translateOrdinalWeekday(phrase: string): string {
    // "third Tuesday" / "1st Monday"
    const m = /^(first|second|third|fourth|fifth|\d+(?:st|nd|rd|th))\s+(.+)$/i.exec(phrase.trim());
    if (!m) return phrase.trim();
    const ordMap: Record<string, string> = {
        first: "الأول",
        second: "الثاني",
        third: "الثالث",
        fourth: "الرابع",
        fifth: "الخامس",
        "1st": "الأول",
        "2nd": "الثاني",
        "3rd": "الثالث",
        "4th": "الرابع",
        "5th": "الخامس",
    };
    const ord = ordMap[m[1].toLowerCase()] ?? m[1];
    return `${ord} ${translateWeekday(m[2])}`;
}

function applyCountPatterns(english: string): string | undefined {
    const norm = normalizeEnglish(english);

    let m = /^(\d+)\s+Mutual Friends$/i.exec(norm);
    if (m) return `${m[1]} أصدقاء مشتركين`;

    m = /^1\s+Mutual Friend$/i.exec(norm);
    if (m) return "صديق مشترك واحد";

    m = /^(\d+)\s+Mutual Friend$/i.exec(norm);
    if (m) return Number(m[1]) === 1 ? "صديق مشترك واحد" : `${m[1]} أصدقاء مشتركين`;

    m = /^Ignored Users\s*\((\d+)\)$/i.exec(norm);
    if (m) return `المستخدمون المتجاهَلون (${m[1]})`;

    m = /^Level\s+(\d+)$/i.exec(norm);
    if (m) return `المستوى ${m[1]}`;

    m = /^(\d+)\s*\(Level\s+(\d+)\)$/i.exec(norm);
    if (m) return `${m[1]} (المستوى ${m[2]})`;

    // Search filter syntax hints (keep Discord operators in English)
    m = /^from:\s*(.+)$/i.exec(norm);
    if (m) {
        const who = m[1].toLowerCase() === "user" ? "مستخدم" : m[1];
        return `from: ${who}`;
    }

    m = /^in:\s*(.+)$/i.exec(norm);
    if (m) {
        const ch = /^(channel|القناة)$/i.test(m[1]) ? "قناة" : m[1];
        return `in: ${ch}`;
    }

    m = /^mentions:\s*(.+)$/i.exec(norm);
    if (m) {
        const who = m[1].toLowerCase() === "user" ? "مستخدم" : m[1];
        return `mentions: ${who}`;
    }

    m = /^has:\s*link,\s*embed,?\s*or\s*file$/i.exec(norm);
    if (m) return "has: رابط أو إيمبد أو ملف";

    m = /^You have (\d+) unused Boosts?$/i.exec(norm);
    if (m) {
        const n = Number(m[1]);
        return n === 1 ? "عندك بوست واحد غير مستخدم" : `عندك ${n} بوستات غير مستخدمة`;
    }

    m = /^\/\s*month$/i.exec(norm);
    if (m) return "/ شهر";

    m = /^Listen to (.+) with Wumpus\.?$/i.exec(norm);
    if (m) return `استمع إلى \u2066${m[1]}\u2069 مع ومبس`;

    m = /^This is the beginning of your direct message history with (.+)\.?$/i.exec(norm);
    if (m) return `هذه بداية سجل رسائلك الخاصة مع \u2066${m[1]}\u2069.`;

    m = /^Clear Filters\s*\((\d+)\)$/i.exec(norm);
    if (m) return `مسح الفلاتر (${m[1]})`;

    m = /^Show off your (.+) stats\.?$/i.exec(norm);
    if (m) return `اعرض إحصائياتك في \u2066${m[1]}\u2069`;

    // Connected-accounts unlink modal — platform name varies (GitHub, Twitch, …)
    m = /^Unlink (?!Account$|from\b)(.+)$/i.exec(norm);
    if (m) {
        const platform = m[1].trim();
        if (platform && !/\s+Account$/i.test(platform))
            return `فك ربط \u2066${platform}\u2069`;
    }

    m = /^You will no longer be able to access features of the ["“]?(.+?)["”]? connection on your Discord account\.?\s*You will also be removed from servers that require it\.?$/i.exec(norm);
    if (m)
        return `لن تقدر بعد الحين تستخدم ميزات اتصال "\u2066${m[1]}\u2069" على حساب دسكورد. وكمان بتنشال من السيرفرات اللي تطلبه.`;

    // Member context menu: Timeout/Kick/Ban + username
    m = /^(Timeout|Kick|Ban)\s+(.+)$/i.exec(norm);
    if (m) {
        const action = m[1].toLowerCase();
        const who = m[2].trim();
        // Skip fixed chrome already covered by exact keys (Ban Member, Kick User, …)
        if (who && !/^(Member|Members|User|Users|Confirmation|Duration|Reason|List)$/i.test(who)) {
            const ar = action === "timeout" ? "تايم اوت" : action === "kick" ? "كيك" : "باند";
            return `${ar} \u2066${who}\u2069`;
        }
    }

    m = /^(\d+)\s+Emoji Slots$/i.exec(norm);
    if (m) return `${m[1]} خانة ايموجي`;

    m = /^(\d+)\s+Soundboard Slots$/i.exec(norm);
    if (m) return `${m[1]} خانة لوحة أصوات`;

    // Keybind / connection label: "GitHub (omaralhami)" — keep username as-is
    m = /^(GitHub|Twitch|Spotify|Steam|Xbox|PlayStation|Reddit|Facebook|Twitter|TikTok|YouTube|Battle\.net|Epic Games|Riot Games)\s+\((.+)\)$/i.exec(norm);
    if (m) {
        const platformHit = lookupEnglishExact(m[1]) ?? m[1];
        return `${platformHit} (\u2066${m[2]}\u2069)`;
    }

    m = /^Phone number ending in (\*{0,4})(\d+)(?:\s*(?:Show|إظهار))?$/iu.exec(norm);
    if (m) {
        const show = /\b(Show|إظهار)\s*$/iu.test(norm) ? " إظهار" : "";
        return `رقم هاتف ينتهي بـ \u2066${m[1]}${m[2]}\u2069${show}`;
    }

    m = /^We'll need to verify your old email address,\s*(.+?),?\s*in order to change it\.?$/i.exec(norm);
    if (m) return `نحتاج نتحقق من بريدك القديم، \u2066${m[1].replace(/,$/, "")}\u2069، عشان نغيّره.`;

    m = /^Discord has detected a new audio (output|input) device named (.+?)!? Do you want to switch to it\?$/i.exec(norm);
    if (m) {
        const type = m[1].toLowerCase() === "input" ? "إدخال" : "إخراج";
        return `دسكورد اكتشف جهاز ${type} صوت جديد باسم \u2066${m[2]}\u2069! تبي تحول عليه؟`;
    }

    m = /^Don['’]t suggest (.+?) again$/i.exec(norm);
    if (m) return `لا تقترح \u2066${m[1]}\u2069 مرة ثانية`;

    m = /^Ask to Stream (.+)$/i.exec(norm);
    if (m) return `طلب ستريم \u2066${m[1]}\u2069`;

    m = /^AKA\s+(.+)$/i.exec(norm);
    if (m) return `المعروف بـ \u2066${m[1]}\u2069`;

    m = /^Originally known as\s+(.+)$/i.exec(norm);
    if (m) return `المعروف في الأصل باسم \u2066${m[1]}\u2069`;

    m = /^They['’]re shy(?:\s*[\u{1F300}-\u{1F9FF}\s]*)\.?\.?\s*(?:say hey to break the ice)?$/iu.exec(norm);
    if (m) return "خجولين 👈 👉... سلم عليهم لكسر الجمود";

    m = /^(?:Remove|إزالة)\s+(Icon|Avatar|Banner|Image|Photo)$/i.exec(norm);
    if (m) {
        const typeMap: Record<string, string> = {
            icon: "الأيقونة",
            avatar: "الصورة الشخصية",
            banner: "البانر",
            image: "الصورة",
            photo: "الصورة",
        };
        const translated = typeMap[m[1].toLowerCase()] ?? m[1];
        return `إزالة ${translated}`;
    }

    m = /^Watch\s+(.+?)['’]s\s+(Stream|Screen)$/i.exec(norm);
    if (m) {
        const type = m[2].toLowerCase() === "screen" ? "شاشة" : "بث";
        return `شاهد ${type} \u2066${m[1]}\u2069`;
    }

    m = /^(.+?)\s*[\u2013\u2014—–-]\s*(\d+)$/i.exec(norm);
    if (m) {
        const header = m[1].trim();
        const count = m[2];
        const translated = lookupEnglishExact(header);
        if (translated) return `${translated} - ${count}`;
        return `\u2066${header}\u2069 - ${count}`;
    }

    m = /^in\s+(\d+)\s*(m|h|d|s)$/i.exec(norm);
    if (m) {
        const num = m[1];
        const unit = m[2].toLowerCase();
        const unitAr = unit === "m" ? "دقيقة" : unit === "h" ? (num === "1" ? "ساعة" : "ساعات") : unit === "d" ? (num === "1" ? "يوم" : "أيام") : "ثانية";
        return `خلال ${num} ${unitAr}`;
    }

    m = /^(Tomorrow|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+at\s+(.+)$/i.exec(norm);
    if (m) {
        const daysMap: Record<string, string> = {
            tomorrow: "غداً",
            monday: "الاثنين",
            tuesday: "الثلاثاء",
            wednesday: "الأربعاء",
            thursday: "الخميس",
            friday: "الجمعة",
            saturday: "السبت",
            sunday: "الأحد",
        };
        const dayAr = daysMap[m[1].toLowerCase()] ?? m[1];
        return `${dayAr} الساعة \u2066${m[2]}\u2069`;
    }

    m = /^Subscriber since\s+(.+)$/i.exec(norm);
    if (m) return `مشترك منذ \u2066${m[1]}\u2069`;

    m = /^This\s+channel\s+doesn['’]t\s+have\s+any\s+pinned\s+messages(?:\.\.\.|\u2026)?\s*yet\.?$/i.exec(norm);
    if (m) return "لا تحتوي هذه القناة على أي رسائل مثبتة... بعد.";

    m = /^Users\s+with\s+the\s+['’]?Pin\s+Messages['’]?\s+permission\s+can\s+pin\s+a\s+message\s+from\s+its\s+context\s+menu\.?$/i.exec(norm);
    if (m) return "المستخدمون الذين لديهم صلاحية 'تثبيت الرسائل' يمكنهم تثبيت رسالة من قائمة الخيارات.";

    m = /^You\s+don['’]t\s+have\s+any\s+servers\s+in\s+common\.?$/i.exec(norm);
    if (m) return "ما عندكم أي سيرفرات مشتركة";

    m = /^Ask\s+them\s+to\s+invite\s+you\s+to\s+their\s+favorite\s+server\s+so\s+you\s+can\s+bond\.?$/i.exec(norm);
    if (m) return "اطلب منهم يدعونك لسيرفرهم المفضل عشان تتعرفون على بعض";

    m = /^From\s+(.+?)['’]s\s+Wishlist(?:\s+and\s+Shop)?$/i.exec(norm);
    if (m) {
        const hasShop = /and\s+Shop/i.test(norm) ? " ومتجر" : "";
        return `من قائمة رغبات${hasShop} \u2066${m[1]}\u2069`;
    }

    m = /^Reward:\s*([\d,]+)\s+Orbs?$/i.exec(norm);
    if (m) return `المكافأة: \u2066${m[1]}\u2069 أورب`;

    m = /^Your\s+Orbs\s+balance\s+is\s+now\s+([\d,]+)\.?\s*(.*)$/i.exec(norm);
    if (m) {
        const rest = m[2] ? ` ${m[2]}` : "";
        return `رصيدك من الأوربز أصبح الآن \u2066${m[1]}\u2069.${rest}`;
    }

    m = /^(.+?)\s+wants\s+to\s+access\s+your\s+Discord\s+account\.?$/i.exec(norm);
    if (m) return `\u2066${m[1]}\u2069 يريد الوصول إلى حسابك على ديسكورد`;

    m = /^This\s+will\s+allow\s+the\s+developer\s+of\s+(.+?)\s+to:?$/i.exec(norm);
    if (m) return `سيسمح هذا لمطوّر \u2066${m[1]}\u2069 بـ:`;

    m = /^This\s+requires\s+you\s+to\s+have\s+(.+?)\s+permission\s+in\s+the\s+server\.?$/i.exec(norm);
    if (m) return `هذا يتطلب أن يكون لديك صلاحية \u2066${m[1]}\u2069 في السيرفر.`;

    m = /^Received\s*[-–]\s*([\d,]+)$/i.exec(norm);
    if (m) return `المُستلَمة - \u2066${m[1]}\u2069`;

    m = /^(.+?)\s+is\s+not\s+accepting\s+friend\s+requests?\.\s*They['']ll\s+have\s+to\s+add\s+you\s+to\s+become\s+friends?\.?$/i.exec(norm);
    if (m) return `\u2066${m[1]}\u2069 لا يقبل طلبات الصداقة. عليه إضافتك ليصبح صديقك.`;

    m = /^Success!\s+Your\s+friend\s+request\s+to\s+(.+?)\s+was\s+sent\.?$/i.exec(norm);
    if (m) return `تم بنجاح! تم إرسال طلب صداقتك إلى \u2066${m[1]}\u2069.`;

    m = /^(?:Server\s+)?boosting\s+(?:(.+?)\s+)?since\s+(.+)$/i.exec(norm);
    if (m) {
        const server = m[1] ? ` \u2066${m[1]}\u2069` : "";
        return `سيرفر بوست${server} منذ \u2066${m[2]}\u2069`;
    }

    m = /^Member\s+since\s+(.+)$/i.exec(norm);
    if (m) return `عضو منذ \u2066${m[1]}\u2069`;

    m = /^Joined\s+(.+)$/i.exec(norm);
    if (m) return `انضم في \u2066${m[1]}\u2069`;

    m = /^Level\s+(\d+)$/i.exec(norm);
    if (m) return `المستوى ${m[1]}`;

    m = /^(?:Search\s+|بحث\s+)?(?:Bans|حظر|المحظورين)?\s*by\s+User\s+(?:Id|ID)\s+or\s+Username$/i.exec(norm);
    if (m) return "بحث عن المحظورين حسب أيدي أو اسم المستخدم";

    m = /^Looks\s+like\s+nobody\s+reviewed\s+this\s+(.+?)\s+yet\.\s*You\s+could\s+be\s+the\s+first!?$/i.exec(norm);
    if (m) return `يبدو أنه لا يوجد أحد قام بمراجعة هذا الـ \u2066${m[1]}\u2069 بعد. يمكنك أن تكون الأول!`;

    m = /^You\s+haven['’]t\s+banned\s+anybody(?:\.\.\.|\u2026)?\s*but\s+if\s+and\s+when\s+you\s+must,?\s*do\s+not\s+hesitate!?$/i.exec(norm);
    if (m) return "لم تحظر أحداً... ولكن إذا تطلب الأمر، فلا تتردد!";

    m = /^You\s+must\s+activate\s+Level\s+(\d+)\s+first\.?$/i.exec(norm);
    if (m) return `لازم تفعّل المستوى ${m[1]} أول.`;

    m = /^Ignore\s+(.+)$/i.exec(norm);
    if (m) return `تجاهل \u2066${m[1]}\u2069`;

    m = /^Block\s+(.+)$/i.exec(norm);
    if (m) return `حظر \u2066${m[1]}\u2069`;

    m = /^Gifting\s+(?:Level\s+\d+:\s+)?(Patron|Champion|Luminary|Icon|Hero|Legend)$/i.exec(norm);
    if (m) {
        const giftMap: Record<string, string> = {
            patron: "مستوى الإهداء: كفيل",
            champion: "مستوى الإهداء: بطل",
            luminary: "مستوى الإهداء: متألق",
            icon: "مستوى الإهداء: أيقونة",
            hero: "مستوى الإهداء: بطل خارق",
            legend: "مستوى الإهداء: أسطورة",
        };
        return giftMap[m[1].toLowerCase()] ?? `مستوى الإهداء: ${m[1]}`;
    }

    // Voice channel user limit description (handles partial AR DOM text)
    m = /^(?:يحدد عدد المستخدمين الذين يمكنهم الاتصال بهذه القناة الصوتية\.\s*المستخدمون الذين لديهم\s*(?:إذن\s*)?|Defines the maximum number of users that can connect to this voice channel\.\s*Users with the\s+)(.+?)\s+permission ignore this limit and can move other users into the channel\.?$/i.exec(norm);
    if (m) {
        return `يحدد الحد الأقصى لعدد المستخدمين الذين يمكنهم الاتصال بهذه القناة الصوتية. المستخدمون الذين يملكون صلاحية \u2066${m[1]}\u2069 يتجاهلون هذا الحد ويمكنهم نقل مستخدمين آخرين إلى القناة.`;
    }

    m = /^This person has contributed to (\d+) plugins?!?$/i.exec(norm);
    if (m) {
        const n = Number(m[1]);
        return n === 1 ? "هذا الشخص ساهم في بلوقن واحد!" : `هذا الشخص ساهم في ${n} بلوقنات!`;
    }

    m = /^contributed to (\d+) plugins?$/i.exec(norm);
    if (m) {
        const n = Number(m[1]);
        return n === 1 ? "ساهم في بلوقن واحد" : `ساهم في ${n} بلوقنات`;
    }

    m = /^(\d+)\s+Mutual Servers$/i.exec(norm);
    if (m) return `${m[1]} سيرفرات مشتركة`;

    m = /^(\d+)\s+accounts?$/i.exec(norm);
    if (m) return Number(m[1]) === 1 ? "حساب واحد" : `${m[1]} حسابات`;

    m = /^(\d+)\s+webhooks?$/i.exec(norm);
    if (m) return Number(m[1]) === 1 ? "ويب هوك واحد" : `${m[1]} ويب هوك`;

    m = /^(\d+)\s+channels?$/i.exec(norm);
    if (m) return Number(m[1]) === 1 ? "قناة واحدة" : `${m[1]} قنوات`;

    m = /^(\d+)\s+connected accounts?$/i.exec(norm);
    if (m) return Number(m[1]) === 1 ? "حساب متصل واحد" : `${m[1]} حسابات متصلة`;

    m = /^See\s+(\d+)\s+more$/i.exec(norm);
    if (m) return `شوف ${m[1]} زيادة`;

    m = /^(\d+)\s+devices?$/i.exec(norm);
    if (m) return Number(m[1]) === 1 ? "جهاز واحد" : `${m[1]} أجهزة`;

    m = /^Authorized on (\d{1,2}\/\d{1,2}\/\d{4})$/i.exec(norm);
    if (m) return `تم التصريح في ${m[1]}`;

    m = /^(\d+)\s+Seconds$/i.exec(norm);
    if (m) return `${m[1]} ثانية`;

    m = /^Online\s*-\s*(\d+)$/i.exec(norm);
    if (m) return `متصل - ${m[1]}`;

    m = /^Spam\s*-\s*(\d+)$/i.exec(norm);
    if (m) return `سبام - ${m[1]}`;

    m = /^Spam\s*\((\d+)\)$/i.exec(norm);
    if (m) return `سبام (${m[1]})`;

    m = /^Pending Requests\s*-\s*(\d+)$/i.exec(norm);
    if (m) return `الطلبات المعلقة - ${m[1]}`;

    m = /^Pending Requests\s*\((\d+)\)$/i.exec(norm);
    if (m) return `الطلبات المعلقة (${m[1]})`;

    m = /^All\s+friends\s*-\s*(\d+)$/i.exec(norm);
    if (m) return `جميع الأصدقاء - ${m[1]}`;

    m = /^Received\s*-\s*(\d+)$/i.exec(norm);
    if (m) return `الواردة - ${m[1]}`;

    m = /^You may be sharing activity from (\d+) games? you play, including (.+?)\. Restrict sharing on a game-by-game basis\.$/i.exec(norm);
    if (m) return `قد تكون تشارك نشاطك من ${m[1]} ألعاب تلعبها، بما في ذلك ${m[2]}. قم بتقييد المشاركة لكل لعبة على حدة.`;

    m = /^You may be sharing activity from (\d+) games? you play, including (.+?)\.?$/i.exec(norm);
    if (m) {
        const game = m[2];
        const num = Number(m[1]);
        return num === 1
            ? `قد تكون تشارك نشاطك من لعبة واحدة تلعبها، بما في ذلك ${game}.`
            : `قد تكون تشارك نشاطك من ${num} ألعاب تلعبها، بما في ذلك ${game}.`;
    }

    m = /^\.?\s*Restrict sharing on a game-by-game basis\.?$/i.exec(norm);
    if (m) return "قم بتقييد المشاركة لكل لعبة على حدة.";

    m = /^Pending,\s*(\d+)\s+new$/i.exec(norm);
    if (m) return `معلقة، ${m[1]} جديدة`;

    m = /^(\d+)\s+Persons?$/i.exec(norm);
    if (m) return Number(m[1]) === 1 ? "شخص واحد" : `${m[1]} أشخاص`;

    m = /^(\d+)\s+People$/i.exec(norm);
    if (m) return `${m[1]} أشخاص`;

    m = /^Member since (.+)$/i.exec(norm);
    if (m) return `عضو منذ ${m[1]}`;

    m = /^Logging in as (.+)$/i.exec(norm);
    if (m) return `تسجيل الدخول كـ ${m[1]}`;

    // Leave-server / remove-guild button: "Remove {serverName}" — keep name as-is
    m = /^Remove (.+)$/i.exec(norm);
    if (m) return `إزالة ${m[1]}`;

    // Invite modal: "Invite friends to {serverName}"
    m = /^Invite friends to (.+)$/i.exec(norm);
    if (m) return `دعوة أصدقاء إلى ${m[1]}`;

    // Server home: "Welcome to mar's server" / "Welcome to {name}'s server"
    m = /^Welcome to \{(\w+)\}['’]s server$/i.exec(norm);
    if (m) return `مرحباً بك في سيرفر {${m[1]}}`;

    m = /^Welcome to (.+?)['’]s server$/i.exec(norm);
    if (m) return `مرحباً بك في سيرفر ${m[1]}`;

    // "{user}'s profile is private…"
    m = /^(.+?)['’]s profile is private, so some info is hidden\. Add them as a friend to see more\.?$/i.exec(norm);
    if (m) return `ملف ${m[1]} خاص، فبعض المعلومات مخفية. أضفه كصديق عشان تشوف أكثر.`;

    // "{server}'s Reviews"
    m = /^(.+?)['’]s Reviews$/i.exec(norm);
    if (m) return `مراجعات ${m[1]}`;

    // Server home: "Welcome to {serverName}"
    m = /^Welcome to (.+)$/i.exec(norm);
    if (m) return `مرحباً بك في ${m[1]}`;

    m = /^Today at (.+)$/i.exec(norm);
    if (m)
        return `اليوم الساعة ${m[1]}`;

    m = /^Weekly on (.+)$/i.exec(norm);
    if (m)
        return `أسبوعيًا يوم ${translateWeekday(m[1])}`;

    m = /^Every other (.+)$/i.exec(norm);
    if (m)
        return `كل أسبوعين يوم ${translateWeekday(m[1])}`;

    m = /^Monthly on the (.+)$/i.exec(norm);
    if (m)
        return `شهريًا في ${translateOrdinalWeekday(m[1])}`;

    m = /^Annually on (.+)$/i.exec(norm);
    if (m)
        return `سنويًا في ${m[1]}`;

    m = /^Status for (.+)$/i.exec(norm);
    if (m)
        return `حالة ${m[1]}`;

    m = /^You have unsaved changes to the "(.+)" AutoMod rule\. Are you sure you want to stop editing without saving\?$/i.exec(norm);
    if (m)
        return `عندك تغييرات غير محفوظة على قاعدة الأوتومود "${m[1]}". متأكد تبي توقف التعديل بدون حفظ؟`;

    // "Recipients will land in {channelName}" when name is in the same text node
    m = /^Recipients will land in (.+)$/i.exec(norm);
    if (m) return `المدعوون سينتقلون إلى ${m[1]}`;

    m = /^Your invite link expires in (\d+) days?\.$/i.exec(norm);
    if (m) {
        const n = Number(m[1]);
        return n === 1 ? "رابط دعوتك ينتهي خلال يوم واحد." : `رابط دعوتك ينتهي خلال ${n} أيام.`;
    }

    m = /^(\d+)\s+days?$/i.exec(norm);
    if (m) {
        const n = Number(m[1]);
        return n === 1 ? "يوم واحد" : `${n} أيام`;
    }

    m = /^Well, it looks like Discord is not detecting any input from your mic\. Let's fix that! Error: (\d+)$/i.exec(norm);
    if (m)
        return `يبدو أن دسكورد ما يلتقط أي إدخال من المايك. خلنا نصلح هذا! خطأ: ${m[1]}`;

    m = /^Well, it looks like Discord is not detecting any input from your mic\. Let's fix that! Error: \{(\w+)\}$/i.exec(norm);
    if (m)
        return `يبدو أن دسكورد ما يلتقط أي إدخال من المايك. خلنا نصلح هذا! خطأ: {${m[1]}}`;

    m = /^\+(\d+)\s+Sticker Slots\s*\((\d+)\s+total\)$/i.exec(norm);
    if (m)
        return `+${m[1]} خانات ستيكر (${m[2]} إجمالي)`;

    m = /^members of (\d+)$/i.exec(norm);
    if (m)
        return `أعضاء من ${m[1]}`;

    m = /^Manage Members\s*\((\d+)\)$/i.exec(norm);
    if (m)
        return `إدارة الأعضاء (${m[1]})`;

    // Status line: "Discord System Helper • Running" / "… - Running"
    m = /^Discord System Helper\s*[•·\-–—]\s*Running$/i.exec(norm);
    if (m)
        return "مساعد نظام دسكورد • يعمل";

    // "{username} doesn't have any activity to share here"
    m = /^(.+?)\s+doesn't have any activity to share here$/i.exec(norm);
    if (m)
        return `${m[1]} ما عنده أي نشاط للمشاركة هنا`;

    m = /^Friends Since\s+(.+)$/i.exec(norm);
    if (m)
        return `أصدقاء منذ ${m[1]}`;

    m = /^You can add (\d+) more people\.?$/i.exec(norm);
    if (m)
        return `تقدر تضيف ${m[1]} أشخاص زيادة.`;

    m = /^Group DMs can have up to (\d+) members\.?$/i.exec(norm);
    if (m)
        return `الخاص الجماعي يقدر يوصل لـ ${m[1]} أعضاء.`;

    m = /^Permissions not synced with category:\s*(.*)$/i.exec(norm);
    if (m)
        return m[1]
            ? `الصلاحيات غير متزامنة مع الفئة: ${m[1]}`
            : "الصلاحيات غير متزامنة مع الفئة:";

    m = /^Created on (.+) by (.+)$/i.exec(norm);
    if (m)
        return `أُنشئ في ${m[1]} بواسطة ${m[2]}`;

    m = /^Are you sure you want to delete (.+) webhook\?$/i.exec(norm);
    if (m)
        return `هل أنت متأكد أنك تريد حذف ${m[1]} ويب هوك؟`;

    // Modal titles like "Delete Spidey Bot" / "Delete Rule" — exact keys win first
    m = /^Delete (.+)$/i.exec(norm);
    if (m && !/^(this|your|all|the)\b/i.test(m[1])) {
        const target = /^rule$/i.test(m[1]) ? "القاعدة" : m[1];
        return `حذف ${target}`;
    }

    m = /^Add up to (\d+) games$/i.exec(norm);
    if (m)
        return `أضف حتى ${m[1]} ألعاب`;

    m = /^You'll see your activity from the last (\d+) days here\.?$/i.exec(norm);
    if (m)
        return `بتشوف نشاطك من آخر ${m[1]} يوم هنا.`;

    m = /^Access your (\d+) most recent avatar uploads\.?$/i.exec(norm);
    if (m)
        return `وصول لآخر ${m[1]} صور رمزية رفعتها.`;

    m = /^Acquired (.+)$/i.exec(norm);
    if (m)
        return `اكتُسب ${m[1]}`;

    // Split rich-text: "{Move Members} permission ignore this limit…"
    // (permission name may already be Arabic from a sibling pass)
    m = /^(.+?)\s+permission ignore this limit and can move other users into the channel\.?$/i.exec(norm);
    if (m) {
        const perm = lookupEnglishExact(m[1]) ?? m[1];
        return `${perm} صلاحية تجاوز هذا الحد ويمكنهم نقل مستخدمين آخرين إلى القناة.`;
    }

    // "Search {query}" — exact keys like "Search Roles" win first
    m = /^Search (.+)$/i.exec(norm);
    if (m && !/^(for|by)\b/i.test(m[1]))
        return `بحث ${m[1]}`;

    m = /^(\d+)\s+(seconds?|minutes?|hours?|days?|weeks?|months?|years?)\s+ago$/i.exec(norm);
    if (m) {
        const n = Number(m[1]);
        const unit = m[2].toLowerCase();
        if (unit.startsWith("second"))
            return n === 1 ? "منذ ثانية" : `منذ ${n} ثوانٍ`;
        if (unit.startsWith("minute"))
            return n === 1 ? "منذ دقيقة" : `منذ ${n} دقائق`;
        if (unit.startsWith("hour"))
            return n === 1 ? "منذ ساعة" : `منذ ${n} ساعات`;
        if (unit.startsWith("day"))
            return n === 1 ? "منذ يوم" : `منذ ${n} أيام`;
        if (unit.startsWith("week"))
            return n === 1 ? "منذ أسبوع" : `منذ ${n} أسابيع`;
        if (unit.startsWith("month"))
            return n === 1 ? "منذ شهر" : `منذ ${n} أشهر`;
        if (unit.startsWith("year"))
            return n === 1 ? "منذ سنة" : `منذ ${n} سنوات`;
    }

    return;
}

/** When DOM/intl already translated a link mid-sentence (often with tatweel). */
function rebuildEnglishFromMixed(english: string): string | undefined {
    if (!/[\u0600-\u06FF]/.test(english) || !/[A-Za-z]{3,}/.test(english))
        return;
    let s = english.replace(/\u0640/g, "");
    s = s.replace(/أصدقاء\s+اللعبة/gu, "Game Friends");
    s = s.replace(/حسابك/gu, "your account");
    s = s.replace(/دليل\s+استكشاف\s+الأخطاء/gu, "Troubleshooting Guide");
    s = s.replace(/دليل\s+البدء\.?/gu, "Getting Started guide.");
    s = s.replace(/تعرف على المزيد حول التشفير من طرف إلى طرف\.?/gu, "Learn more about end-to-end encryption.");
    s = s.replace(/تعرف على المزيد\.?/gu, "Learn more.");
    s = s.replace(/تعرّف على المزيد\.?/gu, "Learn more.");
    s = s.replace(/نوصي بتعيين مستوى تحقق لسيرفر المجتمع\.?/gu, "We recommend setting a verification level for a Community Server.");
    s = s.replace(/الإشراف/gu, "Moderation");
    s = s.replace(/^بحث\s+/u, "Search ");
    s = s.replace(/^إزالة\s+/u, "Remove ");
    s = s.replace(/^تغيير\s+/u, "Change ");
    s = s.replace(/^شوف\s+/u, "See our ");
    if (/[\u0600-\u06FF]/.test(s))
        return;
    return normalizeEnglish(s);
}

/** Stubborn rich-text / ICU blurbs: match by English prefix, keep {placeholders}. */
function forceTranslateByPrefix(english: string): string | undefined {
    const norm = normalizeEnglish(english);
    if (!norm) return;
    const placeholders = [...english.matchAll(/\{(\w+)\}/g)].map(m => m[0]);
    const plain = normalizeEnglish(norm.replace(/\{(\w+)\}/g, " "));

    if (/^Discord needs to store and process some data in order to provide you the basic Discord service\b/i.test(plain)
        || /^Discord needs to store and process some data in order to provide you the basic Discord service\b/i.test(norm)) {
        const body =
            "دسكورد يحتاج يخزن ويعالج بعض البيانات عشان يقدم لك خدمة دسكورد الأساسية، مثل رسائلك، السيرفرات اللي أنت فيها ورسائلك الخاصة. باستخدامك لدسكورد، أنت تسمح له بتقديم هذه الخدمة الأساسية. تقدر توقف هذا عن طريق";
        if (placeholders.length >= 2)
            return `${body} ${placeholders[0]} أو ${placeholders[1]}`;
        if (placeholders.length === 1)
            return `${body} ${placeholders[0]}`;
        return body;
    }

    if (/^This is your brand new, shiny server\b/i.test(plain)
        || /^This is your brand new, shiny server\b/i.test(norm)) {
        const body = "هذا سيرفرك الجديد اللامع. هنا خطوات تساعدك تبدأ. للمزيد، شوف";
        // Discord often splits: first node is only the shiny-server sentence.
        // Don't paste the whole blurb there or siblings duplicate English/Arabic.
        const onlyOpener = !/\bHere are some steps\b/i.test(norm)
            && !/\bcheck out our\b/i.test(norm)
            && placeholders.length === 0;
        if (onlyOpener)
            return "هذا سيرفرك الجديد اللامع.";
        if (placeholders.length >= 1)
            return `${body} ${placeholders[0]}`;
        return `${body} دليل البدء.`;
    }

    // Sibling / remainder of the shiny-server onboarding blurb
    if (/^Here are some steps to help you get started\. For more, check out our\b/i.test(plain)
        || /^Here are some steps to help you get started\. For more, check out our\b/i.test(norm)) {
        const body = "هنا خطوات تساعدك تبدأ. للمزيد، شوف";
        if (placeholders.length >= 1)
            return `${body} ${placeholders[0]}`;
        if (/Getting\s+Started\s+guide/i.test(norm) || /دليل\s+البدء/u.test(english))
            return `${body} دليل البدء.`;
        return body;
    }

    // Already-Arabic opener + leftover English steps in one node
    if (/هذا\s+سيرفرك\s+الجديد\s+اللامع/u.test(english)
        && /Here are some steps to help you get started/i.test(english)) {
        return "هذا سيرفرك الجديد اللامع. هنا خطوات تساعدك تبدأ. للمزيد، شوف دليل البدء.";
    }

    // Trailing " guide." after a translated Getting Started link
    if (/^guide\.?$/i.test(plain) || /^guide\.?$/i.test(norm))
        return "\u200B";

    // Mixed AR/EN leftover: "شوف Getting Started guide."
    if (/شوف/u.test(english) && /Getting\s+Started\s+guide/i.test(english))
        return "شوف دليل البدء.";

    if (/^See our\s+Getting\s+Started\s+guide\.?$/i.test(plain)
        || /^See our\s+Getting\s+Started\s+guide\.?$/i.test(norm)
        || /^check out our\s+Getting\s+Started\s+guide\.?$/i.test(plain))
        return "شوف دليل البدء.";

    if (/^Choose a Soundboard sound to automatically play whenever you join a voice channel\b/i.test(plain)
        || /^Choose a Soundboard sound to automatically play whenever you join a voice channel\b/i.test(norm)) {
        const body =
            "اختر صوت من لوحة الأصوات يشتغل تلقائي لما تدخل قناة صوتية. كليك يمين على القناة الصوتية تدخل بدون صوت الدخول.";
        if (placeholders.length >= 1)
            return `${body} ${placeholders[0]}`;
        if (/learn\s+more|تعرف على المزيد|تعرّف على المزيد/i.test(english))
            return `${body} تعرف على المزيد.`;
        return body;
    }

    // Intentionally untranslated: date/price split across nodes → BiDi garbage in Arabic
    if (/^Your subscriptions? will automatically renew on\b/i.test(plain)
        || /^Your subscriptions? will automatically renew on\b/i.test(norm)
        || /^and you'?ll be charged\b/i.test(plain)
        || /اشتراكاتك\s+تتجدد/u.test(english)
        || /وبيتخصم/u.test(english)) {
        return;
    }

    if (/^Embed this HTML on your website to use Discord's beautiful pre-made widget\b/i.test(plain)
        || /^Embed this HTML on your website to use Discord's beautiful pre-made widget\b/i.test(norm)) {
        return "ضمّن هالـ HTML في موقعك عشان تستخدم أداة دسكورد الجاهزة. إذا عندك وصول لمستخدمي موقعك تقدر تضيف &username= ديناميكي لسلسلة الاستعلام.";
    }

    if (/^If a channel is selected then an invite link will be generated with the widget\b/i.test(plain)
        || /^If a channel is selected then an invite link will be generated with the widget\b/i.test(norm)) {
        return "إذا اخترت قناة، يتولد رابط دعوة مع الأداة، وإلا يظهر بس الأعضاء الاونلاين والقنوات الصوتية.";
    }

    if (/^Members of the server must meet the following criteria before they can send messages\b/i.test(plain)
        || /^Members of the server must meet the following criteria before they can send messages\b/i.test(norm)) {
        return "أعضاء السيرفر لازم يستوفون الشروط التالية قبل ما يرسلون رسائل في القنوات النصية أو يبدءون محادثة خاص. إذا عند العضو رول وما فيه إعداد انضمام مفعّل، هذا ما ينطبق. نوصي بتعيين مستوى تحقق لسيرفر المجتمع.";
    }

    if (/^Bans by default are by account and IP\b/i.test(plain)
        || /^Bans by default are by account and IP\b/i.test(norm)) {
        const body =
            "الباند افتراضيًا يكون بالحساب وIP. المستخدم يقدر يتجاوز باند الـ IP ببروكسي. تقدر تصعّب التجاوز كثير بتفعيل التحقق بالهاتف في";
        if (placeholders.length >= 1)
            return `${body} ${placeholders[0]}`;
        if (/moderation|الإشراف/i.test(english))
            return `${body} الإشراف.`;
        return body;
    }

    if (/^['’]?s profile is private, so some info is hidden\b/i.test(plain)
        || /profile is private, so some info is hidden\. Add them as a friend to see more/i.test(norm)) {
        if (placeholders.length >= 1)
            return `ملف ${placeholders[0]} خاص، فبعض المعلومات مخفية. أضفه كصديق عشان تشوف أكثر.`;
        return "ملفّه خاص، فبعض المعلومات مخفية. أضفه كصديق عشان تشوف أكثر.";
    }

    if (/^These are all the devices that are currently logged[- ]?in with your Discord account\b/i.test(plain)
        || /^These are all the devices that are currently logged[- ]?in with your Discord account\b/i.test(norm)) {
        return "هذي كل الأجهزة المسجّلة حاليًا بحسابك على دسكورد. سجّل خروج من أي جهاز ما تعرفه.";
    }

    // Search filter hints after partial AR chrome (Channel/Mentions)
    if (/^in:\s*(channel|القناة)$/iu.test(norm) || /^in:\s*(channel|القناة)$/iu.test(plain))
        return "in: قناة";
    if (/^(mentions|الإشارات):\s*user$/iu.test(norm) || /^(mentions|الإشارات):\s*user$/iu.test(plain))
        return "mentions: مستخدم";
    if (/^from:\s*user$/i.test(norm) || /^from:\s*user$/i.test(plain))
        return "from: مستخدم";

    if (/^Enter your Discord application ID to enable test mode\b/i.test(plain)
        || /^Enter your Discord application ID to enable test mode\b/i.test(norm)) {
        return "أدخل معرف تطبيق دسكورد عشان تفعّل وضع الاختبار له. التطبيق في وضع الاختبار يخليك تشوف الـ SKUs غير المنشورة وتتجاوز المشتريات المرتبطة عشان التطوير يصير أسهل.";
    }

    if (/^More information helps us fix the problem quickly\b/i.test(plain)
        || /^More information helps us fix the problem quickly\b/i.test(norm)) {
        return "كل ما زادت التفاصيل، نصلح المشكلة أسرع";
    }

    if (/^Spend Orbs on special exclusives or grab your favorites from the main Shop\b/i.test(plain)
        || /^Spend Orbs on special exclusives or grab your favorites from the main Shop\b/i.test(norm)
        || (/^Spend Orbs on special exclusives\b/i.test(english) && /اعرف أكثر|Learn more/i.test(english))) {
        return "اصرف الأوربز على حصريات خاصة أو خذ مفضلاتك من المتجر الرئيسي. اعرف أكثر.";
    }

    if (/^Grab a custom border that wraps around your profile\b/i.test(plain)
        || /^Grab a custom border that wraps around your profile\b/i.test(norm)) {
        return "خذ إطار مخصص يلف حول ملفك. ملفك يطلبه، يبيه.";
    }

    if (/^Link your account to show off your game stats\b/i.test(plain)
        || /^Link your account to show off your game stats\b/i.test(norm)
        || (/^Link your account\b/i.test(english) && /show off your game stats/i.test(english))) {
        return "اربط حسابك عشان تعرض إحصائيات ألعابك";
    }

    if (/^Add one game\. This Widget won't show up on your profile\b/i.test(plain)
        || /^Add one game\. This Widget won't show up on your profile\b/i.test(norm)) {
        return "أضف لعبة واحدة. هالودجت ما يطلع في ملفك لين تضيف لعبة.";
    }

    if (/^Add up to 20 games\. This Widget won't show up on your profile\b/i.test(plain)
        || /^Add up to 20 games\. This Widget won't show up on your profile\b/i.test(norm)) {
        return "أضف لحد 20 لعبة. هالودجت ما يطلع في ملفك لين تضيف لعبة واحدة على الأقل.";
    }

    if (/^Are you sure you want to remove this Widget\b/i.test(plain)
        || /^Are you sure you want to remove this Widget\b/i.test(norm)) {
        if (/All data from this Widget will be permanently deleted/i.test(norm))
            return "متأكد تبي تزيل هالودجت؟ كل بيانات هالودجت بتنحذف نهائيًا.";
        return "متأكد تبي تزيل هالودجت؟";
    }

    if (/^All data from this Widget will be permanently deleted\b/i.test(plain)
        || /^All data from this Widget will be permanently deleted\b/i.test(norm)) {
        return "كل بيانات هالودجت بتنحذف نهائيًا.";
    }

    if (/^Pro tip: You can hold down shift when clicking Remove\b/i.test(plain)
        || /^Pro tip: You can hold down shift when clicking Remove\b/i.test(norm)) {
        return "نصيحة: اضغط Shift مع إزالة عشان تتخطى هالتأكيد.";
    }

    if (/^Select where you want to share this in-game item\b/i.test(plain)
        || /^Select where you want to share this in-game item\b/i.test(norm)) {
        return "اختر وين تبي تشارك هالعنصر داخل اللعبة.";
    }

    if (/^You will no longer be able to access features of the\b/i.test(plain)
        || /^You will no longer be able to access features of the\b/i.test(norm)) {
        if (placeholders.length >= 1)
            return `لن تقدر بعد الحين تستخدم ميزات اتصال "${placeholders[0]}" على حساب دسكورد. وكمان بتنشال من السيرفرات اللي تطلبه.`;
        const quoted = /["“]([^"”]+)["”]/.exec(english)?.[1];
        if (quoted)
            return `لن تقدر بعد الحين تستخدم ميزات اتصال "\u2066${quoted}\u2069" على حساب دسكورد. وكمان بتنشال من السيرفرات اللي تطلبه.`;
        return "لن تقدر بعد الحين تستخدم ميزات اتصال هالمنصة على حساب دسكورد. وكمان بتنشال من السيرفرات اللي تطلبه.";
    }

    if (/^Unlink (?!Account$|from\b)/i.test(plain) || /^Unlink (?!Account$|from\b)/i.test(norm)) {
        if (placeholders.length >= 1)
            return `فك ربط ${placeholders[0]}`;
    }

    if (/^We'll need to verify your old email address\b/i.test(plain)
        || /^We'll need to verify your old email address\b/i.test(norm)) {
        if (placeholders.length >= 1)
            return `نحتاج نتحقق من بريدك القديم، ${placeholders[0]}، عشان نغيّره.`;
        return "نحتاج نتحقق من بريدك القديم، عشان نغيّره.";
    }

    if (/^These codes will allow you to enter your account if you lose your authenticator app\b/i.test(plain)
        || /^These codes will allow you to enter your account if you lose your authenticator app\b/i.test(norm)) {
        return "هالرموز تخليك تدخل حسابك إذا ضاع تطبيق المصادقة. احفظها مثل كلمة مرورك. لا تشاركها مع أحد، وخلّها في مكان آمن.";
    }

    return;
}

export function getArabicByEnglish(english: string): string | undefined {
    if (!english) return;
    const normQ = normalizeEnglish(english);
    if (QUESTIFY_LOOKUP[normQ]) return QUESTIFY_LOOKUP[normQ];

    // Keep English — subscription renewal date/price nodes reverse under RTL/BiDi
    if (/Your subscriptions? will automatically renew on/i.test(english)
        || /and you'?ll be charged/i.test(english)
        || /اشتراكاتك\s+تتجدد/u.test(english)
        || (/وبيتخصم/u.test(english) && /\$|USD|\d/.test(english))) {
        return;
    }

    // Mixed leftover from split Getting Started link
    if (/شوف/u.test(english) && /Getting\s+Started\s+guide/i.test(english))
        return protectBidi("شوف دليل البدء.");

    // Nuke leftover shiny-server English no matter where it sits (mixed DOM nodes, rich text).
    if (/Here are some steps to help you get started/i.test(english)) {
        const hasOpenerAr = /هذا\s+سيرفرك\s+الجديد\s+اللامع/u.test(english);
        const hasOpenerEn = /This is your brand new, shiny server/i.test(english);
        const placeholders = [...english.matchAll(/\{(\w+)\}/g)].map(m => m[0]);
        if (hasOpenerAr || hasOpenerEn) {
            if (placeholders.length >= 1)
                return protectBidi(`هذا سيرفرك الجديد اللامع. هنا خطوات تساعدك تبدأ. للمزيد، شوف ${placeholders[0]}`);
            return protectBidi("هذا سيرفرك الجديد اللامع. هنا خطوات تساعدك تبدأ. للمزيد، شوف دليل البدء.");
        }
        if (placeholders.length >= 1)
            return protectBidi(`هنا خطوات تساعدك تبدأ. للمزيد، شوف ${placeholders[0]}`);
        if (/Getting\s+Started\s+guide/i.test(english) || /دليل\s+البدء/u.test(english))
            return protectBidi("هنا خطوات تساعدك تبدأ. للمزيد، شوف دليل البدء.");
        return protectBidi("هنا خطوات تساعدك تبدأ. للمزيد، شوف");
    }

    if (/هذا\s+سيرفرك\s+الجديد\s+اللامع/u.test(english) && /[A-Za-z]{3,}/.test(english)) {
        // Arabic opener already present; drop any trailing English remnant
        if (/Getting\s+Started|Here are some|check out our/i.test(english))
            return protectBidi("هذا سيرفرك الجديد اللامع. هنا خطوات تساعدك تبدأ. للمزيد، شوف دليل البدء.");
    }

    const normEarly = normalizeEnglish(english);

    const hit = lookupEnglishExact(english) ?? lookupEnglishExact(normEarly);
    if (hit) return protectBidi(hit);

    const forced = forceTranslateByPrefix(english);
    if (forced) return protectBidi(forced);

    const rebuilt = rebuildEnglishFromMixed(english);
    if (rebuilt) {
        const rebuiltHit = lookupEnglishExact(rebuilt) ?? applyCountPatterns(rebuilt);
        if (rebuiltHit) return protectBidi(rebuiltHit);
    }

    // Intl rich-text: "….entrance sound. {link}" — keep placeholder for Discord to render the link
    const withLinkPh = /^(.+?)\s*\{(\w+)\}\s*$/.exec(normEarly);
    if (withLinkPh) {
        const bodyHit = lookupEnglishExact(withLinkPh[1])
            ?? applyCountPatterns(withLinkPh[1]);
        if (bodyHit)
            return protectBidi(`${bodyHit} {${withLinkPh[2]}}`);
    }

    // Body + "Learn more" / already-Arabic link label in the same string
    const stripped = stripTrailingLearnMore(english);
    if (stripped.hadLearnMore && stripped.body) {
        const bodyHit = lookupEnglishExact(stripped.body)
            ?? applyCountPatterns(normalizeEnglish(stripped.body));
        if (bodyHit) {
            const link = stripped.e2ee
                ? "تعرف على المزيد حول التشفير من طرف إلى طرف."
                : "تعرف على المزيد";
            return protectBidi(`${bodyHit} ${link}`);
        }
    }

    // Body + "See our Troubleshooting Guide…"
    const trouble = stripTrailingTroubleshoot(english);
    if (trouble.had && trouble.body) {
        const bodyHit = lookupEnglishExact(trouble.body)
            ?? lookupEnglishExact(`${trouble.body} See our Troubleshooting Guide for more assistance.`)
            ?? applyCountPatterns(normalizeEnglish(trouble.body));
        if (bodyHit) {
            if (/دليل استكشاف الأخطاء/u.test(bodyHit))
                return protectBidi(bodyHit);
            return protectBidi(`${bodyHit} شوف دليل استكشاف الأخطاء للمزيد من المساعدة.`);
        }
    }

    // Body + "Getting Started guide" link mashed in one node
    const gettingStarted = /^(.*?)\s+Getting\s+Started\s+guide\.?\s*$/i.exec(normalizeEnglish(english));
    if (gettingStarted?.[1]) {
        const bodyHit = lookupEnglishExact(gettingStarted[1])
            ?? lookupEnglishExact(`${gettingStarted[1]} Getting Started guide.`);
        if (bodyHit) {
            if (/دليل البدء\.?\s*$/u.test(bodyHit))
                return protectBidi(bodyHit);
            return protectBidi(`${bodyHit} دليل البدء.`);
        }
    }

    // "….provided by IGDB." when link text is mashed into the same node
    const igdb = stripTrailingIgdb(english);
    if (igdb.hadIgdb && igdb.body) {
        const bodyHit = lookupEnglishExact(igdb.body)
            ?? lookupEnglishExact(`${igdb.body} IGDB.`);
        if (bodyHit) {
            // Prefer map entry that already ends with IGDB; else append brand
            if (/IGDB\.?\s*$/i.test(bodyHit))
                return protectBidi(bodyHit);
            return protectBidi(`${bodyHit} IGDB.`);
        }
    }

    // "….with Nitro." when Nitro is a link label in the same node
    const nitro = stripTrailingNitro(english);
    if (nitro.hadNitro && nitro.body) {
        const bodyHit = lookupEnglishExact(nitro.body)
            ?? lookupEnglishExact(`${nitro.body} Nitro.`);
        if (bodyHit) {
            if (/نيترو\.?\s*$/u.test(bodyHit) || /Nitro\.?\s*$/i.test(bodyHit))
                return protectBidi(bodyHit);
            return protectBidi(`${bodyHit} نيترو.`);
        }
    }

    const norm = normEarly;
    if (!norm) return;

    const patterned = applyCountPatterns(norm);
    if (patterned) return protectBidi(patterned);
}

export function translateEnglishResult(value: unknown): unknown {
    if (typeof value === "string") {
        if (!value.length) return value;
        return getArabicByEnglish(value) ?? value;
    }

    // intl.format rich-text often returns an array of strings + nodes
    if (Array.isArray(value))
        return value.map(v => translateEnglishResult(v));

    return value;
}

export function getDiscordCoverage() {
    return {
        intlKeys: plainToArabic.size,
        englishPhrases: englishToArabic.size,
    };
}
