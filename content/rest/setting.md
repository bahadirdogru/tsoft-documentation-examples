---
title: Setting
description: Kod güncelleme ve önbellek silme.
---

# Setting

REST1 modülü · 12 metot · taban `https://magaza.example/rest1/setting/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Kod güncelleme ve önbellek silme.

## `setting/getExchangeRates`

`POST https://magaza.example/rest1/setting/getExchangeRates/`

Sistemde kayıtlı kur bilgisini döner. Currency gönderildiği takdirde ilgili para birimi için, Date gönderildiği takdirde o gün için kur bilgisini döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Currency` | url_param | str | hayır |  |
| `Date` | query | str | hayır | Örnek: "2016-12-14T", "2017-01-28T13:00:00Z", 1485594000 |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

## `setting/setExchangeRates`

`POST https://magaza.example/rest1/setting/setExchangeRates/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `CurrencyCode`, `Rate`.
```json
[
  {
    "CurrencyCode": "USD",
    "Rate": 5.85
  }
]
```

## `setting/getSettingByKey`

`POST https://magaza.example/rest1/setting/getSettingByKey/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Key` | url_param | str | evet |  |

## `setting/getMobileSettings`

`POST https://magaza.example/rest1/setting/getMobileSettings/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Key` | url_param | str | evet |  |

## `setting/getSettingByCategory`

`POST https://magaza.example/rest1/setting/getSettingByCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryId` | url_param | str | evet |  |

## `setting/getSettingCategories`

`POST https://magaza.example/rest1/setting/getSettingCategories/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `setting/setSetting`

`POST https://magaza.example/rest1/setting/setSetting/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Key`, `Value`.
```json
[
  {
    "Key": "AyarAnahtarı",
    "Value": "Değer"
  },
  {
    "Key": "AyarAnahtarı2",
    "Value": "Değer2"
  }
]
```

## `setting/getSocialAccounts`

`POST https://magaza.example/rest1/setting/getSocialAccounts/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `setting/getAddressFields`

`POST https://magaza.example/rest1/setting/getAddressFields/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `setting/deleteCache`

`POST https://magaza.example/rest1/setting/deleteCache/`

Web servis işlemleri sonunda ön tanımlı olarak önbellek temizlenmemektedir. Önbelleği temizlemek için bu metodu kullanınız.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | str | hayır | Bu parametre gönderilmezse tüm önbellek temizlenir. Yalnızca ürünler önbelleğini temizlemek 'product' gönderin. Link önbelleğini temizlemek için 'url' olarak gönderin. |
| `ProductIds` | query | str | hayır | Sadece belirli ürün idlerine sahip ürünlerin önbelleğini temizlemek için kullanılır. Ürün idlerini aralarında webservis ayraç ayarına girdiğiniz (default: \|) ayracı kullanarak gönderiniz. |
| `ProductCodes` | query | str | hayır | Sadece belirli ürün kodlarına sahip ürünlerin önbelleğini temizlemek için kullanılır. Ürün kodlarını aralarında webservis ayraç ayarına girdiğiniz (default: \|) ayracı kullanarak gönderiniz. |
| `Url` | query | str | hayır | Bu parametre type 'url' olarak girilirse kullanılır. |

```json
"548|549|669"
```

```json
"T548|T549|TA9"
```

## `setting/getLanguages`

`POST https://magaza.example/rest1/setting/getLanguages/`

Servisten dönen parametreleri post olarak göndererek filte olarak kullanabilirsiniz.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `language` | query | str | hayır | Dil kodu |

## `setting/updateCode`

`POST https://magaza.example/rest1/setting/updateCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Product, Subproduct, Customer, Category, CustomerGroup, FilterGroup, FilterOption, Campaingn, SubProductGroup, CustomerAddress, BranchOffice kodları desteklenmektedir. |

Örnek `data` alanları: `Type`, `OldCode`, `NewCode`.
```json
[
  {
    "Type": "Product",
    "OldCode": "T88",
    "NewCode": "AY37K"
  }
]
```
