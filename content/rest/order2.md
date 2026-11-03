---
title: Order2
description: Sipariş oluşturma ve durum güncelleme. Eski sipariş sınıfı.
---

# Order2

REST1 modülü · 26 metot · taban `https://magaza.example/rest1/order2/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Sipariş oluşturma ve durum güncelleme. Eski sipariş sınıfı.

## `order2/createOrders` (alpha)

`POST https://magaza.example/rest1/order2/createOrders/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Üyeliksiz alışverişte CustomerId yerine CustomerCode,CustomerName,CustomerSurname,CustomerEmail parametreleri gönderilebilir.    İlgili json verisi içinde SendMailAdmin=1 olarak gönderilirse yöneticiye eposta gönderimi sağlanır.   SendMailAdminAddress verisi ile hangi mail adresine mail gönderileceği de belirlenebilir. Bu parametre belirtilmezse eposta adresini otomatik olarak sistemden alacaktır.    İlgili json verisiyle birlikte CheckBasketProducts ve PaymentUrlFetch parametreleri true gönderilirse addToCart metodu ile sepete eklenmiş ürünleri product olarak alır ve ödeme sayfasında giden webview url'ini döner.    İlgili json verisi içerisinde ürüne ait hediye paketi varsa GiftPackage parametresini 1 yoksa 0 olarak gönderilmelidir. |
| `CheckOrderCode` | query | bool | hayır | Bir platformda birden çok aynı platform sipariş kodu olması istenmiyorsa true gönderilmelidir. |
| `PaymentUrlFetch` | query | bool | hayır |  |
| `PaymentUrlSendEmail` | query | bool | hayır |  |
| `PaymentUrlSendSms` | query | bool | hayır |  |
| `CheckBasketProducts` | query | bool | hayır |  |

Örnek `data` alanları: `OrderCode`, `CustomerCode`, `CustomerId`, `Currency`, `PaymentTypeId`, `SubPaymentTypeId`, `OrderStatusId`, `InvoiceAddressId`, `InvoiceTitle`, `InvoiceName`, `InvoiceIdentityNumber`, `InvoiceTaxOffice`, `InvoiceTaxNumber`, `InvoiceMobile`, `InvoiceOtherPhone`, `InvoiceCountry`, `InvoiceCountryCode`, `InvoiceProvince`, `InvoiceCity`, `InvoiceTown`, `InvoiceDistrict`, `InvoiceAddress`, `InvoiceZipcode`, `InvoiceCoordinateY`, `InvoiceCoordinateX`, `DeliveryAddressId`, `DeliveryTitle`, `DeliveryName`, `DeliveryMobile`, `DeliveryOtherPhone`, `DeliveryCountry`, `DeliveryCountryCode`, `DeliveryProvince`, `DeliveryCity`, `DeliveryTown`, `DeliveryDistrict`, `DeliveryAddress`, `DeliveryZipcode`, `DeliveryCoordinateY`, `DeliveryCoordinateX`, `OrderTotalPrice`, `CargoCode`, `GeneralOrderNote`, `UtmSource`, `UtmMedium`, `MicroExport`, `OrderDate`, `Products`.
```json
[
  {
    "OrderCode": "SC6391830",
    "CustomerCode": "T110",
    "CustomerId": "234723",
    "Currency": "TL",
    "PaymentTypeId": "-2",
    "SubPaymentTypeId": "",
    "OrderStatusId": "4",
    "InvoiceAddressId": "",
    "InvoiceTitle": "İş Adresim",
    "InvoiceName": "Kübra K.",
    "InvoiceIdentityNumber": "",
    "InvoiceTaxOffice": "",
    "InvoiceTaxNumber": "12324445",
    "InvoiceMobile": "5070251250",
    "InvoiceOtherPhone": "",
    "InvoiceCountry": "Türkiye",
    "InvoiceCountryCode": "TR",
    "InvoiceProvince": "",
    "InvoiceCity": "İstanbul",
    "InvoiceTown": "Esenler",
    "InvoiceDistrict": "",
    "InvoiceAddress": "Yıldız Teknik Üniversitesi Davutpaşa Kampüsü",
    "InvoiceZipcode": "",
    "InvoiceCoordinateY": "",
    "InvoiceCoordinateX": "",
    "DeliveryAddressId": "",
    "DeliveryTitle": "İş adresim",
    "DeliveryName": "Kübra K.",
    "DeliveryMobile": "5070251250",
    "DeliveryOtherPhone": "",
    "DeliveryCountry": "Türkiye",
    "DeliveryCountryCode": "TR",
    "DeliveryProvince": "",
    "DeliveryCity": "İstanbul",
    "DeliveryTown": "Esenler",
    "DeliveryDistrict": "",
    "DeliveryAddress": "Yıldız Teknik Üniversitesi Davutpaşa Kampüsü",
    "DeliveryZipcode": "",
    "DeliveryCoordinateY": "",
    "DeliveryCoordinateX": "",
    "OrderTotalPrice": "250",
    "CargoCode": "",
    "GeneralOrderNote": "",
    "UtmSource": "",
    "UtmMedium": "",
    "MicroExport": "0",
    "OrderDate": "1429855185",
    "Products": [
      {
        "ProductCode": "T625",
        "VariantType1": "",
        "VariantType2": "",
        "SubProductCode": "",
        "Quantity": "1",
        "OrderNote": "",
        "GiftPackage": "0"
      }
    ]
  }
]
```

