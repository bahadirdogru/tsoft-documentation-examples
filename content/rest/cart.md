---
title: Cart
description: Üye sepetine ürün yazma ve okuma. Konsolda hepsi alpha. Ayrı sepet linki alanı yok.
---

# Cart

REST1 modülü · 7 metot · taban `https://magaza.example/rest1/cart/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Üye sepetine ürün yazma ve okuma. Konsolda hepsi alpha. Ayrı sepet linki alanı yok.

## `cart/addToCart` (alpha)

`POST https://magaza.example/rest1/cart/addToCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `new` | query | bool | hayır | Yeni yöntemde sepetteki ürünü güncellemek için product_id yanında cart_index de gönderilmeli. count alanına da o ürünün sepetteki güncel sayısı yazılmalı. Sepete yeni ürün eklerken cart_index -1 olarak gönderilmeli. |

Örnek `data` alanları: `customer_id`, `cart_index`, `product_id`, `variant_id`, `count`, `personalization`.
```json
[
  {
    "customer_id": "110",
    "cart_index": "-1",
    "product_id": "147",
    "variant_id": "",
    "count": "2",
    "personalization": {
      "form_id": "11",
      "data": [
        {
          "title": "1. resim",
          "value": "test.jpg",
          "index": 0
        },
        {
          "title": "2. resim",
          "value": "test2.jpg",
          "index": 1
        }
      ]
    }
  }
]
```

## `cart/getCart` (alpha)

`POST https://magaza.example/rest1/cart/getCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `customer_id` | url_param | str | hayır |  |
| `new` | query | bool | hayır |  |
| `mobile_app` | query | bool | hayır | true gönderildiği takdirde, sepette yalnızca mobil uygulamada aktif olan kampanyalar listelenir. |
| `fetch_product_detail` | query | bool | hayır |  |
| `fetch_installment_list` | query | bool | hayır |  |
| `image_limit` | query | int | hayır |  |

## `cart/getAll` (alpha, yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/cart/getAll/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `UpdateDate` | query | str | hayır | Bu tarihten sonra güncellenen sepetler. Example: "2011-07-21 20:09:00" |
| `Email` | query | str | hayır |  |

## `cart/removeAll` (alpha)

`POST https://magaza.example/rest1/cart/removeAll/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `customer_id` | url_param | str | hayır |  |
| `new` | query | bool | hayır |  |

## `cart/removeItems` (alpha)

`POST https://magaza.example/rest1/cart/removeItems/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `new` | query | bool | hayır | Yeni yöntemde sepetteki ürünü silmek için product_id yerine cart_index gönderilmeli. |

Örnek `data` alanları: `customer_id`, `cart_index`, `product_id`, `variant_id`.
```json
[
  {
    "customer_id": "110",
    "cart_index": "-1",
    "product_id": "147",
    "variant_id": ""
  }
]
```

## `cart/selectCampaign` (alpha)

`POST https://magaza.example/rest1/cart/selectCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Seçili kampanyayı iptal etmek için campaign_id sıfır (0) gönderilmelidir. |

Örnek `data` alanları: `customer_id`, `campaign_group_id`, `campaign_id`.
```json
[
  {
    "customer_id": "110",
    "campaign_group_id": "1",
    "campaign_id": "4"
  }
]
```

## `cart/setCouponCode` (alpha)

`POST https://magaza.example/rest1/cart/setCouponCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `customer_id`, `code`.
```json
[
  {
    "customer_id": "110",
    "code": "1BNQGVPVNJ"
  }
]
```
