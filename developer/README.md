# T-SOFT geliştirici platformu

Kaynak: [developer.tsoft.com.tr](https://developer.tsoft.com.tr/) (20 Ekim 2026). Storefront doküman sürümü **1.9.0**, API sürümü **2026-01**.

Bu klasör resmi sayfaların kısa karşılığıdır. Alan tabloları, örnek gövdeler ve inceleme metinleri resmi sitede durur. Burada komut, dizin, uç ve yetki özeti vardır.

## İki ayrı yüzey

| Bu depo | Ne işe yarar | Taban |
| --- | --- | --- |
| [rest/tsoft.rest.md](../rest/tsoft.rest.md) | Panel web servisi REST1. Üye yazma, grup fiyatı, konsol kataloğu. | `https://magaza.example/rest1` |
| [storefront-api.md](storefront-api.md) | Vitrin ve mobil istemci. JSON:API. | `https://<domain>/api/v3/storefront/2026-01` |
| [theme/](../theme) | Eski vitrin blok HTML’i ve şablon parçaları. | Panel blok editörü |
| [tema.md](tema.md) | Yeni tema motoru. Twig, Tailwind, `tsoft-cli`. | `tsoft theme dev` |

## 20 Ekim 2026’da açık olanlar

| Bölüm | Durum | Özet |
| --- | --- | --- |
| [Başlarken](baslarken.md) | Açık | Hesap, partner paneli, ilk tema |
| [Tema Geliştirme](tema.md) | Açık | CLI, section, snippet, Twig |
| [Storefront API](storefront-api.md) | Açık | Katalog, hesap, sepet |
| Uygulama Geliştirme | Ana sayfada Yakında, adres 404 | OAuth, gömülü uygulama, checkout extension, faturalama |
| API Dokümanı | Ana sayfada Yakında, adres 404 | Admin API: kimlik, limit, ürün, sipariş, webhook |
| Tema Servisleri | Ana sayfada Yakında, adres 404 | Ürün, sepet, üye, ERP |

Sitemap bu üç kapalı bölümün adreslerini de listeler. İstek 404 döner.

## Hesap adresleri

- Kayıt: [login.tsoft360.com/register](https://login.tsoft360.com/register)
- Partner paneli: [partners.tsoft360.com](https://partners.tsoft360.com/)
- Giriş: [login.tsoft360.com](https://login.tsoft360.com/)
- GitHub: [github.com/tekrom](https://github.com/tekrom)
