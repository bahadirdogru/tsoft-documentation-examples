---
title: Adapter
description: Sendheap ve Nildesk aktarımı.
---

# Adapter

REST1 modülü · 2 metot · taban `https://magaza.example/rest1/adapter/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Sendheap ve Nildesk aktarımı.

## `adapter/sendheap`

`POST https://magaza.example/rest1/adapter/sendheap/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SendheapApiUsername` | query | text | evet | Sendheap panelinde Ayarlar > API kısmından oluşturulup kullanılmalıdır. |
| `SendheapApiPassword` | query | text | evet | Sendheap panelinde Ayarlar > API kısmından oluşturulup kullanılmalıdır. |
| `data` | query | text | evet | Type : Gönderilecek ileti tipi. Alabileceği değerler : email, sms, web_push, mobile_push    CustomerCode parametresi ile ileti gönderilecek üye seçilir. CustomerCode yerine CustomerId veya CustomerEmail de kullanılabilir    TargetUrl parametresi bildirim gönderiminde kullanılır. Bildirime tıklandığında gitmesi istenen link girilir.    ImageUrl parametresi bildirim gönderiminde kullanılır. Bildirime resim eklenmek isteniyorsa resim linki gönderilir.    IconUrl parametresi bildirim gönderiminde kullanılır. Bildirim iconu değiştirilmek istenirse icon linki gönderilir. |

Örnek `data` alanları: `Type`, `Title`, `Content`, `CustomerCode`, `TargetUrl`, `IconUrl`, `ImageUrl`.
```json
[
  {
    "Type": "mobile_push",
    "Title": "Başlık",
    "Content": "İçerik",
    "CustomerCode": "T025",
    "TargetUrl": 1,
    "IconUrl": 0,
    "ImageUrl": 0
  }
]
```

## `adapter/nildesk`

`POST https://magaza.example/rest1/adapter/nildesk/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Body, Headers bilgileri istek atılacak nildesk servisine uygun şekilde ayarlanmalıdır. |

Örnek `data` alanları: `Platform`, `Url`, `Body`, `Headers`.
```json
[
  {
    "Platform": "Tsoft",
    "Url": "",
    "Body": {
      "domain": "test.test.com"
    },
    "Headers": "0"
  }
]
```
