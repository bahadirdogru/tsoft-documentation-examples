---
title: TrackingCode
url: https://tsoft.bahadirdogru.com/rest/trackingcode/
---

# TrackingCode

REST1 modülü · 3 metot · taban `https://magaza.example/rest1/trackingCode/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

İzleme kodları.

## `trackingCode/get`

`POST https://magaza.example/rest1/trackingCode/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | hayır |  |
| `GeneratedBy` | query | text | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır |  |

## `trackingCode/set`

`POST https://magaza.example/rest1/trackingCode/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type için aşağıdakilerden uygun olan id'yi giriniz:   1:HTML </head> Öncesine Kod Ekle,  2:HTML <body> sonrası izleme kodları (Örn: Google Universal Analytics İzleme Kodu),   3:HTML </body> öncesi izleme kodları (Örn: Yandex Metrica İzleme Kodu),   4:Üye Onay Sayfasına Kod Ekle ,   5:Üye Onay Sayfası </head> Öncesine Kod Ekle   6:Blok Kodları |

Örnek `data` alanları: `Id`, `Description`, `Code`, `Type`, `BlockId`, `Status`, `ListNo`, `GeneratedBy`.
```json
[
  {
    "Id": "",
    "Description": "",
    "Code": "",
    "Type": "",
    "BlockId": "",
    "Status": "",
    "ListNo": "",
    "GeneratedBy": ""
  }
]
```

## `trackingCode/delete`

`POST https://magaza.example/rest1/trackingCode/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | hayır |  |
| `GeneratedBy` | query | text | hayır |  |
