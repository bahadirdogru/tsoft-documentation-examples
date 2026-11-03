---
title: Showcase
url: https://tsoft.bahadirdogru.com/rest/showcase/
---

# Showcase

REST1 modülü · 3 metot · taban `https://magaza.example/rest1/showcase/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Vitrin yerleşimi.

## `showcase/getCategory`

`POST https://magaza.example/rest1/showcase/getCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `version` | url_param | text | hayır | v4 veya v5 olarak girilebilir. Siteniz v4 ise v4 girmelisiniz. Boş bırakılırsa doğrudan v5 olarak işlem yapacaktır. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `showcase/get`

`POST https://magaza.example/rest1/showcase/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `version` | url_param | text | hayır | v4 veya v5 olarak girilebilir. Siteniz v4 ise v4 girmelisiniz. Boş bırakılırsa doğrudan v5 olarak işlem yapacaktır. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CategoryId \| 12 \| equal" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `showcase/set`

`POST https://magaza.example/rest1/showcase/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `version` | url_param | text | hayır | v4 veya v5 olarak girilebilir. Siteniz v4 ise v4 girmelisiniz. Boş bırakılırsa doğrudan v5 olarak işlem yapacaktır. |
| `data` | query | text | evet | Id parametresi varsa güncelleme yapar, yoksa ekleme yapar.    v4 siteler ParentCategoryId parametresi ekstra olarak kullanılabilir.    Deleted:1 gönderilirse ilgili koşulu sağlayan vitrin ürünleri silinir. |

Örnek `data` alanları: `Id`, `ProductId`, `CategoryId`, `ListNo`, `Deleted`.
```json
[
  {
    "Id": 62,
    "ProductId": 456,
    "CategoryId": 176,
    "ListNo": 1,
    "Deleted": 0
  }
]
```
