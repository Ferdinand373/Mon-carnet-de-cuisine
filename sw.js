const CACHE_NAME = 'mon-carnet-cuisine-v2-1-6';
const CORE_FILES = ['./', './index.html', './mon-carnet-v17.png'];
const FIX_SCRIPT_B64 = 'KCgpPT57J3VzZSBzdHJpY3QnOwpjb25zdCBGPXM9PlN0cmluZyhzfHwnJykubm9ybWFsaXplKCdORkQnKS5yZXBsYWNlKC9bXHUwMzAwLVx1MDM2Zl0vZywnJykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9b4oCZJ10vZywnICcpLnJlcGxhY2UoL1xzKy9nLCcgJykudHJpbSgpOwpjb25zdCBMPXM9PkYocykucmVwbGFjZSgvWzrvvJpdXHMqJC8sJycpOwpjb25zdCBTRVA9cz0+L15bXHNcLeKAk+KAlOKAonzCty5dKyQvLnRlc3QoU3RyaW5nKHN8fCcnKS50cmltKCkpOwpjb25zdCBUSU1FPXM9Pi9eKD86dGVtcHN8ZHVyZWV8dGVtcHMgdG90YWx8ZHVyZWUgdG90YWxlfHRvdGFsfHByZXBhcmF0aW9ufHRlbXBzIGRlIHByZXBhcmF0aW9ufGN1aXNzb258dGVtcHMgZGUgY3Vpc3NvbnxyZXBvc3xkZWdvcmdlbWVudHxtYXJpbmFkZSkoPzpccypbOu+8ml1ccyouKik/JC8udGVzdChGKHMpKTsKY29uc3QgT1BUPXM9Pi9eKD86YWNjb21wYWduZW1lbnRzP1xzKyg/OnRyYWRpdGlvbm5lbHM/fGNvbnNlaWxsZXM/fHN1Z2dlcmVzPyl8c3VnZ2VzdGlvbnM/XHMrZFxzKmFjY29tcGFnbmVtZW50fGEgc2VydmlyIGF2ZWN8cG91ciBzZXJ2aXIpJC8udGVzdChMKHMpKTsKY29uc3QgRT1zPT5TdHJpbmcocykucmVwbGFjZSgvWyY8PiciXS9nLGM9Pih7JyYnOicmYW1wOycsJzwnOicmbHQ7JywnPic6JyZndDsnLCInIjonJiMzOTsnLCciJzonJnF1b3Q7J31bY10pKTsKbGV0IG9wdGlvbmFsPW5ldyBTZXQoKSxidXN5PWZhbHNlOwpmdW5jdGlvbiBtaW5zKHMpe3M9RihzKS5yZXBsYWNlKCcsJywnLicpO2xldCBuPTAsaD1zLm1hdGNoKC8oXGQrKD86XC5cZCspPylccyooPzpofGhldXJlfGhldXJlcylcYi8pLG09cy5tYXRjaCgvKFxkKylccyooPzptaW58bWludXRlfG1pbnV0ZXMpXGIvKTtpZihoKW4rPU1hdGgucm91bmQoK2hbMV0qNjApO2lmKG0pbis9K21bMV07cmV0dXJuIG59CmZ1bmN0aW9uIGZtdChuKXtuPU1hdGgubWF4KDAsTWF0aC5yb3VuZCgrbnx8MCkpO2xldCBoPU1hdGguZmxvb3Iobi82MCksbT1uJTYwO3JldHVybiBoPyhtP2Ake2h9IGggJHtTdHJpbmcobSkucGFkU3RhcnQoMiwnMCcpfWA6YCR7aH0gaGApOmAke219IG1pbmB9CmZ1bmN0aW9uIHN0eWxlKCl7aWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3YyMTZjc3MnKSlyZXR1cm47bGV0IHM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtzLmlkPSd2MjE2Y3NzJztzLnRleHRDb250ZW50PSdib2R5LnJlY2lwZS1vcGVuIC5kZXRhaWwtYmFjayxib2R5LnJlY2lwZS1vcGVuIC5kZXRhaWwtZmF2e3Bvc2l0aW9uOmFic29sdXRlIWltcG9ydGFudH0udjIxNmV4dHJhe21hcmdpbi10b3A6MThweH0udjIxNmVtcHR5e2NvbG9yOnZhcigtLW11dGVkKTtmb250LXN0eWxlOml0YWxpYztib3JkZXItYm90dG9tOjAhaW1wb3J0YW50fSc7ZG9jdW1lbnQuaGVhZC5hcHBlbmQocyl9CmZ1bmN0aW9uIGFkdmFuY2UoKXtsZXQgYj17bjowLGw6Jyd9O2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGVwLWxpc3QgbGknKS5mb3JFYWNoKHg9PntsZXQgdD14LnRleHRDb250ZW50LHo9Rih0KTtpZighLyhkZWdvcmdlcnxyZXBvc2VyfG1hcmluZXJ8dHJlbXBlcnxsZXZlcnxyZWZyb2lkaXJ8YXR0ZW5kcmUpLy50ZXN0KHopKXJldHVybjtsZXQgbj1taW5zKHQpO2lmKG4+Yi5uKWI9e24sbDovZGVnb3JnZXIvLnRlc3Qoeik/J0TDqWdvcmdlbWVudCc6KC9tYXJpbmVyLy50ZXN0KHopPydNYXJpbmFkZSc6J1JlcG9zJyl9fSk7cmV0dXJuIGJ9CmZ1bmN0aW9uIGRldGFpbCgpe2xldCB1bD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGV0YWlsSW5ncmVkaWVudExpc3QnKTtpZighdWwpcmV0dXJuO29wdGlvbmFsPW5ldyBTZXQ7bGV0IGV4PVtdLG1vZGU9ZmFsc2U7Wy4uLnVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyldLmZvckVhY2gobGk9PntsZXQgdD1saS50ZXh0Q29udGVudC50cmltKCk7aWYoIXR8fFNFUCh0KXx8VElNRSh0KSl7bGkucmVtb3ZlKCk7cmV0dXJufWlmKE9QVCh0KSl7bW9kZT10cnVlO2xpLnJlbW92ZSgpO3JldHVybn1pZihtb2RlKXtleC5wdXNoKHQpO29wdGlvbmFsLmFkZChGKHQpKTtsaS5yZW1vdmUoKX19KTtpZighdWwucXVlcnlTZWxlY3RvcignbGknKSl7bGV0IGxpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7bGkuY2xhc3NOYW1lPSd2MjE2ZW1wdHknO2xpLnRleHRDb250ZW50PSdBdWN1biBpbmdyw6lkaWVudCByZW5zZWlnbsOpLic7dWwuYXBwZW5kKGxpKX1sZXQgYm94PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN2MjE2ZXh0cmEnKTtpZihleC5sZW5ndGgpe2lmKCFib3gpe2JveD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtib3guaWQ9J3YyMTZleHRyYSc7Ym94LmNsYXNzTmFtZT0nbm90ZS1ib3ggdjIxNmV4dHJhJzt1bC5hZnRlcihib3gpfWJveC5pbm5lckhUTUw9JzxzdHJvbmc+QWNjb21wYWduZW1lbnQ8L3N0cm9uZz48YnI+JytleC5tYXAoRSkuam9pbignPGJyPicpfWVsc2UgYm94Py5yZW1vdmUoKTtsZXQgbGl2ZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29va2VkLWNhcmQgc3BhbicpO2lmKGxpdmUmJkYobGl2ZS50ZXh0Q29udGVudCkuaW5jbHVkZXMoJ2F1Y3VuZSBwcmVwYXJhdGlvbiBlbnJlZ2lzdHJlZScpKWxpdmUudGV4dENvbnRlbnQ9J1BhcyBlbmNvcmUgY3Vpc2luw6llIGRhbnMgbGUgY2FybmV0Lic7bGV0IGE9YWR2YW5jZSgpLG1ldGE9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldGFpbC1tZXRhJyk7aWYobWV0YSYmYS5uKXtpZighWy4uLm1ldGEucXVlcnlTZWxlY3RvckFsbCgnLnRhZycpXS5zb21lKHg9Pi8oZGVnb3JnZW1lbnR8cmVwb3N8bWFyaW5hZGUpLy50ZXN0KEYoeC50ZXh0Q29udGVudCkpKSl7bGV0IHRhZz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7dGFnLmNsYXNzTmFtZT0ndGFnJzt0YWcudGV4dENvbnRlbnQ9YCR7YS5sfSAke2ZtdChhLm4pfSDCtyDDoCBwcsOpdm9pciDDoCBs4oCZYXZhbmNlYDttZXRhLmFwcGVuZCh0YWcpfW1ldGEucXVlcnlTZWxlY3RvckFsbCgnLnRhZycpLmZvckVhY2goeD0+e2lmKC9edG90YWxcYi8udGVzdChGKHgudGV4dENvbnRlbnQpKSl4LnRleHRDb250ZW50PXgudGV4dENvbnRlbnQucmVwbGFjZSgvXlRvdGFsL2ksJ1RlbXBzIGVuIGN1aXNpbmUnKX0pfX0KZnVuY3Rpb24gY2xhaXIoKXtsZXQgbGlzdD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2xhaXJSZXZpZXdMaXN0JyksdGE9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NsYWlyVGV4dCcpO2lmKCFsaXN0fHwhdGEpcmV0dXJuO2xpc3QucXVlcnlTZWxlY3RvckFsbCgnLmNsYWlyLXJldmlldy1pdGVtJykuZm9yRWFjaChyPT57bGV0IHQ9ci5xdWVyeVNlbGVjdG9yKCdbaWRePSJjbGFpckl0ZW1UZXh0Il0nKT8udGV4dENvbnRlbnQ/LnRyaW0oKXx8Jyc7aWYoIXR8fFNFUCh0KXx8VElNRSh0KXx8T1BUKHQpfHxvcHRpb25hbC5oYXMoRih0KSkpci5yZW1vdmUoKX0pO3RhLnZhbHVlPVsuLi5saXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jbGFpci1yZXZpZXctaXRlbScpXS5maWx0ZXIocj0+ci5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPSJjaGVja2JveCJdJyk/LmNoZWNrZWQpLm1hcChyPT5yLnF1ZXJ5U2VsZWN0b3IoJ1tpZF49ImNsYWlySXRlbVRleHQiXScpPy50ZXh0Q29udGVudD8udHJpbSgpKS5maWx0ZXIoQm9vbGVhbikuam9pbignXG4nKX0KZnVuY3Rpb24gcXVpY2socyl7bGV0IG89W107Zm9yKGxldCByYXcgb2YgU3RyaW5nKHMpLnNwbGl0KC9ccj9cbi8pKXtsZXQgdD1yYXcudHJpbSgpO2lmKFNFUCh0KSljb250aW51ZTtpZihMKHQpPT09J3RlbXBzJyl7by5wdXNoKCdJbmZvcm1hdGlvbnMnKTtjb250aW51ZX1pZigvXnRvdGFsXHMqWzrvvJpdL2kudGVzdCh0KSl7by5wdXNoKHQucmVwbGFjZSgvXnRvdGFsXHMqWzrvvJpdL2ksJ0R1csOpZSB0b3RhbGUgOicpKTtjb250aW51ZX1pZihPUFQodCkpe28ucHVzaCgnTm90ZXMnLCdBY2NvbXBhZ25lbWVudCcpO2NvbnRpbnVlfW8ucHVzaChyYXcpfXJldHVybiBvLmpvaW4oJ1xuJykudHJpbSgpfQpmdW5jdGlvbiBmb3JtKCl7bGV0IGk9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlY2lwZUluZ3JlZGllbnRzJyksbj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVjaXBlTm90ZXMnKSxkPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWNpcGVEdXJhdGlvbicpO2lmKCFpfHwhbilyZXR1cm47bGV0IGs9W10seD1bXSxtb2RlPWZhbHNlO2ZvcihsZXQgcmF3IG9mIGkudmFsdWUuc3BsaXQoL1xyP1xuLykpe2xldCB0PXJhdy50cmltKCk7aWYoIXR8fFNFUCh0KSljb250aW51ZTtpZihPUFQodCkpe21vZGU9dHJ1ZTtjb250aW51ZX1pZihUSU1FKHQpKXtsZXQgbT1taW5zKHQpO2lmKG0mJi9edG90YWxcYi8udGVzdChGKHQpKSYmZCYmIWQudmFsdWUpZC52YWx1ZT1tO2NvbnRpbnVlfShtb2RlP3g6aykucHVzaCh0KX1pLnZhbHVlPWsuam9pbignXG4nKTtpZih4Lmxlbmd0aCYmIXguZXZlcnkodD0+RihuLnZhbHVlKS5pbmNsdWRlcyhGKHQpKSkpbi52YWx1ZT1bbi52YWx1ZS50cmltKCksJ0FjY29tcGFnbmVtZW50XG4nK3guam9pbignXG4nKV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xuXG4nKX0KZnVuY3Rpb24gcnVuKCl7aWYoYnVzeSlyZXR1cm47YnVzeT10cnVlO3RyeXtzdHlsZSgpO2RldGFpbCgpO2lmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjbGFpck1vZGFsLm9wZW4nKSljbGFpcigpfWZpbmFsbHl7YnVzeT1mYWxzZX19CmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxlPT57aWYoZS50YXJnZXQuY2xvc2VzdCgnI3F1aWNrU2F2ZVJlY2lwZUJ0biwjcXVpY2tGaWxsUmVjaXBlQnRuJykpe2xldCBxPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNxdWlja1JlY2lwZVRleHQnKTtpZihxKXEudmFsdWU9cXVpY2socS52YWx1ZSl9fSx0cnVlKTsKZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JyxlPT57aWYoZS50YXJnZXQ/LmlkPT09J3JlY2lwZUZvcm0nKWZvcm0oKX0sdHJ1ZSk7CmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsZT0+e2lmKGUudGFyZ2V0LmNsb3Nlc3Q/LignI2NsYWlyUmV2aWV3TGlzdCcpKXF1ZXVlTWljcm90YXNrKGNsYWlyKX0sdHJ1ZSk7Cm5ldyBNdXRhdGlvbk9ic2VydmVyKCgpPT5xdWV1ZU1pY3JvdGFzayhydW4pKS5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCx7c3VidHJlZTp0cnVlLGNoaWxkTGlzdDp0cnVlLGF0dHJpYnV0ZXM6dHJ1ZSxhdHRyaWJ1dGVGaWx0ZXI6WydjbGFzcyddfSk7CmRvY3VtZW50LnJlYWR5U3RhdGU9PT0nbG9hZGluZyc/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcscnVuLHtvbmNlOnRydWV9KTpydW4oKTsKfSkoKTs=';

