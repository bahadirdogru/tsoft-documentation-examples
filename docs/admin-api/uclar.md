---
title: Uç listesi
url: https://tsoft.bahadirdogru.com/admin-api/uclar/
---

# Admin API v3 uç listesi

Panel `v5.0.273` ön yüzünün çağırdığı 357 uç, gruplarına göre. Genel kurallar (taban, başlık, metot, sayfalama, hata) [Admin API v3](README.md) sayfasındadır. Yollar mağaza alan adına eklenir: `https://www.magaza.example/<yol>`.

Liste yalnızca yolu verir. Metot ve gövde için panelde ilgili ekranı açıp Network sekmesine bakın. `{groupId}`, `{id}`, `{uuid}` yol içi kimliktir.

## Analitik

Rapor, canlı ziyaretçi, arama boşluğu ve personel logları. `analytics/report/visitor/*` uçlarının sorgu ve cevap alanları canlı denendi: [Ziyaretçi raporları](ziyaretci-raporlari.md).

- `api/v3/admin/analytics/assistant/insights`
- `api/v3/admin/analytics/log`
- `api/v3/admin/analytics/log/customer-code-changes`
- `api/v3/admin/analytics/log/price-stock-log`
- `api/v3/admin/analytics/log/template-history`
- `api/v3/admin/analytics/log/theme-history`
- `api/v3/admin/analytics/log/user-activities`
- `api/v3/admin/analytics/log/user-logins`
- `api/v3/admin/analytics/report`
- `api/v3/admin/analytics/report/customers-by-group`
- `api/v3/admin/analytics/report/customers-by-location`
- `api/v3/admin/analytics/report/most-used-campaign`
- `api/v3/admin/analytics/report/product/most-alert`
- `api/v3/admin/analytics/report/product/most-commented`
- `api/v3/admin/analytics/report/registration-platform`
- `api/v3/admin/analytics/report/sales-by-product`
- `api/v3/admin/analytics/report/visitor/briefing`
- `api/v3/admin/analytics/report/visitor/funnel`
- `api/v3/admin/analytics/report/visitor/live`
- `api/v3/admin/analytics/report/visitor/live-count`
- `api/v3/admin/analytics/report/visitor/live-locations`
- `api/v3/admin/analytics/report/visitor/new-vs-returning`
- `api/v3/admin/analytics/report/visitor/overview`
- `api/v3/admin/analytics/report/visitor/search-gaps`
- `api/v3/admin/analytics/report/visitor/timeseries`
- `api/v3/admin/analytics/report/visitor/top-pages`
- `api/v3/admin/analytics/report/visitor/top-products`
- `api/v3/admin/analytics/report/visitor/traffic-sources`
- `api/v3/admin/analytics/risk`
- `api/v3/admin/analytics/risk/center`

## Oturum

Giriş, parola sıfırlama, iki adımlı doğrulama, panel kullanıcısı ve rol. `login`, `oauth/two-factor`, `two-factor` ve `oauth/refresh` gövdeleri: [Giriş ve iki adımlı doğrulama](oturum.md).

- `api/v3/admin/auth/auth-application`
- `api/v3/admin/auth/auth-application/authorize`
- `api/v3/admin/auth/auth-application/recovery`
- `api/v3/admin/auth/connect`
- `api/v3/admin/auth/demolish`
- `api/v3/admin/auth/forgot-password`
- `api/v3/admin/auth/legacy-api-users`
- `api/v3/admin/auth/login`
- `api/v3/admin/auth/login-by-jwt`
- `api/v3/admin/auth/logout`
- `api/v3/admin/auth/me`
- `api/v3/admin/auth/notification-token`
- `api/v3/admin/auth/oauth/authorize/user/callback`
- `api/v3/admin/auth/oauth/callback`
- `api/v3/admin/auth/oauth/refresh`
- `api/v3/admin/auth/oauth/two-factor`
- `api/v3/admin/auth/oauth/two-factor/sms-validation`
- `api/v3/admin/auth/reset-password`
- `api/v3/admin/auth/roles`
- `api/v3/admin/auth/storefront-apps`
- `api/v3/admin/auth/token`
- `api/v3/admin/auth/token-validate`
- `api/v3/admin/auth/two-factor`
- `api/v3/admin/auth/users`

