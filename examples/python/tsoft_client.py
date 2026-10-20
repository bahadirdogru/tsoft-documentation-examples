"""T-Soft REST1 için küçük istemci.

Kimlik bilgisi ortam değişkenindedir. Token ve parola yazdırılmaz.
Mağaza adresi TSOFT_URL ile verilir. Sondaki bölü atılır.
"""

import json
import os
import urllib.error
import urllib.parse
import urllib.request

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


class TsoftError(Exception):
    pass


def load_env(path=".env"):
    if os.path.isfile(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())
    url = os.environ.get("TSOFT_URL", "").rstrip("/")
    user = os.environ.get("TSOFT_USER", "")
    password = os.environ.get("TSOFT_PASS", "")
    group = os.environ.get("TSOFT_GROUP_CODE", "ogretmenler")
    if not url or not user or not password:
        raise TsoftError("TSOFT_URL, TSOFT_USER ve TSOFT_PASS gerekli.")
    return url, user, password, group


def post_form(base, path, fields):
    body = urllib.parse.urlencode(fields).encode("utf-8")
    request = urllib.request.Request(
        base + path,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", errors="replace")
    payload = json.loads(raw) if raw else {}
    if payload.get("success") in (False, 0, "false", "0"):
        raise TsoftError(message_text(payload) or "T-Soft işlemi başarısız")
    return payload


def message_text(payload):
    message = payload.get("message") if isinstance(payload, dict) else ""
    if isinstance(message, str):
        return message
    if isinstance(message, dict):
        message = [message]
    parts = []
    for item in message or []:
        text = item.get("text") if isinstance(item, dict) else item
        if isinstance(text, list):
            text = " ".join(str(part) for part in text if part)
        if text:
            parts.append(str(text))
    return " ".join(parts)


def rows_of(payload):
    data = payload.get("data") if isinstance(payload, dict) else None
    if isinstance(data, list):
        return [row for row in data if isinstance(row, dict)]
    if isinstance(data, dict):
        return [data]
    return []


def login(base, user, password):
    path = "/rest1/auth/login/" + urllib.parse.quote(user, safe="")
    payload = post_form(base, path, {"pass": password})
    row = rows_of(payload)[0] if rows_of(payload) else {}
    token = str(row.get("token") or "")
    if not token:
        raise TsoftError("Token dönmedi")
    return token, str(row.get("expirationTime") or "")
