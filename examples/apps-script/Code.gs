/**
 * Başvuru sayfasındaki üyeleri T-Soft Öğretmenler grubuna yazar.
 *
 * Kurulum: Sheet'e bağlı Apps Script projesine yapıştırın. Proje ayarlarından
 * Script Properties ekleyin:
 *   TSOFT_BASE_URL   https://magaza.example
 *   TSOFT_USER       web servis kullanıcı adı
 *   TSOFT_PASS       web servis parolası
 *   TSOFT_GROUP_CODE ogretmenler
 * Grup kodu boşsa customer/getCustomerGroups içinde kodu ogretmenler
 * olan kayıt, yoksa adı [Öğretmenler] olan kayıt aranır.
 * Yeni üyenin parolası Dy artı 10 haneli ceptir. Sayfaya yazılmaz.
 *
 * Menü: TSoft > Senkronize et, TSoft > 10 dk tetikleyici kur.
 * Kimlik bilgisi bu dosyaya yazılmaz. Parola sayfaya yazılmaz.
 * Giriş linki ve sepet bu sürümde üretilmez.
 */

var SHEET_NAME = 'Basvurular';
var BATCH_LIMIT = 40;
var RUN_BUDGET_MS = 4.5 * 60 * 1000;
var STATUS_HEADERS = ['tsoft_durum', 'tsoft_kod', 'tsoft_mesaj', 'tsoft_zaman'];
var SOURCE_HEADERS = [
  'basvuru_id', 'gonderim_zamani', 'ad', 'soyad', 'okul_adi', 'il', 'ilce',
  'branslar', 'siniflar', 'telefon', 'eposta', 'kvkk_onay'
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('TSoft')
    .addItem('Senkronize et', 'senkronizeEt')
    .addItem('10 dk tetikleyici kur', 'kurTetikleyici')
    .addToUi();
}

function kurTetikleyici() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'senkronizeEt') {
      uiAlert_('Tetikleyici zaten kurulu.');
      return;
    }
  }
  ScriptApp.newTrigger('senkronizeEt').timeBased().everyMinutes(10).create();
  uiAlert_('10 dakikada bir çalışacak tetikleyici kuruldu.');
}

function senkronizeEt() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    Logger.log('Başka bir senkron çalışıyor.');
    return;
  }
  var started = Date.now();
  var created = 0;
  var updated = 0;
  var failed = 0;
  var queued = 0;
  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(SHEET_NAME + ' sayfası yok.');
    ensureStatusColumns_(sheet);
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      uiAlert_('İşlenecek satır yok.');
      return;
    }
    var col = headerMap_(values[0]);
    assertSourceColumns_(col);
    assertStatusColumns_(col);
    var groupCode = groupCode_();
    var records = [];
    for (var r = 1; r < values.length; r++) {
      records.push(readRecord_(values[r], col, r + 1));
    }
    markDuplicates_(records);

    var localRows = [];
    var pending = [];
    for (var i = 0; i < records.length; i++) {
      var rec = records[i];
      if (rec.sync) {
        if (rec.durum === 'olusturuldu' || rec.durum === 'guncellendi') {
          localRows.push(null);
        } else {
          pending.push(rec);
          localRows.push(rec.oncekiDurum === 'bekliyor' ? null : ['bekliyor', rec.kod, 'Sırada', stamp_()]);
        }
      } else if (rec.oncekiDurum === rec.durum && rec.oncekiMesaj === rec.mesaj) {
        localRows.push(null);
      } else {
        localRows.push([rec.durum, rec.kod, rec.mesaj, stamp_()]);
      }
    }
    writeStatusBlock_(sheet, col, localRows);

    queued = pending.length;
    var token = getToken_();
    for (var p = 0; p < pending.length && p < BATCH_LIMIT; p++) {
      if (Date.now() - started > RUN_BUDGET_MS) break;
      var item = pending[p];
      try {
        var result = upsertTeacher_(token, groupCode, item);
        if (result.created) created++;
        else updated++;
        writeStatus_(sheet, col, item.row, result.durum, result.kod, result.mesaj, stamp_());
      } catch (err) {
        failed++;
        writeStatus_(sheet, col, item.row, 'hata', item.kod, String(err.message || err).slice(0, 300), stamp_());
      }
      queued--;
    }
    var summary = 'Oluşturulan: ' + created + ', güncellenen: ' + updated +
      ', hata: ' + failed + ', bu turda kalan: ' + queued + '.';
    Logger.log(summary);
    uiAlert_(summary);
  } catch (err) {
    Logger.log(err);
    uiAlert_(String(err.message || err));
  } finally {
    lock.releaseLock();
  }
}

