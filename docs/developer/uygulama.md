---
title: Uygulama geliştirme
url: https://tsoft.bahadirdogru.com/developer/uygulama/
---

# Uygulama geliştirme

Kaynak: [Uygulama Geliştirme](https://developer.tsoft.com.tr/uygulama-gelistirme/genel-bakis) (3 Kasım 2026). Bölüm 20 Ekim 2026’da 404 dönüyordu; artık açık. Aşağıdaki özet OAuth, kapsam, webhook, panele gömme ve REST1’den geçiş sayfalarını birleştirir.

## Uygulama türleri

| Tür | Kim kurar |
| --- | --- |
| Public | App Store’da yayınlanır, her mağaza kurabilir |
| Custom | Tek mağaza için yazılır |
| Embedded | Panel içinde iframe olarak açılır (public veya custom olabilir) |

Akış: kayıt bilgilerini T-SOFT’a ilet → `client_secret` al → kurulum kodunu takas et → test mağazasında dene → incelemeye gönder. `tsoft-cli` uygulama komutları henüz yok; işlemler partner paneli ve API üzerinden yapılır.

## Kayıt

T-SOFT’a iletilen alanlar:

| Alan | Not |
| --- | --- |
| `redirect_uri` | Kurulum sonrası dönüş. `https://` zorunlu |
| `app_url` | Panelde açılacaksa iframe adresi (isteğe bağlı) |
| `uninstall_url` | Kaldırma bildirimi adresi |
| Kapsamlar | İstenen izinler ve gerekçesi |

Karşılığında uygulama `client_secret` alır. `client_id` uygulamanın önekidir (ör. `app.ornek`). Sır yalnız sunucuda durur; sızarsa yenisi istenir ve eskisi anında geçersiz olur.

## OAuth akışı

```text
Mağaza sahibi "Yükle" → onay ekranı
  ├─ app_url yoksa → 302 redirect_uri?code=…&store=…&domain=…
  └─ app_url varsa → panel iframe'i app_url?session=<jwt>&code=…
Sunucunuz: code → mağazaya özel client_id/secret  (10 dk, tek kullanımlık)
Sunucunuz: client_credentials → access_token
Sunucunuz: Admin API  /api/v3/admin/2026-01/*
```

### 1. Kodu takas et

```bash
curl -X POST https://api.tsoftapps.com/api/integration/v3/install/app/credentials \
  -H "Content-Type: application/json" \
  -d '{"client_id":"app.ornek","client_secret":"<uygulama sırrı>","code":"<code>"}'
```

Cevap alanları: `store_id`, `store_domain`, `client_id`, `client_secret`, `scopes[]`. Dönen `client_id` / `client_secret` **mağazaya özeldir**; şifreli depoda `store_id` ile saklanır. Mağaza adresi olarak sorgudaki `domain` değil, cevaptaki `store_domain` kullanılır.

| Hata | Sebep |
| --- | --- |
| `401 invalid_client` | Uygulama sırrı yanlış |
| `400 invalid_grant` | Kod geçersiz, süresi geçmiş veya kullanılmış |

### 2. Token al

```bash
curl -X POST https://login.tsoft360.com/oauth/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type":"client_credentials","client_id":"<mağaza client_id>","client_secret":"<mağaza secret>","scope":"read_orders read_products"}'
```

`scope` boşlukla ayrılır. Token ömrü ve cevap şekli resmi sayfada yazmıyor; `expires_in` alanına göre yenileyin.

### 3. Admin API çağır

```bash
curl https://magaza.example/api/v3/admin/2026-01/order/orders \
  -H "Authorization: Bearer <access_token>" \
  -H "Accept: application/vnd.api+json"
```

Admin API JSON:API’dir. `Accept: application/json` **406**, onaylanmamış kapsam **403** döner. Panelin kendi kullandığı sürümsüz `/api/v3/admin/*` uçlarıyla karıştırmayın; fark [Admin API v3](../admin-api/README.md#iki-farklı-admin-api) sayfasında.

### İzin değişikliği ve kaldırma

Yeni kapsam istenince uygulama sürümü yükselir. Mağaza sahibi **Uygulamalarım → İzinleri onayla** ile onaylar; yeni kurulum kodu gelir ve eski mağaza istemcisi geçersiz olur. Kaldırmada mağaza istemcisi iptal edilir, token istekleri başarısız olur ve `uninstall_url` adresine imzalı bildirim gider.

## Kapsamlar

`write_` kapsamı aynı alandaki `read_` erişimini içerir. Hassas kapsamlar onay ekranında uyarıyla gösterilir ve kurulum oranını düşürür; yalnız kullanılan kapsamı isteyin.

| Kapsam | Ne açar | Hassas |
| --- | --- | --- |
| `read_products` | Ürün, varyant, görsel, marka, kategori, liste fiyatı | |
| `write_products` | Ürün oluşturma, güncelleme, yayından kaldırma (silme ve fiyat hariç) | |
| `delete_products` | Ürün silme | evet |
| `read_product_prices` | Bayi/grup fiyatı, miktar indirimi, bölge fiyatı | evet |
| `write_product_prices` | Ürün, bayi/grup fiyatı ve miktar indirimi değiştirme | evet |
| `read_merchandising` / `write_merchandising` | Vitrin sıralaması, arama eşleştirme, kombin | |
| `read_inventory` / `write_inventory` | Stok, depo, stok birimi | |
| `read_reviews` / `write_reviews` | Ürün yorumu | |
| `read_orders` | Sipariş ve durumları | |
| `write_orders` | Sipariş düzenleme (durum hariç) | |
| `write_order_status` | Sipariş durumu değiştirme | evet |
| `create_orders` | Sipariş oluşturma | evet |
| `read_subscriptions` / `write_subscriptions` | Abonelik siparişi görme, iptal, yeniden başlatma | |
| `read_financial_reports` | Ödeme işlemleri, satış raporu | evet |
| `read_fulfillments` / `write_fulfillments` | Gönderi ve barkod | |
| `read_returns` / `write_returns` | İade talebi ve para iadesi | |
| `read_customers` / `write_customers` | Müşteri kaydı ve adres (kişisel veri) | evet |
| `read_customer_groups` / `write_customer_groups` | Grup, segment, üye alanı tanımı | |
| `read_customer_balances` / `write_customer_balances` | Cari hareket | evet |
| `read_customer_messages` / `write_customer_messages` | Müşteri mesajı | evet |
| `read_carts` | Müşteri sepetleri | evet |
| `read_discounts` / `write_discounts` | Kampanya, kupon, hediye çeki | |
| `read_content` / `write_content` | Sayfa, blog, içerik | |
| `read_themes` | Tema, bölüm, blok, menü | |
| `write_themes` | Tema, bölüm, blok, menü değiştirme | evet |
| `read_shipping` / `write_shipping` | Kargo firması, bölge, ücret | |
| `read_files` / `write_files` | Dosya yöneticisi | |
| `read_tracking_codes` | Uygulamanın eklediği izleme kodları | |
| `write_tracking_codes` | Vitrine izleme kodu ekleme | evet |
| `read_store` | Para birimi, dil, pazar | |
| `write_currencies` | Para birimi ve kur | evet |
| `read_suppliers` | Tedarikçiler | |
| `write_webhooks` | Webhook tanımlama | evet |

Vitrin kapsamları ([Storefront API](storefront-api.md)): `storefront:read`, `storefront:pricing`, `storefront:account`, `storefront:cart`, `storefront:register`, `storefront:origin`.

## Webhook

### Kaldırma bildirimi

`uninstall_url` adresine `POST`, gövde `{ "token": "<jwt>" }`. Yönlendirme izlenmez.

| Claim | Beklenen |
| --- | --- |
| `iss` | `https://api.tsoftapps.com` |
| `aud` | Uygulama öneki |
| `event` | `app.uninstalled` |
| `store_id` | Kaldıran mağaza |
| `dest` | Mağaza alan adı |
| `exp` | Gönderimden 5 dakika sonra |

İmza ES256; anahtarlar oturum token’ıyla aynı JWKS’ten gelir. 10 saniye içinde 2xx dönülmezse 1 ve 5 dakika sonra iki kez daha denenir.

```ts
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL("https://api.tsoftapps.com/api/integration/v3/apps/jwks.json"));

app.post("/uninstall", async (req, res) => {
  const { payload } = await jwtVerify(req.body.token, jwks, {
    algorithms: ["ES256"],
    issuer: "https://api.tsoftapps.com",
    audience: process.env.TSOFT_APP_PREFIX,
  });
  if (payload.event !== "app.uninstalled") return res.sendStatus(400);
  await stores.forget(payload.store_id);
  res.sendStatus(200);
});
```

### Mağaza olayları

`write_webhooks` kapsamı gerekir.

```bash
curl -X POST https://magaza.example/api/v3/admin/2026-01/webhooks \
  -H "Authorization: Bearer <access_token>" \
  -H "Accept: application/vnd.api+json" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{"data":{"type":"webhooks","attributes":{"payloadUrl":"https://uygulama.example/hook","payloadSecret":"<rastgele>","events":["ORDER.CREATE","ORDER.STATUS.CHANGE"]}}}'
```

Olay kataloğu `GET /api/v3/admin/2026-01/webhook-events`, gönderim geçmişi `webhook-deliveries`.

| Olay | Ne zaman |
| --- | --- |
| `ORDER.CREATE` | Sipariş oluştu |
| `ORDER.STATUS.CHANGE` | Sipariş durumu değişti |
| `ORDER.CARGO.SEND` | Kargoya verildi |
| `ORDER.INVOICE.UPDATE` | Fatura bilgisi güncellendi |
| `ORDER.TRANSFER` | Sipariş aktarıldı |
| `ORDER.BEFORE` | Sipariş tamamlanmadan önce |
| `ORDER.PROVISION.REPORT.STATUS` | Provizyon raporu durumu değişti |
| `MEMBER.CREATE` | Üye kaydoldu |
| `MEMBER.DELETE` | Üye silindi |
| `MEMBER.NOTIFICATION.SETTING` | E-posta/SMS izni değişti |
| `COMMENT.CREATE` | Ürün yorumu yazıldı |
| `MESSAGE.CREATE` | Müşteri mesajı geldi |
| `RETURN.CREATE` | İade talebi açıldı |
| `RETURN.UPDATE` | İade talebi güncellendi |
| `RETURN.STATUS.CHANGE` | İade durumu değişti |

`webhooks` listesi mağaza sahibinin kendi tanımlarını da döner; yalnız `payloadUrl` sizin olan kayıtları değiştirin. Hemen 2xx dönüp işi kuyruğa alın, aynı olay birden çok gelebilir. Olay gövdesinin alanları ve `payloadSecret` imza başlığı resmi sayfada henüz yok.

Panel iç API’sinde aynı tanımlar `api/v3/admin/configuration/webhooks` (`events`, `logs`, `test`, `domain-settings`) altındadır.

## Panele gömülü uygulama

Panel uygulamayı `/apps/open/<önek>` sayfasında iframe olarak açar: `https://uygulama.example/app?session=<jwt>`. İlk açılışta tek kullanımlık `code` da eklenir.

Oturum token’ı ES256, ömrü **60 saniye**. Claim’ler: `iss` `https://api.tsoftapps.com`, `aud` önek, `exp` / `nbf`, `store_id`, `dest` (mağaza alanı), `sub` (paneli açan kullanıcı). `event` claim’i olan token oturum token’ı değildir; reddedin. Oturum token’ı Admin API’de kullanılmaz.

JWKS: `GET https://api.tsoftapps.com/api/integration/v3/apps/jwks.json` (`kid` ile eşleşir, birkaç dakika önbelleklenebilir).

Iframe başlığı:

```text
Content-Security-Policy: frame-ancestors https://tsoftpanel.com https://*.tsoftpanel.com https://paneltsoft.com https://*.paneltsoft.com https://<dest>
```

Üçüncü taraf çerezi iframe’de engellenebilir; oturumu çereze değil token’a bağlayın.

### Panel köprüsü

```bash
npm install @tekrom/tsoft-app-gate
```

veya `https://cdn.jsdelivr.net/npm/@tekrom/tsoft-app-gate@0.3/dist/tsoft-app-gate.min.js` (global `TSoftAppGate`).

```js
import { createApp, isEmbedded } from "@tekrom/tsoft-app-gate";

if (isEmbedded()) {
  const app = createApp();
  const token = await app.getSessionToken();
  const { ids, cancelled } = await app.pickResource({ type: "product", multiple: true });
  if (!cancelled) await app.toast(ids.length + " ürün seçildi");
  app.autoResize();
}
```

`pickResource` için `type` değerinin tam yazımı resmi sayfada verilmiyor; örnekteki `"product"` tahmindir, paket tiplerinden kontrol edin.

| Fonksiyon | İş |
| --- | --- |
| `isEmbedded()` | Panelde mi |
| `createApp()` | Köprü örneği. Yalnız `*.tsoftpanel.com`, `*.tsoftpanel.net`, `*.paneltsoft.com` içinde çalışır |
| `app.claims` | Token içeriği. Doğrulama sunucuda yapılır |
| `app.getSessionToken()` | Süresi dolmak üzereyse yenisini alır |
| `app.toast(mesaj, { variant })` | Bildirim; hata için `variant: "error"` |
| `app.confirm({ title, message, confirmText })` | Onay penceresi |
| `app.pickResource({ type, multiple })` | Ürün seçici, `read_products` ister. `{ ids, cancelled }` |
| `app.navigate.app(yol)` | Uygulama içi yolu panel adresine yansıtır |
| `app.navigate.panel(ad, id)` | `order`, `orders`, `product`, `products`, `apps` |
| `app.autoResize()` | Iframe yüksekliği |

Reddedilen çağrı `AppBridgeError` fırlatır; `code`: `missing_scope`, `invalid_route`, `timeout` … Eski `TSoftBridge` (`developer.tsoft.com.tr/app-bridge/v1/tsoft-app-bridge.js`) kaldırıldı. Mesaj protokolü: [tsoft-app-gate README](https://github.com/tekrom/tsoft-app-gate#readme).

## REST1’den geçiş

| Konu | Eski | Yeni |
| --- | --- | --- |
| Kimlik | Kurulumda önekle açılan `rest1` kullanıcısı | Kurulum kodu + mağazaya özel istemci |
| Adres | `https://<mağaza>/rest1/*` | `https://<mağaza>/api/v3/admin/2026-01/*` |
| Yetki | Paketteki web servis metot listesi | Kapsamlar |
| Kurulum bildirimi | Sunucuya kayıt çağrısı | `redirect_uri` / `app_url` üzerine `code` |
| Kaldırma | Sunucuya çağrı | `uninstall_url` + `app.uninstalled` JWT |
| Panel açılışı | `gateway.tsoftapps.com/api/go/app/<önek>`, `/api/app/get-token/<önek>` | `/apps/open/<önek>` iframe + oturum token’ı |
| Takip kodu | Uygulama ekler | Kurulumdaki ayar formu |

Adımlar: kullanılan REST1 metotlarını kapsamlara eşle (karşılığı yoksa T-SOFT’a bildir) → kaydı güncelle → test mağazasında dene → mağaza sahiplerini **İzinleri onayla** bağlantısına yönlendir. Geçiş sırasında kodu gelmiş mağazada Admin API, gelmemişte REST1 çalışır. Kapanış tarihi yayımlanmadı.
