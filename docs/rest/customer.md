---
title: Customer
url: https://tsoft.bahadirdogru.com/rest/customer/
---

# Customer

REST1 modülü · 34 metot · taban `https://magaza.example/rest1/customer/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Üye, adres, grup, giriş linki, sepet okuma, istek listesi ve arşiv.

## `customer/addCustomers`

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

20 Ekim 2026 çağrısında 10 haneli cep ve `CustomerGroupCode` `ogretmenler` kabul edildi. Başarı kodu `CUI002`. Kayıtlı e-posta güncellenmez. Parti `success: false` dönse de `CUI002` alan satırlar durur. Ayrıntı [canlı çağrı](README.md#20-ekim-2026-canlı-çağrı) bölümündedir.

## `customer/address`

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

## `customer/getAddress`

`POST https://magaza.example/rest1/customer/getAddress/`

Müşteriye ait adres verilerini döner

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | query | int | hayır | CustomerId veya CustomerCode parametrelerinden bir tanesi gönderilmelidir. |
| `CustomerCode` | query | str | hayır | CustomerId veya CustomerCode parametrelerinden bir tanesi gönderilmelidir. |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |
| `FetchDeleteds` | query | bool | hayır |  |

Postman `getAddress2` bu uca `CustomerCode=12001-01-BM0007` ile gider. `CustomerId` kapalıdır.

## `customer/check`

`POST https://magaza.example/rest1/customer/check/`

E-posta ve parola bilgileri ile kayıt varsa döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Platform` | query | str | hayır | Platform metotlarında kullanılmak için eklenmiştir. customer_hash bu değere göre üretilmektedir. Platform metotları kullanılmıyorsa önemsenmez. |
| `email` | query | str | hayır |  |
| `phone` | query | str | hayır | Telefonla giriş aktif ise telefon ile girebilmek için email paramtresinin yerine kullanılabilir |
| `password` | query | pass | hayır |  |
| `CheckMemberPasswordChangeFrequency` | query | bool | hayır | 1 gönderilir ise üyenin şifre değiştirme sıklığı ayarına uyup uymadığını kontrol eder. |

## `customer/deleteAddress`

`POST https://magaza.example/rest1/customer/deleteAddress/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `address_id` | url_param | int | hayır | Tek bir adres listeleme için bu bilgi girilmelidir. Üyenin tüm adreslerini listelemek için customer_id ve type göndermeniz yeterlidir. |
| `customer_id` | query | int | hayır | Adres listeleme için bu bilgi girilmelidir. |
| `type` | query | int | hayır | Adres listelemede ön tanımlı olarak teslimat adresi gelir. type:0 teslimat adresi, type:1 fatura adresi |

## `customer/facebookCheck` (alpha)

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

## `customer/appleCheck` (alpha)

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

## `customer/forgotPassword`

`POST https://magaza.example/rest1/customer/forgotPassword/`

Şifremi unuttum. email verilirse şifre sıfırlama bağlantısı e-posta ile gönderilir. phone verilirse (LisansTelefonNoIleUyelik aktif) V5 mağazalarda SMS ile 6 haneli doğrulama kodu gönderilir; cevapta extra.otpRequired=true, extra.resentSmsTime (sn) ve extra.otpTtl (sn) döner ve şifre forgotPasswordOtpReset ile değiştirilir. V4 mağazalarda eski akış (şifre SMS ile) korunur. Güvenlik gereği telefon yolunda cevap numaradan bağımsızdır (kayıtsız numara, bekleme süresi ve günlük 10 kod tavanı dahil her durumda 'gönderildi' döner); e-posta yolunda da kayıtlı olmayan adres için başarılı cevap döner.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `email` | query | str | hayır | E-posta adresi. phone verilmezse zorunludur. |
| `phone` | query | str | hayır | Telefon numarası. Telefon No İle giriş lisansı aktifse kullanılabilir. |

## `customer/forgotPasswordOtpReset`

`POST https://magaza.example/rest1/customer/forgotPasswordOtpReset/`

forgotPassword ile telefona gönderilen 6 haneli doğrulama kodu ve yeni şifre ile şifreyi tek adımda değiştirir. Kod 5 dakika geçerlidir, 5 hatalı denemede geçersiz olur (CUE040). Başarılı işlemde oturum açılmaz; kullanıcı yeni şifresiyle login olmalıdır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `phone` | query | str | evet | forgotPassword isteğinde kullanılan telefon numarası. |
| `otp` | query | str | evet | SMS ile gönderilen 6 haneli doğrulama kodu. |
| `password` | query | pass | evet | Yeni şifre. |
| `passwordAgain` | query | pass | evet | Yeni şifre tekrarı. |

