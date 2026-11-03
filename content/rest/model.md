---
title: Model
description: Model kayıtları.
---

# Model

REST1 modülü · 9 metot · taban `https://magaza.example/rest1/model/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Model kayıtları.

## `model/getModelById`

`POST https://magaza.example/rest1/model/getModelById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ModelId` | url_param | int | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

## `model/getModelByName`

`POST https://magaza.example/rest1/model/getModelByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ModelName` | url_param | str | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

## `model/getModels`

`POST https://magaza.example/rest1/model/getModels/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

## `model/setModels`

`POST https://magaza.example/rest1/model/setModels/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ModelCode`, `Name`, `IsActive`, `SeoLink`, `SeoTitle`, `SeoDescription`, `Showcase`.
```json
[
  {
    "ModelCode": "T6",
    "Name": "pink",
    "IsActive": "1",
    "SeoLink": "",
    "SeoTitle": "",
    "SeoDescription": "",
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

## `model/addModelImageFromUrl`

`POST https://magaza.example/rest1/model/addModelImageFromUrl/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `ModelCode`, `Image1Url`, `Image2Url`.
```json
[
  {
    "ModelCode": "T11",
    "Image1Url": "",
    "Image2Url": ""
  }
]
```

## `model/addModelImageFromFile`

`POST https://magaza.example/rest1/model/addModelImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ModelCode` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | hayır | WebServis arayüz konsolu dışında gönderimlerde image_1 ve image_2 parametreleri kullanılabilir. |

## `model/addImageFromUrl`

`POST https://magaza.example/rest1/model/addImageFromUrl/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `ModelCode`, `ImageUrl`, `ListNo`, `Attributes`.
```json
[
  {
    "ModelCode": "T11",
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

## `model/addImageFromFile`

`POST https://magaza.example/rest1/model/addImageFromFile/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | hayır |  |
| `image` | file | file | evet |  |

Örnek `data` alanları: `ModelCode`, `ListNo`, `Attributes`.
```json
[
  {
    "ModelCode": "T11",
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

## `model/deleteModel`

`POST https://magaza.example/rest1/model/deleteModel/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ModelId`.
```json
[
  {
    "ModelId": ""
  }
]
```
