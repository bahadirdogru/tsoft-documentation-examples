---
title: Giriş ve iki adımlı doğrulama
url: https://tsoft.bahadirdogru.com/admin-api/oturum/
---

# Giriş ve iki adımlı doğrulama

Panel iç API'si (`/api/v3/admin/*`) bir panel kullanıcısının oturum token'ıyla çalışır. Bu sayfa o token'ın nasıl alındığını anlatır: parola girişi, iki adımlı doğrulama, hangi token'ın hangi uçta geçtiği, süresi ve yenilenmesi. Genel kurallar [Admin API v3](README.md) sayfasındadır.

Kaynak: panel `v5.0.317` ön yüzünün giriş ekranı kodu ve canlı bir mağazada iki adımlı doğrulamalı (SMS) bir panel kullanıcısıyla yapılan giriş (11 Kasım 2026). İstek ve yanıtların yalnız alan adları ve tipleri kaydedildi. Değerler uydurmadır.

## Özet

| Adım | Çağrı | Sonuç |
| --- | --- | --- |
| 1. Parola | `POST /api/v3/admin/auth/login` | Doğrulama yoksa token. Varsa hata koduyla bir **doğrulama isteği** (`data.token`, `data.route`). |
| 2. Yöntem seçimi | `POST /api/v3/admin/auth/oauth/two-factor` | Yöntem değişir (SMS, e-posta…), kod gönderilir. Yeni doğrulama isteği döner. |
| 3. Kod | `POST <data.route.uri>` | Kod doğruysa token. |
| Yenileme | `POST /api/v3/admin/auth/oauth/refresh` | Yalnız giriş `refreshToken` verdiyse. Parolayla girişte gelmedi. |

Bütün çağrılar **mağaza alan adına** gider (`https://www.magaza.example/...`), panel alan adına (`*.tsoftpanel.com`) değil. Başlık: `Accept: application/json`, gövdeli isteklerde `Content-Type: application/json`.

## 1. Parola girişi

```http
POST /api/v3/admin/auth/login HTTP/1.1
Host: www.magaza.example
Accept: application/json
Content-Type: application/json

{"domain": "www.magaza.example", "email": "panel@magaza.example", "password": "…"}
```

- `domain` mağaza alan adıdır, şemasız (`www.magaza.example`).
- Panel giriş ekranı `Accept-Language` da gönderir (`tr`); hata metinleri bu dile göre gelir.
- **429** çok fazla deneme demektir.

### Doğrulama yoksa

