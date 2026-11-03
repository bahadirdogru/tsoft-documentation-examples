---
title: Ticket
description: Destek talebi ve iletişim mesajı.
---

# Ticket

REST1 modülü · 9 metot · taban `https://magaza.example/rest1/ticket/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Destek talebi ve iletişim mesajı.

## `ticket/createTicket` (alpha)

`POST https://magaza.example/rest1/ticket/createTicket/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `CustomerId`, `DepartmentId`, `AdminUserId`, `ResolutionId`, `Status`, `Title`, `Text`, `Note`, `RecordLink`.
```json
[
  {
    "CustomerId": "106",
    "DepartmentId": "",
    "AdminUserId": "",
    "ResolutionId": "",
    "Status": "",
    "Title": "",
    "Text": "",
    "Note": "",
    "RecordLink": ""
  }
]
```

## `ticket/getDepartments` (alpha)

`POST https://magaza.example/rest1/ticket/getDepartments/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `ticket/getResolutions` (alpha)

`POST https://magaza.example/rest1/ticket/getResolutions/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `ticket/getTickets`

`POST https://magaza.example/rest1/ticket/getTickets/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

## `ticket/getTicketDetails`

`POST https://magaza.example/rest1/ticket/getTicketDetails/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `TicketId` | url_param | int | evet |  |
| `FetchNameData` | query | bool | hayır |  |

## `ticket/reply`

`POST https://magaza.example/rest1/ticket/reply/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `TicketId`, `Text`, `AdminUserId`.
```json
[
  {
    "TicketId": "1001",
    "Text": "Ürün açıklaması girilmiştir.",
    "AdminUserId": ""
  }
]
```

## `ticket/getContactDepartments` (alpha)

`POST https://magaza.example/rest1/ticket/getContactDepartments/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `ticket/getContactMessages` (alpha)

`POST https://magaza.example/rest1/ticket/getContactMessages/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |

## `ticket/sendNewMessage`

`POST https://magaza.example/rest1/ticket/sendNewMessage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `TicketId`, `Text`, `CustomerId`.
```json
[
  {
    "TicketId": "1001",
    "Text": "Ürün açıklaması.",
    "CustomerId": ""
  }
]
```
