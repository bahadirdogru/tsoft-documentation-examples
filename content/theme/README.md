---
title: Eski tema (Smarty)
description: Smarty sözdizimi, blok değişkenleri, ürün alanları, blok kataloğu
---

# Eski tema motoru (Smarty)

T-Soft’un klasik vitrini Smarty şablonlarıyla çalışır. Panelde Tasarım → Blok düzenleyicide görülen HTML ve `Blok/…/*.tpl` dosyaları bu sözdizimini kullanır. Yeni tema motoru Twig’dir ve [Tema motoru](../developer/tema.md) sayfasında anlatılır. İkisi aynı mağazada aynı anda yayında olmaz; panel iç API’sinde eski motor `online-store`, yeni motor `online-store-2` grubundadır ([uç listesi](../admin-api/uclar.md#vitrin)).

Bu bölümdeki dosyalar gerçek bir mağazanın bloklarından türetilmiş, kişisel veri temizlenmiş örneklerdir. Lisans GPL-3.0.

## Smarty ile Twig karşılaştırması

| İş | Eski (Smarty) | Yeni (Twig) |
| --- | --- | --- |
| Değişken yaz | `{$P.TITLE}` | `{{ P.TITLE }}` |
| Koşul | `{if $P.IN_STOCK == 1}…{elseif …}…{else}…{/if}` | `{% if P.IN_STOCK %}…{% endif %}` |
| Döngü | `{foreach $PRODUCTS as $P}…{foreachelse}…{/foreach}` | `{% for P in PRODUCTS %}…{% else %}…{% endfor %}` |
| Dil metni | `{#add_to_cart#}` | `{{ t.add_to_cart }}` |
| Eleman sayısı | `$LIST\|@count` | `LIST\|length` |
| Varsayılan | `{$P.MIN_ORDER_COUNT\|default:1}` | `{{ P.MIN_ORDER_COUNT\|default(1) }}` |
| Değişken ata | `{assign var="X" value=$SHOWCASE.S14}` | `{% set X = … %}` |
| Parça çağır | `{include file='Blok/…/1.tpl' A=$B}` | `{{ snippet('ad', { a: b }) }}` |
| Ham JS/CSS | `{literal}…{/literal}` içinde | `assets/js/theme.js` dosyasında |
| Blok kimliği | `{$BLOCK_ID}` | `BLOCK.ID` |

Değişken adları büyük harftir ve iki motorda büyük ölçüde aynıdır (`P.PRICE_SELL`, `P.IMAGE_LIST`, `P.ADDITIONAL_FIELD_1`). Bu, eski bloğu Twig’e taşırken işi kolaylaştırır.

## Sözdizimi

```smarty
{* yorum *}
{if $IS_MEMBER_LOGGED_IN == true}
  <a href="/{$PAGE_LINK.MEMBER_ORDERS}">{#account#}</a>
{else}
  <a href="/{$PAGE_LINK.MEMBER_LOGIN}">{#member_login#}</a>
{/if}

{foreach $PRODUCT_LIST as $P}
  <div class="product" data-id="{$P.ID}">
    <img src="{$P.IMAGE.SMALL}" alt="{$P.TITLE}">
    {if $P.DISCOUNT_PERCENT > 0}<span>%{$P.DISCOUNT_PERCENT}</span>{/if}
    <span>{$P.PRICE_SELL} {$P.TARGET_CURRENCY}</span>
  </div>
{foreachelse}
  {#no_result#}
{/foreach}

{literal}
<script>
  if (window.innerWidth < 768) { /* süslü parantez burada güvenli */ }
</script>
{/literal}
```

- Smarty `{` ile başlar; bloğa yazılan JavaScript ve CSS’teki süslü parantezler `{literal}…{/literal}` içine alınmazsa şablon kırılır.
- Dil metni `{#anahtar#}` panelde Ayarlar → Diller altındaki sözlükten gelir.
- Linkler `/{$PAGE_LINK.X}` ile kurulur; sayfa adresleri mağaza dilinde ve panelden değiştirilebilir olduğu için elle yazılmaz.

V4 şablonu Smarty kalıtımını da kullanır: alt tema `{block name='firsat_sayac'}{/block}` gibi adlı blokları doldurur.

Görülen değiştiriciler: `|@count`, `|default:x`, `|replace:"a":"b"`, `|date_format:'Y,m-1,d,H,i,s'`. Geri sayım bloklarında `date_format` JavaScript `Date(y, m-1, …)` argümanı üretmek için kullanılır.

## Global değişkenler

Bloklarda doğrudan okunan bayraklar. Değerleri `1` / `0` veya `true` / `false` olabilir; karşılaştırmayı `== 1` ile yapmak iki durumda da çalışır.

| Değişken | Anlamı |
| --- | --- |
| `$BLOCK_ID`, `$BLOCK_TITLE` | Blok kimliği ve panelde yazılan başlık. Aynı blok sayfada iki kez olabileceği için HTML `id` değerlerine eklenir. |
| `$IS_MEMBER_LOGGED_IN` | Üye girişi var mı |
| `$IS_VENDOR_LOGIN` | Bayi girişi mi. Bayiye özel fiyat/menü için. Örnek: [Bayi hesabı koşulu](snippets/bayi-mi-degil-mi.tpl) |
| `$IS_CURRENT_ACCOUNT_ACTIVE` | Cari hesap modülü açık mı |
| `$IS_LAZY_LOAD_ACTIVE`, `$LAZY_LOAD_LOADING_IMAGE` | Tembel yükleme ve yer tutucu görsel |
| `$IS_HTTPS_ACTIVE` | HTTPS |
| `$DISPLAY_CART_BUTTON`, `$DISPLAY_BRAND`, `$DISPLAY_FAVOURITE_BUTTON`, `$DISPLAY_COMPARISON_BUTTON`, `$DISPLAY_PAGINATION`, `$DISPLAY_LANGUAGES` | Blok ayarlarındaki göster/gizle anahtarları |
| `$IS_ADD_TO_CART_VISIBLE`, `$IS_CALL_ME_ACTIVE`, `$IS_COMMENT_POINTS_ACTIVE`, `$IS_MESSAGE_ACTIVE`, `$IS_QUICK_MESSAGE_ACTIVE`, `$IS_RECOMMENDATION_ACTIVE`, `$IS_REMEMBER_ME_ACTIVE`, `$IS_SUGGESTION_BOX_ACTIVE`, `$IS_INLINE_SEARCH_ACTIVE` | Modül anahtarları |
| `$SITE_LOGO`, `$SEARCH_WORD`, `$CURRENCY`, `$CURRENCY_LIST`, `$LANGUAGE_LIST` | Üst blok verisi |
| `$MEMBER` | Giriş yapmış üyenin özeti |
| `$PAGE_LINK` | Sistem sayfalarının adresleri. Bkz. [Sayfa linkleri](degiskenler/tsoft-header-page-links-varriable.json) |
| `$SHOWCASE` | Vitrin bloğu ayarları (`S11` küçük resim, `S14` fare tekeri …) |
| `$THEME_V4`, `$THEME_PRODUCT`, `$THEME_GENERAL`, `$SUBTHEME_*` | Tema/alt tema seçimi |

Aynı veri tarayıcıda JavaScript global’leri olarak da vardır: `MEMBER_INFO` (`FIRST_NAME`, `LAST_NAME` …), `PRODUCT_DATA`, `PAGE_TYPE`, `CART_INFO`.

## Ürün alanları (`$P`)

Ürün listelerinde döngü değişkeni çoğunlukla `$P`, ürün detayında ise aktif ürün yine `$P` dir. Kısaltılmış örnek: [Ürün değişkenleri](degiskenler/tsoft-product-varriables.json).

| Grup | Alanlar |
| --- | --- |
| Kimlik | `ID`, `PRODUCT_CODE`, `BARCODE`, `SUPPLIER_PRODUCT_CODE`, `URL`, `TITLE`, `SHORT_DESCRIPTION`, `TAGS` |
| Fiyat | `PRICE_SELL`, `PRICE_NOT_DISCOUNTED`, `PRICE_BUY`, `VAT`, `DISPLAY_VAT`, `DISPLAY_GAIN`, `TARGET_CURRENCY`, `DISCOUNT_PERCENT`, `IS_DISCOUNT_ACTIVE`, `IS_DISPLAY_DISCOUNTED_ACTIVE` |
| Çoklu indirim | `IS_MULTIPLE_DISCOUNT_ACTIVE`, `MULTIPLE_DISCOUNT[]` |
| Stok | `STOCK`, `IN_STOCK`, `STOCK_UNIT`, `STOCK_INCREMENT`, `MIN_ORDER_COUNT` |
| Marka/model | `BRAND`, `BRAND_URL`, `MODEL`, `MODEL_URL` |
| Görsel | `IMAGE.SMALL` / `MEDIUM` / `BIG`, `IMAGE_LIST[n].SMALL`, `IMAGE_COUNT`, `HAS_MAGNIFIER`, `IS_VIDEO_ACTIVE` |
| Varyant | `HAS_VARIANT`, `VARIANT_ID`, `VARIANT_DATA`, `VARIANT_FEATURE1_TITLE`, `VARIANT_FEATURE1_LIST`, `VARIANT_FEATURE1_SELECTED`, `VARIANT_FEATURE2_LIST` |
| Ek alan | `ADDITIONAL_FIELD_1` … `ADDITIONAL_FIELD_3` (panelde ürün ek alanları; REST1 [product](../rest/product.md) modülünde `Additional1` … `Additional3` ile yazılır) |
| Fırsat | `DEAL_END_DATE`, `DEAL_PREV_DATE`, `DEAL_NEXT_DATE` |
| Bilgi | `WARRANTY_INFO`, `DELIVERY_INFO`, `DOCUMENT_INFO`, `WEIGHT`, `WIDTH`, `COMMENT_RANK` |
| Bayrak | `IS_NEW_PRODUCT`, `IS_DISPLAY_PRODUCT`, `IS_PERSONALIZATION_ACTIVE`, `PERSONALIZATION_ID`, `IS_RELATED_PRODUCTS_ACTIVE`, `IS_PRODUCT_SIZE_ACTIVE`, `SELECTED` |

`IS_DISPLAY_PRODUCT` doluysa ürün teşhir ürünüdür (satışa kapalı). Örnek V4 şablonu fiyat ve sepet alanını yalnız `{if $P.IS_DISPLAY_PRODUCT == 0}` iken basar.

## Menü ve kategori ağacı

Menü, kategori ve alt menü blokları aynı ağaç biçimini kullanır:

```json
[
  { "ID": "1", "NAME": "Kategoriler", "URL": "/kategoriler",
    "CHILDREN": [ { "ID": "2", "PARENT_ID": "1", "NAME": "Örnek", "URL": "/ornek", "STATUS": "1" } ] }
]
```

```smarty
{foreach $TABS as $M}
  <a href="{$M.URL}"{if $M.NEWTAB === true} target="_blank"{/if}>{$M.NAME}</a>
  {if $M.CHILDREN|@count > 0}
    {foreach $M.CHILDREN as $C}
      <a href="{$C.URL}">{$C.NAME}</a>
      {foreach $C.CHILDREN as $C2}…{/foreach}
    {/foreach}
  {/if}
{/foreach}
```

Örnek JSON’lar: [Üst sekmeler](degiskenler/tsoft-header-tabs-varriable.json), [Alt menü](degiskenler/tsoft-footer-menu-varriables.json), [Sol ve sağ kategori](degiskenler/tsoft-left-right-category-varriables.json).

## Blok kataloğu

Her bloğun döngü değişkeni farklıdır. Yeni blok yazarken önce o blok tipinin hangi listeyi verdiğine bakın.

| Blok | Dosya | Döngü / ana değişken |
| --- | --- | --- |
| Üst (header) | [ust.html](bloklar/ust.html) | `$TABS`, `$CURRENCY_LIST`, `$LANGUAGE_LIST`, `$PAGE_LINK` |
| Alt (footer) | [alt.html](bloklar/alt.html) | `$MENU`, `$SOCIAL_ICONS` |
| Yeni ürünler (sekmeli vitrin) | [yeni-urunler.html](bloklar/yeni-urunler.html) | `$TAB_LIST` (`ID`, `TITLE`, `SELECTED`), ürünler `$P` |
| Benzer ürünler | [benzer-urunler.html](bloklar/benzer-urunler.html) | `$P` |
| Fırsat ürünleri | [firsat-urunleri.html](bloklar/firsat-urunleri.html) | `$PRODUCT_LIST`, `DEAL_END_DATE` |
| Gelecek fırsatlar | [gelecek-firsat-urun-listesi.html](bloklar/gelecek-firsat-urun-listesi.html) | `$P`, `DEAL_NEXT_DATE` |
| Kategori menüsü | [kategori-menusu.html](bloklar/kategori-menusu.html) | `$CATEGORIES` → `$CHILD` |
| Kategori listesi | [kategori-listesi.html](bloklar/kategori-listesi.html) | `$DATA_LIST` |
| Marka listesi | [marka-listesi.html](bloklar/marka-listesi.html) | `$DATA_LIST`, `$LETTERS` |
| Model listesi | [model-listesi.html](bloklar/model-listesi.html) | `$DATA_LIST` |
| Tedarikçi listesi | [tedarikci-listesi.html](bloklar/tedarikci-listesi.html) | `$DATA_LIST` |
| Haberler | [haberler.html](bloklar/haberler.html) | `$NEWS_LIST` |
| SSS | [sss.html](bloklar/sss.html) | `$MESSAGE_LIST` |
| Görsel vitrin (slider) | [gorsel-vitrin.html](bloklar/gorsel-vitrin.html) | `$IMAGE_LIST`, `$SHOWCASE` |
| Ana sayfa banner | [home-banner.html](bloklar/home-banner.html) | Statik HTML |
| Ana sayfa indirim | [home-sale.html](bloklar/home-sale.html) | Statik HTML |
| Ayın yazarı | [ayin-yazari.html](bloklar/ayin-yazari.html) | Statik HTML |
| Parça toplama sihirbazı | [parca-toplama-sihirbazi.html](bloklar/parca-toplama-sihirbazi.html) | `$CATEGORIES` |

Şablon parçaları (`.tpl`):

| Dosya | İş |
| --- | --- |
| [user_v4tpl.tpl](orta/user_v4tpl.tpl) | V4 ürün detay orta alanı. Varyant için `{include file='Blok/UrunDetay/Orta/_alturun/1.tpl' …}` |
| [user_bayipanel.tpl](orta/user_bayipanel.tpl) | Bayi paneli; `MEMBER_INFO` ile ad yazar |
| [user_bayigirisplasiyer.tpl](orta/user_bayigirisplasiyer.tpl) | Bayi girişinde temsilci (plasiyer) kartı |
| [user_tasarimyenimenu.tpl](UstAlt/user_tasarimyenimenu.tpl) | Özel üst menü |
| [bayi-mi-degil-mi.tpl](snippets/bayi-mi-degil-mi.tpl) | Cari hesap ve kartla ödeme düğmeleri |

## Sık hatalar

- Bloğa eklenen `<script>` içindeki `{` karakteri: `{literal}` unutulursa blok boş görünür.
- `id="slider"` gibi sabit kimlikler: aynı blok iki kez eklenince çakışır; `id="slider-{$BLOCK_ID}"` yazın.
- Sabit sayfa adresleri (`/uye-girisi`): dil veya SEO adresi değişince kırılır; `$PAGE_LINK` kullanın.
- `$P.IMAGE_LIST.1.SMALL` ikinci görseldir (dizin 0’dan başlar). Hover görseli için önce `!= ''` kontrolü yapın.
- Fiyatı JavaScript ile hesaplamak: bayi ve grup fiyatı sunucuda `PRICE_SELL` içine işlenmiş gelir.
