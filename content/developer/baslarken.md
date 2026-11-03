---
title: Başlarken
description: T-SOFT360 hesabı, partner paneli, tsoft-cli
---

# Başlarken

Resmi sayfalar: [Genel bakış](https://developer.tsoft.com.tr/baslarken/genel-bakis), [Hızlı başlangıç](https://developer.tsoft.com.tr/baslarken/hizli-baslangic). Ayrıntılı CLI adımları [Kurulum](https://developer.tsoft.com.tr/tema-gelistirme/kurulum) sayfasındadır.

## Dört yüzey

Resmi genel bakış geliştirmeyi dört yüzeye ayırır:

| Yüzey | İş | 20 Ekim 2026 |
| --- | --- | --- |
| Admin API | Ürün, sipariş, müşteri ve stok okuma/yazma | Resmi referans kapalı. OAuth ve kapsamlar [Uygulama geliştirme](uygulama.md) sayfasında; panelin iç uçları [Admin API v3](../admin-api/README.md). |
| Tema motoru | Şablon ve section ile vitrin | Açık. Bkz. [tema.md](tema.md). |
| Uygulama platformu | OAuth, panele gömülü uygulama, App Store | Açık (3 Kasım 2026). Bkz. [uygulama.md](uygulama.md). |
| Webhook | Olay bildirimi | Uygulama bölümünde 15 olay. Bkz. [Webhook](uygulama.md#webhook). |

## İlk tema

Node.js **20.19.0** veya üzeri gerekir.

```bash
npm install -g tsoft-cli
tsoft login
tsoft theme create
cd example-tsoft-biz/my-theme
tsoft theme dev
tsoft theme push
```

`tsoft login` tarayıcıda Login360 açar. Callback `localhost:8046` üzerindedir. Akış OAuth2 PKCE kullanır. Oturum kullanıcı ana dizininde durur; tema klasörüne kimlik yazılmaz. Mağaza oturumu yaklaşık bir aydır.

İki mağaza yolu vardır:

- Kendi demo mağaza: partner panelinde Mağazalar → mağaza oluştur.
- Müşteri mağazası: mağaza sahibi Ayarlar → Kullanıcılar ve İzinler → İş Ortakları üzerinden davet kodu üretir. Partner panelinde Mağazalar → Mağaza erişimi talep et formuna mağaza URL’si, kod ve izin (tema için genelde Tasarım) yazılır.

İlk girişte organizasyon kurulumu bitmeden mağaza ve tema adımlarına geçilmez. Panel bölümleri: Anasayfa, Mağazalar, Temalar.

CLI dili varsayılan Türkçedir. İngilizce için `TSOFT_LANG=en`.

Mevcut bir temayı temel almak için `tsoft theme fork` kullanılır. Komutların hangi dizinden çalıştığı [Çalışma dizini](https://developer.tsoft.com.tr/tema-gelistirme/calisma-dizini) sayfasındadır.
