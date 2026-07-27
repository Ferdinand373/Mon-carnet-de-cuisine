const CACHE_NAME = 'mon-carnet-v2-3-6-stable';
const APP_SHELL = ['./', './index.html', './mon-carnet-v17.png', './stabilisation-v236.js'];
const PATCH_SCRIPT = '<script src="./stabilisation-v236.js?v=236" defer></script>';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(APP_SHELL.map(url => cache.add(url).catch(() => null)))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isHtmlRequest(request) {
  const url = new URL(request.url);
  return request.mode === 'navigate' ||
    (url.origin === self.location.origin && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')));
}

async function injectStabilisation(response) {
  if (!response) return response;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  if (!html.includes('stabilisation-v236.js')) {
    html = html.includes('</body>')
      ? html.replace('</body>', `${PATCH_SCRIPT}</body>`)
      : `${html}${PATCH_SCRIPT}`;
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('cache-control', 'no-cache');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch (_) {
    return (await cache.match(request)) || (await caches.match(request));
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (isHtmlRequest(event.request)) {
    event.respondWith((async () => {
      const response = await networkFirst(event.request) || await caches.match('./index.html');
      return injectStabilisation(response);
    })());
    return;
  }

  event.respondWith(networkFirst(event.request));
});
