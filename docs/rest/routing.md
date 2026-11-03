---
title: Routing
url: https://tsoft.bahadirdogru.com/rest/routing/
---

# Routing

REST1 modülü · 2 metot · taban `https://magaza.example/rest1/routing/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Servis yönlendirme.

## `routing/service`

`POST https://magaza.example/rest1/routing/service/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | service yerine girilebilecek parametreler aşağıdaki gibidir.  1. "IPSTACK" (ipstack.com - ücretli / ücretsiz) kullanımı için ipstack_apiKey girilmesi gerekmektedir  2. "IPINFO" (ipinfo.io - ücretli / ücretsiz) kullanımı için ipinfo_token girilmesi gerekmektedir.   3. "IPBASE" (ipbase.com - ücretli / ücretsiz) kullanımı içib ipbase_apikey girilmesi gerekmektedir.   4. "MAXMIND" (Maxmind GeoIP2 Precision Services - ücretli) kullanımı için maxmind_id ve maxmind_key girilmesi gerekmektedir  5. "MAXMINDDB" (Maxmind GeoIP2 Databases - ücretli) kullanımı için maxminddb_uri girilmesi gerekmektedir.  6. "IPAPICO" |

Örnek `data` alanları: `service`, `maxmind_id`, `maxmind_key`, `maxminddb_uri`, `ipstack_apiKey`, `ipinfo_token`, `ipbase_apikey`.
```json
[
  {
    "service": "service_name",
    "maxmind_id": "",
    "maxmind_key": "",
    "maxminddb_uri": "",
    "ipstack_apiKey": "",
    "ipinfo_token": "",
    "ipbase_apikey": ""
  }
]
```

## `routing/routingByIpAddress`

`POST https://magaza.example/rest1/routing/routingByIpAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Code alanı yerine Country kullanıbilir |

Örnek `data` alanları: `Code`, `Currency`, `Language`, `Routing`, `Status`.
```json
[
  {
    "Code": "US",
    "Currency": "USD",
    "Language": "en",
    "Routing": "",
    "Status": 1
  }
]
```
