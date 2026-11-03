---
title: Catalog
url: https://tsoft.bahadirdogru.com/rest/catalog/
---

# Catalog

REST1 modülü · 5 metot · taban `https://magaza.example/rest1/catalog/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Varyant teması ve katalog görseli.

## `catalog/getVariantThemes`

`POST https://magaza.example/rest1/catalog/getVariantThemes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `VariantThemeId` | query | int | hayır |  |
| `VariantThemeCode` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

## `catalog/setVariantThemes`

`POST https://magaza.example/rest1/catalog/setVariantThemes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | AttributeMainFilters ve ProductListAttributes parametlerine gönderilecek olan attribute group kodu AttributeFilters içerisinde olmalı ve ya daha önceden AttributeFilters alanında eklenmiş olmalı. |

Örnek `data` alanları: `VariantThemeCode`, `VariantThemeName`, `AttributeFilters`, `AttributeMainFilters`, `ProductListAttributes`.
```json
[
  {
    "VariantThemeCode": "T15-3",
    "VariantThemeName": "AltKategoriTest",
    "AttributeFilters": [
      "T1",
      "T2"
    ],
    "AttributeMainFilters": [
      "T1"
    ],
    "ProductListAttributes": [
      "T1"
    ]
  }
]
```

## `catalog/deleteVariantThemes`

`POST https://magaza.example/rest1/catalog/deleteVariantThemes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `VariantThemeId`.
```json
[
  {
    "VariantThemeId": 11
  },
  {
    "VariantThemeCode": "TV11"
  }
]
```

## `catalog/addImageFromUrl`

`POST https://magaza.example/rest1/catalog/addImageFromUrl/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `CatalogCode`, `ImageUrl`, `ListNo`, `Attributes`.
```json
[
  {
    "CatalogCode": "T11",
    "ImageUrl": "",
    "ListNo": "99",
    "Attributes": [
      {
        "Attribute": "T51",
        "AttributeValue": "T21"
      },
      {
        "Attribute": "T51",
        "AttributeValue": "TS-20"
      }
    ]
  }
]
```

## `catalog/addImageFromFile`

`POST https://magaza.example/rest1/catalog/addImageFromFile/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | hayır |  |
| `image` | file | file | evet |  |

Örnek `data` alanları: `CatalogCode`, `ListNo`, `Attributes`.
```json
[
  {
    "CatalogCode": "T11",
    "ListNo": "99",
    "Attributes": [
      {
        "Attribute": "T51",
        "AttributeValue": "T21"
      },
      {
        "Attribute": "T51",
        "AttributeValue": "TS-20"
      }
    ]
  }
]
```
