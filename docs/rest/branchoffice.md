---
title: BranchOffice
url: https://tsoft.bahadirdogru.com/rest/branchoffice/
---

# BranchOffice

REST1 modülü · 5 metot · taban `https://magaza.example/rest1/branchOffice/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Mağaza / şube kayıtlarını okuma ve yazma.

## `branchOffice/getBranchOfficeByCode`

`POST https://magaza.example/rest1/branchOffice/getBranchOfficeByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `BranchOfficeCode` | url_param | str | evet |  |

## `branchOffice/getBranchOfficeById`

`POST https://magaza.example/rest1/branchOffice/getBranchOfficeById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `BranchOfficeId` | url_param | int | evet |  |

## `branchOffice/getBranchOfficeByName`

`POST https://magaza.example/rest1/branchOffice/getBranchOfficeByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `BranchOfficeName` | url_param | str | evet |  |

## `branchOffice/getBranchOffices`

`POST https://magaza.example/rest1/branchOffice/getBranchOffices/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `IsActive` | query | bool | hayır | Sadece aktif mağazaların getirilmesi için bu alanı şeçili olarak göndermeniz gerekli |
| `f` | query | text | hayır |  |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `orderby` | query | str | hayır | Örn: BranchOfficeId DESC |

## `branchOffice/setBranchOffices`

`POST https://magaza.example/rest1/branchOffice/setBranchOffices/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `BranchOfficeCode`, `BranchOfficeName`, `BranchOfficeGroupCode`, `IsActive`, `Address`, `Country`, `City`, `District`, `Neighbourhood`, `Tel1`, `Fax`, `Email`, `ListNo`, `Latitude`, `Longitude`, `IframeEmbed`, `Additional1`, `Additional2`, `Additional3`.
```json
[
  {
    "BranchOfficeCode": "T2",
    "BranchOfficeName": "Harbiye",
    "BranchOfficeGroupCode": "T1",
    "IsActive": "1",
    "Address": "",
    "Country": "",
    "City": "",
    "District": "Şişli",
    "Neighbourhood": "Harbiye",
    "Tel1": "",
    "Fax": "",
    "Email": "",
    "ListNo": "",
    "Latitude": "",
    "Longitude": "",
    "IframeEmbed": "",
    "Additional1": "",
    "Additional2": "",
    "Additional3": ""
  }
]
```
