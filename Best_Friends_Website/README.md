# Best Friends ko‘p sahifali sayti

Best Friends uchun HTML5, CSS3 va oddiy JavaScript asosida tayyorlangan statik sayt. Backend, ma’lumotlar bazasi, build tizimi yoki tashqi framework talab qilinmaydi.

## Fayl tuzilmasi

```text
.
├── index.html             # Bosh sahifa
├── mahsulotlar.html       # Mahsulotlar katalogi
├── mahsulot.html          # Hozirgi mahsulot tafsiloti
├── biz-haqimizda.html     # Brend haqida
├── buyurtma.html          # Buyurtma tartibi
├── boglanish.html         # Aloqa ma’lumotlari
├── 404.html               # Topilmagan sahifa
├── styles.css             # Barcha sahifalar uchun umumiy dizayn
├── script.js              # Umumiy interaktivlik va animatsiya tizimi
├── robots.txt             # Qidiruv robotlari uchun asosiy qoida
├── netlify.toml           # Netlify sozlamalari
└── assets/                # Rasmlar, manifest, finale vektorlari va lokal shrift
```

## Lokal ko‘rish

Loyiha papkasida lokal HTTP serverni ishga tushiring:

```bash
cd Best_Friends_Website
python3 -m http.server 8000
```

Brauzerda `http://localhost:8000` manzilini oching. To‘g‘ridan-to‘g‘ri `index.html` ni ochish ham mumkin, ammo sahifalararo havolalarni HTTP server orqali tekshirish ma’qul.

## Navigatsiya

Asosiy navigatsiya oddiy nisbiy `.html` havolalaridan foydalanadi. Shu sababli u Netlify, GitHub Pages va oddiy fayl hostingida ishlaydi. Har bir sahifadagi joriy bo‘lim `aria-current="page"` bilan belgilangan.

Asosiy tugma har doim `buyurtma.html` ga olib boradi. Logotip har doim `index.html` ga qaytaradi. Havolalar oddiy HTML navigatsiyasi bo‘lib qoladi; JavaScript faqat ichki sahifalar orasida 180 ms chiqish animatsiyasini qo‘shadi. Telefon, tashqi, yangi tab va modifier tugmali havolalar ushlanmaydi.

## Animatsiya va interaktivlik

Saytdagi harakatlar `styles.css` va `script.js` orqali tashqi kutubxonasiz ishlaydi:

- `:root` dagi umumiy 120–650 ms davomiylik va easing tokenlari;
- har sahifadagi tez header, sarlavha, CTA va asosiy tasvir kirish ketma-ketligi;
- bitta `IntersectionObserver` ishlatadigan `data-reveal` va `data-stagger` animatsiyalari;
- desktop tasvir maydonlarida scroll holatiga bog‘langan yengil parallax;
- bosh sahifadagi tasdiqlangan faktlar lentasi;
- desktopda mahsulot kartasi tilti, sirt yaltirashi, pointer reaksiyasi va rasm zoomi;
- barcha faol tugmalarda kichik magnit siljish, bosilgan holat va pointerdan yoyiladigan rang;
- hero qadoq maketi va fon shakllarining pointer hamda scrollga javobi;
- oddiy ko‘p sahifali navigatsiyani saqlaydigan qisqa sahifalararo o‘tish;
- faqat haqiqiy sichqoncha ishlatilganda ko‘rinadigan ixcham maxsus kursor;
- headerning pastki chetidagi ko‘rsatkich, tortiladigan oq yulduz va klaviatura boshqaruviga ega maxsus scrollbar;
- mahsulot narxining bir martalik tez hisoblagichi va haqiqiy rasmlarning fade-in animatsiyasi;
- footer oldida tabiiy nisbatdagi `BEST` va normal `FRIENDS` bir xil
  balandlikdagi vektor wordmark; scroll paytida faqat `FRI` harflarining
  kesilgan pastki qismlari ekran pastini yumshoq kuzatadi, har xil balandlikda
  to‘xtaydi (`I` 33%, `F` 66%, `R` 100%) va oradagi tik asoslar to‘g‘ri
  to‘rtburchak bilan to‘ldiriladi.