## `order2/deleteOrders`

`POST https://magaza.example/rest1/order2/deleteOrders/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderId`.
```json
[
  {
    "OrderId": ""
  }
]
```

## `order2/getCargoCompanyList`

`POST https://magaza.example/rest1/order2/getCargoCompanyList/`

Kargo firmalarını listeler. Her firma için döndürülen alanlar:
- Id, Code, Name, Type, ListNo
- IsActiveForCustomer: Üye için aktif mi (true/false)
- IsActiveForVendor: Bayi için aktif mi (true/false)
- Returnable: Kargo firması iade için kullanılabilir mi (true/false)
- Integrator: Kargo entegrasyonu adı (örn. yurtici, hepsijet)
- RequiresPickDate: Randevulu alım gerektirir mi (true/false). true ise platform/getReturnPickDates üzerinden uygun tarih listesi çekilmelidir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Name` | query | str | hayır | Kargo firması adına göre filtreler. Kısmi eşleşme yapılır, gönderilen değeri içeren tüm kargo firmaları listelenir. Örnek: Name=Yurtiçi |

## `order2/setCargoCompany`

`POST https://magaza.example/rest1/order2/setCargoCompany/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CalculateType: Kargo firmasının hesaplama türü. Desi, Kg, Desi2, Fiyat olarak gönderilebilir.  ListNo: Kargo firması için tanımlı liste numarasıdır. IsActiveForCustomer,IsActiveForVendor,IsPaymentTypeActive,IsDefaultCargo değerleri true(1) yada false(0) gönderilebilir  Örnek: {"CompanyCode":"T1","CalculateType":"Desi","ListNo":"99"} |

Örnek `data` alanları: `CompanyCode`, `CompanyName`, `CalculateType`, `IsActiveForCustomer`, `IsActiveForVendor`, `IsPaymentTypeActive`, `IsDefaultCargo`, `ListNo`.
```json
[
  {
    "CompanyCode": "T1",
    "CompanyName": "",
    "CalculateType": "Desi",
    "IsActiveForCustomer": 0,
    "IsActiveForVendor": 0,
    "IsPaymentTypeActive": 0,
    "IsDefaultCargo": 0,
    "ListNo": "99"
  }
]
```

## `order2/getCargoPricing`

`POST https://magaza.example/rest1/order2/getCargoPricing/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CompanyId` | url_param | int | hayır |  |
| `Name` | query | str | hayır | Kargo firması adına göre filtreler. Kısmi eşleşme yapılır, gönderilen değeri içeren tüm kargo firmaları listelenir. CompanyId ile birlikte gönderilirse, ilgili firma yalnızca adı da eşleşiyorsa döner. Örnek: Name=Yurtiçi |

## `order2/getCustomerIdOfOrder`

`POST https://magaza.example/rest1/order2/getCustomerIdOfOrder/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | int | evet |  |

## `order2/getOrderDetails`

`POST https://magaza.example/rest1/order2/getOrderDetails/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderStatusId` | query | str | hayır | Default gelen süreçler: 2,3,4,5,6,7,8,11,12,13 İptal edildi için 9, İade Edildi için 10 durumlarını da ekleyin. |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

## `order2/getOrderDetailsByOrderId`

`POST https://magaza.example/rest1/order2/getOrderDetailsByOrderId/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | int | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

## `order2/getOrders`

`POST https://magaza.example/rest1/order2/getOrders/`

