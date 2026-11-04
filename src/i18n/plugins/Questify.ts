export default {
    name: "Questify",
    description: "تحسين ميزات مهمات ديسكورد، تعطيل الإعلانات المزعجة، أو إخفاء المهمات بالكامل.",
    settings: {
        disableQuestsEverything: {
            name: "تعطيل نظام المهمات بالكامل",
            description: "إخفاء صفحة المهمات وجميع عناصرها من ديسكورد ومنع جلب بياناتها."
        },
        questButtonDisplay: {
            name: "زر المهمات في شريط السيرفرات",
            description: "التحكم في ظهور زر المهمات المخصص في الشريط الجانبي."
        },
        notifyOnQuestComplete: {
            name: "إشعار عند اكتمال المهمة",
            description: "إظهار إشعار فوري عند انتهاء أي مهمة بنجاح."
        },
        preventVideoQuestsPausing: {
            name: "منع إيقاف مهام الفيديو مؤقتاً",
            description: "استمرار تشغيل الفيديو حتى عند الانتقال لنافذة أو تطبيق آخر."
        },
        disableSponsoredBanner: {
            name: "إخفاء البانر الإعلاني الممول",
            description: "إخفاء البانر الإعلاني في أعلى صفحة المهمات."
        },
        disableFriendsListPromo: {
            name: "إخفاء إعلانات قائمة الأصدقاء",
            description: "إزالة خانات المهام الترويجية من قسم النشاط الحالي للأصدقاء."
        },
        disableMembersListPromo: {
            name: "إخفاء شارات المهام من قائمة الأعضاء",
            description: "إخفاء أيقونة المهمة الترويجية المجاورة لأسماء الأعضاء في السيرفرات."
        }
    }
};