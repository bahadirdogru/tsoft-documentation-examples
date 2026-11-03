---
title: Auth
url: https://tsoft.bahadirdogru.com/rest/auth/
---

# Auth

REST1 modülü · 3 metot · taban `https://magaza.example/rest1/auth/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Web servis kullanıcısının token alması. Vitrin üyesi girişi değildir.

## `auth/isLogin`

`POST https://magaza.example/rest1/auth/isLogin/`

Kullanıcının servise erişim yetkisinin olup olmadığını kontrol eder.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `language` | query | str | evet | Kullanıcı dilini değiştirmek için bir değer gönderebilirsiniz. Örn; en, tr |
| `currency` | query | str | evet | Giriş yapmış üyenin para birimini değiştirmek için bir değer gönderebilirsiniz. Örn; TL, USD |

## `auth/login`

`POST https://magaza.example/rest1/auth/login/`

Kullanıcının kimliğini doğrular. Kullanıcıya servisi kullanım yetkisini veren tokeni ve diğer kullanıcı verilerini döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `user` | url_param | str | evet | Kullanıcı adı |
| `pass` | query | pass | evet | Kullanıcı şifresi |
| `getAll` | query | bool | hayır | Kullnıcının bütün verisini çek. |
| `setting` | query | str | hayır |  |
| `mobileSetting` | query | bool | hayır |  |
| `mobileContact` | query | bool | hayır |  |

Postman `login` isteği `pass` alanını form-data olarak `POST /rest1/auth/login/{{user_name}}` yoluna gönderir.

20 Ekim 2026 çağrısında `application/x-www-form-urlencoded` gövde geçti. Yanıt şekli ve `expirationTime` biçimi [canlı çağrı](README.md#20-ekim-2026-canlı-çağrı) bölümündedir.

## `auth/logout`

`POST https://magaza.example/rest1/auth/logout/`

Kullanıcının servise erişim yetkisini sonlandırır.

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.
