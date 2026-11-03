---
title: Order
description: Güncel sipariş okuma, arşiv, iade, kargo ve sevkiyat.
---

# Order

REST1 modülü · 30 metot · taban `https://magaza.example/rest1/order/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Güncel sipariş okuma, arşiv, iade, kargo ve sevkiyat.

## `order/proceed` (alpha)

`POST https://magaza.example/rest1/order/proceed/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Application: Uygulama logosunun eklenmesi için gereklidir.   CodePrefix: Sipariş numarasının başındaki kodu belirler. |

```json
{
  "CustomerId": "",
  "InvoiceAddressId": "",
  "DeliveryAddressId": "",
  "CargoCompanyId": "",
  "CouponCode": "",
  "CampaignId": "",
  "Application": "",
  "CodePrefix": ""
}
```

## `order/get`

`POST https://magaza.example/rest1/order/get/`

<strong>NOT :</strong> Bu metotda sipariş fiyatları site parabiriminde (SiteDefaultCurrency) dönmektedir. Sipariş parabirimine (Currency) çevirmek için ExchangeRate oranına bölebilirsiniz.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderDateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `OrderDateTimeEnd` | query | str | hayır |  |
| `UpdateDateTimeStart` | query | str | hayır |  |
| `UpdateDateTimeEnd` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `OrderStatusId` | query | str | hayır | Varsayılan olarak 1,9, ve 10 durumları dışındaki siparişler gelmektedir. Yani varsayılan olarak henüz tamamlanmamış, iptal edilmiş veya iade edilmiş siparişler dışındaki siparişler gelmektedir. Bu parametre 'all' gönderilirse tamamlanmamış siparişler haricindeki tüm siparişler gelecektir. 'all_with_incompleted' gönderilirse tüm tamamlanmamışlar da dahil edilip dönecektir. |
| `IsTransferred` | query | str | hayır | Aktarılanlar için '1', aktarılmayanlar için '0' girilmeli |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `Translation` | query | str | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `SupplyStatus` | query | str | hayır | Tedarik durumu |
| `FetchCustomerGroupInfo` | query | bool | hayır |  |
| `IsVendor` | query | bool | hayır |  |
| `CustomerGroupCode` | query | str | hayır |  |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchProductAdditionalData` | query | bool | hayır |  |
| `FetchProductFallbackData` | query | bool | hayır | Sipariş ürünü barkodu boş ise ürün/alt ürün barkodundan tamamlar. |
| `FetchReturnStatus` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchCustomerData` | query | bool | hayır |  |
| `FetchInvoiceAddress` | query | bool | hayır |  |
| `FetchDeliveryAddress` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchCargoDetail` | query | bool | hayır |  |
| `FetchOnlyHasShipment` | query | bool | hayır |  |
| `FetchShipmentDetail` | query | bool | hayır |  |
| `FetchDeleteds` | query | bool | hayır |  |
| `FetchPaymentData` | query | bool | hayır |  |
| `FetchSubPaymentData` | query | bool | hayır |  |
| `FetchOnlyReturns` | query | bool | hayır |  |
| `FetchOrderReferrer` | query | bool | hayır |  |
| `FetchCargoInfo` | query | bool | hayır |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

## `order/calculatePrices`

`POST https://magaza.example/rest1/order/calculatePrices/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

```json
{
  "CustomerId": 123,
  "Currency": "TL",
  "PaymentTypeId": "-2",
  "SubPaymentTypeId": "",
  "DeliveryAddressId": "",
  "DeliveryTitle": "İş adresim",
  "DeliveryName": "Tsoft Test",
  "DeliveryMobile": "5070251250",
  "DeliveryOtherPhone": "",
  "DeliveryCountry": "Türkiye",
  "DeliveryCity": "İstanbul",
  "DeliveryTown": "Esenler",
  "DeliveryDistrict": "",
  "DeliveryAddress": "Yıldız Teknik Üniversitesi Davutpaşa Kampüsü",
  "DeliveryZipcode": "",
  "Products": [
    {
      "ProductCode": "T625",
      "VariantType1": "",
      "VariantType2": "",
      "SubProductCode": "",
      "Quantity": "1"
    }
  ]
}
```

