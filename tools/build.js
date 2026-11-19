// content/ (elle yazılmış Markdown ve örnek dosyalar) → docs/ (GitHub Pages)
// Her Markdown sayfası iki biçimde yazılır: /yol/index.html (insanlar için) ve /yol.md (LLM'ler için).
// Örnek kod ve tema dosyaları ham hâliyle kopyalanır, ayrıca vurgulanmış bir görüntüleme sayfası alır.
// Ayrıca llms.txt, llms-full.txt, search-index.json, sitemap.xml, robots.txt ve 404.html üretilir.
// Kırık iç bağlantı ya da çapa varsa derleme hata verir.

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const OUT = path.join(ROOT, 'docs');
const SITE = {
  name: 'T-Soft Dokümantasyonu',
  url: 'https://tsoft.bahadirdogru.com',
  domain: 'tsoft.bahadirdogru.com',
  repo: 'https://github.com/bahadirdogru/tsoft-documentation-examples',
  description: "T-Soft e-ticaret altyapısı için REST1 web servisi, Admin API v3, uygulama platformu, Storefront API ve Twig/Smarty tema kodlama başvuru dokümantasyonu. İnsanlar ve LLM'ler için.",
};

// ---------------------------------------------------------------- yardımcılar

// Başlık çapaları Türkçe harfleri korur (eski sitedeki #p=...&h=... adresleriyle uyumlu).
const slugify = s => String(s).trim().replace(/İ/g, 'i').replace(/I/g, 'i').toLowerCase()
  .replace(/<[^>]+>/g, '').replace(/[`*_]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const read = rel => fs.readFileSync(path.join(CONTENT, rel), 'utf8').replace(/\r\n/g, '\n');
const encPath = p => p.split('/').map(encodeURIComponent).join('/');

function write(rel, data) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
}

function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: src.slice(m[0].length) };
}

// index.md → / ; rest/README.md → /rest/ ; rest/customer.md → /rest/customer/
// theme/bloklar/ust.html → /theme/bloklar/ust/ (ham dosya /theme/bloklar/ust.html)
function urlOf(src) {
  if (src === 'index.md') return '/';
  const dir = path.posix.dirname(src);
  const base = path.posix.basename(src);
  const prefix = dir === '.' ? '/' : '/' + dir + '/';
  if (base === 'README.md') return prefix;
  return prefix + base.replace(/^\./, '').replace(/\.[^.]+$/, '').toLowerCase() + '/';
}
// Markdown kopyası: sondaki "/" yerine ".md". /rest/ → rest.md ; /rest/customer/ → rest/customer.md ; / → index.md
const mdPathOf = url => url === '/' ? 'index.md' : url.slice(1, -1) + '.md';

// Kod bloğu dili → highlight.js dili
const HL = { smarty: 'xml', html: 'xml', tpl: 'xml', js: 'javascript', ts: 'typescript', gs: 'javascript', sh: 'bash', text: 'plaintext', txt: 'plaintext', env: 'bash' };
const LANG_NAME = { python: 'Python', bash: 'Bash', javascript: 'JavaScript', json: 'JSON', smarty: 'Smarty', twig: 'Twig', php: 'PHP', http: 'HTTP' };

// ---------------------------------------------------------------- sayfalar

const NAV = JSON.parse(read('_nav.json'));
const pages = new Map(); // url → {url, src, title, description, body(md), kind: 'page'|'file', group}
const bySrc = new Map();
const errors = [];

for (const sec of NAV) {
  sec.items = sec.items.map(item => {
    const src = typeof item === 'string' ? item : item.path;
    if (!fs.existsSync(path.join(CONTENT, src))) { errors.push(`_nav.json: dosya yok ${src}`); return null; }
    const url = urlOf(src);
    if (pages.has(url)) errors.push(`_nav.json: iki dosya aynı adrese düşüyor ${url}`);
    let page;
    if (src.endsWith('.md')) {
      const { meta, body } = parseFrontMatter(read(src));
      page = { url, src, title: meta.title || src, description: meta.description || '', body, kind: 'page', group: sec.title };
    } else {
      const lang = item.lang || path.extname(src).slice(1);
      const code = read(src);
      const fence = '`'.repeat(Math.max(3, ...(code.match(/`{3,}/g) || []).map(s => s.length + 1)));
      const body = `# ${item.title}\n\n${item.description ? item.description + '\n\n' : ''}` +
        `Dosya: \`${src}\` · [Ham dosya](/${encPath(src)}) · ${LANG_NAME[lang] || lang.toUpperCase()}\n\n` +
        `${fence}${lang}\n${code.replace(/\n$/, '')}\n${fence}\n`;
      page = { url, src, title: item.title, description: item.description || '', body, kind: 'file', group: sec.title };
    }
    pages.set(url, page);
    bySrc.set(src, page);
    return url;
  }).filter(Boolean);
}

