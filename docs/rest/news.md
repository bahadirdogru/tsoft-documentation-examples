---
title: News
url: https://tsoft.bahadirdogru.com/rest/news/
---

# News

REST1 modülü · 2 metot · taban `https://magaza.example/rest1/news/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Haber kayıtları.

## `news/getNews`

`POST https://magaza.example/rest1/news/getNews/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `news/setNews`

`POST https://magaza.example/rest1/news/setNews/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Id parametresi varsa güncelleme yapar, yoksa ekleme yapar |

Örnek `data` alanları: `Id`, `ShortTitle`, `ShortDescription`, `Title`, `Description`, `BlockId`, `ReadCount`, `Status`, `ShowOnMemeberPanel`, `ShowOnVendorPanel`, `SeoLink`, `SeoTitle`, `SeoDescription`, `ListNo`.
```json
[
  {
    "Id": 62,
    "ShortTitle": "T-soft Projeleri",
    "ShortDescription": "",
    "Title": "",
    "Description": "",
    "BlockId": 1019,
    "ReadCount": 458,
    "Status": 1,
    "ShowOnMemeberPanel": 0,
    "ShowOnVendorPanel": 0,
    "SeoLink": "seo-url",
    "SeoTitle": "T-soft Projeleri",
    "SeoDescription": "T-soft Projelerin",
    "ListNo": "2"
  }
]
```