## Kampanya

- `api/v3/admin/campaigns`
- `api/v3/admin/campaigns/campaign`
- `api/v3/admin/campaigns/customer-experience-scoring`
- `api/v3/admin/campaigns/gift-code`
- `api/v3/admin/campaigns/point`
- `api/v3/admin/campaigns/recommend`

## Katalog

Ürün, toplu işlem, görsel, kategori, marka, filtre, tedarikçi, varyant ve grup fiyatı.

- `api/v3/admin/catalog/alarm`
- `api/v3/admin/catalog/catalogue-wizard/assign`
- `api/v3/admin/catalog/catalogue-wizard/bulk-assign`
- `api/v3/admin/catalog/catalogue-wizard/create-initial`
- `api/v3/admin/catalog/catalogue-wizard/unassign`
- `api/v3/admin/catalog/collections`
- `api/v3/admin/catalog/collections/items`
- `api/v3/admin/catalog/collections/items/sortable`
- `api/v3/admin/catalog/combine`
- `api/v3/admin/catalog/combine/categories`
- `api/v3/admin/catalog/comments`
- `api/v3/admin/catalog/definitions/brands`
- `api/v3/admin/catalog/definitions/brands/batch`
- `api/v3/admin/catalog/definitions/brands/group`
- `api/v3/admin/catalog/definitions/categories`
- `api/v3/admin/catalog/definitions/categories/batch`
- `api/v3/admin/catalog/definitions/filter`
- `api/v3/admin/catalog/definitions/filter/options`
- `api/v3/admin/catalog/definitions/models`
- `api/v3/admin/catalog/definitions/personalization`
- `api/v3/admin/catalog/definitions/stock-units`
- `api/v3/admin/catalog/definitions/suppliers`
- `api/v3/admin/catalog/definitions/tags`
- `api/v3/admin/catalog/definitions/variant-themes`
- `api/v3/admin/catalog/pricing/group-price`
- `api/v3/admin/catalog/pricing/group-price-filter`
- `api/v3/admin/catalog/products`
- `api/v3/admin/catalog/products/batch`
- `api/v3/admin/catalog/products/catalog-images`
- `api/v3/admin/catalog/products/digital-files`
- `api/v3/admin/catalog/products/flexible-price`
- `api/v3/admin/catalog/products/image`
- `api/v3/admin/catalog/products/image/advanced`
- `api/v3/admin/catalog/products/image/sortable`
- `api/v3/admin/catalog/search-console`
- `api/v3/admin/catalog/search-matching`
- `api/v3/admin/catalog/search-words/convert`
- `api/v3/admin/catalog/variant`
- `api/v3/admin/catalog/variant/groups`
- `api/v3/admin/catalog/variant/groups/options`
- `api/v3/admin/catalog/variant/groups/{groupId}/options`

## İçerik

- `api/v3/admin/cms/blog`
- `api/v3/admin/cms/blog/category`
- `api/v3/admin/cms/content`
- `api/v3/admin/cms/faq`
- `api/v3/admin/cms/faq/category`
- `api/v3/admin/cms/mobile-settings`
- `api/v3/admin/cms/mobile-showcase`
- `api/v3/admin/cms/news`
- `api/v3/admin/cms/photo-gallery`
- `api/v3/admin/cms/photo-gallery/category`
- `api/v3/admin/cms/video-gallery`
- `api/v3/admin/cms/video-gallery/category`

## Ayarlar

Dil, para, bölge, e-posta, SMS, POS, bildirim şablonu, yönlendirme, webhook, önbellek, lisans ve sistem.