Finale harflari SIL Open Font License 1.1 ostidagi Bodoni Moda shriftidan
original vektor konturlarga aylantirilgan. Manba shrifti
`assets/fonts/bodoni-moda-latin-standard-normal.woff2`, litsenziya matni esa
`assets/fonts/BODONI-MODA-LICENSE.txt` faylida saqlanadi. Vektor konturlar
`assets/finale-glyphs.svg` ichida joylashgan.

Oddiy `.html` havolalari o‘zgartirilmagan. `prefers-reduced-motion: reduce` yoqilgan qurilmalarda page transition, parallax, tilt, magnit harakat, marquee, finale stretch va uzluksiz dekorativ animatsiyalar o‘chadi; barcha kontent darhol ko‘rinadi.

Mobil joylashuv 320 px telefondan planshet va desktop o‘lchamlarigacha moslashadi. Sensorli yoki stilusli pointer hodisasi maxsus kursorni darhol yashiradi; touch qurilmalarda brauzerning odatiy boshqaruvi saqlanadi.

## Yangi mahsulot kartasini qo‘shish

`mahsulotlar.html` ichidagi `catalog-grid` blokida qayta ishlatiladigan HTML andozasi izoh ko‘rinishida mavjud. Ikkinchi mahsulot tasdiqlangach, `future-card` blokini quyidagi kabi haqiqiy karta bilan almashtiring:

```html
<article
  class="catalog-card catalog-card-current"
  data-reveal="scale"
  data-tilt
>
  <div class="catalog-media">
    <img
      class="future-image"
      src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
      data-future-src="assets/product-2.webp"
      width="720"
      height="720"
      loading="lazy"
      alt="TASDIQLANGAN MAHSULOT NOMI"
      hidden
    />
    <div class="mini-product-placeholder" role="img" aria-label="Mahsulot rasmi tez orada joylanadi">
      <div class="mini-garment" aria-hidden="true"><span></span><i></i><i></i><i></i></div>
      <p>Mahsulot rasmi tez orada</p>
    </div>
  </div>
  <div class="catalog-copy">
    <p class="card-kicker">Mahsulot</p>
    <h2>TASDIQLANGAN MAHSULOT NOMI</h2>
    <ul class="card-facts">
      <li>TASDIQLANGAN YOSH</li>
      <li>TASDIQLANGAN O‘LCHAM</li>
    </ul>
    <p class="card-price">TASDIQLANGAN NARX VA VALYUTA</p>
    <div class="card-actions">
      <a class="button" href="mahsulot-2.html">Batafsil</a>
    </div>
  </div>
</article>
```

`assets/image-manifest.json` faylidagi `available` ro‘yxatiga `assets/product-2.webp` ni ham qo‘shing. Xuddi shu kartani `index.html` dagi `catalog-grid` ga kiriting. Grid avtomatik ravishda 2, 4, 6 yoki 8 ta kartani responsiv joylashtiradi.

## Yangi mahsulot tafsilot sahifasini yaratish

1. `mahsulot.html` faylidan nusxa olib, masalan `mahsulot-2.html` deb nomlang.
2. `<title>`, meta description, Open Graph matnlari va breadcrumb nomini yangilang.
3. Sahifadagi mahsulot nomi, yosh, o‘lcham va narxni faqat tasdiqlangan qiymatlar bilan almashtiring.
4. Product JSON-LD ichidagi `name`, `description`, `price` va boshqa tasdiqlangan maydonlarni yangilang.
5. Katalog kartasidagi `href` ni yangi faylga yo‘naltiring.
6. Tasdiqlanmagan material, rang, mavjudlik, yetkazib berish yoki kafolat ma’lumotlarini qo‘shmang.

## Placeholderlarni haqiqiy mahsulot bilan almashtirish

