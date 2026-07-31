(() => {
  'use strict';

  const CARD_ID = 'temporaryCorrectionCard';

  function openSecureCorrection() {
    window.location.href = './correction-securisee.html?source=mon-carnet-v2-4-apply';
  }

  function installTemporaryCard() {
    const settingsView = document.querySelector('#view-settings');
    const grid = settingsView?.querySelector('.settings-grid');
    if (!grid) return;

    const previous = document.getElementById(CARD_ID);
    if (previous) previous.remove();

    const card = document.createElement('div');
    card.className = 'setting-card';
    card.id = CARD_ID;
    card.innerHTML = `
      <h3>Correction sécurisée</h3>
      <p>
        Outil temporaire réservé aux 57 lignes de durée déjà contrôlées.
        Les cinq conflits et les ingrédients ordinaires resteront intacts.
      </p>
      <div style="padding:12px 14px;border-radius:15px;background:#fff3dc;color:#76501c;font-size:13px;line-height:1.45;margin:14px 0;">
        🔐 La correction reste bloquée jusqu’au nouveau contrôle des quatre compteurs,
        à la confirmation de la sauvegarde et à la saisie de la phrase de sécurité.
      </div>
      <button class="btn btn-light" id="openTemporaryCorrection" type="button">
        Ouvrir la correction sécurisée
      </button>
    `;

    grid.appendChild(card);
    card.querySelector('#openTemporaryCorrection')
      ?.addEventListener('click', openSecureCorrection);
  }

  function scheduleInstall() {
    window.requestAnimationFrame(() => {
      installTemporaryCard();
      window.setTimeout(installTemporaryCard, 250);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInstall, { once: true });
  } else {
    scheduleInstall();
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-go="settings"]')) {
      window.setTimeout(installTemporaryCard, 60);
      window.setTimeout(installTemporaryCard, 320);
    }
  });
})();
