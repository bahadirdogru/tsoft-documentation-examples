---
title: SubProduct
description: Alt ürün, özellik ve stok/fiyat.
---

# SubProduct

REST1 modülü · 20 metot · taban `https://magaza.example/rest1/subProduct/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Alt ürün, özellik ve stok/fiyat.

## `subProduct/addImageFromFile`

`POST https://magaza.example/rest1/subProduct/addImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | evet |  |
| `list_number` | query | int | hayır |  |
| `PropertyType` | query | int | evet | Nitelik numarası girilmelidir. Örneğin nitelik_1 için '1' girilmelidir. nitelik_2 için ise '2' girilmelidir |
| `Property` | query | str | evet | PropertyType'de verilen niteliğin alması istenilen değer girilmelidir. Örneğin : Kırmızı, Mavi vb. |
| `ImageSizeWidthHeightControl` | query | int | evet | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |

## `subProduct/addImageFromLink`

`POST https://magaza.example/rest1/subProduct/addImageFromLink/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | evet | PropertyType ve Property opsiyoneldir. Gönderildiğinde görsel ilgili varyant ile ilişkilendirilir: PropertyType için nitelik_1'de '1' (veya Property1), nitelik_2'de '2' (veya Property2) gönderilir, Property ise niteliğin değerini taşır (örn: Kırmızı, S). Gönderilmezse görsel alt ürünün ilk niteliğine (TurId1) eklenir. |

Örnek `data` alanları: `SubProductCode`, `ImageUrl`, `ListNumber`, `PropertyType`, `Property`.
```json
[
  {
    "SubProductCode": "TA582",
    "ImageUrl": "http://celil.meticaret.com/kiz-cocuk-elbise-503-64-B.jpg",
    "ListNumber": "",
    "PropertyType": "1",
    "Property": "Kırmızı"
  }
]
```

## `subProduct/addSubProducts`

`POST https://magaza.example/rest1/subProduct/addSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Property1GroupId ve Property2GroupId verileri gönderilmezse 'Yönetim Paneli > Ürünler > Alt Ürün > Gruplar > Web Servis Alt Ürün Tür Grubu Belirle' ayarları baz alınır.     SubProductCode gönderilmesze kod otomatik oluşur. |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`, `Barcode`, `SupplierSubProductCode`, `Property1GroupId`, `Property2GroupId`, `Property1`, `Property2`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `Stock`, `CBM`, `Weight`, `IsActive`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117",
    "Barcode": "123DSD235T",
    "SupplierSubProductCode": "",
    "Property1GroupId": "",
    "Property2GroupId": "",
    "Property1": "yeşil",
    "Property2": "S",
    "BuyingPrice": "200",
    "SellingPrice": "350",
    "DiscountedSellingPrice": "300",
    "VendorSellingPrice": "380",
    "Stock": "35",
    "CBM": "30",
    "Weight": "30",
    "IsActive": "1"
  }
]
```

## `subProduct/deleteSubProducts`

`POST https://magaza.example/rest1/subProduct/deleteSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117"
  }
]
```

## `subProduct/getProperties`

`POST https://magaza.example/rest1/subProduct/getProperties/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `Translation` | query | text | hayır |  |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `subProduct/setProperties`

`POST https://magaza.example/rest1/subProduct/setProperties/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | PropertyId parametresi gönderilmezse ekleme yapar, gönderilirse güncelleme yapar.  'ImageUrl' parametresi aracılığıyla resmin URL'sini göndererek ekleyebilirsiniz. Eğer dosyadan resim eklemek istiyorsanız, data alanındaki ilk gelen JSON objesini kabul edeceğiz. |
| `image` | file | file | hayır |  |

Örnek `data` alanları: `PropertyId`, `GroupId`, `Property`, `ColorCode`, `ListNo`, `ImageUrl`.
```json
[
  {
    "PropertyId": "5",
    "GroupId": "2",
    "Property": "Beyaz",
    "ColorCode": "#FFFFFF",
    "ListNo": "0",
    "ImageUrl": ""
  }
]
```

## `subProduct/setPropertyLanguages`

`POST https://magaza.example/rest1/subProduct/setPropertyLanguages/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | GroupName : GroupId Tespit edilememişse GroupName gönderilebilir   PropertyType : Grup bilgisi tespit edilemiyor ve panelde tanımlanan webservis alt ürün gruplarının kullanılması isteniyorsa niletik bir için 1, nitelik 2 için 2 gönderilmelidir   PropertyName : PropertyId tespit edilememişse PropertyName gönderilebilir. |

