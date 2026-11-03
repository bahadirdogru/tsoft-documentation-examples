---
title: Hangi yüzey?
description: REST1, Admin API, Storefront ve tema arasında seçim; ilk çağrılar ve terimler
---

# Hangi yüzeyi kullanmalı?

T-Soft’ta mağaza verisine beş farklı yoldan erişilir. Yanlış yüzeyi seçmek en sık yapılan hatadır: REST1 alan adları PascalCase, Admin API camelCase, Storefront JSON:API’dir ve hiçbiri diğerinin token’ını kabul etmez.

| Yüzey | Kim için | Taban | Kimlik | Biçim | Sayfa |
| --- | --- | --- | --- | --- | --- |
| REST1 | Sunucudan sunucuya entegrasyon (ERP, senkron, betik) | `https://<mağaza>/rest1/{modul}/{metot}/` | `auth/login` → `token` | Form gövdesi, JSON zarf | [REST1](rest/README.md) |
| Admin API `2026-01` | App Store / özel uygulama | `https://<mağaza>/api/v3/admin/2026-01/` | OAuth `client_credentials` | JSON:API | [Uygulama geliştirme](developer/uygulama.md) |
| Admin API v3 (panel içi) | Panel işini otomatikleştirme, REST1’de olmayan ekranlar | `https://<mağaza>/api/v3/admin/` | Panel oturum token’ı | Laravel JSON | [Admin API v3](admin-api/README.md) |
| Storefront API | Mobil uygulama, headless vitrin | `https://<mağaza>/api/v3/storefront/2026-01` | Client / müşteri / misafir token’ı | JSON:API | [Storefront API](developer/storefront-api.md) |
| Tema | Vitrin HTML’i | Panel / `tsoft-cli` | — | Twig veya Smarty | [Tema motoru](developer/tema.md), [Eski tema](theme/README.md) |

## Karar

1. **Vitrinde görünen bir şey mi değişecek?** Yeni temada [Twig](developer/tema.md), eski temada [Smarty blok](theme/README.md). Tema içinden veri gerekiyorsa sayfa global’leri (`PRODUCT_DATA`, `MEMBER_INFO`) veya Storefront API.
2. **Birden çok mağazaya kurulacak bir ürün mü?** Uygulama platformu: OAuth + Admin API `2026-01` + webhook. REST1 kullanıcı/parola modeli kapanacak ([geçiş](developer/uygulama.md#rest1-den-geçiş)).
3. **Tek mağazanın kendi entegrasyonu mu?** REST1. Web servis kullanıcısı panelde açılır, IP ve metot yetkisi orada verilir.
4. **REST1’de karşılığı olmayan bir panel işi mi?** (ödeme bildirimi, sadakat, Nova, tema göçü …) Panel iç API’si. Sürüm garantisi yoktur; panel güncellemesinde kontrol edin.
5. **Mobil uygulama veya headless vitrin mi?** Storefront API. REST1’deki `Mobile` ve `Platform` modülleri eski mobil oturum (`MobileToken`, `CustomerHash`) içindir.

## İlk çağrı: REST1

```bash
# 1) token al  (kullanıcı adı yolda, parola gövdede)
curl -s -A "Mozilla/5.0" -X POST "https://magaza.example/rest1/auth/login/WS_KULLANICI" \
  --data-urlencode "pass=$TSOFT_PASS"

# 2) token ile çağır  (data alanı JSON dizisinin metnidir)
curl -s -A "Mozilla/5.0" -X POST "https://magaza.example/rest1/customer/getCustomers/" \
  --data-urlencode "token=$TSOFT_TOKEN" \
  --data-urlencode "limit=10" \
  --data-urlencode "f=Email|ornek@magaza.example|equal"
```

`-A` (User-Agent) olmadan Cloudflare `403 error code: 1010` döner. Python istemcisi: [tsoft_client.py](examples/python/tsoft_client.py).

```python
from tsoft_client import load_env, login, post_form, rows_of

base, user, password, _ = load_env()     # .env: TSOFT_URL, TSOFT_USER, TSOFT_PASS
token, expires = login(base, user, password)
groups = rows_of(post_form(base, "/rest1/customer/getCustomerGroups/", {"token": token}))
```

## İlk çağrı: Admin API `2026-01`

```bash
curl https://magaza.example/api/v3/admin/2026-01/order/orders \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/vnd.api+json"
```

Token akışı [OAuth](developer/uygulama.md#oauth-akışı) bölümündedir.

## İlk çağrı: Storefront API

```bash
curl "https://magaza.example/api/v3/storefront/2026-01/products?page[size]=5" \
  -H "Accept: application/vnd.api+json" \
  -H "Authorization: Bearer $CLIENT_TOKEN"
```

## Aynı işin karşılıkları

| İş | REST1 | Admin API v3 (panel) | Storefront |
| --- | --- | --- | --- |
| Üye ekle/güncelle | [`customer/setCustomers`](rest/customer.md) | `customers/customer` | `storefront:register` |
| Üye grubu | [`customer/getCustomerGroups`](rest/customer.md) | `customers/group` | — |
| Ürün listesi | [`product/getProducts`](rest/product.md) | `catalog/products` | `/products` |
| Grup fiyatı | [`product/updateCustomerGroupPrice`](rest/product.md) | `catalog/pricing/group-price` | `storefront:pricing` |
| Sipariş listesi | [`order/get`](rest/order.md) | `orders/order` | `storefront:account` |
| Sipariş durumu | [`order2/*`](rest/order2.md) | `orders/status-update` | — |
| Sepet | [`cart/*`](rest/cart.md) (alpha) | `customers/cart` (okuma) | `storefront:cart` |
| Cari hareket | [`fundMovement/*`](rest/fundmovement.md) | `customers/billing/account-balance` | — |
| Ödeme linki | — | [`customers/payment-notification`](admin-api/odeme-bildirimi.md) | — |
| Webhook | — | `configuration/webhooks` | — (uygulamada `2026-01/webhooks`) |
| Önbellek temizle | [`setting/deleteCache`](rest/setting.md) | `configuration/cache` | — |

Panel sütunundaki yollar `api/v3/admin/` önekiyle okunur; tam liste [Uç listesi](admin-api/uclar.md).

## Terimler

| Terim | Anlamı |
| --- | --- |
| Web servis kullanıcısı | REST1 için panelde açılan kullanıcı. Panel yöneticisi değildir. |
| `CustomerCode` | Üyenin web servis kodu (`T1001` gibi). Sayısal `CustomerId` ile aynı değildir. |
| `CustomerGroupCode` | Grup kodu. Grup adıyla aynı olmak zorunda değildir (`ogretmenler` ↔ `[Öğretmenler]`). |
| `ProductCode` / `ProductId` | Ürünün metin kodu / sayısal kimliği. Sepet uçları sayısal kimlik ister. |
| Bayi (`IsVendor`) | B2B üye grubu. Temada `$IS_VENDOR_LOGIN`. |
| `Field1`–`Field15` | Üye ek alanları. Panelde Üye alanları ekranından adlandırılır. |
| alpha / beta | Konsolun olgunluk işareti. Davranış değişebilir. |
| Destek kullanıcısı | `supportUser = 1` olan T-Soft personeli. Bazı metotlar yalnız ona açık. |
| OS2 | Online Store 2: yeni (Twig) tema motorunun panel adı. |
| Nova | T-Soft’un panel içi yapay zekâ özellikleri. |