## `order/unArchive`

`POST https://magaza.example/rest1/order/unArchive/`

Sipariş veya siparişleri arşivden geri döndermek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderIds` | query | int | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `OrderCodes` | query | str | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : TS10047427\|TS10047428 |

## `order/archive`

`POST https://magaza.example/rest1/order/archive/`

Sipariş veya siparişleri arşive eklemek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderIds` | query | int | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `OrderCodes` | query | str | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : TS10047427\|TS10047428 |

## `order/statistics` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/statistics/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StartDate` | query | text | hayır | Örn : 2019-09-10 |
| `EndDate` | query | text | hayır | Örn : 2019-09-15 |

## `order/getDeliveryRegion`

`POST https://magaza.example/rest1/order/getDeliveryRegion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | query | text | hayır | Ülke => Country, İl => City, ilçe => Town, Mahalle => District, Eyalet => State |
| `ParentCode` | query | text | hayır |  |
| `Name` | query | text | hayır |  |
| `ParentName` | query | text | hayır |  |
| `FetchCityAndDistrict` | query | bool | hayır |  |
| `FetchWithCargoCompany` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

## `order/setDeliveryRegion`

`POST https://magaza.example/rest1/order/setDeliveryRegion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type parametresi :   Ülke => Country, Eyalet => State, İl => City, ilçe => Town, Mahalle => District    ParentCode Yerine ParentName de gönderilebilir.    HasState Paremetresi sadece eyaleti olan ülkelerde 1 olarak gönderilmeli. diğer işlemler için kullanılmayabilir.   Teslimat bölgelerine kargo firması eklenmek istenirse CargoCompanyIds keyi ile birlikte gönderilebilir örn: "CargoCompanyIds": "1,2,3" |

Örnek `data` alanları: `Code`, `Name`, `AreaCode`, `Type`, `IsActive`, `ParentCode`, `IsLocal`, `ShippingZone`, `Pattern`, `HasState`, `Platform`, `PostalCodeRegex`.
```json
[
  {
    "Code": "TR",
    "Name": "Türkiye",
    "AreaCode": 1,
    "Type": "Country",
    "IsActive": 0,
    "ParentCode": "",
    "IsLocal": 0,
    "ShippingZone": "B1",
    "Pattern": "(___) ___ __ __",
    "HasState": 0,
    "Platform": "",
    "PostalCodeRegex": ""
  }
]
```

## `order/deleteDeliveryRegion`

`POST https://magaza.example/rest1/order/deleteDeliveryRegion/`

En az bir koşul girmek zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | query | text | hayır |  |
| `Name` | query | text | hayır |  |
| `Type` | query | text | hayır | Ülke => Country, İl => City, ilçe => Town, Mahalle => District, Eyalet => State |
| `ParentCode` | query | text | hayır |  |
| `ParentName` | query | text | hayır |  |
| `Platform` | query | text | hayır |  |
| `CreatedBy` | query | text | hayır |  |

## `order/setCargoRegionStatus`

`POST https://magaza.example/rest1/order/setCargoRegionStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | 1. Type parametresi :   Ülke => Country, Eyalet => State, İl => City, ilçe => Town, Mahalle => District    2. Eğer Code alanı bilinmiyorsa   Type: Country ise sadece CountryName alanı   Type : City ise CountryName ve CityName alanları   Type : Town ise CountryName, CityName ve TownName alanları   Type : District ise CountryName, CityName, TownName ve DistrictName alanları gönderilmelidir   3. CargoId yerine CargoCode gönderilebilir   örn: "CargoCode": "T1" |

Örnek `data` alanları: `Code`, `Type`, `CargoId`, `IsActive`.
```json
[
  {
    "Code": "60",
    "Type": "City",
    "CargoId": 3,
    "IsActive": true
  }
]
```

## `order/getRefunds`

`POST https://magaza.example/rest1/order/getRefunds/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderCode` | query | str | hayır |  |
| `TransactionNo` | query | str | hayır |  |
| `DateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `DateTimeEnd` | query | str | hayır |  |
| `IsApproved` | query | str | hayır | işlenenler için '1', aktarılmayanlar için '0' girilmeli |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `orderByField` | query | str | hayır | Default: CreateDate |
| `orderByDirection` | query | str | hayır | Default: DESC |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchDetail` | query | bool | hayır |  |

