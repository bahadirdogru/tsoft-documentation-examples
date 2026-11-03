---
title: Segment
url: https://tsoft.bahadirdogru.com/rest/segment/
---

# Segment

REST1 modülü · 7 metot · taban `https://magaza.example/rest1/segment/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Üye segmenti oluşturma ve üyeye atama.

## `segment/get`

`POST https://magaza.example/rest1/segment/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `` | query |  | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

## `segment/show`

`POST https://magaza.example/rest1/segment/show/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | evet |  |

## `segment/add`

`POST https://magaza.example/rest1/segment/add/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Name` | query | str | evet |  |

## `segment/set`

`POST https://magaza.example/rest1/segment/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | evet |  |
| `Name` | query | str | evet |  |

## `segment/delete`

`POST https://magaza.example/rest1/segment/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | evet |  |

## `segment/assign`

`POST https://magaza.example/rest1/segment/assign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | query | int | evet |  |
| `SegmentIds` | query | str | evet |  |

## `segment/revoke`

`POST https://magaza.example/rest1/segment/revoke/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | query | int | evet |  |
| `SegmentIds` | query | str | evet |  |
