(function () {
  const PAGES = [
    { group: "Platform", title: "Platform haritası", path: "developer/README.md", kind: "md" },
    { group: "Platform", title: "Başlarken", path: "developer/baslarken.md", kind: "md" },
    { group: "Platform", title: "Tema motoru", path: "developer/tema.md", kind: "md" },
    { group: "Platform", title: "Storefront API", path: "developer/storefront-api.md", kind: "md" },
    { group: "REST1", title: "REST1 notları", path: "tsoft.rest.md", kind: "md" },
    { group: "Örnek kod", title: "Python istemci", path: "examples/python/tsoft_client.py", kind: "code", lang: "python" },
    { group: "Örnek kod", title: "Üye ekleme", path: "examples/python/add_customer.py", kind: "code", lang: "python" },
    { group: "Örnek kod", title: "Grup fiyatı", path: "examples/python/check_group_price.py", kind: "code", lang: "python" },
    { group: "Örnek kod", title: "Ortam değişkenleri", path: "examples/python/.env.example", kind: "code", lang: "bash" },
    { group: "Örnek kod", title: "Apps Script", path: "examples/apps-script/Code.gs", kind: "code", lang: "js" },
    { group: "Tema blokları", title: "Üst blok", path: "theme/TSoft Block Codes/ust.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Alt blok", path: "theme/TSoft Block Codes/alt.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Yeni ürünler", path: "theme/TSoft Block Codes/yeni-urunler.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Kategori menüsü", path: "theme/TSoft Block Codes/kategori-menusu.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Kategori listesi", path: "theme/TSoft Block Codes/kategori-listesi.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Ana sayfa banner", path: "theme/TSoft Block Codes/home-banner.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Ana sayfa indirim", path: "theme/TSoft Block Codes/home-sale.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Haberler", path: "theme/TSoft Block Codes/haberler.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Benzer ürünler", path: "theme/TSoft Block Codes/benzer-urunler.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Model listesi", path: "theme/TSoft Block Codes/model-listesi.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Marka listesi", path: "theme/TSoft Block Codes/marka-listesi.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Parça toplama sihirbazı", path: "theme/TSoft Block Codes/parca-toplama-sihirbazi.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Tedarikçi listesi", path: "theme/TSoft Block Codes/tedarikci-listesi.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Fırsat ürünleri", path: "theme/TSoft Block Codes/firsat-urunleri.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Ayın yazarı", path: "theme/TSoft Block Codes/ayin-yazari.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Gelecek fırsatlar", path: "theme/TSoft Block Codes/gelecek-firsat-urun-listesi.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "SSS", path: "theme/TSoft Block Codes/sss.html", kind: "code", lang: "html" },
    { group: "Tema blokları", title: "Görsel vitrin", path: "theme/TSoft Block Codes/gorsel-vitrin.html", kind: "code", lang: "html" },
    { group: "Değişkenler", title: "Ürün değişkenleri", path: "theme/TSoft Block Varriables/tsoft-product-varriables.json", kind: "code", lang: "json" },
    { group: "Değişkenler", title: "Sayfa linkleri", path: "theme/TSoft Block Varriables/tsoft-header-page-links-varriable.json", kind: "code", lang: "json" },
    { group: "Değişkenler", title: "Üst sekmeler", path: "theme/TSoft Block Varriables/tsoft-header-tabs-varriable.json", kind: "code", lang: "json" },
    { group: "Değişkenler", title: "Alt menü", path: "theme/TSoft Block Varriables/tsoft-footer-menu-varriables.json", kind: "code", lang: "json" },
    { group: "Değişkenler", title: "Sol ve sağ kategori", path: "theme/TSoft Block Varriables/tsoft-left-right-category-varriables.json", kind: "code", lang: "json" },
    { group: "Şablonlar", title: "Bayi hesabı koşulu", path: "theme/snippets/bayi-mi-degil-mi.tpl", kind: "code", lang: "html" },
    { group: "Şablonlar", title: "Bayi paneli", path: "theme/orta/user_bayipanel.tpl", kind: "code", lang: "html" },
    { group: "Şablonlar", title: "Bayi giriş plasiyer", path: "theme/orta/user_bayigirisplasiyer.tpl", kind: "code", lang: "html" },
    { group: "Şablonlar", title: "V4 şablon", path: "theme/orta/user_v4tpl.tpl", kind: "code", lang: "html" },
    { group: "Şablonlar", title: "Tasarım yeni menü", path: "theme/UstAlt/user_tasarimyenimenu.tpl", kind: "code", lang: "html" }
  ];

  const byPath = new Map(PAGES.map(function (page) { return [page.path, page]; }));
  const cache = new Map();
  const inflight = new Map();
  let tocObserver = null;
  const LANG = {
    bash: "Bash",
    json: "JSON",
    twig: "Twig",
    python: "Python",
    js: "JavaScript",
    html: "HTML",
    text: "Metin"
  };
  const KEYWORDS = {
    python: ["def", "class", "return", "import", "from", "if", "elif", "else", "for", "while", "try", "except", "raise", "with", "as", "in", "not", "and", "or", "True", "False", "None", "pass", "lambda"],
    js: ["function", "return", "const", "let", "var", "if", "else", "new", "await", "async", "for", "while", "true", "false", "null", "this"],
    bash: ["npm", "cd", "python3", "cp", "tsoft"],
    html: ["if", "else", "foreach", "section"]
  };

  const navBody = document.getElementById("nav-body");
  const main = document.getElementById("icerik");
  const toc = document.getElementById("toc");
  const shell = document.querySelector(".shell");
  const q = document.getElementById("q");
  const status = document.getElementById("search-status");
  const menu = document.getElementById("menu");
  const backdrop = document.getElementById("backdrop");
  let openSeq = 0;
  let activeResult = 0;
  let indexReady = 0;

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  function fold(value) {
    return String(value).toLocaleLowerCase("tr");
  }

  function slugify(text) {
    return String(text)
      .trim()
      .replace(/İ/g, "i")
      .replace(/I/g, "i")
      .toLowerCase()
      .replace(/[`*_]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "");
  }

  function plainHeading(text) {
    return text.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").trim();
  }

  function uniqueId(base, used) {
    const key = base || "bolum";
    const seen = used.get(key) || 0;
    used.set(key, seen + 1);
    return seen === 0 ? key : key + "-" + (seen + 1);
  }

  function pageHref(path, anchor) {
    const params = new URLSearchParams();
    if (path) params.set("p", path);
    if (anchor) params.set("h", anchor);
    const query = params.toString();
    return query ? "#" + query : "#";
  }

  function readHash() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ""));
    return { path: params.get("p") || "", anchor: params.get("h") || "" };
  }

  function fileUrl(path) {
    return path.split("/").map(encodeURIComponent).join("/");
  }

  function resolvePath(from, href) {
    if (href.startsWith("/")) return href;
    const base = from.split("/").slice(0, -1);
    href.split("/").forEach(function (part) {
      if (part === "..") base.pop();
      else if (part && part !== ".") base.push(part);
    });
    return base.join("/");
  }

  function resolveDocHref(href, pagePath) {
    if (/^https?:/i.test(href) || href.startsWith("#") || href.startsWith("/")) return "";
    const cut = href.split("#");
    const path = resolvePath(pagePath, cut[0]);
    const anchor = cut.length > 1 ? decodeURIComponent(cut.slice(1).join("#")) : "";
    if (byPath.has(path)) return pageHref(path, anchor);
    const prefix = path.endsWith("/") ? path : path + "/";
    const hit = PAGES.find(function (page) {
      return page.path === path || page.path.startsWith(prefix);
    });
    return hit ? pageHref(hit.path, anchor) : "";
  }

  function sanitizeHref(href) {
    const value = String(href || "").trim();
    if (!value || /^\s*javascript:/i.test(value) || /^\s*data:/i.test(value)) return "";
    return value;
  }

  function anchorHtml(href, text, pagePath) {
    const safe = sanitizeHref(href);
    const label = formatInline(text, pagePath);
    if (!safe) return label;
    if (safe.startsWith("#")) {
      return '<a href="' + escapeAttr(pageHref(pagePath, decodeURIComponent(safe.slice(1)))) + '">' + label + "</a>";
    }
    const internal = resolveDocHref(safe, pagePath);
    if (internal) return '<a href="' + escapeAttr(internal) + '">' + label + "</a>";
    const external = /^https?:\/\//i.test(safe);
    return '<a href="' + escapeAttr(safe) + '"' + (external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + label + "</a>";
  }

  function restoreSaved(text, saved) {
    return text.split(/(\u0000\d+\u0000)/).map(function (part) {
      const mark = part.match(/^\u0000(\d+)\u0000$/);
      return mark ? saved[Number(mark[1])] : escapeHtml(part);
    }).join("");
  }

  function formatInline(raw, pagePath) {
    const saved = [];
    function hold(html) {
      saved.push(html);
      return "\u0000" + (saved.length - 1) + "\u0000";
    }
    let source = String(raw);
    source = source.replace(/<strong>([\s\S]*?)<\/strong>/gi, function (_, inner) {
      return hold("<strong>" + formatInline(inner, pagePath) + "</strong>");
    });
    source = source.replace(/<a href="([^"]*)">([\s\S]*?)<\/a>/gi, function (_, href, inner) {
      return hold(anchorHtml(href, inner, pagePath));
    });
    const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
    let out = "";
    let last = 0;
    for (const match of source.matchAll(re)) {
      out += restoreSaved(source.slice(last, match.index), saved);
      const token = match[0];
      if (token.startsWith("`")) out += "<code>" + escapeHtml(token.slice(1, -1)) + "</code>";
      else if (token.startsWith("**")) out += "<strong>" + formatInline(token.slice(2, -2), pagePath) + "</strong>";
      else {
        const link = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        out += anchorHtml(link[2], link[1], pagePath);
      }
      last = match.index + token.length;
    }
    out += restoreSaved(source.slice(last), saved);
    return out;
  }

  function highlight(code, lang) {
    const keywords = new Set(KEYWORDS[lang] || []);
    let html = "";
    let i = 0;
    while (i < code.length) {
      const rest = code.slice(i);
      if ((lang === "python" || lang === "bash") && (rest.startsWith('"""') || rest.startsWith("'''"))) {
        const quote = rest.slice(0, 3);
        const end = code.indexOf(quote, i + 3);
        const stop = end === -1 ? code.length : end + 3;
        html += '<span class="tok-s">' + escapeHtml(code.slice(i, stop)) + "</span>";
        i = stop;
        continue;
      }
      if ((lang === "python" || lang === "bash") && code[i] === "#") {
        const end = code.indexOf("\n", i);
        const stop = end === -1 ? code.length : end;
        html += '<span class="tok-c">' + escapeHtml(code.slice(i, stop)) + "</span>";
        i = stop;
        continue;
      }
      if ((lang === "js" || lang === "html") && rest.startsWith("//")) {
        const end = code.indexOf("\n", i);
        const stop = end === -1 ? code.length : end;
        html += '<span class="tok-c">' + escapeHtml(code.slice(i, stop)) + "</span>";
        i = stop;
        continue;
      }
      if ((lang === "html" || lang === "js") && rest.startsWith("<!--")) {
        const end = code.indexOf("-->", i + 4);
        const stop = end === -1 ? code.length : end + 3;
        html += '<span class="tok-c">' + escapeHtml(code.slice(i, stop)) + "</span>";
        i = stop;
        continue;
      }
      if ((lang === "html" || lang === "twig") && code[i] === "<") {
        const end = code.indexOf(">", i);
        const stop = end === -1 ? i + 1 : end + 1;
        html += '<span class="tok-tag">' + escapeHtml(code.slice(i, stop)) + "</span>";
        i = stop;
        continue;
      }
      if (lang === "twig" || lang === "html") {
        let end = -1;
        let width = 2;
        if (rest.startsWith("{{")) end = code.indexOf("}}", i + 2);
        else if (rest.startsWith("{%")) end = code.indexOf("%}", i + 2);
        else if (/^\{(?:if|else|elseif|foreach|section|assign|literal|\$)/.test(rest)) {
          end = code.indexOf("}", i + 1);
          width = 1;
        }
        if (rest.startsWith("{{") || rest.startsWith("{%") || /^\{(?:if|else|elseif|foreach|section|assign|literal|\$)/.test(rest)) {
          const stop = end === -1 ? i + width : end + width;
          html += '<span class="tok-k">' + escapeHtml(code.slice(i, stop)) + "</span>";
          i = stop;
          continue;
        }
      }
      if (code[i] === '"' || code[i] === "'" || (code[i] === "`" && lang === "js")) {
        const quote = code[i];
        let j = i + 1;
        while (j < code.length && code[j] !== "\n") {
          if (code[j] === "\\") { j += 2; continue; }
          if (code[j] === quote) { j += 1; break; }
          j += 1;
        }
        html += '<span class="tok-s">' + escapeHtml(code.slice(i, j)) + "</span>";
        i = j;
        continue;
      }
      const word = /^[A-Za-z_][\w]*/.exec(rest);
      if (word) {
        html += keywords.has(word[0]) ? '<span class="tok-k">' + escapeHtml(word[0]) + "</span>" : escapeHtml(word[0]);
        i += word[0].length;
        continue;
      }
      const number = /^(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)/.exec(rest);
      if (number) {
        html += '<span class="tok-n">' + number[0] + "</span>";
        i += number[0].length;
        continue;
      }
      html += escapeHtml(code[i]);
      i += 1;
    }
    return html;
  }

  function codeBlock(text, lang) {
    const source = String(text).replace(/\n$/, "");
    const label = LANG[lang] || lang || "Kod";
    return '<div class="code"><div class="code-bar"><span>' + escapeHtml(label) + '</span><button type="button" data-copy>Kopyala</button></div><pre><code>' + highlight(source, lang) + "</code></pre></div>";
  }

  function renderTable(rows, pagePath) {
    const parsed = rows.map(function (row) {
      return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (cell) {
        return cell.trim();
      });
    }).filter(function (cells) {
      return !cells.every(function (cell) { return /^:?-{3,}:?$/.test(cell); });
    });
    if (!parsed.length) return "";
    const head = parsed[0];
    const body = parsed.slice(1);
    const html = ['<div class="table-wrap"><table><thead><tr>'];
    head.forEach(function (cell) { html.push("<th>" + formatInline(cell, pagePath) + "</th>"); });
    html.push("</tr></thead><tbody>");
    body.forEach(function (cells) {
      html.push("<tr>");
      cells.forEach(function (cell) { html.push("<td>" + formatInline(cell, pagePath) + "</td>"); });
      html.push("</tr>");
    });
    html.push("</tbody></table></div>");
    return html.join("");
  }

  function parseDoc(src, pagePath) {
    const lines = String(src).replace(/\r\n/g, "\n").split("\n");
    const html = [];
    const headings = [];
    const sections = [];
    const used = new Map();
    const para = [];
    let section = { id: "", level: 1, title: "", lines: [] };
    let i = 0;

    function closeSection() {
      sections.push({
        id: section.id,
        level: section.level,
        title: section.title,
        text: section.lines.join("\n")
      });
    }

    function flushPara() {
      if (!para.length) return;
      const text = para.join(" ");
      html.push("<p>" + formatInline(text, pagePath) + "</p>");
      section.lines.push(text);
      para.length = 0;
    }

    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("```")) {
        flushPara();
        const lang = line.slice(3).trim().split(/\s+/)[0] || "";
        const body = [];
        i += 1;
        while (i < lines.length && !lines[i].startsWith("```")) {
          body.push(lines[i]);
          i += 1;
        }
        html.push(codeBlock(body.join("\n"), lang));
        section.lines.push(body.join("\n"));
        i += 1;
        continue;
      }
      if (/^\s*$/.test(line)) {
        flushPara();
        i += 1;
        continue;
      }
      const heading = /^(#{1,6})\s+(.*)$/.exec(line);
      if (heading) {
        flushPara();
        closeSection();
        const level = heading[1].length;
        const title = plainHeading(heading[2]);
        const id = uniqueId(slugify(title), used);
        html.push("<h" + level + ' id="' + escapeAttr(id) + '">' + formatInline(heading[2], pagePath) + "</h" + level + ">");
        headings.push({ level: level, id: id, title: title });
        section = { id: id, level: level, title: title, lines: [title] };
        i += 1;
        continue;
      }
      if (line.startsWith("|")) {
        flushPara();
        const rows = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          rows.push(lines[i]);
          i += 1;
        }
        html.push(renderTable(rows, pagePath));
        section.lines.push(rows.join("\n"));
        continue;
      }
      if (/^[-*]\s+/.test(line)) {
        flushPara();
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*]\s+/, ""));
          i += 1;
        }
        html.push("<ul>" + items.map(function (item) {
          return "<li>" + formatInline(item, pagePath) + "</li>";
        }).join("") + "</ul>");
        section.lines.push(items.join("\n"));
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        flushPara();
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s+/, ""));
          i += 1;
        }
        html.push("<ol>" + items.map(function (item) {
          return "<li>" + formatInline(item, pagePath) + "</li>";
        }).join("") + "</ol>");
        section.lines.push(items.join("\n"));
        continue;
      }
      para.push(line.trim());
      i += 1;
    }
    flushPara();
    closeSection();
    return { html: html.join("\n"), headings: headings, sections: sections };
  }

  function renderToc(headings) {
    const useful = headings.filter(function (item) { return item.level === 2 || item.level === 3; });
    const h3 = useful.filter(function (item) { return item.level === 3; }).length;
    const shown = useful.filter(function (item) { return item.level === 2 || h3 <= 24; });
    if (!shown.length) {
      toc.hidden = true;
      toc.innerHTML = "";
      shell.classList.add("toc-off");
      return;
    }
    shell.classList.remove("toc-off");
    toc.hidden = false;
    toc.innerHTML = "<p>Bu sayfada</p>" + shown.map(function (item) {
      return '<a class="h' + item.level + '" href="' + escapeAttr(pageHref(readHash().path, item.id)) + '">' + escapeHtml(item.title) + "</a>";
    }).join("");
  }

  function renderHome() {
    document.title = "T-Soft dokümantasyon";
    toc.hidden = true;
    toc.innerHTML = "";
    shell.classList.add("toc-off");
    main.innerHTML = [
      '<article class="doc">',
      '<p class="kicker">T-Soft</p>',
      "<h1>Dokümantasyon ve örnekler</h1>",
      '<p class="lead">Geliştirici platformu, REST1 kataloğu, örnek kod ve vitrin blokları. Mağaza parolası ve üye verisi yoktur.</p>',
      '<div class="cards">',
      card("developer/baslarken.md", "Başlarken", "T-SOFT360 hesabı, partner paneli ve tsoft-cli"),
      card("developer/tema.md", "Tema motoru", "Twig section, Tailwind ve CLI"),
      card("developer/storefront-api.md", "Storefront API", "/api/v3/storefront/2026-01"),
      card("tsoft.rest.md", "REST1 notları", "Panel web servisi metot kataloğu"),
      card("examples/python/tsoft_client.py", "Örnek kod", "Python istemci, üye ekleme, Apps Script"),
      card("theme/TSoft Block Codes/ust.html", "Tema blokları", "Blok HTML, değişken JSON ve şablonlar"),
      "</div>",
      '<p class="foot-note">Kod bloklarındaki Kopyala düğmesi yalnız kodu alır. Arama; başlık, metot adı ve dosya içeriğinde çalışır. Tema örnekleri GPL-3.0 ile lisanslıdır.</p>',
      "</article>"
    ].join("");
    markCurrent("");
  }

  function card(path, title, text) {
    return '<a class="card" href="' + escapeAttr(pageHref(path)) + '"><strong>' + escapeHtml(title) + "</strong><span>" + escapeHtml(text) + "</span></a>";
  }

  function renderPage(page, record, anchor) {
    document.title = page.title + " · T-Soft dokümantasyon";
    const kicker = '<p class="kicker">' + escapeHtml(page.group) + "</p>";
    if (page.kind === "md") {
      main.innerHTML = '<article class="doc">' + kicker + record.html + '<p class="foot-note">Tema örnekleri GPL-3.0 ile lisanslıdır.</p></article>';
      renderToc(record.headings);
    } else {
      toc.hidden = true;
      toc.innerHTML = "";
      shell.classList.add("toc-off");
      main.innerHTML = '<article class="doc">' + kicker + "<h1>" + escapeHtml(page.title) + "</h1>" +
        '<p class="filepath">' + escapeHtml(page.path) + "</p>" +
        codeBlock(record.text, page.lang) +
        '<p class="foot-note">Tema örnekleri GPL-3.0 ile lisanslıdır.</p></article>';
    }
    markCurrent(page.path);
    if (anchor) scrollToAnchor(anchor);
    else {
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  function scrollToAnchor(id) {
    const go = function () {
      const target = document.getElementById(id);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo(0, Math.max(0, top));
    };
    go();
    requestAnimationFrame(go);
  }

  function markCurrent(path) {
    navBody.querySelectorAll(".nav-link").forEach(function (link) {
      if (link.getAttribute("data-path") === path) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function load(path) {
    if (cache.has(path)) return Promise.resolve(cache.get(path));
    if (inflight.has(path)) return inflight.get(path);
    const page = byPath.get(path);
    const job = fetch(fileUrl(path)).then(function (response) {
      if (!response.ok) throw new Error(String(response.status));
      return response.text();
    }).then(function (text) {
      const record = page.kind === "md"
        ? Object.assign({ text: text }, parseDoc(text, path))
        : { text: text, html: "", headings: [], sections: [{ id: "", level: 1, title: page.title, text: text }] };
      cache.set(path, record);
      indexReady += 1;
      if (q.value.trim()) renderResults(q.value.trim());
      return record;
    }).catch(function (error) {
      inflight.delete(path);
      throw error;
    });
    inflight.set(path, job);
    return job;
  }

  async function show(path, anchor) {
    const seq = ++openSeq;
    closeNav();
    if (!path) {
      renderHome();
      return;
    }
    const page = byPath.get(path);
    if (!page) {
      main.innerHTML = '<article class="doc"><h1>Sayfa yok</h1><p>Bu adres doküman listesinde durmuyor.</p></article>';
      return;
    }
    main.innerHTML = '<p class="loading">Yükleniyor…</p>';
    try {
      const record = await load(path);
      if (seq !== openSeq) return;
      renderPage(page, record, anchor);
    } catch (error) {
      if (seq !== openSeq) return;
      main.innerHTML = '<article class="doc"><h1>Dosya açılmadı</h1><p>' + escapeHtml(page.path) + " okunamadı.</p></article>";
    }
  }

  function renderNav() {
    const query = q.value.trim();
    if (query) {
      renderResults(query);
      return;
    }
    status.textContent = "";
    const groups = [];
    PAGES.forEach(function (page) {
      if (!groups.length || groups[groups.length - 1].name !== page.group) {
        groups.push({ name: page.group, pages: [] });
      }
      groups[groups.length - 1].pages.push(page);
    });
    navBody.innerHTML = groups.map(function (group) {
      return '<div class="group"><p class="group-title">' + escapeHtml(group.name) + "</p>" +
        group.pages.map(function (page) {
          const current = readHash().path === page.path ? ' aria-current="page"' : "";
          return '<a class="nav-link" data-path="' + escapeAttr(page.path) + '" href="' + escapeAttr(pageHref(page.path)) + '"' + current + ">" + escapeHtml(page.title) + "</a>";
        }).join("") + "</div>";
    }).join("");
  }

  function snippet(text, query) {
    const hay = fold(text);
    const needle = fold(query);
    const at = hay.indexOf(needle);
    if (at < 0) return "";
    const start = Math.max(0, at - 42);
    const end = Math.min(text.length, at + query.length + 72);
    return ((start ? "…" : "") + text.slice(start, end).replace(/[`*_]/g, "").replace(/\s+/g, " ").trim() + (end < text.length ? "…" : ""));
  }

  function renderResults(query) {
    const needle = fold(query);
    const hits = [];
    PAGES.forEach(function (page) {
      if (fold(page.title).includes(needle) || fold(page.path).includes(needle)) {
        hits.push({ page: page, title: page.title, anchor: "", snip: page.path, rank: 0 });
      }
      const record = cache.get(page.path);
      if (!record) return;
      record.sections.forEach(function (section) {
        const inTitle = fold(section.title).includes(needle);
        const inBody = fold(section.text).includes(needle);
        if (!inTitle && !inBody) return;
        if (inTitle && fold(section.title) === fold(page.title)) return;
        hits.push({
          page: page,
          title: section.title || page.title,
          anchor: section.id,
          snip: inBody ? snippet(section.text, query) : page.title,
          rank: inTitle ? 1 : 2
        });
      });
    });
    hits.sort(function (a, b) { return a.rank - b.rank; });
    const shown = hits.slice(0, 30);
    activeResult = 0;
    const pending = PAGES.length - indexReady;
    status.textContent = shown.length + " sonuç" + (pending > 0 ? ", dizin sürüyor" : "");
    if (!shown.length) {
      navBody.innerHTML = '<p class="nav-note">' + (pending ? "Dizin hazırlanıyor…" : "Sonuç yok.") + "</p>";
      return;
    }
    const keep = window.scrollY;
    navBody.innerHTML = shown.map(function (hit, index) {
      return '<button type="button" class="result" data-path="' + escapeAttr(hit.page.path) + '" data-anchor="' + escapeAttr(hit.anchor) + '" aria-selected="' + (index === 0 ? "true" : "false") + '">' +
        '<span class="result-title">' + escapeHtml(hit.title) + "</span>" +
        '<span class="result-meta">' + escapeHtml(hit.page.group) + "</span>" +
        (hit.snip ? '<span class="result-snip">' + escapeHtml(hit.snip) + "</span>" : "") +
        "</button>";
    }).join("");
    if (keep) window.scrollTo(0, keep);
  }

  function moveResult(step) {
    const buttons = Array.from(navBody.querySelectorAll(".result"));
    if (!buttons.length) return;
    activeResult = (activeResult + step + buttons.length) % buttons.length;
    buttons.forEach(function (button, index) {
      button.setAttribute("aria-selected", index === activeResult ? "true" : "false");
    });
    buttons[activeResult].scrollIntoView({ block: "nearest" });
  }

  function openResult() {
    const buttons = navBody.querySelectorAll(".result");
    const button = buttons[activeResult] || buttons[0];
    if (!button) return;
    location.hash = pageHref(button.getAttribute("data-path"), button.getAttribute("data-anchor")).slice(1);
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    menu.setAttribute("aria-expanded", "false");
  }

  function watchToc() {
    if (tocObserver) tocObserver.disconnect();
    const links = Array.from(toc.querySelectorAll("a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const heads = links.map(function (link) {
      const id = new URLSearchParams(link.getAttribute("href").replace(/^#/, "")).get("h");
      return { link: link, el: id ? document.getElementById(id) : null };
    }).filter(function (item) { return item.el; });
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        heads.forEach(function (item) {
          item.link.classList.toggle("active", item.el === entry.target);
        });
      });
    }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
    heads.forEach(function (item) { tocObserver.observe(item.el); });
  }

  document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    openResult();
  });
  q.addEventListener("input", function () {
    activeResult = 0;
    renderNav();
  });
  q.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") { event.preventDefault(); moveResult(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); moveResult(-1); }
    else if (event.key === "Escape") { q.value = ""; renderNav(); }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "/" && document.activeElement !== q) {
      event.preventDefault();
      q.focus();
    }
  });
  menu.addEventListener("click", function () {
    const open = document.body.classList.toggle("nav-open");
    menu.setAttribute("aria-expanded", open ? "true" : "false");
  });
  backdrop.addEventListener("click", closeNav);
  navBody.addEventListener("click", function (event) {
    const button = event.target.closest(".result");
    if (!button) return;
    location.hash = pageHref(button.getAttribute("data-path"), button.getAttribute("data-anchor")).slice(1);
  });
  document.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const code = button.closest(".code").querySelector("code");
    const text = code ? code.textContent : "";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }
      button.textContent = "Kopyalandı";
      button.classList.add("copied");
      setTimeout(function () {
        button.textContent = "Kopyala";
        button.classList.remove("copied");
      }, 1400);
    } catch (error) {
      button.textContent = "Kopyalanamadı";
    }
  });

  window.addEventListener("hashchange", function () {
    const place = readHash();
    show(place.path, place.anchor).then(watchToc);
    if (!q.value.trim()) renderNav();
  });

  const start = readHash();
  renderNav();
  show(start.path, start.anchor).then(watchToc);
  PAGES.forEach(function (page) { load(page.path).catch(function () { indexReady += 1; }); });
})();
