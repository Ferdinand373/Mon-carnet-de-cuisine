(() => {
  'use strict';

  const CARD_ID = 'temporaryCorrectionCard';

  function openSecureCheck() {
    window.location.href = './correction-securisee.html?source=mon-carnet-v2-4';
  }

  function installTemporaryCard() {
    const settingsView = document.querySelector('#view-settings');
    const grid = settingsView?.querySelector('.settings-grid');

    if (!grid || document.getElementById(CARD_ID)) return;

    const card = document.createElement('div');
    card.className = 'setting-card';
    card.id = CARD_ID;
    card.innerHTML = `
      <h3>Correction sécurisée</h3>
      <p>
        Contrôle temporaire en lecture seule. Il vérifie les durées mal placées
        dans le stockage utilisé par l’icône de l’écran d’accueil.
      </p>
      <div style="padding:12px 14px;border-radius:15px;background:#eef3ef;color:#153c35;font-size:13px;line-height:1.45;margin:14px 0;">
        🔒 Aucune recette ne peut être modifiée pendant cette étape.
      </div>
      <button class="btn btn-light" id="openTemporaryCorrectionCheck" type="button">
        Ouvrir le contrôle sécurisé
      </button>
    `;

    grid.appendChild(card);

    card
      .querySelector('#openTemporaryCorrectionCheck')
      ?.addEventListener('click', openSecureCheck);
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

  const observer = new MutationObserver(() => installTemporaryCard());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('click', event => {
    if (event.target.closest('[data-go="settings"]')) {
      window.setTimeout(installTemporaryCard, 50);
      window.setTimeout(installTemporaryCard, 300);
    }
  });
})();
