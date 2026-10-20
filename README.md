# T-Soft dokümantasyon ve örnekler

T-Soft vitrin blokları, REST1 çağrıları ve [geliştirici platformu](https://developer.tsoft.com.tr/) notları. Mağaza adresi, web servis parolası, üye listesi ve sipariş verisi yoktur.

## İçerik

- [developer](developer/README.md) — 20 Ekim 2026 platform özeti: Başlarken, Twig tema motoru, Storefront API `2026-01`
- [rest/tsoft.rest.md](rest/tsoft.rest.md) — REST1 metot kataloğu ve canlı çağrıda görülen yanıt biçimleri
- [examples/python](examples/python) — giriş, üye ekleme ve grup fiyatı okuma
- [examples/apps-script/Code.gs](examples/apps-script/Code.gs) — başvuru sayfasından üye senkronu
- [theme](theme) — eski blok HTML, şablon ve kısaltılmış değişken örnekleri

Tema örnekleri tsoft-notes notlarından türetilmiştir ve GPL-3.0 ile lisanslıdır. Ayrıntı [LICENSE](LICENSE) dosyasındadır.

## GitHub Pages

Depo ayarlarında Pages kaynağını **Deploy from a branch** ve klasörü **/docs** seçin. Açılış sayfası [docs/index.html](docs/index.html) olur.

## Örnek çalıştırma

```bash
cd examples/python
cp .env.example .env
python3 add_customer.py
python3 check_group_price.py ORNEK-001
```

`.env` içine mağaza adresi, web servis kullanıcısı ve parolası yazılır. Bu dosya depoya konmaz.
