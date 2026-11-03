---
title: Platform
description: Mobil/platform oturumu (CustomerHash): üye, sepet, sipariş, adres, iade.
---

# Platform

REST1 modülü · 47 metot · taban `https://magaza.example/rest1/platform/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Mobil/platform oturumu (CustomerHash): üye, sepet, sipariş, adres, iade.

## `platform/login`

`POST https://magaza.example/rest1/platform/login/`

E-posta, parola ve platform bilgileri ile kayıt varsa döner. Üye Girişi OTP Doğrulama (OtpSmsGiris) ayarı SMS veya E-posta seçiliyken web giriş ekranında hem doğrulama kodu hem e-posta/parola seçeneği sunulur; aynı şekilde bu metot da iki yolu birlikte destekler ve hangisinin kullanıldığı LoginType ile bildirilir. LoginType=otp gönderildiğinde giriş iki adımlıdır: kanal SMS ise yalnızca Phone, kanal E-posta ise yalnızca Email gönderilen istek 6 haneli kodu ilgili adrese yollayıp extra.otpRequired=true döner, aynı istek Otp ile tekrarlandığında oturum açılır. Kod SMS kanalında 120, e-posta kanalında 300 saniye geçerlidir ve 5 hatalı denemede geçersiz olur (CUE040). LoginType gönderilmediğinde Email/Phone + Password akışı çalışır ve ayardan bağımsız olarak değişmez. Uygulamanın hangi seçenekleri göstereceğini ve kod için telefon mu e-posta mı isteyeceğini mobile/init cevabındaki otp_login_channel alanı (none | sms | email) belirler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Email` | query | str | evet |  |
| `Platform` | query | str | evet |  |
| `Phone` | query | str | hayır | Telefonla giriş aktif ise telefon ile girebilmek için email paramtresinin yerine kullanılabilir. SMS ile Giriş ayarı açıkken zorunludur ve Email/Password dikkate alınmaz. |
| `Password` | query | pass | evet |  |
| `LoginType` | query | str | hayır | otp gönderilirse doğrulama kodu ile giriş yapılır. Kanal SMS iken Phone, kanal E-posta iken Email zorunludur; Password dikkate alınmaz. Gönderilmezse veya başka bir değer gönderilirse e-posta/telefon + parola akışı çalışır. OTP doğrulama kapalıyken otp gönderilirse CUE041 döner. |
| `Otp` | query | str | hayır | LoginType=otp iken telefona (SMS kanalı) veya e-posta adresine (E-posta kanalı) gönderilen 6 haneli doğrulama kodu. Boş bırakılan ilk istek kodu gönderir, ikinci istekte kod ile birlikte gönderilir. |
| `CustomerHash` | query | str | hayır | Sepet yenileme işlemleri için gönderilmelidir. |

## `platform/socialLogin`

`POST https://magaza.example/rest1/platform/socialLogin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | evet |  |
| `SocialPlatform` | query | str | evet | Hangi sosyal platform üzerinden giriş yapılacaksa o platform girilmelidir. facebook, google, apple gibi |
| `SocialToken` | query | str | evet |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `id`, `name`, `email`, `gender`, `picture_url`.
```json
[
  {
    "id": "12345678",
    "name": "rumeysa",
    "email": "ornek@magaza.example",
    "gender": "female",
    "picture_url": ""
  }
]
```

## `platform/connectLinker`

`POST https://magaza.example/rest1/platform/connectLinker/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |
| `RedirectUrl` | query | str | hayır |  |

## `platform/personalizationSendImage`

`POST https://magaza.example/rest1/platform/personalizationSendImage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `Image` | file | file | evet |  |
| `ProductId` | query | int | evet |  |

## `platform/updateOrderStatusAs`

`POST https://magaza.example/rest1/platform/updateOrderStatusAs/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderStatusId` | url_param | str | evet | Bu parametre data içinde yine OrderStatusId şeklinde her sipariş için ayrı gönderilebilir.   NOT : data içinde gönderilirse burada boş bırakılmalıdır. (gönderilmemelidir) |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`, `CargoCode`, `CargoTrackingCode`, `Shipment`.
```json
[
  {
    "OrderCode": "TS1703182",
    "CargoCode": "T1",
    "CargoTrackingCode": "ER34342",
    "Shipment": {
      "CargoKey": "789654",
      "CargoTrackingNo": "CR789654",
      "CargoTrackingUrl": "http://cargocampany.com/tracking/CR789654",
      "BarcodeLink": "http://cargocampany.com/tracking/CR789654"
    }
  }
]
```

## `platform/reorder`

`POST https://magaza.example/rest1/platform/reorder/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `OrderId` | query | int | evet |  |

