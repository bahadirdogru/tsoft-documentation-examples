---
title: Notification
url: https://tsoft.bahadirdogru.com/rest/notification/
---

# Notification

REST1 modülü · 5 metot · taban `https://magaza.example/rest1/notification/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Push cihaz kaydı ve bildirim.

## `notification/getNotifications`

`POST https://magaza.example/rest1/notification/getNotifications/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `RegistrationId` | query | string | hayır |  |
| `DeviceId` | query | string | hayır |  |
| `Email` | query | string | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

## `notification/setNotifications`

`POST https://magaza.example/rest1/notification/setNotifications/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Type 'click' veya 'show' gönderilmelidir. |

```json
{
  "Type": "click",
  "PostUniqueId": "3886-61f2b3e7a4f54-fd_mongo"
}
```

## `notification/registerDevice`

`POST https://magaza.example/rest1/notification/registerDevice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `p256dh`, `registrationId`, `deviceId`, `deviceAuth`, `devicePlatform`, `deviceLanguage`, `appVersion`, `email`.
```json
[
  {
    "p256dh": "7897f89789",
    "registrationId": "eGjnjm_QTWlhQvddfvfY8:AA91bE8z5T-9uYBSGXu82znsROofdUnWSereLrnYkvhnmGx1NOZ22W-RIS2b74ladGE48FgLRHkjlZtj8norPSafsdikywlG93D0gOrOlhA-UNfk6w-oxrWPFaZrzMo5nVDOlzh4WkhkhWizq",
    "deviceId": "43om56kty6k543",
    "deviceAuth": "",
    "devicePlatform": "android",
    "deviceLanguage": "tr",
    "appVersion": "5.4.1",
    "email": "ornek@magaza.example"
  }
]
```

## `notification/deleteDevice`

`POST https://magaza.example/rest1/notification/deleteDevice/`

Email gönderilirse o maile bağlı tüm cihazlar silinir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | string | hayır |  |
| `RegistrationId` | query | string | hayır |  |
| `Email` | query | string | hayır |  |

## `notification/unConnectCustomer`

`POST https://magaza.example/rest1/notification/unConnectCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Email` | url_param | string | evet |  |
