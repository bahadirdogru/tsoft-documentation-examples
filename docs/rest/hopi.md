---
title: Hopi
url: https://tsoft.bahadirdogru.com/rest/hopi/
---

# Hopi

REST1 modülü · 3 metot · taban `https://magaza.example/rest1/hopi/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Hopi kampanya oturumu.

## `hopi/signin`

`POST https://magaza.example/rest1/hopi/signin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `HopiToken` | query | text | hayır |  |
| `BearerToken` | query | text | hayır | Bu parametre ile HopiToken gönderilmediği durumlarda HopiToken ın alınması sağlanır. |

## `hopi/setCampaign`

`POST https://magaza.example/rest1/hopi/setCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Coin` | query | text | hayır |  |
| `Campaign` | query | text | hayır |  |

## `hopi/removeCampaign`

`POST https://magaza.example/rest1/hopi/removeCampaign/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.
