---
title: Mobile
description: Mobil uygulama oturumu (MobileToken) ile sipariş, favori, alarm, adres.
---

# Mobile

REST1 modülü · 25 metot · taban `https://magaza.example/rest1/mobile/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Mobil uygulama oturumu (MobileToken) ile sipariş, favori, alarm, adres.

## `mobile/index`

`POST https://magaza.example/rest1/mobile/index/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `fetch_product_detail` | query | bool | hayır |  |
| `fetch_installment_list` | query | bool | hayır |  |
| `support_v5` | query | bool | hayır |  |
| `image_limit` | query | int | hayır |  |
| `new` | query | bool | hayır | Yeni vitrin yapısı için gönderilmesi gerekmektedir. |

## `mobile/iframe`

`POST https://magaza.example/rest1/mobile/iframe/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `application` | query | str | hayır | Eğer bir uygulama ismi belirtilmezse, sistem SendheapV2, Connectprof ve Smartydata uygulamalarının iframe sahipliğini kontrol ederek sonuç döndürür. |
| `language` | query | str | hayır | en,tr |
| `currency` | query | str | hayır | USD,TRY veya EUR |
| `theme` | query | str | hayır | dark veya light |

## `mobile/link`

`POST https://magaza.example/rest1/mobile/link/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `link` | query | str | hayır |  |

## `mobile/getOrders`

`POST https://magaza.example/rest1/mobile/getOrders/`

Bu metod order/getOrders metodunun aldığı parametrelere ek olarak MobileToken prametresini almaktadır. MobileToken parametresi customer/check metodunda dönmektedir. Bu doğrulama ile sadece giriş yapmış kullanıcının bilgileri çekilebilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

## `mobile/getOrders2`

`POST https://magaza.example/rest1/mobile/getOrders2/`

Bu metod order2/getOrders metodunun aldığı parametrelere ek olarak MobileToken prametresini almaktadır. MobileToken parametresi customer/check metodunda dönmektedir. Bu doğrulama ile sadece giriş yapmış kullanıcının bilgileri çekilebilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `FetchShipmentDetail` | query | bool | hayır |  |

## `mobile/getCustomer`

`POST https://magaza.example/rest1/mobile/getCustomer/`

Bu metod customer/getCustomerById metodunun aldığı parametrelere ek olarak MobileToken prametresini almaktadır. MobilToken gönderildidiği için CustomerId gönderilmesine gerek yoktur. MobileToken parametresi customer/check metodunda dönmektedir. Bu doğrulama ile sadece giriş yapmış kullanıcının bilgileri çekilebilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

## `mobile/updateCustomer`

`POST https://magaza.example/rest1/mobile/updateCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `data` | query | text | evet |  |

```json
{
  "Name": "",
  "Surname": "",
  "Email": "",
  "Password": "",
  "Gender": "",
  "Birthdate": "",
  "Phone": "",
  "Mobile": "",
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
  "Kvkk": "",
  "IsEmailNotificationOn": "",
  "IsSmsNotificationOn": "",
  "IsPhoneCallNotificationOn": "",
  "EmailApprovalTime": "",
  "SmsApprovalTime": "",
  "PhoneCallApprovalTime": "",
  "CustomerGroupCode": "",
  "RepresentativeCode": "",
  "Credibility": "",
  "PayAtDoor": 0,
  "Risked": 0,
  "Banned": 0,
  "RegistrationPlatform": "rest1"
}
```

## `mobile/deleteCustomer`

`POST https://magaza.example/rest1/mobile/deleteCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

## `mobile/addToFavoriteList`

`POST https://magaza.example/rest1/mobile/addToFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

## `mobile/deleteFromFavoriteList`

`POST https://magaza.example/rest1/mobile/deleteFromFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

## `mobile/getFavoriteList`

`POST https://magaza.example/rest1/mobile/getFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

## `mobile/init`

`POST https://magaza.example/rest1/mobile/init/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `mobile/setJsonSettings`