## `platform/orderTracking`

`POST https://magaza.example/rest1/platform/orderTracking/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `OrderCode` | query | str | evet |  |
| `Email` | query | str | evet |  |
| `Phone` | query | str | evet |  |

## `platform/getSubscribeList`

`POST https://magaza.example/rest1/platform/getSubscribeList/`

Müşterinin abonelik siparişlerini listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |

## `platform/getCustomer`

`POST https://magaza.example/rest1/platform/getCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

## `platform/getOrders`

`POST https://magaza.example/rest1/platform/getOrders/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchProductAdditionalData` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchWithArchive` | query | bool | hayır |  |
| `FetchCustomerData` | query | bool | hayır |  |
| `FetchInvoiceAddress` | query | bool | hayır |  |
| `FetchDeliveryAddress` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchCargoDetail` | query | bool | hayır |  |
| `FetchShipmentDetail` | query | bool | hayır |  |
| `FetchDeleteds` | query | bool | hayır |  |

## `platform/orderTracking`

`POST https://magaza.example/rest1/platform/orderTracking/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `OrderCode` | query | str | evet |  |
| `Email` | query | str | hayır |  |
| `Phone` | query | str | hayır |  |

## `platform/deleteCustomer`

`POST https://magaza.example/rest1/platform/deleteCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

## `platform/setCustomer`

`POST https://magaza.example/rest1/platform/setCustomer/`

Oturumdaki üyeyi günceller; oturum yoksa yeni üye kaydı açar. Üye Girişi OTP Doğrulama (OtpSmsGiris) ayarı açıkken yeni kayıt doğrulama gerektirir: Otp gönderilmeyen istek, kanal SMS ise data içindeki Mobile numarasına, kanal E-posta ise data içindeki Email adresine 6 haneli kod yollayıp extra.otpRequired=true döner; aynı istek Otp ile tekrarlandığında kayıt tamamlanır. Bu durumda kayıt ekranında parola alanı olmadığı için (customer/getFields parola alanını döndürmez) parola gönderilmesi gerekmez, üye girişini doğrulama kodu ile yapar. Mevcut üyenin güncellemesi bu doğrulamadan etkilenmez.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `Otp` | query | str | hayır | OTP doğrulama açıkken yeni üye kaydında telefona (SMS kanalı) veya e-posta adresine (E-posta kanalı) gönderilen 6 haneli doğrulama kodu. Kod SMS kanalında 120, e-posta kanalında 300 saniye geçerlidir; 5 hatalı denemede geçersiz olur (CUE040). Güncelleme isteklerinde kullanılmaz. |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Name`, `Surname`, `Email`, `Password`, `Gender`, `Birthdate`, `Phone`, `Mobile`, `OfficePhone`, `Address`, `Postcode`, `City`, `Town`, `Country`, `TaxOffice`, `TaxNo`, `CompanyName`, `IdentityNo`, `Field1`, `Field2`, `Field3`, `Field4`, `Field5`, `Field6`, `Field7`, `Field8`, `Field9`, `Field10`, `Field11`, `Field12`, `Field13`, `Field14`, `Field15`, `Approval`, `IsEmailNotificationOn`, `IsSmsNotificationOn`, `IsPhoneCallNotificationOn`, `EmailApprovalTime`, `SmsApprovalTime`, `PhoneCallApprovalTime`, `NotificationApprovalIp`, `SmsNotificationApprovalIp`, `PhoneNotificationApprovalIp`, `CustomerGroupCode`, `RepresentativeCode`, `Credibility`, `PayAtDoor`, `Risked`, `Banned`, `PriceField`, `CargoFree`.
```json
[
  {
    "Name": "",
    "Surname": "",
    "Email": "",
    "Password": "",
    "Gender": "",
    "Birthdate": "",
    "Phone": "",
    "Mobile": "",
    "OfficePhone": "",
    "Address": "",
    "Postcode": "",
    "City": "",
    "Town": "",
    "Country": "",
    "TaxOffice": "",
    "TaxNo": "",
    "CompanyName": "",
    "IdentityNo": "",
    "Field1": "",
    "Field2": "",
    "Field3": "",
    "Field4": "",
    "Field5": "",
    "Field6": "",
    "Field7": "",
    "Field8": "",
    "Field9": "",
    "Field10": "",
    "Field11": "",
    "Field12": "",
    "Field13": "",
    "Field14": "",
    "Field15": "",
    "Approval": "",
    "IsEmailNotificationOn": "",
    "IsSmsNotificationOn": "",
    "IsPhoneCallNotificationOn": "",
    "EmailApprovalTime": "",
    "SmsApprovalTime": "",
    "PhoneCallApprovalTime": "",
    "NotificationApprovalIp": "",
    "SmsNotificationApprovalIp": "",
    "PhoneNotificationApprovalIp": "",
    "CustomerGroupCode": "",
    "RepresentativeCode": "",
    "Credibility": "",
    "PayAtDoor": 0,
    "Risked": 0,
    "Banned": 0,
    "PriceField": "",
    "CargoFree": 0
  }
]
```

## `platform/getFavoriteList`

`POST https://magaza.example/rest1/platform/getFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

