---
title: Widget
url: https://tsoft.bahadirdogru.com/rest/widget/
---

# Widget

REST1 modülü · 2 metot · taban `https://magaza.example/rest1/widget/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Widget yazma ve silme.

## `widget/set`

`POST https://magaza.example/rest1/widget/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

```json
{
  "prefix": "app.test",
  "icon": "",
  "size": "1x1",
  "text": "Test",
  "url": "https://test.com",
  "bgimage": "https://test.com/img/logo.svg",
  "category": "",
  "order": "",
  "class": ""
}
```

## `widget/delete`

`POST https://magaza.example/rest1/widget/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `prefix` | url_param | text | hayır |  |