- `api/v3/admin/configuration/advisory/specs`
- `api/v3/admin/configuration/cache`
- `api/v3/admin/configuration/cache/reset-css-js-cache`
- `api/v3/admin/configuration/currency`
- `api/v3/admin/configuration/currency-rate-archive`
- `api/v3/admin/configuration/email`
- `api/v3/admin/configuration/language`
- `api/v3/admin/configuration/language/mapper`
- `api/v3/admin/configuration/link/batch`
- `api/v3/admin/configuration/link/default-redirect`
- `api/v3/admin/configuration/link/feeds`
- `api/v3/admin/configuration/link/links`
- `api/v3/admin/configuration/link/migrate`
- `api/v3/admin/configuration/link/not-founds`
- `api/v3/admin/configuration/link/types`
- `api/v3/admin/configuration/meta`
- `api/v3/admin/configuration/mobile/config-group`
- `api/v3/admin/configuration/mobile/config-setting`
- `api/v3/admin/configuration/notification/templates`
- `api/v3/admin/configuration/notification/templates/group`
- `api/v3/admin/configuration/payment/pos`
- `api/v3/admin/configuration/payment/pos-builder`
- `api/v3/admin/configuration/payment/type`
- `api/v3/admin/configuration/plan/wallet`
- `api/v3/admin/configuration/print-template`
- `api/v3/admin/configuration/project-notes`
- `api/v3/admin/configuration/region`
- `api/v3/admin/configuration/region/batch`
- `api/v3/admin/configuration/region/duty`
- `api/v3/admin/configuration/region/field`
- `api/v3/admin/configuration/region/ip-service`
- `api/v3/admin/configuration/region/market`
- `api/v3/admin/configuration/region/setting`
- `api/v3/admin/configuration/settings`
- `api/v3/admin/configuration/settings/category`
- `api/v3/admin/configuration/settings/update-report`
- `api/v3/admin/configuration/sms`
- `api/v3/admin/configuration/store-checkpoints`
- `api/v3/admin/configuration/structured-data/fields`
- `api/v3/admin/configuration/structured-data/live-preview`
- `api/v3/admin/configuration/structured-data/node`
- `api/v3/admin/configuration/structured-data/nodes`
- `api/v3/admin/configuration/structured-data/overview`
- `api/v3/admin/configuration/structured-data/recipe`
- `api/v3/admin/configuration/structured-data/templates`
- `api/v3/admin/configuration/tracking-codes`
- `api/v3/admin/configuration/util/batch-job`
- `api/v3/admin/configuration/util/cron`
- `api/v3/admin/configuration/util/database-field`
- `api/v3/admin/configuration/util/demo-preview`
- `api/v3/admin/configuration/util/file-manager`
- `api/v3/admin/configuration/util/flexible-price`
- `api/v3/admin/configuration/util/flow`
- `api/v3/admin/configuration/util/license`
- `api/v3/admin/configuration/util/log`
- `api/v3/admin/configuration/util/marriage-loan`
- `api/v3/admin/configuration/util/sitemap`
- `api/v3/admin/configuration/util/store-plugins`
- `api/v3/admin/configuration/util/system-info`
- `api/v3/admin/configuration/util/system-messages`
- `api/v3/admin/configuration/util/system-notifications`
- `api/v3/admin/configuration/util/system-usage`
- `api/v3/admin/configuration/util/upgrade`
- `api/v3/admin/configuration/webhooks`
- `api/v3/admin/configuration/webhooks/domain-settings`
- `api/v3/admin/configuration/webhooks/events`
- `api/v3/admin/configuration/webhooks/logs`
- `api/v3/admin/configuration/webhooks/logs/total`
- `api/v3/admin/configuration/webhooks/test`

## CRM

- `api/v3/admin/crm/guest-book`
- `api/v3/admin/crm/store`
- `api/v3/admin/crm/store/group`
- `api/v3/admin/crm/ticket`
- `api/v3/admin/crm/ticket/department`
- `api/v3/admin/crm/ticket/user-token`

## Üye

Üye kartı, grup, segment, sepet, sadakat, mesaj, istek listesi, cari bakiye ve ödeme bildirimi. Ödeme bildiriminin gövdesi [Ödeme bildirimi](odeme-bildirimi.md) sayfasındadır.

