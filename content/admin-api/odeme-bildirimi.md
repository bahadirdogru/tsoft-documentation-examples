---
title: Ödeme bildirimi
description: Uçtan uca örnek: gövde, doğrulama, bilinen sorunlar
---

# Ödeme bildirimi

Panel ekranı: Customers → **Payment Notifications** (`/customer/current/payment-notification`). Sağdaki çekmece **Create Payment Notification** üyeye ödeme linki üretir. Panel `v5.0.273`, deneme 24 Ekim 2026.

Bu sayfa panel iç API’sinin bir ekranını uçtan uca anlatır: ne gönderilir, ne döner, neler kırılır. Genel kurallar [Admin API v3](README.md) sayfasındadır.

## Özet

| İş | Çağrı | İzin |
| --- | --- | --- |
| Liste | `GET /api/v3/admin/customers/payment-notification?sort=-id&limit=10` | `customer:payment_notification:read` |
| Tek kayıt | `GET /api/v3/admin/customers/payment-notification/{id}` | `customer:payment_notification:read` |
| Oluştur | `POST /api/v3/admin/customers/payment-notification` | `customer:payment_notification:manage` |
| Yeniden gönder | `POST /api/v3/admin/customers/payment-notification/batch-recreate` | `customer:payment_notification:manage` |
| Ödeme formları | `GET` / `POST` / `PUT /api/v3/admin/customers/billing/payment-form` | — |

Taban mağaza alan adıdır (`https://www.magaza.example`), panel alan adı değil. Başlıklar: `Authorization: Bearer <panel token>`, `Accept: application/json`, yazmada `Content-Type: application/json`.

## Oluştur

`POST /api/v3/admin/customers/payment-notification`

Kaynak adı `customer.pay_notify`. Çekmece formu olduğu gibi gönderir. Üye seçilince panel `customerId` ve `name` (ad + soyad) alanlarını doldurur.

