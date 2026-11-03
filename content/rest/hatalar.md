---
title: Hatalar ve mesaj kodları
description: Zarf, mesaj kodları, HTTP hataları, konsol
---

# Hatalar ve mesaj kodları

REST1 her yanıtı aynı zarfla döner. Bu sayfa zarfı, görülen mesaj kodlarını ve HTTP katmanındaki hataları toplar. Kodlar 19–20 Ekim 2026 konsol kataloğundan ve canlı çağrılardan derlenmiştir; T-Soft tam bir kod listesi yayımlamıyor.

## Zarf

```json
{
  "success": true,
  "data": [ { "CustomerId": 1234, "MobileToken": "..." } ],
  "message": [
    {
      "type": 1,
      "code": "CUI002",
      "index": 0,
      "id": "T1001",
      "subid": "",
      "text": ["Müşteri başarıyla oluşturuldu!"],
      "errorField": []
    }
  ],
  "summary": { "totalRecordCount": "1362" }
}
```

| Alan | Anlamı |
| --- | --- |
| `success` | Partinin tamamı başarılıysa `true`. Toplu yazmada bir satır hata verirse `false` olur, başarılı satırlar geri alınmaz. |
| `data` | Sonuç. Boş sonuçta `null` döner; bu hata değildir. |
| `message[]` | Her satır için bir öğe. `index` gönderilen `data` dizisindeki sıra, `id` / `subid` kaydın kodudur. |
| `message[].type` | `1` başarı, `2` hata. |
| `message[].text` | Dizi. Birden çok metin taşıyabilir. |
| `message[].errorField` | Hatanın bağlandığı alan adları, örneğin `["Email"]`. |
| `summary.totalRecordCount` | Liste metotlarında toplam kayıt; **string** döner. |
| `extra` | Bazı yanıtlarda `null` olarak gelir. |

Toplu yazmada her zaman `message[]` satır satır okunmalıdır. `success: false` yalnızca "en az bir satır hatalı" demektir.

## Mesaj kodları

Kod biçimi: modül öneki + `I` (bilgi/başarı) veya `E` (hata) + üç hane. Örnek: `CU` müşteri, `PR` ürün, `AU` kimlik, `GN` genel.

| Kod | Tür | Metin / durum | Nerede |
| --- | --- | --- | --- |
| `AUI001` | başarı | `Giriş yapıldı!` | [`auth/login`](auth.md) |
| `AUI006` | hata | `Token bulunamadı!` · HTTP 401 | Token göndermeden yapılan her çağrı, konsoldaki `ConsoleHelper` dahil |
| `GNI001` | başarı | Liste döndü | [`customer/getCustomerGroups`](customer.md) |
| `CUI001` | başarı | `Müşteri başarıyla güncellendi!` | [`customer/setCustomers`](customer.md) |
| `CUI002` | başarı | `Müşteri başarıyla oluşturuldu!` | [`customer/addCustomers`](customer.md), `setCustomers` ekleme yolu |
| `CUE040` | hata | OTP kodu 5 hatalı denemede geçersiz | `customer/forgotPasswordOtpReset`, `platform/*` OTP kaydı |
| `CUE041` | hata | OTP doğrulama kapalıyken `LoginType=otp` | [`platform/login`](platform.md) |
| `PRI019` | başarı | Grup fiyatı yazıldı. `id` ürün kodu, `subid` grup kodu | [`product/updateCustomerGroupPrice`](product.md) |

Kod taşımayan hata metinleri:

| Metin | Sebep |
| --- | --- |
| `Sistemde bu Email ile kayıt mevcut!` | `addCustomers` mevcut e-postayı güncellemez. `setCustomers` + `MatchWithEmail=true` kullanın. |
| `Sistemde bu CustomerCode ile kayıt mevcut!` | Aynı `CustomerCode` ikinci kez eklenemez. |
| `Field <Ad> not found.` | `f` / `f2` süzgecinde liste ucunun tanımadığı alan. Örnek: `getCustomers` için `CustomerGroupCode` yerine `CustomerGroupId` kullanılır. |
| `Controller is not allowed!` | Web servis kullanıcısının bu modüle yetkisi yok. Panelde kullanıcı yetkilerinden açılır. |
| `Method is not allowed!` | Modül açık ama bu metot kapalı ya da yalnız destek kullanıcısına açık. |

## HTTP katmanı

| Durum | Gövde | Çözüm |
| --- | --- | --- |
| 401 | `AUI006` zarfı | `token` eksik veya süresi dolmuş. `auth/login` ile yenileyin; `expirationTime` biçimi `GG-AA-YYYY SS:DD:SS`, ömür yaklaşık 24 saat. |
| 403 | `error code: 1010` (düz metin) | Cloudflare tarayıcı imzası kontrolü. İsteğe gerçekçi bir `User-Agent` başlığı ekleyin. |
| 403 / zaman aşımı | — | Web servis kullanıcısında IP kısıtı varsa çağıran sunucunun IP’si eklenmelidir. |

## Konsol

`/rest1/console` T-Soft’un tarayıcı içi deneme ekranıdır. Ekran web servis kullanıcısıyla giriş ister; token tarayıcıda `token` ve `authExpire` çerezlerinde durur. Katalog `POST /rest1/ConsoleHelper/getApiDetails/{dil}` ve sınıf listesi `POST /rest1/ConsoleHelper/listMethods` ile gelir; ikisi de `token` ister.

Konsol seçili metot için PHP (`curl`), C# ve HTML form örneği üretir. Ürettiği PHP iskeleti:

```php
<?php
$url = "https://magaza.example/rest1/customer/getCustomers";
$fields = array(
  'token' => 'TOKEN',
  'limit' => '10'
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

print_r($response);
```

Dosya alanı olan metotlarda konsol `multipart/form-data` gönderir. Diğerlerinde form alanları düz gönderilir. JSON değerli alanlar (`data`) tek satıra indirilerek string olarak gider.

Konsol kodu aşağıdaki metotları **eski sipariş servisi** olarak ayrı işaretler. Yeni entegrasyonda bunların yerine [Order](order.md) ve [Order2](order2.md) sayfalarındaki güncel karşılıklar tercih edilmelidir:

`Order/createOrderProducts`, `Order/deleteOrders`, `Order/getCargoCompanyList`, `Order/getCargoPricing`, `Order/getCustomerIdOfOrder`, `Order/getOrderDetails`, `Order/getOrderDetailsByOrderId`, `Order/getOrders`, `Order/getOrderStatusList`, `Order/getPaymentTypeList`, `Order/getPostStatus`, `Order/setPostStatus`, `Order/updateInvoiceDetails`, `Order/updateOrderStatusAsCancelled`, `Order/updateOrderStatusAsCargoReady`, `Order/updateOrderStatusAsDelivered`, `Order/updateOrderStatusAsSentToCargo`, `Order/updateOrderStatusAs`, `Order/setTransferredStatus`, `Order/cargoTracking`, `Mobile/getOrders`.
