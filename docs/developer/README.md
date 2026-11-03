---
title: Platform haritası
url: https://tsoft.bahadirdogru.com/developer/
---

# T-SOFT geliştirici platformu

Kaynak: [developer.tsoft.com.tr](https://developer.tsoft.com.tr/) (20 Ekim 2026). Storefront doküman sürümü **1.9.0**, API sürümü **2026-01**.

Bu klasör resmi sayfaların kısa karşılığıdır. Alan tabloları, örnek gövdeler ve inceleme metinleri resmi sitede durur. Burada komut, dizin, uç ve yetki özeti vardır.

## İki ayrı yüzey

| Bu depo | Ne işe yarar | Taban |
| --- | --- | --- |
| [REST1](../rest/README.md) | Panel web servisi. Üye yazma, grup fiyatı, konsol kataloğu. 38 modül, 428 metot. | `https://magaza.example/rest1` |
| [Admin API v3](../admin-api/README.md) | Panelin kendi iç API’si (Laravel JSON, panel token’ı). 357 uç. | `https://magaza.example/api/v3/admin` |
| [Uygulama geliştirme](uygulama.md) | OAuth, kapsam, webhook, gömülü uygulama. Sürümlü Admin API. | `https://magaza.example/api/v3/admin/2026-01` |
| [storefront-api.md](storefront-api.md) | Vitrin ve mobil istemci. JSON:API. | `https://<domain>/api/v3/storefront/2026-01` |
| [Eski tema](../theme/README.md) | Smarty blok HTML’i, değişken JSON ve `.tpl` parçaları. | Panel blok editörü |
| [tema.md](tema.md) | Yeni tema motoru. Twig, Tailwind, `tsoft-cli`. | `tsoft theme dev` |

## 20 Ekim 2026’da açık olanlar

| Bölüm | Durum | Özet |
| --- | --- | --- |
| [Başlarken](baslarken.md) | Açık | Hesap, partner paneli, ilk tema |
| [Tema Geliştirme](tema.md) | Açık | CLI, section, snippet, Twig |
| [Storefront API](storefront-api.md) | Açık | Katalog, hesap, sepet |
| [Uygulama Geliştirme](uygulama.md) | 3 Kasım 2026’da açık | OAuth, kapsamlar, webhook, gömülü uygulama, REST1’den geçiş |
| API Dokümanı | Ana sayfada Yakında, adres 404 | Admin API: kimlik, limit, ürün, sipariş, webhook |
| Tema Servisleri | Ana sayfada Yakında, adres 404 | Ürün, sepet, üye, ERP |

3 Kasım 2026 itibarıyla Uygulama Geliştirme açıldı. API Dokümanı (`/api/genel-bakis`) ve Tema Servisleri (`/tema-servisleri/genel-bakis`) hâlâ Yakında.

## Hesap adresleri

- Kayıt: [login.tsoft360.com/register](https://login.tsoft360.com/register)
- Partner paneli: [partners.tsoft360.com](https://partners.tsoft360.com/)
- Giriş: [login.tsoft360.com](https://login.tsoft360.com/)
- GitHub: [github.com/tekrom](https://github.com/tekrom)
