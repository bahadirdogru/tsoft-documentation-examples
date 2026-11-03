---
title: Product
url: https://tsoft.bahadirdogru.com/rest/product/
---

# Product

REST1 modülü · 70 metot · taban `https://magaza.example/rest1/product/{metot}/`

Her çağrı `POST` ve form gövdesidir; `token` ayrı alan olarak gider. Ortak kurallar, zarf yapısı ve süzgeç sözdizimi [REST1 genel bakış](README.md#ortak-kurallar) sayfasındadır. Tablodaki "Yer" sütunu: `url_param` yolun sonuna eklenir, `query` gövde alanıdır, `file` dosya yüklemesidir.

Ürün oluşturma, stok, fiyat, görsel, etiket ve dil.

## `product/get`

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

## `product/addCategory`

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

## `product/addImageFromFile`

`POST https://magaza.example/rest1/product/addImageFromFile/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet | Parametre tipini POST seçerek, ProductCode parametresini POST ile de gönderebilirsiniz. |
| `image` | file | file | evet |  |
| `list_number` | query | int | hayır |  |
| `ImageSizeWidthHeightControl` | query | int | evet | Bu parametre 0 gönderildiğinde yeni resim ekleme yapılır. 1 gönderildiğinde eğer boyutları aynı olan bir resim daha önceden yüklenmişse o resim silinir. Üzerine yeni resim yazılır. 2 gönderilmişse ve resim varsa hata mesajı döner. Hiçbir işlem yapılmaz. Önceki resim silinmez. |

## `product/attributes`

`POST https://magaza.example/rest1/product/attributes/`

Seçili ürünün özelliklerini baz alarak, Model altındaki özellikleri stok bilgisi ve örnek ürün kimliği ile birlikte döndür.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `product_id` | url_param | int | evet | Ürün id'si |
| `with_image` | query | bool | hayır |  |

## `product/addImageFromLink`

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

## `product/addImageBase64`

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

## `product/comment`

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

## `product/createProducts`

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

## `product/deleteProductImages`

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

## `product/deleteProducts`

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

## `product/find`

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

## `product/productListFilter`

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

## `product/getActivePropertyGroup`

`POST https://magaza.example/rest1/product/getActivePropertyGroup/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | url_param | int | evet |  |

## `product/getComments`

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

## `product/getCurrencyList`

`POST https://magaza.example/rest1/product/getCurrencyList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `product/getDiscountTypeList`

`POST https://magaza.example/rest1/product/getDiscountTypeList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `productFilter/getFilters`

`POST https://magaza.example/rest1/productFilter/getFilters/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `GroupId` | url_param | int | hayır |  |

## `productFilter/getFiltersByProductCode`

`POST https://magaza.example/rest1/productFilter/getFiltersByProductCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |
| `Filter` | query | str | hayır |  |

## `product/getProductByBarcode`

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

## `product/getProductByCode`

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

## `product/getProductById`

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

## `product/getProductByName`

`POST https://magaza.example/rest1/product/getProductByName/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductName` | url_param | str | evet |  |

## `product/getProductBySupplierProductCode`

`POST https://magaza.example/rest1/product/getProductBySupplierProductCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `SupplierProductCode` | url_param | str | evet |  |

## `product/getProductDetail`

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

## `product/getProductImages`

`POST https://magaza.example/rest1/product/getProductImages/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductId` | url_param | int | evet |  |

## `product/getProductImagesByCode`

`POST https://magaza.example/rest1/product/getProductImagesByCode/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |

## `product/getProducts`

`POST https://magaza.example/rest1/product/getProducts/`

Bu metoda alternatif olarak yeni geliştirilen product/get metodu mevcuttur. product/get metodunun kullanılması önerilir. Bkz. [`product/get`](product.md#product-get).

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

## `product/getProductsByCategoryCode`

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

## `product/getProductTotal`

`POST https://magaza.example/rest1/product/getProductTotal/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

Postman’daki `getProductsCount` adlı istek bu uca gitmez. `product/setProducts` adresine yazar.

## `product/getSeoSettingList`

`POST https://magaza.example/rest1/product/getSeoSettingList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `product/getStockUnitList`

`POST https://magaza.example/rest1/product/getStockUnitList/`

Konsol bu metot için ek parametre listelemiyor. `token` yine gönderilir.

## `product/getSupplierList`

`POST https://magaza.example/rest1/product/getSupplierList/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `orderby` | query | str | hayır | Örn: Supplier ASC |
| `start` | query | text | hayır |  |
| `limit` | query | str | hayır |  |

## `product/removeCategory`

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

## `product/setComplementaryProducts` (beta)

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

## `product/deleteComplementaryProducts` (beta)

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

## `productFilter/setFilterGroupCategory` (beta)

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

## `productFilter/setFilterValues`

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

## `product/setProductLanguage`

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

## `product/getProductLanguage`

`POST https://magaza.example/rest1/product/getProductLanguage/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | int | evet |  |
| `Language` | query | str | hayır |  |
| `ForceWithoutOriginal` | query | bool | hayır |  |

## `product/setProducts`

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

## `product/setProductsStatus`

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

## `product/setProductStatus`

`POST https://magaza.example/rest1/product/setProductStatus/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `ProductCode` | url_param | str | evet |  |
| `status` | query | bool | evet |  |

## `product/setRelatedProducts`

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

## `product/setRelatedProducts`

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

## `product/setDefaultCategory` (beta)

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

## `product/updateCommentStatus`

`POST https://magaza.example/rest1/product/updateCommentStatus/`

Yorum/soru kaydının durumunu günceller. answer gönderildiğinde soru cevaplanır ve durum otomatik olarak onaylı yapılır.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CommentId` | url_param | str | evet |  |
| `status` | query | bool | hayır | Durum güncellemesi için gönderilir. true=onaylı, false=onaysız. |
| `answer` | query | text | hayır | Soru cevabı. Bu alan gönderildiğinde sadece type=question kayıtlar cevaplanır. |
| `answeredBy` | query | str | hayır | Cevaplayan kullanıcı bilgisi. Gönderilmezse rest1 kullanıcısı yazılır. |

## `product/answerComment`

`POST https://magaza.example/rest1/product/answerComment/`

Ürüne iletilen soruyu cevaplar.

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `CommentId` | url_param | str | evet |  |
| `answer` | query | text | evet | Soru cevabı. |
| `answeredBy` | query | str | hayır | Cevaplayan kullanıcı bilgisi. Gönderilmezse rest1 kullanıcısı yazılır. |

## `product/updateCustomerGroupPrice`

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

## `product/updatePrice`

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

## `product/updateFlexiblePrice`

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

## `product/updateProducts`

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

## `product/updateProductAsOnSale`

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

## `product/updateStock`

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

## `product/updateStockBySupplierCode`

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

## `product/resetAllStock`

`POST https://magaza.example/rest1/product/resetAllStock/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Stock` | url_param | int | hayır |  |

## `product/getAlarmList`

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

## `product/markAlarmAsSent`

`POST https://magaza.example/rest1/product/markAlarmAsSent/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `AlarmId` | url_param | int | evet |  |
| `SendingType` | query | str | hayır | (email, sms, web_push, mobile_push) |

## `product/setCategorySortNumber`

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

## `product/setMultiDiscount`

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

## `product/removeMultiDiscount`

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

## `product/fields`

`POST https://magaza.example/rest1/product/fields/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Type` | url_param | str | hayır | Filtreleme için Price, Stock veya Additional girilmelidir. |
| `OnlyActive` | query | bool | hayır |  |
| `SubProduct` | query | bool | hayır | Alt ürün alanları için true gönderilmelidir. |

```json
"Stock"
```

## `product/getStockUnit`

`POST https://magaza.example/rest1/product/getStockUnit/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CategoryId \| 12 \| equal" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `product/setStockUnit`

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

## `product/setInstallment`

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

## `product/getVideoCategories`

`POST https://magaza.example/rest1/product/getVideoCategories/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `Id` | url_param | int | hayır | Id ile sorgulama yapılabilir. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |
| `f` | query | text | hayır | İzin Verilen İşlemler: startwith,endwith,equal,greater,smaller,between,contain. Example: "CategoryId \| 12 \| equal" |
| `f2` | query | text | hayır | Allowed operators: startwith,endwith,equal,greater,smaller,between,contain. Example: "CustomerName \| ahmet \| contain" |

## `product/getVideoList`

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

## `product/setVideo`

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

## `product/deleteVideo`

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

## `product/getTags`

`POST https://magaza.example/rest1/product/getTags/`

| Parametre | Yer | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- | --- |
| `TagId` | query | int | hayır | TagId ile sorgulama yapılabilir. |
| `ProductId` | query | int | hayır | ProductId ile sorgulama yapılabilir. |
| `limit` | query | int | hayır |  |
| `start` | query | int | hayır |  |

## `product/setTags`

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