## `platform/addToFavoriteList`

`POST https://magaza.example/rest1/platform/addToFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

## `platform/deleteFromFavoriteList`

`POST https://magaza.example/rest1/platform/deleteFromFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

## `platform/getAlarmList`

`POST https://magaza.example/rest1/platform/getAlarmList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Filtreleme için Price veya Stock girilebilir. |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `orderby` | query | str | hayır | Örn: RecordTime DESC |
| `f` | query | str | hayır | Kullanılabilen operatörler: startwith,endwith,equal,greater,smaller,between,contain. Örn: "RecordTime\|1529931531\|greater" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchProductData` | query | bool | hayır |  |

## `platform/addAlarm`

`POST https://magaza.example/rest1/platform/addAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Price veya Stock girilmeli. |
| `AlarmDay` | query | str | hayır | Alarmın kaç gün için geçerli olduğunu belirler. |
| `CurrentPrice` | query | str | hayır | O anki fiyat girilebilir, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `AlarmPrice` | query | str | hayır | Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `Currency` | query | str | hayır | Para birimi. Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `VatIncluded` | query | str | hayır | Kdv dahil ise 1, değilse 0 girilmeli, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli. |
| `StockLimit` | query | str | hayır | Stok alarmı için gerekli parametre. Fiyat alarmı için gönderilmemeli. |

## `platform/deleteAlarm`

`POST https://magaza.example/rest1/platform/deleteAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AlarmId` | url_param | str | hayır |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

## `platform/getAddress`

`POST https://magaza.example/rest1/platform/getAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `Page` | query | str | hayır | 'order' olarak gönderilirse ilgili ülkeye ait siparişler döner |

## `platform/setAddress`

`POST https://magaza.example/rest1/platform/setAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | hayır | Adress güncellenmek istendiğinde address_id parametresi sıfırdan büyük bir değer gönderilmelidir. |

Örnek `data` alanları: `address_id`, `title`, `country_code`, `city_code`, `town_code`, `city`, `town`, `address`, `company`, `district`, `fullname`, `is_company_active`, `mobile_phone`, `nationality`, `identity_number`, `tax_number`, `tax_office`, `post_code`, `has_e_invoice`.
```json
[
  {
    "address_id": 0,
    "title": "İş Adresim",
    "country_code": "TR",
    "city_code": "34",
    "town_code": "941",
    "city": "İstanbul",
    "town": "Fatih",
    "address": "Teknopark No:104",
    "company": "",
    "district": "",
    "fullname": "Kübra K",
    "is_company_active": 0,
    "mobile_phone": "905555555555",
    "nationality": 0,
    "identity_number": "66666666666",
    "tax_number": "66666666666",
    "tax_office": "",
    "post_code": "34104",
    "has_e_invoice": 0
  }
]
```

## `platform/setOrderAddress`

`POST https://magaza.example/rest1/platform/setOrderAddress/`

LisansEihracat lisansının açıklığına göre set edilemeyecek adreslerin kontrolü kullanıcıya bırakılmıştır. platform/getAvaliableAddress metodundan kontrol sağlanabilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet | Adres Tipleri:   1: sadece teslimat adresi   2: sadece fatura adresi   3: hem teslimat, hem fatura adresi |

Örnek `data` alanları: `address_type`, `address_id`.
```json
[
  {
    "address_type": "2",
    "address_id": "5"
  }
]
```

## `platform/deleteAddress`

