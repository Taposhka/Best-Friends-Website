Uzbek version (English version if you scroll down):

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
cd /home/tapo/Projects/Best_Friends_Website
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
- `assets/logo.svg`
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
    "assets/logo.svg"
  ]
}
```

JavaScript faqat manifestda ko‘rsatilgan faylni yuklaydi. Rasm muvaffaqiyatli ochilgach u `1.02` scale holatidan fade-in qiladi, CSS placeholder esa yumshoq yo‘qoladi. Shu sababli `src` ni almashtirish, `hidden` ni qo‘lda o‘chirish yoki placeholderni olib tashlash shart emas. Manifestda yo‘q fayllar uchun brauzer 404 so‘rovi yubormaydi.

Hero yoki mahsulot tafsilotidagi birinchi ekran rasmi uchun `loading="eager"`, pastdagi katalog rasmlari uchun `loading="lazy"` ishlating.

## Rasmiy logotipni qo‘shish

`assets/logo.svg` tayyor bo‘lgach, faylni joylashtiring va `assets/image-manifest.json` ro‘yxatiga `assets/logo.svg` ni qo‘shing. JavaScript barcha sahifalardagi `BF` belgini avtomatik ravishda logotip bilan almashtiradi. Yonidagi `Best Friends` matni brend nomini screen readerga beradi, shuning uchun rasmning `alt` qiymati ataylab bo‘sh qoladi.

## Telegram va Instagram havolalarini qo‘shish

`buyurtma.html` va `boglanish.html` ichidagi ijtimoiy tugmalar ataylab o‘chirilgan. Rasmiy manzillar tasdiqlangach:

1. Tegishli `<button disabled aria-disabled="true">` elementini `<a>` elementiga almashtiring.
2. Tasdiqlangan `href` manzilini kiriting.
3. `disabled` va `aria-disabled` atributlarini olib tashlang.
4. Bir xil havolani ikkala sahifada ham yangilang.

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

- mahsulot va qadoqning haqiqiy rasmlari;
- rasmiy logotip;
- ishlab chiqarish yoki jamoa rasmi;
- mahsulot materiali, ranglari va parvarish ko‘rsatmalari;
- Telegram va Instagram rasmiy manzillari;
- yetkazib berish hududlari, narxi va shartlari;
- buyurtma qabul qilish vaqtlari;
- yakuniy domen nomi;
- mahsulotning joriy mavjudligi;
- kelajak mahsulotlarining nomi, narxi, yoshi va o‘lchami.

Tasdiqlanmagan ma’lumotlar saytga kiritilmagan.


English version:

# Best Friends Multi-Page Website

A static website for Best Friends built with HTML5, CSS3, and plain JavaScript. No backend, database, build system, or external framework is required.

## File Structure

```text
.
├── index.html             # Home page
├── mahsulotlar.html       # Product catalog
├── mahsulot.html          # Current product details
├── biz-haqimizda.html     # About the brand
├── buyurtma.html          # Ordering process
├── boglanish.html         # Contact information
├── 404.html               # Not found page
├── styles.css             # Shared design for all pages
├── script.js              # Shared interactivity and animation system
├── robots.txt             # Basic rules for search engine crawlers
├── netlify.toml           # Netlify configuration
└── assets/                # Images, manifest, finale vectors, and local font
```

## Local Preview

Start a local HTTP server inside the project directory:

```bash
cd /home/tapo/Projects/Best_Friends_Website
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. Opening `index.html` directly is also possible, but it is preferable to test navigation between pages through the HTTP server.

## Navigation

The main navigation uses simple relative `.html` links. Because of this, it works on Netlify, GitHub Pages, and standard file hosting. The current section on each page is marked with `aria-current="page"`.

The main button always leads to `buyurtma.html`. The logo always returns to `index.html`. Links remain standard HTML navigation; JavaScript only adds a 180 ms exit animation between internal pages. Phone, external, new-tab, and modifier-key links are not intercepted.

## Animation and Interactivity

The website’s motion is handled through `styles.css` and `script.js` without external libraries:

