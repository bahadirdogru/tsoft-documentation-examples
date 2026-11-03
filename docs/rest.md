---
title: Genel bakış
url: https://tsoft.bahadirdogru.com/rest/
---

# REST1 web servisi

Kaynaklar:

- Konsol kataloğu: `https://magaza.example/rest1/console`, `POST /rest1/ConsoleHelper/getApiDetails/tr` (19 Ekim 2026). 38 modül, 428 metot.
- Postman koleksiyonu: [Tsoft](https://documenter.getpostman.com/view/426050/2sBYHSygRy) (yayın 19 Ekim 2026). Açıklaması: olması gereken restapi kullanımı. 19 istek var. Kayıtlı örnek yanıt yok.

Bu dosya konsolun yayınladığı istek şemasını yazar. Konsol yanıt gövdesi vermiyorsa yanıt alanı uydurulmamıştır. Postman bölümü koleksiyondaki istek gövdelerini aktarır. 20 Ekim 2026 çağrıları aşağıda ayrı durur; o notlar bu mağazada görülen yanıttır. Genel T-Soft PDF’i bu mağazadaki `Cart` sınıfını ve `customer/login` metodunu içermez.

Vitrin istemcisi ayrı bir yüzeydir. 20 Ekim 2026’da [Storefront API](https://developer.tsoft.com.tr/storefront-api/genel-bakis) yolu `https://<domain>/api/v3/storefront/2026-01` dir. Bu depodaki özet [Storefront API](../developer/storefront-api.md) dosyasındadır. Admin API, uygulama platformu ve tema servisleri aynı tarihte geliştirici sitesinde 404 döner.

## Ortak kurallar

- Taban adres: `https://magaza.example/rest1/{modul}/{metot}/`
- `auth/login` yolu kullanıcı adını URL’ye koyar: `POST /rest1/auth/login/{user}` ve gövdede `pass`. Dönüşte `token`, `secretKey`, `expirationTime` beklenir; süre `expirationTime` ile sınırlıdır.
- Diğer metotlar web servis `token` değerini ister. Katalogdaki parametre listesinde `token` çoğu zaman ayrıca yazılmaz; konsol arayüzü onu her isteğe ekler.
- Yazma metotlarında asıl kayıt `data` içindedir ve JSON dizisidir.
- `url_param` tarzındaki alanlar yolun sonuna eklenir. `query` alanları POST veya GET gövdesindedir. Postman koleksiyonu bunları `multipart/form-data` alanları olarak gönderir. `data` alanı JSON dizi metnidir. `token` aynı gövdede ayrı alandır.
- Listeleme metotlarında sık görülen süzgeçler: `start`, `limit`, `columns`, `orderby`, `f`, `f2`. `f` / `f2` operatörleri: `startwith`, `endwith`, `equal`, `greater`, `smaller`, `between`, `contain`. Örnek: `Email | ornek@magaza.example | equal`.
- `alpha` ve `beta` konsolun olgunluk işaretidir. `yalnız destek kullanıcısı` olan metotlar normal web servis kullanıcısının menüsünde gizlenir (`supportUser = 1`).
- IP kısıtı, metot yetkisi ve lisans (örneğin telefonla üyelik) paneldeki web servis kullanıcısına bağlıdır. Katalogda olması, bu kullanıcının çağırabileceği anlamına gelmez.
- İstek `application/x-www-form-urlencoded` gövdesiyle geçti. `User-Agent` başlığı yokken Cloudflare HTTP 403 ve gövde `error code: 1010` döndü. Tarayıcı `User-Agent` ile aynı çağrı geçti.
- Ortak zarf: `success`, `data`, `message`, bazen `summary`. `message` dizi olur. Öğe alanları `type`, `code`, `index`, `id`, `subid`, `text`, `errorField`. `text` dizi olur. `type` 1 başarı, `type` 2 hatadır. `summary.totalRecordCount` kayıt sayısını string tutar.
- `success: true` ve `data: null` boş sonuçtur. Kayıt bulunamadı anlamına gelir; işlem hatası değildir.

## 20 Ekim 2026 canlı çağrı

Öğretmen aktarımı ve yüzde 35 grup fiyatı bu mağazada çağrıldı. Parola ve token buraya yazılmadı.

- `auth/login` form alanı `pass`. Dönüş `data[0]` içinde `userId`, `username`, `token`, `secretKey`, `expirationTime`, `limited`, `type`, `tableId`. Mesaj kodu `AUI001`, metin `Giriş yapıldı!`. `expirationTime` biçimi `GG-AA-YYYY SS:DD:SS`. 20 Ekim 2026 01:46 girişinin süresi 21 Ekim 2026 01:46 idi.
- `customer/getCustomerGroups` yalnız `token` ile döndü. Satır alanları `Id`, `Code`, `Name`, `IsVendor`. `ogretmenler` satırı `Id` `17`, `Name` `[Öğretmenler]`, `IsVendor` `1`. Mesaj kodu `GNI001`.
- `customer/getCustomers` süzgeci `Email | adres | equal` bilinen üyeyi döndürür. `f` alanı `CustomerGroupCode` olunca yanıt `Field CustomerGroupCode not found.` Grup listesi `CustomerGroupId | 17 | equal` ile geldi; `summary.totalRecordCount` `1362` idi. `FetchCustomerGroup=true` kayıtta `CustomerGroupCode`, `CustomerGroupId` ve `CustomerGroup` nesnesini doldurur. Tam kayıtta `Password` de vardır; `columns` ile dışarıda bırakılır.
- `customer/addCustomers` 10 haneli `5xxxxxxxxx` cep numarasını kabul etti. `CustomerGroupCode` `ogretmenler` okumada duruyordu. `Field2`, `Field3`, `Field4` yazıldığı gibi durdu. `Field1` boş kaldı. `Approval` metin `true` idi. Başarı kodu `CUI002`, metin `Müşteri başarıyla oluşturuldu!`. `message.id` müşteri kodu, `data` içinde `CustomerId` ve `MobileToken` var.
- Aynı e-posta varsa `addCustomers` güncellemez. Hata metni `Sistemde bu Email ile kayıt mevcut!` ve gerekirse `Sistemde bu CustomerCode ile kayıt mevcut!`. `errorField` `Email` ve `CustomerCode` olur. Kırk kayıtlık partide `success` false olsa da `CUI002` alan satırlar açılmış kaldı; parti geri alınmadı.
- Ziyaretçi grubundaki altı e-posta (`CustomerGroupCode` `TZ0`, kodlar `T1001`, `T1006`, `T1002`, `T1003`, `T1004`, `T1005`) `addCustomers` ile gruba geçmedi. E-posta süzgeci o turda onları döndürmedi. Boş süzgeç, adresin boş olduğu anlamına gelmez. Aynı gece `setCustomers` mevcut `T` koduyla çağrıldı. Gövde `CustomerGroupCode` `ogretmenler`, `CompanyName`, `Field2`, `Field3`, `Field4` taşıdı. Altısı da `ogretmenler` oldu. Ad, e-posta ve cep değişmedi. Başarı kodu `CUI001`, metin `Müşteri başarıyla güncellendi!`.
- `customer/setCustomers` gövdesi yalnız `CustomerCode` ve `CustomerGroupCode` iken yedi üyenin grubu `ogretmenler` oldu. İlk okumada ad, e-posta, cep ve firma aynı kaldı. Güncelleme kodu `CUI001`, oluşturma kodu `CUI002` dir.
- `product/updateCustomerGroupPrice` gövdesi `DiscountType` `1`, `Percentage` `-35`, `IsVisible` false, `CustomerGroupCode` `ogretmenler`. Başarı kodu `PRI019`. `message.id` ürün kodu, `subid` grup kodu. 1089 ürün yazıldı.
- Grup fiyatı `product/get` ile okunur: `CustomerGroupCode=ogretmenler` ve `FetchDiscountedPriceDetail=true`. `SellingPrice` raf fiyatı kalır. Grup satırı `DiscountedPrices` içindedir: `DiscountedPrice`, `DiscountedPriceVatIncluded`, `DiscountPercent` `-35`, `PriceType` `1`, `PriceTypeDescription` `Satis Üzerinden %`. Örnek: `ORNEK-001` raf `85`, grup `55.25`. Raf fiyatı `0` olan `ORNEK-002` için yüzde tabanı yoktu. Diğer 1088 ürün yüzde 35 ile uyuştu.

## Öğretmen senkronu için kullanılan ve bilinçli bırakılan uçlar

Başvuru sayfası sütunları: `basvuru_id`, `gonderim_zamani`, `ad`, `soyad`, `okul_adi`, `il`, `ilce`, `branslar`, `siniflar`, `telefon`, `eposta`, `whatsapp`, `instagram`, `x_hesabi`, `kvkk_onay`, `kaynak_url`, `user_agent`. Dolu başvuru 1610 satırdır. 984 satır boştur. 127 e-posta mükerrerdir.

### Üye yazma

`POST /rest1/customer/setCustomers/` e-posta ile tek çağrıda ekler veya günceller.

- `MatchWithEmail=true` ve `CustomerCode` gönderilmeden: e-posta kayıtlıysa günceller, değilse ekler.
- `MatchWithMobile=true` aynı işi `Mobile` ile yapar.
- `SearchInArchive=true` arşivdeki üyeyi de arar.
- `SendPasswordResetEmail=true` üyeye şifre sıfırlama e-postası gönderir. Öğretmen senkronu bunu göndermez.
- `data` alanları arasında `CustomerCode`, `Name`, `Surname`, `Email`, `Password`, `Phone`, `Mobile`, `City`, `Town`, `CompanyName`, `Field1`–`Field15`, `Approval`, `CustomerGroupCode` vardır. Bildirim alanları `IsEmailNotificationOn`, `IsSmsNotificationOn`, `IsPhoneCallNotificationOn` ayrıdır; KVKK onayı pazarlama izni sayılmaz.
- `POST /rest1/customer/addCustomers/` yalnız oluşturur. `SendPasswordResetEmail` burada da vardır.
- `POST /rest1/customer/getCustomerGroups/` grupları listeler. `f` ile ada göre süzülür. Öğretmenler grubunun web servis kodu grup adının kendisi olmayabilir.
- `POST /rest1/customer/setCustomerGroups/` grup yazar. Örnek alanlar: `Code`, `Name`, `IsVendor`.

Senkron eşlemesi: `CustomerCode` = `basvuru_id`, `Name` / `Surname` = `ad` / `soyad`, `Email` = `eposta`, `Mobile` = normalize telefon, `CompanyName` = `okul_adi`, `City` / `Town` = `il` / `ilce`, `Field1` = `branslar`, `Field2` = `siniflar`, `CustomerGroupCode` = Öğretmenler web servis kodu, `Approval` = true. Sosyal hesaplar ve `user_agent` gitmez. Yeni üyede rastgele parola üretilir ve sayfaya yazılmaz. Kayıtlı e-postada parola gönderilmez.

Postman koleksiyonu B2B üyeyi `f=Field1||notequal`, B2C üyeyi `f=Field1||equal` ile ayırır. `Field1` branşla doldurulursa o üye B2B süzgecine girer.

### Giriş linki

`POST /rest1/customer/login` parola istemez. `customerId` veya `customerCode` zorunludur, `loginRedirectUrl` opsiyoneldir. Konsol açıklaması: "Customer ID veya Code alanlarından birinin doldurulması zorunludur." Yanıtta dönen alanın adı ve linkin ömrü katalogda yoktur; sheet’e link yazmadan önce token ile tek deneme gerekir.

Aynı kalıp panel içindir: `POST /rest1/user/loginAsPanelAdmin` (`AdminId` veya `AdminCode`, `RedirectUrl`). Bu vitrin üyesi açmaz.

`customer/check` e-posta veya telefon artı parola ister ve kayıt varsa döner. `customer/forgotPassword` sıfırlama bağlantısını e-posta ile gönderir; bağlantının kendisini API döndürmez. Telefonda, lisans varsa, 6 haneli kod gider. `customer/forgotPasswordOtpReset` o kod ve yeni parola ile şifreyi değiştirir; açıklamasına göre başarılı işlemde oturum açılmaz.

`platform/login` platform uygulamaları içindir (`Email`, `Platform`, `Password`, isteğe bağlı `LoginType=otp`). `platform/connectLinker` `CustomerHash` ve `RedirectUrl` alır. İkisi de web servisten toplu öğretmen linki üretmek için katalogda anlatılmamıştır.

### Sepet

`cart/*` metotları alpha’dır.

- `cart/addToCart` gövdesi `data` dizisidir. Örnek satır alanları: `customer_id`, `cart_index`, `product_id`, `variant_id`, `count`, `personalization`. Yeni satırda `cart_index` `-1` gönderilir. `new=true` iken güncelleme `product_id` ile birlikte `cart_index` ister ve `count` sepetteki güncel adettir.
- `cart/getCart` yol parametresi `customer_id`. İsteğe bağlı: `new`, `mobile_app`, `fetch_product_detail`, `fetch_installment_list`, `image_limit`.
- `cart/removeAll` yol parametresi `customer_id`. `cart/removeItems` `data` ister.
- `cart/getAll` `UpdateDate` ve `Email` ile sepetleri listeler ve yalnız destek kullanıcısına açıktır.
- `customer/getCart` başka bir okuma ucudur: `CustomerCode`, `ProductCode` ve liste süzgeçleri.
- `link/setLinks` SEO alanlarıdır (`Type`, `TableId`, `Language`, `Title`, sitemap ve canonical). `link/setReferralLinks` örneği `Link` ve `RedirectLink` taşır. İkisi de üye sepeti linki değildir.

Üye başına kalıcı sepet URL’si katalogda yoktur. Doğrulanırsa birleşik kullanım: `cart/addToCart` ile ürün yaz, ardından `customer/login` ve `loginRedirectUrl` olarak sepet yolu ver. Ürün kimliği sayısal `product_id` ister.

`order2/createOrders` sepet değil sipariş açar. İsteğe bağlı `PaymentUrlFetch`, `PaymentUrlSendEmail`, `PaymentUrlSendSms` vardır. Yanıt şekli katalogda yoktur.

## Postman koleksiyonu

Kaynak: [Tsoft](https://documenter.getpostman.com/view/426050/2sBYHSygRy). Mağaza tabanı `https://magaza.example/rest1`. Değişkenler: `user_name`, `user_password`, `token`, `tendaysago`, `currentdate`. Koleksiyondaki parola ve T.C. kimlik numarası buraya yazılmadı.

Üç isteğin adı ile URL’si uyuşmuyor. Gövde istek adının anlattığı işi taşır; adres başka metoda gider:

| İstek adı | Gittiği uç | Not |
| --- | --- | --- |
| `getProducts` | `product/setProducts` | `setProducts` ile aynı `data`. Okuma ucu `product/getProducts`. |
| `getProductsCount` | `product/setProducts` | Aynı gövde. Sayım ucu `product/getProductTotal`; konsol ek parametre listelemiyor. |
| `setCustomerGroups` | `customer/setCustomers` | Grup kartı yazmaz. Üyenin vergi, firma ve grup alanlarını günceller. `data` metninde `RepresentativeCode` satırından sonra fazladan virgül var. Grup kartı ucu `customer/setCustomerGroups`. |

### `login`

`POST /rest1/auth/login/{{user_name}}`. Form alanı: `pass={{user_password}}`.

### `setCustomer`

`POST /rest1/customer/setCustomers`. Form alanları: `token`, `data`. Konsol örnek listesinde olmayan alan: `CustomerType` (`KURUMSAL`). Dolu örnekteki grup kodu `00`, temsilci kodu `ABD`, `Credibility` `1000`, `Country` `TR`, `Approval` ve bildirim alanları `"true"` metnidir.

```json
[
  {
    "CustomerCode": "12001-01-BM0007",
    "Name": "BMT AHMET BURAK",
    "Surname": "DOĞRU",
    "Email": "ornek@magaza.example",
    "Password": "",
    "Phone": "05550000000",
    "Mobile": "05550000000",
    "OfficePhone": "02120000000",
    "Address": "SULTANAHMET",
    "Postcode": "34122",
    "City": "ISTANBUL",
    "Town": "FATIH",
    "Country": "TR",
    "TaxOffice": "SAHIS",
    "TaxNo": "",
    "CompanyName": "BMT-AHMET BURAK DOĞRU",
    "IdentityNo": "",
    "CustomerType": "KURUMSAL",
    "Field1": "",
    "Field2": "",
    "Field3": "",
    "Field4": "",
    "Field5": "",
    "Field6": "",
    "Field7": "",
    "Field8": "",
    "Field9": "",
    "Field10": "",
    "Field11": "",
    "Field12": "",
    "Field13": "",
    "Field14": "",
    "Field15": "",
    "Approval": "true",
    "IsEmailNotificationOn": "true",
    "IsSmsNotificationOn": "true",
    "IsPhoneCallNotificationOn": "true",
    "CustomerGroupCode": "00",
    "RepresentativeCode": "ABD",
    "Credibility": "1000"
  }
]
```

### `setCredibility`

Aynı uç. Yalnız `CustomerCode` ve `Credibility` gider. Örnekte ikisi `12001-01-BM0007` ve `1000`.

### `setCustomerGroups` adlı istek

Aynı uç. Gönderilen alanlar: `CustomerCode`, `TaxOffice`, `TaxNo`, `CompanyName`, `IdentityNo`, `CustomerType`, `CustomerGroupCode`, `RepresentativeCode`.

### `getCustomersB2B`, `getCustomersB2C`, `getCustomersID`

`POST /rest1/customer/getCustomers`. Üçünde `token` ve `FetchCustomerGroup=true`.

| İstek | Ek alan |
| --- | --- |
| `getCustomersB2B` | `f=Field1\|\|notequal` |
| `getCustomersB2C` | `f=Field1\|\|equal` |
| `getCustomersID` | `f=Field1\|\|notequal`, `columns=CustomerId,CustomerCode,CompanyName` |

`notequal` konsolun `f` operatör listesinde yoktur. Konsol örneği tek boru ve üç parçadır (`alan \| değer \| operatör`). Bu üç istek çift boru kullanır ve değer parçasını boş bırakır.

### `getCustomerGroups`

`POST /rest1/customer/getCustomerGroups`. Yalnız `token`.

### `setProducts`

`POST /rest1/product/setProducts`. `data`, konsoldaki `T582` örneğinin kısa halidir. Konsol alan listesinde olmayan anahtar: `SeoKeywords` (koleksiyonda boş).

### `updateCustomerGroupPrice`

`POST /rest1/product/updateCustomerGroupPrice`.

```json
[
  {
    "ProductCode": "15201-ICA0001",
    "CustomerGroupCode": "01",
    "DiscountType": "1",
    "Percentage": "-10",
    "IsVisible": true,
    "OnSale": true
  }
]
```

`DiscountType=1` satış fiyatı üzerinden orandır. `Percentage` negatif olduğu için fiyat düşer.

### `getOrdersB2C` ve `getOrdersB2B`

`POST /rest1/order2/getOrders`. Ortak alanlar: `token`, `OrderDateTimeStart={{tendaysago}}`, `OrderStatusId=3`, `FetchCustomerGroupInfo=true`, `orderby=OrderDate DESC`, `FetchAdditionalCCNumber=true`. `UpdateDateTimeStart`, `UpdateDateTimeEnd`, `OrderCode`, `IsTransferred`, `Archive`, `CustomerGroupCode` boş gönderilir.

| İstek | Ayrılan alan |
| --- | --- |
| `getOrdersB2C` | `OrderDateTimeEnd={{currentdate}}`, `IsVendor=false` |
| `getOrdersB2B` | `OrderDateTimeEnd=2024-05-19`, `IsVendor=true` |

### `getOrderStatusList`

`POST /rest1/order2/getOrderStatusList`. Koleksiyon `data` içinde `OrderCode` (`SP08034`) gönderir. Konsol bu metot için `data` listelemez. Konsol alanları adı boş bir sorgu alanı, `FetchOrderCount` ve `FetchWithPassive` parametreleridir.

### `updateOrderStatusAsCargoReady`

`POST /rest1/order2/updateOrderStatusAsCargoReady`. `data` konsol örneğiyle aynıdır: `OrderCode` `SP08034`.

### `setAddress`

`POST /rest1/customer/address/`. `customer_id` ve `type` bu istekte kapalıdır. Kayıt `data` içindedir. Konsol örneğinde olmayan alanlar: `type`, `ws_address_code`, `partner`, `partnerparams`.

```json
[
  {
    "customer_id": 33015,
    "ws_address_code": "12001-01-GU1125",
    "title": "Farkli Teslimat",
    "type": 0,
    "country_code": "TR",
    "city_code": "43",
    "town_code": "621",
    "address": "DURAK MAH. TAHSİN BURUK CAD. AKAY İŞ MERKEZİ NO:101",
    "address_id": 0,
    "also_invoice": 1,
    "company_name": "GÜVEN KIRTASİYE - OZAN TUNCEL (TAVŞANLI FARKLI TESLİMAT)",
    "district": "TAVSANLI",
    "name": "GÜVEN KIRTASİYE - OZAN TUNCEL (TAVŞANLI FARKLI TESLİMAT)",
    "invoice_type": 0,
    "mobile_phone": "905555555555",
    "nationality": 0,
    "other_phone": "",
    "tax_number": "",
    "tax_office": "",
    "zip": "43000",
    "has_e_invoice": 0,
    "partner": "Netsis",
    "partnerparams": "12001-01-GU1125"
  }
]
```

`type` 0 teslimat adresidir. `address_id` 0 yeni kayıttır. `invoice_type` 0 şahıstır. `partner` `Netsis`, `partnerparams` cari kodudur.

### `getAddress`

`POST /rest1/customer/address/`. `customer_id=30708`. `type` kapalıdır. İstek ayrıca bir `data` dizisi taşır; dizi konsoldaki iş adresi örneğine yakındır (`address_id` 0, `town` `Üsküdar`).

### `getAddress2`

`POST /rest1/customer/getAddress`. `CustomerCode=12001-01-BM0007`. `CustomerId` kapalıdır.

## Modül özeti

| Modül | Metot | Not |
| --- | ---: | --- |
| [Auth](auth.md) | 3 | Web servis kullanıcısının token alması. Vitrin üyesi girişi değildir. |
| [BranchOffice](branchoffice.md) | 5 | Mağaza / şube kayıtlarını okuma ve yazma. |
| [Brand](brand.md) | 8 | Marka listeleme, yazma, dil ve görsel. |
| [Campaign](campaign.md) | 22 | Kampanya, koşul, promosyon ve hediye kodu. Konsolda hepsi alpha. |
| [Cart](cart.md) | 7 | Üye sepetine ürün yazma ve okuma. Konsolda hepsi alpha. Ayrı sepet linki alanı yok. |
| [Catalog](catalog.md) | 5 | Varyant teması ve katalog görseli. |
| [Category](category.md) | 8 | Kategori ağacı, listeleme ve yazma. |
| [Content](content.md) | 1 | İçerik kaydı okuma. |
| [Customer](customer.md) | 34 | Üye, adres, grup, giriş linki, sepet okuma, istek listesi ve arşiv. |
| [Filter](filter.md) | 7 | Yeni filtre yapısı: grup, seçenek ve ürüne bağlama. |
| [FundMovement](fundmovement.md) | 10 | Cari hareket okuma, yazma ve silme. |
| [Payment](payment.md) | 7 | Taksit, havale, BIN ve POS parametreleri. |
| [Mobile](mobile.md) | 25 | Mobil uygulama oturumu (MobileToken) ile sipariş, favori, alarm, adres. |
| [Model](model.md) | 9 | Model kayıtları. |
| [Order2](order2.md) | 26 | Sipariş oluşturma ve durum güncelleme. Eski sipariş sınıfı. |
| [Order](order.md) | 30 | Güncel sipariş okuma, arşiv, iade, kargo ve sevkiyat. |
| [Personalization](personalization.md) | 1 | Ürün kişiselleştirme formları. |
| [TrackingCode](trackingcode.md) | 3 | İzleme kodları. |
| [Product](product.md) | 70 | Ürün oluşturma, stok, fiyat, görsel, etiket ve dil. |
| [Setting](setting.md) | 12 | Kod güncelleme ve önbellek silme. |
| [SubProduct](subproduct.md) | 20 | Alt ürün, özellik ve stok/fiyat. |
| [Supplier](supplier.md) | 10 | Tedarikçi ve mağaza görselleri. |
| [Ticket](ticket.md) | 9 | Destek talebi ve iletişim mesajı. |
| [User](user.md) | 7 | Yönetim paneli ve web servis kullanıcıları. Panele yönetici olarak giriş linki. |
| [News](news.md) | 2 | Haber kayıtları. |
| [Hopi](hopi.md) | 3 | Hopi kampanya oturumu. |
| [Zubizu](zubizu.md) | 6 | Zubizu kampanya oturumu. |
| [Adapter](adapter.md) | 2 | Sendheap ve Nildesk aktarımı. |
| [Showcase](showcase.md) | 3 | Vitrin yerleşimi. |
| [Point](point.md) | 2 | Üye puanı ekleme veya düşürme. |
| [Cargo](cargo.md) | 1 | Kargo gönderi logu. |
| [Widget](widget.md) | 2 | Widget yazma ve silme. |
| [Platform](platform.md) | 47 | Mobil/platform oturumu (CustomerHash): üye, sepet, sipariş, adres, iade. |
| [Notification](notification.md) | 5 | Push cihaz kaydı ve bildirim. |
| [HtmlBlock](htmlblock.md) | 3 | HTML blok. Konsolda üçü de support-only. |
| [Link](link.md) | 4 | SEO, sitemap ve yönlendirme linki. Sepet linki değildir. |
| [Segment](segment.md) | 7 | Üye segmenti oluşturma ve üyeye atama. |
| [Routing](routing.md) | 2 | Servis yönlendirme. |

## Metot kataloğu

Her modül ayrı sayfadadır. Zorunluluk, konsolun `required` alanıdır. Boş açıklama, konsolun o metot için metin vermediği anlamına gelir. Hata ve mesaj kodları [Hatalar ve mesaj kodları](hatalar.md) sayfasındadır.