// Navigasyonda olmayan Markdown kalmasın.
const walk = dir => fs.readdirSync(path.join(CONTENT, dir), { withFileTypes: true }).flatMap(d => {
  const rel = dir ? dir + '/' + d.name : d.name;
  return d.isDirectory() ? walk(rel) : [rel];
});
const allFiles = walk('');
for (const f of allFiles) if (f.endsWith('.md') && !bySrc.has(f)) errors.push(`_nav.json'da olmayan Markdown: content/${f}`);

const order = NAV.flatMap(s => s.items);

// ---------------------------------------------------------------- navigasyon

function navHtml(current) {
  return NAV.map(sec => {
    const items = sec.items.map(u => `<li><a href="${u}"${u === current ? ' aria-current="page"' : ''}>${esc(pages.get(u).title)}</a></li>`).join('');
    const open = !sec.collapsed || sec.items.includes(current);
    return `<details class="nav-sec"${open ? ' open' : ''}><summary>${esc(sec.title)} <span class="count">${sec.items.length}</span></summary><ul>${items}</ul></details>`;
  }).join('');
}

// ---------------------------------------------------------------- render

const headingIds = new Map();
const pageIds = new Map();   // url → Set(id)
const pageHeads = new Map(); // url → [[başlık, id]] (h2-h3, arama için)
const anchorRefs = [];       // [fromUrl, toUrl, id]
let currentPage = null;

// Göreli bağlantıyı site adresine çevirir: customer.md#x → /rest/customer/#x ; snippets/a.tpl → /theme/snippets/a/
function resolveHref(href) {
  if (/^(https?:|mailto:)/.test(href)) return href;
  if (href.startsWith('#')) {
    anchorRefs.push([currentPage.url, currentPage.url, decodeURIComponent(href.slice(1))]);
    return href;
  }
  if (href.startsWith('/')) return href;
  const [p, hash] = href.split('#');
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(currentPage.src), decodeURIComponent(p)));
  const page = bySrc.get(target);
  if (page) {
    if (hash) anchorRefs.push([currentPage.url, page.url, decodeURIComponent(hash)]);
    return page.url + (hash ? '#' + hash : '');
  }
  if (allFiles.includes(target)) return '/' + encPath(target);
  errors.push(`content/${currentPage.src}: kırık bağlantı ${href}`);
  return href;
}