function readRecord_(row, col, rowNumber) {
  var rec = {
    row: rowNumber,
    basvuruId: cell_(row, col, 'basvuru_id'),
    ad: cell_(row, col, 'ad'),
    soyad: cell_(row, col, 'soyad'),
    okul: cell_(row, col, 'okul_adi'),
    il: cell_(row, col, 'il'),
    ilce: cell_(row, col, 'ilce'),
    brans: cell_(row, col, 'branslar'),
    sinif: cell_(row, col, 'siniflar'),
    telefon: normalizePhone_(row[col.telefon]),
    eposta: normalizeEmail_(row[col.eposta]),
    kvkk: cell_(row, col, 'kvkk_onay').toLocaleLowerCase('tr'),
    zamanKayit: asMillis_(row[col.gonderim_zamani]),
    durum: cell_(row, col, 'tsoft_durum').toLowerCase(),
    kod: cell_(row, col, 'tsoft_kod'),
    mesaj: cell_(row, col, 'tsoft_mesaj'),
    zaman: cell_(row, col, 'tsoft_zaman'),
    telefonNotu: cell_(row, col, 'telefon') && !normalizePhone_(row[col.telefon]) ? ' Telefon yazılmadı' : '',
    sync: false
  };
  rec.oncekiDurum = rec.durum;
  rec.oncekiMesaj = rec.mesaj;
  if (!rec.eposta || !isEmail_(rec.eposta) || rec.kvkk !== 'evet' || !rec.ad || !rec.soyad || !rec.basvuruId) {
    rec.durum = 'eksik';
    rec.mesaj = eksikMesaj_(rec);
    rec.kod = '';
    return rec;
  }
  rec.sync = true;
  return rec;
}

function eksikMesaj_(rec) {
  if (!rec.eposta) return 'E-posta yok';
  if (!isEmail_(rec.eposta)) return 'E-posta geçersiz';
  if (rec.kvkk !== 'evet') return 'KVKK onayı yok';
  if (!rec.ad || !rec.soyad) return 'Ad veya soyad yok';
  if (!rec.basvuruId) return 'basvuru_id yok';
  return 'Eksik';
}

function markDuplicates_(records) {
  var best = {};
  for (var i = 0; i < records.length; i++) {
    var rec = records[i];
    if (!rec.sync) continue;
    var prev = best[rec.eposta];
    if (!prev || rec.zamanKayit >= prev.zamanKayit) best[rec.eposta] = rec;
  }
  for (var j = 0; j < records.length; j++) {
    var item = records[j];
    if (!item.sync) continue;
    if (best[item.eposta] !== item) {
      item.sync = false;
      item.durum = 'mukerrer';
      item.mesaj = 'Aynı e-postanın daha yeni başvurusu var';
      item.kod = item.kod || '';
    }
  }
}

function upsertTeacher_(token, groupCode, rec) {
  var existing = findCustomerByEmail_(token, rec.eposta);
  var payload = {
    Name: rec.ad,
    Surname: rec.soyad,
    Email: rec.eposta,
    CompanyName: rec.okul,
    Field1: rec.brans,
    Field2: rec.sinif,
    CustomerGroupCode: groupCode,
    Approval: true
  };
  if (rec.telefon) payload.Mobile = rec.telefon;
  if (rec.il) payload.City = rec.il;
  if (rec.ilce) payload.Town = rec.ilce;

  if (existing) {
    tsoftCall_('/rest1/customer/setCustomers/', {
      token: token,
      MatchWithEmail: 'true',
      data: JSON.stringify([payload])
    });
    return {
      created: false,
      durum: 'guncellendi',
      kod: existing,
      mesaj: 'Grup ve alanlar güncellendi' + rec.telefonNotu
    };
  }

  payload.CustomerCode = rec.basvuruId;
  payload.Password = teacherPassword_(rec.telefon);
  tsoftCall_('/rest1/customer/addCustomers/', {
    token: token,
    data: JSON.stringify([payload])
  });
  return {
    created: true,
    durum: 'olusturuldu',
    kod: rec.basvuruId,
    mesaj: 'Üye oluşturuldu' + rec.telefonNotu
  };
}

