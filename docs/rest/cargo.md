---
title: Cargo
url: https://tsoft.bahadirdogru.com/rest/cargo/
---

# Cargo

REST1 modülü · 1 metot · taban `https://magaza.example/rest1/cargo/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Kargo gönderi logu.

## `cargo/setShipmentLog`

`POST https://magaza.example/rest1/cargo/setShipmentLog/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CustomerId zorunludur. Point alanı pozitif ise ekleme, negatif ise düşürme/sıfırlama yapılır. |

Örnek `data` alanları: `CargoKey`, `MessageCode`, `MessageText`, `CargoTrackingNo`, `CargoTrackingUrl`, `RealTotalDesi`, `Desi`, `RealCargoAmount`, `ShipperBranchOffice`, `CargoLastMovement`, `ReceiverBranchOffice`, `EngagedInProcessingBranchOffice`, `CargoStatusDate`.
```json
[
  {
    "CargoKey": "T147",
    "MessageCode": "T123",
    "MessageText": "",
    "CargoTrackingNo": "",
    "CargoTrackingUrl": "",
    "RealTotalDesi": "",
    "Desi": "",
    "RealCargoAmount": "",
    "ShipperBranchOffice": "",
    "CargoLastMovement": "",
    "ReceiverBranchOffice": "",
    "EngagedInProcessingBranchOffice": "",
    "CargoStatusDate": ""
  }
]
```