## `order/setRefund`

`POST https://magaza.example/rest1/order/setRefund/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Id`, `Approved`.
```json
[
  {
    "Id": "168",
    "Approved": "1"
  }
]
```

## `order/getReturns`

`POST https://magaza.example/rest1/order/getReturns/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | query | int | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `ReturnStatusId` | query | str | hayır |  |
| `ReturnReasonId` | query | str | hayır |  |
| `ShipmentId` | query | str | hayır |  |
| `ShipmentCode` | query | str | hayır |  |
| `Translation` | query | str | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `FetchReturnProductData` | query | bool | hayır |  |
| `FetchOrderDetail` | query | bool | hayır |  |
| `FetchOrderDetailExchangeRate` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

## `order/updateReturnStatus`

`POST https://magaza.example/rest1/order/updateReturnStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | OrderCode yerine güncellenmek istenilen siparişin iade Id'si gönderilebilir. Örn: "Id":"11"    * Status değerine order/getReturnStatusList metodundan dönen Id verisi gönderilmeli    Status veya Products verilerinden herhangi biri gönderilebilir. Gönderilmeyen veri üzerinde işlem yapılmaz. |

Örnek `data` alanları: `OrderCode`, `Status`, `CargoCompany`, `ShipmentCode`, `Products`.
```json
[
  {
    "OrderCode": "SP08034",
    "Status": "",
    "CargoCompany": "",
    "ShipmentCode": "",
    "Products": [
      {
        "ProductId": "5",
        "SubProductId": "0",
        "Note": "Not",
        "Status": "1",
        "ReturnCount": "1"
      },
      {
        "ProductId": "6",
        "SubProductId": "0",
        "Note": "Not",
        "Status": "2",
        "ReturnCount": "1"
      }
    ]
  }
]
```

## `order/updateReturnNote`

`POST https://magaza.example/rest1/order/updateReturnNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | * Id değerine order/getReturns metodundan dönen Id verisi gönderilmelidir. Gönderilmeyen veri üzerinde işlem yapılmaz. |

Örnek `data` alanları: `Id`, `Note`.
```json
[
  {
    "Id": "123",
    "Note": ""
  }
]
```

## `order/getReturnStatusList`

`POST https://magaza.example/rest1/order/getReturnStatusList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| ` ` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `order/getReturnReasonList`

`POST https://magaza.example/rest1/order/getReturnReasonList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| ` ` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `order/setCustomData`

`POST https://magaza.example/rest1/order/setCustomData/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderCode`, `CustomData`, `CustomData2`, `CustomData3`, `CustomData4`.
```json
[
  {
    "OrderCode": "",
    "CustomData": "",
    "CustomData2": "",
    "CustomData3": "",
    "CustomData4": ""
  }
]
```

## `order/createShipment` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/createShipment/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Kısmi sevkiyat eklemek için kullanılır.    OrderKey kullanıcı tarafından oluşturulmuş benzersiz key, sistemde varsa güncelleme yapar.(gönderilmezse sistem kendi oluşturur.),   Products->Id değerine order/get metodundan dönen OrderProductId verisi gönderilmelidir.    GrandTotal,IncludeDutyFee,IncludeCargoFee,IncludeServiceFee,CargoCompanyId ve Products verisi sadece sevkiyat oluşturma esnasında geçerlidir. Güncelleme esnasında önemsenmez. |

