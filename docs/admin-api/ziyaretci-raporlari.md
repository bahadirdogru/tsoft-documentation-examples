---
title: Ziyaretçi raporları
url: https://tsoft.bahadirdogru.com/admin-api/ziyaretci-raporlari/
---

# Ziyaretçi raporları

Panel ekranı: Analiz → Raporlar → **Ziyaretçi Raporu** (`/analytics/report/visitor/overview`). Ekran oturum, ziyaretçi, sayfa görüntüleme, sipariş, ciro ve dönüşüm oranını; zaman serisini; en çok görüntülenen sayfa ve ürünleri; trafik kaynaklarını; satın alma hunisini, yeni / geri gelen ayrımını, yapay zekâ özetini ve arama boşluklarını gösterir. Bu veriler REST1'de yoktur.

Kaynak: panel `v5.0.317`, canlı bir mağazada salt okunur çağrılar (11 Kasım 2026). Yalnız alan adları, tipleri ve geçerli değerler kaydedildi; örnek sayılar uydurmadır.

## Ortak kurallar

```http
GET /api/v3/admin/analytics/report/visitor/overview?range=7d HTTP/1.1
Host: www.magaza.example
Authorization: Bearer <panel token>
Accept: application/json
```

- Token, girişteki `data.token.plainTextToken`'dır. `legacy.bearer` bu uçlarda **401** döner. Bkz. [Giriş ve iki adımlı doğrulama](oturum.md#hangi-token-nerede-geçer).
- İzin: `analytics:report:read`.
- Cevap zarfı: `{"status": true, "message": "", "attributes": {"system.status": {…}}, "data": {…}}`. Aşağıdaki tablolar `data`'yı anlatır.
- Geçersiz sorgu değeri **422** ve Türkçe `message` döner: `"Seçili range geçersiz."`, `"Seçili metric geçersiz."`.

### Dönem

| Sorgu | Geçerli değerler | Not |
| --- | --- | --- |
| `range` | `today`, `7d`, `30d` | `24h` ve `90d` **422**. `timeseries` uçta tersi: `24h`, `7d`, `30d` geçer, `today` **422**. |
| `start`, `end` | `YYYY-MM-DD` | Özel aralık. `range` yerine gönderilir. `end`, `start`'tan önce olursa **422** (`"end şundan daha eski veya eşit bir tarih olmalıdır start."`). |

- Özel aralıkta cevaptaki `range` alanı yine varsayılanı gösterir (`today` ya da `7d`), ama rakamlar istenen aralığa aittir. Aralığın uygulandığını `range` alanından anlamayın.
- Panel ekranında Bugün / Son 7 Gün / Son 30 Gün düğmeleri `range` gönderir; tarih seçici `start` / `end` gönderir.

## Uçlar

Hepsi `GET` ve `api/v3/admin/analytics/report/visitor/` altındadır.

| Uç | Panelin gönderdiği sorgu | `data` |
| --- | --- | --- |
| `overview` | `range` | Dönem toplamları ve önceki dönem |
| `timeseries` | `range`, `metric` | Zaman serisi |
| `top-pages` | `range`, `limit=10` | En çok görüntülenen sayfalar |
| `top-products` | `range`, `order_by`, `limit=10` | Ürün etkileşimi |
| `traffic-sources` | `range`, `limit=10` | Trafik kaynakları |
| `funnel` | `range` | Satın alma hunisi |
| `new-vs-returning` | `range` | Yeni / geri gelen ziyaretçi |
| `briefing` | `range` | Yapay zekâ özeti ve sinyaller |
| `search-gaps` | `range`, `limit=20` | Sonuçsuz ya da eşleşmeyen aramalar |
| `live` | — | Şu anki ziyaret ve sepet durumu |
| `live-count` | — | Şu anki oturum ve ziyaretçi sayısı |
| `live-locations` | — | Canlı ziyaretçi konumları |

### overview

```json
{
  "range": "7d",
  "current":  { "sessions": 1200, "visitors": 950, "pageviews": 4100, "orders": 12, "revenue": 8450.5, "currency": "TRY", "conversion_rate": 1.0 },
  "previous": { "sessions": 1100, "visitors": 900, "pageviews": 3900, "orders": 10, "revenue": 7600.0, "currency": "TRY", "conversion_rate": 0.91 }
}
```

`previous` aynı uzunluktaki önceki dönemdir; panel değişim yüzdesini bundan hesaplar. Bütün sayılar JSON sayısıdır. `conversion_rate` yüzdedir (`1.0` = %1).

### timeseries

