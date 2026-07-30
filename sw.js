const CACHE_NAME = 'mon-carnet-cuisine-v2-2-1-zeste-r5';
const CORE_FILES = ['./mon-carnet-v17.png'];

function patchIndexHtml(html = '') {
  let patched = String(html || '');

  patched = patched
    .replace(
      '<title>Mon carnet de cuisine — V2.2 finale</title>',
      '<title>Mon carnet de cuisine — V2.2.1 corrigée</title>'
    )
    .replace(
      '<small>VERSION FINALE · V2.2</small>',
      '<small>VERSION CORRIGÉE · V2.2.1</small>'
    );

  const purchaseAnchor = "        if (/\\bketchup\\b/.test(folded)) return '1 flacon de ketchup';";
  const zestRules = [
    "        if (/\\bzestes?\\b.*\\bcitrons? verts?\\b|\\bcitrons? verts?\\b.*\\bzestes?\\b/.test(folded)) return '1 citron vert';",
    "        if (/\\bzestes?\\b.*\\bcitrons?\\b|\\bcitrons?\\b.*\\bzestes?\\b/.test(folded)) return '1 citron';"
  ].join('\n');

  if (!patched.includes("return '1 citron';\n        if (/\\bketchup\\b/") && patched.includes(purchaseAnchor)) {
    patched = patched.replace(purchaseAnchor, `${zestRules}\n${purchaseAnchor}`);
  }

  return patched;
}

async function patchedHtmlResponse(response) {
  if (!response || !response.ok) return response;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('cache-control', 'no-store');

  return new Response(patchIndexHtml(html), {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function cachePatchedIndex(cache) {
  try {
    const response = await fetch(new Request('./index.html', { cache: 'reload' }));
    const patched = await patchedHtmlResponse(response);
    if (patched && patched.ok) {
      await cache.put('./index.html', patched.clone());
      await cache.put('./', patched.clone());
    }
  } catch (_) {}
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cachePatchedIndex(cache);
    for (const path of CORE_FILES) {
      try {
        const response = await fetch(new Request(path, { cache: 'reload' }));
        if (response.ok) await cache.put(path, response.clone());
      } catch (_) {}
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('mon-carnet-cuisine-') && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
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
        const response = await fetch(request, { cache: 'no-store' });
        const patched = await patchedHtmlResponse(response);
        if (patched && patched.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', patched.clone());
          await cache.put('./', patched.clone());
        }
        return patched;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
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