Örnek `data` alanları: `OrderKey`, `OrderNumber`, `CargoKey`, `CargoTrackingNo`, `CargoTrackingUrl`, `BarcodeLink`, `RealTotalDesi`, `Desi`, `RealCargoAmount`, `EngagedInProcessingBranchOffice`, `StatusDesc`, `UpdateDate`, `GrandTotal`, `IncludeDutyFee`, `IncludeCargoFee`, `IncludeServiceFee`, `CargoCompanyId`, `Products`.
```json
[
  {
    "OrderKey": "",
    "OrderNumber": "",
    "CargoKey": "",
    "CargoTrackingNo": "",
    "CargoTrackingUrl": "",
    "BarcodeLink": "",
    "RealTotalDesi": "",
    "Desi": "",
    "RealCargoAmount": "",
    "EngagedInProcessingBranchOffice": "",
    "StatusDesc": "",
    "UpdateDate": "",
    "GrandTotal": "",
    "IncludeDutyFee": 0,
    "IncludeCargoFee": 0,
    "IncludeServiceFee": 0,
    "CargoCompanyId": "",
    "Products": [
      {
        "Id": "",
        "Quantity": ""
      }
    ]
  }
]
```

## `order/cancelShipment`

`POST https://magaza.example/rest1/order/cancelShipment/`

Kısmi sevkiyat iptali için kullanılır.ShipmentId veya OrderKey parametrelerinden biri kullanılabilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ShipmentId` | query | int | hayır |  |
| `OrderKey` | query | str | hayır |  |

## `order/getPlatform` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/getPlatform/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `order/getRepresentative` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/getRepresentative/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `order/getNote`

`POST https://magaza.example/rest1/order/getNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchDetail` | query | bool | hayır |  |

## `order/getOrderPackage`

`POST https://magaza.example/rest1/order/getOrderPackage/`

<strong>NOT :</strong> Bu metotda sipariş fiyatları site parabiriminde (SiteDefaultCurrency) dönmektedir. Sipariş parabirimine (Currency) çevirmek için ExchangeRate oranına bölebilirsiniz.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderDateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `OrderDateTimeEnd` | query | str | hayır |  |
| `UpdateDateTimeStart` | query | str | hayır |  |
| `UpdateDateTimeEnd` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `OrderStatusId` | query | str | hayır | Varsayılan olarak 9, ve 10 durumları dışındaki siparişler gelmektedir. Yani varsayılan olarak iptal edilmiş veya iade edilmiş siparişler dışındaki siparişler gelmektedir. Bu parametre 'all_with_incompleted' gönderilirse tüm tamamlanmamışlar da dahil edilip dönecektir. |
| `IsTransferred` | query | str | hayır | Aktarılanlar için '1', aktarılmayanlar için '0' girilmeli |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `Translation` | query | str | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchProductAdditionalData` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchCustomerData` | query | bool | hayır |  |
| `FetchInvoiceAddress` | query | bool | hayır |  |
| `FetchDeliveryAddress` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchCargoDetail` | query | bool | hayır |  |
| `FetchDeleteds` | query | bool | hayır |  |
| `FetchPaymentData` | query | bool | hayır |  |
| `FetchSubPaymentData` | query | bool | hayır |  |
| `FetchOnlyReturns` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

## `order/setShipment`

`POST https://magaza.example/rest1/order/setShipment/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Kısmi sevkiyat eklemek için kullanılır.    OrderKey kullanıcı tarafından oluşturulmuş benzersiz key, sistemde varsa güncelleme yapar.(gönderilmezse sistem kendi oluşturur.),   Products->Id değerine order/get metodundan dönen OrderProductId verisi gönderilmelidir.   StoreId değerine order/getWarehouse metodundan dönen StoreId verisi gönderilmelidir.    GrandTotal,IncludeDutyFee,IncludeCargoFee,IncludeServiceFee,CargoCompanyId ve Products verisi sadece sevkiyat oluşturma esnasında geçerlidir. Güncelleme esnasında önemsenmez. |