- shared 120–650 ms duration and easing tokens in `:root`;
- a fast entrance sequence for the header, title, CTA, and main image on each page;
- `data-reveal` and `data-stagger` animations using a single `IntersectionObserver`;
- subtle scroll-position-based parallax on desktop image areas;
- a strip of verified facts on the home page;
- product card tilt, surface shine, pointer response, and image zoom on desktop;
- small magnetic movement, pressed state, and pointer-originating color spread on all active buttons;
- pointer- and scroll-responsive hero packaging mockup and background shapes;
- short page-to-page transitions that preserve normal multi-page navigation;
- a compact custom cursor that appears only when a real mouse is being used;
- an indicator along the bottom edge of the header, a draggable white star, and a custom scrollbar with keyboard controls;
- a one-time fast product price counter and fade-in animation for real images;
- before the footer, a vector wordmark with naturally proportioned `BEST` and normal `FRIENDS` at the same height; while scrolling, only the cropped lower portions of the `FRI` letters softly follow the bottom of the screen, stop at different heights (`I` 33%, `F` 66%, `R` 100%), and the vertical stems between them are filled with rectangles.

The finale letters were converted into original vector outlines from the Bodoni Moda font under the SIL Open Font License 1.1. The source font is stored at `assets/fonts/bodoni-moda-latin-standard-normal.woff2`, and the license text is stored in `assets/fonts/BODONI-MODA-LICENSE.txt`. The vector outlines are located in `assets/finale-glyphs.svg`.

The standard `.html` links have not been changed. On devices where `prefers-reduced-motion: reduce` is enabled, page transitions, parallax, tilt, magnetic movement, marquee, finale stretch, and continuous decorative animations are disabled; all content appears immediately.

The mobile layout adapts from 320 px phones up through tablet and desktop sizes. Touch or stylus pointer events immediately hide the custom cursor; on touch devices, the browser’s default controls are preserved.

## Adding a New Product Card

Inside the `catalog-grid` block in `mahsulotlar.html`, a reusable HTML template is available as a comment. Once the second product is confirmed, replace the `future-card` block with a real card like the following:

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
      alt="CONFIRMED PRODUCT NAME"
      hidden
    />
    <div class="mini-product-placeholder" role="img" aria-label="Product image will be added soon">
      <div class="mini-garment" aria-hidden="true"><span></span><i></i><i></i><i></i></div>
      <p>Product image coming soon</p>
    </div>
  </div>
  <div class="catalog-copy">
    <p class="card-kicker">Product</p>
    <h2>CONFIRMED PRODUCT NAME</h2>
    <ul class="card-facts">
      <li>CONFIRMED AGE</li>
      <li>CONFIRMED SIZE</li>
    </ul>
    <p class="card-price">CONFIRMED PRICE AND CURRENCY</p>
    <div class="card-actions">
      <a class="button" href="mahsulot-2.html">Details</a>
    </div>
  </div>
