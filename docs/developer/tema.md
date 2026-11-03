---
title: Tema motoru (Twig)
url: https://tsoft.bahadirdogru.com/developer/tema/
---

# Tema geliştirme

Kaynak: [Tema Geliştirme](https://developer.tsoft.com.tr/tema-gelistirme/genel-bakis) (20 Ekim 2026).

Bu depodaki [eski tema](../theme/README.md) bölümü Smarty blok HTML’i, değişken JSON’u ve `.tpl` parçalarıdır. Aşağıdaki motor Twig section’ları, Tailwind ve `tsoft-cli` ile çalışır. Sayfa sunucuda HTML’e çevrilir. CDN paketi varsa statik dosya dağıtım ağından gelir.

## Akış

1. URL sayfa tipini seçer: ürün, kategori, ana sayfa, sepet.
2. O sayfa ve section için Twig’e UPPERCASE global’ler gider: `PRODUCTS`, `P`, `TOTAL`, `SETTING`, `BLOCK`.
3. Panelden eklenen section’lar sırayla işlenir.
4. Motor snippet çağırır ve Tailwind sınıflarıyla HTML üretir.

Canlı değişken listesi Chrome eklentisi **T-Soft Theme Devtools** içindedir. Eklenti, mağaza yönetim ekranı açıkken DevTools’a sekme ekler.

```bash
npm install -g tsoft-cli
tsoft login
tsoft theme create
cd example-tsoft-biz/my-theme
tsoft theme dev
tsoft theme push
```

`tsoft theme dev` dosyayı kaydedince sunucuya yollar. Silinen dosya mağazadan da kalkar. Aynı anda tek geliştirici kilit alır. Bağlantı 30 saniyede bir canlı tutulur. `Ctrl+C` kilidi sonraki oturum için saklar.

`(Seçili)` üzerinde çalışılan temadır. `(Yayında)` müşterinin gördüğü temadır. İkisi aynı olmak zorunda değildir.

## Dizin

Mağaza klasörü, domaindeki noktaların tireye çevrilmiş küçük harf halidir: `example.tsoft.biz` → `example-tsoft-biz`.

```text
example-tsoft-biz/my-theme/
├── .theme
├── section/<isim>/default.twig
├── section/<isim>/<varyant>.twig
├── snippets/<isim>.twig
├── layout/<isim>.twig
├── locales/<dil>.json
└── assets/
    ├── css/theme.css
    ├── js/theme.js
    └── img/
```

`.theme` JSON alanları: `name`, `author`, `version` (SemVer).

| Ne | Nereye |
| --- | --- |
| Panelden eklenen bölüm | `section/<isim>/default.twig` |
| Aynı bölümün varyantı | `section/<isim>/<varyant>.twig` |
| Birden çok yerde kullanılan parça | `snippets/<isim>.twig` |
| Yalnız bir üst parçanın içinden çağrılan | `snippets/_<isim>.twig` |
| Paylaşılan include | `layout/<isim>.twig` |
| Stil | `assets/css/theme.css` |
| Davranış | `assets/js/theme.js` |

CLI, bulunduğunuz yolun dizin adlarını giriş yapılan mağaza envanteriyle eşler. En dıştaki eşleşen dizin mağaza, hemen altı temadır. `theme dev`, `theme push` ve `theme section` bu dizinden argümansız çalışır. Dizin dışındaysanız `tsoft theme use` ile seçilen tema kullanılır. Tek komut için `tsoft --store musteri.tsoft.biz theme push`. Öncelik `--store` bayrağındadır.

Tema dizininin içindeyken `theme create` veya `theme pull` yeni temayı bir üst köke koyar.

## CLI

```text
tsoft
├── login | logout | whoami
├── store list | store use [domain]
├── org switch
└── theme
    ├── list | create [name] | pull | use [name] | fork
    ├── dev [name] | push [name]
    └── section
        ├── list | add | create | fork
```

| Ortam | Varsayılan | Anlamı |
| --- | --- | --- |
| `TSOFT_LANG` | `tr` | `tr` veya `en` |
| `TSOFT_DEBUG` | — | `1` iken eksik çeviri anahtarı stderr’e yazılır |
| `TSOFT_IDP_DOMAIN` | `login.tsoft360.com` | OAuth alanı |
| `TSOFT_CALLBACK_PORT` | `8046` | Login callback |
| `TSOFT_CLIENT_ID` | yerleşik | OAuth istemci kimliği |

`tsoft theme push` inceleme bekleyen temada `PUSH-PENDING-REVIEW` döner. `tsoft logout` token’ı sunucuda iptal eder ve yerel kimlik dosyasını siler.

Section komutları bitince tema dosyalarını günceller. `section add` hazır section ekler. Çakışmada atla, üzerine yaz veya kalanların tümünü üzerine yaz seçenekleri vardır. `section create` boş `.twig` açar. `section fork` mevcut section’ın kopyasını yeni adla yazar.

Müşteri mağazasında akış: davet kodu → erişim onayı → `tsoft store use` → `tsoft theme pull` → tema dizininde `tsoft theme dev`. Değişiklik taslak sürümde tutulur.

## Twig

`{{ }}` yazar, `{% %}` mantık çalıştırır, `{# #}` yorumdur.

Sık global’ler: `t`, `BLOCK` (`BLOCK.ID`), `SETTING`, `CART_INFO`, `CURRENCY`, `DESIGN_MODE`, `IS_ADMIN_LOGGED`, `IS_HOME_PAGE`, `SEARCH_WORD`, `PRODUCTS`, `TOTAL`, `ALLOWED_SORTS`, `P`, `CAMPAIGN_LIST`.

Ürün detayında aktif ürün `P` dir. Sık alanlar: `P.ID`, `P.TITLE`, `P.PRODUCT_CODE`, `P.PRICE_SELL`, `P.PRICE_NOT_DISCOUNTED`, `P.VAT`, `P.IN_STOCK`, `P.HAS_VARIANT`, `P.IMAGE_LIST`, `P.ADDITIONAL_FIELD_1`. Liste section’ında döngü değişkeni de çoğu zaman `P` olur. Gelen küme section tipine göre değişir; Devtools teyit eder.

`product-list` için belgelenenler: `PRODUCTS`, `TOTAL`, `SEARCH_WORD`, `ALLOWED_SORTS`, `IS_HOME_PAGE`, `IS_AUTO_LOAD_ACTIVE`, `BLOCK.ID`, `SETTING`.

Filtreler: `money`, `date`, `default`, `truncate`, `upper`, `lower`, `escape`, `raw`, `replace`, `merge`, `length`, `join`.

Fonksiyon sayfasındaki adlar: `t`, `format`, `vat`, `snippet`, `dump`, `menu`, `url`, `form`, `request_path`, `exchange`, `category`, `brand`, `model`, `product`, `query`, `asset`, `theme`, `theme_asset`, `csrf_token`, `snippetUri`. Şablon sayfası aynı iş için `snippet_uri` ve `cookie` adlarını da kullanır.

```twig
{{ snippet('product-card', { product: P }) }}
{{ snippet('product-detail.variant-1.select') }}
<img src="{{ theme_asset('img/logo.svg') }}" alt="">
{{ t.block_title }}
{{ t.search_result|replace({'%COUNT%': TOTAL}) }}
```

Nokta, klasör seviyesidir: `snippet('product-detail.variant-1.select')` → `snippets/product-detail/variant-1/select.twig`. Alt çizgi, parçanın dışarıdan doğrudan çağrılmaması anlaşmasıdır.

Section panelden eklenir ve sırası değişir. Snippet yalnız çağrıldığı yerde durur. Section ayarı panelden gelir; şablonda `{% schema %}` bloğu yoktur.

`locales/<dil>.json` üst anahtarları `common`, section adı, `_<snippet>` veya nokta notasyonlu snippet adıdır. Render sırasında o blok ile `common` `t` nesnesine yüklenir. Aynı anahtar temadaki dosyada varsa varsayılan sözlüğü ezer. Dinamik anahtar `t[key]` ile okunur. Yer tutucu `%COUNT%` biçimindedir. Yeni dil dosyası ISO koduyla açılır ve panelde Ayarlar → Diller üzerinden açılır.

## Görünüm

Panel 6 renk ve 3 font verir. Sabit hex yazılmaz.

| Panel | Sınıf | Değişken |
| --- | --- | --- |
| Body Text | `text-body` | `--body` |
| Primary | `bg-primary` | `--primary` |
| Secondary | `bg-secondary` | `--secondary` |
| Dark | `bg-dark` | `--dark` |
| Light | `bg-light` | `--light` |
| Form | `border-form` | `--form` |
| Font | `font-sans` | — |
| Secondary Font | `font-secondary` | — |
| RTL Font | `font-rtl` | — |

Renkler `bg-` / `text-` / `border-` öneki, skala (`bg-primary-100`) ve opaklık (`bg-primary/10`) ile kullanılır. Seçilmeyen ikincil ve RTL font birincil fonta düşer.

Tailwind kurulumu platformdadır. Plugin eklenmez, yeni utility ilan edilmez. `tailwind.config.js` temada yoktur; editör önerisi için yerel bir yardımcı config yazılır. Kırılımlar: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440. Sınıf adı şablonda tam yazılır; çalışma anında birleştirilen sınıf derlemeye girmez.

`theme.css` içinde tekrar `@layer components` ve `@apply` ile isimlendirilir. `theme_asset()` görsel ve ek dosya için host, içerik hash’i ve `Cache-Control: public, max-age=31536000, immutable` üretir. `theme.css` ile `theme.js` bu fonksiyonla çağrılmaz; platform yükler.

## JavaScript

`assets/js/theme.js` her sayfada yüklenir. Şablona `<script>` veya `<style>` gömülmez. Twig’den JS’e veri `data-*` veya `json_encode` ile gider.

Sayfa global’leri: `PRODUCT_DATA`, `SETTINGS`, `PAGE_TYPE`, `PAGE_ID`, `ON_PAGE_READY`, `MEMBER_INFO`, `IS_VENDOR`, `CART_INFO`, `CART_COUNT`, `CART_TOTAL`, `LANGUAGE`, `CURRENCY`, `SEP_DEC`, `SEP_THO`, `DECIMAL_LENGTH`, `THEME_VERSION`, `CSRF_TOKEN`, `CART_CSRF_TOKEN`, `BLOCKS`, `BLOCK_JS`, `callbacks`, `components`.

```js
ON_PAGE_READY.push(function () {
  var btn = document.querySelector("[data-add]");
  if (!btn) return;
});

callbacks.cart.load.push(function (a, b, c) {});
```

Blok kökünde `data-block-id` vardır. Ayar, `closest("[data-block-id]")` ile `BLOCKS` içinden okunur. Analitik ve üçüncü taraf kod panelde Ayarlar → İzleme kodlarına yazılır.

`data-toggle` değerleri (resmi katalog): `flag`, `form-submit`, `popup`, `country`, `city`, `town`, `district`, `state`, `accordion`, `tooltip`, `count-down`, `share`, `slider`, `drawer`, `copy`, `tab`, `dropdown`, `sticky`, `menu`, `password-toggle`, `captcha-toggle`, `product`, `sort`, `layout`, `show-in-stock`, `show-out-stock`, `qty`, `variant-one`, `variant-two`, `variant-notify`, `variant-one-active`, `product-note`, `product-subscribe`, `product-multiple`, `product-code`, `barcode`, `supplier-product-code`, `product-loader`, `product-showcase`, `showcase`, `collection`, `product-card-catalog`, `light-gallery`, `zoom`, `login`, `fast-register`, `social-login`, `logout`, `newsletter`, `member-name`, `message-count`, `favourite-count`, `cart-count`, `cart-price`, `cart-preview`, `cart-drawer`, `language`, `currency`, `live-search`.

`form-submit` uçları `/resources/assets/js/endpoint.js` içindedir.

## Performans ve market

Hedefler: LCP 2,5 saniyenin altı, INP 200 ms altı, CLS 0,1 altı, TTFB 600 ms altı. Lighthouse mobil 85 ve üzeri. Görselde `width` ve `height` yazılır. LCP görseli eager kalır; alttakiler `loading="lazy"`. Hero slider’ın ilk karesi `fetchpriority="high"`. Font yüklemesini platform yapar.

Market akışı: kod ve panel içeriği biter → `tsoft theme push` taslağı günceller → hazırlık ekranı (ad, açıklama, detay, changelog) → kapak 16:9, 1600×900, WebP → en az 3 ekran görüntüsü (panel ölçüsü 1280×960 JPG/PNG) → İncelemeye Gönder. Onaylanan tema `tsoftthemes.com/temalar` üzerinde listelenir.

İnceleme başlıkları: şablonda stil ve script yok, sabit hex yok, metin `locales/` içinde, yatay kaydırma yok, liste-detay-varyant-sepet-ödeme-üyelik-arama çalışır, konsol temiz, `console.log` kalmaz.

## Sayfa dizini

| Sayfa | Adres |
| --- | --- |
| Genel bakış | https://developer.tsoft.com.tr/tema-gelistirme/genel-bakis |
| Kurulum | https://developer.tsoft.com.tr/tema-gelistirme/kurulum |
| IDE | https://developer.tsoft.com.tr/tema-gelistirme/ide-kurulumu |
| Çalışma dizini | https://developer.tsoft.com.tr/tema-gelistirme/calisma-dizini |
| Sıfırdan tema | https://developer.tsoft.com.tr/tema-gelistirme/yeni-tema-gelistirme |
| Müşteri teması | https://developer.tsoft.com.tr/tema-gelistirme/musteri-temasi |
| Tema yapısı | https://developer.tsoft.com.tr/tema-gelistirme/tema-yapisi |
| Özelleştirme | https://developer.tsoft.com.tr/tema-gelistirme/temayi-ozellestir |
| Markete gönderme | https://developer.tsoft.com.tr/tema-gelistirme/markete-gonderme |
| İnceleme | https://developer.tsoft.com.tr/tema-gelistirme/inceleme-kriterleri |
| Section | https://developer.tsoft.com.tr/tema-gelistirme/section |
| Snippet | https://developer.tsoft.com.tr/tema-gelistirme/snippet |
| Locale | https://developer.tsoft.com.tr/tema-gelistirme/locale |
| Asset | https://developer.tsoft.com.tr/tema-gelistirme/assetler |
| Twig | https://developer.tsoft.com.tr/tema-gelistirme/twig |
| Twig fonksiyonları | https://developer.tsoft.com.tr/tema-gelistirme/twig-fonksiyonlari |
| Tailwind | https://developer.tsoft.com.tr/tema-gelistirme/tailwind |
| JavaScript | https://developer.tsoft.com.tr/tema-gelistirme/javascript/genel-bakis |
| JS fonksiyonları | https://developer.tsoft.com.tr/tema-gelistirme/javascript/fonksiyonlar |
| JS bileşenleri | https://developer.tsoft.com.tr/tema-gelistirme/javascript/bilesenler |
| JS callback | https://developer.tsoft.com.tr/tema-gelistirme/javascript/callbackler |
| Data-toggle | https://developer.tsoft.com.tr/tema-gelistirme/data-toggle |
| Pratik çözümler | https://developer.tsoft.com.tr/tema-gelistirme/pratik-cozumler |
| CLI | https://developer.tsoft.com.tr/tema-gelistirme/cli-referansi |
| Performans | https://developer.tsoft.com.tr/tema-gelistirme/performans |

IDE sayfası navigasyon ağacında yok, sitemap’te var ve 200 döner. Önerilen eklentiler: Twig Language 2, Tailwind CSS IntelliSense, Prettier. `.twig` dosyası Twig diliyle eşlenir.

Pratik çözümler sayfası iki tarif verir: asorti tablosu (`BEDEN:ADET|...#TOPLAM`, alan `P.ADDITIONAL_FIELD_1`) ve ürün kartında `P.IMAGE_LIST` uzunluğu 1’den büyükse slider noktaları.
