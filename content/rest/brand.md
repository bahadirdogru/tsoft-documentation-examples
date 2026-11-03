---
title: Brand
description: Marka listeleme, yazma, dil ve görsel.
---

# Brand

REST1 modülü · 8 metot · taban `https://magaza.example/rest1/brand/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Marka listeleme, yazma, dil ve görsel.

## `brand/getBrandById`

`POST https://magaza.example/rest1/brand/getBrandById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `id` | url_param | int | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

## `brand/getBrandByName`

`POST https://magaza.example/rest1/brand/getBrandByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `name` | url_param | str | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

## `brand/getBrands`

`POST https://magaza.example/rest1/brand/getBrands/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

## `brand/setBrands`

`POST https://magaza.example/rest1/brand/setBrands/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | BrandId girilmediği durumda BrandName isminde veri varsa bu veriyi güncellemektedi.   BrandName güncellenmek istendiği durumda BrandId girilmesi zorunludur.  BrandName benzersiz olmak zorundadır. Bu yüzden BrandName parametresine verilen değer ile aynı isimde veri varsa ve BrandId ile eşleşmiyorsa; BrandId yoksa güncelleme yapılacaktır, BrandId varsa kayıt yapılmayacaktır. |

Örnek `data` alanları: `BrandId`, `BrandName`, `IsActive`, `SeoTitle`, `SeoDescription`, `ShortDescription`, `Image1Url`, `Image2Url`, `RowNumber`, `Showcase`.
```json
[
  {
    "BrandId": "",
    "BrandName": "brandname",
    "IsActive": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "ShortDescription": "",
    "Image1Url": "",
    "Image2Url": "",
    "RowNumber": "99",
    "Showcase": {
      "Top": "",
      "Bottom": "",
      "MobileTop": "",
      "MobileBottom": "",
      "Language": ""
    }
  }
]
```

## `brand/setBrandLanguage`

`POST https://magaza.example/rest1/brand/setBrandLanguage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | BrandId zorunludur. |

Örnek `data` alanları: `BrandId`, `BrandName`, `SeoTitle`, `SeoDescription`, `SeoLink`, `Language`.
```json
[
  {
    "BrandId": "",
    "BrandName": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "SeoLink": "",
    "Language": ""
  }
]
```

## `brand/addImageFromUrl`

`POST https://magaza.example/rest1/brand/addImageFromUrl/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `BrandId`, `Image1Url`, `Image2Url`.
```json
[
  {
    "BrandId": "11",
    "Image1Url": "",
    "Image2Url": ""
  }
]
```

## `brand/addImageFromFile`

`POST https://magaza.example/rest1/brand/addImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | hayır | WebServis arayüz konsolu dışında gönderimlerde image_1 ve image_2 parametreleri kullanılabilir. |

## `brand/deleteBrand`

`POST https://magaza.example/rest1/brand/deleteBrand/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `BrandId`.
```json
[
  {
    "BrandId": ""
  }
]
```