function findCustomerByEmail_(token, email) {
  var json = tsoftCall_('/rest1/customer/getCustomers/', {
    token: token,
    limit: '1',
    columns: 'CustomerCode,Email',
    f: 'Email | ' + email + ' | equal'
  });
  var rows = rowsOf_(json);
  if (!rows.length) return '';
  var code = String(field_(rows[0], ['CustomerCode']) || '');
  if (!code) throw new Error('Üye bulundu ama CustomerCode boş');
  return code;
}

function groupCode_() {
  var configured = (PropertiesService.getScriptProperties().getProperty('TSOFT_GROUP_CODE') || '').trim();
  if (configured) return configured;
  var cache = CacheService.getScriptCache();
  var cached = cache.get('tsoft_group_code');
  if (cached) return cached;
  var json = tsoftCall_('/rest1/customer/getCustomerGroups/', {
    token: getToken_(),
    limit: '500'
  });
  var rows = rowsOf_(json);
  var named = '';
  for (var i = 0; i < rows.length; i++) {
    var code = String(field_(rows[i], ['Code', 'CustomerGroupCode', 'GroupCode'])).trim();
    if (code === 'ogretmenler') {
      cache.put('tsoft_group_code', code, 21600);
      return code;
    }
    var name = groupNameKey_(field_(rows[i], ['Name', 'CustomerGroupName', 'GroupName']));
    if (name === 'öğretmenler' && code) named = code;
  }
  if (named) {
    cache.put('tsoft_group_code', named, 21600);
    return named;
  }
  throw new Error('ogretmenler grup kodu bulunamadı. TSOFT_GROUP_CODE girin.');
}

function groupNameKey_(value) {
  return String(value || '').replace(/[\[\]]/g, '').trim().toLocaleLowerCase('tr');
}

function getToken_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('tsoft_token');
  if (hit) return hit;
  var props = PropertiesService.getScriptProperties();
  var user = requiredProp_(props, 'TSOFT_USER');
  var pass = requiredProp_(props, 'TSOFT_PASS');
  var json = tsoftCall_('/rest1/auth/login/' + encodeURIComponent(user), { pass: pass }, true);
  var row = rowsOf_(json)[0] || {};
  var token = String(field_(row, ['token']) || json.token || '');
  if (!token) throw new Error('Token dönmedi');
  var ttl = 1200;
  var exp = field_(row, ['expirationTime', 'expiration_time']);
  if (exp) {
    var when = new Date(exp).getTime();
    if (!isNaN(when)) {
      ttl = Math.floor((when - Date.now()) / 1000) - 60;
      if (ttl < 60) ttl = 60;
      if (ttl > 21600) ttl = 21600;
    }
  }
  cache.put('tsoft_token', token, ttl);
  return token;
}

function tsoftCall_(path, fields, skipAuthRetry) {
  var base = requiredProp_(PropertiesService.getScriptProperties(), 'TSOFT_BASE_URL').replace(/\/$/, '');
  var response = UrlFetchApp.fetch(base + path, {
    method: 'post',
    payload: fields,
    muteHttpExceptions: true,
    followRedirects: true
  });
  var http = response.getResponseCode();
  var text = response.getContentText() || '';
  var json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = null;
  }
  if (!skipAuthRetry && fields.token && isAuthError_(http, json, text)) {
    CacheService.getScriptCache().remove('tsoft_token');
    fields.token = getToken_();
    return tsoftCall_(path, fields, true);
  }
  if (http >= 400 || !json) {
    throw new Error('HTTP ' + http + ' ' + text.slice(0, 180));
  }
  if (json.success === false || json.success === 'false' || json.success === 0) {
    throw new Error(messageText_(json).slice(0, 300) || 'T-Soft işlemi başarısız');
  }
  return json;
}

function isAuthError_(http, json, text) {
  if (http === 401) return true;
  var blob = ((json && messageText_(json)) || text || '').toUpperCase();
  return blob.indexOf('AUI004') >= 0 || blob.indexOf('AUI005') >= 0 || blob.indexOf('GEÇERSİZ TOKEN') >= 0;
}