- `api/v3/admin/customers/batch`
- `api/v3/admin/customers/billing/account-balance`
- `api/v3/admin/customers/billing/payment-form`
- `api/v3/admin/customers/cart`
- `api/v3/admin/customers/customer`
- `api/v3/admin/customers/fields`
- `api/v3/admin/customers/fields/sortable`
- `api/v3/admin/customers/gift-coupon/reactivate`
- `api/v3/admin/customers/group`
- `api/v3/admin/customers/loyalty`
- `api/v3/admin/customers/loyalty/config`
- `api/v3/admin/customers/loyalty/rules`
- `api/v3/admin/customers/loyalty/tiers`
- `api/v3/admin/customers/loyalty/transactions`
- `api/v3/admin/customers/messages`
- `api/v3/admin/customers/messages/department`
- `api/v3/admin/customers/messages/resolution`
- `api/v3/admin/customers/payment-notification`
- `api/v3/admin/customers/payment-notification/batch-recreate`
- `api/v3/admin/customers/point`
- `api/v3/admin/customers/segment`
- `api/v3/admin/customers/wishlist`
- `api/v3/admin/customers/wishlist/category`

## Dosya

- `api/v3/admin/file-manager`

## Entegrasyon

Nova sohbeti, görsel ve taksonomi işleri, Nova Studio, cüzdan, Sendheap, T-Soft Apps kurulumu ve Hotnoc.

- `api/v3/admin/integration/ai/agent`
- `api/v3/admin/integration/ai/mcp/connection`
- `api/v3/admin/integration/ai/mcp/consent`
- `api/v3/admin/integration/ai/nova/actions/catalog`
- `api/v3/admin/integration/ai/nova/actions/proposals`
- `api/v3/admin/integration/ai/nova/chat`
- `api/v3/admin/integration/ai/nova/images/bulk/batches`
- `api/v3/admin/integration/ai/nova/images/bulk/batches/cancel`
- `api/v3/admin/integration/ai/nova/images/bulk/optimize`
- `api/v3/admin/integration/ai/nova/images/directory/count`
- `api/v3/admin/integration/ai/nova/images/history`
- `api/v3/admin/integration/ai/nova/images/optimized/index`
- `api/v3/admin/integration/ai/nova/images/settings`
- `api/v3/admin/integration/ai/nova/images/single/optimize`
- `api/v3/admin/integration/ai/nova/images/summary`
- `api/v3/admin/integration/ai/nova/taxonomy`
- `api/v3/admin/integration/ai/nova/taxonomy/bulk/batches`
- `api/v3/admin/integration/ai/nova/taxonomy/bulk/preview`
- `api/v3/admin/integration/ai/nova/taxonomy/bulk/scan`
- `api/v3/admin/integration/ai/nova/taxonomy/review`
- `api/v3/admin/integration/ai/nova/taxonomy/review/bulk-approve`
- `api/v3/admin/integration/ai/nova/taxonomy/review/{id}/approve`
- `api/v3/admin/integration/ai/nova/taxonomy/review/{id}/reject`
- `api/v3/admin/integration/ai/nova/taxonomy/single/suggest`
- `api/v3/admin/integration/ai/novastudio`
- `api/v3/admin/integration/ai/novastudio/jobs`
- `api/v3/admin/integration/ai/novastudio/social`
- `api/v3/admin/integration/ai/novastudio/templates`
- `api/v3/admin/integration/ai/novastudio/video/generate`
- `api/v3/admin/integration/ai/novastudio/video/jobs`
- `api/v3/admin/integration/ai/novastudio/virtual-try-on`
- `api/v3/admin/integration/ai/task`
- `api/v3/admin/integration/ai/wallet`
- `api/v3/admin/integration/bill-tekrom`
- `api/v3/admin/integration/hotnoc`
- `api/v3/admin/integration/nilcare/iframe`
- `api/v3/admin/integration/sendheap`
- `api/v3/admin/integration/sendheap/login`
- `api/v3/admin/integration/sendheap/status`
- `api/v3/admin/integration/tsoftapps/install/start`
- `api/v3/admin/integration/tsoftapps/oauth/callback`
- `api/v3/admin/integration/tsoftapps/oauth/disconnect`
- `api/v3/admin/integration/tsoftapps/oauth/initiate`
- `api/v3/admin/integration/tsoftapps/oauth/status`
- `api/v3/admin/integration/tsoftapps/themes/storefront-ready`

