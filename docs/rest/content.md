---
title: Content
url: https://tsoft.bahadirdogru.com/rest/content/
---

# Content

REST1 modülü · 1 metot · taban `https://magaza.example/rest1/content/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

İçerik kaydı okuma.

## `content/getContent`

`POST https://magaza.example/rest1/content/getContent/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `id` | url_param | int | evet | id gönderilmez ise tüm içerikler gelir |
| `start` | post | int | hayır |  |
| `limit` | post | int | hayır |  |