Örnek `data` alanları: `GroupId`, `GroupName`, `PropertyType`, `PropertyId`, `PropertyName`, `Language`, `Translation`.
```json
[
  {
    "GroupId": "16",
    "GroupName": "Renk",
    "PropertyType": "1",
    "PropertyId": "16",
    "PropertyName": "Kırmızı",
    "Language": "en",
    "Translation": "red"
  }
]
```

## `subProduct/getPropertyGroups`

`POST https://magaza.example/rest1/subProduct/getPropertyGroups/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `subProduct/setPropertyGroups`

`POST https://magaza.example/rest1/subProduct/setPropertyGroups/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type için:   1:Combo 2:Radio 3:Kutucuk  PropertyId parametresi gönderilmezse ekleme yapar, gönderilirse güncelleme yapar.  PropertyCode gönderilirse PropertyCode'a göre güncelleme yapar |

Örnek `data` alanları: `PropertyId`, `Name`, `GroupName`, `Type`.
```json
[
  {
    "PropertyId": 1,
    "Name": "",
    "GroupName": "",
    "Type": 1
  }
]
```

## `subProduct/getSubProductByCode`

`POST https://magaza.example/rest1/subProduct/getSubProductByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SubProductCode` | url_param | str | evet |  |
| `single` | query | bool | evet |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |

## `subProduct/getSubProductById`

`POST https://magaza.example/rest1/subProduct/getSubProductById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SubProductId` | url_param | int | evet |  |
| `single` | query | bool | evet |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |

## `subProduct/getSubProducts`

`POST https://magaza.example/rest1/subProduct/getSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerGroupCode` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Varsayılan:50, Max:500 |
| `CategoryIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `BrandIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `columns` | query | text | hayır | Örnek: "SubProductCode,MainProductId,UpdateDate" |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Örnek: "UpdateDate ASC", Default: "UpdateDate DESC" |
| `FetchPriceWithComma` | query | bool | hayır |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |
| `FetchGroupInfo` | query | bool | hayır |  |
| `FetchAdditionalInfo` | query | bool | hayır |  |
| `FetchSupplierDetails` | query | bool | hayır |  |
| `FlexiblePrices` | query | str | hayır | Örnek : Price3,Price4 (product/fields metodundan erişilebilir.) |
| `StockFields` | query | str | hayır | Örnek : Stock2,Stock3 (product/fields metodundan erişilebilir.) |

## `subProduct/getSubProductsByParentCode`

`POST https://magaza.example/rest1/subProduct/getSubProductsByParentCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ParentCode` | url_param | str | evet |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Varsayılan:50, Max:500 |
| `columns` | query | text | hayır | Örnek: "SubProductCode,MainProductId,UpdateDate" |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `orderby` | query | str | hayır | Örnek: "UpdateDate ASC", Default: "UpdateDate DESC" |
| `FetchDiscountedPrice` | query | bool | hayır |  |

## `subProduct/getSubProductsByParentId`

`POST https://magaza.example/rest1/subProduct/getSubProductsByParentId/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ParentId` | url_param | int | evet |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Varsayılan:50, Max:500 |
| `columns` | query | text | hayır | Örnek: "SubProductCode,MainProductId" |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `orderby` | query | str | hayır | Örnek: "UpdateDate ASC", Default: "UpdateDate DESC" |
| `CustomerGroupCode` | query | text | hayır |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |

## `subProduct/setSubProducts`

