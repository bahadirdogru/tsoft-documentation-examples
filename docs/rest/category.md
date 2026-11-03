---
title: Category
url: https://tsoft.bahadirdogru.com/rest/category/
---

# Category

REST1 modülü · 8 metot · taban `https://magaza.example/rest1/category/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Kategori ağacı, listeleme ve yazma.

## `category/getCategories`

`POST https://magaza.example/rest1/category/getCategories/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |
| `language` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |
| `FetchAdditionalCategoryData` | query | bool | hayır |  |

## `category/getCategoryByCode`

`POST https://magaza.example/rest1/category/getCategoryByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryCode` | url_param | str | evet |  |
| `language` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

## `category/getCategoryById`

`POST https://magaza.example/rest1/category/getCategoryById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryId` | url_param | int | evet |  |
| `language` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

## `category/getCategoryByName`

`POST https://magaza.example/rest1/category/getCategoryByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryName` | url_param | str | evet |  |
| `language` | query | str | hayır |  |
| `FetchExactMatch` | query | bool | hayır | Bu değer true gönderilirse tam eşleşme sağlanan kategoriler dönecektir, aksi halde içinde gönderilen kategori ismi geçen tüm kategoriler dönmektedir. |

## `category/getCategoryTree`

`POST https://magaza.example/rest1/category/getCategoryTree/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | query | int | hayır |  |
| `node` | query | str | hayır |  |

## `category/setCategories`

`POST https://magaza.example/rest1/category/setCategories/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Showcase: Kategori vitrini dile göre ayarlanabilir. Değişiklik yapılmak istenmiyorsa gönderilmemelidir. |

Örnek `data` alanları: `CategoryCode`, `CategoryName`, `IsActive`, `ParentCode`, `ListNo`, `SeoLink`, `SeoTitle`, `SeoDescription`, `SeoSettingsId`, `FilteringPanel`, `IsProductListPassive`, `ShowInMenu`, `ShowInMobile`, `ShortDesciption`, `ShowCategory`, `ShowProduct`, `GoogleProductsPath`, `Showcase`.
```json
[
  {
    "CategoryCode": "T15-3",
    "CategoryName": "AltKategoriTest",
    "IsActive": "",
    "ParentCode": "T246",
    "ListNo": "99",
    "SeoLink": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "SeoSettingsId": "",
    "FilteringPanel": "",
    "IsProductListPassive": "",
    "ShowInMenu": "",
    "ShowInMobile": "",
    "ShortDesciption": "",
    "ShowCategory": "",
    "ShowProduct": "",
    "GoogleProductsPath": "",
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

## `category/tree`

`POST https://magaza.example/rest1/category/tree/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `parent_id` | url_param | int | hayır |  |
| `depth` | post | int | hayır | Kategoride max. derinlik belirtmek için kullanılabilir. |
| `group_key` | post | str | hayır |  |
| `mobile_platform` | query | bool | hayır |  |
| `support_v5` | query | bool | hayır |  |
| `fetch_showcase` | query | bool | hayır |  |

## `category/setCategoryLanguage`

`POST https://magaza.example/rest1/category/setCategoryLanguage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Languages: tr, en, ar, az, bs, de, fr, ru |

Örnek `data` alanları: `CategoryCode`, `Language`, `CategoryName`, `SeoLink`, `SeoTitle`, `SeoDescription`.
```json
[
  {
    "CategoryCode": "T15-3",
    "Language": "en",
    "CategoryName": "Test Category",
    "SeoLink": "test-category",
    "SeoTitle": "",
    "SeoDescription": ""
  }
]
```
