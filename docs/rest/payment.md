---
title: Payment
url: https://tsoft.bahadirdogru.com/rest/payment/
---

# Payment

REST1 modülü · 7 metot · taban `https://magaza.example/rest1/payment/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Taksit, havale, BIN ve POS parametreleri.

## `payment/getInstallmentList` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/payment/getInstallmentList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Bin => değer girilirse sadece o karta ait taksitler gelir   ModuleType => 0:order, 1:cari, Şuan sadece cari   IsBusiness => bin girildiğinde ihtiyaç yok |

```json
{
  "Price": "10.00",
  "Bin": "",
  "ModuleType": "1",
  "IsBusiness": "0"
}
```

## `payment/setWireTransfers`

`POST https://magaza.example/rest1/payment/setWireTransfers/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Güncelleme yapmak için dataya "Id" eklenmelidir. Örneğin: "Id":1 |

Örnek `data` alanları: `Name`, `Status`, `AccountHolder`, `Branch`, `AccountSetupType`, `AccountNumber`, `IBAN`, `Swift`, `PredefinedAccount`, `SortNumber`.
```json
[
  {
    "Name": "Banka Test",
    "Status": "1",
    "AccountHolder": "Rumeysa Aydöner",
    "Branch": "KSÜ Şubesi",
    "AccountSetupType": "TL",
    "AccountNumber": "4324321",
    "IBAN": "TR90 1111 1111 1111 1111 1111 11",
    "Swift": "",
    "PredefinedAccount": "0",
    "SortNumber": ""
  }
]
```

## `payment/getWireTransfers`

`POST https://magaza.example/rest1/payment/getWireTransfers/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `payment/getCreditCardBin`

`POST https://magaza.example/rest1/payment/getCreditCardBin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `` |  |  | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

## `payment/setCreditCardBin`

`POST https://magaza.example/rest1/payment/setCreditCardBin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Güncelleme yapmak için dataya "Id" eklenmelidir. Örneğin: "Id":1   Güncelleme işleminde sadece "IsBussiness" ve "Passive" alanlarının güncellenmesine izin verilir.   Issues keyinin alabileceği değerler: VISA, TROY, MASTERCARD, AMERICANEXPRESS    CardType keyinin alabileceği değerler: CREDIT_CARD, DEBIT_CARD    IsBussiness keyinin alabileceği değerler: 0, 1    Passive keyinin alabileceği değerler: 0, 1 |

Örnek `data` alanları: `Bin`, `Brand`, `Issuer`, `CardType`, `IsBusiness`, `Passive`.
```json
[
  {
    "Bin": "123456",
    "Brand": "Banka Test",
    "Issuer": "VISA",
    "CardType": "CREDIT_CARD",
    "IsBusiness": 0,
    "Passive": 0
  }
]
```

## `payment/deleteCreditCardBin`

`POST https://magaza.example/rest1/payment/deleteCreditCardBin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | "Id" değerini payment/getCreditCardBin servisinden alabilirsiniz. |

Örnek `data` alanları: `Id`.
```json
[
  {
    "Id": 1
  }
]
```

## `payment/setPosParams`

`POST https://magaza.example/rest1/payment/setPosParams/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | str | evet | örn: Isyerimpos |
| `PosId` | post | int | evet | örn: 1 |
| `3DSecure` | post | int | hayır | örn: 0-1 |
| `3DSecureLimit` | post | int | hayır |  |
| `Provision` | post | int | hayır | 0: Provizyon, 1: Ön Provizyon |
| `LiveOrTest` | post | int | hayır | 0: Test, 1: Canlı |
| `data` | query | text | hayır | Isyerimpos için merchantId, userId,apiKey Anahtarında güncelleme yapabilirsiniz. |

Örnek `data` alanları: `Key`, `Value`.
```json
[
  {
    "Key": "merchantId",
    "Value": "123456"
  }
]
```