const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => {
  const base = slugify(raw) || 'bolum';
  const n = headingIds.get(base) || 0;
  headingIds.set(base, n + 1);
  const id = n ? `${base}-${n + 1}` : base;
  pageIds.get(currentPage.url).add(id);
  if (level === 2 || level === 3) pageHeads.get(currentPage.url).push([raw.replace(/[`*]/g, ''), id]);
  return `<h${level} id="${esc(id)}"><a class="anchor" href="#${esc(id)}" aria-hidden="true">#</a>${text}</h${level}>\n`;
};
renderer.code = (code, info) => {
  const lang = (info || '').trim().split(/\s+/)[0].toLowerCase();
  const hl = HL[lang] || lang || 'plaintext';
  return `<pre><code class="language-${esc(hl)}">${esc(code)}</code></pre>\n`;
};
renderer.table = (header, body) => `<div class="table-wrap"><table>\n<thead>\n${header}</thead>\n<tbody>${body}</tbody></table></div>\n`;
renderer.link = (href, title, text) => {
  const to = resolveHref(href);
  const ext = /^https?:/.test(to) && !to.startsWith(SITE.url);
  return `<a href="${esc(to)}"${title ? ` title="${esc(title)}"` : ''}${ext ? ' rel="noopener" target="_blank"' : ''}>${text}</a>`;
};
marked.use({ renderer, gfm: true });

function toc(html) {
  const hs = [...html.matchAll(/<h([23]) id="([^"]+)">(?:<a[^>]*>#<\/a>)?([\s\S]*?)<\/h\1>/g)];
  if (hs.length < 3) return '';
  return '<nav class="toc" aria-label="Bu sayfada"><div class="toc-title">Bu sayfada</div><ul>' +
    hs.map(h => `<li class="l${h[1]}"><a href="#${h[2]}">${h[3].replace(/<[^>]+>/g, '')}</a></li>`).join('') + '</ul></nav>';
}

function pager(p) {
  const i = order.indexOf(p.url);
  if (i < 0) return '';
  const prev = pages.get(order[i - 1]), next = pages.get(order[i + 1]);
  const link = (x, cls, label) => x ? `<a class="${cls}" href="${x.url}"><span>${label}</span>${esc(x.title)}</a>` : '<span></span>';
  return `<nav class="pager" aria-label="Sayfa geçişi">${link(prev, 'prev', '← Önceki')}${link(next, 'next', 'Sonraki →')}</nav>`;
}

function breadcrumbs(p) {
  if (p.url === '/') return '';
  const out = ['<a href="/">Ana sayfa</a>'];
  const parts = p.url.split('/').filter(Boolean);
  let acc = '/';
  for (let i = 0; i < parts.length - 1; i++) {
    acc += parts[i] + '/';
    const crumb = pages.get(acc);
    // "Genel bakış" tek başına belirsiz; grubun adını (REST1, Admin API v3) kullan.
    if (crumb) out.push(`<a href="${crumb.url}">${esc(crumb.title === 'Genel bakış' ? crumb.group : crumb.title)}</a>`);
  }
  // Yolda üst sayfa yoksa (REST1 modülü gibi) menü grubunu göster.
  if (out.length === 1 && p.group && p.group !== 'Başlangıç') out.push(`<span class="grp">${esc(p.group)}</span>`);
  return `<nav class="crumbs" aria-label="Konum">${out.join(' <span>/</span> ')}</nav>`;
}

const ICON = `<svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><rect width="32" height="32" rx="7" fill="currentColor"/><path d="M8 9h16v3.2h-6.4V23h-3.2V12.2H8z" fill="var(--bg)"/></svg>`;
const FAVICON = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1f6feb"/><path d="M8 9h16v3.2h-6.4V23h-3.2V12.2H8z" fill="#fff"/></svg>`);
const HLJS = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0';

function pageHtml(p, content) {
  const isFile = p.kind === 'file';
  const altUrl = isFile ? '/' + encPath(p.src) : '/' + mdPathOf(p.url);
  const title = p.url === '/' ? SITE.name : `${p.title} · ${SITE.name}`;
  const edit = p.src ? `<a href="${SITE.repo}/edit/main/content/${encPath(p.src)}">GitHub'da düzenle</a> · ` : '';
  const alt = p.url === '/404/' ? '' : `<a href="${altUrl}">${isFile ? 'Ham dosya' : 'Markdown'}</a> · `;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description || SITE.description)}">
<link rel="canonical" href="${SITE.url}${p.url}">
${isFile ? '' : `<link rel="alternate" type="text/markdown" href="${altUrl}" title="Markdown">\n`}<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<link rel="icon" href="${FAVICON}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description || SITE.description)}">
<meta property="og:url" content="${SITE.url}${p.url}">
<meta property="og:type" content="website">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="${HLJS}/styles/github.min.css" media="(prefers-color-scheme: light)" id="hl-light">
<link rel="stylesheet" href="${HLJS}/styles/github-dark.min.css" media="(prefers-color-scheme: dark)" id="hl-dark">
</head>
<body>
<a class="skip" href="#main">İçeriğe geç</a>
<header class="top">
  <button class="menu-btn" aria-label="Menü" aria-expanded="false" aria-controls="sidebar">☰</button>
  <a class="brand" href="/">${ICON}<span>${SITE.name}</span></a>
  <div class="search">
    <input id="q" type="search" placeholder="Ara: metot, uç, değişken, sayfa…  ( / )" autocomplete="off" aria-label="Ara">
    <ul id="results" role="listbox" hidden></ul>
  </div>
  <button class="theme-btn" aria-label="Tema değiştir" title="Tema değiştir">◐</button>
</header>
<div class="layout">
<aside id="sidebar" class="sidebar">${navHtml(p.url)}</aside>
<main id="main" class="content">
${breadcrumbs(p)}
<article>
${content}
</article>
${pager(p)}
<footer class="page-foot"><a href="https://bahadirdogru.com/">bahadirdogru.com</a> · ${edit}${alt}<a href="/llms.txt">llms.txt</a> · Topluluk belgesidir, T-Soft’un resmî yayını değildir.</footer>
</main>
${toc(content)}
</div>
<script src="${HLJS}/highlight.min.js"></script>
<script src="${HLJS}/languages/twig.min.js"></script>
<script src="${HLJS}/languages/http.min.js"></script>
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

function render(p) {
  currentPage = p;
  headingIds.clear();
  pageIds.set(p.url, new Set());
  pageHeads.set(p.url, []);
  return marked.parse(p.body);
}

// ---------------------------------------------------------------- çıktı

const rendered = new Map();
for (const p of pages.values()) rendered.set(p.url, render(p));
const notFound = { url: '/404/', title: 'Sayfa bulunamadı', description: '', body: '# Sayfa bulunamadı\n\nAradığınız sayfa yok ya da taşındı. Üstteki arama kutusunu deneyin ya da [ana sayfaya](/) dönün.\n', kind: 'page' };
const notFoundHtml = render(notFound);

for (const [from, to, id] of anchorRefs) {
  if (!pageIds.get(to)?.has(id)) errors.push(`${pages.get(from).src}: çapa yok ${to}#${id}`);
}
if (errors.length) {
  console.error(errors.map(e => '✗ ' + e).join('\n'));
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const p of pages.values()) {
  write(p.url.slice(1) + 'index.html', pageHtml(p, rendered.get(p.url)));
  if (p.kind !== 'page') continue;
  const md = `---\ntitle: ${p.title}\nurl: ${SITE.url}${p.url}\n---\n\n${p.body.trim()}\n`;
  write(mdPathOf(p.url), md);
  // Eski ham adresler (rest/README.md) çalışmaya devam etsin.
  if (p.src !== mdPathOf(p.url) && p.src !== 'index.md') write(p.src, md);
}
// Örnek ve tema dosyaları ham hâliyle
for (const f of allFiles) if (!f.endsWith('.md') && !f.startsWith('_')) {
  fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true });
  fs.copyFileSync(path.join(CONTENT, f), path.join(OUT, f));
}

// Statik varlıklar
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'assets'))) fs.copyFileSync(path.join(__dirname, 'assets', f), path.join(OUT, 'assets', f));

