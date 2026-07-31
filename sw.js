const CACHE_NAME = 'mon-carnet-cuisine-v2-3-1';
const APP_SHELL = ['./', './index.html', './mon-carnet-v17.png'];

const OPEN_DB_REPLACEMENT = `      function openDatabaseSafely(name, version) {
        return new Promise((resolve, reject) => {
          if (!('indexedDB' in window)) {
            reject(new Error('IndexedDB n’est pas disponible sur cet appareil.'));
            return;
          }

          let settled = false;
          let request;
          const finish = (callback, value) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeoutId);
            callback(value);
          };
          const timeoutId = window.setTimeout(() => {
            finish(reject, new Error('Le stockage local ne répond pas.'));
          }, 12000);

          try {
            request = typeof version === 'number' ? indexedDB.open(name, version) : indexedDB.open(name);
          } catch (error) {
            finish(reject, error);
            return;
          }

          request.onupgradeneeded = event => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains('recipes')) database.createObjectStore('recipes', { keyPath: 'id' });
            if (!database.objectStoreNames.contains('plans')) database.createObjectStore('plans', { keyPath: 'id' });
            if (!database.objectStoreNames.contains('settings')) database.createObjectStore('settings', { keyPath: 'key' });
          };

          request.onsuccess = () => {
            const openedDb = request.result;
            if (settled) {
              try { openedDb.close(); } catch (_) {}
              return;
            }
            db = openedDb;
            db.onversionchange = () => {
              try { db.close(); } catch (_) {}
            };
            finish(resolve, db);
          };

          request.onerror = () => finish(reject, request.error || new Error('Impossible d’ouvrir le stockage local.'));
          request.onblocked = () => finish(reject, new Error('Le stockage local est momentanément bloqué.'));
        });
      }

      async function openDb() {
        let primaryError = null;
        try {
          window.__MC_STORAGE_MODE__ = 'primary';
          return await openDatabaseSafely(DB_NAME, DB_VERSION);
        } catch (error) {
          primaryError = error;
          console.warn('Stockage principal indisponible', error);
        }

        if (primaryError && primaryError.name === 'VersionError') {
          try {
            window.__MC_STORAGE_MODE__ = 'primary';
            return await openDatabaseSafely(DB_NAME);
          } catch (error) {
            primaryError = error;
          }
        }

        try {
          window.__MC_STORAGE_MODE__ = 'recovery';
          return await openDatabaseSafely(DB_NAME + '-secours-v231', 1);
        } catch (recoveryError) {
          const detail = recoveryError && recoveryError.message ? recoveryError.message : 'Erreur inconnue';
          throw new Error('Le stockage principal et le stockage de secours sont indisponibles : ' + detail);
        }
      }`;

const INIT_ERROR_REPLACEMENT = `        } catch (err) {
          console.error(err);
          const message = esc(err && err.message ? err.message : 'Erreur inconnue');
          document.body.innerHTML = \`<main style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:0 auto;padding:calc(32px + env(safe-area-inset-top,0px)) 24px 40px;color:#17211e"><h1 style="font-size:34px;line-height:1.08;margin:0 0 24px">Mon carnet de cuisine</h1><p style="font-size:19px;line-height:1.5">Le stockage de l’iPhone ne répond pas encore. La V2.3.1 n’efface aucune recette et ne recharge plus la page en boucle.</p><div style="display:flex;flex-wrap:wrap;gap:10px;margin:24px 0"><button type="button" onclick="location.reload()" style="border:0;border-radius:14px;padding:13px 17px;background:#153c35;color:white;font-weight:700">Réessayer</button><button type="button" onclick="window.open(location.href,'_blank')" style="border:1px solid rgba(23,33,30,.18);border-radius:14px;padding:13px 17px;background:#fffdf8;color:#153c35;font-weight:700">Ouvrir dans Safari</button></div><p style="font-size:14px;color:#68736f">Aucune donnée n’a été supprimée.</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere;padding:12px;border-radius:12px;background:#ede4d5;font-size:12px">\${message}</pre></main>\`;
        }
      }`;

function patchIndexHtml(source) {
  let html = String(source || '');

  html = html.replaceAll('V2.3 finale', 'V2.3.1');
  html = html.replaceAll('VERSION FINALE · V2.3', 'VERSION STABILISÉE · V2.3.1');
  html = html.replaceAll("navigator.serviceWorker.register('./sw.js?v=2.3-final-1')", "navigator.serviceWorker.register('./sw.js?v=2.3.1')");

  const openDbPattern = /      function openDb\(\) \{[\s\S]*?\n      \}\n\n      function tx\(/;
  if (openDbPattern.test(html)) {
    html = html.replace(openDbPattern, `${OPEN_DB_REPLACEMENT}\n\n      function tx(`);
  }

  html = html.replace(
    "        if (!settings.seeded && recipes.length === 0) await seedExamples();",
    "        if (!settings.seeded && recipes.length === 0 && window.__MC_STORAGE_MODE__ !== 'recovery') await seedExamples();"
  );

  const initErrorPattern = /        \} catch \(err\) \{\n          console\.error\(err\);\n          document\.body\.innerHTML = `<main[\s\S]*?<\/main>`;\n        \}\n      \}\n\n      document\.addEventListener\('visibilitychange'/;
  if (initErrorPattern.test(html)) {
    html = html.replace(initErrorPattern, `${INIT_ERROR_REPLACEMENT}\n\n      document.addEventListener('visibilitychange'`);
  }

  const successMarker = "          bindEvents(); renderAll();\n";
  const recoveryNotice = `          bindEvents(); renderAll();
          if (window.__MC_STORAGE_MODE__ === 'recovery') {
            const notice = document.createElement('div');
            notice.setAttribute('role', 'status');
            notice.style.cssText = 'margin:0 0 16px;padding:14px 16px;border-radius:16px;background:#fff4d8;border:1px solid #d7a94c;color:#5d4516;font-size:14px;line-height:1.45;box-shadow:0 8px 24px rgba(35,42,39,.08)';
            notice.innerHTML = '<strong>V2.3.1 — stockage de secours actif.</strong><br>Les recettes visibles dans Safari ne sont pas effacées. Faites une sauvegarde depuis Safari, puis restaurez-la ici dans Réglages.';
            const app = document.querySelector('.app');
            if (app) app.insertBefore(notice, app.firstChild.nextSibling);
          }
`;
  if (html.includes(successMarker) && !html.includes('stockage de secours actif')) {
    html = html.replace(successMarker, recoveryNotice);
  }

  return html;
}

async function patchedIndexResponse(response) {
  const source = await response.text();
  const patched = patchIndexHtml(source);
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'no-store, max-age=0');
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