`POST https://magaza.example/rest1/subProduct/setSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Property1GroupId ve Property2GroupId verileri gönderilmezse 'Yönetim Paneli > Ürünler > Alt Ürün > Gruplar > Web Servis Alt Ürün Tür Grubu Belirle' ayarları baz alınır.    SubProductCode gönderilmesze alt ürün ekleme işlemi yapılır ve kod otomatik oluşur. |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`, `Barcode`, `SupplierSubProductCode`, `Property1GroupId`, `Property2GroupId`, `Property1`, `Property2`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `Stock`, `CBM`, `Weight`, `IsActive`, `Point`, `IsDefaultSubProduct`, `AdditionalInfo`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117",
    "Barcode": "123DSD235T",
    "SupplierSubProductCode": "",
    "Property1GroupId": "",
    "Property2GroupId": "",
    "Property1": "yeşil",
    "Property2": "S",
    "BuyingPrice": "200",
    "SellingPrice": "350",
    "DiscountedSellingPrice": "300",
    "VendorSellingPrice": "380",
    "Stock": "35",
    "CBM": "30",
    "Weight": "30",
    "IsActive": "1",
    "Point": 0,
    "IsDefaultSubProduct": 0,
    "AdditionalInfo": [
      {
        "Language": "tr",
        "Info": "123"
      },
      {
        "Language": "en",
        "Info": "321"
      }
    ]
  }
]
```

## `subProduct/updateSubProducts`

`POST https://magaza.example/rest1/subProduct/updateSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Property1GroupId ve Property2GroupId verileri gönderilmezse 'Yönetim Paneli > Ürünler > Alt Ürün > Gruplar > Web Servis Alt Ürün Tür Grubu Belirle' ayarları baz alınır.    MainProductCode yerine MainProductId, SubProductCode yerine SubProductId kullanılabilir. |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`, `Barcode`, `SupplierSubProductCode`, `Property1GroupId`, `Property2GroupId`, `Property1`, `Property2`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `Stock`, `CBM`, `Weight`, `IsActive`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117",
    "Barcode": "123DSD235T",
    "SupplierSubProductCode": "",
    "Property1GroupId": "",
    "Property2GroupId": "",
    "Property1": "yeşil",
    "Property2": "S",
    "BuyingPrice": "200",
    "SellingPrice": "350",
    "DiscountedSellingPrice": "300",
    "VendorSellingPrice": "380",
    "Stock": "35",
    "CBM": "30",
    "Weight": "30",
    "IsActive": "1"
  }
]
```

## `subProduct/updateStock`

`POST https://magaza.example/rest1/subProduct/updateStock/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Stok değerini sabit bir değere atamak isterseniz Stok parametresini, sabit bir sayı kadar arttırmak isterseniz StockIncrease parametresini, sabit bir sayı kadar azaltmak isterseniz StockDecrease parametresini kullnamalısınız. Stock parametresi numerik, StockIncrease ve StockDecrease parametreleri ise pozitif tam sayı değeri alabilirler.   SubProductCode yerine SubProductId kullanılarak da güncelleme yapılabilir.     Bu metod aracılığı ile Çoklu stok parametreleri de güncellenebilmekteridir, Stock3, Stock4 vb. şeklinde gönderilebilir. |

Örnek `data` alanları: `SubProductCode`, `Stock`.
```json
[
  {
    "SubProductCode": "TA26",
    "Stock": "17"
  },
  {
    "SubProductCode": "TA26",
    "StockIncrease": "3"
  },
  {
    "SubProductCode": "TA26",
    "StockDecrease": "5"
  }
]
```

## `subProduct/updateStockBySupplierCode`

`POST https://magaza.example/rest1/subProduct/updateStockBySupplierCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SupplierSubProductCode`, `Stock`.
```json
[
  {
    "SupplierSubProductCode": "TKU582",
    "Stock": "46"
  }
]
```

## `subProduct/updatePrice`

`POST https://magaza.example/rest1/subProduct/updatePrice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SubProductCode`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `OnSale`.
```json
[
  {
    "SubProductCode": "TA26",
    "BuyingPrice": "130",
    "SellingPrice": "150",
    "DiscountedSellingPrice": "120",
    "VendorSellingPrice": "180",
    "OnSale": false
  }
]
```

## `subProduct/updateStockAndPrice`

`POST https://magaza.example/rest1/subProduct/updateStockAndPrice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SubProductCode`, `Stock`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`.
```json
[
  {
    "SubProductCode": "TA26",
    "Stock": "27",
    "BuyingPrice": "130",
    "SellingPrice": "150",
    "DiscountedSellingPrice": "120",
    "VendorSellingPrice": "180"
  }
]
```