write('CNAME', SITE.domain + '\n');
write('.nojekyll', '');
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...pages.keys()].map(u => `<url><loc>${SITE.url}${u}</loc></url>`).join('\n') + '\n</urlset>\n');
write('404.html', pageHtml(notFound, notFoundHtml).replace(/<link rel="(canonical|alternate)" type="text\/markdown"[^>]*>\n|<link rel="canonical"[^>]*>\n/g, ''));

// Arama dizini. s: kaynak yol (eski #p= adreslerini yönlendirmek için); h/a: alt başlıklar ve çapaları.
const searchIndex = [...pages.values()].map(p => {
  const heads = p.kind === 'page' ? pageHeads.get(p.url) : [];
  return { t: p.title, u: p.url, d: p.description, k: p.kind === 'file' ? 'dosya' : 'sayfa', g: p.group, s: p.src,
    h: heads.map(x => x[0]).join(' | '), a: heads.map(x => x[1]).join('|') };
});
write('search-index.json', JSON.stringify(searchIndex));

// llms.txt (https://llmstxt.org) ve llms-full.txt
const rawUrl = p => SITE.url + '/' + (p.kind === 'file' ? encPath(p.src) : mdPathOf(p.url));
const llmsSections = NAV.map(sec => `## ${sec.title}\n\n` + sec.items.map(u => {
  const p = pages.get(u);
  return `- [${p.title}](${rawUrl(p)})${p.description ? ': ' + p.description : ''}`;
}).join('\n')).join('\n\n');
write('llms.txt', `# ${SITE.name}

> ${SITE.description} Topluluk belgesidir; T-Soft’un resmî yayını değildir. Resmî kaynak: https://developer.tsoft.com.tr/

Önemli ayrımlar:
- REST1 \`https://<mağaza>/rest1/{modul}/{metot}/\` adresine form gövdesi ve \`token\` ile POST edilir; alan adları PascalCase'dir.
- Panel iç API'si \`https://<mağaza>/api/v3/admin/...\` Laravel JSON döner, panel oturum token'ı ister; alanlar camelCase'dir.
- Uygulama Admin API'si \`.../api/v3/admin/2026-01/...\` JSON:API'dir ve OAuth token'ı ister.
- Örneklerde mağaza adresi \`magaza.example\` yer tutucusudur. Gözlenmemiş davranışlar sayfalarda "gözlenmedi" diye işaretlidir.
- Her sayfanın Markdown hâli, HTML adresindeki son "/" yerine ".md" konarak alınır (ör. ${SITE.url}/rest/customer.md).

${llmsSections}

## Optional

- [Tam metin (llms-full.txt)](${SITE.url}/llms-full.txt): tüm Markdown sayfaları tek dosyada
`);

const full = `# ${SITE.name} — tam metin\n\n> ${SITE.description}\n> Kaynak: ${SITE.url}. Her sayfa \`<!-- adres -->\` satırıyla başlar; göreli bağlantılar o sayfanın Markdown yoluna göre çözülür.\n\n` +
  order.map(u => pages.get(u)).filter(p => p.kind === 'page')
    .map(p => `<!-- ${SITE.url}${p.url} · ${p.src} -->\n${p.body.trim()}\n`).join('\n\n---\n\n');
write('llms-full.txt', full);

console.log(`${pages.size} sayfa üretildi (${[...pages.values()].filter(p => p.kind === 'page').length} Markdown), llms-full.txt ${Math.round(full.length / 1024)} KB → ${path.relative(ROOT, OUT)}/`);