`POST https://magaza.example/rest1/platform/deleteAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AddressId` | url_param | int | evet |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

## `platform/getOrderReturn`

`POST https://magaza.example/rest1/platform/getOrderReturn/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | str | hayır |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `OrderCode` | query | str | hayır | OrderId yerine OrderCode gönderilebilir veya boş bırakılabilir. |

## `platform/setOrderReturn`

`POST https://magaza.example/rest1/platform/setOrderReturn/`

Müşteriye ait iade talebini oluşturur/günceller. CargoCompanyId gönderilmezse siparişin kendi kargo firması kullanılır. Hepsijet gibi randevulu kargolarda PickDate zorunludur (uygun tarih listesi platform/getReturnPickDates ile çekilir).

Cevap (data): OrderId, ReturnId, ShipmentCode, TrackingNumber, CargoKey alanlarını içerir. Shipment oluşmadıysa ilgili alanlar null döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet | OrderId yerine OrderCode gönderilebilir.  Opsiyonel alanlar: - CargoCompanyId (int): Müşterinin iade için seçtiği kargo firmasının ID'si (kargo__firma.id). Gönderilmezse siparişin orijinal kargo firması kullanılır. - PickDate (YYYY-MM-DD): Randevulu çalışan kargolarda (örn. hepsijet) zorunludur. Uygun tarihler platform/getReturnPickDates'ten alınır. - Iban: İade tutarının yatırılacağı IBAN. |

Örnek `data` alanları: `OrderId`, `FirstName`, `LastName`, `Email`, `Adress`, `ReturnDescription`, `ReasonId`, `Iban`, `CargoCompanyId`, `PickDate`, `Products`.
```json
[
  {
    "OrderId": "3",
    "FirstName": "Test",
    "LastName": "Testcik",
    "Email": "ornek@magaza.example",
    "Adress": "Adres",
    "ReturnDescription": "Aciklama",
    "ReasonId": "2",
    "Iban": "TR420001009010038831705001",
    "CargoCompanyId": 3,
    "PickDate": "",
    "Products": [
      {
        "ProductId": "5",
        "Count": "1",
        "Note": "Not",
        "ReasonId": "1"
      },
      {
        "ProductId": "6",
        "Count": "1",
        "Note": "Not",
        "ReasonId": "2"
      }
    ]
  }
]
```

## `platform/getReturnPickDates`

`POST https://magaza.example/rest1/platform/getReturnPickDates/`

Hepsijet gibi randevulu çalışan kargo firmaları için, kargo şirketinin sunduğu uygun alım tarihlerini döndürür. Randevulu olmayan kargolarda RequiresPickDate=false ve boş Dates listesi döner.

Cevap (data): { "RequiresPickDate": true|false, "Dates": [ "YYYY-MM-DD", ... ] }

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `OrderId` | query | str | hayır | Sipariş ID. OrderId veya OrderCode'dan biri zorunludur. |
| `OrderCode` | query | str | hayır | Sipariş numarası. OrderId yerine kullanılabilir. |
| `CargoCompanyId` | query | int | evet | Kargo firmasının ID'si (kargo__firma.id). order2/getCargoCompanyList listesinden seçilir. |

## `platform/setLocation`

`POST https://magaza.example/rest1/platform/setLocation/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet | Kod verileri bulunuyorsa,   CountryCode,StateCode, CityCode, TownCode, DistrictCode  şeklinde de gönderim yapılabilir. |

```json
{
  "Country": "Türkiye",
  "State": "",
  "City": "İstanbul",
  "Town": "Esenler",
  "District": "Davutpaşa Mah"
}
```

## `platform/availableDeliveryTimes`

`POST https://magaza.example/rest1/platform/availableDeliveryTimes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

## `platform/setDeliveryTime`

`POST https://magaza.example/rest1/platform/setDeliveryTime/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `Id` | query | int | evet | Teslimat Zamanı id'si |
| `Date` | query | str | evet | teslimat zamanı tarihi (2018-10-27) |

## `platform/getCouponList`

`POST https://magaza.example/rest1/platform/getCouponList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

## `platform/addToCart`

