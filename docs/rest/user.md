---
title: User
url: https://tsoft.bahadirdogru.com/rest/user/
---

# User

REST1 modülü · 7 metot · taban `https://magaza.example/rest1/user/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Yönetim paneli ve web servis kullanıcıları. Panele yönetici olarak giriş linki.

## `user/getPanelAdmins`

`POST https://magaza.example/rest1/user/getPanelAdmins/`

Yönetim paneli kullanıcılarını (admin) listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

## `user/getUsers`

`POST https://magaza.example/rest1/user/getUsers/`

Web servis kullanıcılarını listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

## `user/getPanelAdminByPassword`

`POST https://magaza.example/rest1/user/getPanelAdminByPassword/`

Kullanıcı adı ve şifresi girilen yönetim paneli kullanıcısının (admin) ID ve WS Kodunu döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `user` | query | str | evet |  |
| `pass` | query | pass | evet |  |

## `user/loginAsPanelAdmin`

`POST https://magaza.example/rest1/user/loginAsPanelAdmin/`

Admin ID veya Code alanlarından birinin doldurulması zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AdminId` | query | int | hayır |  |
| `AdminCode` | query | str | hayır |  |
| `RedirectUrl` | query | str | hayır | Yönlendirilmek istenilen link, "mod/product/Products/index" şeklinde olmalıdır |
| `TopFrameUrl` | query | str | hayır | Yönlendirilmek istenilen sayfanın menüsü yerine farklı bir menü yerleştirmek isterseniz, linki "tsoft/yeni/menu" şeklinde gönderin. |

## `user/setAdminDevice`

`POST https://magaza.example/rest1/user/setAdminDevice/`

Tsoft Mobile Panel bildirimleri için cihazlar kaydedilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `device_id` | query | str | evet |  |
| `device_name` | query | str | hayır |  |
| `registration_id` | query | str | evet |  |
| `admin_id` | query | str | hayır |  |
| `platform` | query | str | hayır |  |
| `language` | query | str | hayır |  |
| `notification_settings` | query | text | hayır |  |

```json
{
  "orderNotification": 1,
  "memberNotification": 0,
  "commentNotification": 0,
  "versionNotification": 0,
  "ticketNotification": 0
}
```

## `user/getAdminDevices`

`POST https://magaza.example/rest1/user/getAdminDevices/`

Tsoft Mobile Panel bildirimleri için cihazlar getirilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `device_id` | query | str | hayır |  |

## `user/deleteAdminDevice`

`POST https://magaza.example/rest1/user/deleteAdminDevice/`

Tsoft Mobile Panel bildirimleri için cihaz silme.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `device_id` | query | str | evet |  |
