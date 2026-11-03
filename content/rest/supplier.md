---
title: Supplier
description: Tedarikçi ve mağaza görselleri.
---

# Supplier

REST1 modülü · 10 metot · taban `https://magaza.example/rest1/supplier/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Tedarikçi ve mağaza görselleri.

## `supplier/deleteStoreCover`

`POST https://magaza.example/rest1/supplier/deleteStoreCover/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |

## `supplier/deleteStoreLogo`

`POST https://magaza.example/rest1/supplier/deleteStoreLogo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |

## `supplier/getESuppliers`

`POST https://magaza.example/rest1/supplier/getESuppliers/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

## `supplier/getSuppliers`

`POST https://magaza.example/rest1/supplier/getSuppliers/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `supplier/getSupplierById`

`POST https://magaza.example/rest1/supplier/getSupplierById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SupplierId` | url_param | int | evet |  |

## `supplier/updateStoreCover`

`POST https://magaza.example/rest1/supplier/updateStoreCover/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |
| `desc` | query | text | hayır | Store description |
| `image` | file | file | evet |  |

## `supplier/updateStoreLogo`

`POST https://magaza.example/rest1/supplier/updateStoreLogo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |
| `image` | file | file | evet |  |

## `supplier/updateStoreName`

`POST https://magaza.example/rest1/supplier/updateStoreName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SupplierId`, `StoreName`.
```json
[
  {
    "SupplierId": "",
    "StoreName": ""
  }
]
```

## `supplier/updateSupplier`

`POST https://magaza.example/rest1/supplier/updateSupplier/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SupplierId`, `Title`, `Email`, `UserName`, `StoreName`, `ContactPerson`, `TaxDepartment`, `TaxNumber`, `IBAN`, `Mobile`, `Tel`, `Fax`, `Website`, `Address`, `City`, `Town`, `AdditionalField1`, `AdditionalField2`, `AdditionalField3`, `AdditionalField4`, `AdditionalField5`, `AdditionalField6`, `AdditionalField7`.
```json
[
  {
    "SupplierId": "",
    "Title": "",
    "Email": "",
    "UserName": "",
    "StoreName": "",
    "ContactPerson": "",
    "TaxDepartment": "",
    "TaxNumber": "",
    "IBAN": "",
    "Mobile": "",
    "Tel": "",
    "Fax": "",
    "Website": "",
    "Address": "",
    "City": "",
    "Town": "",
    "AdditionalField1": "",
    "AdditionalField2": "",
    "AdditionalField3": "",
    "AdditionalField4": "",
    "AdditionalField5": "",
    "AdditionalField6": "",
    "AdditionalField7": ""
  }
]
```

## `supplier/setSupplier`

`POST https://magaza.example/rest1/supplier/setSupplier/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Title`, `Email`, `UserName`, `StoreName`, `ContactPerson`, `TaxDepartment`, `TaxNumber`, `IBAN`, `Mobile`, `Tel`, `Fax`, `Website`, `Address`, `City`, `Town`, `AdditionalField1`, `AdditionalField2`, `AdditionalField3`, `AdditionalField4`, `AdditionalField5`, `AdditionalField6`, `AdditionalField7`.
```json
[
  {
    "Title": "",
    "Email": "",
    "UserName": "",
    "StoreName": "",
    "ContactPerson": "",
    "TaxDepartment": "",
    "TaxNumber": "",
    "IBAN": "",
    "Mobile": "",
    "Tel": "",
    "Fax": "",
    "Website": "",
    "Address": "",
    "City": "",
    "Town": "",
    "AdditionalField1": "",
    "AdditionalField2": "",
    "AdditionalField3": "",
    "AdditionalField4": "",
    "AdditionalField5": "",
    "AdditionalField6": "",
    "AdditionalField7": ""
  }
]
```
