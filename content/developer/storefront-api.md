---
title: Storefront API
description: Vitrin ve mobil istemci, JSON:API, 2026-01
---

# Storefront API

Kaynak: [Storefront API](https://developer.tsoft.com.tr/storefront-api/genel-bakis). Anlık: doküman **1.9.0** (18 Eylül 2026 günlüğü), API yolu **2026-01**. Alan listeleri resmi sayfadadır.

Bu depodaki [REST1](../rest/README.md) panel web servisidir (`/rest1`, form gövdesi, `token`). Storefront vitrin ve mobil istemci içindir.

## Sözleşme

Taban:

```text
https://<domain>/api/v3/storefront/2026-01
```

Sürüm path içindedir. Yayındaki sürümün var olan alanı kalkmaz ve tipi değişmez. Yeni alan eklenebilir. Kırıcı değişiklik yeni tarihli sürümde yayınlanır; eski sürüm bir süre paralel kalır. Kaldırılacak alan önce deprecated işaretlenir.

Zorunlu başlık:

```text
Accept: application/vnd.api+json
```

Başka `Accept` değeri **406** döner. Genel bakış, herkese açık kataloğun token’sız okunabildiğini yazar. Aynı sayfa `Authorization: Bearer <access_token>` başlığını da zorunlu başlıklar arasında listeler. Uygulama için belgelenen katalog yolu client token’dır.

Yanıt JSON:API biçimindedir. Kökte `data` tek kayıtta nesne, listede dizidir. Alanlar `attributes` altındadır. `?include=` ilişkileri `included[]` dizisine koyar. Sayfalı listede zarf şöyledir:

```json
{
  "meta": { "page": { "currentPage": 1, "from": 1, "to": 20, "perPage": 20, "lastPage": 8, "total": 156 } },
  "jsonapi": { "version": "1.0" },
  "links": { "first": "...", "next": "...", "last": "..." },
  "data": []
}
```

`page[size]` yoksa boyut 20’dir. Son sayfada `links.next` yoktur.

Süzgeç `filter[alan]`, sıralama `sort`, alan seçimi `fields[tip]`. Hatalar `errors[]` içindedir: `status`, `title`.

| Durum | Anlamı |
| --- | --- |
| 400 | Geçersiz filtre veya sıralama |
| 401 | Token yok, süresi dolmuş veya iptal |
| 403 | Token var, scope yok |
| 404 | Kayıt yok veya gizli |
| 406 | `Accept` yanlış |
| 429 | `client_id` hız sınırı |

## Kimlik

Token uçları sürüm klasörünün dışındadır. Scope istekte seçilmez; sunucu basar.

| Scope | Ne açar | Hangi token |
| --- | --- | --- |
| `storefront:read` | Katalog okuma | client ve müşteri |
| `storefront:pricing` | `discountPrice` alanı | yalnız müşteri |
| `storefront:account` | Sipariş, adres, favori, destek | yalnız müşteri |
| `storefront:cart` | Misafir sepeti | yalnız misafir |

| İş | Çağrı |
| --- | --- |
| Client token | `POST /api/v3/storefront/token` gövde `{"client_id":"<UUID>"}`. `client_id` gizli anahtar değildir. Dönüş `access_token`, `token_type`, `expires_at`, `scope`. |
| Müşteri token | `POST /api/v3/storefront/customer/token` gövde `identifier` (e-posta veya telefon), `password`, `device_name`. Süre 30 gün. Aynı `device_name` eski token’ı düşürür. |
| Yenileme | `POST /api/v3/storefront/customer/token/refresh` müşteri token’ı ile |
| Sosyal giriş | `POST /api/v3/storefront/customer/token/social`. `SocialPlatform`: `google`, `apple`, `facebook`. `SocialToken`, `device_name` zorunlu. `Platform` ve `guestCartToken` isteğe bağlı. Sağlayıcı panelde ayrıca kurulur. |
| Çıkış | `DELETE /api/v3/storefront/customer/token` → 204. `?all=1` bütün cihazları kapatır. |
| Misafir | `POST /api/v3/storefront/2026-01/guest-token` ve `Authorization: Bearer <CLIENT_TOKEN>`. Scope `storefront:cart`. |
| Kayıt | `POST /api/v3/storefront/customer/register` |
| SMS doğrulama | `POST /api/v3/storefront/customer/register/verify` |
| Parola | `POST /api/v3/storefront/customer/forgot-password` |

Bilinmeyen veya pasif `client_id` client token isteğinde `401` ve `invalid_client` döner. Sepet ucuna client token ile gidilince 401 döner. Sepet, müşteri token’ında `storefront:account`, misafir token’ında `storefront:cart` ister.

`discountPrice` yalnız `storefront:pricing` ve üründe aktif indirim varken gelir. Alan yoksa yanıtta hiç durmaz; `null` gelmez.

## Para

Fiyat alanları sayı değildir. `amount` string’dir, ondalık ayraç noktadır. `currencyCode` ISO 4217’dir ve ürünün kendi kodudur. `decimalPlaces` yalnız gösterim içindir. Toplam ve KDV için decimal aritmetik kullanılır.

## Uçlar

Yol öneki `https://<domain>/api/v3`. Katalog `storefront/2026-01`, hesap `storefront/account/2026-01`.

### Açılış ve katalog

| Metot | Yol | Not |
| --- | --- | --- |
| GET | `/storefront/config?client_id=` | Sürüm, dil, para birimi, `featureFlags`. `client_id` + IP için dakikada 5 okuma; aşımda 429 ve `Retry-After`. `client_id` yoksa sınırsız. Hatalı `client_id` 200 ve `storefrontToken: null` üretir. |
| GET | `/storefront/2026-01/products` | `page[number]`, `page[size]`. Tekil `.../products/{id}`. `include=comments`. `fields[products]=name,attributes`. |
| GET | `/storefront/2026-01/categories` | Kök için `filter[parentId]=0`. Tekil `.../categories/{id}`. |
| GET | `/storefront/2026-01/brands` | Tekil `.../brands/{id}` |
| GET | `/storefront/2026-01/comment-rating-breakdowns` | `filter[productId]=771` veya virgüllü liste |
| GET | `/storefront/2026-01/product-facets` | Filtre paneli ve sıralama seçenekleri |
| GET | `/storefront/2026-01/branch-offices` | Tekil `.../branch-offices/{id}` |
| GET | `/storefront/2026-01/pages` | Tekil `.../pages/{id}` |
| GET | `/storefront/2026-01/settings` | Tekil `.../settings/{anahtar}`. `id` ayar anahtarıdır. |
| GET | `/storefront/2026-01/regions` | `filter[type]=city`. Tekil `.../regions/{id}` |
| GET | `/storefront/2026-01/delivery-slots` | `filter[countryCode]`, `cityCode`, `townCode`, `districtCode` |
| GET | `/storefront/2026-01/cargo-companies` | `filter[isActive]=true`. Tekil `.../{id}` |
| GET | `/storefront/2026-01/payment-options` | `filter[productId]` |
| GET | `/storefront/2026-01/loyalty-earning-previews` | `filter[productId]=771,772` |
| GET | `/storefront/2026-01/representatives` | Satış temsilcileri |
| GET | `/storefront/2026-01/menus` | Tekil `.../menus/MENU_MOBILE`. `filter[id]=MENU_MOBILE` |
| GET | `/storefront/2026-01/link?url=` | Slug, `tel:` ve site kökü. `data.type` rota, arama veya telefon olur. |
| GET | `/storefront/2026-01/customer-form-fields` | Kayıt formu. `filter[formType]=register` |

1.9.0 ile ürün süzgeçlerine `filter[modelId]`, `filter[variantType1Id]`, `filter[variantType2Id]`, `filter[isNew]`, `filter[attr]` eklendi. Sıralama: `-viewCount`, `-recommendationCount`, `-commentCount`, `-favoriteCount`, `random`, `position`. `sort=price` gösterilen fiyata göredir. `MENU_MOBILE` veya `X-Storefront-Platform: ios|android` mobil gizlenen kategorileri düşürür.

### Hesap

Müşteri token’ı gerekir.

| Metot | Yol |
| --- | --- |
| GET, PATCH, DELETE | `/storefront/account/2026-01/customers/me` |
| GET, POST | `/storefront/account/2026-01/addresses` |
| PATCH, DELETE | `/storefront/account/2026-01/addresses/{id}` |
| GET | `/storefront/account/2026-01/address-fields` ve `.../address-fields/{id}` |
| GET, POST | `/storefront/account/2026-01/favorites` |
| GET, DELETE | `/storefront/account/2026-01/favorites/{id}` |
| GET, POST | `/storefront/account/2026-01/alarms` |
| GET, DELETE | `/storefront/account/2026-01/alarms/{id}` |
| GET | `/storefront/account/2026-01/coupons` |
| GET | `/storefront/account/2026-01/loyalty-transactions` |
| GET | `/storefront/account/2026-01/tax-offices` |
| GET | `/storefront/account/2026-01/customer-form-fields` |
| GET | `/storefront/account/2026-01/orders` ve `.../orders/{id}` |
| POST | `/storefront/account/2026-01/order-returns` |
| GET | `/storefront/account/2026-01/order-return-reasons` |
| GET | `/storefront/account/2026-01/order-return-pick-dates` |
| POST | `/storefront/account/2026-01/order-cancellation-requests` |
| GET, POST | `/storefront/account/2026-01/support-tickets` |
| GET | `/storefront/account/2026-01/support-tickets/{id}?include=messages` |
| GET, POST | `/storefront/account/2026-01/support-ticket-messages` |
| GET | `/storefront/account/2026-01/support-departments` |
| POST | `/storefront/account/2026-01/product-comments` |
| POST | `/storefront/account/2026-01/product-comments/with-image` |
| POST | `/storefront/account/2026-01/personalizations/with-image` |

Sipariş include örneği: `include=products,deliveryAddress,invoiceAddress,returns`. İade alım tarihi `filter[order]` ve `filter[cargoCompany]` ister. Görsel uçları `multipart/form-data` kullanır; yanıt JSON’dur. Kişiselleştirme alanı `productId` ve `image` dir, başarı **201**.

Favori listesi `sort` yokken en son eklenen başta döner (1.9.0).

### Sepet

Müşteri token’ı veya misafir token’ı. Satır gövdesi düz JSON’dur; `data` sarmalayıcısı yoktur.

| Metot | Yol |
| --- | --- |
| GET, DELETE | `/storefront/2026-01/cart` |
| POST | `/storefront/2026-01/cart-items` |
| PATCH | `/storefront/2026-01/cart-items/{id}` |
| PATCH | `/storefront/2026-01/cart-items/{id}/notes` |
| DELETE | `/storefront/2026-01/cart-items/{id}` |
| POST, DELETE | `/storefront/2026-01/cart/coupon` |
| POST, DELETE | `/storefront/2026-01/cart/campaign` |
| POST | `/storefront/2026-01/cart/image-notes` |

Kupon gövdesi `couponCode` (en fazla 100 karakter). Kampanya gövdesi `campaignId` (tam sayı, en az 1). DELETE gövdesizdir; yanıt güncel sepet dokümanıdır. Geçerli kupon `appliedCoupon` ve `discountTotal` ekler. `campaigns` salt okunur listedir.

Misafir sepeti girişte taşınır: müşteri token isteğine `guestCartToken` eklenir. Birleşmeden sonra eski misafir token’ı 401 döner.

### Ödeme devri

Uygulama ödeme ekranı çizmez. Üye veya misafir için tek kullanımlık oturum üretilir; tarayıcı devir adresine gider.

| Metot | Yol |
| --- | --- |
| POST | `/storefront/2026-01/checkout-session` |
| POST | `/storefront/2026-01/checkout-guest-session` |
| GET | `/storefront/checkout/handoff?t=<token>` |

## Sayfa dizini

| Sayfa | Adres |
| --- | --- |
| Genel bakış | https://developer.tsoft.com.tr/storefront-api/genel-bakis |
| Kimlik | https://developer.tsoft.com.tr/storefront-api/kimlik-dogrulama |
| Para | https://developer.tsoft.com.tr/storefront-api/money |
| Ürünler | https://developer.tsoft.com.tr/storefront-api/urunler |
| Kategoriler | https://developer.tsoft.com.tr/storefront-api/kategoriler |
| Markalar | https://developer.tsoft.com.tr/storefront-api/markalar |
| Yorumlar | https://developer.tsoft.com.tr/storefront-api/yorumlar |
| Puan dağılımı | https://developer.tsoft.com.tr/storefront-api/07a.yorum-puan-dagilimi |
| Şubeler | https://developer.tsoft.com.tr/storefront-api/subeler |
| Sayfalar | https://developer.tsoft.com.tr/storefront-api/sayfalar |
| Ayarlar | https://developer.tsoft.com.tr/storefront-api/ayarlar |
| Bölgeler | https://developer.tsoft.com.tr/storefront-api/bolgeler |
| Teslimat slotları | https://developer.tsoft.com.tr/storefront-api/teslimat-slotlari |
| Hesap | https://developer.tsoft.com.tr/storefront-api/hesap |
| Adresler | https://developer.tsoft.com.tr/storefront-api/adresler |
| Adres alanları | https://developer.tsoft.com.tr/storefront-api/adres-alanlari |
| Favoriler | https://developer.tsoft.com.tr/storefront-api/favoriler |
| Fiyat alarmları | https://developer.tsoft.com.tr/storefront-api/fiyat-alarmlari |
| Kuponlar | https://developer.tsoft.com.tr/storefront-api/kuponlar |
| Sadakat | https://developer.tsoft.com.tr/storefront-api/sadakat-hareketleri |
| Vergi daireleri | https://developer.tsoft.com.tr/storefront-api/vergi-daireleri |
| Müşteri form alanları | https://developer.tsoft.com.tr/storefront-api/musteri-form-alanlari |
| Siparişler | https://developer.tsoft.com.tr/storefront-api/siparisler |
| İadeler | https://developer.tsoft.com.tr/storefront-api/siparis-iadeleri |
| İade nedenleri | https://developer.tsoft.com.tr/storefront-api/iade-nedenleri |
| İade alım tarihleri | https://developer.tsoft.com.tr/storefront-api/iade-alim-tarihleri |
| İptal talepleri | https://developer.tsoft.com.tr/storefront-api/siparis-iptal-talepleri |
| Destek talepleri | https://developer.tsoft.com.tr/storefront-api/destek-talepleri |
| Destek mesajları | https://developer.tsoft.com.tr/storefront-api/destek-mesajlari |
| Destek departmanları | https://developer.tsoft.com.tr/storefront-api/destek-departmanlari |
| Sürümler | https://developer.tsoft.com.tr/storefront-api/surumler |
| Menüler | https://developer.tsoft.com.tr/storefront-api/menuler |
| Kargo | https://developer.tsoft.com.tr/storefront-api/kargo-firmalari |
| Ödeme seçenekleri | https://developer.tsoft.com.tr/storefront-api/odeme-secenekleri |
| Puan önizleme | https://developer.tsoft.com.tr/storefront-api/puan-kazanim-onizlemesi |
| Satış temsilcileri | https://developer.tsoft.com.tr/storefront-api/satis-temsilcileri |
| Kayıt ve parola | https://developer.tsoft.com.tr/storefront-api/kayit-ve-parola |
| Kayıt form alanları | https://developer.tsoft.com.tr/storefront-api/kayit-form-alanlari |
| Görsel yükleme | https://developer.tsoft.com.tr/storefront-api/gorsel-yukleme |
| Sepet | https://developer.tsoft.com.tr/storefront-api/sepet |
| Misafir sepeti | https://developer.tsoft.com.tr/storefront-api/misafir-sepeti |
| Ödeme devri | https://developer.tsoft.com.tr/storefront-api/odeme-devri |
| Yorum yazma | https://developer.tsoft.com.tr/storefront-api/yorum-yazma |
| Link | https://developer.tsoft.com.tr/storefront-api/link |
| Yapılandırma | https://developer.tsoft.com.tr/storefront-api/config |
| Ürün filtreleri | https://developer.tsoft.com.tr/storefront-api/urun-filtreleri |