## Pazarlama

- `api/v3/admin/marketing/collabs/affiliates`
- `api/v3/admin/marketing/collabs/config`
- `api/v3/admin/marketing/collabs/earnings`
- `api/v3/admin/marketing/collabs/payments`
- `api/v3/admin/marketing/collabs/programs`

## Vitrin

Eski tema motoru: sayfa, menü, blok ve tema.

- `api/v3/admin/online-store/block`
- `api/v3/admin/online-store/fonts/google`
- `api/v3/admin/online-store/menu`
- `api/v3/admin/online-store/menu/items`
- `api/v3/admin/online-store/meta/relation/fields`
- `api/v3/admin/online-store/pages`
- `api/v3/admin/online-store/pages/column/relation`
- `api/v3/admin/online-store/pages/relation`
- `api/v3/admin/online-store/themes`
- `api/v3/admin/online-store/themes/scss/variables`

## Yeni vitrin

OS2 tema, satır ve sütun, anlık görüntü ve geliştirici çalışma alanı.

- `api/v3/admin/online-store-2/block`
- `api/v3/admin/online-store-2/developer-workspace/auth/disconnect`
- `api/v3/admin/online-store-2/developer-workspace/auth/exchange`
- `api/v3/admin/online-store-2/developer-workspace/auth/initiate`
- `api/v3/admin/online-store-2/developer-workspace/me`
- `api/v3/admin/online-store-2/developer-workspace/themes`
- `api/v3/admin/online-store-2/pages`
- `api/v3/admin/online-store-2/pages/relation`
- `api/v3/admin/online-store-2/storefront/activation/activate`
- `api/v3/admin/online-store-2/storefront/activation/status`
- `api/v3/admin/online-store-2/storefront/apply-marketplace-templates`
- `api/v3/admin/online-store-2/storefront/assignments`
- `api/v3/admin/online-store-2/storefront/bootstrap`
- `api/v3/admin/online-store-2/storefront/columns`
- `api/v3/admin/online-store-2/storefront/migration`
- `api/v3/admin/online-store-2/storefront/pages`
- `api/v3/admin/online-store-2/storefront/relations`
- `api/v3/admin/online-store-2/storefront/rows`
- `api/v3/admin/online-store-2/storefront/snapshots`
- `api/v3/admin/online-store-2/storefront/templates`
- `api/v3/admin/online-store-2/storefront/theme`
- `api/v3/admin/online-store-2/theme`
- `api/v3/admin/online-store-2/theme/export-theme/{uuid}/theme`
- `api/v3/admin/online-store-2/theme/global-snippets`
- `api/v3/admin/online-store-2/theme/section`

## Sipariş

Sipariş, kargo, iade, iade ödemesi, taksit, POS ve depo.