function patchHtml(source = '') {
  let html = String(source);
  html = html.replace(/2\.1\.5/g, '2.1.6');
  html = html.replace(
    "body.recipe-open .detail-back {\n      position: fixed;",
    "body.recipe-open .detail-back {\n      position: absolute;"
  );
  html = html.replace(
    "body.recipe-open .detail-fav {\n      position: fixed;",
    "body.recipe-open .detail-fav {\n      position: absolute;"
  );
  html = html.replace(
    'Aucune préparation enregistrée pour le moment.',
    'Pas encore cuisinée dans le carnet.'
  );
  if (!html.includes('data-v216-repair')) {
    const script = atob(FIX_SCRIPT_B64);
    html = html.replace('</body>', `<script data-v216-repair>${script}<\/script></body>`);
  }
  return html;
}

async function patchResponse(response) {
  if (!response) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = patchHtml(await response.text());
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('content-type', 'text/html; charset=utf-8');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const path of CORE_FILES) {
      try {
        const response = await fetch(new Request(path, { cache: 'reload' }));
        if (response.ok) await cache.put(path, await patchResponse(response.clone()));
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
        const network = await fetch(request, { cache: 'no-store' });
        const patched = await patchResponse(network.clone());
        if (network.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('./index.html', patched.clone());
          await cache.put('./', patched.clone());
        }
        return patched;
      } catch (_) {
        const cached = (await caches.match(request))
          || (await caches.match('./index.html'))
          || (await caches.match('./'));
        return cached ? patchResponse(cached.clone()) : Response.error();
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
