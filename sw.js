const CACHE_NAME = 'mon-carnet-cuisine-v2-2-final-purchase-units-r3';
const CORE_FILES = ['./', './index.html', './mon-carnet-v17.png'];

const PURCHASE_UNIT_PATCH = `
<script>
(() => {
  'use strict';

  const foldPurchaseText = value => String(value == null ? '' : value)
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/œ/g, 'oe')
    .toLowerCase()
    .replace(/\\s+/g, ' ')
    .trim();

  function purchasePackageLine(line) {
    const folded = foldPurchaseText(line);

    if (/\\bketchup\\b/.test(folded)) return '1 flacon de ketchup';
    if (/\\bcapres?\\b/.test(folded)) return '1 pot de câpres';
    if (/\\bmoutarde\\b/.test(folded)) return '1 pot de moutarde';
    if (/\\bmayonnaise\\b|\\bmayo\\b/.test(folded)) return '1 pot de mayonnaise';
    if (/\\bconcentre de tomates?\\b/.test(folded)) return '1 tube de concentré de tomates';
    if (/\\bpesto\\b/.test(folded)) return '1 pot de pesto';
    if (/\\bcornichons?\\b/.test(folded)) return '1 bocal de cornichons';
    if (/\\bolives?\\b/.test(folded)) return '1 bocal d’olives';
    if (/\\bjus de veau\\b/.test(folded)) return '1 pot de jus de veau';
    if (/\\bfond de (?:veau|volaille|boeuf)\\b/.test(folded)) {
      const kind = folded.match(/fond de (veau|volaille|boeuf)/)?.[1] || 'veau';
      return '1 pot de fond de ' + (kind === 'boeuf' ? 'bœuf' : kind);
    }
    if (/\\bcreme fraiche\\b/.test(folded)) return '1 pot de crème fraîche';
    if (/\\bcreme liquide\\b|\\bcreme entiere\\b/.test(folded)) return '1 brique de crème liquide';
    if (/\\b\\d+(?:[.,]\\d+)?\\s*(?:ml|cl|l)\\b/.test(folded) && /\\bcreme\\b/.test(folded)) return '1 brique de crème';

    const countables = [
      { pattern: /\\bcitrons? verts?\\b/, one: 'citron vert', many: 'citrons verts' },
      { pattern: /\\bcitrons?\\b/, one: 'citron', many: 'citrons' },
      { pattern: /\\boignons? rouges?\\b/, one: 'oignon rouge', many: 'oignons rouges' },
      { pattern: /\\boignons?\\b/, one: 'oignon', many: 'oignons' },
      { pattern: /\\bechalotes?\\b/, one: 'échalote', many: 'échalotes' },
      { pattern: /\\bpoivrons?\\b/, one: 'poivron', many: 'poivrons' },
      { pattern: /\\bconcombres?\\b/, one: 'concombre', many: 'concombres' },
      { pattern: /\\bcourgettes?\\b/, one: 'courgette', many: 'courgettes' },
      { pattern: /\\baubergines?\\b/, one: 'aubergine', many: 'aubergines' },
      { pattern: /\\bavocats?\\b/, one: 'avocat', many: 'avocats' },
      { pattern: /\\boranges?\\b/, one: 'orange', many: 'oranges' },
      { pattern: /\\bpommes?\\b/, one: 'pomme', many: 'pommes' }
    ];

    const normalized = String(line || '')
      .replace(/½/g, '1/2')
      .replace(/¼/g, '1/4')
      .replace(/¾/g, '3/4')
      .replace(/⅓/g, '1/3')
      .replace(/⅔/g, '2/3');
    const normalizedFolded = foldPurchaseText(normalized);

    for (const item of countables) {
      if (!item.pattern.test(normalizedFolded)) continue;

      if (new RegExp('\\bdemi[- ]' + item.one.replace(/ /g, '[- ]') + 's?\\b').test(normalizedFolded)) {
        return '1 ' + item.one;
      }

      const amountMatch = normalizedFolded.match(/(?:^|\\b(?:jus|zeste)\\s+d(?:e|un|une|\\x27)\\s*)(\\d+\\s*\\/\\s*\\d+|\\d+(?:[.,]\\d+)?)\\s+(?=[a-zà-ÿ])/i);
      if (!amountMatch) return line;

      const token = amountMatch[1].replace(/\\s/g, '').replace(',', '.');
      let amount = 0;
      if (token.includes('/')) {
        const parts = token.split('/').map(Number);
        amount = parts[1] ? parts[0] / parts[1] : 0;
      } else {
        amount = Number(token) || 0;
      }

      if (amount > 0 && !Number.isInteger(amount)) {
        const rounded = Math.ceil(amount);
        return rounded + ' ' + (rounded > 1 ? item.many : item.one);
      }
      return line;
    }

    return line;
  }

  function normalizePurchaseList(text) {
    const packageKeys = new Set();
    const result = [];

    String(text || '').split(/\\r?\\n/).forEach(rawLine => {
      const trimmed = rawLine.trim();
      if (!trimmed) return;
      const converted = purchasePackageLine(trimmed);
      const folded = foldPurchaseText(converted);
      const isPackage = /^1 (?:flacon|pot|tube|bocal|brique) d?(?:e |’)/.test(folded);
      if (isPackage) {
        const key = folded.replace(/^1 (?:flacon|pot|tube|bocal|brique) d?(?:e |’)/, '');
        if (packageKeys.has(key)) return;
        packageKeys.add(key);
      }
      result.push(converted);
    });

    return result.join('\\n');
  }

  function applyPurchaseUnits() {
    const textarea = document.getElementById('clairText');
    if (!textarea || !textarea.value.trim()) return;
    const corrected = normalizePurchaseList(textarea.value);
    if (corrected !== textarea.value) {
      textarea.value = corrected;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  document.addEventListener('click', event => {
    if (event.target.closest('#copyClairBtn')) applyPurchaseUnits();
  }, true);
  document.addEventListener('focusin', event => {
    if (event.target?.id === 'clairText') applyPurchaseUnits();
  });
  new MutationObserver(() => setTimeout(applyPurchaseUnits, 0))
    .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  window.addEventListener('load', applyPurchaseUnits);
})();
<\/script>`;

async function patchHtmlResponse(response) {
  if (!response || !response.ok) return response;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  if (html.includes('foldPurchaseText')) {
    return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
  }

  const patched = /<\/body>/i.test(html)
    ? html.replace(/<\/body>/i, PURCHASE_UNIT_PATCH + '\\n</body>')
    : html + PURCHASE_UNIT_PATCH;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('cache-control', 'no-store');
  return new Response(patched, { status: response.status, statusText: response.statusText, headers });
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const path of CORE_FILES) {
      try {
        const response = await fetch(new Request(path, { cache: 'reload' }));
        if (!response.ok) continue;
        const stored = path === './' || path.endsWith('index.html')
          ? await patchHtmlResponse(response.clone())
          : response.clone();
        await cache.put(path, stored);
      } catch (_) {}
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter(name => name.startsWith('mon-carnet-cuisine-') && name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request, { cache: 'no-store' });
        const response = await patchHtmlResponse(networkResponse);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', response.clone());
          await cache.put('./', response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match(request))
          || (await caches.match('./index.html'))
          || (await caches.match('./'))
          || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
