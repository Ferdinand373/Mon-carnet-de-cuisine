const CACHE_NAME = 'mon-carnet-cuisine-v2-3-final-r2';
const CORE_FILES = ['./', './index.html', './mon-carnet-v17.png'];

const OPEN_DB_REPLACEMENT = "      function openDbAttempt(useConfiguredVersion = true) {\n        return new Promise((resolve, reject) => {\n          if (!('indexedDB' in window)) {\n            reject(new Error('IndexedDB n’est pas disponible dans ce navigateur.'));\n            return;\n          }\n\n          let settled = false;\n          let request;\n          const finish = (callback, value) => {\n            if (settled) return;\n            settled = true;\n            clearTimeout(timeoutId);\n            callback(value);\n          };\n          const timeoutId = window.setTimeout(() => {\n            finish(reject, new Error('Le stockage local met trop de temps à répondre.'));\n          }, 10000);\n\n          try {\n            request = useConfiguredVersion ? indexedDB.open(DB_NAME, DB_VERSION) : indexedDB.open(DB_NAME);\n          } catch (error) {\n            finish(reject, error);\n            return;\n          }\n\n          request.onupgradeneeded = event => {\n            const database = event.target.result;\n            if (!database.objectStoreNames.contains('recipes')) database.createObjectStore('recipes', { keyPath: 'id' });\n            if (!database.objectStoreNames.contains('plans')) database.createObjectStore('plans', { keyPath: 'id' });\n            if (!database.objectStoreNames.contains('settings')) database.createObjectStore('settings', { keyPath: 'key' });\n          };\n          request.onsuccess = () => {\n            const openedDb = request.result;\n            if (settled) {\n              openedDb.close();\n              return;\n            }\n            db = openedDb;\n            db.onversionchange = () => {\n              try { db.close(); } catch (_) {}\n            };\n            finish(resolve, db);\n          };\n          request.onerror = () => finish(reject, request.error || new Error('Impossible d’ouvrir le stockage local.'));\n          request.onblocked = () => {\n            try { if (db) db.close(); } catch (_) {}\n          };\n        });\n      }\n\n      async function openDb() {\n        let lastError = null;\n        for (let attempt = 0; attempt < 3; attempt += 1) {\n          try {\n            return await openDbAttempt(true);\n          } catch (error) {\n            lastError = error;\n            if (error && error.name === 'VersionError') {\n              return openDbAttempt(false);\n            }\n            if (attempt < 2) await new Promise(resolve => window.setTimeout(resolve, 450 * (attempt + 1)));\n          }\n        }\n        throw lastError || new Error('Impossible d’ouvrir le stockage local.');\n      }";
const INIT_ERROR_REPLACEMENT = "        } catch (err) {\n          console.error(err);\n          const repairKey = 'mon-carnet-idb-repair-v2.3-final-2';\n          let repairAlreadyTried = false;\n          try { repairAlreadyTried = sessionStorage.getItem(repairKey) === '1'; } catch (_) {}\n\n          if (location.protocol !== 'file:' && !repairAlreadyTried) {\n            try { sessionStorage.setItem(repairKey, '1'); } catch (_) {}\n            try {\n              if ('caches' in window) {\n                const names = await caches.keys();\n                await Promise.all(names.filter(name => name.startsWith('mon-carnet-cuisine-')).map(name => caches.delete(name)));\n              }\n              if ('serviceWorker' in navigator) {\n                const registration = await navigator.serviceWorker.getRegistration();\n                if (registration) await registration.update();\n              }\n            } catch (_) {}\n            const freshUrl = new URL(window.location.href);\n            freshUrl.searchParams.set('mc-repair', '2');\n            window.location.replace(freshUrl.href);\n            return;\n          }\n\n          try { sessionStorage.removeItem(repairKey); } catch (_) {}\n          const message = esc(err && err.message ? err.message : 'Erreur inconnue');\n          document.body.innerHTML = `<main style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:0 auto;padding:calc(32px + env(safe-area-inset-top,0px)) 24px 40px;color:#17211e\"><h1 style=\"font-size:34px;line-height:1.08;margin:0 0 24px\">Mon carnet de cuisine</h1><p style=\"font-size:19px;line-height:1.5\">Le stockage de l’iPhone n’a pas répondu. Une réparation automatique a été tentée sans effacer les recettes.</p><div style=\"display:flex;flex-wrap:wrap;gap:10px;margin:24px 0\"><button type=\"button\" onclick=\"location.reload()\" style=\"border:0;border-radius:14px;padding:13px 17px;background:#153c35;color:white;font-weight:700\">Réessayer</button><button type=\"button\" onclick=\"window.open(location.href,'_blank')\" style=\"border:1px solid rgba(23,33,30,.18);border-radius:14px;padding:13px 17px;background:#fffdf8;color:#153c35;font-weight:700\">Ouvrir dans Safari</button></div><p style=\"font-size:14px;color:#68736f\">Aucune recette n’a été supprimée.</p><pre style=\"white-space:pre-wrap;overflow-wrap:anywhere;padding:12px;border-radius:12px;background:#ede4d5;font-size:12px\">${message}</pre></main>`;\n        }\n      }";