| Ekran | JSON | Tip | Not |
| --- | --- | --- | --- |
| Select Member | `customerId` | sayı | **Zorunlu.** Bkz. [bilinen sorun](#customerid-sorunu). |
| Select Member | `name` | string | Ad soyad |
| — | `company` | string | Çekmecede alan yok; `""` gider |
| Description | `description` | string | |
| Price | `price` | sayı | **Zorunlu.** Listede string döner |
| Payment Forms | `formId` | sayı | `billing/payment-form` listesindeki `id` |
| Currency | `currency` | string | `TL`, `USD` … Varsayılan `TL` |
| Fixed price | `constantPrice` | `0` / `1` | Açıkken müşteri tutarı değiştiremez |
| Show Description | `descriptionSeen` | `0` / `1` | Açıklama ödeme sayfasında görünür |
| Description Fixed | `constantDescription` | `0` / `1` | Açıklama değiştirilemez |

Anahtarlar JSON boolean değil `0` / `1` gider. Formun boş hali: `price` ve `formId` `null`, üç anahtar `0`, `currency` `"TL"`.

```json
{
  "name": "Örnek Üye",
  "company": "",
  "description": "Kasım siparişi",
  "price": 500,
  "formId": 1,
  "constantPrice": 1,
  "constantDescription": 0,
  "descriptionSeen": 1,
  "currency": "TL",
  "customerId": 1234
}
```

Başarılı dönüşte panel çekmeceyi kapatır, formu sıfırlar, listeyi yeniden çeker ve cevaptaki `message` metnini gösterir.

### Doğrulama denemeleri

| Gövde | HTTP | Cevap |
| --- | --- | --- |
| `{}` | 422 | `customerId` zorunlu, `price` zorunlu |
| `customerId` yok, diğer alanlar dolu | 422 | `customerId` zorunlu |
| `price` `null` | 422 | `price` zorunlu |
| Geçerli sayısal `customerId`, `price` 1, `currency` `TL`, `formId` 1 | 500 | `{"message":"Server Error"}` |
| `price` 0 veya -5 | 500 | `Server Error` |
| `currency` `XXX` | 500 | `Server Error` |
| `formId` 999 | 500 | `Server Error` |
| `customerId` string (`"T1234"`) | 200 | Kayıt açılır ama `customerId` `0` yazılır |

### customerId sorunu

Bu sürümde iki yol da doğru sonuç vermedi:

- **Sayısal `customerId`** üyeyi bulur ve kayıt sırasında sunucu **500** ile düşer. Kayıt açılmaz.
- **String `customerId`** (ör. web servis kodu `"T1234"`) doğrulamadan geçer, **200** ve `status: true` döner, satır yazılır; fakat okununca `customerId` **0** dır. Bildirim hiçbir üyeye bağlı değildir. 200 cevabı başarı sayılmamalıdır.

Ek olarak panelin üye seçicisi, aynı üyenin `GET /api/v3/admin/customers/customer/{id}` ile okunan `id` değerinden farklı bir sayı yazdı. Seçicinin döndürdüğü kimlik ile üye kartının `id` alanı aynı alan değildir. Kayıttan sonra daima `GET .../payment-notification/{id}` ile `customerId` doğrulanmalıdır.

## Liste

`GET /api/v3/admin/customers/payment-notification?sort=-id&limit=10` → HTTP 200, Laravel sayfalaması (`data`, `links`, `meta`, `sortable`, `status`). `page=2` sonraki sayfadır. `filter[customerId]=…` süzmedi.

Satır alanları:

| Alan | Not |
| --- | --- |
| `id` | Bildirim kimliği |
| `ip` | Oluşturan IP |
| `customerId`, `name`, `company`, `customerAccountId` | Üye bağlantısı |
| `price` | String, `"3000.00"` |
| `currency`, `description` | |
| `constantPrice`, `constantDescription`, `descriptionSeen` | `0` / `1` |
| `pageSeen`, `emailRead` | Müşteri sayfayı / e-postayı açtı mı |
| `token` | Ödeme linkini kurar: `https://www.magaza.example/pay?token={token}` |
| `createdAt` | Unix saniyesi |
| `returnUrl`, `returnAnswer`, `returnUrlActive` | Ödeme sonrası geri dönüş |
| `wsNotificationCode` | Web servis bildirim kodu |
| `isDeleted` | Silinme bayrağı |
| `formId` | Eski satırlarda `0` |

`token` ödemeyi kimlik doğrulamasız açar; log ve belgeye yazılmaz.

## Ödeme formları

`GET /api/v3/admin/customers/billing/payment-form` ödeme sayfasında müşteriden istenecek alanları tanımlayan formları listeler. Kayıt `POST`, güncelleme `PUT` ile aynı yola gider.

```json
{
  "id": 1,
  "title": "Ödeme Formu",
  "form": "[{\"id\":1,\"title\":\"Ad\",\"type\":\"text\",\"default\":\"\",\"mandatory\":1,\"min\":0,\"max\":0,\"regex\":\"\"}]"
}
```

`form` alanı **JSON metni** olarak saklanır (dizi değil). Örnekteki öğe değerleri biçimi göstermek içindir. Öğe alanları: `id`, `title`, `type`, `default`, `mandatory`, `min`, `max`, `regex`. Görülen alanlar Ad, Soyad ve T.C. Kimlik No. Çekmecedeki Payment Forms seçicisi bu listenin `id` ve `title` alanlarını kullanır.

## Yeniden gönder

`POST /api/v3/admin/customers/payment-notification/batch-recreate`

```json
{ "notificationIds": [29] }
```

| Gövde | HTTP | Cevap |
| --- | --- | --- |
| `{}` veya `[]` | 422 | `notificationIds` zorunlu |
| `[0]` | 422 | Kayıt silinmiş veya ödenmiş olabilir |
| `["x"]` | 422 | Aynı mesaj; ayrıca `notificationIds.0` tamsayı olmalı |
| `[29]` | 200 | `data.queued` = 1. Kuyruk işi `recreate-payment-notification` |
| Hemen ardından iki istek | 429 | `Too Many Attempts.` `throttle.limit` 5, `retryAfter` saniye |

İş kuyruğa alınır; cevap e-postanın gittiği anlamına gelmez.

## E-posta şablonu

Bildirim e-postası panelde `/setting/email/notifications?tab=payment&code=payment_notification_message` ekranından düzenlenir. Şablon ayarı bu ekranın kaydetme isteğinden bağımsızdır.

## REST1 karşılığı

REST1 kataloğunda ödeme bildirimi oluşturan bir metot yoktur. Cari hareket için [FundMovement](../rest/fundmovement.md), havale bildirimi için [`payment/setWireTransfers`](../rest/payment.md) vardır.