</article>
```

Also add `assets/product-2.webp` to the `available` list in `assets/image-manifest.json`. Insert the same card into the `catalog-grid` in `index.html`. The grid automatically lays out 2, 4, 6, or 8 cards responsively.

## Creating a New Product Detail Page

1. Make a copy of `mahsulot.html` and name it, for example, `mahsulot-2.html`.
2. Update the `<title>`, meta description, Open Graph text, and breadcrumb name.
3. Replace the product name, age, size, and price on the page only with confirmed values.
4. Update the `name`, `description`, `price`, and other confirmed fields inside the Product JSON-LD.
5. Point the catalog card’s `href` to the new file.
6. Do not add unconfirmed material, color, availability, delivery, or warranty information.

## Replacing Placeholders With Real Products

For a future product card:

1. Remove the `future-card` class.
2. Replace the `future-media` and `future-product-placeholder` blocks with a real `<img>`.
3. Replace the “Coming soon” and “Space for a new product” text with confirmed information.
4. Add the age, size, price, and product page link.

Do not add a clickable link to the card until its information has been fully confirmed.

## Adding Real Images

Prepared filenames:

- `assets/packaging.webp`
- `assets/product-main.webp`
- `assets/logo.svg`
- `assets/about-production.webp`
- `assets/product-2.webp`
- `assets/product-3.webp`
- `assets/product-4.webp`

The current placeholders contain hidden `<img>` elements with the `future-image` class. Once an image is ready:

1. Place the image in the `assets/` folder using the recommended filename.
2. Add the file path to the `available` list inside `assets/image-manifest.json`.
3. Check the `<img>` element’s `data-future-src`, dimensions, and Uzbek `alt` text.

For example:

```json
{
  "available": [
    "assets/packaging.webp",
    "assets/product-main.webp",
    "assets/logo.svg"
  ]
}
```

JavaScript loads only files listed in the manifest. Once an image successfully loads, it fades in from a `1.02` scale state, while the CSS placeholder softly disappears. Because of this, there is no need to replace `src`, manually remove `hidden`, or remove the placeholder. For files that are not listed in the manifest, the browser does not send a 404 request.

Use `loading="eager"` for the first-screen image in the hero or product detail section, and `loading="lazy"` for catalog images farther down the page.

## Adding the Official Logo

Once `assets/logo.svg` is ready, place the file in the project and add `assets/logo.svg` to the list in `assets/image-manifest.json`. JavaScript will automatically replace the `BF` mark on all pages with the logo. The adjacent `Best Friends` text provides the brand name to screen readers, so the image’s `alt` value is intentionally left empty.

## Adding Telegram and Instagram Links

The social buttons in `buyurtma.html` and `boglanish.html` are intentionally disabled. Once the official addresses are confirmed:

1. Replace the corresponding `<button disabled aria-disabled="true">` element with an `<a>` element.
2. Add the confirmed `href` address.
3. Remove the `disabled` and `aria-disabled` attributes.
4. Update the same link on both pages.

## Updating the Phone Number

Replace the following two values in all HTML files:

- visible number: `+998 90 308 50 40`
- for calls and structured data: `+998903085040`

Also check the LocalBusiness structured data in `index.html` and the Product structured data in `mahsulot.html`.

## Updating the Shared Header and Footer

Because the website is static and has no build system, the header and footer are repeated in every HTML file. If the navigation or footer changes:

1. Apply the change to all seven HTML files.
2. On each page, leave `aria-current="page"` only on the corresponding main navigation link.
3. No active navigation item is required on `404.html`.
4. Check that the logo link points to `index.html` and the order button points to `buyurtma.html`.

## Deploying to Netlify

1. Push the files to a Git repository.
2. In Netlify, select the repository as a new site.
3. Leave the build command empty.
4. Set the publish directory to `.`.
5. Start the deployment.

Netlify automatically uses the root-level `404.html` file. `netlify.toml` does not create an SPA redirect, so all `.html` pages are served separately.

## Deploying to GitHub Pages

1. Push the files to the main branch of the GitHub repository.
2. In `Settings → Pages`, select `Deploy from a branch`.
3. Select the main branch and the `/(root)` folder.
4. Save the settings and open the site address provided by GitHub.

Relative links work both at the project domain root and within a GitHub Pages repository path. GitHub Pages also uses the root-level `404.html` file.

## Custom Domain

In Netlify, add the domain through `Domain management → Add a domain`, then enter the provided DNS records at your domain provider.

In GitHub Pages, enter the domain in the `Settings → Pages → Custom domain` field, then add the provided `A`, `AAAA`, or `CNAME` records. Once the domain is working, enforce HTTPS.

After the domain is confirmed, add page-specific canonical and `og:url` tags in place of the comments in each HTML file.

Also, once the domain is confirmed, create `sitemap.xml`. Every `<loc>` value in it must be a complete, real URL. Include the following pages:

```text
https://YOUR-DOMAIN/
https://YOUR-DOMAIN/mahsulotlar.html
https://YOUR-DOMAIN/mahsulot.html
https://YOUR-DOMAIN/biz-haqimizda.html
https://YOUR-DOMAIN/buyurtma.html
https://YOUR-DOMAIN/boglanish.html
```

Then add the following line to `robots.txt`:

```text
Sitemap: https://YOUR-DOMAIN/sitemap.xml
```

`404.html` is not included in the sitemap.

## Information Not Yet Confirmed

- real product and packaging images;
- official logo;
- production or team image;
- product material, colors, and care instructions;
- official Telegram and Instagram addresses;
- delivery areas, prices, and terms;
- order acceptance times;
- final domain name;
- current product availability;
- names, prices, ages, and sizes of future products.

Unconfirmed information has not been added to the website.
