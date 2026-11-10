# T-Soft geliştirici dokümantasyonu

T-Soft e-ticaret altyapısı için Türkçe teknik referans: REST1 web servisi, yönetim panelinin Admin API v3 uçları, uygulama platformu (OAuth, kapsamlar, webhook), Storefront API, Twig ve Smarty tema kodlama. Mağaza adresi, web servis parolası, token, üye listesi ve sipariş verisi yoktur; örneklerde `magaza.example` kullanılır.

Site: **https://tsoft.bahadirdogru.com** · LLM dizini: [llms.txt](https://tsoft.bahadirdogru.com/llms.txt) · Tam metin: [llms-full.txt](https://tsoft.bahadirdogru.com/llms-full.txt)

Topluluk belgesidir, T-Soft’un resmi yayını değildir. Resmi kaynak: [developer.tsoft.com.tr](https://developer.tsoft.com.tr/).

## İçerik

| Bölüm | Dosyalar |
| --- | --- |
| Hangi yüzey? | [content/rehber.md](content/rehber.md) |
| REST1 (38 modül, 428 metot) | [content/rest/](content/rest/README.md), hata kodları [content/rest/hatalar.md](content/rest/hatalar.md) |
| Admin API v3 (panel iç uçları, 357 uç) | [content/admin-api/](content/admin-api/README.md) |
| Uygulama platformu | [content/developer/uygulama.md](content/developer/uygulama.md) |
| Storefront API | [content/developer/storefront-api.md](content/developer/storefront-api.md) |
| Twig tema motoru | [content/developer/tema.md](content/developer/tema.md) |
| Eski Smarty tema | [content/theme/](content/theme/README.md) |
| Örnek kod | [content/examples/python](content/examples/python), [content/examples/apps-script](content/examples/apps-script/Code.gs) |
| LLM / ajan kullanımı | [content/llm.md](content/llm.md) |

## Yapı

```text
content/            El yazımı sayfalar (Markdown, front matter: title, description) ve örnek dosyalar
  _nav.json         Kenar çubuğu sırası; örnek dosyaların başlık ve açıklaması
  rest/             REST1: README.md, hatalar.md, <modül>.md
  admin-api/        Panel iç API'si: README.md, oturum.md, uclar.md, ziyaretci-raporlari.md, odeme-bildirimi.md
  developer/        Platform, uygulama, Storefront, Twig tema
  theme/            Smarty rehberi, bloklar/, degiskenler/, .tpl şablonları
  examples/         Python ve Apps Script
tools/
  build.js          content/ → docs/
  serve.js          docs/ klasörünü yerelde sunar
  assets/           CSS ve JS
docs/               ÜRETİLEN site (GitHub Pages buradan yayınlar). Elle düzenlemeyin.
```

Her Markdown sayfası iki biçimde üretilir: `/<yol>/index.html` ve `/<yol>.md`. Örnek dosyalar ham hâliyle kopyalanır ve vurgulanmış bir görüntüleme sayfası alır. Ayrıca `llms.txt`, `llms-full.txt`, `search-index.json`, `sitemap.xml`, `robots.txt` ve `404.html` üretilir.

## Geliştirme

```bash
npm install
npm run build        # docs/ klasörünü yeniden üretir
npm run serve        # http://localhost:4000
```

Derleme kırık iç bağlantıda, olmayan başlık çapasında ya da `_nav.json`'da olmayan Markdown dosyasında hata verir. GitHub Actions her push'ta derler ve `docs/` güncel değilse başarısız olur.

**`content/` değiştiğinde `npm run build` çalıştırıp `docs/` ile birlikte commit edin.**

## Sayfa ekleme

1. Markdown dosyasını `content/` altına `title` ve `description` front matter'ıyla yazın.
2. Yolunu `content/_nav.json` içindeki ilgili gruba ekleyin.
3. Bağlantıları göreli yazın: `[Customer](../rest/customer.md#customer-setcustomers)`. Derleme bunları site adresine çevirir; dosya GitHub'da da tıklanabilir kalır.
4. `npm run build`

## GitHub Pages

Depo ayarlarında Pages kaynağı **Deploy from a branch**, dal `main`, klasör **/docs**. Özel alan adı `docs/CNAME` dosyasındadır ve her derlemede yeniden yazılır.

## Örnek çalıştırma

```bash
cd content/examples/python
cp .env.example .env
python3 add_customer.py
python3 check_group_price.py ORNEK-001
```

`.env` içine mağaza adresi, web servis kullanıcısı ve parolası yazılır. Bu dosya depoya konmaz.

## Lisans

Tema örnekleri tsoft-notes notlarından türetilmiştir ve GPL-3.0 ile lisanslıdır. Ayrıntı [LICENSE](LICENSE) dosyasındadır.