- `api/v3/admin/orders/address-field`
- `api/v3/admin/orders/batch`
- `api/v3/admin/orders/cargo/company`
- `api/v3/admin/orders/cargo/integration/company`
- `api/v3/admin/orders/cargo/integration/depot`
- `api/v3/admin/orders/cargo/integration/post`
- `api/v3/admin/orders/cargo/integration/storehouse`
- `api/v3/admin/orders/cargo/integration/user`
- `api/v3/admin/orders/cargo/payment-shipping`
- `api/v3/admin/orders/cargo/ptt-barcode`
- `api/v3/admin/orders/cargo/ptt-barcode/batch`
- `api/v3/admin/orders/cargo/shipping-cost`
- `api/v3/admin/orders/email-transaction-error`
- `api/v3/admin/orders/fulfillment-status`
- `api/v3/admin/orders/in-store-sales`
- `api/v3/admin/orders/order`
- `api/v3/admin/orders/order/digital-file-downloads`
- `api/v3/admin/orders/order/fulfillment`
- `api/v3/admin/orders/order/shipment`
- `api/v3/admin/orders/payment/bank-account`
- `api/v3/admin/orders/payment/bin`
- `api/v3/admin/orders/payment/bin/options`
- `api/v3/admin/orders/payment/card-banks`
- `api/v3/admin/orders/payment/card-banks/active-pos-types`
- `api/v3/admin/orders/payment/card-installment`
- `api/v3/admin/orders/payment/card-pos`
- `api/v3/admin/orders/payment/card-pos/details/bulk`
- `api/v3/admin/orders/payment/method`
- `api/v3/admin/orders/product`
- `api/v3/admin/orders/refund`
- `api/v3/admin/orders/refund-type`
- `api/v3/admin/orders/return`
- `api/v3/admin/orders/return/detail`
- `api/v3/admin/orders/return/reason`
- `api/v3/admin/orders/return/status`
- `api/v3/admin/orders/static/platform`
- `api/v3/admin/orders/static/supply-status`
- `api/v3/admin/orders/status`
- `api/v3/admin/orders/status-initial`
- `api/v3/admin/orders/status-update`
- `api/v3/admin/orders/subscription`
- `api/v3/admin/orders/transaction`
- `api/v3/admin/orders/transaction/pos-models`
- `api/v3/admin/orders/wms`

## Diğer

- `api/v3/admin/packages/form-app`
- `api/v3/admin/partner/access-requests`
- `api/v3/admin/partner/collaborator-codes`
- `api/v3/admin/partner/store-access`
- `api/v3/admin/supplier/dashboard`
- `api/v3/admin/supplier/profile`
- `api/v3/admin/tool/db-health-check`
- `api/v3/admin/tool/os2-migration/build-composer`
- `api/v3/admin/tool/os2-migration/build-os2-settings`
- `api/v3/admin/tool/os2-migration/build-tailwind`
- `api/v3/admin/tool/os2-migration/build-themes`
- `api/v3/admin/tool/os2-migration/status`
- `api/v3/admin/tool/user-filters`
- `api/v3/oauth/install`
- `api/v3/public/theme-categories`
- `api/v3/public/themes`

## Kimlik eklenen yollar

Kod bu adreslerin sonuna kayıt kimliği yazar.

- `api/v3/admin/analytics/log/price-stock-log/download/`
- `api/v3/admin/analytics/report/loyal/customer/`
- `api/v3/admin/auth/auth-application/`
- `api/v3/admin/campaigns/campaign/`
- `api/v3/admin/catalog/products/`
- `api/v3/admin/catalog/variant/`
- `api/v3/admin/configuration/util/log/`
- `api/v3/admin/configuration/webhooks/`
- `api/v3/admin/customers/`
- `api/v3/admin/integration/tsoftapps/theme/`
- `api/v3/admin/online-store-2/developer-workspace/themes/`
- `api/v3/admin/online-store-2/storefront/templates/`
- `api/v3/admin/online-store-2/storefront/theme/`
- `api/v3/admin/online-store-2/theme/`
- `api/v3/admin/online-store-2/theme/export/`
- `api/v3/admin/online-store/language-vars/`
- `api/v3/admin/online-store/page-relation/`
- `api/v3/admin/online-store/pages/`
- `api/v3/admin/online-store/themes/`
- `api/v3/admin/online-store/themes/export-theme/`
- `api/v3/admin/orders/cargo/integration/post/`
- `api/v3/admin/orders/cargo/payment-shipping/`
- `api/v3/admin/orders/order/`
- `api/v3/admin/orders/order/address/`
- `api/v3/admin/orders/order/shipment/`
- `api/v3/admin/orders/payment/bank-account/`
- `api/v3/admin/orders/payment/card-banks/`
- `api/v3/admin/orders/payment/card-installment/`
- `api/v3/admin/orders/payment/card-pos/`
- `api/v3/admin/orders/payment/option/`
- `api/v3/admin/orders/payment/provider-installments/`
- `api/v3/admin/packages/form-app/`
- `api/v3/public/onlinestore/theme/`
- `api/v3/public/themes/`
- `api/v3/storefront/utils/developer/preview/template/`