function messageText_(json) {
  var message = json && json.message;
  if (!message) return '';
  if (typeof message === 'string') return message;
  if (!Array.isArray(message)) message = [message];
  return message.map(function (item) {
    if (!item) return '';
    if (typeof item === 'string') return item;
    var text = item.text || item.message || item.code || '';
    if (Array.isArray(text)) text = text.join(' ');
    return String(text);
  }).filter(Boolean).join(' ');
}

function rowsOf_(json) {
  if (!json || json.data === undefined || json.data === null) return [];
  if (Array.isArray(json.data)) return json.data;
  if (typeof json.data === 'object') return [json.data];
  return [];
}

function field_(obj, names) {
  if (!obj || typeof obj !== 'object') return '';
  var lower = {};
  Object.keys(obj).forEach(function (key) {
    lower[key.toLowerCase()] = obj[key];
  });
  for (var i = 0; i < names.length; i++) {
    var value = lower[names[i].toLowerCase()];
    if (value !== undefined && value !== null && String(value) !== '') return value;
  }
  return '';
}

function ensureStatusColumns_(sheet) {
  var last = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, last).getValues()[0];
  var missing = STATUS_HEADERS.filter(function (name) {
    return colIndex_(headers, name) < 0;
  });
  if (!missing.length) return;
  sheet.getRange(1, last + 1, 1, missing.length).setValues([missing]);
}

function headerMap_(headers) {
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    var key = String(headers[i] || '').trim().toLowerCase();
    if (key) map[key] = i;
  }
  return map;
}

function assertStatusColumns_(col) {
  for (var i = 1; i < STATUS_HEADERS.length; i++) {
    if (col[STATUS_HEADERS[i]] !== col.tsoft_durum + i) {
      throw new Error('Durum sütunları yan yana ve bu sırada olmalı: ' + STATUS_HEADERS.join(', '));
    }
  }
}

function assertSourceColumns_(col) {
  var missing = SOURCE_HEADERS.filter(function (name) {
    return col[name] === undefined;
  });
  if (missing.length) throw new Error('Eksik sütun: ' + missing.join(', '));
}

function writeStatusBlock_(sheet, col, rows) {
  if (!rows.length) return;
  var startCol = col.tsoft_durum + 1;
  var chunk = [];
  var chunkStart = 0;
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i]) {
      flushChunk_(sheet, startCol, chunkStart, chunk);
      chunk = [];
      chunkStart = i + 1;
      continue;
    }
    if (!chunk.length) chunkStart = i;
    chunk.push(rows[i]);
  }
  flushChunk_(sheet, startCol, chunkStart, chunk);
}

function flushChunk_(sheet, startCol, startIndex, chunk) {
  if (!chunk.length) return;
  sheet.getRange(startIndex + 2, startCol, chunk.length, STATUS_HEADERS.length).setValues(chunk);
}

function writeStatus_(sheet, col, rowNumber, durum, kod, mesaj, zaman) {
  sheet.getRange(rowNumber, col.tsoft_durum + 1, 1, STATUS_HEADERS.length)
    .setValues([[durum, kod || '', mesaj || '', zaman]]);
}

function cell_(row, col, name) {
  var value = row[col[name]];
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone_(value) {
  if (value === null || value === undefined || value === '') return '';
  var digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.indexOf('90') === 0) digits = digits.substring(2);
  if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.substring(1);
  if (digits.length === 10 && digits.charAt(0) === '5') return digits;
  return '';
}

function asMillis_(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number' && isFinite(value)) {
    if (value > 20000 && value < 80000) return Math.round((value - 25569) * 86400 * 1000);
    return value;
  }
  if (typeof value === 'string' && value) {
    var parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed.getTime();
  }
  return 0;
}

function teacherPassword_(mobile) {
  if (!mobile || !/^5\d{9}$/.test(mobile)) {
    throw new Error('Cep numarası yok. Parola Dy ile kurulamadı.');
  }
  return 'Dy' + mobile;
}

function stamp_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Europe/Istanbul', 'yyyy-MM-dd HH:mm:ss');
}

function requiredProp_(props, key) {
  var value = (props.getProperty(key) || '').trim();
  if (!value) throw new Error('Eksik Script Property: ' + key);
  return value;
}

function uiAlert_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    Logger.log(message);
  }
}
