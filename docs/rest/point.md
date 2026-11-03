---
title: Point
url: https://tsoft.bahadirdogru.com/rest/point/
---

# Point

REST1 modülü · 2 metot · taban `https://magaza.example/rest1/point/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Üye puanı ekleme veya düşürme.

## `point/get`

`POST https://magaza.example/rest1/point/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `point/set`

`POST https://magaza.example/rest1/point/set/`

Müşteriye puan ekleme veya mevcut puanı düşürme/sıfırlama işlemi yapılır. Point pozitif gönderilirse müşteriye puan eklenir. Point negatif gönderilirse müşterinin mevcut kullanılabilir puanından bu değerin mutlak değeri kadar düşülür. İstenen düşüm miktarı mevcut bakiyeden fazlaysa işlem hata vermez, bakiye sıfırlanır (puan sıfırlama).

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Point`, `CustomerId`, `Description`.
```json
[
  {
    "Point": 500,
    "CustomerId": 123,
    "Description": "Puan Eklendi"
  },
  {
    "Point": -200,
    "CustomerId": 123,
    "Description": "Puan Düşürüldü"
  }
]
```