`POST https://magaza.example/rest1/mobile/setJsonSettings/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `key` | query | str | evet |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Key`, `Title`, `Description`, `Value`, `Type`.
```json
[
  {
    "Key": "AyarKey",
    "Title": "Ayar Başlık",
    "Description": "Ayar Açıklaması",
    "Value": "1",
    "Type": "Bool"
  },
  {
    "Key": "AyarKey2",
    "Title": "Ayar Başlık",
    "Description": "Ayar Açıklaması",
    "Value": "0",
    "Type": "Bool"
  }
]
```

## `mobile/getAlarmList`

`POST https://magaza.example/rest1/mobile/getAlarmList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Filtreleme için Price veya Stock girilebilir. |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `orderby` | query | str | hayır | Örn: RecordTime DESC |
| `f` | query | str | hayır | Kullanılabilen operatörler: startwith,endwith,equal,greater,smaller,between,contain. Örn: "RecordTime\|1529931531\|greater" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchProductData` | query | bool | hayır |  |

## `mobile/addAlarm`

`POST https://magaza.example/rest1/mobile/addAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Price veya Stock girilmeli. |
| `AlarmDay` | query | str | hayır | Alarmın kaç gün için geçerli olduğunu belirler. |
| `CurrentPrice` | query | str | hayır | O anki fiyat girilebilir, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `AlarmPrice` | query | str | hayır | Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `Currency` | query | str | hayır | Para birimi. Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `VatIncluded` | query | str | hayır | Kdv dahil ise 1, değilse 0 girilmeli, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli. |
| `StockLimit` | query | str | hayır | Stok alarmı için gerekli parametre. Fiyat alarmı için gönderilmemeli. |

## `mobile/deleteAlarm`

`POST https://magaza.example/rest1/mobile/deleteAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AlarmId` | url_param | str | hayır |  |
| `MobileToken` | query | str | hayır |  |

## `mobile/getOrderReturn`

`POST https://magaza.example/rest1/mobile/getOrderReturn/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | str | hayır |  |
| `MobileToken` | query | str | hayır |  |
| `OrderCode` | query | str | hayır | OrderId yerine OrderCode gönderilebilir veya boş bırakılabilir. |

## `mobile/setOrderReturn`

`POST https://magaza.example/rest1/mobile/setOrderReturn/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `data` | query | text | evet | OrderId yerine OrderCode gönderilebilir |

Örnek `data` alanları: `OrderId`, `FirstName`, `LastName`, `Email`, `Adress`, `ReturnDescription`, `ReasonId`, `Products`.
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

## `mobile/setLocation`

`POST https://magaza.example/rest1/mobile/setLocation/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
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

## `mobile/availableDeliveryTimes`

`POST https://magaza.example/rest1/mobile/availableDeliveryTimes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

## `mobile/setDeliveryTime`

`POST https://magaza.example/rest1/mobile/setDeliveryTime/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `Id` | query | int | evet |  |
| `Date` | query | str | evet |  |

## `mobile/getCouponList`

`POST https://magaza.example/rest1/mobile/getCouponList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

## `mobile/getAddress`

`POST https://magaza.example/rest1/mobile/getAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `Page` | query | str | hayır | 'order' olarak gönderilirse ilgili ülkeye ait siparişler döner |

## `mobile/setAddress`

`POST https://magaza.example/rest1/mobile/setAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `data` | query | text | hayır | Adress güncellenmek istendiğinde address_id parametresi sıfırdan büyük bir değer gönderilmelidir. |

Örnek `data` alanları: `address_id`, `title`, `country_code`, `province_code`, `city_code`, `town_code`, `address`, `company`, `district`, `fullname`, `is_company_active`, `mobile_phone`, `nationality`, `identity_number`, `tax_number`, `tax_office`, `post_code`, `has_e_invoice`.
```json
[
  {
    "address_id": 0,
    "title": "İş Adresim",
    "country_code": "TR",
    "province_code": "",
    "city_code": "34",
    "town_code": "941",
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

## `mobile/deleteAddress`

`POST https://magaza.example/rest1/mobile/deleteAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AddressId` | url_param | int | evet |  |
| `MobileToken` | query | str | hayır |  |