Cevap `200` ve aşağıdaki [oturum gövdesi](#oturum-gövdesi)dir.

### İki adımlı doğrulama açıksa

Cevap bir **hata kodu**yla gelir (panel kodu bunu `catch` dalında okur), ama gövdede `status: true` ve bir doğrulama isteği vardır:

```json
{
  "status": true,
  "attributes": {
    "two_factor_must_validate": { "args": [ { "options": ["2fa_qr", "2fa_sms", "2fa_email", "2fa_notification"] } ] }
  },
  "data": {
    "token": "<doğrulama token'ı>",
    "route": { "type": "2fa_email", "uri": "https://www.magaza.example/api/v3/admin/auth/two-factor" }
  }
}
```

| Alan | Anlamı |
| --- | --- |
| `data.token` | Bu girişe ait kısa ömürlü doğrulama token'ı. Panel token'ı değildir. |
| `data.route.type` | Varsayılan yöntem. Kod bu yöntemle gönderilmiştir. |
| `data.route.uri` | Kodun gönderileceği adres. Mutlak ya da göreli gelebilir; mağaza alan adında çözün. |
| `attributes.two_factor_must_validate.args[0].options` | Kullanıcının seçebileceği yöntemler. |

İki adımlı doğrulamayı ayırt etmenin yolu HTTP kodu değil, gövdede `data.token` ve `data.route.uri` bulunmasıdır. Yanlış parola başka bir hata gövdesi (`message`) döner; **401** cevabında panel "T-Soft 360 ile giriş" ipucu gösterir.

## 2. Yöntem seçmek ve kodu göndermek

Yöntemler:

| `type` | Kod nereden gelir |
| --- | --- |
| `2fa_qr` | Doğrulayıcı uygulama (TOTP). Gönderim yok, kod uygulamada. |
| `2fa_sms` | SMS |
| `2fa_email` | E-posta |
| `2fa_notification` | T-Soft mobil uygulamasına bildirim; kullanıcı onaylar, kod yazılmaz |

Varsayılan yöntem dışında bir yöntem için:

```http
POST /api/v3/admin/auth/oauth/two-factor HTTP/1.1
Host: www.magaza.example
Accept: application/json
Content-Type: application/json

{"type": "2fa_sms", "token": "<doğrulama token'ı>", "code": ""}
```

Cevap yine hata koduyla gelir ve yeni bir doğrulama isteği taşır: `data.token`, `data.route.type`, `data.route.uri`. **Bundan sonra yeni `token` ve `uri` kullanılır**; eskisi geçersizdir. T-Soft kodu bu çağrıyla gönderir. Aynı yöntem için kısa sürede yeniden istemek **429** döner; panel "daha önce gönderilen kodu girin" der.

## 3. Kodu doğrulamak

Kod 6 hanedir.

```http
POST <data.route.uri> HTTP/1.1
Host: www.magaza.example
Accept: application/json
Content-Type: application/json

{"code": "123456", "method": "2fa_sms", "token": "<doğrulama token'ı>"}
```

- Kod doğruysa `status: true` ve [oturum gövdesi](#oturum-gövdesi) döner.
- Kod yanlışsa hata kodu ve `message`. Panel her yanlış denemeyi sayar.

`2fa_notification` yönteminde kod yazılmaz. Panel 5 saniyede bir aynı `uri`'ye `{"token", "type", "code"}` gönderir ve 120 saniye bekler; kullanıcı mobil uygulamada onaylayınca cevap oturum gövdesi olur.

## Oturum gövdesi

Parola girişi, kod doğrulama ve yenileme aynı yapıyı döner:

```json
{
  "status": true,
  "data": {
    "legacy": {
      "bearer": "<eski panel token'ı>",
      "exp_at": 1794400000,
      "issued_at": 1794313600,
      "email": "panel@magaza.example",
      "isSupportUser": false,
      "isSuperAdmin": false
    },
    "token": {
      "plainTextToken": "<panel token'ı>",
      "accessToken": { "expires_at": "2026-11-12T09:00:00.000000Z" }
    },
    "user": {
      "id": 1, "name": "…", "surname": "…", "email": "panel@magaza.example",
      "panelType": "admin", "supplierId": null,
      "hasTwoFactor": true, "hasRestrictedAccess": false,
      "tsoft360TwoFactorSetupUrl": null, "sessionKind": "password", "version": "v5"
    }
  }
}
```

Giriş T-Soft 360 (SSO) ile yapıldıysa gövdede ayrıca `refreshToken` ve `refreshTokenExpiresAt` bulunur.

### Hangi token nerede geçer

| Token | Nerede | Not |
| --- | --- | --- |
| `data.token.plainTextToken` | `/api/v3/admin/*` panel iç uçları | `Authorization: Bearer <plainTextToken>`. Panel ön yüzü bunu `laraToken` diye anar. |
| `data.legacy.bearer` | Eski panel (`/Y`) ve eski uçlar | Panel iç uçlarında **401** `{"message":"Unauthenticated."}` döner (ziyaretçi raporunda denendi). Kullanıcının panel sürümü `v4` ise ön yüz `https://<mağaza>/Y?token=<legacy.bearer>` adresine yönlenir. |

### Süre

- `token.accessToken.expires_at` ISO tarihidir. Gözlenen ömür **yaklaşık 24 saat**.
- `legacy.exp_at` ve `legacy.issued_at` unix saniyesidir.
- Parolayla girişte (`user.sessionKind: "password"`) **yenileme token'ı gelmedi**. Süre dolunca yeniden giriş gerekir; iki adımlı doğrulamalı kullanıcıda bu her gün yeni bir kod demektir.

## Yenileme

Panel ön yüzü yenilemeyi yalnız tarayıcı deposunda `refresh_token`, `refresh_ttl`, `pat_ttl` ve `device_id` varsa dener:

```http
POST /api/v3/admin/auth/oauth/refresh HTTP/1.1
Host: www.magaza.example
Accept: application/json
Content-Type: application/json
X-Device-Id: <cihaz kimliği>

{"refreshToken": "<refresh token>"}
```

Cevap oturum gövdesidir; yeni `refreshToken` ve `refreshTokenExpiresAt` ile gelir. `refresh_ttl` geçmişse panel oturumu siler ve girişe döner.

## Tarayıcı deposu

Panel ön yüzü oturumu `localStorage` içinde `t-softpanel-` önekiyle tutar:

| Anahtar | İçerik |
| --- | --- |
| `t-softpanel-auth` | Oturum gövdesinin `data` kısmı: `legacy`, `token`, `user` (ve iki adımda `otp_token`) |
| `t-softpanel-auth:token_expires_at` | `token.accessToken.expires_at` |
| `t-softpanel-auth:refresh_token`, `:refresh_ttl`, `:pat_ttl`, `:device_id` | Yalnız yenilenebilir oturumda |
| `t-softpanel-domain` | Mağaza alan adı, şemasız |
| `t-softpanel-panel-version` | `v5` ya da `v4` |

Bu değerler kişiseldir. Kodda, depoda, ekran görüntüsünde ve paylaşılan belgede tutulmaz.

## Sunucudan giriş

Panel iç API'sini bir sunucudan kullanacaksanız:

1. Mümkünse ayrı bir panel kullanıcısı açın ve rolüne yalnız gereken izinleri verin (ör. ziyaretçi raporları için `analytics:report:read`).
2. Parola girişini yapın. Doğrulama isteği gelirse yöntemi seçip kodu kullanıcıdan alın; doğrulama isteğini (token, tür, uri) kod gelene kadar sunucuda saklayın, birkaç dakikadan uzun tutmayın.
3. `plainTextToken`'ı ve `expires_at`'i saklayın. Süre dolana kadar yeniden giriş yapmayın; her girişte yeni kod gerekir.
4. `uri` alanını mağaza alan adında çözün ve başka bir alan adına kod göndermeyin.
5. **401** gelirse token'ı silin; yeniden giriş kullanıcıdan yeni kod ister. Arka planda kendiliğinden SMS göndermeyin.

Çalışan bir örnek: [Panel girişi (Python)](../examples/python/panel_login.py).

## Görülen ama denenmeyen akışlar

- **SMS ile e-posta doğrulamasını aşmak.** Giriş hatası `data.availableMethods` içinde `sms` taşıyorsa ekran "e-postanıza erişemiyorsanız" düğmesi gösterir. Düğme `POST /api/v3/admin/auth/oauth/two-factor/sms-validation` çağrısını hata gövdesindeki `data.bearer` ile (`Authorization: Bearer …`) yapar ve `data.token` alır; kod `GET /api/v3/admin/auth/token-validate?token=<token>&code=<kod>` ile denetlenir, cevap `data.isValid`.
- **T-Soft 360 (SSO).** OAuth yetkilendirme kodu akışı (PKCE). Panel bu yolla gelen oturumu `oauth/refresh` ile yeniler.
- **`auth/login-by-jwt`**, **`auth/connect`**: panel kodunda adı geçiyor, gövdesi incelenmedi.