`POST https://magaza.example/rest1/platform/addToCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `cart_index`, `product_id`, `variant_id`, `count`, `personalization`.
```json
[
  {
    "cart_index": "-1",
    "product_id": "147",
    "variant_id": "",
    "count": "2",
    "personalization": {
      "form_id": "11",
      "data": [
        {
          "title": "1. resim",
          "value": "test.jpg",
          "index": 0
        },
        {
          "title": "2. resim",
          "value": "test2.jpg",
          "index": 1
        }
      ]
    }
  }
]
```

## `platform/getCart`

`POST https://magaza.example/rest1/platform/getCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |

## `platform/removeAll` (alpha)

`POST https://magaza.example/rest1/platform/removeAll/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |

## `platform/removeItems` (alpha)

`POST https://magaza.example/rest1/platform/removeItems/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |
| `CartIndex` | query | str | evet |  |

## `platform/selectCampaign` (alpha)

`POST https://magaza.example/rest1/platform/selectCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Seçili kampanyayı iptal etmek için campaign_id sıfır (0) gönderilmelidir. |
| `CustomerHash` | query | str | evet |  |

Örnek `data` alanları: `campaign_group_id`, `campaign_id`.
```json
[
  {
    "campaign_group_id": "1",
    "campaign_id": "4"
  }
]
```

## `platform/setCouponCode` (alpha)

`POST https://magaza.example/rest1/platform/setCouponCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `CustomerHash` | query | str | evet |  |

Örnek `data` alanları: `code`.
```json
[
  {
    "code": "1BNQGVPVNJ"
  }
]
```

## `platform/productRecommend`

`POST https://magaza.example/rest1/platform/productRecommend/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductId`, `Message`, `ToMail`, `ToName`.
```json
[
  {
    "ProductId": "656",
    "Message": "",
    "ToMail": "ornek@magaza.example",
    "ToName": "Rumeysa"
  }
]
```

## `platform/getAvaliableAddress`

`POST https://magaza.example/rest1/platform/getAvaliableAddress/`

MobileToken öncelikli kontrolü mevcuttur. CountryCode gönderilmediği durumlarda sitenin default country'sine ait adresler getirilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `CountryCode` | query | str | hayır |  |

## `platform/refreshToken`

`POST https://magaza.example/rest1/platform/refreshToken/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |

## `platform/sendImageNotes`

`POST https://magaza.example/rest1/platform/sendImageNotes/`

Üyenin yüklediği resimleri ve sepet ürün bilgilerini yönetici e‑postasına gönderir

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `notes1` | query | text | hayır |  |
| `file` | file | file | hayır |  |

## `platform/getCampaigns`

`POST https://magaza.example/rest1/platform/getCampaigns/`

Oturum açan müşteriye uygun ve mobil uygulamada görünür aktif kampanyaları listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |

## `platform/getCustomerPoints`

`POST https://magaza.example/rest1/platform/getCustomerPoints/`

Müşterinin kendi puan hareketlerini listeler. Müşteri CustomerHash üzerinden zorlanır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. |

## `platform/sendProductComment`

`POST https://magaza.example/rest1/platform/sendProductComment/`

Ürüne yorum/soru ekler. Yorum sahibi (CustomerId) istek gövdesinden değil CustomerHash üzerinden belirlenir. Ürüne yorum için type:comment, soru için type:question gönderilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet |  |
| `image` | file | file | hayır | Gerekli lisansa sahip olmalısınız (Ürün yorumlarında resim ekleme). |

Örnek `data` alanları: `ProductId`, `Type`, `Comment`, `Title`, `Rate`, `IsNameDisplayed`, `ImageUrl`, `DateTimeStamp`.
```json
[
  {
    "ProductId": "68",
    "Type": "comment",
    "Comment": "test message",
    "Title": "test title",
    "Rate": "3",
    "IsNameDisplayed": "",
    "ImageUrl": "",
    "DateTimeStamp": ""
  }
]
```

## `platform/getAddressFields`

`POST https://magaza.example/rest1/platform/getAddressFields/`

Adres formu alanlarını döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

## `platform/getSubscriptions`

`POST https://magaza.example/rest1/platform/getSubscriptions/`

Müşterinin abonelik siparişlerini listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |

## `platform/getTicketDetails`

`POST https://magaza.example/rest1/platform/getTicketDetails/`

Müşterinin kendi talebinin (ticket) detayını döner. Talep müşteriye ait değilse bilgi sızdırmamak için 'kayıt bulunamadı' yanıtı verilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `TicketId` | url_param | int | evet |  |

## `platform/getTicketDepartments`

`POST https://magaza.example/rest1/platform/getTicketDepartments/`

Talep departmanlarını listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
