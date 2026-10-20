# T-Soft REST1 notları

Kaynaklar:

- Konsol kataloğu: `https://magaza.example/rest1/console`, `POST /rest1/ConsoleHelper/getApiDetails/tr` (19 Ekim 2026). 38 modül, 428 metot.
- Postman koleksiyonu: [Tsoft](https://documenter.getpostman.com/view/426050/2sBYHSygRy) (yayın 19 Ekim 2026). Açıklaması: olması gereken restapi kullanımı. 19 istek var. Kayıtlı örnek yanıt yok.

Bu dosya konsolun yayınladığı istek şemasını yazar. Konsol yanıt gövdesi vermiyorsa yanıt alanı uydurulmamıştır. Postman bölümü koleksiyondaki istek gövdelerini aktarır. 20 Ekim 2026 çağrıları aşağıda ayrı durur; o notlar bu mağazada görülen yanıttır. Genel T-Soft PDF’i bu mağazadaki `Cart` sınıfını ve `customer/login` metodunu içermez.

Vitrin istemcisi ayrı bir yüzeydir. 20 Ekim 2026’da [Storefront API](https://developer.tsoft.com.tr/storefront-api/genel-bakis) yolu `https://<domain>/api/v3/storefront/2026-01` dir. Bu depodaki özet [developer/storefront-api.md](../developer/storefront-api.md) dosyasındadır. Admin API, uygulama platformu ve tema servisleri aynı tarihte geliştirici sitesinde 404 döner.

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
    "OfficePhone": "02125142828",
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
| Auth | 3 | Web servis kullanıcısının token alması. Vitrin üyesi girişi değildir. |
| BranchOffice | 5 | Mağaza / şube kayıtlarını okuma ve yazma. |
| Brand | 8 | Marka listeleme, yazma, dil ve görsel. |
| Campaign | 22 | Kampanya, koşul, promosyon ve hediye kodu. Konsolda hepsi alpha. |
| Cart | 7 | Üye sepetine ürün yazma ve okuma. Konsolda hepsi alpha. Ayrı sepet linki alanı yok. |
| Catalog | 5 | Varyant teması ve katalog görseli. |
| Category | 8 | Kategori ağacı, listeleme ve yazma. |
| Content | 1 | İçerik kaydı okuma. |
| Customer | 34 | Üye, adres, grup, giriş linki, sepet okuma, istek listesi ve arşiv. |
| Filter | 7 | Yeni filtre yapısı: grup, seçenek ve ürüne bağlama. |
| FundMovement | 10 | Cari hareket okuma, yazma ve silme. |
| Payment | 7 | Taksit, havale, BIN ve POS parametreleri. |
| Mobile | 25 | Mobil uygulama oturumu (MobileToken) ile sipariş, favori, alarm, adres. |
| Model | 9 | Model kayıtları. |
| Order2 | 26 | Sipariş oluşturma ve durum güncelleme. Eski sipariş sınıfı. |
| Order | 30 | Güncel sipariş okuma, arşiv, iade, kargo ve sevkiyat. |
| Personalization | 1 | Ürün kişiselleştirme formları. |
| TrackingCode | 3 | İzleme kodları. |
| Product | 70 | Ürün oluşturma, stok, fiyat, görsel, etiket ve dil. |
| Setting | 12 | Kod güncelleme ve önbellek silme. |
| SubProduct | 20 | Alt ürün, özellik ve stok/fiyat. |
| Supplier | 10 | Tedarikçi ve mağaza görselleri. |
| Ticket | 9 | Destek talebi ve iletişim mesajı. |
| User | 7 | Yönetim paneli ve web servis kullanıcıları. Panele yönetici olarak giriş linki. |
| News | 2 | Haber kayıtları. |
| Hopi | 3 | Hopi kampanya oturumu. |
| Zubizu | 6 | Zubizu kampanya oturumu. |
| Adapter | 2 | Sendheap ve Nildesk aktarımı. |
| Showcase | 3 | Vitrin yerleşimi. |
| Point | 2 | Üye puanı ekleme veya düşürme. |
| Cargo | 1 | Kargo gönderi logu. |
| Widget | 2 | Widget yazma ve silme. |
| Platform | 47 | Mobil/platform oturumu (CustomerHash): üye, sepet, sipariş, adres, iade. |
| Notification | 5 | Push cihaz kaydı ve bildirim. |
| HtmlBlock | 3 | HTML blok. Konsolda üçü de support-only. |
| Link | 4 | SEO, sitemap ve yönlendirme linki. Sepet linki değildir. |
| Segment | 7 | Üye segmenti oluşturma ve üyeye atama. |
| Routing | 2 | Servis yönlendirme. |

## Metot kataloğu

Zorunluluk, konsolun `required` alanıdır. Boş açıklama, konsolun o metot için metin vermediği anlamına gelir.

## Auth

Web servis kullanıcısının token alması. Vitrin üyesi girişi değildir.

### `auth/isLogin`

`POST https://magaza.example/rest1/auth/isLogin/`

Kullanıcının servise erişim yetkisinin olup olmadığını kontrol eder.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `language` | query | str | evet | Kullanıcı dilini değiştirmek için bir değer gönderebilirsiniz. Örn; en, tr |
| `currency` | query | str | evet | Giriş yapmış üyenin para birimini değiştirmek için bir değer gönderebilirsiniz. Örn; TL, USD |

### `auth/login`

`POST https://magaza.example/rest1/auth/login/`

Kullanıcının kimliğini doğrular. Kullanıcıya servisi kullanım yetkisini veren tokeni ve diğer kullanıcı verilerini döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `user` | url_param | str | evet | Kullanıcı adı |
| `pass` | query | pass | evet | Kullanıcı şifresi |
| `getAll` | query | bool | hayır | Kullnıcının bütün verisini çek. |
| `setting` | query | str | hayır |  |
| `mobileSetting` | query | bool | hayır |  |
| `mobileContact` | query | bool | hayır |  |

Postman `login` isteği `pass` alanını form-data olarak `POST /rest1/auth/login/{{user_name}}` yoluna gönderir.

20 Ekim 2026 çağrısında `application/x-www-form-urlencoded` gövde geçti. Yanıt şekli ve `expirationTime` biçimi [canlı çağrı](#20-ekim-2026-canlı-çağrı) bölümündedir.

### `auth/logout`

`POST https://magaza.example/rest1/auth/logout/`

Kullanıcının servise erişim yetkisini sonlandırır.

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## BranchOffice

Mağaza / şube kayıtlarını okuma ve yazma.

### `branchOffice/getBranchOfficeByCode`

`POST https://magaza.example/rest1/branchOffice/getBranchOfficeByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `BranchOfficeCode` | url_param | str | evet |  |

### `branchOffice/getBranchOfficeById`

`POST https://magaza.example/rest1/branchOffice/getBranchOfficeById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `BranchOfficeId` | url_param | int | evet |  |

### `branchOffice/getBranchOfficeByName`

`POST https://magaza.example/rest1/branchOffice/getBranchOfficeByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `BranchOfficeName` | url_param | str | evet |  |

### `branchOffice/getBranchOffices`

`POST https://magaza.example/rest1/branchOffice/getBranchOffices/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `IsActive` | query | bool | hayır | Sadece aktif mağazaların getirilmesi için bu alanı şeçili olarak göndermeniz gerekli |
| `f` | query | text | hayır |  |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `orderby` | query | str | hayır | Örn: BranchOfficeId DESC |

### `branchOffice/setBranchOffices`

`POST https://magaza.example/rest1/branchOffice/setBranchOffices/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `BranchOfficeCode`, `BranchOfficeName`, `BranchOfficeGroupCode`, `IsActive`, `Address`, `Country`, `City`, `District`, `Neighbourhood`, `Tel1`, `Fax`, `Email`, `ListNo`, `Latitude`, `Longitude`, `IframeEmbed`, `Additional1`, `Additional2`, `Additional3`.
```json
[
  {
    "BranchOfficeCode": "T2",
    "BranchOfficeName": "Harbiye",
    "BranchOfficeGroupCode": "T1",
    "IsActive": "1",
    "Address": "",
    "Country": "",
    "City": "",
    "District": "Şişli",
    "Neighbourhood": "Harbiye",
    "Tel1": "",
    "Fax": "",
    "Email": "",
    "ListNo": "",
    "Latitude": "",
    "Longitude": "",
    "IframeEmbed": "",
    "Additional1": "",
    "Additional2": "",
    "Additional3": ""
  }
]
```

## Brand

Marka listeleme, yazma, dil ve görsel.

### `brand/getBrandById`

`POST https://magaza.example/rest1/brand/getBrandById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `id` | url_param | int | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

### `brand/getBrandByName`

`POST https://magaza.example/rest1/brand/getBrandByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `name` | url_param | str | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

### `brand/getBrands`

`POST https://magaza.example/rest1/brand/getBrands/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

### `brand/setBrands`

`POST https://magaza.example/rest1/brand/setBrands/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | BrandId girilmediği durumda BrandName isminde veri varsa bu veriyi güncellemektedi.   BrandName güncellenmek istendiği durumda BrandId girilmesi zorunludur.  BrandName benzersiz olmak zorundadır. Bu yüzden BrandName parametresine verilen değer ile aynı isimde veri varsa ve BrandId ile eşleşmiyorsa; BrandId yoksa güncelleme yapılacaktır, BrandId varsa kayıt yapılmayacaktır. |

Örnek `data` alanları: `BrandId`, `BrandName`, `IsActive`, `SeoTitle`, `SeoDescription`, `ShortDescription`, `Image1Url`, `Image2Url`, `RowNumber`, `Showcase`.
```json
[
  {
    "BrandId": "",
    "BrandName": "brandname",
    "IsActive": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "ShortDescription": "",
    "Image1Url": "",
    "Image2Url": "",
    "RowNumber": "99",
    "Showcase": {
      "Top": "",
      "Bottom": "",
      "MobileTop": "",
      "MobileBottom": "",
      "Language": ""
    }
  }
]
```

### `brand/setBrandLanguage`

`POST https://magaza.example/rest1/brand/setBrandLanguage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | BrandId zorunludur. |

Örnek `data` alanları: `BrandId`, `BrandName`, `SeoTitle`, `SeoDescription`, `SeoLink`, `Language`.
```json
[
  {
    "BrandId": "",
    "BrandName": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "SeoLink": "",
    "Language": ""
  }
]
```

### `brand/addImageFromUrl`

`POST https://magaza.example/rest1/brand/addImageFromUrl/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `BrandId`, `Image1Url`, `Image2Url`.
```json
[
  {
    "BrandId": "11",
    "Image1Url": "",
    "Image2Url": ""
  }
]
```

### `brand/addImageFromFile`

`POST https://magaza.example/rest1/brand/addImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | hayır | WebServis arayüz konsolu dışında gönderimlerde image_1 ve image_2 parametreleri kullanılabilir. |

### `brand/deleteBrand`

`POST https://magaza.example/rest1/brand/deleteBrand/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `BrandId`.
```json
[
  {
    "BrandId": ""
  }
]
```

## Campaign

Kampanya, koşul, promosyon ve hediye kodu. Konsolda hepsi alpha.

### `campaign/deleteCampaign` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

### `campaign/deleteCampaignConditionExclude` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignConditionExclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

### `campaign/deleteCampaignConditionInclude` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignConditionInclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

### `campaign/deleteCampaignPromotion` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignPromotion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

### `campaign/getCampaignConditionByCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignConditionByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

### `campaign/getCampaignConditionsByCampaignCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignConditionsByCampaignCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

### `campaign/getCampaignDetailByCampaignCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignDetailByCampaignCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

### `campaign/getCampaignPromotionByCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignPromotionByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |

### `campaign/getCampaignPromotionsByCampaignCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignPromotionsByCampaignCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |

### `campaign/getCampaigns` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaigns/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `` | query | str | hayır |  |
| `FetchExcludeConditions` | query | bool | hayır |  |

### `campaign/setCampaignDetail` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignDetail/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CountryCodes birden çok ülke kodu gönderileceği zaman aralarına ',' koymak yeterlidir.Örn: TR,USA   Boş gönderilirse Tüm Ülkeleri kapsar. |

Örnek `data` alanları: `Code`, `Name`, `CartDescription`, `Description`, `StartDate`, `FinishDate`, `Weekdays`, `MaxCount`, `VatIncluded`, `CustomerFilterType`, `CustomerFilterIds`, `CountryCodes`, `LogicalGroup`, `Priority`, `Status`, `MobileAppStatus`, `AutoStart`.
```json
[
  {
    "Code": "T5",
    "Name": "test kampanya",
    "CartDescription": "",
    "Description": "",
    "StartDate": "1514926800",
    "FinishDate": "1516309200",
    "Weekdays": "",
    "MaxCount": "",
    "VatIncluded": "",
    "CustomerFilterType": "",
    "CustomerFilterIds": "",
    "CountryCodes": "",
    "LogicalGroup": "",
    "Priority": "",
    "Status": "",
    "MobileAppStatus": "",
    "AutoStart": 0
  }
]
```

### `campaign/getCampaignGiftCode` (alpha)

`POST https://magaza.example/rest1/campaign/getCampaignGiftCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | query | str | hayır |  |
| `CampaignId` | query | int | hayır |  |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `f` | query | str | hayır | Kullanılabilen operatörler: startwith,endwith,equal,greater,smaller,between,contain. Örn: "FinishTime\|1529931531\|smaller" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchCampaignDetail` | query | bool | hayır |  |

### `campaign/setCampaignGiftCode` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignGiftCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; product, category, brand, c2c, model   CustomerId yerine CustomerCode kullanılarak üye kodu gönderilebilir. |

Örnek `data` alanları: `CampaignCode`, `Coupon`, `CustomerId`, `FinishTime`, `Variable1`, `Status`.
```json
[
  {
    "CampaignCode": "T5",
    "Coupon": "TEST",
    "CustomerId": 275,
    "FinishTime": 1598605351,
    "Variable1": 1,
    "Status": 1
  }
]
```

### `campaign/deleteCampaignGiftCode` (alpha)

`POST https://magaza.example/rest1/campaign/deleteCampaignGiftCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `CampaignCode`, `Coupon`.
```json
[
  {
    "CampaignCode": "T5",
    "Coupon": "TEST"
  }
]
```

### `campaign/setCampaignConditionExclude` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignConditionExclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; product, category, brand, c2c, model |

Örnek `data` alanları: `CampaignCode`, `Code`, `Type`, `TableId`.
```json
[
  {
    "CampaignCode": "T5",
    "Code": "TEST",
    "Type": "cart",
    "TableId": ""
  }
]
```

### `campaign/setCampaignConditionInclude` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignConditionInclude/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; cart, product, category, brand, c2c, model |

Örnek `data` alanları: `CampaignCode`, `Code`, `Type`, `TableId`, `MinCount`, `MinTotal`, `MaxTotal`, `AllowSameItem`, `LogicalGroup`.
```json
[
  {
    "CampaignCode": "T5",
    "Code": "TEST",
    "Type": "cart",
    "TableId": "",
    "MinCount": "",
    "MinTotal": "100",
    "MaxTotal": "",
    "AllowSameItem": "",
    "LogicalGroup": ""
  }
]
```

### `campaign/setCampaignPromotion` (alpha)

`POST https://magaza.example/rest1/campaign/setCampaignPromotion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type; cart, product, category, brand, c2c, model |

Örnek `data` alanları: `CampaignCode`, `Code`, `Type`, `TableId`, `Count`, `DiscountType`, `DiscountValue`, `OrderBy`, `CartIndex`, `LogicalGroup`, `Priority`, `AutoAdd`.
```json
[
  {
    "CampaignCode": "T5",
    "Code": "TEST",
    "Type": "product",
    "TableId": "705",
    "Count": "3",
    "DiscountType": "",
    "DiscountValue": "",
    "OrderBy": "",
    "CartIndex": "",
    "LogicalGroup": "",
    "Priority": "",
    "AutoAdd": 0
  }
]
```

### `campaign/updateCampaignExcludeField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignExcludeField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

### `campaign/updateCampaignField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

### `campaign/updateCampaignIncludeField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignIncludeField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

### `campaign/updateCampaignPromotionField` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignPromotionField/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | url_param | str | evet |  |
| `field` | query | str | evet |  |
| `value` | query | str | evet |  |

### `campaign/updateCampaignStatus` (alpha)

`POST https://magaza.example/rest1/campaign/updateCampaignStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignCode` | url_param | str | evet |  |
| `status` | query | str | evet |  |

## Cart

Üye sepetine ürün yazma ve okuma. Konsolda hepsi alpha. Ayrı sepet linki alanı yok.

### `cart/addToCart` (alpha)

`POST https://magaza.example/rest1/cart/addToCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `new` | query | bool | hayır | Yeni yöntemde sepetteki ürünü güncellemek için product_id yanında cart_index de gönderilmeli. count alanına da o ürünün sepetteki güncel sayısı yazılmalı. Sepete yeni ürün eklerken cart_index -1 olarak gönderilmeli. |

Örnek `data` alanları: `customer_id`, `cart_index`, `product_id`, `variant_id`, `count`, `personalization`.
```json
[
  {
    "customer_id": "110",
    "cart_index": "-1",
    "product_id": "147",
    "variant_id": "",
    "count": "2",
    "personalization": {
      "form_id": "11",
      "data": [
        {
          "title": "1. resim",
          "value": "test.jpg",
          "index": 0
        },
        {
          "title": "2. resim",
          "value": "test2.jpg",
          "index": 1
        }
      ]
    }
  }
]
```

### `cart/getCart` (alpha)

`POST https://magaza.example/rest1/cart/getCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `customer_id` | url_param | str | hayır |  |
| `new` | query | bool | hayır |  |
| `mobile_app` | query | bool | hayır | true gönderildiği takdirde, sepette yalnızca mobil uygulamada aktif olan kampanyalar listelenir. |
| `fetch_product_detail` | query | bool | hayır |  |
| `fetch_installment_list` | query | bool | hayır |  |
| `image_limit` | query | int | hayır |  |

### `cart/getAll` (alpha, yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/cart/getAll/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `UpdateDate` | query | str | hayır | Bu tarihten sonra güncellenen sepetler. Example: "2011-07-21 20:09:00" |
| `Email` | query | str | hayır |  |

### `cart/removeAll` (alpha)

`POST https://magaza.example/rest1/cart/removeAll/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `customer_id` | url_param | str | hayır |  |
| `new` | query | bool | hayır |  |

### `cart/removeItems` (alpha)

`POST https://magaza.example/rest1/cart/removeItems/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `new` | query | bool | hayır | Yeni yöntemde sepetteki ürünü silmek için product_id yerine cart_index gönderilmeli. |

Örnek `data` alanları: `customer_id`, `cart_index`, `product_id`, `variant_id`.
```json
[
  {
    "customer_id": "110",
    "cart_index": "-1",
    "product_id": "147",
    "variant_id": ""
  }
]
```

### `cart/selectCampaign` (alpha)

`POST https://magaza.example/rest1/cart/selectCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Seçili kampanyayı iptal etmek için campaign_id sıfır (0) gönderilmelidir. |

Örnek `data` alanları: `customer_id`, `campaign_group_id`, `campaign_id`.
```json
[
  {
    "customer_id": "110",
    "campaign_group_id": "1",
    "campaign_id": "4"
  }
]
```

### `cart/setCouponCode` (alpha)

`POST https://magaza.example/rest1/cart/setCouponCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `customer_id`, `code`.
```json
[
  {
    "customer_id": "110",
    "code": "1BNQGVPVNJ"
  }
]
```

## Catalog

Varyant teması ve katalog görseli.

### `catalog/getVariantThemes`

`POST https://magaza.example/rest1/catalog/getVariantThemes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `VariantThemeId` | query | int | hayır |  |
| `VariantThemeCode` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

### `catalog/setVariantThemes`

`POST https://magaza.example/rest1/catalog/setVariantThemes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | AttributeMainFilters ve ProductListAttributes parametlerine gönderilecek olan attribute group kodu AttributeFilters içerisinde olmalı ve ya daha önceden AttributeFilters alanında eklenmiş olmalı. |

Örnek `data` alanları: `VariantThemeCode`, `VariantThemeName`, `AttributeFilters`, `AttributeMainFilters`, `ProductListAttributes`.
```json
[
  {
    "VariantThemeCode": "T15-3",
    "VariantThemeName": "AltKategoriTest",
    "AttributeFilters": [
      "T1",
      "T2"
    ],
    "AttributeMainFilters": [
      "T1"
    ],
    "ProductListAttributes": [
      "T1"
    ]
  }
]
```

### `catalog/deleteVariantThemes`

`POST https://magaza.example/rest1/catalog/deleteVariantThemes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `VariantThemeId`.
```json
[
  {
    "VariantThemeId": 11
  },
  {
    "VariantThemeCode": "TV11"
  }
]
```

### `catalog/addImageFromUrl`

`POST https://magaza.example/rest1/catalog/addImageFromUrl/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `CatalogCode`, `ImageUrl`, `ListNo`, `Attributes`.
```json
[
  {
    "CatalogCode": "T11",
    "ImageUrl": "",
    "ListNo": "99",
    "Attributes": [
      {
        "Attribute": "T51",
        "AttributeValue": "T21"
      },
      {
        "Attribute": "T51",
        "AttributeValue": "TS-20"
      }
    ]
  }
]
```

### `catalog/addImageFromFile`

`POST https://magaza.example/rest1/catalog/addImageFromFile/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | hayır |  |
| `image` | file | file | evet |  |

Örnek `data` alanları: `CatalogCode`, `ListNo`, `Attributes`.
```json
[
  {
    "CatalogCode": "T11",
    "ListNo": "99",
    "Attributes": [
      {
        "Attribute": "T51",
        "AttributeValue": "T21"
      },
      {
        "Attribute": "T51",
        "AttributeValue": "TS-20"
      }
    ]
  }
]
```

## Category

Kategori ağacı, listeleme ve yazma.

### `category/getCategories`

`POST https://magaza.example/rest1/category/getCategories/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |
| `language` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |
| `FetchAdditionalCategoryData` | query | bool | hayır |  |

### `category/getCategoryByCode`

`POST https://magaza.example/rest1/category/getCategoryByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryCode` | url_param | str | evet |  |
| `language` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

### `category/getCategoryById`

`POST https://magaza.example/rest1/category/getCategoryById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryId` | url_param | int | evet |  |
| `language` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

### `category/getCategoryByName`

`POST https://magaza.example/rest1/category/getCategoryByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryName` | url_param | str | evet |  |
| `language` | query | str | hayır |  |
| `FetchExactMatch` | query | bool | hayır | Bu değer true gönderilirse tam eşleşme sağlanan kategoriler dönecektir, aksi halde içinde gönderilen kategori ismi geçen tüm kategoriler dönmektedir. |

### `category/getCategoryTree`

`POST https://magaza.example/rest1/category/getCategoryTree/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | query | int | hayır |  |
| `node` | query | str | hayır |  |

### `category/setCategories`

`POST https://magaza.example/rest1/category/setCategories/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Showcase: Kategori vitrini dile göre ayarlanabilir. Değişiklik yapılmak istenmiyorsa gönderilmemelidir. |

Örnek `data` alanları: `CategoryCode`, `CategoryName`, `IsActive`, `ParentCode`, `ListNo`, `SeoLink`, `SeoTitle`, `SeoDescription`, `SeoSettingsId`, `FilteringPanel`, `IsProductListPassive`, `ShowInMenu`, `ShowInMobile`, `ShortDesciption`, `ShowCategory`, `ShowProduct`, `GoogleProductsPath`, `Showcase`.
```json
[
  {
    "CategoryCode": "T15-3",
    "CategoryName": "AltKategoriTest",
    "IsActive": "",
    "ParentCode": "T246",
    "ListNo": "99",
    "SeoLink": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "SeoSettingsId": "",
    "FilteringPanel": "",
    "IsProductListPassive": "",
    "ShowInMenu": "",
    "ShowInMobile": "",
    "ShortDesciption": "",
    "ShowCategory": "",
    "ShowProduct": "",
    "GoogleProductsPath": "",
    "Showcase": {
      "Top": "",
      "Bottom": "",
      "MobileTop": "",
      "MobileBottom": "",
      "Language": ""
    }
  }
]
```

### `category/tree`

`POST https://magaza.example/rest1/category/tree/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `parent_id` | url_param | int | hayır |  |
| `depth` | post | int | hayır | Kategoride max. derinlik belirtmek için kullanılabilir. |
| `group_key` | post | str | hayır |  |
| `mobile_platform` | query | bool | hayır |  |
| `support_v5` | query | bool | hayır |  |
| `fetch_showcase` | query | bool | hayır |  |

### `category/setCategoryLanguage`

`POST https://magaza.example/rest1/category/setCategoryLanguage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Languages: tr, en, ar, az, bs, de, fr, ru |

Örnek `data` alanları: `CategoryCode`, `Language`, `CategoryName`, `SeoLink`, `SeoTitle`, `SeoDescription`.
```json
[
  {
    "CategoryCode": "T15-3",
    "Language": "en",
    "CategoryName": "Test Category",
    "SeoLink": "test-category",
    "SeoTitle": "",
    "SeoDescription": ""
  }
]
```

## Content

İçerik kaydı okuma.

### `content/getContent`

`POST https://magaza.example/rest1/content/getContent/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `id` | url_param | int | evet | id gönderilmez ise tüm içerikler gelir |
| `start` | post | int | hayır |  |
| `limit` | post | int | hayır |  |

## Customer

Üye, adres, grup, giriş linki, sepet okuma, istek listesi ve arşiv.

### `customer/addCustomers`

`POST https://magaza.example/rest1/customer/addCustomers/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CheckIdentityNumber parametresini kullanılırken Merkezi Nüfus Sistemi doğrulaması için TC Kimlik No Doğrulaması ayarının açık olması gerekir aksi halde nüfus sitesi doğrulaması yapılmaz. |
| `IsPasswordEncrypted` | query | bool | hayır |  |
| `CheckIdentityNumber` | query | bool | hayır |  |
| `SendPasswordResetEmail` | query | bool | hayır | Bu parametre true gönderilirse üyeye şifre sıfırlama e-postası gider |

Örnek `data` alanları: `CustomerCode`, `Name`, `Surname`, `Email`, `Password`, `Gender`, `Birthdate`, `Phone`, `Mobile`, `OfficePhone`, `Address`, `Postcode`, `City`, `Town`, `District`, `CountryCode`, `Country`, `TaxOffice`, `TaxNo`, `CompanyName`, `IdentityNo`, `Field1`, `Field2`, `Field3`, `Field4`, `Field5`, `Field6`, `Field7`, `Field8`, `Field9`, `Field10`, `Field11`, `Field12`, `Field13`, `Field14`, `Field15`, `PosMerchantId`, `Approval`, `Language`, `IsEmailNotificationOn`, `IsSmsNotificationOn`, `IsPhoneCallNotificationOn`, `EmailApprovalTime`, `SmsApprovalTime`, `PhoneCallApprovalTime`, `NotificationApprovalIp`, `SmsNotificationApprovalIp`, `PhoneNotificationApprovalIp`, `CustomerGroupCode`, `RepresentativeCode`, `Credibility`, `PayAtDoor`, `Risked`, `Banned`, `PriceField`, `CargoFree`, `UtmMedium`, `UtmSource`.
```json
[
  {
    "CustomerCode": "",
    "Name": "",
    "Surname": "",
    "Email": "",
    "Password": "",
    "Gender": "",
    "Birthdate": "",
    "Phone": "",
    "Mobile": "",
    "OfficePhone": "",
    "Address": "",
    "Postcode": "",
    "City": "",
    "Town": "",
    "District": "",
    "CountryCode": "",
    "Country": "",
    "TaxOffice": "",
    "TaxNo": "",
    "CompanyName": "",
    "IdentityNo": "",
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
    "PosMerchantId": "",
    "Approval": "",
    "Language": "",
    "IsEmailNotificationOn": "",
    "IsSmsNotificationOn": "",
    "IsPhoneCallNotificationOn": "",
    "EmailApprovalTime": "",
    "SmsApprovalTime": "",
    "PhoneCallApprovalTime": "",
    "NotificationApprovalIp": "",
    "SmsNotificationApprovalIp": "",
    "PhoneNotificationApprovalIp": "",
    "CustomerGroupCode": "",
    "RepresentativeCode": "",
    "Credibility": "",
    "PayAtDoor": 0,
    "Risked": 0,
    "Banned": 0,
    "PriceField": "",
    "CargoFree": 0,
    "UtmMedium": "",
    "UtmSource": ""
  }
]
```

20 Ekim 2026 çağrısında 10 haneli cep ve `CustomerGroupCode` `ogretmenler` kabul edildi. Başarı kodu `CUI002`. Kayıtlı e-posta güncellenmez. Parti `success: false` dönse de `CUI002` alan satırlar durur. Ayrıntı [canlı çağrı](#20-ekim-2026-canlı-çağrı) bölümündedir.

### `customer/address`

`POST https://magaza.example/rest1/customer/address/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `address_id` | url_param | int | hayır | Tek bir adres listeleme için bu bilgi girilmelidir. Üyenin tüm adreslerini listelemek için customer_id ve type göndermeniz yeterlidir. |
| `customer_id` | query | int | hayır | Adres listeleme için bu bilgi girilmelidir. |
| `type` | query | int | hayır | Adres listelemede ön tanımlı olarak teslimat adresi gelir. type:0 teslimat adresi, type:1 fatura adresi |
| `data` | query | text | hayır | Adres eklemek veya düzenlemek için yalnızca bu bilgi girilmelidir. invoice_type:0 şahıs invoice_type:1 kurumsal. tax_number alanına invoice_type:0 olduğu durumda TC kimlik no yazılmalıdır.   customer_id yerine customer_code, address_id yerine address_code kullanılabilir. |

Örnek `data` alanları: `customer_id`, `title`, `country_code`, `city_code`, `town_code`, `town`, `address`, `address_id`, `also_invoice`, `company_name`, `district`, `name`, `invoice_type`, `mobile_phone`, `nationality`, `other_phone`, `tax_number`, `tax_office`, `zip`, `has_e_invoice`.
```json
[
  {
    "customer_id": 110,
    "title": "İş Adresim",
    "country_code": "TR",
    "city_code": "34",
    "town_code": "941",
    "town": "Üsküdar",
    "address": "Teknopark No:104",
    "address_id": 0,
    "also_invoice": 1,
    "company_name": "",
    "district": "",
    "name": "Kübra K",
    "invoice_type": 0,
    "mobile_phone": "905555555555",
    "nationality": 0,
    "other_phone": "",
    "tax_number": "66666666666",
    "tax_office": "",
    "zip": "34104",
    "has_e_invoice": 0
  }
]
```

Postman `setAddress` aynı uca gider ve konsol örneğinde olmayan `type`, `ws_address_code`, `partner`, `partnerparams` alanlarını gönderir. `partner` değeri `Netsis`tir. Postman `getAddress` listeleme için `customer_id` gönderir ve yanında bir `data` dizisi de taşır. Gövdeler Postman bölümündedir.

### `customer/getAddress`

`POST https://magaza.example/rest1/customer/getAddress/`

Müşteriye ait adres verilerini döner

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | query | int | hayır | CustomerId veya CustomerCode parametrelerinden bir tanesi gönderilmelidir. |
| `CustomerCode` | query | str | hayır | CustomerId veya CustomerCode parametrelerinden bir tanesi gönderilmelidir. |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |
| `FetchDeleteds` | query | bool | hayır |  |

Postman `getAddress2` bu uca `CustomerCode=12001-01-BM0007` ile gider. `CustomerId` kapalıdır.

### `customer/check`

`POST https://magaza.example/rest1/customer/check/`

E-posta ve parola bilgileri ile kayıt varsa döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır | Platform metotlarında kullanılmak için eklenmiştir. customer_hash bu değere göre üretilmektedir. Platform metotları kullanılmıyorsa önemsenmez. |
| `email` | query | str | hayır |  |
| `phone` | query | str | hayır | Telefonla giriş aktif ise telefon ile girebilmek için email paramtresinin yerine kullanılabilir |
| `password` | query | pass | hayır |  |
| `CheckMemberPasswordChangeFrequency` | query | bool | hayır | 1 gönderilir ise üyenin şifre değiştirme sıklığı ayarına uyup uymadığını kontrol eder. |

### `customer/deleteAddress`

`POST https://magaza.example/rest1/customer/deleteAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `address_id` | url_param | int | hayır | Tek bir adres listeleme için bu bilgi girilmelidir. Üyenin tüm adreslerini listelemek için customer_id ve type göndermeniz yeterlidir. |
| `customer_id` | query | int | hayır | Adres listeleme için bu bilgi girilmelidir. |
| `type` | query | int | hayır | Adres listelemede ön tanımlı olarak teslimat adresi gelir. type:0 teslimat adresi, type:1 fatura adresi |

### `customer/facebookCheck` (alpha)

`POST https://magaza.example/rest1/customer/facebookCheck/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `id`, `name`, `email`, `gender`, `picture_url`.
```json
[
  {
    "id": "12345678",
    "name": "kübra",
    "email": "ornek@magaza.example",
    "gender": "female",
    "picture_url": ""
  }
]
```

### `customer/appleCheck` (alpha)

`POST https://magaza.example/rest1/customer/appleCheck/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `id`, `name`, `email`, `gender`, `picture_url`.
```json
[
  {
    "id": "12345678",
    "name": "İsim",
    "email": "ornek@magaza.example",
    "gender": "female",
    "picture_url": ""
  }
]
```

### `customer/forgotPassword`

`POST https://magaza.example/rest1/customer/forgotPassword/`

Şifremi unuttum. email verilirse şifre sıfırlama bağlantısı e-posta ile gönderilir. phone verilirse (LisansTelefonNoIleUyelik aktif) V5 mağazalarda SMS ile 6 haneli doğrulama kodu gönderilir; cevapta extra.otpRequired=true, extra.resentSmsTime (sn) ve extra.otpTtl (sn) döner ve şifre forgotPasswordOtpReset ile değiştirilir. V4 mağazalarda eski akış (şifre SMS ile) korunur. Güvenlik gereği telefon yolunda cevap numaradan bağımsızdır (kayıtsız numara, bekleme süresi ve günlük 10 kod tavanı dahil her durumda 'gönderildi' döner); e-posta yolunda da kayıtlı olmayan adres için başarılı cevap döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `email` | query | str | hayır | E-posta adresi. phone verilmezse zorunludur. |
| `phone` | query | str | hayır | Telefon numarası. Telefon No İle giriş lisansı aktifse kullanılabilir. |

### `customer/forgotPasswordOtpReset`

`POST https://magaza.example/rest1/customer/forgotPasswordOtpReset/`

forgotPassword ile telefona gönderilen 6 haneli doğrulama kodu ve yeni şifre ile şifreyi tek adımda değiştirir. Kod 5 dakika geçerlidir, 5 hatalı denemede geçersiz olur (CUE040). Başarılı işlemde oturum açılmaz; kullanıcı yeni şifresiyle login olmalıdır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `phone` | query | str | evet | forgotPassword isteğinde kullanılan telefon numarası. |
| `otp` | query | str | evet | SMS ile gönderilen 6 haneli doğrulama kodu. |
| `password` | query | pass | evet | Yeni şifre. |
| `passwordAgain` | query | pass | evet | Yeni şifre tekrarı. |

### `customer/getCart`

`POST https://magaza.example/rest1/customer/getCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerCode` | url_param | str | hayır |  |
| `ProductCode` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Varsayılan:50, Max:500 |
| `columns` | query | text | hayır | Örnek: "CustomerCode,ProductCode,Total,UpdateDate" |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `orderby` | query | str | hayır | Örnek: "UpdateDate ASC", Default: "UpdateDate DESC" |

### `customer/getCustomerByCode`

`POST https://magaza.example/rest1/customer/getCustomerByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerCode` | url_param | str | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |

### `customer/getCustomerById`

`POST https://magaza.example/rest1/customer/getCustomerById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | url_param | str | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |

### `customer/getCustomersByPhone` (beta)

`POST https://magaza.example/rest1/customer/getCustomersByPhone/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Phone` | url_param | str | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |

### `customer/getCustomerGroups`

`POST https://magaza.example/rest1/customer/getCustomerGroups/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |

Postman `getCustomerGroups` yalnız `token` gönderir.

### `customer/getCustomers`

`POST https://magaza.example/rest1/customer/getCustomers/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CreateDateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `CreateDateTimeEnd` | query | str | hayır |  |
| `UpdateDateTimeStart` | query | str | hayır |  |
| `UpdateDateTimeEnd` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır | Email \| ornek@magaza.example \| equal, Password \| kubra123 \| equal |
| `orderby` | query | str | hayır |  |
| `FetchSegment` | query | bool | hayır |  |
| `FetchCustomerGroup` | query | bool | hayır |  |
| `FetchAddressList` | query | bool | hayır |  |
| `FetchCustomerLastOrderDate` | query | bool | hayır |  |
| `FetchOrderTotal` | query | bool | hayır |  |

Postman üç liste ister. Üçünde `FetchCustomerGroup=true`. B2B: `f=Field1||notequal`. B2C: `f=Field1||equal`. Kimlik listesi B2B süzgecine `columns=CustomerId,CustomerCode,CompanyName` ekler. `notequal` yukarıdaki operatör listesinde yoktur.

20 Ekim 2026 çağrısında `f` alanı `CustomerGroupCode` reddedildi. `CustomerGroupId | 17 | equal` `ogretmenler` grubunu listeledi. Eşleşmeyen e-posta `success: true`, `data: null`, `totalRecordCount` `0` döner. Boş dönüş kaydın yokluğunu kanıtlamaz. Ayrıntı [canlı çağrı](#20-ekim-2026-canlı-çağrı) bölümündedir.

### `customer/getDeletedCustomers`

`POST https://magaza.example/rest1/customer/getDeletedCustomers/`

Silinen müşterileri uyeler_deleted tablosundan getirir. KVKK uyumluluğu için silinmiş müşteri kayıtlarını izlemek amacıyla kullanılır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `DeletedDateStart` | query | str | hayır | Silinme başlangıç tarihi. Örnek: "2024-01-01 00:00:00" veya timestamp |
| `DeletedDateEnd` | query | str | hayır | Silinme bitiş tarihi. Örnek: "2024-12-31 23:59:59" veya timestamp |
| `start` | query | int | hayır | Sayfalama için başlangıç indeksi (varsayılan: 0) |
| `limit` | query | int | hayır | Getirilecek kayıt sayısı (varsayılan: 100, maksimum: 1000) |
| `columns` | query | text | hayır | Getirilecek kolonlar (virgülle ayrılmış). Örnek: CustomerId,Email,DeletedAt |
| `search` | query | text | hayır | Arama kriteri. Format: kolon1,kolon2\|arama_terimi. Örnek: Email,FirstName\|test |
| `orderby` | query | str | hayır | Sıralama kriteri. Örnek: DeletedAt\|DESC veya CustomerId\|ASC |

### `customer/googleCheck` (alpha)

`POST https://magaza.example/rest1/customer/googleCheck/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `id`, `name`, `email`, `gender`, `picture_url`.
```json
[
  {
    "id": "12345678",
    "name": "kübra",
    "email": "ornek@magaza.example",
    "gender": "",
    "picture_url": ""
  }
]
```

### `customer/login`

`POST https://magaza.example/rest1/customer/login/`

Customer ID veya Code alanlarından birinin doldurulması zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `customerId` | query | int | hayır |  |
| `customerCode` | query | str | hayır |  |
| `loginRedirectUrl` | query | str | hayır |  |

### `customer/setCustomerGroups`

`POST https://magaza.example/rest1/customer/setCustomerGroups/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Code`, `Name`, `IsVendor`.
```json
[
  {
    "Code": "",
    "Name": "",
    "IsVendor": ""
  }
]
```

Postman’da `setCustomerGroups` adındaki istek bu uca gitmez. `customer/setCustomers` adresine üye alanları gönderir.

### `customer/setCustomers`

`POST https://magaza.example/rest1/customer/setCustomers/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | City yerine CityCode da gönderilebilir.  Town yerine ilçe kodu biliniyorsa TownCode da gönderilebilir. |
| `MatchWithEmail` | query | bool | hayır | CustomerCode gönderilmeden bu parametre true olarak gönderilirse eposta ya göre kayıt varsa günceller, yoksa ekleme yapar. |
| `MatchWithMobile` | query | bool | hayır | CustomerCode gönderilmeden bu parametre true olarak gönderilirse cep telefonuna(Mobile) göre kayıt varsa günceller, yoksa ekleme yapar. |
| `SearchInArchive` | query | bool | hayır | Bu parametre true gönderilirse üyeyi arşiveden kontrol eder arşivde ise arşivde ise orada güncelleme yapar. |
| `SendPasswordResetEmail` | query | bool | hayır | Bu parametre true gönderilirse üyeye şifre sıfırlama e-postası gider. |

Örnek `data` alanları: `CustomerCode`, `Name`, `Surname`, `Email`, `Password`, `Gender`, `Birthdate`, `Phone`, `Mobile`, `OfficePhone`, `Address`, `Postcode`, `City`, `Town`, `Country`, `TaxOffice`, `TaxNo`, `CompanyName`, `IdentityNo`, `Field1`, `Field2`, `Field3`, `Field4`, `Field5`, `Field6`, `Field7`, `Field8`, `Field9`, `Field10`, `Field11`, `Field12`, `Field13`, `Field14`, `Field15`, `PosMerchantId`, `Approval`, `IsEmailNotificationOn`, `IsSmsNotificationOn`, `IsPhoneCallNotificationOn`, `EmailApprovalTime`, `SmsApprovalTime`, `PhoneCallApprovalTime`, `NotificationApprovalIp`, `SmsNotificationApprovalIp`, `PhoneNotificationApprovalIp`, `CustomerGroupCode`, `RepresentativeCode`, `Credibility`, `PayAtDoor`, `Risked`, `Banned`, `PriceField`, `CargoFree`, `UtmMedium`, `UtmSource`.
```json
[
  {
    "CustomerCode": "",
    "Name": "",
    "Surname": "",
    "Email": "",
    "Password": "",
    "Gender": "",
    "Birthdate": "",
    "Phone": "",
    "Mobile": "",
    "OfficePhone": "",
    "Address": "",
    "Postcode": "",
    "City": "",
    "Town": "",
    "Country": "",
    "TaxOffice": "",
    "TaxNo": "",
    "CompanyName": "",
    "IdentityNo": "",
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
    "PosMerchantId": "",
    "Approval": "",
    "IsEmailNotificationOn": "",
    "IsSmsNotificationOn": "",
    "IsPhoneCallNotificationOn": "",
    "EmailApprovalTime": "",
    "SmsApprovalTime": "",
    "PhoneCallApprovalTime": "",
    "NotificationApprovalIp": "",
    "SmsNotificationApprovalIp": "",
    "PhoneNotificationApprovalIp": "",
    "CustomerGroupCode": "",
    "RepresentativeCode": "",
    "Credibility": "",
    "PayAtDoor": 0,
    "Risked": 0,
    "Banned": 0,
    "PriceField": "",
    "CargoFree": 0,
    "UtmMedium": "",
    "UtmSource": ""
  }
]
```

Postman `setCustomer` bu uca kurumsal cari yazar. Konsol listesinde olmayan alan `CustomerType` (`KURUMSAL`). `setCredibility` yalnız `CustomerCode` ve `Credibility` gönderir. `setCustomerGroups` adlı istek de bu uca vergi, firma ve grup alanlarını yazar. Gövdeler Postman bölümündedir.

20 Ekim 2026 çağrısında yalnız `CustomerCode` ve `CustomerGroupCode` gönderilen yedi üyenin grubu `ogretmenler` oldu. Ad, e-posta, cep ve firma ilk okumada değişmedi. Aynı gece altı `TZ0` üyesine ek olarak `CompanyName`, `Field2`, `Field3` ve `Field4` yazıldı. Güncelleme kodu `CUI001`, metin `Müşteri başarıyla güncellendi!`.

### `customer/updateCustomerCode`

`POST https://magaza.example/rest1/customer/updateCustomerCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `CustomerCode`, `CustomerNewCode`.
```json
[
  {
    "CustomerCode": "T88",
    "CustomerNewCode": "AY37K"
  }
]
```

### `customer/updateCustomers`

`POST https://magaza.example/rest1/customer/updateCustomers/`

City yerine CityCode da gönderilebilir.
 Town yerine ilçe kodu biliniyorsa TownCode da gönderilebilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `IsPasswordEncrypted` | query | bool | hayır |  |
| `SetCustomerGroupCodeSessions` | query | bool | hayır |  |
| `MatchWithEmail` | query | bool | hayır | CustomerCode gönderilmeden bu parametre true olarak gönderilirse eposta ya göre kayıt varsa günceller, yoksa ekleme yapar. |
| `MatchWithMobile` | query | bool | hayır | CustomerCode gönderilmeden bu parametre true olarak gönderilirse cep telefonuna(Mobile) göre kayıt varsa günceller, yoksa ekleme yapar. |
| `SearchInArchive` | query | bool | hayır | Bu parametre true gönderilirse üyeyi arşiveden kontrol eder arşivde ise arşivde ise orada güncelleme yapar. |
| `SendPasswordResetEmail` | query | bool | hayır | Bu parametre true üyeye şifre sıfırlama e-postası gider. |

Örnek `data` alanları: `CustomerCode`, `Name`, `Surname`, `Email`, `Password`, `Gender`, `Birthdate`, `Phone`, `Mobile`, `Address`, `Postcode`, `City`, `Town`, `District`, `CountryCode`, `Country`, `TaxOffice`, `TaxNo`, `CompanyName`, `IdentityNo`, `Field1`, `Field2`, `Field3`, `Field4`, `Field5`, `Field6`, `Field7`, `Field8`, `Field9`, `Field10`, `Field11`, `Field12`, `Field13`, `Field14`, `Field15`, `PosMerchantId`, `Approval`, `IsEmailNotificationOn`, `IsSmsNotificationOn`, `IsPhoneCallNotificationOn`, `EmailApprovalTime`, `SmsApprovalTime`, `PhoneCallApprovalTime`, `NotificationApprovalIp`, `SmsNotificationApprovalIp`, `PhoneNotificationApprovalIp`, `CustomerGroupCode`, `RepresentativeCode`, `Credibility`, `PayAtDoor`, `Risked`, `Banned`, `PriceField`, `CargoFree`, `UtmMedium`, `UtmSource`.
```json
[
  {
    "CustomerCode": "",
    "Name": "",
    "Surname": "",
    "Email": "",
    "Password": "",
    "Gender": "",
    "Birthdate": "",
    "Phone": "",
    "Mobile": "",
    "Address": "",
    "Postcode": "",
    "City": "",
    "Town": "",
    "District": "",
    "CountryCode": "",
    "Country": "",
    "TaxOffice": "",
    "TaxNo": "",
    "CompanyName": "",
    "IdentityNo": "",
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
    "PosMerchantId": "",
    "Approval": "",
    "IsEmailNotificationOn": "",
    "IsSmsNotificationOn": "",
    "IsPhoneCallNotificationOn": "",
    "EmailApprovalTime": "",
    "SmsApprovalTime": "",
    "PhoneCallApprovalTime": "",
    "NotificationApprovalIp": "",
    "SmsNotificationApprovalIp": "",
    "PhoneNotificationApprovalIp": "",
    "CustomerGroupCode": "",
    "RepresentativeCode": "",
    "Credibility": "",
    "PayAtDoor": 0,
    "Risked": 0,
    "Banned": 0,
    "PriceField": "",
    "CargoFree": 0,
    "UtmMedium": "",
    "UtmSource": ""
  }
]
```

### `customer/setWishList`

`POST https://magaza.example/rest1/customer/setWishList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | ProductId yerine ProductCode, SubProductId yerine SubProductCode ve CustomerId yerine CustomerCode gönderilebilir. |

Örnek `data` alanları: `ListCategoryId`, `ProductId`, `SubProductId`, `CustomerId`.
```json
[
  {
    "ListCategoryId": 3,
    "ProductId": 608,
    "SubProductId": 0,
    "CustomerId": 213
  }
]
```

### `customer/getWishList`

`POST https://magaza.example/rest1/customer/getWishList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `customer/getWishListCategories`

`POST https://magaza.example/rest1/customer/getWishListCategories/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `customer/getFields`

`POST https://magaza.example/rest1/customer/getFields/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | text | hayır | İzin Veriler Tipler    - YeniKayıt => MemberRegister    - BayiKayit => VendorRegister    - Duzenle => Update |
| `Platform` | query | text | hayır | İzin Veriler Tipler => mobile_app, web |

### `customer/deleteCustomer`

`POST https://magaza.example/rest1/customer/deleteCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerIds` | query | text | hayır | Üye id leri aralara - eklenerek gönderilebilir.   Örnek CustomerIds=100-150 |
| `CustomerCodes` | query | text | hayır | Üye kodları leri aralara 'Rest Web Servis Ayraç Karakteri' eklenerek gönderilebilir. (Ayarın Varsayılan değeri : '\|')   Örnek CustomerCodes=T100-T150 |

### `customer/unArchive`

`POST https://magaza.example/rest1/customer/unArchive/`

Üye veya üyeleri arşivden geri döndermek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerIds` | query | int | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `CustomerCodes` | query | str | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : T127\|T128 |

### `customer/archive`

`POST https://magaza.example/rest1/customer/archive/`

Üye veya üyeleri arşive eklemek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerIds` | query | int | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `CustomerCodes` | query | str | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : T127\|T128 |

### `customer/getTax`

`POST https://magaza.example/rest1/customer/getTax/`

Vergi Daireleri getirmek için kullanılır

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `customer/getServices`

`POST https://magaza.example/rest1/customer/getServices/`

Müşteri Hizmetleri

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Language` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `customer/setServices`

`POST https://magaza.example/rest1/customer/setServices/`

Müşteri Hizmetleri

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Id girilmediği durumda oluşturma yapmaktadır. Id değeri ile güncelleme yapılabilir. Oluşturma işlemleri sırasında CategoryId zorunludur. CategoryId için getServiceCategories'e istek atılır. |

Örnek `data` alanları: `Id`, `Title`, `Description`, `CategoryId`, `Status`, `ListNo`.
```json
[
  {
    "Id": "",
    "Title": "Yeni Müşteri Hizmet",
    "Description": "Yeni Müşteri Hizmet Açıklama",
    "CategoryId": "",
    "Status": 1,
    "ListNo": "999"
  }
]
```

### `customer/getServiceCategories`

`POST https://magaza.example/rest1/customer/getServiceCategories/`

Müşteri Hizmetleri Kategorileri

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Language` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `customer/setServiceCategories`

`POST https://magaza.example/rest1/customer/setServiceCategories/`

Müşteri Hizmetleri Kategorileri

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Id girilmediği durumda oluşturma yapmaktadır. Id değeri ile güncelleme yapılabilir. |

Örnek `data` alanları: `Id`, `Name`, `Link`, `IsVisible`, `ListNo`.
```json
[
  {
    "Id": "",
    "Name": "Yeni Kategori",
    "Link": "yeni-kategori",
    "IsVisible": 1,
    "ListNo": "999"
  }
]
```

## Filter

Yeni filtre yapısı: grup, seçenek ve ürüne bağlama.

### `filter/setGroup`

`POST https://magaza.example/rest1/filter/setGroup/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | GroupCode varsa güncelleme yapar, yoksa ekleme yapar.   GroupCode Yerine GroupId kullanılabilir   "Type" parametresinin alabileceği değerler.  0:Çoklu  1:Tekli  2:Sayısal   "Status" parametresinin alabileceği değerler.  1:Aktif  2:Pasif  3:Gizli    "View" parametresinin alabileceği değerler.  "list", "color", "shape"    "CatalogView" parametresinin alabileceği değerler,   "image", "color", "button","select" |

Örnek `data` alanları: `GroupCode`, `Name`, `AdminName`, `ListNo`, `View`, `CatalogView`, `Type`, `Status`, `Translation`.
```json
[
  {
    "GroupCode": "T11",
    "Name": "İşlemci",
    "AdminName": "İşlemci",
    "ListNo": "999",
    "View": "",
    "CatalogView": "",
    "Type": "0",
    "Status": "1",
    "Translation": [
      {
        "Language": "en",
        "Name": "Processor"
      },
      {
        "Language": "ar",
        "Name": "المعالج"
      }
    ]
  }
]
```

### `filter/setOption`

`POST https://magaza.example/rest1/filter/setOption/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | OptionCode varsa güncelleme yapar, yoksa ekleme yapar.   OptionCoe Yerine OptionId kullanılabilir    GroupCode yerine GroupId kullanılabilir. |

Örnek `data` alanları: `GroupCode`, `OptionCode`, `Name`, `Data`, `ListNo`, `Translation`.
```json
[
  {
    "GroupCode": "T15",
    "OptionCode": "T129",
    "Name": "Intel Core i7",
    "Data": "",
    "ListNo": 999,
    "Translation": [
      {
        "Language": "en",
        "Name": "Intel Core i7"
      },
      {
        "Language": "ar",
        "Name": "انتل كور i7"
      }
    ]
  }
]
```

### `filter/get`

`POST https://magaza.example/rest1/filter/get/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `GroupId` | url_param | int | hayır |  |
| `Translation` | query | text | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `FetchOptions` | query | bool | hayır |  |

### `filter/getFiltersByProductCode`

`POST https://magaza.example/rest1/filter/getFiltersByProductCode/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | int | hayır |  |

### `filter/addGroupToProduct`

`POST https://magaza.example/rest1/filter/addGroupToProduct/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `GroupCode`.
```json
[
  {
    "ProductCode": "T695",
    "GroupCode": "T78"
  }
]
```

### `filter/deleteGroupFromProduct`

`POST https://magaza.example/rest1/filter/deleteGroupFromProduct/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `GroupCode`.
```json
[
  {
    "ProductCode": "T695",
    "GroupCode": "T78"
  }
]
```

### `filter/setFilterValues`

`POST https://magaza.example/rest1/filter/setFilterValues/`

Yeni filtre Yapısı

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | GroupCode yerine GroupId kullanılabilir.     Value verilerine OptionCode gönderilecekse ValueType verisinin 'code' olarak gönderilmesi gereklidir.    Çoklu değer gönderilmek isteniyorsa Value değeri array olmalıdır.    Sayısal değer gönderilmek isteniyorsa Value değeri integer yada double olmalıdır. |

Örnek `data` alanları: `ProductCode`, `GroupCode`, `Value`.
```json
[
  {
    "ProductCode": "T695",
    "GroupCode": "T78",
    "Value": 10.25
  },
  {
    "ProductCode": "T695",
    "GroupCode": "T79",
    "ValueType": "code",
    "Value": [
      "T129",
      "T130"
    ]
  },
  {
    "ProductCode": "T695",
    "GroupCode": "T80",
    "ValueType": "id",
    "Value": "129"
  }
]
```

## FundMovement

Cari hareket okuma, yazma ve silme.

### `fundMovement/addFundMovements`

`POST https://magaza.example/rest1/fundMovement/addFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `FundMovementCode`, `CustomerCode`, `Description`, `Receivable`, `Debt`, `IsDeleted`, `PaymentType`, `CustomerBankCard`, `OrderCurrency`.
```json
[
  {
    "FundMovementCode": "",
    "CustomerCode": "",
    "Description": "",
    "Receivable": "",
    "Debt": "",
    "IsDeleted": "",
    "PaymentType": "",
    "CustomerBankCard": "",
    "OrderCurrency": ""
  }
]
```

### `fundMovement/getFundMovementByCode`

`POST https://magaza.example/rest1/fundMovement/getFundMovementByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementCode` | url_param | str | evet |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |

### `fundMovement/getFundMovementById`

`POST https://magaza.example/rest1/fundMovement/getFundMovementById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementId` | url_param | str | evet |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |

### `fundMovement/getFundMovements`

`POST https://magaza.example/rest1/fundMovement/getFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementDateTimeStart` | query | str | hayır |  |
| `FundMovementDateTimeEnd` | query | str | hayır |  |
| `FundMovementCode` | query | str | hayır |  |
| `CustomerCode` | query | str | hayır |  |
| `FetchAdditionalCustomerData` | query | bool | hayır |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `fundMovement/deleteFundMovements`

`POST https://magaza.example/rest1/fundMovement/deleteFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementId` | query | int | hayır |  |
| `FundMovementCode` | query | str | hayır |  |
| `CustomerId` | query | int | hayır |  |
| `CustomerCode` | query | str | hayır |  |
| `IsJSONFormatEnabledForDelete` | query | bool | hayır | JSON alan gönderilmek isteniyorsa bu parametre true gönderilmelidir. |
| `data` | query | text | hayır | IsJSONFormatEnabledForDelete parametresi true gönderilirse bu alan kullanılabilir. |
| `f` | query | text | hayır |  |

Örnek `data` alanları: `FundMovementId`, `FundMovementCode`, `CustomerId`, `CustomerCode`.
```json
[
  {
    "FundMovementId": "",
    "FundMovementCode": "",
    "CustomerId": "",
    "CustomerCode": ""
  }
]
```

### `fundMovement/markFundMovement`

`POST https://magaza.example/rest1/fundMovement/markFundMovement/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FundMovementCode` | url_param | str | evet |  |
| `val` | query | bool | evet |  |

### `fundMovement/setFundMovements`

`POST https://magaza.example/rest1/fundMovement/setFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CreateDateTimeStamp yerine CreateDate da gönderilebilir.    Örnek :  CreateDateTimeStamp : 1698924617 CreateDate : 2023-01-01 10:00:00 |

Örnek `data` alanları: `FundMovementCode`, `CustomerCode`, `Description`, `Receivable`, `Debt`, `IsDeleted`, `PaymentType`, `CustomerBankCard`, `CreateDateTimeStamp`, `OrderCurrency`.
```json
[
  {
    "FundMovementCode": "",
    "CustomerCode": "",
    "Description": "",
    "Receivable": "",
    "Debt": "",
    "IsDeleted": "",
    "PaymentType": "",
    "CustomerBankCard": "",
    "CreateDateTimeStamp": "",
    "OrderCurrency": ""
  }
]
```

### `fundMovement/updateFundMovements`

`POST https://magaza.example/rest1/fundMovement/updateFundMovements/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `FundMovementCode`, `CustomerCode`, `Description`, `Receivable`, `Debt`, `IsDeleted`, `PaymentType`, `CustomerBankCard`, `OrderCurrency`.
```json
[
  {
    "FundMovementCode": "",
    "CustomerCode": "",
    "Description": "",
    "Receivable": "",
    "Debt": "",
    "IsDeleted": "",
    "PaymentType": "",
    "CustomerBankCard": "",
    "OrderCurrency": ""
  }
]
```

### `fundMovement/pay` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/fundMovement/pay/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

```json
{
  "CustomerCode": "T260",
  "Price": "10.00",
  "Description": "ödeme servisi",
  "CardHolder": "kart sahibi",
  "CardNumber": "4355084355084358",
  "Cvc": "000",
  "ExpireMonth": "03",
  "ExpireYear": "18",
  "InstallmentId": "68",
  "Secure3d": 0
}
```

### `fundMovement/getTransaction` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/fundMovement/getTransaction/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `transactionNo` | url_param | str | evet |  |

## Payment

Taksit, havale, BIN ve POS parametreleri.

### `payment/getInstallmentList` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/payment/getInstallmentList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Bin => değer girilirse sadece o karta ait taksitler gelir   ModuleType => 0:order, 1:cari, Şuan sadece cari   IsBusiness => bin girildiğinde ihtiyaç yok |

```json
{
  "Price": "10.00",
  "Bin": "",
  "ModuleType": "1",
  "IsBusiness": "0"
}
```

### `payment/setWireTransfers`

`POST https://magaza.example/rest1/payment/setWireTransfers/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Güncelleme yapmak için dataya "Id" eklenmelidir. Örneğin: "Id":1 |

Örnek `data` alanları: `Name`, `Status`, `AccountHolder`, `Branch`, `AccountSetupType`, `AccountNumber`, `IBAN`, `Swift`, `PredefinedAccount`, `SortNumber`.
```json
[
  {
    "Name": "Banka Test",
    "Status": "1",
    "AccountHolder": "Rumeysa Aydöner",
    "Branch": "KSÜ Şubesi",
    "AccountSetupType": "TL",
    "AccountNumber": "4324321",
    "IBAN": "TR90 1111 1111 1111 1111 1111 11",
    "Swift": "",
    "PredefinedAccount": "0",
    "SortNumber": ""
  }
]
```

### `payment/getWireTransfers`

`POST https://magaza.example/rest1/payment/getWireTransfers/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `payment/getCreditCardBin`

`POST https://magaza.example/rest1/payment/getCreditCardBin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `` |  |  | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

### `payment/setCreditCardBin`

`POST https://magaza.example/rest1/payment/setCreditCardBin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Güncelleme yapmak için dataya "Id" eklenmelidir. Örneğin: "Id":1   Güncelleme işleminde sadece "IsBussiness" ve "Passive" alanlarının güncellenmesine izin verilir.   Issues keyinin alabileceği değerler: VISA, TROY, MASTERCARD, AMERICANEXPRESS    CardType keyinin alabileceği değerler: CREDIT_CARD, DEBIT_CARD    IsBussiness keyinin alabileceği değerler: 0, 1    Passive keyinin alabileceği değerler: 0, 1 |

Örnek `data` alanları: `Bin`, `Brand`, `Issuer`, `CardType`, `IsBusiness`, `Passive`.
```json
[
  {
    "Bin": "123456",
    "Brand": "Banka Test",
    "Issuer": "VISA",
    "CardType": "CREDIT_CARD",
    "IsBusiness": 0,
    "Passive": 0
  }
]
```

### `payment/deleteCreditCardBin`

`POST https://magaza.example/rest1/payment/deleteCreditCardBin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | "Id" değerini payment/getCreditCardBin servisinden alabilirsiniz. |

Örnek `data` alanları: `Id`.
```json
[
  {
    "Id": 1
  }
]
```

### `payment/setPosParams`

`POST https://magaza.example/rest1/payment/setPosParams/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | str | evet | örn: Isyerimpos |
| `PosId` | post | int | evet | örn: 1 |
| `3DSecure` | post | int | hayır | örn: 0-1 |
| `3DSecureLimit` | post | int | hayır |  |
| `Provision` | post | int | hayır | 0: Provizyon, 1: Ön Provizyon |
| `LiveOrTest` | post | int | hayır | 0: Test, 1: Canlı |
| `data` | query | text | hayır | Isyerimpos için merchantId, userId,apiKey Anahtarında güncelleme yapabilirsiniz. |

Örnek `data` alanları: `Key`, `Value`.
```json
[
  {
    "Key": "merchantId",
    "Value": "123456"
  }
]
```

## Mobile

Mobil uygulama oturumu (MobileToken) ile sipariş, favori, alarm, adres.

### `mobile/index`

`POST https://magaza.example/rest1/mobile/index/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `fetch_product_detail` | query | bool | hayır |  |
| `fetch_installment_list` | query | bool | hayır |  |
| `support_v5` | query | bool | hayır |  |
| `image_limit` | query | int | hayır |  |
| `new` | query | bool | hayır | Yeni vitrin yapısı için gönderilmesi gerekmektedir. |

### `mobile/iframe`

`POST https://magaza.example/rest1/mobile/iframe/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `application` | query | str | hayır | Eğer bir uygulama ismi belirtilmezse, sistem SendheapV2, Connectprof ve Smartydata uygulamalarının iframe sahipliğini kontrol ederek sonuç döndürür. |
| `language` | query | str | hayır | en,tr |
| `currency` | query | str | hayır | USD,TRY veya EUR |
| `theme` | query | str | hayır | dark veya light |

### `mobile/link`

`POST https://magaza.example/rest1/mobile/link/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `link` | query | str | hayır |  |

### `mobile/getOrders`

`POST https://magaza.example/rest1/mobile/getOrders/`

Bu metod order/getOrders metodunun aldığı parametrelere ek olarak MobileToken prametresini almaktadır. MobileToken parametresi customer/check metodunda dönmektedir. Bu doğrulama ile sadece giriş yapmış kullanıcının bilgileri çekilebilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

### `mobile/getOrders2`

`POST https://magaza.example/rest1/mobile/getOrders2/`

Bu metod order2/getOrders metodunun aldığı parametrelere ek olarak MobileToken prametresini almaktadır. MobileToken parametresi customer/check metodunda dönmektedir. Bu doğrulama ile sadece giriş yapmış kullanıcının bilgileri çekilebilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `FetchShipmentDetail` | query | bool | hayır |  |

### `mobile/getCustomer`

`POST https://magaza.example/rest1/mobile/getCustomer/`

Bu metod customer/getCustomerById metodunun aldığı parametrelere ek olarak MobileToken prametresini almaktadır. MobilToken gönderildidiği için CustomerId gönderilmesine gerek yoktur. MobileToken parametresi customer/check metodunda dönmektedir. Bu doğrulama ile sadece giriş yapmış kullanıcının bilgileri çekilebilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

### `mobile/updateCustomer`

`POST https://magaza.example/rest1/mobile/updateCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `data` | query | text | evet |  |

```json
{
  "Name": "",
  "Surname": "",
  "Email": "",
  "Password": "",
  "Gender": "",
  "Birthdate": "",
  "Phone": "",
  "Mobile": "",
  "Address": "",
  "Postcode": "",
  "City": "",
  "Town": "",
  "Country": "",
  "TaxOffice": "",
  "TaxNo": "",
  "CompanyName": "",
  "IdentityNo": "",
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
  "Approval": "",
  "Kvkk": "",
  "IsEmailNotificationOn": "",
  "IsSmsNotificationOn": "",
  "IsPhoneCallNotificationOn": "",
  "EmailApprovalTime": "",
  "SmsApprovalTime": "",
  "PhoneCallApprovalTime": "",
  "CustomerGroupCode": "",
  "RepresentativeCode": "",
  "Credibility": "",
  "PayAtDoor": 0,
  "Risked": 0,
  "Banned": 0,
  "RegistrationPlatform": "rest1"
}
```

### `mobile/deleteCustomer`

`POST https://magaza.example/rest1/mobile/deleteCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

### `mobile/addToFavoriteList`

`POST https://magaza.example/rest1/mobile/addToFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

### `mobile/deleteFromFavoriteList`

`POST https://magaza.example/rest1/mobile/deleteFromFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

### `mobile/getFavoriteList`

`POST https://magaza.example/rest1/mobile/getFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

### `mobile/init`

`POST https://magaza.example/rest1/mobile/init/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `mobile/setJsonSettings`

`POST https://magaza.example/rest1/mobile/setJsonSettings/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `key` | query | str | evet |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Key`, `Title`, `Description`, `Value`, `Type`.
```json
[
  {
    "Key": "AyarKey",
    "Title": "Ayar Başlık",
    "Description": "Ayar Açıklaması",
    "Value": "1",
    "Type": "Bool"
  },
  {
    "Key": "AyarKey2",
    "Title": "Ayar Başlık",
    "Description": "Ayar Açıklaması",
    "Value": "0",
    "Type": "Bool"
  }
]
```

### `mobile/getAlarmList`

`POST https://magaza.example/rest1/mobile/getAlarmList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Filtreleme için Price veya Stock girilebilir. |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `orderby` | query | str | hayır | Örn: RecordTime DESC |
| `f` | query | str | hayır | Kullanılabilen operatörler: startwith,endwith,equal,greater,smaller,between,contain. Örn: "RecordTime\|1529931531\|greater" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchProductData` | query | bool | hayır |  |

### `mobile/addAlarm`

`POST https://magaza.example/rest1/mobile/addAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Price veya Stock girilmeli. |
| `AlarmDay` | query | str | hayır | Alarmın kaç gün için geçerli olduğunu belirler. |
| `CurrentPrice` | query | str | hayır | O anki fiyat girilebilir, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `AlarmPrice` | query | str | hayır | Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `Currency` | query | str | hayır | Para birimi. Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `VatIncluded` | query | str | hayır | Kdv dahil ise 1, değilse 0 girilmeli, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli. |
| `StockLimit` | query | str | hayır | Stok alarmı için gerekli parametre. Fiyat alarmı için gönderilmemeli. |

### `mobile/deleteAlarm`

`POST https://magaza.example/rest1/mobile/deleteAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AlarmId` | url_param | str | hayır |  |
| `MobileToken` | query | str | hayır |  |

### `mobile/getOrderReturn`

`POST https://magaza.example/rest1/mobile/getOrderReturn/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | str | hayır |  |
| `MobileToken` | query | str | hayır |  |
| `OrderCode` | query | str | hayır | OrderId yerine OrderCode gönderilebilir veya boş bırakılabilir. |

### `mobile/setOrderReturn`

`POST https://magaza.example/rest1/mobile/setOrderReturn/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `data` | query | text | evet | OrderId yerine OrderCode gönderilebilir |

Örnek `data` alanları: `OrderId`, `FirstName`, `LastName`, `Email`, `Adress`, `ReturnDescription`, `ReasonId`, `Products`.
```json
[
  {
    "OrderId": "3",
    "FirstName": "Test",
    "LastName": "Testcik",
    "Email": "ornek@magaza.example",
    "Adress": "Adres",
    "ReturnDescription": "Aciklama",
    "ReasonId": "2",
    "Products": [
      {
        "ProductId": "5",
        "Count": "1",
        "Note": "Not",
        "ReasonId": "1"
      },
      {
        "ProductId": "6",
        "Count": "1",
        "Note": "Not",
        "ReasonId": "2"
      }
    ]
  }
]
```

### `mobile/setLocation`

`POST https://magaza.example/rest1/mobile/setLocation/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `data` | query | text | evet | Kod verileri bulunuyorsa,   CountryCode,StateCode, CityCode, TownCode, DistrictCode  şeklinde de gönderim yapılabilir. |

```json
{
  "Country": "Türkiye",
  "State": "",
  "City": "İstanbul",
  "Town": "Esenler",
  "District": "Davutpaşa Mah"
}
```

### `mobile/availableDeliveryTimes`

`POST https://magaza.example/rest1/mobile/availableDeliveryTimes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

### `mobile/setDeliveryTime`

`POST https://magaza.example/rest1/mobile/setDeliveryTime/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `Id` | query | int | evet |  |
| `Date` | query | str | evet |  |

### `mobile/getCouponList`

`POST https://magaza.example/rest1/mobile/getCouponList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |

### `mobile/getAddress`

`POST https://magaza.example/rest1/mobile/getAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `Page` | query | str | hayır | 'order' olarak gönderilirse ilgili ülkeye ait siparişler döner |

### `mobile/setAddress`

`POST https://magaza.example/rest1/mobile/setAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `data` | query | text | hayır | Adress güncellenmek istendiğinde address_id parametresi sıfırdan büyük bir değer gönderilmelidir. |

Örnek `data` alanları: `address_id`, `title`, `country_code`, `province_code`, `city_code`, `town_code`, `address`, `company`, `district`, `fullname`, `is_company_active`, `mobile_phone`, `nationality`, `identity_number`, `tax_number`, `tax_office`, `post_code`, `has_e_invoice`.
```json
[
  {
    "address_id": 0,
    "title": "İş Adresim",
    "country_code": "TR",
    "province_code": "",
    "city_code": "34",
    "town_code": "941",
    "address": "Teknopark No:104",
    "company": "",
    "district": "",
    "fullname": "Kübra K",
    "is_company_active": 0,
    "mobile_phone": "905555555555",
    "nationality": 0,
    "identity_number": "66666666666",
    "tax_number": "66666666666",
    "tax_office": "",
    "post_code": "34104",
    "has_e_invoice": 0
  }
]
```

### `mobile/deleteAddress`

`POST https://magaza.example/rest1/mobile/deleteAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AddressId` | url_param | int | evet |  |
| `MobileToken` | query | str | hayır |  |

## Model

Model kayıtları.

### `model/getModelById`

`POST https://magaza.example/rest1/model/getModelById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ModelId` | url_param | int | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

### `model/getModelByName`

`POST https://magaza.example/rest1/model/getModelByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ModelName` | url_param | str | evet |  |
| `FetchShowcase` | query | bool | hayır |  |

### `model/getModels`

`POST https://magaza.example/rest1/model/getModels/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |
| `FetchShowcase` | query | bool | hayır |  |

### `model/setModels`

`POST https://magaza.example/rest1/model/setModels/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ModelCode`, `Name`, `IsActive`, `SeoLink`, `SeoTitle`, `SeoDescription`, `Showcase`.
```json
[
  {
    "ModelCode": "T6",
    "Name": "pink",
    "IsActive": "1",
    "SeoLink": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "Showcase": {
      "Top": "",
      "Bottom": "",
      "MobileTop": "",
      "MobileBottom": "",
      "Language": ""
    }
  }
]
```

### `model/addModelImageFromUrl`

`POST https://magaza.example/rest1/model/addModelImageFromUrl/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `ModelCode`, `Image1Url`, `Image2Url`.
```json
[
  {
    "ModelCode": "T11",
    "Image1Url": "",
    "Image2Url": ""
  }
]
```

### `model/addModelImageFromFile`

`POST https://magaza.example/rest1/model/addModelImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ModelCode` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | hayır | WebServis arayüz konsolu dışında gönderimlerde image_1 ve image_2 parametreleri kullanılabilir. |

### `model/addImageFromUrl`

`POST https://magaza.example/rest1/model/addImageFromUrl/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `ModelCode`, `ImageUrl`, `ListNo`, `Attributes`.
```json
[
  {
    "ModelCode": "T11",
    "ImageUrl": "",
    "ListNo": "99",
    "Attributes": [
      {
        "Attribute": "T51",
        "AttributeValue": "T21"
      },
      {
        "Attribute": "T51",
        "AttributeValue": "TS-20"
      }
    ]
  }
]
```

### `model/addImageFromFile`

`POST https://magaza.example/rest1/model/addImageFromFile/`

Katalog sistemlerinde kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | hayır |  |
| `image` | file | file | evet |  |

Örnek `data` alanları: `ModelCode`, `ListNo`, `Attributes`.
```json
[
  {
    "ModelCode": "T11",
    "ListNo": "99",
    "Attributes": [
      {
        "Attribute": "T51",
        "AttributeValue": "T21"
      },
      {
        "Attribute": "T51",
        "AttributeValue": "TS-20"
      }
    ]
  }
]
```

### `model/deleteModel`

`POST https://magaza.example/rest1/model/deleteModel/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ModelId`.
```json
[
  {
    "ModelId": ""
  }
]
```

## Order2

Sipariş oluşturma ve durum güncelleme. Eski sipariş sınıfı.

### `order2/createOrders` (alpha)

`POST https://magaza.example/rest1/order2/createOrders/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Üyeliksiz alışverişte CustomerId yerine CustomerCode,CustomerName,CustomerSurname,CustomerEmail parametreleri gönderilebilir.    İlgili json verisi içinde SendMailAdmin=1 olarak gönderilirse yöneticiye eposta gönderimi sağlanır.   SendMailAdminAddress verisi ile hangi mail adresine mail gönderileceği de belirlenebilir. Bu parametre belirtilmezse eposta adresini otomatik olarak sistemden alacaktır.    İlgili json verisiyle birlikte CheckBasketProducts ve PaymentUrlFetch parametreleri true gönderilirse addToCart metodu ile sepete eklenmiş ürünleri product olarak alır ve ödeme sayfasında giden webview url'ini döner.    İlgili json verisi içerisinde ürüne ait hediye paketi varsa GiftPackage parametresini 1 yoksa 0 olarak gönderilmelidir. |
| `CheckOrderCode` | query | bool | hayır | Bir platformda birden çok aynı platform sipariş kodu olması istenmiyorsa true gönderilmelidir. |
| `PaymentUrlFetch` | query | bool | hayır |  |
| `PaymentUrlSendEmail` | query | bool | hayır |  |
| `PaymentUrlSendSms` | query | bool | hayır |  |
| `CheckBasketProducts` | query | bool | hayır |  |

Örnek `data` alanları: `OrderCode`, `CustomerCode`, `CustomerId`, `Currency`, `PaymentTypeId`, `SubPaymentTypeId`, `OrderStatusId`, `InvoiceAddressId`, `InvoiceTitle`, `InvoiceName`, `InvoiceIdentityNumber`, `InvoiceTaxOffice`, `InvoiceTaxNumber`, `InvoiceMobile`, `InvoiceOtherPhone`, `InvoiceCountry`, `InvoiceCountryCode`, `InvoiceProvince`, `InvoiceCity`, `InvoiceTown`, `InvoiceDistrict`, `InvoiceAddress`, `InvoiceZipcode`, `InvoiceCoordinateY`, `InvoiceCoordinateX`, `DeliveryAddressId`, `DeliveryTitle`, `DeliveryName`, `DeliveryMobile`, `DeliveryOtherPhone`, `DeliveryCountry`, `DeliveryCountryCode`, `DeliveryProvince`, `DeliveryCity`, `DeliveryTown`, `DeliveryDistrict`, `DeliveryAddress`, `DeliveryZipcode`, `DeliveryCoordinateY`, `DeliveryCoordinateX`, `OrderTotalPrice`, `CargoCode`, `GeneralOrderNote`, `UtmSource`, `UtmMedium`, `MicroExport`, `OrderDate`, `Products`.
```json
[
  {
    "OrderCode": "SC6391830",
    "CustomerCode": "T110",
    "CustomerId": "234723",
    "Currency": "TL",
    "PaymentTypeId": "-2",
    "SubPaymentTypeId": "",
    "OrderStatusId": "4",
    "InvoiceAddressId": "",
    "InvoiceTitle": "İş Adresim",
    "InvoiceName": "Kübra K.",
    "InvoiceIdentityNumber": "",
    "InvoiceTaxOffice": "",
    "InvoiceTaxNumber": "12324445",
    "InvoiceMobile": "5070251250",
    "InvoiceOtherPhone": "",
    "InvoiceCountry": "Türkiye",
    "InvoiceCountryCode": "TR",
    "InvoiceProvince": "",
    "InvoiceCity": "İstanbul",
    "InvoiceTown": "Esenler",
    "InvoiceDistrict": "",
    "InvoiceAddress": "Yıldız Teknik Üniversitesi Davutpaşa Kampüsü",
    "InvoiceZipcode": "",
    "InvoiceCoordinateY": "",
    "InvoiceCoordinateX": "",
    "DeliveryAddressId": "",
    "DeliveryTitle": "İş adresim",
    "DeliveryName": "Kübra K.",
    "DeliveryMobile": "5070251250",
    "DeliveryOtherPhone": "",
    "DeliveryCountry": "Türkiye",
    "DeliveryCountryCode": "TR",
    "DeliveryProvince": "",
    "DeliveryCity": "İstanbul",
    "DeliveryTown": "Esenler",
    "DeliveryDistrict": "",
    "DeliveryAddress": "Yıldız Teknik Üniversitesi Davutpaşa Kampüsü",
    "DeliveryZipcode": "",
    "DeliveryCoordinateY": "",
    "DeliveryCoordinateX": "",
    "OrderTotalPrice": "250",
    "CargoCode": "",
    "GeneralOrderNote": "",
    "UtmSource": "",
    "UtmMedium": "",
    "MicroExport": "0",
    "OrderDate": "1429855185",
    "Products": [
      {
        "ProductCode": "T625",
        "VariantType1": "",
        "VariantType2": "",
        "SubProductCode": "",
        "Quantity": "1",
        "OrderNote": "",
        "GiftPackage": "0"
      }
    ]
  }
]
```

### `order2/deleteOrders`

`POST https://magaza.example/rest1/order2/deleteOrders/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderId`.
```json
[
  {
    "OrderId": ""
  }
]
```

### `order2/getCargoCompanyList`

`POST https://magaza.example/rest1/order2/getCargoCompanyList/`

Kargo firmalarını listeler. Her firma için döndürülen alanlar:
- Id, Code, Name, Type, ListNo
- IsActiveForCustomer: Üye için aktif mi (true/false)
- IsActiveForVendor: Bayi için aktif mi (true/false)
- Returnable: Kargo firması iade için kullanılabilir mi (true/false)
- Integrator: Kargo entegrasyonu adı (örn. yurtici, hepsijet)
- RequiresPickDate: Randevulu alım gerektirir mi (true/false). true ise platform/getReturnPickDates üzerinden uygun tarih listesi çekilmelidir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Name` | query | str | hayır | Kargo firması adına göre filtreler. Kısmi eşleşme yapılır, gönderilen değeri içeren tüm kargo firmaları listelenir. Örnek: Name=Yurtiçi |

### `order2/setCargoCompany`

`POST https://magaza.example/rest1/order2/setCargoCompany/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CalculateType: Kargo firmasının hesaplama türü. Desi, Kg, Desi2, Fiyat olarak gönderilebilir.  ListNo: Kargo firması için tanımlı liste numarasıdır. IsActiveForCustomer,IsActiveForVendor,IsPaymentTypeActive,IsDefaultCargo değerleri true(1) yada false(0) gönderilebilir  Örnek: {"CompanyCode":"T1","CalculateType":"Desi","ListNo":"99"} |

Örnek `data` alanları: `CompanyCode`, `CompanyName`, `CalculateType`, `IsActiveForCustomer`, `IsActiveForVendor`, `IsPaymentTypeActive`, `IsDefaultCargo`, `ListNo`.
```json
[
  {
    "CompanyCode": "T1",
    "CompanyName": "",
    "CalculateType": "Desi",
    "IsActiveForCustomer": 0,
    "IsActiveForVendor": 0,
    "IsPaymentTypeActive": 0,
    "IsDefaultCargo": 0,
    "ListNo": "99"
  }
]
```

### `order2/getCargoPricing`

`POST https://magaza.example/rest1/order2/getCargoPricing/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CompanyId` | url_param | int | hayır |  |
| `Name` | query | str | hayır | Kargo firması adına göre filtreler. Kısmi eşleşme yapılır, gönderilen değeri içeren tüm kargo firmaları listelenir. CompanyId ile birlikte gönderilirse, ilgili firma yalnızca adı da eşleşiyorsa döner. Örnek: Name=Yurtiçi |

### `order2/getCustomerIdOfOrder`

`POST https://magaza.example/rest1/order2/getCustomerIdOfOrder/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | int | evet |  |

### `order2/getOrderDetails`

`POST https://magaza.example/rest1/order2/getOrderDetails/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderStatusId` | query | str | hayır | Default gelen süreçler: 2,3,4,5,6,7,8,11,12,13 İptal edildi için 9, İade Edildi için 10 durumlarını da ekleyin. |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

### `order2/getOrderDetailsByOrderId`

`POST https://magaza.example/rest1/order2/getOrderDetailsByOrderId/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | int | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

### `order2/getOrders`

`POST https://magaza.example/rest1/order2/getOrders/`

<a href="/rest1/console?new#order/get">Bu metoda alternatif olarak yeni geliştirilen order/get metodu mevcuttur. order/get metodunun kullanılması önerilir.</a>

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderDateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `OrderDateTimeEnd` | query | str | hayır |  |
| `UpdateDateTimeStart` | query | str | hayır |  |
| `UpdateDateTimeEnd` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `OrderStatusId` | query | str | hayır | Default gelen süreçler: 2,3,4,5,6,7,8,11,12,13 İptal edildi için 9, İade Edildi için 10 durumlarını da ekleyin. |
| `IsTransferred` | query | str | hayır | Aktarılanlar için '1', aktarılmayanlar için '0' girilmeli |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `FetchCustomerGroupInfo` | query | bool | hayır |  |
| `IsVendor` | query | bool | hayır |  |
| `CustomerGroupCode` | query | str | hayır |  |
| `FetchInvoiceDetails` | query | bool | hayır |  |
| `InvoiceNumber` | query | str | hayır |  |
| `InvoiceDateTimeStart` | query | str | hayır | Example: "2014-07-21T20:09:00Z", 1374475843 |
| `InvoiceDateTimeEnd` | query | str | hayır | Example: "2014-08-21T20:09:00Z", 1374475843 |
| `noDetails` | query | bool | hayır |  |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchAdditionalCustomerData` | query | bool | hayır |  |
| `FetchAdditionalCustomerAllData` | query | bool | hayır |  |
| `FetchAdditionalCCNumber` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchAdditionalTransaction` | query | bool | hayır |  |
| `FetchOrderReferrer` | query | bool | hayır |  |
| `FetchAddressCode` | query | bool | hayır |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

Postman B2C çağrısı `IsVendor=false` ve `OrderDateTimeEnd={{currentdate}}` gönderir. B2B çağrısı `IsVendor=true` ve `OrderDateTimeEnd=2024-05-19` gönderir. İkisinde `OrderDateTimeStart={{tendaysago}}`, `OrderStatusId=3`, `FetchCustomerGroupInfo=true`, `FetchAdditionalCCNumber=true`, `orderby=OrderDate DESC`.

### `order2/getOrderStatusList`

`POST https://magaza.example/rest1/order2/getOrderStatusList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| ` ` | query | str | hayır |  |
| `FetchOrderCount` | query | bool | hayır |  |
| `FetchWithPassive` | query | bool | hayır |  |

Postman bu uca `data` içinde `OrderCode` (`SP08034`) gönderir. Konsol parametre listesinde `data` yoktur.

### `order2/getPaymentTypeList`

`POST https://magaza.example/rest1/order2/getPaymentTypeList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `order2/getPostStatus`

`POST https://magaza.example/rest1/order2/getPostStatus/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `order2/setPostStatus`

`POST https://magaza.example/rest1/order2/setPostStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `order` | query | text | evet |  |
| `status` | query | int | evet |  |
| `postNote` | query | text | evet |  |

Örnek `order` alanları: `orderId`, `productId`.
```json
[
  {
    "orderId": "98",
    "productId": "689"
  }
]
```

```json
"2"
```

```json
"Stokta kalmadı"
```

### `order2/setAddress` (alpha)

`POST https://magaza.example/rest1/order2/setAddress/`

LisansEihracat lisansının açıklığına göre set edilemeyecek adreslerin kontrolü kullanıcıya bırakılmıştır. platform/getAvaliableAddress metodundan kontrol sağlanabilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Adres Tipleri:   1: sadece teslimat adresi   2: sadece fatura adresi   3: hem teslimat, hem fatura adresi |

Örnek `data` alanları: `customer_id`, `address_type`, `address_id`.
```json
[
  {
    "customer_id": "110",
    "address_type": "2",
    "address_id": "5"
  }
]
```

### `order2/setSupplyStatus`

`POST https://magaza.example/rest1/order2/setSupplyStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | "Status" verisinin alabileceği değerler.  0: Oluşturuldu  1:Tedarik Edilecek  2:Tedarik Bildirildi  3:Tedarik Edildi  4:Tedarik Edilmedi  5:İptal Edildi    OrderCode yerine OrderId, ProductCode yerine ProductId gönderilebilir.   Alt ürünlerde güncelleme için SubProductCode ve ya SubProductId gönderilebilir |

Örnek `data` alanları: `OrderCode`, `ProductCode`, `Status`, `StatusNote`.
```json
[
  {
    "OrderCode": "TS06057441",
    "ProductCode": "T689",
    "Status": 5,
    "StatusNote": ""
  }
]
```

### `order2/setCargoPricing`

`POST https://magaza.example/rest1/order2/setCargoPricing/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | PriceId gönderilirse güncelleme yapılır. PriceId gönderilmezse, ilgili kargo firması için aynı alt/üst limit aralığına sahip kayıt varsa güncelleme, yoksa yeni kayıt eklenir. PriceId değeri getCargoPricing servisinden alınabilir.  Yeni kayıt eklenirken kargo firmasının kimliği (CompanyId veya CompanyCode) zorunludur. |

Örnek `data` alanları: `PriceId`, `LowerLimit`, `UpperLimit`, `LocalPrice`, `IntercityPrice`, `InternationalPrice`, `Region1`, `Region2`, `Region3`, `Region4`, `Region5`, `Region6`, `Region7`, `Region8`, `Region9`, `Region10`, `Region11`, `Region12`, `Region13`, `Region14`, `Region15`, `Region16`, `Region17`, `Region18`, `Region19`, `Region20`, `Region21`, `Region22`, `Region23`, `Region24`, `Region25`, `Region26`, `Region27`, `Region28`, `Region29`, `Region30`.
```json
[
  {
    "PriceId": "",
    "LowerLimit": "",
    "UpperLimit": "",
    "LocalPrice": "",
    "IntercityPrice": "",
    "InternationalPrice": "",
    "Region1": "0.00",
    "Region2": "0.00",
    "Region3": "0.00",
    "Region4": "0.00",
    "Region5": "0.00",
    "Region6": "0.00",
    "Region7": "0.00",
    "Region8": "0.00",
    "Region9": "0.00",
    "Region10": "0.00",
    "Region11": "0.00",
    "Region12": "0.00",
    "Region13": "0.00",
    "Region14": "0.00",
    "Region15": "0.00",
    "Region16": "0.00",
    "Region17": "0.00",
    "Region18": "0.00",
    "Region19": "0.00",
    "Region20": "0.00",
    "Region21": "0.00",
    "Region22": "0.00",
    "Region23": "0.00",
    "Region24": "0.00",
    "Region25": "0.00",
    "Region26": "0.00",
    "Region27": "0.00",
    "Region28": "0.00",
    "Region29": "0.00",
    "Region30": "0.00"
  }
]
```

### `order2/updateInvoiceDetails`

`POST https://magaza.example/rest1/order2/updateInvoiceDetails/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | InvoiceDate example:  "2015-10-12T07:09:00Z", 1444622940   EarchiveUuid bu parametre Digital Planet tarafından e fatura ya da e arşiv kesildiği zaman Digiltal Planet tarafından iletilen fatura id bilgisidir.  IsEarchive parametresi ise fatura tipinin ne olduğunu belirlemektedir " IsEarchive " versinin alabileceği değerler.  0: Normal   1: E-Arşiv   2: E-Fatura |

Örnek `data` alanları: `OrderCode`, `InvoiceDate`, `InvoiceNumber`, `WaybillNumber`, `IsInvoiced`, `EInvoiceLink`, `IsEarchive`, `EarchiveUuid`.
```json
[
  {
    "OrderCode": "SP0210195",
    "InvoiceDate": "2015-10-12T07:09:00Z",
    "InvoiceNumber": "1111",
    "WaybillNumber": "2222",
    "IsInvoiced": "1",
    "EInvoiceLink": "https://ornek.com/ornekfatura123.pdf",
    "IsEarchive": "1",
    "EarchiveUuid": "1A1886B8-87SAD-4F1D-9F1D-1A1886B8"
  }
]
```

### `order2/updateOrderStatusAsCancelled`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsCancelled/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`.
```json
[
  {
    "OrderCode": "SP08034"
  }
]
```

### `order2/updateOrderStatusAsCargoReady`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsCargoReady/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`.
```json
[
  {
    "OrderCode": "SP08034"
  }
]
```

Postman `updateOrderStatusAsCargoReady` aynı `OrderCode` değerini gönderir.

### `order2/updateOrderStatusAsDelivered`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsDelivered/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`.
```json
[
  {
    "OrderCode": "SP08034"
  }
]
```

### `order2/updateOrderStatusAsSentToCargo`

`POST https://magaza.example/rest1/order2/updateOrderStatusAsSentToCargo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`, `CargoCode`, `CargoTrackingCode`, `Shipment`.
```json
[
  {
    "OrderCode": "SP08034",
    "CargoCode": "T1",
    "CargoTrackingCode": "ER34342",
    "Shipment": {
      "CargoKey": "789654",
      "CargoTrackingNo": "CR789654",
      "CargoTrackingUrl": "http://cargocampany.com/tracking/CR789654",
      "BarcodeLink": "http://cargocampany.com/tracking/CR789654"
    }
  }
]
```

### `order2/updateOrderStatusAs`

`POST https://magaza.example/rest1/order2/updateOrderStatusAs/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderStatusId` | url_param | str | evet | Bu parametre data içinde yine OrderStatusId şeklinde her sipariş için ayrı gönderilebilir.   NOT : data içinde gönderilirse burada boş bırakılmalıdır. (gönderilmemelidir) |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`, `CargoCode`, `CargoTrackingCode`, `Shipment`.
```json
[
  {
    "OrderCode": "TS1703182",
    "CargoCode": "T1",
    "CargoTrackingCode": "ER34342",
    "Shipment": {
      "CargoKey": "789654",
      "CargoTrackingNo": "CR789654",
      "CargoTrackingUrl": "http://cargocampany.com/tracking/CR789654",
      "BarcodeLink": "http://cargocampany.com/tracking/CR789654"
    }
  }
]
```

### `order2/setTransferredStatus`

`POST https://magaza.example/rest1/order2/setTransferredStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | OrderId veya OrderCode gönderilebilir. |

Örnek `data` alanları: `OrderCode`, `IsTransferred`, `TransferNote`.
```json
[
  {
    "OrderCode": "TS1703182",
    "IsTransferred": "0",
    "TransferNote": ""
  }
]
```

### `order2/cargoTracking`

`POST https://magaza.example/rest1/order2/cargoTracking/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | str | evet |  |

### `order2/getOrderNote`

`POST https://magaza.example/rest1/order2/getOrderNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "IsNote \| 1 \| equal" |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

### `order2/setOrderNote`

`POST https://magaza.example/rest1/order2/setOrderNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderId`, `AdminId`, `CustomerId`, `Text`.
```json
[
  {
    "OrderId": "168",
    "AdminId": "123",
    "CustomerId": "231",
    "Text": "Sipariş notunuz"
  }
]
```

## Order

Güncel sipariş okuma, arşiv, iade, kargo ve sevkiyat.

### `order/proceed` (alpha)

`POST https://magaza.example/rest1/order/proceed/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Application: Uygulama logosunun eklenmesi için gereklidir.   CodePrefix: Sipariş numarasının başındaki kodu belirler. |

```json
{
  "CustomerId": "",
  "InvoiceAddressId": "",
  "DeliveryAddressId": "",
  "CargoCompanyId": "",
  "CouponCode": "",
  "CampaignId": "",
  "Application": "",
  "CodePrefix": ""
}
```

### `order/get`

`POST https://magaza.example/rest1/order/get/`

<strong>NOT :</strong> Bu metotda sipariş fiyatları site parabiriminde (SiteDefaultCurrency) dönmektedir. Sipariş parabirimine (Currency) çevirmek için ExchangeRate oranına bölebilirsiniz.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderDateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `OrderDateTimeEnd` | query | str | hayır |  |
| `UpdateDateTimeStart` | query | str | hayır |  |
| `UpdateDateTimeEnd` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `OrderStatusId` | query | str | hayır | Varsayılan olarak 1,9, ve 10 durumları dışındaki siparişler gelmektedir. Yani varsayılan olarak henüz tamamlanmamış, iptal edilmiş veya iade edilmiş siparişler dışındaki siparişler gelmektedir. Bu parametre 'all' gönderilirse tamamlanmamış siparişler haricindeki tüm siparişler gelecektir. 'all_with_incompleted' gönderilirse tüm tamamlanmamışlar da dahil edilip dönecektir. |
| `IsTransferred` | query | str | hayır | Aktarılanlar için '1', aktarılmayanlar için '0' girilmeli |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `Translation` | query | str | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `SupplyStatus` | query | str | hayır | Tedarik durumu |
| `FetchCustomerGroupInfo` | query | bool | hayır |  |
| `IsVendor` | query | bool | hayır |  |
| `CustomerGroupCode` | query | str | hayır |  |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchProductAdditionalData` | query | bool | hayır |  |
| `FetchProductFallbackData` | query | bool | hayır | Sipariş ürünü barkodu boş ise ürün/alt ürün barkodundan tamamlar. |
| `FetchReturnStatus` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchCustomerData` | query | bool | hayır |  |
| `FetchInvoiceAddress` | query | bool | hayır |  |
| `FetchDeliveryAddress` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchCargoDetail` | query | bool | hayır |  |
| `FetchOnlyHasShipment` | query | bool | hayır |  |
| `FetchShipmentDetail` | query | bool | hayır |  |
| `FetchDeleteds` | query | bool | hayır |  |
| `FetchPaymentData` | query | bool | hayır |  |
| `FetchSubPaymentData` | query | bool | hayır |  |
| `FetchOnlyReturns` | query | bool | hayır |  |
| `FetchOrderReferrer` | query | bool | hayır |  |
| `FetchCargoInfo` | query | bool | hayır |  |
| `FetchCurrenciesFromHistory` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

### `order/calculatePrices`

`POST https://magaza.example/rest1/order/calculatePrices/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

```json
{
  "CustomerId": 123,
  "Currency": "TL",
  "PaymentTypeId": "-2",
  "SubPaymentTypeId": "",
  "DeliveryAddressId": "",
  "DeliveryTitle": "İş adresim",
  "DeliveryName": "Tsoft Test",
  "DeliveryMobile": "5070251250",
  "DeliveryOtherPhone": "",
  "DeliveryCountry": "Türkiye",
  "DeliveryCity": "İstanbul",
  "DeliveryTown": "Esenler",
  "DeliveryDistrict": "",
  "DeliveryAddress": "Yıldız Teknik Üniversitesi Davutpaşa Kampüsü",
  "DeliveryZipcode": "",
  "Products": [
    {
      "ProductCode": "T625",
      "VariantType1": "",
      "VariantType2": "",
      "SubProductCode": "",
      "Quantity": "1"
    }
  ]
}
```

### `order/unArchive`

`POST https://magaza.example/rest1/order/unArchive/`

Sipariş veya siparişleri arşivden geri döndermek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderIds` | query | int | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `OrderCodes` | query | str | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : TS10047427\|TS10047428 |

### `order/archive`

`POST https://magaza.example/rest1/order/archive/`

Sipariş veya siparişleri arşive eklemek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderIds` | query | int | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `OrderCodes` | query | str | hayır | OrderIds veya OrderCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : TS10047427\|TS10047428 |

### `order/statistics` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/statistics/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StartDate` | query | text | hayır | Örn : 2019-09-10 |
| `EndDate` | query | text | hayır | Örn : 2019-09-15 |

### `order/getDeliveryRegion`

`POST https://magaza.example/rest1/order/getDeliveryRegion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | query | text | hayır | Ülke => Country, İl => City, ilçe => Town, Mahalle => District, Eyalet => State |
| `ParentCode` | query | text | hayır |  |
| `Name` | query | text | hayır |  |
| `ParentName` | query | text | hayır |  |
| `FetchCityAndDistrict` | query | bool | hayır |  |
| `FetchWithCargoCompany` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

### `order/setDeliveryRegion`

`POST https://magaza.example/rest1/order/setDeliveryRegion/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type parametresi :   Ülke => Country, Eyalet => State, İl => City, ilçe => Town, Mahalle => District    ParentCode Yerine ParentName de gönderilebilir.    HasState Paremetresi sadece eyaleti olan ülkelerde 1 olarak gönderilmeli. diğer işlemler için kullanılmayabilir.   Teslimat bölgelerine kargo firması eklenmek istenirse CargoCompanyIds keyi ile birlikte gönderilebilir örn: "CargoCompanyIds": "1,2,3" |

Örnek `data` alanları: `Code`, `Name`, `AreaCode`, `Type`, `IsActive`, `ParentCode`, `IsLocal`, `ShippingZone`, `Pattern`, `HasState`, `Platform`, `PostalCodeRegex`.
```json
[
  {
    "Code": "TR",
    "Name": "Türkiye",
    "AreaCode": 1,
    "Type": "Country",
    "IsActive": 0,
    "ParentCode": "",
    "IsLocal": 0,
    "ShippingZone": "B1",
    "Pattern": "(___) ___ __ __",
    "HasState": 0,
    "Platform": "",
    "PostalCodeRegex": ""
  }
]
```

### `order/deleteDeliveryRegion`

`POST https://magaza.example/rest1/order/deleteDeliveryRegion/`

En az bir koşul girmek zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | query | text | hayır |  |
| `Name` | query | text | hayır |  |
| `Type` | query | text | hayır | Ülke => Country, İl => City, ilçe => Town, Mahalle => District, Eyalet => State |
| `ParentCode` | query | text | hayır |  |
| `ParentName` | query | text | hayır |  |
| `Platform` | query | text | hayır |  |
| `CreatedBy` | query | text | hayır |  |

### `order/setCargoRegionStatus`

`POST https://magaza.example/rest1/order/setCargoRegionStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | 1. Type parametresi :   Ülke => Country, Eyalet => State, İl => City, ilçe => Town, Mahalle => District    2. Eğer Code alanı bilinmiyorsa   Type: Country ise sadece CountryName alanı   Type : City ise CountryName ve CityName alanları   Type : Town ise CountryName, CityName ve TownName alanları   Type : District ise CountryName, CityName, TownName ve DistrictName alanları gönderilmelidir   3. CargoId yerine CargoCode gönderilebilir   örn: "CargoCode": "T1" |

Örnek `data` alanları: `Code`, `Type`, `CargoId`, `IsActive`.
```json
[
  {
    "Code": "60",
    "Type": "City",
    "CargoId": 3,
    "IsActive": true
  }
]
```

### `order/getRefunds`

`POST https://magaza.example/rest1/order/getRefunds/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderCode` | query | str | hayır |  |
| `TransactionNo` | query | str | hayır |  |
| `DateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `DateTimeEnd` | query | str | hayır |  |
| `IsApproved` | query | str | hayır | işlenenler için '1', aktarılmayanlar için '0' girilmeli |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `orderByField` | query | str | hayır | Default: CreateDate |
| `orderByDirection` | query | str | hayır | Default: DESC |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchDetail` | query | bool | hayır |  |

### `order/setRefund`

`POST https://magaza.example/rest1/order/setRefund/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Id`, `Approved`.
```json
[
  {
    "Id": "168",
    "Approved": "1"
  }
]
```

### `order/getReturns`

`POST https://magaza.example/rest1/order/getReturns/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | query | int | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `ReturnStatusId` | query | str | hayır |  |
| `ReturnReasonId` | query | str | hayır |  |
| `ShipmentId` | query | str | hayır |  |
| `ShipmentCode` | query | str | hayır |  |
| `Translation` | query | str | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `FetchReturnProductData` | query | bool | hayır |  |
| `FetchOrderDetail` | query | bool | hayır |  |
| `FetchOrderDetailExchangeRate` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

### `order/updateReturnStatus`

`POST https://magaza.example/rest1/order/updateReturnStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | OrderCode yerine güncellenmek istenilen siparişin iade Id'si gönderilebilir. Örn: "Id":"11"    * Status değerine order/getReturnStatusList metodundan dönen Id verisi gönderilmeli    Status veya Products verilerinden herhangi biri gönderilebilir. Gönderilmeyen veri üzerinde işlem yapılmaz. |

Örnek `data` alanları: `OrderCode`, `Status`, `CargoCompany`, `ShipmentCode`, `Products`.
```json
[
  {
    "OrderCode": "SP08034",
    "Status": "",
    "CargoCompany": "",
    "ShipmentCode": "",
    "Products": [
      {
        "ProductId": "5",
        "SubProductId": "0",
        "Note": "Not",
        "Status": "1",
        "ReturnCount": "1"
      },
      {
        "ProductId": "6",
        "SubProductId": "0",
        "Note": "Not",
        "Status": "2",
        "ReturnCount": "1"
      }
    ]
  }
]
```

### `order/updateReturnNote`

`POST https://magaza.example/rest1/order/updateReturnNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | * Id değerine order/getReturns metodundan dönen Id verisi gönderilmelidir. Gönderilmeyen veri üzerinde işlem yapılmaz. |

Örnek `data` alanları: `Id`, `Note`.
```json
[
  {
    "Id": "123",
    "Note": ""
  }
]
```

### `order/getReturnStatusList`

`POST https://magaza.example/rest1/order/getReturnStatusList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| ` ` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `order/getReturnReasonList`

`POST https://magaza.example/rest1/order/getReturnReasonList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| ` ` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `order/setCustomData`

`POST https://magaza.example/rest1/order/setCustomData/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderCode`, `CustomData`, `CustomData2`, `CustomData3`, `CustomData4`.
```json
[
  {
    "OrderCode": "",
    "CustomData": "",
    "CustomData2": "",
    "CustomData3": "",
    "CustomData4": ""
  }
]
```

### `order/createShipment` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/createShipment/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Kısmi sevkiyat eklemek için kullanılır.    OrderKey kullanıcı tarafından oluşturulmuş benzersiz key, sistemde varsa güncelleme yapar.(gönderilmezse sistem kendi oluşturur.),   Products->Id değerine order/get metodundan dönen OrderProductId verisi gönderilmelidir.    GrandTotal,IncludeDutyFee,IncludeCargoFee,IncludeServiceFee,CargoCompanyId ve Products verisi sadece sevkiyat oluşturma esnasında geçerlidir. Güncelleme esnasında önemsenmez. |

Örnek `data` alanları: `OrderKey`, `OrderNumber`, `CargoKey`, `CargoTrackingNo`, `CargoTrackingUrl`, `BarcodeLink`, `RealTotalDesi`, `Desi`, `RealCargoAmount`, `EngagedInProcessingBranchOffice`, `StatusDesc`, `UpdateDate`, `GrandTotal`, `IncludeDutyFee`, `IncludeCargoFee`, `IncludeServiceFee`, `CargoCompanyId`, `Products`.
```json
[
  {
    "OrderKey": "",
    "OrderNumber": "",
    "CargoKey": "",
    "CargoTrackingNo": "",
    "CargoTrackingUrl": "",
    "BarcodeLink": "",
    "RealTotalDesi": "",
    "Desi": "",
    "RealCargoAmount": "",
    "EngagedInProcessingBranchOffice": "",
    "StatusDesc": "",
    "UpdateDate": "",
    "GrandTotal": "",
    "IncludeDutyFee": 0,
    "IncludeCargoFee": 0,
    "IncludeServiceFee": 0,
    "CargoCompanyId": "",
    "Products": [
      {
        "Id": "",
        "Quantity": ""
      }
    ]
  }
]
```

### `order/cancelShipment`

`POST https://magaza.example/rest1/order/cancelShipment/`

Kısmi sevkiyat iptali için kullanılır.ShipmentId veya OrderKey parametrelerinden biri kullanılabilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ShipmentId` | query | int | hayır |  |
| `OrderKey` | query | str | hayır |  |

### `order/getPlatform` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/getPlatform/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `order/getRepresentative` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/getRepresentative/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `order/getNote`

`POST https://magaza.example/rest1/order/getNote/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchDetail` | query | bool | hayır |  |

### `order/getOrderPackage`

`POST https://magaza.example/rest1/order/getOrderPackage/`

<strong>NOT :</strong> Bu metotda sipariş fiyatları site parabiriminde (SiteDefaultCurrency) dönmektedir. Sipariş parabirimine (Currency) çevirmek için ExchangeRate oranına bölebilirsiniz.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderDateTimeStart` | query | str | hayır | Example: "2011-07-21T20:09:00Z", 1374475843 |
| `OrderDateTimeEnd` | query | str | hayır |  |
| `UpdateDateTimeStart` | query | str | hayır |  |
| `UpdateDateTimeEnd` | query | str | hayır |  |
| `OrderCode` | query | str | hayır |  |
| `OrderStatusId` | query | str | hayır | Varsayılan olarak 9, ve 10 durumları dışındaki siparişler gelmektedir. Yani varsayılan olarak iptal edilmiş veya iade edilmiş siparişler dışındaki siparişler gelmektedir. Bu parametre 'all_with_incompleted' gönderilirse tüm tamamlanmamışlar da dahil edilip dönecektir. |
| `IsTransferred` | query | str | hayır | Aktarılanlar için '1', aktarılmayanlar için '0' girilmeli |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |
| `Translation` | query | str | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchProductAdditionalData` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchCustomerData` | query | bool | hayır |  |
| `FetchInvoiceAddress` | query | bool | hayır |  |
| `FetchDeliveryAddress` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchCargoDetail` | query | bool | hayır |  |
| `FetchDeleteds` | query | bool | hayır |  |
| `FetchPaymentData` | query | bool | hayır |  |
| `FetchSubPaymentData` | query | bool | hayır |  |
| `FetchOnlyReturns` | query | bool | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "OrderId,OrderCode,OrderDate" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |

### `order/setShipment`

`POST https://magaza.example/rest1/order/setShipment/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Kısmi sevkiyat eklemek için kullanılır.    OrderKey kullanıcı tarafından oluşturulmuş benzersiz key, sistemde varsa güncelleme yapar.(gönderilmezse sistem kendi oluşturur.),   Products->Id değerine order/get metodundan dönen OrderProductId verisi gönderilmelidir.   StoreId değerine order/getWarehouse metodundan dönen StoreId verisi gönderilmelidir.    GrandTotal,IncludeDutyFee,IncludeCargoFee,IncludeServiceFee,CargoCompanyId ve Products verisi sadece sevkiyat oluşturma esnasında geçerlidir. Güncelleme esnasında önemsenmez. |

Örnek `data` alanları: `OrderKey`, `OrderNumber`, `StoreId`, `CargoKey`, `CargoTrackingNo`, `CargoTrackingUrl`, `CargoCount`, `BarcodeLink`, `RealTotalDesi`, `Desi`, `RealCargoAmount`, `EngagedInProcessingBranchOffice`, `StatusDesc`, `UpdateDate`, `GrandTotal`, `IncludeDutyFee`, `IncludeCargoFee`, `IncludeServiceFee`, `CargoCompanyId`, `Products`.
```json
[
  {
    "OrderKey": "",
    "OrderNumber": "",
    "StoreId": "",
    "CargoKey": "",
    "CargoTrackingNo": "",
    "CargoTrackingUrl": "",
    "CargoCount": "",
    "BarcodeLink": "",
    "RealTotalDesi": "",
    "Desi": "",
    "RealCargoAmount": "",
    "EngagedInProcessingBranchOffice": "",
    "StatusDesc": "",
    "UpdateDate": "",
    "GrandTotal": "",
    "IncludeDutyFee": 0,
    "IncludeCargoFee": 0,
    "IncludeServiceFee": 0,
    "CargoCompanyId": "",
    "Products": [
      {
        "Id": "",
        "Quantity": ""
      }
    ]
  }
]
```

### `order/updatePackageStatus`

`POST https://magaza.example/rest1/order/updatePackageStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | ShipmentId yerine OrderKey ile işlem yapılabilir |

Örnek `data` alanları: `ShipmentId`, `ShipmentStatusId`.
```json
[
  {
    "ShipmentId": "",
    "ShipmentStatusId": ""
  }
]
```

### `order/setPayWithIyzico` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/order/setPayWithIyzico/`

DİKKAT !: Gönderilmeyen veriler silinecektir. Metoda tüm verileri göndermeniz beklenir

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | OnlyGeneralSettings Sadece genel ayarlar güncellenmek isteniyorsa 'true' gönderilmesi beklenir    Mode test için 'TEST', canlı ortam için 'LIVE' gönderilmelidir    Method 'iframe' ya da 'pwi' gönderilmelidir.    Currancy'ın alabileceği değerler 'TRY','USD', 'EUR', 'GBP', 'CHF', 'NOK', 'RUB'    Category 'PC', 'GOLD', 'FOOD', 'PHONE', 'TABLET', 'OTHER' değerlerini alabilir.    CardStorage '0' veya '1'    WithProduct '0' veya '1' Aktif olduğunda iyzico tarafında şiparişteki tutarlar ayrı bir kalem olarak gönderilecektir. T-Soft paneli üzerinden iade işlemi mümkün olmayabilir     Kategori Eşleştirme,    IyzicoCategory alabileceği değerler:    PC, GOLD, FOOD, PHONE, TABLET, OTHER    Daha önceden var olan kategori eşlemeleri gönderilmezse silinir    ActivityLimit 0 veya 1   MaxLimit 0 veya 1   ViewMember 0 veya 1   ViewVendor 0 veya 1 |

Örnek `data` alanları: `OnlyGeneralSettings`, `Mode`, `Method`, `ApiKey`, `SecretKey`, `Currency`, `Category`, `CardStorage`, `WithProducts`, `CategoryMap`, `GeneralSettings`.
```json
[
  {
    "OnlyGeneralSettings": "false",
    "Mode": "",
    "Method": "",
    "ApiKey": "",
    "SecretKey": "",
    "Currency": "",
    "Category": "",
    "CardStorage": "",
    "WithProducts": "",
    "CategoryMap": [
      {
        "CategoryCode": "",
        "IyzicoCategory": ""
      }
    ],
    "GeneralSettings": [
      {
        "ActivityLimit": "",
        "MaxLimit": "",
        "ViewMember": "",
        "ViewVendor": "",
        "ListNo": "",
        "InvoiceAdditionalServiceDescription": ""
      }
    ]
  }
]
```

### `order/getWarehouse`

`POST https://magaza.example/rest1/order/getWarehouse/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |

### `order/getOrderPlatforms`

`POST https://magaza.example/rest1/order/getOrderPlatforms/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Code` | query | text | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |

### `order/setShipByAt`

`POST https://magaza.example/rest1/order/setShipByAt/`

Pazaryeri entegrasyonundan gelen son kargoya verilme tarihini siparişe yazar. OrderId veya OrderCode alanlarından biri zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `OrderId`, `OrderCode`, `ShipByAt`.
```json
[
  {
    "OrderId": "",
    "OrderCode": "",
    "ShipByAt": ""
  }
]
```

## Personalization

Ürün kişiselleştirme formları.

### `personalization/getForm`

`POST https://magaza.example/rest1/personalization/getForm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `FormId` | url_param | int | evet |  |

## TrackingCode

İzleme kodları.

### `trackingCode/get`

`POST https://magaza.example/rest1/trackingCode/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | hayır |  |
| `GeneratedBy` | query | text | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır |  |

### `trackingCode/set`

`POST https://magaza.example/rest1/trackingCode/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type için aşağıdakilerden uygun olan id'yi giriniz:   1:HTML </head> Öncesine Kod Ekle,  2:HTML <body> sonrası izleme kodları (Örn: Google Universal Analytics İzleme Kodu),   3:HTML </body> öncesi izleme kodları (Örn: Yandex Metrica İzleme Kodu),   4:Üye Onay Sayfasına Kod Ekle ,   5:Üye Onay Sayfası </head> Öncesine Kod Ekle   6:Blok Kodları |

Örnek `data` alanları: `Id`, `Description`, `Code`, `Type`, `BlockId`, `Status`, `ListNo`, `GeneratedBy`.
```json
[
  {
    "Id": "",
    "Description": "",
    "Code": "",
    "Type": "",
    "BlockId": "",
    "Status": "",
    "ListNo": "",
    "GeneratedBy": ""
  }
]
```

### `trackingCode/delete`

`POST https://magaza.example/rest1/trackingCode/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | hayır |  |
| `GeneratedBy` | query | text | hayır |  |

## Product

Ürün oluşturma, stok, fiyat, görsel, etiket ve dil.

### `product/get`

`POST https://magaza.example/rest1/product/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | query | int | hayır |  |
| `ProductIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `ProductCode` | query | str | hayır |  |
| `Barcode` | query | str | hayır |  |
| `ProductName` | query | str | hayır |  |
| `CategoryIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `BrandIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `CustomerGroupDisplayIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `ModelCode` | query | text | hayır |  |
| `Translation` | query | str | hayır | Çeviri yapılacak diller. Örn.: Translation=en,ar |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `columns` | query | text | hayır | Example: "ProductId,ProductCode,ProductName" |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Example: "OrderId ASC" |
| `CustomerGroupCode` | query | str | hayır | İstenilen grup fiyatlarını çekmek için kullanılır. (Örnek : TZ0\|TB1) |
| `FlexiblePrices` | query | str | hayır | Örnek : Price3,Price4 (product/fields metodundan erişilebilir.) |
| `StockFields` | query | str | hayır | Örnek : Stock2,Stock3 (product/fields metodundan erişilebilir.) |
| `FetchDiscountedPriceDetail` | query | bool | hayır | İndirim tiplerinin de gelmesini sağlar |
| `FetchPackageProducts` | query | bool | hayır |  |
| `FetchCatalogData` | query | bool | hayır |  |
| `FetchFilters` | query | bool | hayır |  |
| `FetchDetails` | query | bool | hayır |  |
| `FetchAllCategories` | query | bool | hayır |  |
| `FetchImageUrls` | query | bool | hayır |  |
| `FetchMultipleDiscount` | query | bool | hayır |  |
| `FetchTags` | query | bool | hayır |  |
| `FetchRelatedBlocks` | query | bool | hayır |  |
| `FetchComplementaryProducts` | query | bool | hayır |  |
| `FetchSubProducts` | query | bool | hayır |  |
| `FetchInstallments` | query | bool | hayır |  |
| `TranslateDefaultCategoryPath` | query | bool | hayır | Ana kategori path'ini Translation parametresinde belirtilen dillere çevirir. |

20 Ekim 2026 okumasında `CustomerGroupCode=ogretmenler` ve `FetchDiscountedPriceDetail=true` grup fiyatını `DiscountedPrices` dizisine koydu. `SellingPrice` raf fiyatı kaldı. Dizi alanları `DiscountedPrice`, `DiscountedPriceVatIncluded`, `DiscountPercent`, `PriceType`, `PriceTypeDescription`.

### `product/addCategory`

`POST https://magaza.example/rest1/product/addCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `CategoryCode`.
```json
[
  {
    "ProductCode": "T582",
    "CategoryCode": "C582"
  }
]
```

### `product/addImageFromFile`

`POST https://magaza.example/rest1/product/addImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | evet |  |
| `list_number` | query | int | hayır |  |
| `ImageSizeWidthHeightControl` | query | int | evet | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |

### `product/attributes`

`POST https://magaza.example/rest1/product/attributes/`

Seçili ürünün özelliklerini baz alarak, Model altındaki özellikleri stok bilgisi ve örnek ürün kimliği ile birlikte döndür.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `product_id` | url_param | int | evet | Ürün id'si |
| `with_image` | query | bool | hayır |  |

### `product/addImageFromLink`

`POST https://magaza.example/rest1/product/addImageFromLink/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `ImageUrl`, `ListNumber`.
```json
[
  {
    "ProductCode": "T582",
    "ImageUrl": "http://celil.meticaret.com/kiz-cocuk-elbise-503-64-B.jpg",
    "ListNumber": ""
  }
]
```

### `product/addImageBase64`

`POST https://magaza.example/rest1/product/addImageBase64/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | evet | Base64 kodu `data:image/{image_type};base64,` şeklinde başlamalıdır. |

Örnek `data` alanları: `ProductCode`, `Base64`, `ListNumber`.
```json
[
  {
    "ProductCode": "T582",
    "Base64": "",
    "ListNumber": ""
  }
]
```

### `product/comment`

`POST https://magaza.example/rest1/product/comment/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Resimli yorum eklemek için lisansa ihtiyaç vardır. Eğer uygun bir lisansa sahipseniz, 'ImageUrl' parametresi aracılığıyla resmin URL'sini göndererek ekleyebilirsiniz. Eğer dosyadan resim eklemek istiyorsanız, data alanındaki ilk gelen yorumu kabul edeceğiz.    DateTimeStamp(unix timestamp) verisi gönderilirse gönderilen tarihte yorum eklenir. Gönderilmezse veya boş gönderilirse, yorum eklenme anında eklenir.   Ürüne yorum ekeleme için type:comment, ürüne soru eklemek için type:question gönderilmelidir. |
| `image` | file | file | hayır | Gerekli lisansa sahip olmalısınız(Ürün yorumlarında resim ekleme) |

Örnek `data` alanları: `CustomerId`, `ProductId`, `Type`, `Comment`, `Title`, `Rate`, `IsNameDisplayed`, `ImageUrl`, `DateTimeStamp`.
```json
[
  {
    "CustomerId": "110",
    "ProductId": "68",
    "Type": "comment",
    "Comment": "test message",
    "Title": "test title",
    "Rate": "3",
    "IsNameDisplayed": "",
    "ImageUrl": "",
    "DateTimeStamp": ""
  }
]
```

### `product/createProducts`

`POST https://magaza.example/rest1/product/createProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | ProductCode: Ürün Web Servis Kodu  ProductName: Ürün Adı  DefaultCategoryCode: Ana Kategori Kodu  SupplierProductCode: Tedarikçi Ürün Kodu  Barcode: Barkod  Stock: Stok  StockUnit: Stok Birimi  IsActive: Aktif mi?  ComparisonSites: Karşılaştırma sitelerinde görünsün mü ?  Vat: KDV  Currency: Para Birimi  BuyingPrice: Alış Fiyatı  SellingPrice: Satış Fiyatı  SearchKeywords: Site Arama Kelimeleri   IsNewProduct: Yeni Ürün Mü?  OnSale: İndirimde mi?  ImageUrl: İlk Resim Linki  IsDisplayProduct: Tanıtım Ürünü Mü?  VendorDisplayOnly: Bayi Ürünü Mü?  DisplayWithVat: KDV Dahil Göster?  Brand: Marka  Model: Model  Supplier: Tedarikçi  CustomerGroupDisplay: Üye grubuna göre ürün görünümü aktifse, burada ürünün gösterileceği üye grupları gönderilir  Additional1: Ek Bilgiler > Ek 1 alanı  Additional2: Ek Bilgiler > Ek 2 alanı  Additional3: Ek Bilgiler > Ek 3 alanı  RelatedProductsBlock1: İlişkili Ürünler > İlgili Ürünler  RelatedProductsBlock2: İlişkili Ürünler > İkame Ürünler  RelatedProductsBlock3: İlişkili Ürünler > Aksesuarlar  Magnifier: Ek Bilgiler > Mercek Göster?  MemberMinOrder: Ek Bilgiler > Üye Minumum Sipariş Miktarı  MemberMaxOrder: Ek Bilgiler > Üye Maksimum Sipariş Miktarı  VendorMinOrder: Ek Bilgiler > Bayi Minumum Sipariş Miktarı  VendorMaxOrder: Ek Bilgiler > Bayi Maksimum Sipariş Miktarı  FreeDeliveryMember: Ek Bilgiler > Üyelere Ücretsiz Kargo  FreeDeliveryVendor: Ek Bilgiler > Bayilere Ücretsiz Kargo ShortDescription: Ek Bilgiler > Kısa Açıklama  Details: Ürün Detayı  Width: En  Height: Boy  Depth: Derinlik  Weight: Ağırlık  CBM: Desi  Document: Ek Bilgiler > Dökümanlar  Gender: Erkek için 1, Kadın için 2, unisex için 3  WarrantyInfo: Garanti Bilgisi  DeliveryInfo: Sevk Bilgisi  ProductNote: Ürün Notu  SeoSettingsId: SEO Ayar  SeoTitle: SEO Başlık  SeoDescription: SEO Açıklama  ListNo: Sıra No  Label1-10: Simge Gösterimi > Etiket olsun mu olmasın mı ayarı DisablePaymentTypes: Yasaklı ödeme yöntemleri belirlenebilir. DisableCargoCompany: Yasaklı kargolar belirlenebilir.   AgeGroup parametresinin alabileceği değerler. (newborn,infant,toddle,kids,adult)   Supplier : SupplierId de gönderilebilir   DefaultSubProductId : Ön tanımlı alt ürün ID'si   EftRate: Havale İndirimi  Numeric1: Boş gönderilirse veritabanı değeri sıfırlanır. Değiştirmek istenmiyorsa key silinmelidir. |

Örnek `data` alanları: `ProductCode`, `ProductName`, `DefaultCategoryCode`, `SupplierProductCode`, `Barcode`, `Stock`, `StockUnit`, `IsActive`, `ComparisonSites`, `Vat`, `Currency`, `BuyingPrice`, `SellingPrice`, `SearchKeywords`, `DisplayOnHomepage`, `XmlNotUpdateStock`, `XmlNotUpdatePrice`, `PointCatalog`, `IsNewProduct`, `OnSale`, `ImageUrl`, `IsDisplayProduct`, `VendorDisplayOnly`, `DisplayWithVat`, `Brand`, `Model`, `Supplier`, `CustomerGroupDisplay`, `Additional1`, `Additional2`, `Additional3`, `RelatedProductsBlock1`, `RelatedProductsBlock2`, `RelatedProductsBlock3`, `Magnifier`, `MemberMinOrder`, `MemberMaxOrder`, `VendorMinOrder`, `VendorMaxOrder`, `FreeDeliveryMember`, `FreeDeliveryVendor`, `FreeDeliveryForProduct`, `ShortDescription`, `Details`, `Width`, `Height`, `Depth`, `Weight`, `CBM`, `Document`, `WarrantyInfo`, `DeliveryInfo`, `DeliveryTime`, `ProductNote`, `SeoSettingsId`, `SeoTitle`, `SeoDescription`, `Gtip`, `ListNo`, `PersonalizationId`, `DisablePaymentTypes`, `DisableCargoCompany`, `Label1`, `Label2`, `Label3`, `Label4`, `Label5`, `Label6`, `Label7`, `Label8`, `Label9`, `Label10`, `HomepageSort`, `MostSoldSort`, `NewestSort`, `AgeGroup`, `Point`, `Numeric1`, `DefaultSubProductId`, `EftRate`, `Tags`.
```json
[
  {
    "ProductCode": "T582",
    "ProductName": "deneme",
    "DefaultCategoryCode": "T251",
    "SupplierProductCode": "",
    "Barcode": "356574",
    "Stock": "5",
    "StockUnit": "adet",
    "IsActive": "1",
    "ComparisonSites": "0",
    "Vat": "",
    "Currency": "TL",
    "BuyingPrice": "300",
    "SellingPrice": "500",
    "SearchKeywords": "",
    "DisplayOnHomepage": "",
    "XmlNotUpdateStock": "",
    "XmlNotUpdatePrice": "",
    "PointCatalog": "",
    "IsNewProduct": "",
    "OnSale": "",
    "ImageUrl": "http://celil.meticaret.com/kiz-cocuk-elbise-503-64-B.jpg",
    "IsDisplayProduct": "",
    "VendorDisplayOnly": "",
    "DisplayWithVat": "",
    "Brand": "Donatella",
    "Model": "beige",
    "Supplier": "Penta",
    "CustomerGroupDisplay": "TZ0|TE2",
    "Additional1": "",
    "Additional2": "",
    "Additional3": "",
    "RelatedProductsBlock1": "T678|T3181",
    "RelatedProductsBlock2": "",
    "RelatedProductsBlock3": "",
    "Magnifier": "",
    "MemberMinOrder": "",
    "MemberMaxOrder": "",
    "VendorMinOrder": "",
    "VendorMaxOrder": "",
    "FreeDeliveryMember": "0",
    "FreeDeliveryVendor": "0",
    "FreeDeliveryForProduct": "0",
    "ShortDescription": "",
    "Details": "detailsdetails",
    "Width": "",
    "Height": "",
    "Depth": "",
    "Weight": "",
    "CBM": "",
    "Document": "DocumentDocumentDocument",
    "WarrantyInfo": "",
    "DeliveryInfo": "",
    "DeliveryTime": "",
    "ProductNote": "ProductNoteProductNote",
    "SeoSettingsId": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "Gtip": "",
    "ListNo": "",
    "PersonalizationId": 0,
    "DisablePaymentTypes": "49,50,51",
    "DisableCargoCompany": "9,10,11",
    "Label1": {
      "Value": 1
    },
    "Label2": {
      "Value": 0
    },
    "Label3": 1,
…
```

### `product/deleteProductImages`

`POST https://magaza.example/rest1/product/deleteProductImages/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `ImageId`.
```json
[
  {
    "ProductCode": "T582",
    "ImageId": ""
  }
]
```

### `product/deleteProducts`

`POST https://magaza.example/rest1/product/deleteProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`.
```json
[
  {
    "ProductCode": "T582"
  },
  {
    "ProductCode": "T764"
  }
]
```

### `product/find`

`POST https://magaza.example/rest1/product/find/`

Ürünlerde filtreleme yapmayı sağlar, ID ile ürün bilgisini ve ilişkili ürünleri getirir

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `product` | url_param | str | hayır | Ürün ID |
| `product_ids` | query | str | hayır | Çoklu Ürün ID, Virgülle ayrılarak gönderilmelidir. (örn: "123,365") |
| `related` | query | int | hayır | 1:İlgili Ürünler, 2:İkame Ürünler, 3:Aksesuarlar, 4:Tamamlayıcı Ürünler |
| `category` | query | int | hayır | Kategori ID |
| `store` | query | str | hayır | Dükkan / WS kullanıcı ID |
| `supplier` | query | str | hayır |  |
| `brand` | query | str | hayır | Marka ID |
| `model` | query | str | hayır | Model ID |
| `barcode` | query | str | hayır | Ürünün barkod numarası |
| `tag` | query | str | hayır | Etiket |
| `q` | query | str | hayır | Arama kelimesi |
| `stock` | query | int | hayır | 1: Sadece stoktakiler |
| `price` | query | str | hayır | Fiyat aralığı  örn; 30-100 |
| `type1` | query | int | hayır | Variant type ID |
| `type2` | query | int | hayır | Variant type ID |
| `discounted` | query | int | hayır | İndirimli ürünler için 1 gönderilir |
| `sort` | query | int | hayır | Sıralama için  0: Sıra No, 1: Ada göre A-Z, 2: Ada göre Z-A, 3: Yeniden Eskiye, 4: Eskiden Yeniye, 5: Fiyat artan, 6: Fiyat azalan, 7: Random, 8: En yüksek puan, 10: En çok satanlar, 11: Numeric azalan, 12, Numeric artan |
| `pg` | query | int | hayır | Sayfa numarası |
| `perpage` | query | int | hayır | Bir istekte dönecek kayıt sayısı |
| `currency_id` | query | int | hayır | parabirimine göre filtreleme |
| `fetch_product_detail` | query | bool | hayır |  |
| `fetch_filters_for_detail` | query | bool | hayır |  |
| `fetch_installment_list` | query | bool | hayır |  |
| `fetch_comments` | query | bool | hayır |  |
| `fetch_passive_products` | query | bool | hayır |  |
| `filter_related_products` | query | bool | hayır | Bu parametre true olarak gönderildiğinde, "Stokta Yoksa Göster" ayarına bağlı olarak sadece aktif ve stokta olan ilişkili ürün ID'leri döner. |
| `fetch_campaigns` | query | bool | hayır | Bu parametre true olarak gönderildiğinde, panelden "Ürün detay sayfasında ürün ile ilgili kampanyaların sorgulanması" (UrunDetayKampanyaSorgu) ayarı aktif ise ürüne bağlı kampanyalar campaign_list alanı altında döner. |
| `variant_id` | query | int | hayır |  |
| `image_limit` | query | int | hayır |  |
| `without_cache` | query | bool | hayır |  |
| `with_passive_sub_products` | query | bool | hayır |  |

### `product/productListFilter`

`POST https://magaza.example/rest1/product/productListFilter/`

Ürün listesi filtre/faset listesini döner (kategori, varyant, marka, model, fiyat aralığı, sıralama vb.). Ürün dönmez; mobil tarafta filtre butonuna tıklandığında çağrılmalıdır. find metodu no_filter=true ile çağrılarak ürün listesi alınır, bu metot sadece filtre paneli açıldığında çalıştırılır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `category` | query | int | hayır | Kategori ID |
| `brand` | query | str | hayır | Marka ID |
| `model` | query | str | hayır | Model ID |
| `supplier` | query | str | hayır | Tedarikçi |
| `store` | query | str | hayır | Dükkan / WS kullanıcı ID |
| `tag` | query | str | hayır | Etiket |
| `q` | query | str | hayır | Arama kelimesi |
| `barcode` | query | str | hayır | Barkod |
| `stock` | query | int | hayır | 1: Sadece stoktakiler |
| `price` | query | str | hayır | Fiyat aralığı (örn: 30-100) |
| `type1` | query | int | hayır | Varyant tip 1 ID |
| `type2` | query | int | hayır | Varyant tip 2 ID |
| `multi` | query | str | hayır | Çoklu seçim filtre değerleri |
| `single` | query | str | hayır | Tek seçim filtre değerleri |
| `decimal` | query | str | hayır | Sayısal aralık filtre değeri |
| `newproducts` | query | int | hayır | Yeni ürünler için 1 |
| `discounted` | query | int | hayır | İndirimli ürünler için 1 |
| `sort` | query | int | hayır | Sıralama |
| `pg` | query | int | hayır | Sayfa numarası |
| `perpage` | query | int | hayır | Sayfa başına kayıt |
| `currency_id` | query | int | hayır | Para birimine göre filtreleme |
| `product_ids` | query | str | hayır | Çoklu Ürün ID'si (örn: 123,365) |
| `fetch_passive_products` | query | bool | hayır | Pasif ürünleri de hesaba kat |
| `without_cache` | query | bool | hayır | Cache'i bypass et |
| `language` | query | str | hayır | Dil kodu |
| `product_list_page_id` | query | int | hayır | Sıralama yapılandırması için sayfa ID |

### `product/getActivePropertyGroup`

`POST https://magaza.example/rest1/product/getActivePropertyGroup/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | url_param | int | evet |  |

### `product/getComments`

`POST https://magaza.example/rest1/product/getComments/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `type` | query | str | hayır | ürüne iletilmiş olan soruları görmek için type: question, ürüne iletilen yorumları görmek için type:comment gönderilmelidir |
| `isAnswered` | query | str | hayır | Sadece cevaplı kayıtlar için 1/true, cevapsız kayıtlar için 0/false gönderiniz. |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır | Seçilebilir alanlara Answer, AnsweredBy, AnsweredAt eklendi (kolonlar veritabanında mevcutsa). |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `product/getCurrencyList`

`POST https://magaza.example/rest1/product/getCurrencyList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `product/getDiscountTypeList`

`POST https://magaza.example/rest1/product/getDiscountTypeList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `productFilter/getFilters`

`POST https://magaza.example/rest1/productFilter/getFilters/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `GroupId` | url_param | int | hayır |  |

### `productFilter/getFiltersByProductCode`

`POST https://magaza.example/rest1/productFilter/getFiltersByProductCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |
| `Filter` | query | str | hayır |  |

### `product/getProductByBarcode`

`POST https://magaza.example/rest1/product/getProductByBarcode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Barcode` | url_param | str | evet |  |
| `Barcodes` | query | str | hayır | Ürün barkodu ve alt ürün barkodlarını aralarında webservis ayraç ayarına girdiğiniz (default: \|) ayracı kullanarak gönderiniz. |
| `FetchDiscountedPrice` | query | bool | hayır |  |
| `FetchImageUrls` | query | bool | hayır |  |
| `FetchSubProducts` | query | bool | hayır |  |

```json
"123456|987456"
```

### `product/getProductByCode`

`POST https://magaza.example/rest1/product/getProductByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |
| `ProductCodes` | query | str | evet | Ürün kodu ve alt ürün kodlarını aralarında webservis ayraç ayarına girdiğiniz (default: \|) ayracı kullanarak gönderiniz. Kodu, ürünlerde bulunamazsa alt ürünlerde arar. |
| `FetchDiscountedPrice` | query | bool | hayır |  |
| `FetchImageUrls` | query | bool | hayır |  |
| `FetchMultipleDiscount` | query | bool | hayır |  |

```json
"T548|T549|TA9"
```

### `product/getProductById`

`POST https://magaza.example/rest1/product/getProductById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | url_param | str | evet |  |
| `ProductIds` | query | str | evet | Ürün ID'lerini aralarında \| ayracı kullanarak gönderiniz. |
| `FetchDiscountedPrice` | query | bool | hayır |  |
| `FetchImageUrls` | query | bool | hayır |  |
| `ImageSize` | query | int | hayır | 1:small, 2:mid, 3:large |
| `FetchMultipleDiscount` | query | bool | hayır |  |

```json
"145|146"
```

### `product/getProductByName`

`POST https://magaza.example/rest1/product/getProductByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductName` | url_param | str | evet |  |

### `product/getProductBySupplierProductCode`

`POST https://magaza.example/rest1/product/getProductBySupplierProductCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SupplierProductCode` | url_param | str | evet |  |

### `product/getProductDetail`

`POST https://magaza.example/rest1/product/getProductDetail/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | query | int | hayır |  |
| `ProductCode` | query | text | hayır |  |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `start` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |
| `OnlyDetail` | query | bool | hayır |  |

### `product/getProductImages`

`POST https://magaza.example/rest1/product/getProductImages/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | url_param | int | evet |  |

### `product/getProductImagesByCode`

`POST https://magaza.example/rest1/product/getProductImagesByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |

### `product/getProducts`

`POST https://magaza.example/rest1/product/getProducts/`

<a href="/rest1/console?new#product/get">Bu metoda alternatif olarak yeni geliştirilen product/get metodu mevcuttur. product/get metodunun kullanılması önerilir.</a>

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır | Default:50, Max:500 |
| `start` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |
| `FetchAllCategories` | query | bool | hayır |  |
| `FetchPriceWithComma` | query | bool | hayır |  |
| `FetchMultipleDiscount` | query | bool | hayır |  |
| `FlexiblePrices` | query | str | hayır | Örnek : Price3,Price4 (product/fields metodundan erişilebilir.) |
| `StockFields` | query | str | hayır | Örnek : Stock2,Stock3 (product/fields metodundan erişilebilir.) |

Postman’daki `getProducts` adlı istek bu uca gitmez. `product/setProducts` adresine yazar.

### `product/getProductsByCategoryCode`

`POST https://magaza.example/rest1/product/getProductsByCategoryCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryCode` | url_param | str | evet |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |
| `CategorySortLevel` | query | int | hayır |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |

### `product/getProductTotal`

`POST https://magaza.example/rest1/product/getProductTotal/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

Postman’daki `getProductsCount` adlı istek bu uca gitmez. `product/setProducts` adresine yazar.

### `product/getSeoSettingList`

`POST https://magaza.example/rest1/product/getSeoSettingList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `product/getStockUnitList`

`POST https://magaza.example/rest1/product/getStockUnitList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `product/getSupplierList`

`POST https://magaza.example/rest1/product/getSupplierList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `orderby` | query | str | hayır | Örn: Supplier ASC |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |

### `product/removeCategory`

`POST https://magaza.example/rest1/product/removeCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CategoryCode alanı "<__ALL__>" olarak gönderilirse varsayılan kategori de dahil tüm kategorileri siler. |

Örnek `data` alanları: `ProductCode`, `CategoryCode`.
```json
[
  {
    "ProductCode": "T582",
    "CategoryCode": "C582"
  }
]
```

### `product/setComplementaryProducts` (beta)

`POST https://magaza.example/rest1/product/setComplementaryProducts/`

Tamamlayıcı ürünler veya alt ürünler ekleyin.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MainProductCode` | url_param | str | evet |  |
| `data` | query | text | evet | Bir tamamlayıcı ürün için ProductCode veya SubProductCode alanlarından sadece birini giriniz. |

Örnek `data` alanları: `ProductCode`, `SubProductCode`, `Price`.
```json
[
  {
    "ProductCode": "",
    "SubProductCode": "TA26",
    "Price": "300"
  }
]
```

### `product/deleteComplementaryProducts` (beta)

`POST https://magaza.example/rest1/product/deleteComplementaryProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MainProductCode` | url_param | str | evet |  |
| `data` | query | text | evet | Bir tamamlayıcı ürün için ProductCode veya SubProductCode alanlarından sadece birini giriniz. |

Örnek `data` alanları: `ProductCode`, `SubProductCode`.
```json
[
  {
    "ProductCode": "",
    "SubProductCode": "TA26"
  }
]
```

### `productFilter/setFilterGroupCategory` (beta)

`POST https://magaza.example/rest1/productFilter/setFilterGroupCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `CategoryCode`, `FilterGroupId`.
```json
[
  {
    "CategoryCode": "T317-1",
    "FilterGroupId": "29"
  }
]
```

### `productFilter/setFilterValues`

`POST https://magaza.example/rest1/productFilter/setFilterValues/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `FilterId`, `ValueId`.
```json
[
  {
    "ProductCode": "T695",
    "FilterId": "78",
    "ValueId": "120|121"
  }
]
```

### `product/setProductLanguage`

`POST https://magaza.example/rest1/product/setProductLanguage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Languages: tr, en, ar, az, bs, de, fr, ru. \| Fields: ProductName, Details, Document, ShortDescription, Additional1, Additional2, Additional3 |

Örnek `data` alanları: `ProductCode`, `Language`, `ProductName`, `Details`, `Document`, `ShortDescription`, `Additional1`, `Additional2`, `Additional3`, `SeoLink`, `SeoTitle`, `SeoDescription`, `WarrantyInfo`, `DeliveryInfo`.
```json
[
  {
    "ProductCode": "T802",
    "Language": "en",
    "ProductName": "Test Product",
    "Details": "Test Product Detail",
    "Document": "",
    "ShortDescription": "",
    "Additional1": "",
    "Additional2": "",
    "Additional3": "",
    "SeoLink": "test-product",
    "SeoTitle": "",
    "SeoDescription": "",
    "WarrantyInfo": "",
    "DeliveryInfo": ""
  },
  {
    "ProductCode": "T802",
    "Language": "de",
    "ProductName": "Testprodukt",
    "Details": "Detail Testprodukt",
    "Document": "",
    "ShortDescription": "",
    "Additional1": "",
    "Additional2": "",
    "Additional3": "",
    "SeoLink": "test-produkt",
    "SeoTitle": "",
    "SeoDescription": "",
    "WarrantyInfo": "",
    "DeliveryInfo": ""
  }
]
```

### `product/getProductLanguage`

`POST https://magaza.example/rest1/product/getProductLanguage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | int | evet |  |
| `Language` | query | str | hayır |  |
| `ForceWithoutOriginal` | query | bool | hayır |  |

### `product/setProducts`

`POST https://magaza.example/rest1/product/setProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | ProductCode: Ürün Web Servis Kodu  ProductName: Ürün Adı  DefaultCategoryCode: Ana Kategori Kodu  SupplierProductCode: Tedarikçi Ürün Kodu  Barcode: Barkod  Stock: Stok  (Stock2, Stock3, Stock4 gibi değerleri de ekleyerek çoklu stok değerlerini de yönetebilirsiniz.)  StockUnit: Stok Birimi  IsActive: Aktif mi?  ComparisonSites: Karşılaştırma sitelerinde görünsün mü ?  Vat: KDV  Currency: Para Birimi  BuyingPrice: Alış Fiyatı  SellingPrice: Satış Fiyatı  SearchKeywords: Site Arama Kelimeleri   IsNewProduct: Yeni Ürün Mü?  OnSale: İndirimde mi?  ImageUrl: İlk Resim Linki  IsDisplayProduct: Tanıtım Ürünü Mü?  VendorDisplayOnly: Bayi Ürünü Mü?  DisplayWithVat: KDV Dahil Göster?  Brand: Marka  Model: Model  HasSubProducts: Alt Ürün Var Mı?  Supplier: Tedarikçi  CustomerGroupDisplay: Üye grubuna göre ürün görünümü aktifse, burada ürünün gösterileceği üye grupları gönderilir  Additional1: Ek Bilgiler > Ek 1 alanı  Additional2: Ek Bilgiler > Ek 2 alanı  Additional3: Ek Bilgiler > Ek 3 alanı  RelatedProductsBlock1: İlişkili Ürünler > İlgili Ürünler  RelatedProductsBlock2: İlişkili Ürünler > İkame Ürünler  RelatedProductsBlock3: İlişkili Ürünler > Aksesuarlar  Magnifier: Ek Bilgiler > Mercek Göster?  MemberMinOrder: Ek Bilgiler > Üye Minumum Sipariş Miktarı  MemberMaxOrder: Ek Bilgiler > Üye Maksimum Sipariş Miktarı  VendorMinOrder: Ek Bilgiler > Bayi Minumum Sipariş Miktarı  VendorMaxOrder: Ek Bilgiler > Bayi Maksimum Sipariş Miktarı  FreeDeliveryMember: Ek Bilgiler > Üyelere Ücretsiz Kargo  FreeDeliveryVendor: Ek Bilgiler > Bayilere Ücretsiz Kargo ShortDescription: Ek Bilgiler > Kısa Açıklama  Details: Ürün Detayı  Width: En  Height: Boy  Depth: Derinlik  Weight: Ağırlık  CBM: Desi  Document: Ek Bilgiler > Dökümanlar  Gender: Erkek için 1, Kadın için 2, unisex için 3  Warehouse: Depo  Gender: Erkek için 1, Kadın için 2, unisex için 3  OpportunityProduct: Fırsat Ürünü ise 1, değilse 0  OpportunityStart: Fırsat başlangıç tarihi (unixtime)  OpportunityProduct: Fırsat bitiş tarihi (unixtime)  WarrantyInfo: Garanti Bilgisi  DeliveryInfo: Sevk Bilgisi  ProductNote: Ürün Notu  SeoSettingsId: SEO Ayar  SeoTitle: SEO Başlık  SeoDescription: SEO Açıklama  ListNo: Sıra No  Label1-10: Simge Gösterimi > Etiket olsun mu olmasın mı ayarı DisablePaymentTypes: Yasaklı ödeme yöntemleri belirlenebilir. DisableCargoCompany: Yasaklı kargolar belirlenebilir.    AgeGroup parametresinin alabileceği değerler. (newborn,infant,toddle,kids,adult)   DefaultSubProductId: Ön tanılı alt ürün ID'si   EftRate: Havale İndirimi  Numeric1: Boş gönderilirse veritabanı değeri sıfırlanır. Değiştirmek istenmiyorsa key silinmelidir.  ModelActivity: Model Aktif mi? 1: Aktif, 0: Pasif   CountryOfOrigin: Ürünün üretildiği ülke kodu (TR, DE, US, CN, ...)  ProformaTitle: Proforma Fatura Başlığı |
| `RemoveOldCategory` | query | bool | hayır |  |
| `QuickUpdate` | query | bool | hayır | BETA(Sadece bu parametrelere izin verir) - {Stock, BuyingPrice, SellingPrice, Label1: 1, Label2: 0, Label3: 1, Label4: 1, Label5: 0, Label6: 0, Label7: 1, Label8: 0, Label9: 0, Label10: 1} |
| `DisableSEOSettings` | query | bool | hayır | false gönderilirse SEO ayarlarını göz önünde bulundurur |

Postman `setProducts` gövdesi aşağıdaki `T582` örneğinin kısa halidir ve `SeoKeywords` anahtarını da taşır. `getProducts` ile `getProductsCount` adlı istekler aynı gövdeyle bu uca gider.

Örnek `data` alanları: `ProductCode`, `ProductName`, `DefaultCategoryCode`, `SupplierProductCode`, `Barcode`, `ManufacturerPartNumber`, `Stock`, `StockUnit`, `IsActive`, `ComparisonSites`, `Vat`, `Currency`, `BuyingPrice`, `SellingPrice`, `SearchKeywords`, `DisplayOnHomepage`, `PointCatalog`, `XmlNotUpdateStock`, `XmlNotUpdatePrice`, `IsNewProduct`, `OnSale`, `ImageUrl`, `IsDisplayProduct`, `VendorDisplayOnly`, `DisplayWithVat`, `Brand`, `Model`, `ModelActivity`, `HasSubProducts`, `Supplier`, `CustomerGroupDisplay`, `Additional1`, `Additional2`, `Additional3`, `RelatedProductsBlock1`, `RelatedProductsBlock2`, `RelatedProductsBlock3`, `Magnifier`, `MemberMinOrder`, `MemberMaxOrder`, `VendorMinOrder`, `VendorMaxOrder`, `FreeDeliveryMember`, `FreeDeliveryVendor`, `FreeDeliveryForProduct`, `ShortDescription`, `Details`, `Width`, `Height`, `Depth`, `Weight`, `CBM`, `Document`, `Warehouse`, `WarrantyInfo`, `DeliveryInfo`, `DeliveryTime`, `ProductNote`, `SeoSettingsId`, `SeoTitle`, `SeoDescription`, `Gtip`, `Gender`, `VariantThemeId`, `CatalogCode`, `Attributes`, `OpportunityProduct`, `OpportunityStart`, `OpportunityFinish`, `ListNo`, `PersonalizationId`, `DisablePaymentTypes`, `DisableCargoCompany`, `Label1`, `Label2`, `Label3`, `Label4`, `Label5`, `Label6`, `Label7`, `Label8`, `Label9`, `Label10`, `HomepageSort`, `MostSoldSort`, `NewestSort`, `AgeGroup`, `Point`, `Numeric1`, `DefaultSubProductId`, `DefaultSubProductCode`, `EftRate`, `Tags`, `SearchRank`, `CountryOfOrigin`, `ProformaTitle`.
```json
[
  {
    "ProductCode": "T582",
    "ProductName": "deneme",
    "DefaultCategoryCode": "T251",
    "SupplierProductCode": "",
    "Barcode": "356574",
    "ManufacturerPartNumber": "",
    "Stock": "5",
    "StockUnit": "adet",
    "IsActive": "1",
    "ComparisonSites": "0",
    "Vat": "",
    "Currency": "TL",
    "BuyingPrice": "300",
    "SellingPrice": "500",
    "SearchKeywords": "",
    "DisplayOnHomepage": "",
    "PointCatalog": "",
    "XmlNotUpdateStock": "",
    "XmlNotUpdatePrice": "",
    "IsNewProduct": "",
    "OnSale": "",
    "ImageUrl": "http://celil.meticaret.com/kiz-cocuk-elbise-503-64-B.jpg",
    "IsDisplayProduct": "",
    "VendorDisplayOnly": "",
    "DisplayWithVat": "",
    "Brand": "Donatella",
    "Model": "beige",
    "ModelActivity": "1",
    "HasSubProducts": false,
    "Supplier": "Penta",
    "CustomerGroupDisplay": "TZ0|TE2",
    "Additional1": "",
    "Additional2": "",
    "Additional3": "",
    "RelatedProductsBlock1": "T678|T3181",
    "RelatedProductsBlock2": "",
    "RelatedProductsBlock3": "",
    "Magnifier": "",
    "MemberMinOrder": "",
    "MemberMaxOrder": "",
    "VendorMinOrder": "",
    "VendorMaxOrder": "",
    "FreeDeliveryMember": "0",
    "FreeDeliveryVendor": "0",
    "FreeDeliveryForProduct": "0",
    "ShortDescription": "",
    "Details": "detailsdetails",
    "Width": "",
    "Height": "",
    "Depth": "",
    "Weight": "",
    "CBM": "",
    "Document": "DocumentDocumentDocument",
    "Warehouse": "",
    "WarrantyInfo": "",
    "DeliveryInfo": "",
    "DeliveryTime": "",
    "ProductNote": "ProductNoteProductNote",
    "SeoSettingsId": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "Gtip": "",
    "Gender": 0,
    "VariantThemeId": 0,
    "CatalogCode": "",
    "Attributes": [
      {
        "Attribute
…
```

### `product/setProductsStatus`

`POST https://magaza.example/rest1/product/setProductsStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Bu metot toplu istekleri karşılamak içindir. Tedarikçilerin kullanımı için uygun değildir. Entegrasyonlarınızda tedarikçilerin kullanımına sunmak üzere "setProductStatus" metodunu kullanınız. |

Örnek `data` alanları: `ProductCode`, `Status`.
```json
[
  {
    "ProductCode": "T582",
    "Status": true
  }
]
```

### `product/setProductStatus`

`POST https://magaza.example/rest1/product/setProductStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |
| `status` | query | bool | evet |  |

### `product/setRelatedProducts`

`POST https://magaza.example/rest1/product/setRelatedProducts/`

Single

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |
| `data` | query | text | evet |  |

```json
"T582"
```

```json
{
  "RelatedProductsBlock1": "T668",
  "RelatedProductsBlock2": "",
  "RelatedProductsBlock3": ""
}
```

### `product/setRelatedProducts`

`POST https://magaza.example/rest1/product/setRelatedProducts/`

Multiple

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `RelatedProductsBlock1`, `RelatedProductsBlock2`, `RelatedProductsBlock3`.
```json
[
  {
    "ProductCode": "T582",
    "RelatedProductsBlock1": "T668",
    "RelatedProductsBlock2": "",
    "RelatedProductsBlock3": ""
  }
]
```

### `product/setDefaultCategory` (beta)

`POST https://magaza.example/rest1/product/setDefaultCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductCode`, `DefaultCategoryCode`.
```json
[
  {
    "ProductCode": "T582",
    "DefaultCategoryCode": "T283"
  }
]
```

### `product/updateCommentStatus`

`POST https://magaza.example/rest1/product/updateCommentStatus/`

Yorum/soru kaydının durumunu günceller. answer gönderildiğinde soru cevaplanır ve durum otomatik olarak onaylı yapılır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CommentId` | url_param | str | evet |  |
| `status` | query | bool | hayır | Durum güncellemesi için gönderilir. true=onaylı, false=onaysız. |
| `answer` | query | text | hayır | Soru cevabı. Bu alan gönderildiğinde sadece type=question kayıtlar cevaplanır. |
| `answeredBy` | query | str | hayır | Cevaplayan kullanıcı bilgisi. Gönderilmezse rest1 kullanıcısı yazılır. |

### `product/answerComment`

`POST https://magaza.example/rest1/product/answerComment/`

Ürüne iletilen soruyu cevaplar.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CommentId` | url_param | str | evet |  |
| `answer` | query | text | evet | Soru cevabı. |
| `answeredBy` | query | str | hayır | Cevaplayan kullanıcı bilgisi. Gönderilmezse rest1 kullanıcısı yazılır. |

### `product/updateCustomerGroupPrice`

`POST https://magaza.example/rest1/product/updateCustomerGroupPrice/`

1- Manuel olarak fiyat girmek istediğinizde DiscountType ve Percentage boş bırakılmalıdır. DiscountedPrice alanına indirimli fiyatınızı giriniz. 2- Satış fiyatı üzerinden fiyat değişikliği yapmak istediğinizde DiscountType=1 olmalıdır. Percentage değeri (fiyat değişikliği için oran) pozitifse fiyatta artış olur, negatifse fiyatta düşüş olur. 3- Alış fiyatı üzerinden yüzde indirim yapmak istediğinizde DiscountType=2 olmalıdır. Percentage değeri (fiyat değişikliği için oran) pozitifse fiyatta artış olur, negatifse fiyatta düşüş olur. 4- Mevcut özel fiyatı resetlemek istediğinizde yalnızca ProductCode ve CustomerGroupCode gönderilmesi yeterlidir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Üye grubuna göre ürün görünme özelliği aktifse, gönderilen ürün üye grubuna default olarak görünür yapılır. Eğer görünürlüğünü değiştirmek istemiyorsanız IsVisible: false gönderiniz.    OnSale parametresi gönderilerek İndirimli Göster bayrağı yönetilebilir. Onsale parametresi gönderilmese İndirimli Göster bayrağı etkilenmez. |

Örnek `data` alanları: `ProductCode`, `CustomerGroupCode`, `DiscountType`, `Percentage`, `DiscountedPrice`, `IsVisible`, `OnSale`.
```json
[
  {
    "ProductCode": "T641",
    "CustomerGroupCode": "TZ0",
    "DiscountType": "1",
    "Percentage": "-10",
    "DiscountedPrice": "",
    "IsVisible": true,
    "OnSale": false
  }
]
```

Postman örneği `ProductCode` `15201-ICA0001`, `CustomerGroupCode` `01`, `DiscountType` `1`, `Percentage` `-10`, `IsVisible` true, `OnSale` true gönderir.

20 Ekim 2026 çağrısında `Percentage` `-35`, `IsVisible` false ve `CustomerGroupCode` `ogretmenler` kabul edildi. Başarı kodu `PRI019`. `ORNEK-001` raf fiyatı `85` iken grup fiyatı `55.25` ve `DiscountPercent` `-35` okundu. Raf fiyatı `0` olan `ORNEK-002` yüzde tabanı vermedi.

### `product/updatePrice`

`POST https://magaza.example/rest1/product/updatePrice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Yalnızca güncellemek istediğiniz alanları gönderiniz.   DiscountedSellingPrice değeri gönderilmezse eski fiyat değişmez. Sıfır gönderilirse indirimli fiyat ve ziyaretçi fiyatı alanları silinir. Sıfırdan büyük bir değer girilirse ziyaretçi fiyatı ve indirimli fiyat bu değere set edilir. |

Örnek `data` alanları: `ProductCode`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `Currency`, `Vat`, `Stock`, `OnSale`.
```json
[
  {
    "ProductCode": "T582",
    "BuyingPrice": "3500",
    "SellingPrice": "4500",
    "DiscountedSellingPrice": "4500",
    "Currency": "TL",
    "Vat": "18",
    "Stock": "10",
    "OnSale": false
  }
]
```

### `product/updateFlexiblePrice`

`POST https://magaza.example/rest1/product/updateFlexiblePrice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | IsConditional:1 ise (yani koşullu fiyat ise)  BaseField, Percent değerleri gönderilmesi gerekmektedir, Price ve Currency değerlerinin gönderilmesine gerek yoktur.   IsConditional:0 ise Price ve Currency parametreleri gönderilmelidir, BaseField ve Percent parametresinin gönderilmesine gerek yoktur.     IsDiscounted:1 ise koşul olarak sadece kendisine bağlanabilir.   Alt ürünler için ProductCode yerine SubProductCode gönderilebilir. |

Örnek `data` alanları: `ProductCode`, `PriceField`, `IsDiscounted`, `IsConditional`, `BaseField`, `Percent`, `Price`, `Currency`.
```json
[
  {
    "ProductCode": "T582",
    "PriceField": "SF3",
    "IsDiscounted": "0",
    "IsConditional": "1",
    "BaseField": "SF",
    "Percent": "10",
    "Price": "100",
    "Currency": "TL"
  }
]
```

### `product/updateProducts`

`POST https://magaza.example/rest1/product/updateProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | ProductCode Yerine ProductId Gönderilebilir.  ProductCode: Ürün Web Servis Kodu  ProductName: Ürün Adı  DefaultCategoryCode: Ana Kategori Kodu  SupplierProductCode: Tedarikçi Ürün Kodu  Barcode: Barkod  Stock: Stok  (Stock2, Stock3, Stock4 gibi değerleri de ekleyerek çoklu stok değerlerini de yönetebilirsiniz.)  StockUnit: Stok Birimi  IsActive: Aktif mi?  ComparisonSites: Karşılaştırma sitelerinde görünsün mü ?  Vat: KDV  Currency: Para Birimi  BuyingPrice: Alış Fiyatı  SellingPrice: Satış Fiyatı  SearchKeywords: Site Arama Kelimeleri   IsNewProduct: Yeni Ürün Mü?  OnSale: İndirimde mi?  ImageUrl: İlk Resim Linki  IsDisplayProduct: Tanıtım Ürünü Mü?  VendorDisplayOnly: Bayi Ürünü Mü?  DisplayWithVat: KDV Dahil Göster?  Brand: Marka  Model: Model  HasSubProducts: Alt üeün var mı ?  Supplier: Tedarikçi  CustomerGroupDisplay: Üye grubuna göre ürün görünümü aktifse, burada ürünün gösterileceği üye grupları gönderilir  Additional1: Ek Bilgiler > Ek 1 alanı  Additional2: Ek Bilgiler > Ek 2 alanı  Additional3: Ek Bilgiler > Ek 3 alanı  RelatedProductsBlock1: İlişkili Ürünler > İlgili Ürünler  RelatedProductsBlock2: İlişkili Ürünler > İkame Ürünler  RelatedProductsBlock3: İlişkili Ürünler > Aksesuarlar  Magnifier: Ek Bilgiler > Mercek Göster?  MemberMinOrder: Ek Bilgiler > Üye Minumum Sipariş Miktarı  MemberMaxOrder: Ek Bilgiler > Üye Maksimum Sipariş Miktarı  VendorMinOrder: Ek Bilgiler > Bayi Minumum Sipariş Miktarı  VendorMaxOrder: Ek Bilgiler > Bayi Maksimum Sipariş Miktarı  FreeDeliveryMember: Ek Bilgiler > Üyelere Ücretsiz Kargo  FreeDeliveryVendor: Ek Bilgiler > Bayilere Ücretsiz Kargo ShortDescription: Ek Bilgiler > Kısa Açıklama  Details: Ürün Detayı  Width: En  Height: Boy  Depth: Derinlik  Weight: Ağırlık  CBM: Desi  Document: Ek Bilgiler > Dökümanlar  Gender: Erkek için 1, Kadın için 2, unisex için 3  Warehouse: Depo WarrantyInfo: Garanti Bilgisi  DeliveryInfo: Sevk Bilgisi  ProductNote: Ürün Notu  SeoSettingsId: SEO Ayar  SeoTitle: SEO Başlık  SeoDescription: SEO Açıklama  ListNo: Sıra No  Label1-10: Simge Gösterimi > Etiket olsun mu olmasın mı ayarı DisablePaymentTypes: Yasaklı ödeme yöntemleri belirlenebilir. DisableCargoCompany: Yasaklı kargolar belirlenebilir.   AgeGroup parametresinin alabileceği değerler. (newborn,infant,toddle,kids,adult)   DefaultSubProductId : Ön tanımlı alt ürün ID'si   EftRate: Havale İndirimi  Numeric1: Boş gönderilirse veritabanı değeri sıfırlanır. Değiştirmek istenmiyorsa key silinmelidir. |
| `RemoveOldCategory` | query | bool | hayır |  |
| `DisableSEOSettings` | query | bool | hayır | false gönderilirse SEO ayarlarını göz önünde bulundurur |

Örnek `data` alanları: `ProductCode`, `ProductName`, `DefaultCategoryCode`, `SupplierProductCode`, `Barcode`, `Stock`, `StockUnit`, `IsActive`, `ComparisonSites`, `Vat`, `Currency`, `BuyingPrice`, `SellingPrice`, `SearchKeywords`, `DisplayOnHomepage`, `PointCatalog`, `XmlNotUpdateStock`, `XmlNotUpdatePrice`, `IsNewProduct`, `OnSale`, `ImageUrl`, `IsDisplayProduct`, `VendorDisplayOnly`, `DisplayWithVat`, `Brand`, `Model`, `HasSubProducts`, `Supplier`, `CustomerGroupDisplay`, `Additional1`, `Additional2`, `Additional3`, `RelatedProductsBlock1`, `RelatedProductsBlock2`, `RelatedProductsBlock3`, `Magnifier`, `MemberMinOrder`, `MemberMaxOrder`, `VendorMinOrder`, `VendorMaxOrder`, `FreeDeliveryMember`, `FreeDeliveryVendor`, `FreeDeliveryForProduct`, `ShortDescription`, `Details`, `Width`, `Height`, `Depth`, `Weight`, `CBM`, `Document`, `Warehouse`, `WarrantyInfo`, `DeliveryInfo`, `DeliveryTime`, `ProductNote`, `SeoSettingsId`, `SeoTitle`, `SeoDescription`, `Gtip`, `Gender`, `ListNo`, `PersonalizationId`, `DisablePaymentTypes`, `DisableCargoCompany`, `Label1`, `Label2`, `Label3`, `Label4`, `Label5`, `Label6`, `Label7`, `Label8`, `Label9`, `Label10`, `HomepageSort`, `MostSoldSort`, `NewestSort`, `AgeGroup`, `Point`, `Numeric1`, `DefaultSubProductId`, `EftRate`, `Tags`.
```json
[
  {
    "ProductCode": "T582",
    "ProductName": "deneme",
    "DefaultCategoryCode": "T251",
    "SupplierProductCode": "",
    "Barcode": "356574",
    "Stock": "5",
    "StockUnit": "adet",
    "IsActive": "1",
    "ComparisonSites": "0",
    "Vat": "",
    "Currency": "TL",
    "BuyingPrice": "300",
    "SellingPrice": "500",
    "SearchKeywords": "",
    "DisplayOnHomepage": "",
    "PointCatalog": "",
    "XmlNotUpdateStock": "",
    "XmlNotUpdatePrice": "",
    "IsNewProduct": "",
    "OnSale": "",
    "ImageUrl": "http://celil.meticaret.com/kiz-cocuk-elbise-503-64-B.jpg",
    "IsDisplayProduct": "",
    "VendorDisplayOnly": "",
    "DisplayWithVat": "",
    "Brand": "Donatella",
    "Model": "beige",
    "HasSubProducts": false,
    "Supplier": "Penta",
    "CustomerGroupDisplay": "TZ0|TE2",
    "Additional1": "",
    "Additional2": "",
    "Additional3": "",
    "RelatedProductsBlock1": "T678|T3181",
    "RelatedProductsBlock2": "",
    "RelatedProductsBlock3": "",
    "Magnifier": "",
    "MemberMinOrder": "",
    "MemberMaxOrder": "",
    "VendorMinOrder": "",
    "VendorMaxOrder": "",
    "FreeDeliveryMember": "0",
    "FreeDeliveryVendor": "0",
    "FreeDeliveryForProduct": "0",
    "ShortDescription": "",
    "Details": "detailsdetails",
    "Width": "",
    "Height": "",
    "Depth": "",
    "Weight": "",
    "CBM": "",
    "Document": "DocumentDocumentDocument",
    "Warehouse": "",
    "WarrantyInfo": "",
    "DeliveryInfo": "",
    "DeliveryTime": "",
    "ProductNote": "ProductNoteProductNote",
    "SeoSettingsId": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "Gtip": "",
    "Gender": 0,
    "ListNo": "",
    "PersonalizationId": 0,
    "DisablePaymentTypes": "49,50,51",
    "DisableCargoCompany": "9,10,11",
    "Label1": {
      "Value":
…
```

### `product/updateProductAsOnSale`

`POST https://magaza.example/rest1/product/updateProductAsOnSale/`

Ürün kodu gönderilen ürünü indirimli olarak işaretler veya üründen indirimli işaretini kaldırır. ResetAll parametresi true olarak gönderilirse, mevcut tüm ürünlerin indirimli işaretleri varsa kaldırılır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Ürün kodu ve ürün indirimli mi değil mi boolean değeri. |
| `ResetAll` | query | bool | hayır | Tümünü sıfırla |

Örnek `data` alanları: `ProductCode`, `OnSale`.
```json
[
  {
    "ProductCode": "T582",
    "OnSale": true
  }
]
```

### `product/updateStock`

`POST https://magaza.example/rest1/product/updateStock/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Stok değerini sabit bir değere atamak isterseniz Stok parametresini, sabit bir sayı kadar arttırmak isterseniz StockIncrease parametresini, sabit bir sayı kadar azaltmak isterseniz StockDecrease parametresini kullnamalısınız. Stock parametresi numerik, StockIncrease ve StockDecrease parametreleri ise pozitif tam sayı değeri alabilirler.    Bu metod aracılığı ile Çoklu stok parametreleri de güncellenebilmekteridir, Stock3, Stock4 vb. şeklinde gönderilebilir. |

Örnek `data` alanları: `ProductCode`, `Stock`.
```json
[
  {
    "ProductCode": "T582",
    "Stock": "46"
  },
  {
    "ProductCode": "T582",
    "StockIncrease": "3"
  },
  {
    "ProductCode": "T582",
    "StockDecrease": "5"
  }
]
```

### `product/updateStockBySupplierCode`

`POST https://magaza.example/rest1/product/updateStockBySupplierCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SupplierProductCode`, `Stock`.
```json
[
  {
    "SupplierProductCode": "TKU582",
    "Stock": "46"
  }
]
```

### `product/resetAllStock`

`POST https://magaza.example/rest1/product/resetAllStock/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Stock` | url_param | int | hayır |  |

### `product/getAlarmList`

`POST https://magaza.example/rest1/product/getAlarmList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Filtreleme için Price veya Stock girilebilir. |
| `OnlyCurrentTime` | query | bool | hayır | Alarm zamanı geçmemiş olanları getir |
| `OnlyNotSend` | query | bool | hayır | Sadece gönderilmeyenleri getir |
| `SendingType` | query | str | hayır | Sadece gönderilmemişler listelenecekse gönderim tipi gönderilmeli. (email, sms, web_push, mobile_push) |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `orderby` | query | str | hayır | Örn: RecordTime DESC |
| `f` | query | str | hayır | Kullanılabilen operatörler: startwith,endwith,equal,greater,smaller,between,contain. Örn: "RecordTime\|1529931531\|greater" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchProductData` | query | bool | hayır |  |

### `product/markAlarmAsSent`

`POST https://magaza.example/rest1/product/markAlarmAsSent/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AlarmId` | url_param | int | evet |  |
| `SendingType` | query | str | hayır | (email, sms, web_push, mobile_push) |

### `product/setCategorySortNumber`

`POST https://magaza.example/rest1/product/setCategorySortNumber/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `ProductCode`, `CategoryCode`, `ListNo`.
```json
[
  {
    "ProductCode": "T582",
    "CategoryCode": "T668",
    "ListNo": 5
  }
]
```

### `product/setMultiDiscount`

`POST https://magaza.example/rest1/product/setMultiDiscount/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Id değeri varsa güncelleme yapar, yoksa ekleme yapar. Id değeri varsa ProductCode değeri ile uyumlu olması gereklidir.    Id değeri gönderilmeyip ProductCode, InitialQuantity, FinishQuantity değerleri ile eşleşen başka bir kayıt varsa güncelleme yapar. |

Örnek `data` alanları: `Id`, `ProductCode`, `InitialQuantity`, `FinishQuantity`, `PercentDiscount`, `status`.
```json
[
  {
    "Id": 123,
    "ProductCode": "T668",
    "InitialQuantity": 10,
    "FinishQuantity": 100,
    "PercentDiscount": 10,
    "status": 1
  }
]
```

### `product/removeMultiDiscount`

`POST https://magaza.example/rest1/product/removeMultiDiscount/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Id değeri ProductCode değeri ile uyumlu olması zorundadır.   Id parametresi yerine RemoveAll:true gönderilirse o ürüne ait tüm kayıtlar silinecektir. |

Örnek `data` alanları: `Id`, `ProductCode`.
```json
[
  {
    "Id": 123,
    "ProductCode": "T668"
  }
]
```

### `product/fields`

`POST https://magaza.example/rest1/product/fields/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | str | hayır | Filtreleme için Price, Stock veya Additional girilmelidir. |
| `OnlyActive` | query | bool | hayır |  |
| `SubProduct` | query | bool | hayır | Alt ürün alanları için true gönderilmelidir. |

```json
"Stock"
```

### `product/getStockUnit`

`POST https://magaza.example/rest1/product/getStockUnit/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CategoryId \| 12 \| equal" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `product/setStockUnit`

`POST https://magaza.example/rest1/product/setStockUnit/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | You can send Id or Code for the update process. Values other than the ones sent will not be updated. |

Örnek `data` alanları: `Id`, `Name`, `DecimalNumber`, `BasketIncreaseAmount`, `AddToCartSeparately`, `PredefinedBasketCount`.
```json
[
  {
    "Id": "",
    "Name": "",
    "DecimalNumber": 0,
    "BasketIncreaseAmount": 1,
    "AddToCartSeparately": 1,
    "PredefinedBasketCount": 0
  }
]
```

### `product/setInstallment`

`POST https://magaza.example/rest1/product/setInstallment/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | ProductCode yerine ProductId gönderilebilir.    Oluşturma Percentage,Status,CommercialPercentage,CommercialStatus değerleri gönderilmezse orjinal tablodaki değerleri alırlar.    Güncelleme işleminde sadece gönderilen değerler için işlem yapılır. |

Örnek `data` alanları: `ProductCode`, `Installments`.
```json
[
  {
    "ProductCode": "",
    "Installments": [
      {
        "Id": "",
        "Percentage": "",
        "Status": "",
        "CommercialPercentage": "",
        "CommercialStatus": ""
      },
      {
        "Id": "",
        "Percentage": "",
        "Status": "",
        "CommercialPercentage": "",
        "CommercialStatus": ""
      }
    ]
  }
]
```

### `product/getVideoCategories`

`POST https://magaza.example/rest1/product/getVideoCategories/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | url_param | int | hayır | Id ile sorgulama yapılabilir. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CategoryId \| 12 \| equal" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `product/getVideoList`

`POST https://magaza.example/rest1/product/getVideoList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | hayır | Id ile sorgulama yapılabilir. |
| `ProductId` | query | int | hayır | ProductId ile sorgulama yapılabilir. |
| `VideoCategoryId` | query | int | hayır | VideoCategoryId ile sorgulama yapılabilir. VideoCategoryId'leri görmek için getVideoCategories metodunu kullanabilirsiniz. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CategoryId \| 12 \| equal" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `product/setVideo`

`POST https://magaza.example/rest1/product/setVideo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Id değeri gönderilmezse ekleme yapar, gönderilirse güncelleme yapar.    'ImageUrl' parametresi aracılığıyla resim URL'i göndererek video resmi ekleyebilirsiniz.  Eğer dosyadan resim eklemek istiyorsanız, data alanındaki ilk gelen videotu kabul edeceğiz.    VideoCategoryId'leri görmek için getVideoCategories metodunu kullanabilirsiniz. |
| `image` | file | file | hayır |  |

Örnek `data` alanları: `Id`, `ProductId`, `VideoCategoryId`, `Title`, `Subject`, `EmbedCode`, `Tags`, `ListNo`, `Status`, `PublishedVideo`.
```json
[
  {
    "Id": "",
    "ProductId": "",
    "VideoCategoryId": "",
    "Title": "",
    "Subject": "",
    "EmbedCode": "",
    "Tags": "",
    "ListNo": "",
    "Status": "",
    "PublishedVideo": ""
  }
]
```

### `product/deleteVideo`

`POST https://magaza.example/rest1/product/deleteVideo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Ürün videosunu silmek için  "ProductId" ile ürün id'sini gönderebilirsiniz. |

Örnek `data` alanları: `Id`.
```json
[
  {
    "Id": ""
  }
]
```

### `product/getTags`

`POST https://magaza.example/rest1/product/getTags/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `TagId` | query | int | hayır | TagId ile sorgulama yapılabilir. |
| `ProductId` | query | int | hayır | ProductId ile sorgulama yapılabilir. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |

### `product/setTags`

`POST https://magaza.example/rest1/product/setTags/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | TagId girilmediği durumda TagName isminde veri varsa bu veriyi güncellemektedir. Dil desteği sadece vitrin alanı için verilmiştir. |

Örnek `data` alanları: `TagId`, `TagName`, `TagLink`, `SeoTitle`, `SeoDescription`, `Showcase`.
```json
[
  {
    "TagId": "",
    "TagName": "",
    "TagLink": "",
    "SeoTitle": "",
    "SeoDescription": "",
    "Showcase": {
      "Top": "",
      "Bottom": "",
      "MobileTop": "",
      "MobileBottom": "",
      "Language": ""
    }
  }
]
```

## Setting

Kod güncelleme ve önbellek silme.

### `setting/getExchangeRates`

`POST https://magaza.example/rest1/setting/getExchangeRates/`

Sistemde kayıtlı kur bilgisini döner. Currency gönderildiği takdirde ilgili para birimi için, Date gönderildiği takdirde o gün için kur bilgisini döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Currency` | url_param | str | hayır |  |
| `Date` | query | str | hayır | Örnek: "2016-12-14T", "2017-01-28T13:00:00Z", 1485594000 |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

### `setting/setExchangeRates`

`POST https://magaza.example/rest1/setting/setExchangeRates/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `CurrencyCode`, `Rate`.
```json
[
  {
    "CurrencyCode": "USD",
    "Rate": 5.85
  }
]
```

### `setting/getSettingByKey`

`POST https://magaza.example/rest1/setting/getSettingByKey/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Key` | url_param | str | evet |  |

### `setting/getMobileSettings`

`POST https://magaza.example/rest1/setting/getMobileSettings/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Key` | url_param | str | evet |  |

### `setting/getSettingByCategory`

`POST https://magaza.example/rest1/setting/getSettingByCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CategoryId` | url_param | str | evet |  |

### `setting/getSettingCategories`

`POST https://magaza.example/rest1/setting/getSettingCategories/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `setting/setSetting`

`POST https://magaza.example/rest1/setting/setSetting/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Key`, `Value`.
```json
[
  {
    "Key": "AyarAnahtarı",
    "Value": "Değer"
  },
  {
    "Key": "AyarAnahtarı2",
    "Value": "Değer2"
  }
]
```

### `setting/getSocialAccounts`

`POST https://magaza.example/rest1/setting/getSocialAccounts/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `setting/getAddressFields`

`POST https://magaza.example/rest1/setting/getAddressFields/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `setting/deleteCache`

`POST https://magaza.example/rest1/setting/deleteCache/`

Web servis işlemleri sonunda ön tanımlı olarak önbellek temizlenmemektedir. Önbelleği temizlemek için bu metodu kullanınız.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | str | hayır | Bu parametre gönderilmezse tüm önbellek temizlenir. Yalnızca ürünler önbelleğini temizlemek 'product' gönderin. Link önbelleğini temizlemek için 'url' olarak gönderin. |
| `ProductIds` | query | str | hayır | Sadece belirli ürün idlerine sahip ürünlerin önbelleğini temizlemek için kullanılır. Ürün idlerini aralarında webservis ayraç ayarına girdiğiniz (default: \|) ayracı kullanarak gönderiniz. |
| `ProductCodes` | query | str | hayır | Sadece belirli ürün kodlarına sahip ürünlerin önbelleğini temizlemek için kullanılır. Ürün kodlarını aralarında webservis ayraç ayarına girdiğiniz (default: \|) ayracı kullanarak gönderiniz. |
| `Url` | query | str | hayır | Bu parametre type 'url' olarak girilirse kullanılır. |

```json
"548|549|669"
```

```json
"T548|T549|TA9"
```

### `setting/getLanguages`

`POST https://magaza.example/rest1/setting/getLanguages/`

Servisten dönen parametreleri post olarak göndererek filte olarak kullanabilirsiniz.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `language` | query | str | hayır | Dil kodu |

### `setting/updateCode`

`POST https://magaza.example/rest1/setting/updateCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Product, Subproduct, Customer, Category, CustomerGroup, FilterGroup, FilterOption, Campaingn, SubProductGroup, CustomerAddress, BranchOffice kodları desteklenmektedir. |

Örnek `data` alanları: `Type`, `OldCode`, `NewCode`.
```json
[
  {
    "Type": "Product",
    "OldCode": "T88",
    "NewCode": "AY37K"
  }
]
```

## SubProduct

Alt ürün, özellik ve stok/fiyat.

### `subProduct/addImageFromFile`

`POST https://magaza.example/rest1/subProduct/addImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | evet |  |
| `list_number` | query | int | hayır |  |
| `PropertyType` | query | int | evet | Nitelik numarası girilmelidir. Örneğin nitelik_1 için '1' girilmelidir. nitelik_2 için ise '2' girilmelidir |
| `Property` | query | str | evet | PropertyType'de verilen niteliğin alması istenilen değer girilmelidir. Örneğin : Kırmızı, Mavi vb. |
| `ImageSizeWidthHeightControl` | query | int | evet | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |

### `subProduct/addImageFromLink`

`POST https://magaza.example/rest1/subProduct/addImageFromLink/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ImageSizeWidthHeightControl` | post | int | hayır | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |
| `data` | query | text | evet | PropertyType ve Property opsiyoneldir. Gönderildiğinde görsel ilgili varyant ile ilişkilendirilir: PropertyType için nitelik_1'de '1' (veya Property1), nitelik_2'de '2' (veya Property2) gönderilir, Property ise niteliğin değerini taşır (örn: Kırmızı, S). Gönderilmezse görsel alt ürünün ilk niteliğine (TurId1) eklenir. |

Örnek `data` alanları: `SubProductCode`, `ImageUrl`, `ListNumber`, `PropertyType`, `Property`.
```json
[
  {
    "SubProductCode": "TA582",
    "ImageUrl": "http://celil.meticaret.com/kiz-cocuk-elbise-503-64-B.jpg",
    "ListNumber": "",
    "PropertyType": "1",
    "Property": "Kırmızı"
  }
]
```

### `subProduct/addSubProducts`

`POST https://magaza.example/rest1/subProduct/addSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Property1GroupId ve Property2GroupId verileri gönderilmezse 'Yönetim Paneli > Ürünler > Alt Ürün > Gruplar > Web Servis Alt Ürün Tür Grubu Belirle' ayarları baz alınır.     SubProductCode gönderilmesze kod otomatik oluşur. |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`, `Barcode`, `SupplierSubProductCode`, `Property1GroupId`, `Property2GroupId`, `Property1`, `Property2`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `Stock`, `CBM`, `Weight`, `IsActive`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117",
    "Barcode": "123DSD235T",
    "SupplierSubProductCode": "",
    "Property1GroupId": "",
    "Property2GroupId": "",
    "Property1": "yeşil",
    "Property2": "S",
    "BuyingPrice": "200",
    "SellingPrice": "350",
    "DiscountedSellingPrice": "300",
    "VendorSellingPrice": "380",
    "Stock": "35",
    "CBM": "30",
    "Weight": "30",
    "IsActive": "1"
  }
]
```

### `subProduct/deleteSubProducts`

`POST https://magaza.example/rest1/subProduct/deleteSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117"
  }
]
```

### `subProduct/getProperties`

`POST https://magaza.example/rest1/subProduct/getProperties/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `Translation` | query | text | hayır |  |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `subProduct/setProperties`

`POST https://magaza.example/rest1/subProduct/setProperties/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | PropertyId parametresi gönderilmezse ekleme yapar, gönderilirse güncelleme yapar.  'ImageUrl' parametresi aracılığıyla resmin URL'sini göndererek ekleyebilirsiniz. Eğer dosyadan resim eklemek istiyorsanız, data alanındaki ilk gelen JSON objesini kabul edeceğiz. |
| `image` | file | file | hayır |  |

Örnek `data` alanları: `PropertyId`, `GroupId`, `Property`, `ColorCode`, `ListNo`, `ImageUrl`.
```json
[
  {
    "PropertyId": "5",
    "GroupId": "2",
    "Property": "Beyaz",
    "ColorCode": "#FFFFFF",
    "ListNo": "0",
    "ImageUrl": ""
  }
]
```

### `subProduct/setPropertyLanguages`

`POST https://magaza.example/rest1/subProduct/setPropertyLanguages/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | GroupName : GroupId Tespit edilememişse GroupName gönderilebilir   PropertyType : Grup bilgisi tespit edilemiyor ve panelde tanımlanan webservis alt ürün gruplarının kullanılması isteniyorsa niletik bir için 1, nitelik 2 için 2 gönderilmelidir   PropertyName : PropertyId tespit edilememişse PropertyName gönderilebilir. |

Örnek `data` alanları: `GroupId`, `GroupName`, `PropertyType`, `PropertyId`, `PropertyName`, `Language`, `Translation`.
```json
[
  {
    "GroupId": "16",
    "GroupName": "Renk",
    "PropertyType": "1",
    "PropertyId": "16",
    "PropertyName": "Kırmızı",
    "Language": "en",
    "Translation": "red"
  }
]
```

### `subProduct/getPropertyGroups`

`POST https://magaza.example/rest1/subProduct/getPropertyGroups/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `subProduct/setPropertyGroups`

`POST https://magaza.example/rest1/subProduct/setPropertyGroups/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Type için:   1:Combo 2:Radio 3:Kutucuk  PropertyId parametresi gönderilmezse ekleme yapar, gönderilirse güncelleme yapar.  PropertyCode gönderilirse PropertyCode'a göre güncelleme yapar |

Örnek `data` alanları: `PropertyId`, `Name`, `GroupName`, `Type`.
```json
[
  {
    "PropertyId": 1,
    "Name": "",
    "GroupName": "",
    "Type": 1
  }
]
```

### `subProduct/getSubProductByCode`

`POST https://magaza.example/rest1/subProduct/getSubProductByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SubProductCode` | url_param | str | evet |  |
| `single` | query | bool | evet |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |

### `subProduct/getSubProductById`

`POST https://magaza.example/rest1/subProduct/getSubProductById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SubProductId` | url_param | int | evet |  |
| `single` | query | bool | evet |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |

### `subProduct/getSubProducts`

`POST https://magaza.example/rest1/subProduct/getSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerGroupCode` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Varsayılan:50, Max:500 |
| `CategoryIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `BrandIds` | query | text | hayır | 123\|321 şeklinde girilebilir. |
| `columns` | query | text | hayır | Örnek: "SubProductCode,MainProductId,UpdateDate" |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır | Örnek: "UpdateDate ASC", Default: "UpdateDate DESC" |
| `FetchPriceWithComma` | query | bool | hayır |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |
| `FetchGroupInfo` | query | bool | hayır |  |
| `FetchAdditionalInfo` | query | bool | hayır |  |
| `FetchSupplierDetails` | query | bool | hayır |  |
| `FlexiblePrices` | query | str | hayır | Örnek : Price3,Price4 (product/fields metodundan erişilebilir.) |
| `StockFields` | query | str | hayır | Örnek : Stock2,Stock3 (product/fields metodundan erişilebilir.) |

### `subProduct/getSubProductsByParentCode`

`POST https://magaza.example/rest1/subProduct/getSubProductsByParentCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ParentCode` | url_param | str | evet |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Varsayılan:50, Max:500 |
| `columns` | query | text | hayır | Örnek: "SubProductCode,MainProductId,UpdateDate" |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `orderby` | query | str | hayır | Örnek: "UpdateDate ASC", Default: "UpdateDate DESC" |
| `FetchDiscountedPrice` | query | bool | hayır |  |

### `subProduct/getSubProductsByParentId`

`POST https://magaza.example/rest1/subProduct/getSubProductsByParentId/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ParentId` | url_param | int | evet |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır | Varsayılan:50, Max:500 |
| `columns` | query | text | hayır | Örnek: "SubProductCode,MainProductId" |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |
| `orderby` | query | str | hayır | Örnek: "UpdateDate ASC", Default: "UpdateDate DESC" |
| `CustomerGroupCode` | query | text | hayır |  |
| `FetchDiscountedPrice` | query | bool | hayır |  |

### `subProduct/setSubProducts`

`POST https://magaza.example/rest1/subProduct/setSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Property1GroupId ve Property2GroupId verileri gönderilmezse 'Yönetim Paneli > Ürünler > Alt Ürün > Gruplar > Web Servis Alt Ürün Tür Grubu Belirle' ayarları baz alınır.    SubProductCode gönderilmesze alt ürün ekleme işlemi yapılır ve kod otomatik oluşur. |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`, `Barcode`, `SupplierSubProductCode`, `Property1GroupId`, `Property2GroupId`, `Property1`, `Property2`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `Stock`, `CBM`, `Weight`, `IsActive`, `Point`, `IsDefaultSubProduct`, `AdditionalInfo`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117",
    "Barcode": "123DSD235T",
    "SupplierSubProductCode": "",
    "Property1GroupId": "",
    "Property2GroupId": "",
    "Property1": "yeşil",
    "Property2": "S",
    "BuyingPrice": "200",
    "SellingPrice": "350",
    "DiscountedSellingPrice": "300",
    "VendorSellingPrice": "380",
    "Stock": "35",
    "CBM": "30",
    "Weight": "30",
    "IsActive": "1",
    "Point": 0,
    "IsDefaultSubProduct": 0,
    "AdditionalInfo": [
      {
        "Language": "tr",
        "Info": "123"
      },
      {
        "Language": "en",
        "Info": "321"
      }
    ]
  }
]
```

### `subProduct/updateSubProducts`

`POST https://magaza.example/rest1/subProduct/updateSubProducts/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Property1GroupId ve Property2GroupId verileri gönderilmezse 'Yönetim Paneli > Ürünler > Alt Ürün > Gruplar > Web Servis Alt Ürün Tür Grubu Belirle' ayarları baz alınır.    MainProductCode yerine MainProductId, SubProductCode yerine SubProductId kullanılabilir. |

Örnek `data` alanları: `MainProductCode`, `SubProductCode`, `Barcode`, `SupplierSubProductCode`, `Property1GroupId`, `Property2GroupId`, `Property1`, `Property2`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `Stock`, `CBM`, `Weight`, `IsActive`.
```json
[
  {
    "MainProductCode": "T641",
    "SubProductCode": "TA117",
    "Barcode": "123DSD235T",
    "SupplierSubProductCode": "",
    "Property1GroupId": "",
    "Property2GroupId": "",
    "Property1": "yeşil",
    "Property2": "S",
    "BuyingPrice": "200",
    "SellingPrice": "350",
    "DiscountedSellingPrice": "300",
    "VendorSellingPrice": "380",
    "Stock": "35",
    "CBM": "30",
    "Weight": "30",
    "IsActive": "1"
  }
]
```

### `subProduct/updateStock`

`POST https://magaza.example/rest1/subProduct/updateStock/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Stok değerini sabit bir değere atamak isterseniz Stok parametresini, sabit bir sayı kadar arttırmak isterseniz StockIncrease parametresini, sabit bir sayı kadar azaltmak isterseniz StockDecrease parametresini kullnamalısınız. Stock parametresi numerik, StockIncrease ve StockDecrease parametreleri ise pozitif tam sayı değeri alabilirler.   SubProductCode yerine SubProductId kullanılarak da güncelleme yapılabilir.     Bu metod aracılığı ile Çoklu stok parametreleri de güncellenebilmekteridir, Stock3, Stock4 vb. şeklinde gönderilebilir. |

Örnek `data` alanları: `SubProductCode`, `Stock`.
```json
[
  {
    "SubProductCode": "TA26",
    "Stock": "17"
  },
  {
    "SubProductCode": "TA26",
    "StockIncrease": "3"
  },
  {
    "SubProductCode": "TA26",
    "StockDecrease": "5"
  }
]
```

### `subProduct/updateStockBySupplierCode`

`POST https://magaza.example/rest1/subProduct/updateStockBySupplierCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SupplierSubProductCode`, `Stock`.
```json
[
  {
    "SupplierSubProductCode": "TKU582",
    "Stock": "46"
  }
]
```

### `subProduct/updatePrice`

`POST https://magaza.example/rest1/subProduct/updatePrice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SubProductCode`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`, `OnSale`.
```json
[
  {
    "SubProductCode": "TA26",
    "BuyingPrice": "130",
    "SellingPrice": "150",
    "DiscountedSellingPrice": "120",
    "VendorSellingPrice": "180",
    "OnSale": false
  }
]
```

### `subProduct/updateStockAndPrice`

`POST https://magaza.example/rest1/subProduct/updateStockAndPrice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SubProductCode`, `Stock`, `BuyingPrice`, `SellingPrice`, `DiscountedSellingPrice`, `VendorSellingPrice`.
```json
[
  {
    "SubProductCode": "TA26",
    "Stock": "27",
    "BuyingPrice": "130",
    "SellingPrice": "150",
    "DiscountedSellingPrice": "120",
    "VendorSellingPrice": "180"
  }
]
```

## Supplier

Tedarikçi ve mağaza görselleri.

### `supplier/deleteStoreCover`

`POST https://magaza.example/rest1/supplier/deleteStoreCover/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |

### `supplier/deleteStoreLogo`

`POST https://magaza.example/rest1/supplier/deleteStoreLogo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |

### `supplier/getESuppliers`

`POST https://magaza.example/rest1/supplier/getESuppliers/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `supplier/getSuppliers`

`POST https://magaza.example/rest1/supplier/getSuppliers/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `supplier/getSupplierById`

`POST https://magaza.example/rest1/supplier/getSupplierById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SupplierId` | url_param | int | evet |  |

### `supplier/updateStoreCover`

`POST https://magaza.example/rest1/supplier/updateStoreCover/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |
| `desc` | query | text | hayır | Store description |
| `image` | file | file | evet |  |

### `supplier/updateStoreLogo`

`POST https://magaza.example/rest1/supplier/updateStoreLogo/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `StoreId` | url_param | int | evet |  |
| `image` | file | file | evet |  |

### `supplier/updateStoreName`

`POST https://magaza.example/rest1/supplier/updateStoreName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SupplierId`, `StoreName`.
```json
[
  {
    "SupplierId": "",
    "StoreName": ""
  }
]
```

### `supplier/updateSupplier`

`POST https://magaza.example/rest1/supplier/updateSupplier/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `SupplierId`, `Title`, `Email`, `UserName`, `StoreName`, `ContactPerson`, `TaxDepartment`, `TaxNumber`, `IBAN`, `Mobile`, `Tel`, `Fax`, `Website`, `Address`, `City`, `Town`, `AdditionalField1`, `AdditionalField2`, `AdditionalField3`, `AdditionalField4`, `AdditionalField5`, `AdditionalField6`, `AdditionalField7`.
```json
[
  {
    "SupplierId": "",
    "Title": "",
    "Email": "",
    "UserName": "",
    "StoreName": "",
    "ContactPerson": "",
    "TaxDepartment": "",
    "TaxNumber": "",
    "IBAN": "",
    "Mobile": "",
    "Tel": "",
    "Fax": "",
    "Website": "",
    "Address": "",
    "City": "",
    "Town": "",
    "AdditionalField1": "",
    "AdditionalField2": "",
    "AdditionalField3": "",
    "AdditionalField4": "",
    "AdditionalField5": "",
    "AdditionalField6": "",
    "AdditionalField7": ""
  }
]
```

### `supplier/setSupplier`

`POST https://magaza.example/rest1/supplier/setSupplier/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Title`, `Email`, `UserName`, `StoreName`, `ContactPerson`, `TaxDepartment`, `TaxNumber`, `IBAN`, `Mobile`, `Tel`, `Fax`, `Website`, `Address`, `City`, `Town`, `AdditionalField1`, `AdditionalField2`, `AdditionalField3`, `AdditionalField4`, `AdditionalField5`, `AdditionalField6`, `AdditionalField7`.
```json
[
  {
    "Title": "",
    "Email": "",
    "UserName": "",
    "StoreName": "",
    "ContactPerson": "",
    "TaxDepartment": "",
    "TaxNumber": "",
    "IBAN": "",
    "Mobile": "",
    "Tel": "",
    "Fax": "",
    "Website": "",
    "Address": "",
    "City": "",
    "Town": "",
    "AdditionalField1": "",
    "AdditionalField2": "",
    "AdditionalField3": "",
    "AdditionalField4": "",
    "AdditionalField5": "",
    "AdditionalField6": "",
    "AdditionalField7": ""
  }
]
```

## Ticket

Destek talebi ve iletişim mesajı.

### `ticket/createTicket` (alpha)

`POST https://magaza.example/rest1/ticket/createTicket/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `CustomerId`, `DepartmentId`, `AdminUserId`, `ResolutionId`, `Status`, `Title`, `Text`, `Note`, `RecordLink`.
```json
[
  {
    "CustomerId": "106",
    "DepartmentId": "",
    "AdminUserId": "",
    "ResolutionId": "",
    "Status": "",
    "Title": "",
    "Text": "",
    "Note": "",
    "RecordLink": ""
  }
]
```

### `ticket/getDepartments` (alpha)

`POST https://magaza.example/rest1/ticket/getDepartments/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `ticket/getResolutions` (alpha)

`POST https://magaza.example/rest1/ticket/getResolutions/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `ticket/getTickets`

`POST https://magaza.example/rest1/ticket/getTickets/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `ticket/getTicketDetails`

`POST https://magaza.example/rest1/ticket/getTicketDetails/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `TicketId` | url_param | int | evet |  |
| `FetchNameData` | query | bool | hayır |  |

### `ticket/reply`

`POST https://magaza.example/rest1/ticket/reply/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `TicketId`, `Text`, `AdminUserId`.
```json
[
  {
    "TicketId": "1001",
    "Text": "Ürün açıklaması girilmiştir.",
    "AdminUserId": ""
  }
]
```

### `ticket/getContactDepartments` (alpha)

`POST https://magaza.example/rest1/ticket/getContactDepartments/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `ticket/getContactMessages` (alpha)

`POST https://magaza.example/rest1/ticket/getContactMessages/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |

### `ticket/sendNewMessage`

`POST https://magaza.example/rest1/ticket/sendNewMessage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `TicketId`, `Text`, `CustomerId`.
```json
[
  {
    "TicketId": "1001",
    "Text": "Ürün açıklaması.",
    "CustomerId": ""
  }
]
```

## User

Yönetim paneli ve web servis kullanıcıları. Panele yönetici olarak giriş linki.

### `user/getPanelAdmins`

`POST https://magaza.example/rest1/user/getPanelAdmins/`

Yönetim paneli kullanıcılarını (admin) listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `user/getUsers`

`POST https://magaza.example/rest1/user/getUsers/`

Web servis kullanıcılarını listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

### `user/getPanelAdminByPassword`

`POST https://magaza.example/rest1/user/getPanelAdminByPassword/`

Kullanıcı adı ve şifresi girilen yönetim paneli kullanıcısının (admin) ID ve WS Kodunu döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `user` | query | str | evet |  |
| `pass` | query | pass | evet |  |

### `user/loginAsPanelAdmin`

`POST https://magaza.example/rest1/user/loginAsPanelAdmin/`

Admin ID veya Code alanlarından birinin doldurulması zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AdminId` | query | int | hayır |  |
| `AdminCode` | query | str | hayır |  |
| `RedirectUrl` | query | str | hayır | Yönlendirilmek istenilen link, "mod/product/Products/index" şeklinde olmalıdır |
| `TopFrameUrl` | query | str | hayır | Yönlendirilmek istenilen sayfanın menüsü yerine farklı bir menü yerleştirmek isterseniz, linki "tsoft/yeni/menu" şeklinde gönderin. |

### `user/setAdminDevice`

`POST https://magaza.example/rest1/user/setAdminDevice/`

Tsoft Mobile Panel bildirimleri için cihazlar kaydedilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `device_id` | query | str | evet |  |
| `device_name` | query | str | hayır |  |
| `registration_id` | query | str | evet |  |
| `admin_id` | query | str | hayır |  |
| `platform` | query | str | hayır |  |
| `language` | query | str | hayır |  |
| `notification_settings` | query | text | hayır |  |

```json
{
  "orderNotification": 1,
  "memberNotification": 0,
  "commentNotification": 0,
  "versionNotification": 0,
  "ticketNotification": 0
}
```

### `user/getAdminDevices`

`POST https://magaza.example/rest1/user/getAdminDevices/`

Tsoft Mobile Panel bildirimleri için cihazlar getirilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `device_id` | query | str | hayır |  |

### `user/deleteAdminDevice`

`POST https://magaza.example/rest1/user/deleteAdminDevice/`

Tsoft Mobile Panel bildirimleri için cihaz silme.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `device_id` | query | str | evet |  |

## News

Haber kayıtları.

### `news/getNews`

`POST https://magaza.example/rest1/news/getNews/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `news/setNews`

`POST https://magaza.example/rest1/news/setNews/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Id parametresi varsa güncelleme yapar, yoksa ekleme yapar |

Örnek `data` alanları: `Id`, `ShortTitle`, `ShortDescription`, `Title`, `Description`, `BlockId`, `ReadCount`, `Status`, `ShowOnMemeberPanel`, `ShowOnVendorPanel`, `SeoLink`, `SeoTitle`, `SeoDescription`, `ListNo`.
```json
[
  {
    "Id": 62,
    "ShortTitle": "T-soft Projeleri",
    "ShortDescription": "",
    "Title": "",
    "Description": "",
    "BlockId": 1019,
    "ReadCount": 458,
    "Status": 1,
    "ShowOnMemeberPanel": 0,
    "ShowOnVendorPanel": 0,
    "SeoLink": "seo-url",
    "SeoTitle": "T-soft Projeleri",
    "SeoDescription": "T-soft Projelerin",
    "ListNo": "2"
  }
]
```

## Hopi

Hopi kampanya oturumu.

### `hopi/signin`

`POST https://magaza.example/rest1/hopi/signin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `HopiToken` | query | text | hayır |  |
| `BearerToken` | query | text | hayır | Bu parametre ile HopiToken gönderilmediği durumlarda HopiToken ın alınması sağlanır. |

### `hopi/setCampaign`

`POST https://magaza.example/rest1/hopi/setCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Coin` | query | text | hayır |  |
| `Campaign` | query | text | hayır |  |

### `hopi/removeCampaign`

`POST https://magaza.example/rest1/hopi/removeCampaign/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## Zubizu

Zubizu kampanya oturumu.

### `zubizu/signin`

`POST https://magaza.example/rest1/zubizu/signin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ZubizuToken` | query | text | evet |  |

### `zubizu/signout`

`POST https://magaza.example/rest1/zubizu/signout/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `zubizu/summary`

`POST https://magaza.example/rest1/zubizu/summary/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `zubizu/getCampaigns`

`POST https://magaza.example/rest1/zubizu/getCampaigns/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

### `zubizu/setCampaign`

`POST https://magaza.example/rest1/zubizu/setCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Group` | query | text | evet |  |
| `CampaignId` | query | text | evet |  |

### `zubizu/unsetCampaign`

`POST https://magaza.example/rest1/zubizu/unsetCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CampaignId` | query | text | evet |  |

## Adapter

Sendheap ve Nildesk aktarımı.

### `adapter/sendheap`

`POST https://magaza.example/rest1/adapter/sendheap/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SendheapApiUsername` | query | text | evet | Sendheap panelinde Ayarlar > API kısmından oluşturulup kullanılmalıdır. |
| `SendheapApiPassword` | query | text | evet | Sendheap panelinde Ayarlar > API kısmından oluşturulup kullanılmalıdır. |
| `data` | query | text | evet | Type : Gönderilecek ileti tipi. Alabileceği değerler : email, sms, web_push, mobile_push    CustomerCode parametresi ile ileti gönderilecek üye seçilir. CustomerCode yerine CustomerId veya CustomerEmail de kullanılabilir    TargetUrl parametresi bildirim gönderiminde kullanılır. Bildirime tıklandığında gitmesi istenen link girilir.    ImageUrl parametresi bildirim gönderiminde kullanılır. Bildirime resim eklenmek isteniyorsa resim linki gönderilir.    IconUrl parametresi bildirim gönderiminde kullanılır. Bildirim iconu değiştirilmek istenirse icon linki gönderilir. |

Örnek `data` alanları: `Type`, `Title`, `Content`, `CustomerCode`, `TargetUrl`, `IconUrl`, `ImageUrl`.
```json
[
  {
    "Type": "mobile_push",
    "Title": "Başlık",
    "Content": "İçerik",
    "CustomerCode": "T025",
    "TargetUrl": 1,
    "IconUrl": 0,
    "ImageUrl": 0
  }
]
```

### `adapter/nildesk`

`POST https://magaza.example/rest1/adapter/nildesk/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Body, Headers bilgileri istek atılacak nildesk servisine uygun şekilde ayarlanmalıdır. |

Örnek `data` alanları: `Platform`, `Url`, `Body`, `Headers`.
```json
[
  {
    "Platform": "Tsoft",
    "Url": "",
    "Body": {
      "domain": "test.test.com"
    },
    "Headers": "0"
  }
]
```

## Showcase

Vitrin yerleşimi.

### `showcase/getCategory`

`POST https://magaza.example/rest1/showcase/getCategory/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `version` | url_param | text | hayır | v4 veya v5 olarak girilebilir. Siteniz v4 ise v4 girmelisiniz. Boş bırakılırsa doğrudan v5 olarak işlem yapacaktır. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `showcase/get`

`POST https://magaza.example/rest1/showcase/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `version` | url_param | text | hayır | v4 veya v5 olarak girilebilir. Siteniz v4 ise v4 girmelisiniz. Boş bırakılırsa doğrudan v5 olarak işlem yapacaktır. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CategoryId \| 12 \| equal" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `showcase/set`

`POST https://magaza.example/rest1/showcase/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `version` | url_param | text | hayır | v4 veya v5 olarak girilebilir. Siteniz v4 ise v4 girmelisiniz. Boş bırakılırsa doğrudan v5 olarak işlem yapacaktır. |
| `data` | query | text | evet | Id parametresi varsa güncelleme yapar, yoksa ekleme yapar.    v4 siteler ParentCategoryId parametresi ekstra olarak kullanılabilir.    Deleted:1 gönderilirse ilgili koşulu sağlayan vitrin ürünleri silinir. |

Örnek `data` alanları: `Id`, `ProductId`, `CategoryId`, `ListNo`, `Deleted`.
```json
[
  {
    "Id": 62,
    "ProductId": 456,
    "CategoryId": 176,
    "ListNo": 1,
    "Deleted": 0
  }
]
```

## Point

Üye puanı ekleme veya düşürme.

### `point/get`

`POST https://magaza.example/rest1/point/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

### `point/set`

`POST https://magaza.example/rest1/point/set/`

Müşteriye puan ekleme veya mevcut puanı düşürme/sıfırlama işlemi yapılır. Point pozitif gönderilirse müşteriye puan eklenir. Point negatif gönderilirse müşterinin mevcut kullanılabilir puanından bu değerin mutlak değeri kadar düşülür. İstenen düşüm miktarı mevcut bakiyeden fazlaysa işlem hata vermez, bakiye sıfırlanır (puan sıfırlama).

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Point`, `CustomerId`, `Description`.
```json
[
  {
    "Point": 500,
    "CustomerId": 123,
    "Description": "Puan Eklendi"
  },
  {
    "Point": -200,
    "CustomerId": 123,
    "Description": "Puan Düşürüldü"
  }
]
```

## Cargo

Kargo gönderi logu.

### `cargo/setShipmentLog`

`POST https://magaza.example/rest1/cargo/setShipmentLog/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | CustomerId zorunludur. Point alanı pozitif ise ekleme, negatif ise düşürme/sıfırlama yapılır. |

Örnek `data` alanları: `CargoKey`, `MessageCode`, `MessageText`, `CargoTrackingNo`, `CargoTrackingUrl`, `RealTotalDesi`, `Desi`, `RealCargoAmount`, `ShipperBranchOffice`, `CargoLastMovement`, `ReceiverBranchOffice`, `EngagedInProcessingBranchOffice`, `CargoStatusDate`.
```json
[
  {
    "CargoKey": "T147",
    "MessageCode": "T123",
    "MessageText": "",
    "CargoTrackingNo": "",
    "CargoTrackingUrl": "",
    "RealTotalDesi": "",
    "Desi": "",
    "RealCargoAmount": "",
    "ShipperBranchOffice": "",
    "CargoLastMovement": "",
    "ReceiverBranchOffice": "",
    "EngagedInProcessingBranchOffice": "",
    "CargoStatusDate": ""
  }
]
```

## Widget

Widget yazma ve silme.

### `widget/set`

`POST https://magaza.example/rest1/widget/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |

```json
{
  "prefix": "app.test",
  "icon": "",
  "size": "1x1",
  "text": "Test",
  "url": "https://test.com",
  "bgimage": "https://test.com/img/logo.svg",
  "category": "",
  "order": "",
  "class": ""
}
```

### `widget/delete`

`POST https://magaza.example/rest1/widget/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `prefix` | url_param | text | hayır |  |

## Platform

Mobil/platform oturumu (CustomerHash): üye, sepet, sipariş, adres, iade.

### `platform/login`

`POST https://magaza.example/rest1/platform/login/`

E-posta, parola ve platform bilgileri ile kayıt varsa döner. Üye Girişi OTP Doğrulama (OtpSmsGiris) ayarı SMS veya E-posta seçiliyken web giriş ekranında hem doğrulama kodu hem e-posta/parola seçeneği sunulur; aynı şekilde bu metot da iki yolu birlikte destekler ve hangisinin kullanıldığı LoginType ile bildirilir. LoginType=otp gönderildiğinde giriş iki adımlıdır: kanal SMS ise yalnızca Phone, kanal E-posta ise yalnızca Email gönderilen istek 6 haneli kodu ilgili adrese yollayıp extra.otpRequired=true döner, aynı istek Otp ile tekrarlandığında oturum açılır. Kod SMS kanalında 120, e-posta kanalında 300 saniye geçerlidir ve 5 hatalı denemede geçersiz olur (CUE040). LoginType gönderilmediğinde Email/Phone + Password akışı çalışır ve ayardan bağımsız olarak değişmez. Uygulamanın hangi seçenekleri göstereceğini ve kod için telefon mu e-posta mı isteyeceğini mobile/init cevabındaki otp_login_channel alanı (none | sms | email) belirler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Email` | query | str | evet |  |
| `Platform` | query | str | evet |  |
| `Phone` | query | str | hayır | Telefonla giriş aktif ise telefon ile girebilmek için email paramtresinin yerine kullanılabilir. SMS ile Giriş ayarı açıkken zorunludur ve Email/Password dikkate alınmaz. |
| `Password` | query | pass | evet |  |
| `LoginType` | query | str | hayır | otp gönderilirse doğrulama kodu ile giriş yapılır. Kanal SMS iken Phone, kanal E-posta iken Email zorunludur; Password dikkate alınmaz. Gönderilmezse veya başka bir değer gönderilirse e-posta/telefon + parola akışı çalışır. OTP doğrulama kapalıyken otp gönderilirse CUE041 döner. |
| `Otp` | query | str | hayır | LoginType=otp iken telefona (SMS kanalı) veya e-posta adresine (E-posta kanalı) gönderilen 6 haneli doğrulama kodu. Boş bırakılan ilk istek kodu gönderir, ikinci istekte kod ile birlikte gönderilir. |
| `CustomerHash` | query | str | hayır | Sepet yenileme işlemleri için gönderilmelidir. |

### `platform/socialLogin`

`POST https://magaza.example/rest1/platform/socialLogin/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | evet |  |
| `SocialPlatform` | query | str | evet | Hangi sosyal platform üzerinden giriş yapılacaksa o platform girilmelidir. facebook, google, apple gibi |
| `SocialToken` | query | str | evet |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `id`, `name`, `email`, `gender`, `picture_url`.
```json
[
  {
    "id": "12345678",
    "name": "rumeysa",
    "email": "ornek@magaza.example",
    "gender": "female",
    "picture_url": ""
  }
]
```

### `platform/connectLinker`

`POST https://magaza.example/rest1/platform/connectLinker/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |
| `RedirectUrl` | query | str | hayır |  |

### `platform/personalizationSendImage`

`POST https://magaza.example/rest1/platform/personalizationSendImage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `Image` | file | file | evet |  |
| `ProductId` | query | int | evet |  |

### `platform/updateOrderStatusAs`

`POST https://magaza.example/rest1/platform/updateOrderStatusAs/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderStatusId` | url_param | str | evet | Bu parametre data içinde yine OrderStatusId şeklinde her sipariş için ayrı gönderilebilir.   NOT : data içinde gönderilirse burada boş bırakılmalıdır. (gönderilmemelidir) |
| `data` | query | text | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş siparişler için 1 gönderiniz |

Örnek `data` alanları: `OrderCode`, `CargoCode`, `CargoTrackingCode`, `Shipment`.
```json
[
  {
    "OrderCode": "TS1703182",
    "CargoCode": "T1",
    "CargoTrackingCode": "ER34342",
    "Shipment": {
      "CargoKey": "789654",
      "CargoTrackingNo": "CR789654",
      "CargoTrackingUrl": "http://cargocampany.com/tracking/CR789654",
      "BarcodeLink": "http://cargocampany.com/tracking/CR789654"
    }
  }
]
```

### `platform/reorder`

`POST https://magaza.example/rest1/platform/reorder/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `OrderId` | query | int | evet |  |

### `platform/orderTracking`

`POST https://magaza.example/rest1/platform/orderTracking/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `OrderCode` | query | str | evet |  |
| `Email` | query | str | evet |  |
| `Phone` | query | str | evet |  |

### `platform/getSubscribeList`

`POST https://magaza.example/rest1/platform/getSubscribeList/`

Müşterinin abonelik siparişlerini listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |

### `platform/getCustomer`

`POST https://magaza.example/rest1/platform/getCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

### `platform/getOrders`

`POST https://magaza.example/rest1/platform/getOrders/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `FetchProductData` | query | bool | hayır |  |
| `FetchProductDetail` | query | bool | hayır |  |
| `FetchProductAdditionalData` | query | bool | hayır |  |
| `FetchPackageContent` | query | bool | hayır |  |
| `FetchWithArchive` | query | bool | hayır |  |
| `FetchCustomerData` | query | bool | hayır |  |
| `FetchInvoiceAddress` | query | bool | hayır |  |
| `FetchDeliveryAddress` | query | bool | hayır |  |
| `FetchCampaignData` | query | bool | hayır |  |
| `FetchOrderContract` | query | bool | hayır |  |
| `FetchCargoDetail` | query | bool | hayır |  |
| `FetchShipmentDetail` | query | bool | hayır |  |
| `FetchDeleteds` | query | bool | hayır |  |

### `platform/orderTracking`

`POST https://magaza.example/rest1/platform/orderTracking/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `OrderCode` | query | str | evet |  |
| `Email` | query | str | hayır |  |
| `Phone` | query | str | hayır |  |

### `platform/deleteCustomer`

`POST https://magaza.example/rest1/platform/deleteCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

### `platform/setCustomer`

`POST https://magaza.example/rest1/platform/setCustomer/`

Oturumdaki üyeyi günceller; oturum yoksa yeni üye kaydı açar. Üye Girişi OTP Doğrulama (OtpSmsGiris) ayarı açıkken yeni kayıt doğrulama gerektirir: Otp gönderilmeyen istek, kanal SMS ise data içindeki Mobile numarasına, kanal E-posta ise data içindeki Email adresine 6 haneli kod yollayıp extra.otpRequired=true döner; aynı istek Otp ile tekrarlandığında kayıt tamamlanır. Bu durumda kayıt ekranında parola alanı olmadığı için (customer/getFields parola alanını döndürmez) parola gönderilmesi gerekmez, üye girişini doğrulama kodu ile yapar. Mevcut üyenin güncellemesi bu doğrulamadan etkilenmez.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `Otp` | query | str | hayır | OTP doğrulama açıkken yeni üye kaydında telefona (SMS kanalı) veya e-posta adresine (E-posta kanalı) gönderilen 6 haneli doğrulama kodu. Kod SMS kanalında 120, e-posta kanalında 300 saniye geçerlidir; 5 hatalı denemede geçersiz olur (CUE040). Güncelleme isteklerinde kullanılmaz. |
| `data` | query | text | evet |  |

Örnek `data` alanları: `Name`, `Surname`, `Email`, `Password`, `Gender`, `Birthdate`, `Phone`, `Mobile`, `OfficePhone`, `Address`, `Postcode`, `City`, `Town`, `Country`, `TaxOffice`, `TaxNo`, `CompanyName`, `IdentityNo`, `Field1`, `Field2`, `Field3`, `Field4`, `Field5`, `Field6`, `Field7`, `Field8`, `Field9`, `Field10`, `Field11`, `Field12`, `Field13`, `Field14`, `Field15`, `Approval`, `IsEmailNotificationOn`, `IsSmsNotificationOn`, `IsPhoneCallNotificationOn`, `EmailApprovalTime`, `SmsApprovalTime`, `PhoneCallApprovalTime`, `NotificationApprovalIp`, `SmsNotificationApprovalIp`, `PhoneNotificationApprovalIp`, `CustomerGroupCode`, `RepresentativeCode`, `Credibility`, `PayAtDoor`, `Risked`, `Banned`, `PriceField`, `CargoFree`.
```json
[
  {
    "Name": "",
    "Surname": "",
    "Email": "",
    "Password": "",
    "Gender": "",
    "Birthdate": "",
    "Phone": "",
    "Mobile": "",
    "OfficePhone": "",
    "Address": "",
    "Postcode": "",
    "City": "",
    "Town": "",
    "Country": "",
    "TaxOffice": "",
    "TaxNo": "",
    "CompanyName": "",
    "IdentityNo": "",
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
    "Approval": "",
    "IsEmailNotificationOn": "",
    "IsSmsNotificationOn": "",
    "IsPhoneCallNotificationOn": "",
    "EmailApprovalTime": "",
    "SmsApprovalTime": "",
    "PhoneCallApprovalTime": "",
    "NotificationApprovalIp": "",
    "SmsNotificationApprovalIp": "",
    "PhoneNotificationApprovalIp": "",
    "CustomerGroupCode": "",
    "RepresentativeCode": "",
    "Credibility": "",
    "PayAtDoor": 0,
    "Risked": 0,
    "Banned": 0,
    "PriceField": "",
    "CargoFree": 0
  }
]
```

### `platform/getFavoriteList`

`POST https://magaza.example/rest1/platform/getFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

### `platform/addToFavoriteList`

`POST https://magaza.example/rest1/platform/addToFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

### `platform/deleteFromFavoriteList`

`POST https://magaza.example/rest1/platform/deleteFromFavoriteList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |

### `platform/getAlarmList`

`POST https://magaza.example/rest1/platform/getAlarmList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Filtreleme için Price veya Stock girilebilir. |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |
| `orderby` | query | str | hayır | Örn: RecordTime DESC |
| `f` | query | str | hayır | Kullanılabilen operatörler: startwith,endwith,equal,greater,smaller,between,contain. Örn: "RecordTime\|1529931531\|greater" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `FetchProductData` | query | bool | hayır |  |

### `platform/addAlarm`

`POST https://magaza.example/rest1/platform/addAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `ProductId` | query | str | hayır |  |
| `SubProductId` | query | str | hayır |  |
| `AlarmType` | query | str | hayır | Price veya Stock girilmeli. |
| `AlarmDay` | query | str | hayır | Alarmın kaç gün için geçerli olduğunu belirler. |
| `CurrentPrice` | query | str | hayır | O anki fiyat girilebilir, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `AlarmPrice` | query | str | hayır | Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `Currency` | query | str | hayır | Para birimi. Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli |
| `VatIncluded` | query | str | hayır | Kdv dahil ise 1, değilse 0 girilmeli, Fiyat alarmı için gerekli parametre. Stok alarmı için gönderilmemeli. |
| `StockLimit` | query | str | hayır | Stok alarmı için gerekli parametre. Fiyat alarmı için gönderilmemeli. |

### `platform/deleteAlarm`

`POST https://magaza.example/rest1/platform/deleteAlarm/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AlarmId` | url_param | str | hayır |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

### `platform/getAddress`

`POST https://magaza.example/rest1/platform/getAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `Page` | query | str | hayır | 'order' olarak gönderilirse ilgili ülkeye ait siparişler döner |

### `platform/setAddress`

`POST https://magaza.example/rest1/platform/setAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | hayır | Adress güncellenmek istendiğinde address_id parametresi sıfırdan büyük bir değer gönderilmelidir. |

Örnek `data` alanları: `address_id`, `title`, `country_code`, `city_code`, `town_code`, `city`, `town`, `address`, `company`, `district`, `fullname`, `is_company_active`, `mobile_phone`, `nationality`, `identity_number`, `tax_number`, `tax_office`, `post_code`, `has_e_invoice`.
```json
[
  {
    "address_id": 0,
    "title": "İş Adresim",
    "country_code": "TR",
    "city_code": "34",
    "town_code": "941",
    "city": "İstanbul",
    "town": "Fatih",
    "address": "Teknopark No:104",
    "company": "",
    "district": "",
    "fullname": "Kübra K",
    "is_company_active": 0,
    "mobile_phone": "905555555555",
    "nationality": 0,
    "identity_number": "66666666666",
    "tax_number": "66666666666",
    "tax_office": "",
    "post_code": "34104",
    "has_e_invoice": 0
  }
]
```

### `platform/setOrderAddress`

`POST https://magaza.example/rest1/platform/setOrderAddress/`

LisansEihracat lisansının açıklığına göre set edilemeyecek adreslerin kontrolü kullanıcıya bırakılmıştır. platform/getAvaliableAddress metodundan kontrol sağlanabilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet | Adres Tipleri:   1: sadece teslimat adresi   2: sadece fatura adresi   3: hem teslimat, hem fatura adresi |

Örnek `data` alanları: `address_type`, `address_id`.
```json
[
  {
    "address_type": "2",
    "address_id": "5"
  }
]
```

### `platform/deleteAddress`

`POST https://magaza.example/rest1/platform/deleteAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AddressId` | url_param | int | evet |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

### `platform/getOrderReturn`

`POST https://magaza.example/rest1/platform/getOrderReturn/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `OrderId` | url_param | str | hayır |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `OrderCode` | query | str | hayır | OrderId yerine OrderCode gönderilebilir veya boş bırakılabilir. |

### `platform/setOrderReturn`

`POST https://magaza.example/rest1/platform/setOrderReturn/`

Müşteriye ait iade talebini oluşturur/günceller. CargoCompanyId gönderilmezse siparişin kendi kargo firması kullanılır. Hepsijet gibi randevulu kargolarda PickDate zorunludur (uygun tarih listesi platform/getReturnPickDates ile çekilir).

Cevap (data): OrderId, ReturnId, ShipmentCode, TrackingNumber, CargoKey alanlarını içerir. Shipment oluşmadıysa ilgili alanlar null döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet | OrderId yerine OrderCode gönderilebilir.  Opsiyonel alanlar: - CargoCompanyId (int): Müşterinin iade için seçtiği kargo firmasının ID'si (kargo__firma.id). Gönderilmezse siparişin orijinal kargo firması kullanılır. - PickDate (YYYY-MM-DD): Randevulu çalışan kargolarda (örn. hepsijet) zorunludur. Uygun tarihler platform/getReturnPickDates'ten alınır. - Iban: İade tutarının yatırılacağı IBAN. |

Örnek `data` alanları: `OrderId`, `FirstName`, `LastName`, `Email`, `Adress`, `ReturnDescription`, `ReasonId`, `Iban`, `CargoCompanyId`, `PickDate`, `Products`.
```json
[
  {
    "OrderId": "3",
    "FirstName": "Test",
    "LastName": "Testcik",
    "Email": "ornek@magaza.example",
    "Adress": "Adres",
    "ReturnDescription": "Aciklama",
    "ReasonId": "2",
    "Iban": "TR420001009010038831705001",
    "CargoCompanyId": 3,
    "PickDate": "",
    "Products": [
      {
        "ProductId": "5",
        "Count": "1",
        "Note": "Not",
        "ReasonId": "1"
      },
      {
        "ProductId": "6",
        "Count": "1",
        "Note": "Not",
        "ReasonId": "2"
      }
    ]
  }
]
```

### `platform/getReturnPickDates`

`POST https://magaza.example/rest1/platform/getReturnPickDates/`

Hepsijet gibi randevulu çalışan kargo firmaları için, kargo şirketinin sunduğu uygun alım tarihlerini döndürür. Randevulu olmayan kargolarda RequiresPickDate=false ve boş Dates listesi döner.

Cevap (data): { "RequiresPickDate": true|false, "Dates": [ "YYYY-MM-DD", ... ] }

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `OrderId` | query | str | hayır | Sipariş ID. OrderId veya OrderCode'dan biri zorunludur. |
| `OrderCode` | query | str | hayır | Sipariş numarası. OrderId yerine kullanılabilir. |
| `CargoCompanyId` | query | int | evet | Kargo firmasının ID'si (kargo__firma.id). order2/getCargoCompanyList listesinden seçilir. |

### `platform/setLocation`

`POST https://magaza.example/rest1/platform/setLocation/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet | Kod verileri bulunuyorsa,   CountryCode,StateCode, CityCode, TownCode, DistrictCode  şeklinde de gönderim yapılabilir. |

```json
{
  "Country": "Türkiye",
  "State": "",
  "City": "İstanbul",
  "Town": "Esenler",
  "District": "Davutpaşa Mah"
}
```

### `platform/availableDeliveryTimes`

`POST https://magaza.example/rest1/platform/availableDeliveryTimes/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

### `platform/setDeliveryTime`

`POST https://magaza.example/rest1/platform/setDeliveryTime/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `Id` | query | int | evet | Teslimat Zamanı id'si |
| `Date` | query | str | evet | teslimat zamanı tarihi (2018-10-27) |

### `platform/getCouponList`

`POST https://magaza.example/rest1/platform/getCouponList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |

### `platform/addToCart`

`POST https://magaza.example/rest1/platform/addToCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `cart_index`, `product_id`, `variant_id`, `count`, `personalization`.
```json
[
  {
    "cart_index": "-1",
    "product_id": "147",
    "variant_id": "",
    "count": "2",
    "personalization": {
      "form_id": "11",
      "data": [
        {
          "title": "1. resim",
          "value": "test.jpg",
          "index": 0
        },
        {
          "title": "2. resim",
          "value": "test2.jpg",
          "index": 1
        }
      ]
    }
  }
]
```

### `platform/getCart`

`POST https://magaza.example/rest1/platform/getCart/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |

### `platform/removeAll` (alpha)

`POST https://magaza.example/rest1/platform/removeAll/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |

### `platform/removeItems` (alpha)

`POST https://magaza.example/rest1/platform/removeItems/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır |  |
| `CustomerHash` | query | str | evet |  |
| `CartIndex` | query | str | evet |  |

### `platform/selectCampaign` (alpha)

`POST https://magaza.example/rest1/platform/selectCampaign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet | Seçili kampanyayı iptal etmek için campaign_id sıfır (0) gönderilmelidir. |
| `CustomerHash` | query | str | evet |  |

Örnek `data` alanları: `campaign_group_id`, `campaign_id`.
```json
[
  {
    "campaign_group_id": "1",
    "campaign_id": "4"
  }
]
```

### `platform/setCouponCode` (alpha)

`POST https://magaza.example/rest1/platform/setCouponCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | evet |  |
| `CustomerHash` | query | str | evet |  |

Örnek `data` alanları: `code`.
```json
[
  {
    "code": "1BNQGVPVNJ"
  }
]
```

### `platform/productRecommend`

`POST https://magaza.example/rest1/platform/productRecommend/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet |  |

Örnek `data` alanları: `ProductId`, `Message`, `ToMail`, `ToName`.
```json
[
  {
    "ProductId": "656",
    "Message": "",
    "ToMail": "ornek@magaza.example",
    "ToName": "Rumeysa"
  }
]
```

### `platform/getAvaliableAddress`

`POST https://magaza.example/rest1/platform/getAvaliableAddress/`

MobileToken öncelikli kontrolü mevcuttur. CountryCode gönderilmediği durumlarda sitenin default country'sine ait adresler getirilmektedir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `MobileToken` | query | str | hayır |  |
| `CustomerHash` | query | str | hayır |  |
| `Platform` | query | str | hayır |  |
| `CountryCode` | query | str | hayır |  |

### `platform/refreshToken`

`POST https://magaza.example/rest1/platform/refreshToken/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |

### `platform/sendImageNotes`

`POST https://magaza.example/rest1/platform/sendImageNotes/`

Üyenin yüklediği resimleri ve sepet ürün bilgilerini yönetici e‑postasına gönderir

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `notes1` | query | text | hayır |  |
| `file` | file | file | hayır |  |

### `platform/getCampaigns`

`POST https://magaza.example/rest1/platform/getCampaigns/`

Oturum açan müşteriye uygun ve mobil uygulamada görünür aktif kampanyaları listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |

### `platform/getCustomerPoints`

`POST https://magaza.example/rest1/platform/getCustomerPoints/`

Müşterinin kendi puan hareketlerini listeler. Müşteri CustomerHash üzerinden zorlanır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. |

### `platform/sendProductComment`

`POST https://magaza.example/rest1/platform/sendProductComment/`

Ürüne yorum/soru ekler. Yorum sahibi (CustomerId) istek gövdesinden değil CustomerHash üzerinden belirlenir. Ürüne yorum için type:comment, soru için type:question gönderilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `data` | query | text | evet |  |
| `image` | file | file | hayır | Gerekli lisansa sahip olmalısınız (Ürün yorumlarında resim ekleme). |

Örnek `data` alanları: `ProductId`, `Type`, `Comment`, `Title`, `Rate`, `IsNameDisplayed`, `ImageUrl`, `DateTimeStamp`.
```json
[
  {
    "ProductId": "68",
    "Type": "comment",
    "Comment": "test message",
    "Title": "test title",
    "Rate": "3",
    "IsNameDisplayed": "",
    "ImageUrl": "",
    "DateTimeStamp": ""
  }
]
```

### `platform/getAddressFields`

`POST https://magaza.example/rest1/platform/getAddressFields/`

Adres formu alanlarını döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

### `platform/getSubscriptions`

`POST https://magaza.example/rest1/platform/getSubscriptions/`

Müşterinin abonelik siparişlerini listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `start` | query | int | hayır | Sayfalama başlangıç indeksi |
| `limit` | query | int | hayır | Sayfa başına kayıt sayısı |

### `platform/getTicketDetails`

`POST https://magaza.example/rest1/platform/getTicketDetails/`

Müşterinin kendi talebinin (ticket) detayını döner. Talep müşteriye ait değilse bilgi sızdırmamak için 'kayıt bulunamadı' yanıtı verilir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |
| `TicketId` | url_param | int | evet |  |

### `platform/getTicketDepartments`

`POST https://magaza.example/rest1/platform/getTicketDepartments/`

Talep departmanlarını listeler.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerHash` | query | str | evet |  |
| `Platform` | query | str | hayır |  |

## Notification

Push cihaz kaydı ve bildirim.

### `notification/getNotifications`

`POST https://magaza.example/rest1/notification/getNotifications/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `RegistrationId` | query | string | hayır |  |
| `DeviceId` | query | string | hayır |  |
| `Email` | query | string | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

### `notification/setNotifications`

`POST https://magaza.example/rest1/notification/setNotifications/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır | Type 'click' veya 'show' gönderilmelidir. |

```json
{
  "Type": "click",
  "PostUniqueId": "3886-61f2b3e7a4f54-fd_mongo"
}
```

### `notification/registerDevice`

`POST https://magaza.example/rest1/notification/registerDevice/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `data` | query | text | hayır |  |

Örnek `data` alanları: `p256dh`, `registrationId`, `deviceId`, `deviceAuth`, `devicePlatform`, `deviceLanguage`, `appVersion`, `email`.
```json
[
  {
    "p256dh": "7897f89789",
    "registrationId": "eGjnjm_QTWlhQvddfvfY8:AA91bE8z5T-9uYBSGXu82znsROofdUnWSereLrnYkvhnmGx1NOZ22W-RIS2b74ladGE48FgLRHkjlZtj8norPSafsdikywlG93D0gOrOlhA-UNfk6w-oxrWPFaZrzMo5nVDOlzh4WkhkhWizq",
    "deviceId": "43om56kty6k543",
    "deviceAuth": "",
    "devicePlatform": "android",
    "deviceLanguage": "tr",
    "appVersion": "5.4.1",
    "email": "ornek@magaza.example"
  }
]
```

### `notification/deleteDevice`

`POST https://magaza.example/rest1/notification/deleteDevice/`

Email gönderilirse o maile bağlı tüm cihazlar silinir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | string | hayır |  |
| `RegistrationId` | query | string | hayır |  |
| `Email` | query | string | hayır |  |

### `notification/unConnectCustomer`

`POST https://magaza.example/rest1/notification/unConnectCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Email` | url_param | string | evet |  |

## HtmlBlock

HTML blok. Konsolda üçü de support-only.

### `htmlBlock/get` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/htmlBlock/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | hayır |  |
| `Version` | query | string | hayır | V5 gönderildiğinde V5'e, gönderilmediğinde V4'e uygun olarak çalışır. |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

### `htmlBlock/set` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/htmlBlock/set/`

V5 durumunda data içerisinde Type ve PostUniqueId set edilmelidir. Type 'click' veya 'show' gönderilmelidir.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Version` | query | string | hayır | V5 gönderildiğinde V5'e, gönderilmediğinde V4'e uygun olarak çalışır. |
| `data` | query | text | hayır |  |

```json
{
  "Id": "",
  "Content": "",
  "Location": "",
  "Theme": "",
  "Visitor": "",
  "Member": "",
  "Vendor": "",
  "ShowMobileInterface": "",
  "RemoveOldBlockLocations": "",
  "BlockLocations": {
    "BlockId": "",
    "PageId": "",
    "SubPageId": "",
    "ListNo": "",
    "Location": ""
  }
}
```

### `htmlBlock/delete` (yalnız destek kullanıcısı)

`POST https://magaza.example/rest1/htmlBlock/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | url_param | int | evet |  |
| `Version` | query | string | hayır | V5 gönderildiğinde V5'e, gönderilmediğinde V4'e uygun olarak çalışır. |
| `GeneratedBy` | query | string | hayır | V5 olduğu durumda GeneratedBy gerekli değildir. V5 durumu olmadığı durumlar için ise gönderilmelidir. |

## Link

SEO, sitemap ve yönlendirme linki. Sepet linki değildir.

### `link/getLinks`

`POST https://magaza.example/rest1/link/getLinks/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

### `link/setLinks`

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

### `link/setReferralLinks`

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

### `link/getReferralLinks`

`POST https://magaza.example/rest1/link/getReferralLinks/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `columns` | query | text | hayır |  |
| `f` | query | text | hayır |  |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |
| `orderby` | query | str | hayır |  |

## Segment

Üye segmenti oluşturma ve üyeye atama.

### `segment/get`

`POST https://magaza.example/rest1/segment/get/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `` | query |  | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |

### `segment/show`

`POST https://magaza.example/rest1/segment/show/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | evet |  |

### `segment/add`

`POST https://magaza.example/rest1/segment/add/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Name` | query | str | evet |  |

### `segment/set`

`POST https://magaza.example/rest1/segment/set/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | evet |  |
| `Name` | query | str | evet |  |

### `segment/delete`

`POST https://magaza.example/rest1/segment/delete/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | query | int | evet |  |

### `segment/assign`

`POST https://magaza.example/rest1/segment/assign/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | query | int | evet |  |
| `SegmentIds` | query | str | evet |  |

### `segment/revoke`

`POST https://magaza.example/rest1/segment/revoke/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | query | int | evet |  |
| `SegmentIds` | query | str | evet |  |

## Routing

Servis yönlendirme.

### `routing/service`

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

### `routing/routingByIpAddress`

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
