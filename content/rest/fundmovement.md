---
title: FundMovement
description: Cari hareket okuma, yazma ve silme.
---

# FundMovement

REST1 modülü · 10 metot · taban `https://magaza.example/rest1/fundMovement/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Cari hareket okuma, yazma ve silme.

## `fundMovement/addFundMovements`

`POST https://magaza.example/rest1/fundMovement/addFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `FundMovementCode`, `CustomerCode`, `Description`, `Receivable`, `Debt`, `IsDeleted`, `PaymentType`, `CustomerBankCard`, `OrderCurrency`.
```json
[
  {
    "FundMovementCode": "",
    "CustomerCode": "",
    "Description": "",
    "Receivable": "",
    "Debt": "",
    "IsDeleted": "",
    "PaymentType": "",
    "CustomerBankCard": "",
    "OrderCurrency": ""
  }
]
```

## `fundMovement/getFundMovementByCode`

`POST https://magaza.example/rest1/fundMovement/getFundMovementByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementCode` | url_param | str | evet |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |

## `fundMovement/getFundMovementById`

`POST https://magaza.example/rest1/fundMovement/getFundMovementById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementId` | url_param | str | evet |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |

## `fundMovement/getFundMovements`

`POST https://magaza.example/rest1/fundMovement/getFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementDateTimeStart` | query | str | hayır |  |
| `FundMovementDateTimeEnd` | query | str | hayır |  |
| `FundMovementCode` | query | str | hayır |  |
| `CustomerCode` | query | str | hayır |  |
| `FetchAdditionalCustomerData` | query | bool | hayır |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

## `fundMovement/deleteFundMovements`

`POST https://magaza.example/rest1/fundMovement/deleteFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementId` | query | int | hayır |  |
| `FundMovementCode` | query | str | hayır |  |
| `CustomerId` | query | int | hayır |  |
| `CustomerCode` | query | str | hayır |  |
| `IsJSONFormatEnabledForDelete` | query | bool | hayır | JSON alan gönderilmek isteniyorsa bu parametre true gönderilmelidir. |
| `data` | query | text | hayır | IsJSONFormatEnabledForDelete parametresi true gönderilirse bu alan kullanılabilir. |
| `f` | query | text | hayır |  |

Örnek `data` alanları: `FundMovementId`, `FundMovementCode`, `CustomerId`, `CustomerCode`.
```json
[
  {
    "FundMovementId": "",
    "FundMovementCode": "",
    "CustomerId": "",
    "CustomerCode": ""
  }
]
```

## `fundMovement/markFundMovement`

`POST https://magaza.example/rest1/fundMovement/markFundMovement/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementCode` | url_param | str | evet |  |
| `val` | query | bool | evet |  |

## `fundMovement/setFundMovements`

`POST https://magaza.example/rest1/fundMovement/setFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CreateDateTimeStamp yerine CreateDate da gönderilebilir.    Örnek :  CreateDateTimeStamp : 1698924617 CreateDate : 2023-01-01 10:00:00 |

Örnek `data` alanları: `FundMovementCode`, `CustomerCode`, `Description`, `Receivable`, `Debt`, `IsDeleted`, `PaymentType`, `CustomerBankCard`, `CreateDateTimeStamp`, `OrderCurrency`.
```json
[
  {
    "FundMovementCode": "",
    "CustomerCode": "",
    "Description": "",
    "Receivable": "",
    "Debt": "",
    "IsDeleted": "",
    "PaymentType": "",
    "CustomerBankCard": "",
    "CreateDateTimeStamp": "",
    "OrderCurrency": ""
  }
]
```

## `fundMovement/updateFundMovements`

`POST https://magaza.example/rest1/fundMovement/updateFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `FundMovementCode`, `CustomerCode`, `Description`, `Receivable`, `Debt`, `IsDeleted`, `PaymentType`, `CustomerBankCard`, `OrderCurrency`.
```json
[
  {
    "FundMovementCode": "",
    "CustomerCode": "",
    "Description": "",
    "Receivable": "",
    "Debt": "",
    "IsDeleted": "",
    "PaymentType": "",
    "CustomerBankCard": "",
    "OrderCurrency": ""
  }
]
```

## `fundMovement/pay` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/fundMovement/pay/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

```json
{
  "CustomerCode": "T260",
  "Price": "10.00",
  "Description": "ödeme servisi",
  "CardHolder": "kart sahibi",
  "CardNumber": "4355084355084358",
  "Cvc": "000",
  "ExpireMonth": "03",
  "ExpireYear": "18",
  "InstallmentId": "68",
  "Secure3d": 0
}
```

## `fundMovement/getTransaction` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/fundMovement/getTransaction/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `transactionNo` | url_param | str | evet |  |
