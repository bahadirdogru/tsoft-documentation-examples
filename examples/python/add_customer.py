"""Tek öğretmen üyesini ogretmenler grubuna ekler.

Yeni kayıt addCustomers ile açılır. Parola Dy artı 10 haneli ceptir.
E-posta kayıtlıysa addCustomers güncellemez. O durumda setCustomers
yalnız mevcut CustomerCode, grup ve okul alanlarını yazar.
"""

import json
import sys

from tsoft_client import load_env, login, post_form, rows_of, TsoftError

SAMPLE = {
    "CustomerCode": "OGR0001",
    "Name": "Ayşe",
    "Surname": "Yılmaz",
    "Email": "ayse.yilmaz@example.com",
    "Mobile": "5550000000",
    "CompanyName": "Örnek İlkokul",
    "Field2": "Sınıf Öğretmeni",
    "Field3": "İlkokul",
    "Field4": "1. Sınıf",
}


def find_customer(base, token, email):
    payload = post_form(base, "/rest1/customer/getCustomers/", {
        "token": token,
        "f": f"Email | {email} | equal",
        "FetchCustomerGroup": "true",
        "limit": "1",
    })
    for row in rows_of(payload):
        if str(row.get("Email") or "").lower() == email.lower():
            return row
    return None


def main():
    base, user, password, group = load_env()
    token, expires = login(base, user, password)
    print(f"Token alındı. Süre: {expires or 'yanıtta yok'}.")
    person = dict(SAMPLE)
    person["CustomerGroupCode"] = group
    person["Password"] = "Dy" + person["Mobile"]
    person["Approval"] = "true"
    current = find_customer(base, token, person["Email"])
    if current is None:
        post_form(base, "/rest1/customer/addCustomers/", {
            "token": token,
            "data": json.dumps([person], ensure_ascii=False),
        })
        print("Üye oluşturuldu.", person["CustomerCode"])
        return 0
    post_form(base, "/rest1/customer/setCustomers/", {
        "token": token,
        "data": json.dumps([{
            "CustomerCode": current.get("CustomerCode"),
            "CustomerGroupCode": group,
            "CompanyName": person["CompanyName"],
            "Field2": person["Field2"],
            "Field3": person["Field3"],
            "Field4": person["Field4"],
        }], ensure_ascii=False),
    })
    print("Mevcut üye güncellendi.", current.get("CustomerCode"))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except TsoftError as error:
        print(error)
        sys.exit(1)
