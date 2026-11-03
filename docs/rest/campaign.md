---
title: Campaign
url: https://tsoft.bahadirdogru.com/rest/campaign/
---

# Campaign

REST1 modülü · 22 metot · taban `https://magaza.example/rest1/campaign/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Kampanya, koşul, promosyon ve hediye kodu. Konsolda hepsi alpha.

## `campaign/deleteCampaign` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

## `campaign/deleteCampaignConditionExclude` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignConditionExclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

## `campaign/deleteCampaignConditionInclude` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignConditionInclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

## `campaign/deleteCampaignPromotion` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignPromotion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

## `campaign/getCampaignConditionByCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignConditionByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

## `campaign/getCampaignConditionsByCampaignCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignConditionsByCampaignCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

## `campaign/getCampaignDetailByCampaignCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignDetailByCampaignCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

## `campaign/getCampaignPromotionByCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignPromotionByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

## `campaign/getCampaignPromotionsByCampaignCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignPromotionsByCampaignCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

## `campaign/getCampaigns` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaigns/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `` | query | str | hayır |  |
| `FetchExcludeConditions` | query | bool | hayır |  |

## `campaign/setCampaignDetail` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignDetail/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CountryCodes birden çok ülke kodu gönderileceği zaman aralarına ',' koymak yeterlidir.Örn: TR,USA   Boş gönderilirse Tüm Ülkeleri kapsar. |

Örnek `data` alanları: `Code`, `Name`, `CartDescription`, `Description`, `StartDate`, `FinishDate`, `Weekdays`, `MaxCount`, `VatIncluded`, `CustomerFilterType`, `CustomerFilterIds`, `CountryCodes`, `LogicalGroup`, `Priority`, `Status`, `MobileAppStatus`, `AutoStart`.
```json
[
  {
    "Code": "T5",
    "Name": "test kampanya",
    "CartDescription": "",
    "Description": "",
    "StartDate": "1514926800",
    "FinishDate": "1516309200",
    "Weekdays": "",
    "MaxCount": "",
    "VatIncluded": "",
    "CustomerFilterType": "",
    "CustomerFilterIds": "",
    "CountryCodes": "",
    "LogicalGroup": "",
    "Priority": "",
    "Status": "",
    "MobileAppStatus": "",
    "AutoStart": 0
  }
]
```

## `campaign/getCampaignGiftCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignGiftCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | query | str | hayır |  |
| `CampaignId` | query | int | hayır |  |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `f` | query | str | hayır | Kullanılabilen operatörler: startwith,endwith,equal,greater,smaller,between,contain. Örn: "FinishTime\|1529931531\|smaller" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchCampaignDetail` | query | bool | hayır |  |

## `campaign/setCampaignGiftCode` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignGiftCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; product, category, brand, c2c, model   CustomerId yerine CustomerCode kullanılarak üye kodu gönderilebilir. |

Örnek `data` alanları: `CampaignCode`, `Coupon`, `CustomerId`, `FinishTime`, `Variable1`, `Status`.
```json
[
  {
    "CampaignCode": "T5",
    "Coupon": "TEST",
    "CustomerId": 275,
    "FinishTime": 1598605351,
    "Variable1": 1,
    "Status": 1
  }
]
```

## `campaign/deleteCampaignGiftCode` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignGiftCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `CampaignCode`, `Coupon`.
```json
[
  {
    "CampaignCode": "T5",
    "Coupon": "TEST"
  }
]
```

## `campaign/setCampaignConditionExclude` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignConditionExclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; product, category, brand, c2c, model |

Örnek `data` alanları: `CampaignCode`, `Code`, `Type`, `TableId`.
```json
[
  {
    "CampaignCode": "T5",
    "Code": "TEST",
    "Type": "cart",
    "TableId": ""
  }
]
```

## `campaign/setCampaignConditionInclude` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignConditionInclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; cart, product, category, brand, c2c, model |

Örnek `data` alanları: `CampaignCode`, `Code`, `Type`, `TableId`, `MinCount`, `MinTotal`, `MaxTotal`, `AllowSameItem`, `LogicalGroup`.
```json
[
  {
    "CampaignCode": "T5",
    "Code": "TEST",
    "Type": "cart",
    "TableId": "",
    "MinCount": "",
    "MinTotal": "100",
    "MaxTotal": "",
    "AllowSameItem": "",
    "LogicalGroup": ""
  }
]
```

## `campaign/setCampaignPromotion` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignPromotion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; cart, product, category, brand, c2c, model |

Örnek `data` alanları: `CampaignCode`, `Code`, `Type`, `TableId`, `Count`, `DiscountType`, `DiscountValue`, `OrderBy`, `CartIndex`, `LogicalGroup`, `Priority`, `AutoAdd`.
```json
[
  {
    "CampaignCode": "T5",
    "Code": "TEST",
    "Type": "product",
    "TableId": "705",
    "Count": "3",
    "DiscountType": "",
    "DiscountValue": "",
    "OrderBy": "",
    "CartIndex": "",
    "LogicalGroup": "",
    "Priority": "",
    "AutoAdd": 0
  }
]
```

## `campaign/updateCampaignExcludeField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignExcludeField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

## `campaign/updateCampaignField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

## `campaign/updateCampaignIncludeField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignIncludeField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

## `campaign/updateCampaignPromotionField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignPromotionField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

## `campaign/updateCampaignStatus` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |
| `status` | query | str | evet |  |