## `customer/getCart`

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

## `customer/getCustomerByCode`

`POST https://magaza.example/rest1/customer/getCustomerByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerCode` | url_param | str | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |

## `customer/getCustomerById`

`POST https://magaza.example/rest1/customer/getCustomerById/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerId` | url_param | str | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |

## `customer/getCustomersByPhone` (beta)

`POST https://magaza.example/rest1/customer/getCustomersByPhone/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Phone` | url_param | str | evet |  |
| `Archive` | query | int | hayır | Arşivlenmiş üyeler için 1 gönderiniz |

## `customer/getCustomerGroups`

`POST https://magaza.example/rest1/customer/getCustomerGroups/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `f` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| kubra \| contain" |

Postman `getCustomerGroups` yalnız `token` gönderir.

## `customer/getCustomers`

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

20 Ekim 2026 çağrısında `f` alanı `CustomerGroupCode` reddedildi. `CustomerGroupId | 17 | equal` `ogretmenler` grubunu listeledi. Eşleşmeyen e-posta `success: true`, `data: null`, `totalRecordCount` `0` döner. Boş dönüş kaydın yokluğunu kanıtlamaz. Ayrıntı [canlı çağrı](README.md#20-ekim-2026-canlı-çağrı) bölümündedir.

## `customer/getDeletedCustomers`

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

## `customer/googleCheck` (alpha)

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

## `customer/login`

`POST https://magaza.example/rest1/customer/login/`

Customer ID veya Code alanlarından birinin doldurulması zorunludur.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `customerId` | query | int | hayır |  |
| `customerCode` | query | str | hayır |  |
| `loginRedirectUrl` | query | str | hayır |  |

## `customer/setCustomerGroups`

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

## `customer/setCustomers`

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

## `customer/updateCustomerCode`

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

## `customer/updateCustomers`

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

## `customer/setWishList`

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

## `customer/getWishList`

`POST https://magaza.example/rest1/customer/getWishList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `customer/getWishListCategories`

`POST https://magaza.example/rest1/customer/getWishListCategories/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `customer/getFields`

`POST https://magaza.example/rest1/customer/getFields/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | text | hayır | İzin Veriler Tipler    - YeniKayıt => MemberRegister    - BayiKayit => VendorRegister    - Duzenle => Update |
| `Platform` | query | text | hayır | İzin Veriler Tipler => mobile_app, web |

## `customer/deleteCustomer`

`POST https://magaza.example/rest1/customer/deleteCustomer/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerIds` | query | text | hayır | Üye id leri aralara - eklenerek gönderilebilir.   Örnek CustomerIds=100-150 |
| `CustomerCodes` | query | text | hayır | Üye kodları leri aralara 'Rest Web Servis Ayraç Karakteri' eklenerek gönderilebilir. (Ayarın Varsayılan değeri : '\|')   Örnek CustomerCodes=T100-T150 |

## `customer/unArchive`

`POST https://magaza.example/rest1/customer/unArchive/`

Üye veya üyeleri arşivden geri döndermek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerIds` | query | int | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `CustomerCodes` | query | str | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : T127\|T128 |

## `customer/archive`

`POST https://magaza.example/rest1/customer/archive/`

Üye veya üyeleri arşive eklemek için kullanılır

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CustomerIds` | query | int | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : 127\|128 |
| `CustomerCodes` | query | str | hayır | CustomerIds veya CustomerCodes parametrelerinden bir tanesi gönderilmelidir. Çoklu gönderim yapılabilir. Örnek : T127\|T128 |

## `customer/getTax`

`POST https://magaza.example/rest1/customer/getTax/`

Vergi Daireleri getirmek için kullanılır

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `customer/getServices`

`POST https://magaza.example/rest1/customer/getServices/`

Müşteri Hizmetleri

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Language` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

## `customer/setServices`

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

## `customer/getServiceCategories`

`POST https://magaza.example/rest1/customer/getServiceCategories/`

Müşteri Hizmetleri Kategorileri

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Language` | query | str | hayır |  |
| `start` | query | int | hayır |  |
| `limit` | query | int | hayır |  |
| `f` | query | text | hayır |  |
| `orderby` | query | str | hayır |  |

## `customer/setServiceCategories`

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
