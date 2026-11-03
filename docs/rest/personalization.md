---
title: Personalization
url: https://tsoft.bahadirdogru.com/rest/personalization/
---

# Personalization

REST1 modülü · 1 metot · taban `https://magaza.example/rest1/personalization/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Ürün kişiselleştirme formları.

## `personalization/getForm`

`POST https://magaza.example/rest1/personalization/getForm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FormId` | url_param | int | evet |  |