| Sorgu | Geçerli değerler |
| --- | --- |
| `metric` | `sessions`, `visitors`, `pageviews`, `orders`, `revenue` (`conversion_rate` **422**) |
| `range` | `24h` (25 saatlik kova), `7d` (8 günlük kova), `30d` (31 günlük kova) |

```json
{ "range": "7d", "metric": "sessions", "points": [ { "bucket": "2026-11-04", "value": 160 } ] }
```

`bucket` günlük aralıkta `YYYY-MM-DD`, `24h`'te `YYYY-MM-DD HH:MM:SS`. Kova sayısı aralığın iki ucunu da içerir.

### top-pages

```json
{ "pages": [ { "path": "/kategori/defter", "views": 320, "sessions": 210 } ] }
```

`limit=100` kabul edildi; üst sınır denenmedi.

### top-products

`order_by`: `views`, `adds`, `purchases`, `revenue` (başka değer **422**).

```json
{ "products": [ { "product_id": "1234", "name": "Defter", "views": 150, "adds": 12, "purchases": 4, "revenue": 340.0 } ] }
```

`product_id` string gelir.

### traffic-sources

```json
{ "sources": [ { "source": "google", "kind": "referrer", "sessions": 400, "visitors": 330 } ] }
```

`kind`: `direct`, `referrer`, `utm`.

### funnel

```json
{ "overall_rate": 1.2, "steps": [ { "name": "product_view", "count": 800 }, { "name": "add_to_cart", "count": 90 }, { "name": "checkout_start", "count": 30 }, { "name": "purchase", "count": 12 } ] }
```

Adımlar bu sırayla gelir: `product_view`, `add_to_cart`, `checkout_start`, `purchase`.

### new-vs-returning

```json
{ "new": 700, "returning": 250 }
```

### briefing

```json
{
  "status": "ok",
  "range": "7d",
  "window": "last_7_days",
  "totals": { "sessions": 1200, "visitors": 950, "pageviews": 4100, "orders": 12, "revenue": 8450.5, "currency": "TRY", "conversion_rate": 1.0 },
  "briefing": {
    "headline": "…", "summary": "…",
    "findings": [ { "title": "…", "detail": "…", "severity": "warning" } ],
    "actions":  [ { "title": "…", "detail": "…" } ]
  },
  "signals": [ { "key": "funnel_weakest_step", "severity": "warning", "step": "add_to_cart", "rate_from_prev": 11.2, "overall_rate": 1.2 } ]
}
```

| Alan | Değerler |
| --- | --- |
| `status` | `ok`; panel kodu ayrıca `insufficient_data` (yetersiz oturum; `min_sessions` alanıyla) ve `unavailable` bekler |
| `window` | `last_24_hours` (`range=today`), `last_7_days`, `last_30_days` |
| `severity` | `good`, `warning`, `info` |
| `signals[].key` | `sessions`, `visitors`, `pageviews`, `orders`, `revenue`, `conversion_rate` (alanlar: `direction`, `delta_pct`), `funnel_weakest_step` (`step`, `rate_from_prev`), `source_concentration` (`source`, `share_pct`), `product_high_view_low_add` (`product_id`, `name`, `views`, `adds`) |

Metinler (`headline`, `summary`, `findings`) panelin yapay zekâ özetidir ve her çağrıda değişebilir.

### search-gaps

```json
{
  "status": "ok", "range": "7d", "window": "last_7_days",
  "counts": { "not_found": 14, "no_match": 6 },
  "gaps": [ { "term": "kareli defter", "group": "not_found", "searches": 9, "searchers": 7, "candidates": [ { "id": 1234, "name": "…", "category": "…" } ] } ],
  "advice": { "summary": "…", "not_found_advice": "…", "no_match_advice": "…" }
}
```

`group`: `not_found` (sonuç yok), `no_match` (sonuç var, aranan ürün değil). `candidates` aramaya yakın ürünlerdir.

### live, live-count, live-locations

```json
{ "now": { "sessions": 12, "visitors": 10, "orders_today": 3, "revenue_today": 640.0, "currency": "TRY" },
  "behavior": { "active_carts": 2, "checking_out": 1, "purchased": 0 } }
```

`live-count`: `{ "sessions": 12, "visitors": 10 }`. `live-locations`: `{ "points": [] }` (denemede boştu; nokta alanları görülmedi).

## REST1 ve GA4 ile farkı

- Sipariş ve ciro rakamları panelin ziyaret izleyicisinden gelir; REST1 `order/get` toplamlarıyla aynı olmayabilir (durum süzgeci, iptal ve iade farkı). Muhasebe toplamı için REST1 kullanın.
- Google Analytics ile oturum ve ziyaretçi sayıları farklı tanımlıdır; birini ötekinin yerine koymayın.