Bu metoda alternatif olarak yeni geliştirilen order/get metodu mevcuttur. order/get metodunun kullanılması önerilir. Bkz. [`order/get`](order.md#order-get).

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderDateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `OrderDateTimeEnd` | query | str | hayır |  |
| `UpdateDateTimeStart` | query | str | hayır |  |
| `UpdateDateTimeEnd` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `OrderStatusId` | query | str | hayır | Default gelen süreçler: 2,3,4,5,6,7,8,11,12,13 İptal edildi için 9, İade Edildi için 10 durumlarını da ekleyin. |
| `IsTransferred` | query | str | hayır | Aktarılanlar için '1', aktarılmayanlar için '0' girilmeli |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `FetchCustomerGroupInfo` | query | bool | hayır |  |
| `IsVendor` | query | bool | hayır |  |
| `CustomerGroupCode` | query | str | hayır |  |
| `FetchInvoiceDetails` | query | bool | hayır |  |
| `InvoiceNumber` | query | str | hayır |  |
| `InvoiceDateTimeStart` | query | str | hayır | Example: "2014-07-21T20:09:00Z", 1374475843 |
| `InvoiceDateTimeEnd` | query | str | hayır | Example: "2014-08-21T20:09:00Z", 1374475843 |
| `noDetails` | query | bool | hayır |  |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchAdditionalCustomerData` | query | bool | hayır |  |
| `FetchAdditionalCustomerAllData` | query | bool | hayır |  |
| `FetchAdditionalCCNumber` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchAdditionalTransaction` | query | bool | hayır |  |
| `FetchOrderReferrer` | query | bool | hayır |  |
| `FetchAddressCode` | query | bool | hayır |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

Postman B2C çağrısı `IsVendor=false` ve `OrderDateTimeEnd={{currentdate}}` gönderir. B2B çağrısı `IsVendor=true` ve `OrderDateTimeEnd=2024-05-19` gönderir. İkisinde `OrderDateTimeStart={{tendaysago}}`, `OrderStatusId=3`, `FetchCustomerGroupInfo=true`, `FetchAdditionalCCNumber=true`, `orderby=OrderDate DESC`.

## `order2/getOrderStatusList`

`POST https://magaza.example/rest1/order2/getOrderStatusList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| ` ` | query | str | hayır |  |
| `FetchOrderCount` | query | bool | hayır |  |
| `FetchWithPassive` | query | bool | hayır |  |

Postman bu uca `data` içinde `OrderCode` (`SP08034`) gönderir. Konsol parametre listesinde `data` yoktur.

## `order2/getPaymentTypeList`

`POST https://magaza.example/rest1/order2/getPaymentTypeList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `order2/getPostStatus`

`POST https://magaza.example/rest1/order2/getPostStatus/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `order2/setPostStatus`

`POST https://magaza.example/rest1/order2/setPostStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `order` | query | text | evet |  |
| `status` | query | int | evet |  |
| `postNote` | query | text | evet |  |

Örnek `order` alanları: `orderId`, `productId`.
```json
[
  {
    "orderId": "98",
    "productId": "689"
  }
]
```

```json
"2"
```

```json
"Stokta kalmadı"
```

## `order2/setAddress` (alpha)

`POST https://magaza.example/rest1/order2/setAddress/`

LisansEihracat lisansının açıklığına göre set edilemeyecek adreslerin kontrolü kullanıcıya bırakılmıştır. platform/getAvaliableAddress metodundan kontrol sağlanabilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Adres Tipleri:   1: sadece teslimat adresi   2: sadece fatura adresi   3: hem teslimat, hem fatura adresi |

Örnek `data` alanları: `customer_id`, `address_type`, `address_id`.
```json
[
  {
    "customer_id": "110",
    "address_type": "2",
    "address_id": "5"
  }
]
```

## `order2/setSupplyStatus`

`POST https://magaza.example/rest1/order2/setSupplyStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | "Status" verisinin alabileceği değerler.  0: Oluşturuldu  1:Tedarik Edilecek  2:Tedarik Bildirildi  3:Tedarik Edildi  4:Tedarik Edilmedi  5:İptal Edildi    OrderCode yerine OrderId, ProductCode yerine ProductId gönderilebilir.   Alt ürünlerde güncelleme için SubProductCode ve ya SubProductId gönderilebilir |

Örnek `data` alanları: `OrderCode`, `ProductCode`, `Status`, `StatusNote`.
```json
[
  {
    "OrderCode": "TS06057441",
    "ProductCode": "T689",
    "Status": 5,
    "StatusNote": ""
  }
]
```

## `order2/setCargoPricing`

`POST https://magaza.example/rest1/order2/setCargoPricing/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | PriceId gönderilirse güncelleme yapılır. PriceId gönderilmezse, ilgili kargo firması için aynı alt/üst limit aralığına sahip kayıt varsa güncelleme, yoksa yeni kayıt eklenir. PriceId değeri getCargoPricing servisinden alınabilir.  Yeni kayıt eklenirken kargo firmasının kimliği (CompanyId veya CompanyCode) zorunludur. |

Örnek `data` alanları: `PriceId`, `LowerLimit`, `UpperLimit`, `LocalPrice`, `IntercityPrice`, `InternationalPrice`, `Region1`, `Region2`, `Region3`, `Region4`, `Region5`, `Region6`, `Region7`, `Region8`, `Region9`, `Region10`, `Region11`, `Region12`, `Region13`, `Region14`, `Region15`, `Region16`, `Region17`, `Region18`, `Region19`, `Region20`, `Region21`, `Region22`, `Region23`, `Region24`, `Region25`, `Region26`, `Region27`, `Region28`, `Region29`, `Region30`.
```json
[
  {
    "PriceId": "",
    "LowerLimit": "",
    "UpperLimit": "",
    "LocalPrice": "",
    "IntercityPrice": "",
    "InternationalPrice": "",
    "Region1": "0.00",
    "Region2": "0.00",
    "Region3": "0.00",
    "Region4": "0.00",
    "Region5": "0.00",
    "Region6": "0.00",
    "Region7": "0.00",
    "Region8": "0.00",
    "Region9": "0.00",
    "Region10": "0.00",
    "Region11": "0.00",
    "Region12": "0.00",
    "Region13": "0.00",
    "Region14": "0.00",
    "Region15": "0.00",
    "Region16": "0.00",
    "Region17": "0.00",
    "Region18": "0.00",
    "Region19": "0.00",
    "Region20": "0.00",
    "Region21": "0.00",
    "Region22": "0.00",
    "Region23": "0.00",
    "Region24": "0.00",
    "Region25": "0.00",
    "Region26": "0.00",
    "Region27": "0.00",
    "Region28": "0.00",
    "Region29": "0.00",
    "Region30": "0.00"
  }
]
```

## `order2/updateInvoiceDetails`

`POST https://magaza.example/rest1/order2/updateInvoiceDetails/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | InvoiceDate example:  "2015-10-12T07:09:00Z", 1444622940   EarchiveUuid bu parametre Digital Planet tarafından e fatura ya da e arşiv kesildiği zaman Digiltal Planet tarafından iletilen fatura id bilgisidir.  IsEarchive parametresi ise fatura tipinin ne olduğunu belirlemektedir " IsEarchive " versinin alabileceği değerler.  0: Normal   1: E-Arşiv   2: E-Fatura |

Örnek `data` alanları: `OrderCode`, `InvoiceDate`, `InvoiceNumber`, `WaybillNumber`, `IsInvoiced`, `EInvoiceLink`, `IsEarchive`, `EarchiveUuid`.
```json
[
  {
    "OrderCode": "SP0210195",
    "InvoiceDate": "2015-10-12T07:09:00Z",
    "InvoiceNumber": "1111",
    "WaybillNumber": "2222",
    "IsInvoiced": "1",
    "EInvoiceLink": "https://ornek.com/ornekfatura123.pdf",
    "IsEarchive": "1",
    "EarchiveUuid": "1A1886B8-87SAD-4F1D-9F1D-1A1886B8"
  }
]
```

## `order2/updateOrderStatusAsCancelled`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsCancelled/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`.
```json
[
  {
    "OrderCode": "SP08034"
  }
]
```

## `order2/updateOrderStatusAsCargoReady`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsCargoReady/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`.
```json
[
  {
    "OrderCode": "SP08034"
  }
]
```

Postman `updateOrderStatusAsCargoReady` aynı `OrderCode` değerini gönderir.

## `order2/updateOrderStatusAsDelivered`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsDelivered/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`.
```json
[
  {
    "OrderCode": "SP08034"
  }
]
```

## `order2/updateOrderStatusAsSentToCargo`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsSentToCargo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`, `CargoCode`, `CargoTrackingCode`, `Shipment`.
```json
[
  {
    "OrderCode": "SP08034",
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

## `order2/updateOrderStatusAs`

`POST https://magaza.example/rest1/order2/updateOrderStatusAs/`

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

## `order2/setTransferredStatus`

`POST https://magaza.example/rest1/order2/setTransferredStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | OrderId veya OrderCode gönderilebilir. |

Örnek `data` alanları: `OrderCode`, `IsTransferred`, `TransferNote`.
```json
[
  {
    "OrderCode": "TS1703182",
    "IsTransferred": "0",
    "TransferNote": ""
  }
]
```

## `order2/cargoTracking`

`POST https://magaza.example/rest1/order2/cargoTracking/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | str | evet |  |

## `order2/getOrderNote`

`POST https://magaza.example/rest1/order2/getOrderNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "IsNote \| 1 \| equal" |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

## `order2/setOrderNote`

`POST https://magaza.example/rest1/order2/setOrderNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderId`, `AdminId`, `CustomerId`, `Text`.
```json
[
  {
    "OrderId": "168",
    "AdminId": "123",
    "CustomerId": "231",
    "Text": "Sipariş notunuz"
  }
]
```