function patchIndexHtml(source) {
  let html = String(source || '');

  const openDbPattern = /      function openDb\(\) \{[\s\S]*?\n      \}\n\n      function tx\(/;
  if (openDbPattern.test(html)) {
    html = html.replace(openDbPattern, `${OPEN_DB_REPLACEMENT}\n\n      function tx(`);
  }

  const initErrorPattern = /        \} catch \(err\) \{\n          console\.error\(err\);\n          document\.body\.innerHTML = `<main[\s\S]*?<\/main>`;\n        \}\n      \}\n\n      document\.addEventListener\('visibilitychange'/;
  if (initErrorPattern.test(html)) {
    html = html.replace(initErrorPattern, `${INIT_ERROR_REPLACEMENT}\n\n      document.addEventListener('visibilitychange'`);
  }

  html = html.replace(
    "navigator.serviceWorker.register('./sw.js?v=2.3-final-1').then(registration => registration.update()).catch(() => {});",
    "navigator.serviceWorker.register('./sw.js?v=2.3-final-2').then(registration => registration.update()).catch(() => {});"
  );

  const successMarker = "          bindEvents(); renderAll();\n";
  const successReplacement = "          bindEvents(); renderAll();\n          try { sessionStorage.removeItem('mon-carnet-idb-repair-v2.3-final-2'); } catch (_) {}\n";
  if (html.includes(successMarker) && !html.includes("sessionStorage.removeItem('mon-carnet-idb-repair-v2.3-final-2')")) {
    html = html.replace(successMarker, successReplacement);
  }

  return html;
}

async function patchedIndexResponse(response) {
  const source = await response.text();
  const patched = patchIndexHtml(source);
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'no-cache');
  headers.delete('content-length');
  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function fetchPatchedIndex(request = './index.html') {
  const response = await fetch(request, { cache: 'no-store' });
  if (!response.ok) return response;
  return patchedIndexResponse(response);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const indexResponse = await fetchPatchedIndex('./index.html');
      if (indexResponse.ok) {
        await cache.put('./index.html', indexResponse.clone());
        await cache.put('./', indexResponse.clone());
      }
    } catch (_) {}

    try {
      const iconResponse = await fetch(new Request('./mon-carnet-v17.png', { cache: 'reload' }));
      if (iconResponse.ok) await cache.put('./mon-carnet-v17.png', iconResponse.clone());
    } catch (_) {}

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

  const isIndex = request.mode === 'navigate' || /\/index\.html$/.test(url.pathname);
  if (isIndex) {
    event.respondWith((async () => {
      try {
        const response = await fetchPatchedIndex(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', response.clone());
          await cache.put('./', response.clone());
        }
        return response;
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
