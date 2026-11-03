---
title: LLM ve ajanlar için
url: https://tsoft.bahadirdogru.com/llm/
---

# LLM ve ajanlar için

Bu site hem insanlar hem dil modelleri için yazılır. Sayfalar tarayıcıda biçimlenir ama her sayfanın kaynağı düz Markdown’dur ve doğrudan okunabilir.

## Giriş noktaları

| Dosya | İçerik | Ne zaman |
| --- | --- | --- |
| [`/llms.txt`](https://tsoft.bahadirdogru.com/llms.txt) | Tüm sayfaların başlık, açıklama ve ham adres listesi ([llmstxt.org](https://llmstxt.org/) biçimi) | Ajanın önce hangi sayfayı okuyacağına karar vermesi |
| [`/llms-full.txt`](https://tsoft.bahadirdogru.com/llms-full.txt) | Bütün Markdown sayfaları tek dosyada | Uzun bağlamlı model, RAG dizini, çevrimdışı kopya |
| `/<yol>.md` | Tek sayfa, ör. [`/rest/customer.md`](https://tsoft.bahadirdogru.com/rest/customer.md) | Belirli bir modül veya ucu okumak |
| [`/search-index.json`](https://tsoft.bahadirdogru.com/search-index.json) | Sayfa dizini: başlık `t`, adres `u`, açıklama `d`, grup `g`, kaynak yol `s`, alt başlıklar `h` | Kendi dizinleyicinizi yazmak |

Sayfa adresi `/rest/customer/` biçimindedir. Aynı sayfanın Markdown hâli için sondaki `/` yerine `.md` yazılır: `/rest/customer.md`. Başlık çapaları başlık metninden üretilir ve Türkçe harfleri korur (`/rest/customer/#customer-setcustomers`). Eski `#p=rest/customer.md&h=...` adresleri yeni adrese yönlenir.

Örnek kod ve tema dosyalarının (`.py`, `.tpl`, `.html`, `.json`) ham hâli kaynak yolundadır, ör. `/theme/bloklar/ust.html`. Her sayfanın altında **Markdown** veya **Ham dosya** bağlantısı vardır.

## Sayfa düzeni

- REST1 her modül için bir sayfadır: `rest/<modül>.md`. Modül adı küçük harftir (`order2.md`, `fundmovement.md`). Her metot `` ## `modul/metot` `` başlığıdır; altında tam URL, açıklama ve parametre tablosu (`Parametre | Yer | Tip | Zorunlu | Açıklama`) durur.
- Admin API v3 panel iç uçları `admin-api/uclar.md` içinde gruplanmış liste, kurallar `admin-api/README.md` içindedir.
- Uygulama platformu (OAuth, kapsam, webhook, gömülü uygulama) `developer/uygulama.md`.
- Tema: Twig için `developer/tema.md`, Smarty için `theme/README.md`.

## Yazım kuralları

Bu kurallar sayfaları makinenin yanlış anlamaması için konuldu:

1. **Gözlem ile katalog ayrı yazılır.** "Konsol kataloğu", "panel kodu" veya "resmi sayfa" kaynaklıdır. Tarihli "canlı çağrı" / "deneme" notları gerçek bir mağazada görülen yanıttır. Kaynağı olmayan yanıt alanı uydurulmaz; bilinmeyen şey "yazmıyor" / "gözlenmedi" diye belirtilir.
2. **Tarih yazılır.** T-Soft panel ve API’leri sık değişir. Her bölüm hangi tarihte veya hangi panel sürümünde gözlendiğini söyler.
3. **Gizli veri yazılmaz.** Mağaza adresi `magaza.example`, üye `Örnek Üye`, token ve parola hiçbir yerde yoktur.
4. **Alan adları birebir yazılır.** REST1 `CustomerCode`, panel API’si `customerId`, Storefront `attributes.name`: büyük/küçük harf farkı hata sebebidir.
5. **Sayfa başında bağlam olur.** Bir sayfa tek başına okunduğunda taban adresi ve ortak kuralların nerede olduğu ilk paragrafta yazar.

## Ajan için hızlı kurallar

- REST1’e her zaman `POST`, `application/x-www-form-urlencoded`, `User-Agent` başlığı ve `token` alanı ile gidilir. Yazma metotlarında `data` alanı **JSON dizisinin string hali**dir.
- REST1 cevabında `success: false` partinin tamamı başarısız demek değildir; `message[]` satır satır okunur. `data: null` boş sonuçtur.
- Panel iç API’sinin taban adresi panel alanı (`*.tsoftpanel.com`) değil mağaza alanıdır.
- Uygulama Admin API’si `Accept: application/vnd.api+json` ister; `application/json` 406 döner.
- Smarty bloğuna yazılan JavaScript `{literal}…{/literal}` içine alınır. Twig temasında şablona `<script>` yazılmaz, `assets/js/theme.js` kullanılır.
- `alpha` işaretli REST1 metotları ve panel iç uçları sözleşmeli değildir; üretim kodunda cevap şekli doğrulanmalıdır.

## Katkı

Kaynak [GitHub](https://github.com/bahadirdogru/tsoft-documentation-examples) deposunun `content/` klasöründedir; `docs/` derlenmiş çıktıdır ve elle düzenlenmez. Yeni sayfa `content/` altına front matter (`title`, `description`) ile yazılır, `content/_nav.json` içine yolu eklenir ve şu komut çalıştırılır:

```bash
npm run build
```

Derleme her sayfayı HTML ve Markdown olarak yazar, `llms.txt`, `llms-full.txt`, `search-index.json` ve `sitemap.xml` dosyalarını yeniden üretir. Kırık iç bağlantı ya da olmayan bir başlık çapası varsa hata verir.
