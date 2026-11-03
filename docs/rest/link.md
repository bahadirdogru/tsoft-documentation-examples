---
title: Link
url: https://tsoft.bahadirdogru.com/rest/link/
---

# Link

REST1 modülü · 4 metot · taban `https://magaza.example/rest1/link/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

SEO, sitemap ve yönlendirme linki. Sepet linki değildir.

## `link/getLinks`

`POST https://magaza.example/rest1/link/getLinks/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

## `link/setLinks`

`POST https://magaza.example/rest1/link/setLinks/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | SiteMapChangeFreq için gönderilebilecek değerler: HIDE, ALWAYS, HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY, NEVER, NONE   SitemapPriority: 0.0 ile 1.0 arasında float değer gönderilmelidir.   HideSitemap: 0 veya 1 gönderilmelidir.   Canonical: 0->Atanmamış, 1->Göster, 2->Gösterme     CanonicalUrl: Canonical Göster ayarı aktif ve bu alan dolu ise iligli linkin canonical adresi bu alana göre oluşturulur. |

Örnek `data` alanları: `Type`, `TableId`, `Language`, `Title`, `Description`, `Keywords`, `Index`, `Follow`, `Canonical`, `CanonicalUrl`, `SiteMapChangeFreq`, `SitemapPriority`, `HideSitemap`.
```json
[
  {
    "Type": "",
    "TableId": "",
    "Language": "",
    "Title": "",
    "Description": "",
    "Keywords": "",
    "Index": "",
    "Follow": "",
    "Canonical": "",
    "CanonicalUrl": "",
    "SiteMapChangeFreq": "",
    "SitemapPriority": "",
    "HideSitemap": ""
  }
]
```

## `link/setReferralLinks`

`POST https://magaza.example/rest1/link/setReferralLinks/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `Link`, `RedirectLink`.
```json
[
  {
    "Link": "",
    "RedirectLink": ""
  }
]
```

## `link/getReferralLinks`

`POST https://magaza.example/rest1/link/getReferralLinks/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |
