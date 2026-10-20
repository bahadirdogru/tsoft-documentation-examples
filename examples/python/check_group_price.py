"""Bir ürünün üye grubu fiyatını okur.

Grup fiyatı SellingPrice alanında değildir. FetchDiscountedPriceDetail
açıkken DiscountedPrices dizisindedir. Satış üzerinden yüzde indirimde
DiscountType 1 ve Percentage negatiftir.
"""

import sys

from tsoft_client import load_env, login, post_form, rows_of, TsoftError


def main():
    product_code = sys.argv[1] if len(sys.argv) > 1 else "ORNEK-001"
    base, user, password, group = load_env()
    token, _expires = login(base, user, password)
    payload = post_form(base, "/rest1/product/get/", {
        "token": token,
        "ProductCode": product_code,
        "CustomerGroupCode": group,
        "FetchDiscountedPriceDetail": "true",
        "limit": "1",
    })
    rows = rows_of(payload)
    if not rows:
        raise TsoftError("Ürün bulunamadı")
    row = rows[0]
    print("raf", row.get("SellingPrice"))
    for item in row.get("DiscountedPrices") or []:
        if item.get("CustomerGroupCode") == group:
            print("grup", item.get("DiscountedPrice"), "oran", item.get("DiscountPercent"))
            return 0
    print("Bu grup için indirim satırı yok.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except TsoftError as error:
        print(error)
        sys.exit(1)
