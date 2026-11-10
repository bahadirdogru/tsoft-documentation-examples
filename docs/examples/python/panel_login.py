"""Panel iç API'sine giriş ve ziyaretçi özeti.

Parola girişi yapar. İki adımlı doğrulama istenirse yöntemi SMS'e çevirir,
kodu terminalden sorar ve doğrular. Sonra bugünün ziyaretçi özetini yazdırır.

Ortam: TSOFT_URL (ör. https://www.magaza.example), TSOFT_PANEL_USER,
TSOFT_PANEL_PASS. Token ve parola yazdırılmaz, dosyaya yazılmaz.
Akış: content/admin-api/oturum.md
"""

import json
import os
import urllib.error
import urllib.parse
import urllib.request

from tsoft_client import USER_AGENT, TsoftError

SMS = "2fa_sms"


def call(method, url, body=None, token=None):
    """JSON istek. Hata kodlu cevabın gövdesi de döner; iki adımlı doğrulama hata koduyla gelir."""
    headers = {"Accept": "application/json", "User-Agent": USER_AGENT, "Accept-Language": "tr"}
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = "Bearer " + token
    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            status, raw = response.status, response.read()
    except urllib.error.HTTPError as error:
        status, raw = error.code, error.read()
    try:
        payload = json.loads(raw.decode("utf-8", errors="replace")) if raw else {}
    except ValueError:
        payload = {}
    return status, payload


def challenge_of(payload):
    """(token, type, uri, methods) ya da None."""
    data = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(data, dict):
        return None
    route = data.get("route") or {}
    if not data.get("token") or not route.get("uri"):
        return None
    must = (payload.get("attributes") or {}).get("two_factor_must_validate") or {}
    args = must.get("args") or [{}]
    methods = (args[0].get("options") or []) if isinstance(args[0], dict) else []
    return data["token"], route.get("type", ""), route["uri"], methods


def panel_token(payload):
    token = ((payload.get("data") or {}).get("token") or {})
    plain = token.get("plainTextToken")
    if not plain:
        raise TsoftError("Giriş token döndürmedi")
    return plain, (token.get("accessToken") or {}).get("expires_at")


def on_store(base, uri):
    url = urllib.parse.urljoin(base + "/", uri)
    if urllib.parse.urlsplit(url).hostname != urllib.parse.urlsplit(base).hostname:
        raise TsoftError("Doğrulama adresi mağaza dışında; durduruldu")
    return url


def login(base, user, password):
    domain = urllib.parse.urlsplit(base).hostname
    status, payload = call("POST", base + "/api/v3/admin/auth/login",
                           {"domain": domain, "email": user, "password": password})
    found = challenge_of(payload)
    if not found:
        if status >= 400:
            raise TsoftError(f"Giriş başarısız ({status}): {payload.get('message', '')}")
        return panel_token(payload)

    token, kind, uri, methods = found
    print("İki adımlı doğrulama istendi. Yöntemler:", ", ".join(methods) or kind)
    if kind != SMS:
        if methods and SMS not in methods:
            raise TsoftError("Bu kullanıcıda SMS yöntemi yok")
        status, payload = call("POST", base + "/api/v3/admin/auth/oauth/two-factor",
                               {"type": SMS, "token": token, "code": ""})
        found = challenge_of(payload)
        if not found:
            raise TsoftError(f"SMS gönderilemedi ({status}): {payload.get('message', '')}")
        token, kind, uri, _ = found
    code = "".join(ch for ch in input("SMS kodu: ") if ch.isdigit())
    status, payload = call("POST", on_store(base, uri), {"code": code, "method": kind, "token": token})
    if status >= 400 or not payload.get("status"):
        raise TsoftError(f"Kod kabul edilmedi ({status}): {payload.get('message', '')}")
    return panel_token(payload)


def main():
    base = os.environ.get("TSOFT_URL", "").rstrip("/")
    user = os.environ.get("TSOFT_PANEL_USER", "")
    password = os.environ.get("TSOFT_PANEL_PASS", "")
    if not base or not user or not password:
        raise TsoftError("TSOFT_URL, TSOFT_PANEL_USER ve TSOFT_PANEL_PASS gerekli.")
    token, expires_at = login(base, user, password)
    print("Giriş tamam. Token bitişi:", expires_at or "yanıtta yok")
    status, payload = call("GET", base + "/api/v3/admin/analytics/report/visitor/overview?range=today", token=token)
    if status >= 400:
        raise TsoftError(f"Rapor okunamadı ({status}): {payload.get('message', '')}")
    current = (payload.get("data") or {}).get("current") or {}
    for key in ("sessions", "visitors", "pageviews", "orders", "revenue", "conversion_rate"):
        print(f"{key}: {current.get(key)}")


if __name__ == "__main__":
    try:
        main()
    except TsoftError as error:
        raise SystemExit(str(error))
