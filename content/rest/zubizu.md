---
title: Zubizu
description: Zubizu kampanya oturumu.
---

# Zubizu

REST1 modülü · 6 metot · taban `https://magaza.example/rest1/zubizu/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Zubizu kampanya oturumu.

## `zubizu/signin`

`POST https://magaza.example/rest1/zubizu/signin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ZubizuToken` | query | text | evet |  |

## `zubizu/signout`

`POST https://magaza.example/rest1/zubizu/signout/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `zubizu/summary`

`POST https://magaza.example/rest1/zubizu/summary/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `zubizu/getCampaigns`

`POST https://magaza.example/rest1/zubizu/getCampaigns/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `zubizu/setCampaign`

`POST https://magaza.example/rest1/zubizu/setCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Group` | query | text | evet |  |
| `CampaignId` | query | text | evet |  |

## `zubizu/unsetCampaign`

`POST https://magaza.example/rest1/zubizu/unsetCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignId` | query | text | evet |  |