Örnek `data` alanları: `OrderKey`, `OrderNumber`, `StoreId`, `CargoKey`, `CargoTrackingNo`, `CargoTrackingUrl`, `CargoCount`, `BarcodeLink`, `RealTotalDesi`, `Desi`, `RealCargoAmount`, `EngagedInProcessingBranchOffice`, `StatusDesc`, `UpdateDate`, `GrandTotal`, `IncludeDutyFee`, `IncludeCargoFee`, `IncludeServiceFee`, `CargoCompanyId`, `Products`.
```json
[
  {
    "OrderKey": "",
    "OrderNumber": "",
    "StoreId": "",
    "CargoKey": "",
    "CargoTrackingNo": "",
    "CargoTrackingUrl": "",
    "CargoCount": "",
    "BarcodeLink": "",
    "RealTotalDesi": "",
    "Desi": "",
    "RealCargoAmount": "",
    "EngagedInProcessingBranchOffice": "",
    "StatusDesc": "",
    "UpdateDate": "",
    "GrandTotal": "",
    "IncludeDutyFee": 0,
    "IncludeCargoFee": 0,
    "IncludeServiceFee": 0,
    "CargoCompanyId": "",
    "Products": [
      {
        "Id": "",
        "Quantity": ""
      }
    ]
  }
]
```

## `order/updatePackageStatus`

`POST https://magaza.example/rest1/order/updatePackageStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | ShipmentId yerine OrderKey ile işlem yapılabilir |

Örnek `data` alanları: `ShipmentId`, `ShipmentStatusId`.
```json
[
  {
    "ShipmentId": "",
    "ShipmentStatusId": ""
  }
]
```

## `order/setPayWithIyzico` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/setPayWithIyzico/`

DİKKAT !: Gönderilmeyen veriler silinecektir. Metoda tüm verileri göndermeniz beklenir

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | OnlyGeneralSettings Sadece genel ayarlar güncellenmek isteniyorsa 'true' gönderilmesi beklenir    Mode test için 'TEST', canlı ortam için 'LIVE' gönderilmelidir    Method 'iframe' ya da 'pwi' gönderilmelidir.    Currancy'ın alabileceği değerler 'TRY','USD', 'EUR', 'GBP', 'CHF', 'NOK', 'RUB'    Category 'PC', 'GOLD', 'FOOD', 'PHONE', 'TABLET', 'OTHER' değerlerini alabilir.    CardStorage '0' veya '1'    WithProduct '0' veya '1' Aktif olduğunda iyzico tarafında şiparişteki tutarlar ayrı bir kalem olarak gönderilecektir. T-Soft paneli üzerinden iade işlemi mümkün olmayabilir     Kategori Eşleştirme,    IyzicoCategory alabileceği değerler:    PC, GOLD, FOOD, PHONE, TABLET, OTHER    Daha önceden var olan kategori eşlemeleri gönderilmezse silinir    ActivityLimit 0 veya 1   MaxLimit 0 veya 1   ViewMember 0 veya 1   ViewVendor 0 veya 1 |

Örnek `data` alanları: `OnlyGeneralSettings`, `Mode`, `Method`, `ApiKey`, `SecretKey`, `Currency`, `Category`, `CardStorage`, `WithProducts`, `CategoryMap`, `GeneralSettings`.
```json
[
  {
    "OnlyGeneralSettings": "false",
    "Mode": "",
    "Method": "",
    "ApiKey": "",
    "SecretKey": "",
    "Currency": "",
    "Category": "",
    "CardStorage": "",
    "WithProducts": "",
    "CategoryMap": [
      {
        "CategoryCode": "",
        "IyzicoCategory": ""
      }
    ],
    "GeneralSettings": [
      {
        "ActivityLimit": "",
        "MaxLimit": "",
        "ViewMember": "",
        "ViewVendor": "",
        "ListNo": "",
        "InvoiceAdditionalServiceDescription": ""
      }
    ]
  }
]
```

## `order/getWarehouse`

`POST https://magaza.example/rest1/order/getWarehouse/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |

## `order/getOrderPlatforms`

`POST https://magaza.example/rest1/order/getOrderPlatforms/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | query | text | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |

## `order/setShipByAt`

`POST https://magaza.example/rest1/order/setShipByAt/`

Pazaryeri entegrasyonundan gelen son kargoya verilme tarihini siparişe yazar. OrderId veya OrderCode alanlarından biri zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderId`, `OrderCode`, `ShipByAt`.
```json
[
  {
    "OrderId": "",
    "OrderCode": "",
    "ShipByAt": ""
  }
]
```
