---
title: HtmlBlock
description: HTML blok. Konsolda üçü de support-only.
---

# HtmlBlock

REST1 modülü · 3 metot · taban `https://magaza.example/rest1/htmlBlock/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

HTML blok. Konsolda üçü de support-only.

## `htmlBlock/get` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/htmlBlock/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | hayır |  |
| `Version` | query | string | hayır | V5 gönderildiğinde V5'e, gönderilmediğinde V4'e uygun olarak çalışır. |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

## `htmlBlock/set` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/htmlBlock/set/`

V5 durumunda data içerisinde Type ve PostUniqueId set edilmelidir. Type 'click' veya 'show' gönderilmelidir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Version` | query | string | hayır | V5 gönderildiğinde V5'e, gönderilmediğinde V4'e uygun olarak çalışır. |
| `data` | query | text | hayır |  |

```json
{
  "Id": "",
  "Content": "",
  "Location": "",
  "Theme": "",
  "Visitor": "",
  "Member": "",
  "Vendor": "",
  "ShowMobileInterface": "",
  "RemoveOldBlockLocations": "",
  "BlockLocations": {
    "BlockId": "",
    "PageId": "",
    "SubPageId": "",
    "ListNo": "",
    "Location": ""
  }
}
```

## `htmlBlock/delete` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/htmlBlock/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | url_param | int | evet |  |
| `Version` | query | string | hayır | V5 gönderildiğinde V5'e, gönderilmediğinde V4'e uygun olarak çalışır. |
| `GeneratedBy` | query | string | hayır | V5 olduğu durumda GeneratedBy gerekli değildir. V5 durumu olmadığı durumlar için ise gönderilmelidir. |
