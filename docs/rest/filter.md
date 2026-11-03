---
title: Filter
url: https://tsoft.bahadirdogru.com/rest/filter/
---

# Filter

REST1 modülü · 7 metot · taban `https://magaza.example/rest1/filter/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Yeni filtre yapısı: grup, seçenek ve ürüne bağlama.

## `filter/setGroup`

`POST https://magaza.example/rest1/filter/setGroup/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | GroupCode varsa güncelleme yapar, yoksa ekleme yapar.   GroupCode Yerine GroupId kullanılabilir   "Type" parametresinin alabileceği değerler.  0:Çoklu  1:Tekli  2:Sayısal   "Status" parametresinin alabileceği değerler.  1:Aktif  2:Pasif  3:Gizli    "View" parametresinin alabileceği değerler.  "list", "color", "shape"    "CatalogView" parametresinin alabileceği değerler,   "image", "color", "button","select" |

Örnek `data` alanları: `GroupCode`, `Name`, `AdminName`, `ListNo`, `View`, `CatalogView`, `Type`, `Status`, `Translation`.
```json
[
  {
    "GroupCode": "T11",
    "Name": "İşlemci",
    "AdminName": "İşlemci",
    "ListNo": "999",
    "View": "",
    "CatalogView": "",
    "Type": "0",
    "Status": "1",
    "Translation": [
      {
        "Language": "en",
        "Name": "Processor"
      },
      {
        "Language": "ar",
        "Name": "المعالج"
      }
    ]
  }
]
```

## `filter/setOption`

`POST https://magaza.example/rest1/filter/setOption/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | OptionCode varsa güncelleme yapar, yoksa ekleme yapar.   OptionCoe Yerine OptionId kullanılabilir    GroupCode yerine GroupId kullanılabilir. |

Örnek `data` alanları: `GroupCode`, `OptionCode`, `Name`, `Data`, `ListNo`, `Translation`.
```json
[
  {
    "GroupCode": "T15",
    "OptionCode": "T129",
    "Name": "Intel Core i7",
    "Data": "",
    "ListNo": 999,
    "Translation": [
      {
        "Language": "en",
        "Name": "Intel Core i7"
      },
      {
        "Language": "ar",
        "Name": "انتل كور i7"
      }
    ]
  }
]
```

## `filter/get`

`POST https://magaza.example/rest1/filter/get/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `GroupId` | url_param | int | hayır |  |
| `Translation` | query | text | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `FetchOptions` | query | bool | hayır |  |

## `filter/getFiltersByProductCode`

`POST https://magaza.example/rest1/filter/getFiltersByProductCode/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | int | hayır |  |

## `filter/addGroupToProduct`

`POST https://magaza.example/rest1/filter/addGroupToProduct/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `GroupCode`.
```json
[
  {
    "ProductCode": "T695",
    "GroupCode": "T78"
  }
]
```

## `filter/deleteGroupFromProduct`

`POST https://magaza.example/rest1/filter/deleteGroupFromProduct/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `GroupCode`.
```json
[
  {
    "ProductCode": "T695",
    "GroupCode": "T78"
  }
]
```

## `filter/setFilterValues`

`POST https://magaza.example/rest1/filter/setFilterValues/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | GroupCode yerine GroupId kullanılabilir.     Value verilerine OptionCode gönderilecekse ValueType verisinin 'code' olarak gönderilmesi gereklidir.    Çoklu değer gönderilmek isteniyorsa Value değeri array olmalıdır.    Sayısal değer gönderilmek isteniyorsa Value değeri integer yada double olmalıdır. |

Örnek `data` alanları: `ProductCode`, `GroupCode`, `Value`.
```json
[
  {
    "ProductCode": "T695",
    "GroupCode": "T78",
    "Value": 10.25
  },
  {
    "ProductCode": "T695",
    "GroupCode": "T79",
    "ValueType": "code",
    "Value": [
      "T129",
      "T130"
    ]
  },
  {
    "ProductCode": "T695",
    "GroupCode": "T80",
    "ValueType": "id",
    "Value": "129"
  }
]
```
