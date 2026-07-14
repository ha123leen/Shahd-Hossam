# دعوة زفاف حسام و شهد | Hossam & Shahd Wedding Invitation

موقع دعوة زفاف سينمائي فاخر، ثنائي اللغة (عربي/إنجليزي)، بوضعين للألوان
(نهاري هادئ وليلي أزرق احتفالي متحرك) — HTML/CSS/JS خام بدون أي إطار عمل.

A cinematic, bilingual (Arabic/English) wedding invitation with a soft
day theme and an animated festive blue night theme — plain HTML/CSS/JS,
no frameworks, no build step.

## هيكل الملفات | File structure

```
ali-maha-invitation/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── audio/            ضع ملف wedding-music.mp3 هنا | put wedding-music.mp3 here
│   └── images/
│       └── victoria-hall.png   صورة القاعة الحقيقية | real venue photo (already included)
└── README.md
```

## المزايا | Features

- **زر تبديل اللغة (EN/ع)** أعلى يمين/يسار الشاشة — يبدّل كل نصوص الموقع فورًا بدون إعادة تحميل.
  **Language toggle** button — instantly swaps all copy without reloading.
- **زر تبديل الوضع (نهاري/ليلي)** — النهاري بألوان رقيقة عاجية وذهبية، والليلي أزرق احتفالي مع نجوم متلألئة متحركة.
  **Day/Night toggle** — soft ivory & gold by day, animated twinkling festive blue by night.
- خلفية متحركة شبيهة بالفيديو (جسيمات ذهبية/زرقاء عائمة) خلف كل قسم.
  Video-like animated ambient background (floating golden/blue particles) behind every section.
- صورة القاعة الحقيقية (فيكتوريا هول) في الخلفية الرئيسية وفي المعرض.
  The real Victoria Hall photo is used in the hero background and gallery.
- عدّاد تنازلي حي حتى 24 يوليو 2026 الساعة 8 مساءً.
  Live countdown to 24 July 2026, 8:00 PM.
- **سجل الضيوف**: نموذج لكتابة اسم ورسالة تهنئة، تظهر فورًا في "حائط الرسائل"، ومتوافق تلقائيًا مع Netlify Forms عند النشر على Netlify.
  **Guest Book**: name + message form, appears instantly on the live wall, and is Netlify Forms–ready out of the box.
- ألعاب نارية ذهبية/زرقاء عند الوصول لقسم "شكرًا لكم".
  Golden/blue fireworks triggered on reaching the Thank You section.
- موسيقى خلفية هادئة تحاول التشغيل التلقائي، مع زر عائم بديل إذا منعها المتصفح.
  Gentle background music with autoplay attempt + floating fallback control.
- متجاوب بالكامل، ويحترم إعداد "تقليل الحركة" في نظام التشغيل.
  Fully responsive; respects the OS "reduce motion" setting.

## إضافة المحتوى الخاص بكم | Adding your content

**الموسيقى | Music**
ضع ملف MP3 باسم `wedding-music.mp3` داخل `assets/audio/`. يفضَّل مقطوعة هادئة بدون كلام.
Add an MP3 named `wedding-music.mp3` inside `assets/audio/`. A soft instrumental track works best.

**صور المعرض | Gallery photos**
عدّلوا مصفوفة `galleryData` في `js/script.js` — أضيفوا `image: 'assets/images/your-photo.jpg'`
لأي صورة حقيقية بدل الإطارات الذهبية الجاهزة.
Edit the `galleryData` array in `js/script.js` — add `image: 'assets/images/your-photo.jpg'`
to replace any placeholder frame with a real photo.

**سجل الضيوف على Netlify | Guest Book on Netlify**
عند رفع الموقع على Netlify، سيتعرف تلقائيًا على نموذج `guestbook` (بفضل `data-netlify="true"`)
وستجدون كل الرسائل في: **Site settings → Forms**. لا حاجة لأي إعداد إضافي.
When deployed to Netlify, it auto-detects the `guestbook` form (`data-netlify="true"`) —
find every submission under **Site settings → Forms**. No extra setup needed.
> ملاحظة: على GitHub Pages أو أي استضافة أخرى، الرسائل تظهر في حائط الضيوف أثناء الجلسة فقط
> (لا يوجد خادم لتخزينها بشكل دائم بدون Netlify أو خدمة نماذج مشابهة).
> Note: on GitHub Pages or any host other than Netlify, messages appear on the live
> wall for that session only — persistent storage needs Netlify Forms or a similar service.

**تاريخ الزفاف والمكان | Wedding date & venue**
عدّلوا `WEDDING_DATE` أعلى `js/script.js`، ونص قسم `#details` في `index.html`.
Edit `WEDDING_DATE` at the top of `js/script.js`, and the `#details` section text in `index.html`.

**الألوان والخطوط | Colors & fonts**
كل الألوان معرّفة كمتغيرات CSS داخل `:root` و`body.theme-light` / `body.theme-dark` في `css/style.css`.
All colors live as CSS custom properties under `:root` and `body.theme-light` / `body.theme-dark`.

## النشر | Deployment

### Netlify
1. اسحبوا مجلد `hossam-shahd-invitation` مباشرة إلى https://app.netlify.com/drop، أو
2. ادفعوا المجلد إلى مستودع GitHub وربطوه بـ Netlify (Build command: فارغ، Publish directory: `/`).

### GitHub Pages
1. ادفعوا المجلد إلى مستودع GitHub.
2. من **Settings → Pages**، اختاروا الفرع الذي يحتوي الكود، والمجلد `/ (root)`.
3. الموقع سيكون متاحًا على `https://<username>.github.io/<repo>/`.

لا حاجة لأي أدوات بناء أو مكتبات خارجية — الموقع جاهز للنشر كما هو.
No build tools or external dependencies required — ready to deploy as-is.