Kelajak mahsulot kartasida:

1. `future-card` klassini olib tashlang.
2. `future-media` va `future-product-placeholder` bloklarini haqiqiy `<img>` bilan almashtiring.
3. “Tez orada” va “Yangi mahsulot uchun joy” matnlarini tasdiqlangan ma’lumotlar bilan almashtiring.
4. Yosh, o‘lcham, narx va mahsulot sahifasi havolasini qo‘shing.

Karta ma’lumotlari to‘liq tasdiqlanmaguncha unga bosiladigan havola qo‘shmang.

## Haqiqiy rasmlarni qo‘shish

Tayyorlangan fayl nomlari:

- `assets/packaging.webp`
- `assets/product-main.webp`
- `assets/logo-stacked.png`
- `assets/logo-horizontal.png`
- `assets/logo-mark.png`
- `assets/logo-wordmark.png`
- `assets/about-production.webp`
- `assets/product-2.webp`
- `assets/product-3.webp`
- `assets/product-4.webp`

Hozirgi placeholderlarda `future-image` klassli yashirin `<img>` bor. Rasm tayyor bo‘lgach:

1. Rasmni `assets/` papkasiga tavsiya etilgan nom bilan joylashtiring.
2. `assets/image-manifest.json` ichidagi `available` ro‘yxatiga fayl yo‘lini kiriting.
3. `<img>` dagi `data-future-src`, o‘lcham va Uzbekcha `alt` matnini tekshiring.

Masalan:

```json
{
  "available": [
    "assets/packaging.webp",
    "assets/product-main.webp",
    "assets/logo-stacked.png",
    "assets/logo-horizontal.png",
    "assets/logo-mark.png",
    "assets/logo-wordmark.png"
  ]
}
```

JavaScript faqat manifestda ko‘rsatilgan faylni yuklaydi. Rasm muvaffaqiyatli ochilgach u `1.02` scale holatidan fade-in qiladi, CSS placeholder esa yumshoq yo‘qoladi. Shu sababli `src` ni almashtirish, `hidden` ni qo‘lda o‘chirish yoki placeholderni olib tashlash shart emas. Manifestda yo‘q fayllar uchun brauzer 404 so‘rovi yubormaydi.

Hero yoki mahsulot tafsilotidagi birinchi ekran rasmi uchun `loading="eager"`, pastdagi katalog rasmlari uchun `loading="lazy"` ishlating.

## Rasmiy logotipni qo‘shish

Rasmiy logotip to‘rtta o‘lchamga mos variantda saqlanadi. `logo-stacked.png`
asl vertikal kompozitsiya, `logo-horizontal.png` keng headerlar uchun,
`logo-mark.png` favicon va kichik ekranlar uchun, `logo-wordmark.png` esa faqat
yozuv kerak bo‘lgan joylar uchun ishlatiladi. Headerdagi `<picture>` elementi
variantni ekran kengligiga qarab avtomatik tanlaydi. Hech bir variant siqilmaydi
yoki cho‘zilmaydi. Logotip havolasidagi `aria-label="Best Friends"` brend nomini
screen readerga beradi, shuning uchun rasmning `alt` qiymati ataylab bo‘sh.

## Telegram va Instagram havolalari

Tasdiqlangan Telegram aloqa ma’lumoti `buyurtma.html` va `boglanish.html`
fayllarida bir xil ko‘rsatiladi:

- ism: `Iqbol Sattarov`;
- username: `@app5040storegmailcom`;
- havola: `https://t.me/app5040storegmailcom`.

Telegram ma’lumoti o‘zgarsa, ism, username va havolani ikkala sahifada ham
yangilang. Instagram manzili hali tasdiqlanmaganligi sababli uning tugmasi
o‘chirilgan holatda qoladi.

## Telefon raqamini yangilash

Barcha HTML fayllarda quyidagi ikki qiymatni almashtiring:

- ko‘rinadigan raqam: `+998 90 308 50 40`
- qo‘ng‘iroq va tuzilmaviy ma’lumotlar uchun: `+998903085040`

`index.html` dagi LocalBusiness va `mahsulot.html` dagi Product tuzilmaviy ma’lumotlarini ham tekshiring.

## Umumiy header va footerni yangilash

Sayt build tizimisiz statik bo‘lgani sababli header va footer har bir HTML faylda takrorlanadi. Navigatsiya yoki footer o‘zgarsa:

1. O‘zgarishni barcha yetti HTML faylga kiriting.
2. Har sahifada faqat tegishli asosiy navigatsiya havolasida `aria-current="page"` qoldiring.
3. `404.html` da aktiv navigatsiya talab qilinmaydi.
4. Logo havolasi `index.html`, buyurtma tugmasi `buyurtma.html` ekanini tekshiring.

## Netlify’ga joylash

1. Fayllarni Git repozitoriyga yuboring.
2. Netlify’da repozitoriyni yangi sayt sifatida tanlang.
3. Build buyrug‘ini bo‘sh qoldiring.
4. Publish papkasini `.` deb belgilang.
5. Deployni boshlang.

Netlify ildizdagi `404.html` faylini avtomatik ishlatadi. `netlify.toml` SPA redirect yaratmaydi, shuning uchun barcha `.html` sahifalar alohida xizmat qiladi.

## GitHub Pages’ga joylash

1. Fayllarni GitHub repozitoriysining asosiy branchiga yuboring.
2. `Settings → Pages` bo‘limida `Deploy from a branch` ni tanlang.
3. Asosiy branch va `/(root)` papkasini belgilang.
4. Saqlang va GitHub bergan sayt manzilini oching.

Nisbiy havolalar loyiha domen ildizida ham, GitHub Pages repozitoriy yo‘lida ham ishlaydi. GitHub Pages ham ildizdagi `404.html` dan foydalanadi.

## Shaxsiy domen

Netlify’da `Domain management → Add a domain` orqali domenni qo‘shing va ko‘rsatilgan DNS yozuvlarini domen provayderida kiriting.

GitHub Pages’da `Settings → Pages → Custom domain` maydoniga domenni yozing, so‘ng ko‘rsatilgan `A`, `AAAA` yoki `CNAME` yozuvlarini kiriting. Domen ishlagach HTTPS’ni majburiy holatga o‘tkazing.

Domen tasdiqlangach har bir HTML fayldagi izoh o‘rniga sahifaga mos canonical va `og:url` teglarini qo‘shing.

Shuningdek, domen tasdiqlangach `sitemap.xml` yarating. Undagi har bir `<loc>` qiymati to‘liq, haqiqiy URL bo‘lishi kerak. Quyidagi sahifalarni kiriting:

```text
https://SIZNING-DOMENINGIZ/
https://SIZNING-DOMENINGIZ/mahsulotlar.html
https://SIZNING-DOMENINGIZ/mahsulot.html
https://SIZNING-DOMENINGIZ/biz-haqimizda.html
https://SIZNING-DOMENINGIZ/buyurtma.html
https://SIZNING-DOMENINGIZ/boglanish.html
```

So‘ng `robots.txt` fayliga `Sitemap: https://SIZNING-DOMENINGIZ/sitemap.xml` qatorini qo‘shing. `404.html` sitemapga kiritilmaydi.

## Hali tasdiqlanmagan ma’lumotlar

- ishlab chiqarish yoki jamoa rasmi;
- mahsulot materiali, ranglari va parvarish ko‘rsatmalari;
- Instagram rasmiy manzili;
- yetkazib berish hududlari, narxi va shartlari;
- buyurtma qabul qilish vaqtlari;
- yakuniy domen nomi;
- mahsulotning joriy mavjudligi;
- kelajak mahsulotlarining nomi, narxi, yoshi va o‘lchami.

Tasdiqlanmagan ma’lumotlar saytga kiritilmagan.
