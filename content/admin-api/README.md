---
title: Genel bakış
description: Panel iç API’si: taban, başlık, sayfalama, hata, yetki
---

# Admin API v3

T-Soft yönetim paneli (`*.tsoftpanel.com`, Nuxt ön yüzü) kendi verisini mağaza alan adındaki `/api/v3/admin/*` uçlarından okur ve yazar. Bu sayfa o uçların genel kurallarını anlatır. Uç listesi [Uç listesi](uclar.md), çalışılmış bir örnek [Ödeme bildirimi](odeme-bildirimi.md) sayfasındadır.

Kaynak: panel sürümü `v5.0.273` ön yüz paketi ve bu paketin çağırdığı 627 ekran parçası (24 Ekim 2026). Yollar panel kodunda sabit duran adreslerdir; tarama sırasında uçlar tek tek çağrılmadı. Resmi [T-SOFT Geliştirici Platformu](https://developer.tsoft.com.tr/) bu listeyi yayımlamıyor ("API Dokümanı · Yakında").

## İki farklı Admin API

Aynı önek iki ayrı yüzeyi taşır. Karıştırmayın.

| | Panel iç API’si | Uygulama Admin API’si |
| --- | --- | --- |
| Yol | `https://<mağaza>/api/v3/admin/<grup>/<kaynak>` | `https://<mağaza>/api/v3/admin/2026-01/<kaynak>` |
| Sürüm | Yolda yok. Panel sürümüyle birlikte değişir. | Tarihli (`2026-01`). Kırıcı değişiklik yeni tarihte gelir. |
| Kimlik | Panel oturumunun `Authorization: Bearer <panel token>` | OAuth `client_credentials` ile alınan token. Bkz. [Uygulama geliştirme](../developer/uygulama.md). |
| Biçim | Laravel JSON. `Accept: application/json` | JSON:API. `Accept: application/vnd.api+json`; başka değer **406** |
| Yetki | Panel kullanıcısının rolündeki izinler (`order:read` …) | Uygulamanın onaylanmış kapsamları (`read_orders` …) |
| Belge | Bu depo | Resmi site (henüz kapalı) |
| Kararlılık | Garanti yok. Panel güncellemesi bozabilir. | Sözleşmeli |

**Kural:** Kalıcı entegrasyon, mağaza dışı sunucu ve satışa çıkacak uygulama için uygulama Admin API’si veya [REST1](../rest/README.md) kullanılır. Panel iç API’si, panelde elle yapılan bir işi otomatikleştirmek, eksik bir REST1 metodunu doldurmak ya da panelin ne gönderdiğini anlamak içindir.

## Taban ve başlıklar

```http
GET /api/v3/admin/customers/payment-notification?sort=-id&limit=10 HTTP/1.1
Host: magaza.example
Authorization: Bearer <panel token>
Accept: application/json
```

- Taban adres **panel alan adı değil**, mağaza alan adıdır: `https://www.magaza.example`.
- Panel oturumunda token tarayıcı deposundaki `t-softpanel-auth` nesnesinin `laraToken` alanındadır (iki adımlı doğrulama açıksa erişim token’ı). Token kişiseldir; kodda, depoda ve paylaşılan belgede tutulmaz.
- Yazma isteklerinde `Content-Type: application/json` ve JSON gövde gider.
- Giriş uçları `api/v3/admin/auth/*` altındadır (`login`, `login-by-jwt`, `token`, `token-validate`, `two-factor`, `oauth/refresh`).

## HTTP metotları

Panel kodu metodu her çağrıda yazmaz. Gözlenen örnekler: liste `GET`, yeni kayıt `POST`, kimliği olan form kaydı `PUT`. Tablonun geri kalanı Laravel kaynak denetleyicisi kalıbından beklenen davranıştır; `DELETE` bu taramada denenmedi.

| İş | Metot | Yol |
| --- | --- | --- |
| Liste | `GET` | `/api/v3/admin/<kaynak>` |
| Tek kayıt | `GET` | `/api/v3/admin/<kaynak>/{id}` |
| Oluştur | `POST` | `/api/v3/admin/<kaynak>` |
| Güncelle | `PUT` | `/api/v3/admin/<kaynak>/{id}` |
| Sil | `DELETE` | `/api/v3/admin/<kaynak>/{id}` |
| Toplu iş | `POST` | `/api/v3/admin/<kaynak>/batch` veya `.../batch-<iş>` |
| Sıralama | `POST` / `PUT` | `/api/v3/admin/<kaynak>/sortable` |

Sonu `/` ile biten yollar (ör. `orders/order/`) kimliği sona ekleyerek çağrılır. Liste [Uç listesi](uclar.md#kimlik-eklenen-yollar) sayfasında.

## Liste cevabı

Liste uçları Laravel sayfalaması döner:

```json
{
  "status": true,
  "data": [ { "id": 29, "createdAt": 1761313860 } ],
  "links": { "first": "...?page=1", "last": "...?page=3", "prev": null, "next": "...?page=2" },
  "meta": { "current_page": 1, "last_page": 3, "per_page": 10, "total": 27 },
  "sortable": ["id", "createdAt"]
}
```

| Sorgu | Anlamı |
| --- | --- |
| `limit` | Sayfa boyutu |
| `page` | Sayfa numarası, 1’den başlar |
| `sort` | Alan adı; başında `-` azalan sıradır (`sort=-id`). İzinli alanlar cevaptaki `sortable` dizisindedir. |
| `filter[alan]` | Her uçta çalışmaz. `payment-notification` üzerinde `filter[customerId]` süzmedi; ilk sayfa döndü. Süzgeç kullanmadan önce sonucu kontrol edin. |

Ortak gözlemler:

- Zaman alanları (`createdAt`) **unix saniyesi**dir.
- Para alanları listede string (`"3000.00"`), yazarken sayı gider.
- Anahtar/bayrak alanları JSON boolean değil `0` / `1` tamsayıdır.
- Alan adları camelCase’tir (`customerId`, `formId`). REST1’deki PascalCase (`CustomerId`) ile aynı değildir.

## Hata cevapları

| HTTP | Gövde | Anlamı |
| --- | --- | --- |
| 401 | Laravel varsayılanı `{"message":"Unauthenticated."}` (bu taramada gözlenmedi) | Token yok veya süresi dolmuş |
| 403 | — (gözlenmedi) | Rol bu izni vermiyor |
| 422 | `{"message": "...", "errors": {"alan": ["..."]}}` | Laravel doğrulaması. `errors` alan bazında dizidir. |
| 429 | `Too Many Attempts.` | Hız sınırı. Cevapta `retryAfter` (saniye) ve `throttle.limit` vardır. `batch-recreate` için sınır 5 idi. |
| 500 | `{"message":"Server Error"}` | Sunucu kaydı işlerken düştü. Alan adı söylemez; gövdeyi panelin gönderdiğiyle karşılaştırın. |

## Yetki adları

Panel kodu 30 yol için gereken izni yanında taşır. Biçim `<alan>:<kaynak>:<eylem>`; `read` okuma, `manage` yönetim, `create` / `update` yazmadır. Rol, panelde Ayarlar → Kullanıcılar ve İzinler altında atanır.

| Yol | İzin |
| --- | --- |
| `api/v3/admin/analytics/report` | `analytics:report:read` |
| `api/v3/admin/analytics/log` | `analytics:log:read` |
| `api/v3/admin/analytics/risk` | `analytics:report:read` |
| `api/v3/admin/orders/order` | `order:read`, `order:update` |
| `api/v3/admin/orders/product` | `order:read` |
| `api/v3/admin/orders/status` | `order:status:read`, `order:status:manage` |
| `api/v3/admin/orders/return` | `order:return:manage`, `order:read` |
| `api/v3/admin/orders/refund` | `order:refund:manage`, `order:read` |
| `api/v3/admin/orders/transaction` | `order:transactions:read`, `order:read` |
| `api/v3/admin/orders/static/platform` | `order:read` |
| `api/v3/admin/orders/cargo/company` | `config:cargo_company:read`, `config:cargo_company:manage` |
| `api/v3/admin/orders/payment/method` | `config:payment_method:read`, `config:payment_method:manage` |
| `api/v3/admin/orders/address-field` | `config:address_fields:manage` |
| `api/v3/admin/catalog/products` | `catalog:product:read`, `catalog:product:update`, `catalog:product:create` |
| `api/v3/admin/catalog/comments` | `catalog:comment:read`, `catalog:comment:manage` |
| `api/v3/admin/catalog/alarm` | `catalog:product:alarm` |
| `api/v3/admin/catalog/definitions/categories` | `catalog:category:read`, `catalog:category:manage` |
| `api/v3/admin/catalog/definitions/brands` | `catalog:brand:read`, `catalog:brand:manage` |
| `api/v3/admin/catalog/definitions/models` | `catalog:model:read`, `catalog:model:manage` |
| `api/v3/admin/catalog/definitions/filter` | `catalog:attribute:read`, `catalog:attribute:manage` |
| `api/v3/admin/catalog/definitions/personalization` | `catalog:personalization:read`, `catalog:personalization:manage` |
| `api/v3/admin/customers/customer` | `customer:read`, `customer:update`, `customer:create` |
| `api/v3/admin/customers/cart` | `customer:read` |
| `api/v3/admin/customers/group` | `customer:group:read`, `customer:group:manage` |
| `api/v3/admin/customers/segment` | `customer:segment:read`, `customer:segment:manage` |
| `api/v3/admin/customers/messages` | `customer:message:read`, `customer:message:manage` |
| `api/v3/admin/customers/payment-notification` | `customer:payment_notification:read`, `customer:payment_notification:manage` |
| `api/v3/admin/customers/fields` | `config:member_field:read`, `config:member_field:manage` |
| `api/v3/admin/customers/billing/account-balance` | `customer:account:read`, `customer:account:manage` |
| `api/v3/admin/campaigns` | `campaign:read`, `campaign:manage` |

## Uç gruplarının özeti

Toplam 357 uç ve kimlik eklenerek kullanılan 35 yol.

| Grup | Uç | Ne işe yarar |
| --- | ---: | --- |
| [analytics](uclar.md#analitik) | 30 | Rapor, canlı ziyaretçi, arama boşluğu, personel ve fiyat/stok logu, risk |
| [auth](uclar.md#oturum) | 24 | Giriş, jeton, iki adım, panel kullanıcısı ve rol |
| [campaigns](uclar.md#kampanya) | 6 | Kampanya, hediye kodu, puan ve öneri |
| [catalog](uclar.md#katalog) | 41 | Ürün, kategori, marka, varyant, grup fiyatı, görsel ve yorum |
| [cms](uclar.md#içerik) | 12 | Blog, haber, SSS, galeri ve içerik |
| [configuration](uclar.md#ayarlar) | 69 | Dil, para, bölge, POS, bildirim şablonu, yönlendirme, webhook, önbellek |
| [crm](uclar.md#crm) | 6 | Mağaza, destek bileti ve ziyaretçi defteri |
| [customers](uclar.md#üye) | 23 | Üye, grup, segment, sepet, sadakat, mesaj, cari bakiye, ödeme bildirimi |
| [file-manager](uclar.md#dosya) | 1 | Dosya yöneticisi |
| [integration](uclar.md#entegrasyon) | 45 | Nova (yapay zekâ), Sendheap, T-Soft Apps, Hotnoc, Nilcare |
| [marketing](uclar.md#pazarlama) | 5 | İşbirliği ve affiliate |
| [online-store](uclar.md#vitrin) | 10 | Eski tema motoru: sayfa, menü, blok, tema |
| [online-store-2](uclar.md#yeni-vitrin) | 25 | Yeni (Twig) tema, vitrin satır/sütun, geliştirici çalışma alanı |
| [orders](uclar.md#sipariş) | 44 | Sipariş, kargo, iade, iade ödemesi, taksit, POS, depo |
| [packages, partner, supplier, tool, oauth, public](uclar.md#diğer) | 16 | Form uygulaması, partner erişimi, tedarikçi paneli, araçlar |

## Bir panel ekranının uçlarını bulmak

Liste her ekranın gövdesini anlatmaz. Gövdeyi öğrenmenin güvenli yolu:

1. Panelde ilgili ekranı açın, tarayıcı geliştirici araçlarında **Network** sekmesini `api/v3/admin` ile süzün.
2. Ekranda işlemi bir kez elle yapın ve giden isteğin metodunu, yolunu ve gövdesini kaydedin.
3. Aynı gövdeyle önce test mağazasında deneyin. 422 cevabındaki `errors` zorunlu alanları verir.
4. Token’ı ve kişisel veriyi notlara yazmayın.

[Ödeme bildirimi](odeme-bildirimi.md) sayfası bu yöntemle çıkarılmış tam bir örnektir.
