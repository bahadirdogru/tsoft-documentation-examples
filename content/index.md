---
title: Ana sayfa
description: T-Soft REST1, Admin API v3, uygulama platformu, Storefront API ve Twig/Smarty tema kodlama için Türkçe başvuru dokümantasyonu.
---

# T-Soft Dokümantasyonu

T-Soft e-ticaret altyapısıyla entegrasyon ve tema yazan geliştiriciler ve onlara yardım eden yapay zekâ asistanları için tek bir başvuru noktası. Resmî sayfalarda, panel kodunda ve konsolda dağınık duran bilgiyi gerçek mağazada denenmiş çağrılarla bir araya getirir.

<div class="cards">
<a class="card" href="/rehber/"><strong>Hangi yüzey?</strong><span>REST1, Admin API, Storefront ve tema arasında seçim, ilk çağrılar, terimler.</span></a>
<a class="card" href="/rest/"><strong>REST1 web servisi</strong><span>38 modül, 428 metot. Form gövdesi, token, PascalCase alanlar, hata kodları.</span></a>
<a class="card" href="/admin-api/"><strong>Admin API v3</strong><span>Panelin kendi kullandığı 357 uç: kurallar, yetkiler, iki adımlı giriş, ziyaretçi raporları ve ödeme bildirimi örneği.</span></a>
<a class="card" href="/developer/uygulama/"><strong>Uygulama platformu</strong><span>OAuth, 48 kapsam, 15 webhook olayı, panele gömülü uygulama, REST1’den geçiş.</span></a>
<a class="card" href="/developer/storefront-api/"><strong>Storefront API</strong><span>Mobil uygulama ve headless vitrin için JSON:API, müşteri ve misafir token’ı.</span></a>
<a class="card" href="/developer/tema/"><strong>Tema motoru (Twig)</strong><span>Yeni tema yapısı, tsoft-cli, şablonlar ve global değişkenler.</span></a>
<a class="card" href="/theme/"><strong>Eski tema (Smarty)</strong><span>Blok kodları, <code>$P</code> ürün alanları, menü ağacı, sık hatalar.</span></a>
<a class="card" href="/llm/"><strong>LLM’ler için</strong><span>llms.txt, tam metin ve her sayfanın Markdown hâli.</span></a>
</div>

## Hangi yolu seçmeliyim?

| İhtiyaç | Önerilen yol | Neden |
|---------|--------------|-------|
| Tek mağazanın ERP, stok, sipariş entegrasyonu | [REST1](rest/README.md) | Web servis kullanıcısıyla çalışır, en geniş modül kapsamı. |
| Birden çok mağazaya kurulacak uygulama | [Uygulama platformu](developer/uygulama.md) | OAuth ve webhook; REST1 kullanıcı/parola modeli kapanacak. |
| REST1’de karşılığı olmayan panel işi | [Admin API v3](admin-api/README.md) | Panelin kendi uçları. Sürüm garantisi yok. |
| Mobil uygulama, headless vitrin | [Storefront API](developer/storefront-api.md) | Müşteri ve misafir oturumu, sepet, ödeme. |
| Vitrin görünümü | [Twig](developer/tema.md) veya [Smarty](theme/README.md) | Temanın sürümüne göre. |

> **Üç API, üç ayrı adlandırma:** REST1 `CustomerCode` (PascalCase, form gövdesi), panel API’si `customerId` (camelCase, JSON), Storefront `attributes.name` (JSON:API). Hiçbiri diğerinin token’ını kabul etmez. Ayrıntı: [Hangi yüzey?](rehber.md)

## Hızlı bağlantılar

- Token alma: [`auth/login`](rest/auth.md#auth-login) · Hata kodları: [REST1 hataları](rest/hatalar.md)
- Üye: [`customer/setCustomers`](rest/customer.md#customer-setcustomers) · Ürün: [`product/get`](rest/product.md#product-get) · Sipariş: [`order2/getOrders`](rest/order2.md#order2-getorders)
- Panel uç listesi: [Admin API v3 uçları](admin-api/uclar.md) · Giriş: [İki adımlı doğrulama](admin-api/oturum.md) · Örnekler: [Ziyaretçi raporları](admin-api/ziyaretci-raporlari.md), [Ödeme bildirimi](admin-api/odeme-bildirimi.md)
- Örnek kod: [Python istemci](examples/python/tsoft_client.py) · [Apps Script](examples/apps-script/Code.gs)

## Katkı

Site [GitHub](https://github.com/bahadirdogru/tsoft-documentation-examples) üzerinde açık kaynaktır. Her sayfanın altındaki "GitHub'da düzenle" bağlantısıyla düzeltme önerebilirsiniz. Topluluk belgesidir; T-Soft’un resmî yayını değildir. Resmî kaynak: [developer.tsoft.com.tr](https://developer.tsoft.com.tr/).
