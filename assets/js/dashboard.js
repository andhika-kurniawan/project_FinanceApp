/**
 * dashboard.js — Personal Wallet
 * Page-specific logic for dashboard.html.
 * Depends on: app.js (window.PW)
 */

document.addEventListener('DOMContentLoaded', function () {
  /* ── Aliases ── */
  const { store, walletStore, sync, computed, format, modal, nav, greeting, renderer } = PW;

  let isBalanceHidden = false;

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  greeting.apply();
  nav.setActive('home');
  modal.init(() => renderAll());
  renderAll();
  lucide.createIcons();

  // Subscribe to sync events for cross-tab / cross-component reactivity
  sync.on('data-changed', renderAll);

  // Load profile avatar from localStorage
  const savedPhoto = localStorage.getItem('pw_profile_photo');
  const savedPhotoUrl = localStorage.getItem('pw_profile_photo_url');
  const avatarImg = document.getElementById('homeAvatar');
  if (avatarImg) {
    if (savedPhoto) avatarImg.src = savedPhoto;
    else if (savedPhotoUrl) avatarImg.src = savedPhotoUrl;
  }
  window.addEventListener('storage', function(e) {
    if (e.key === 'pw_profile_photo' || e.key === 'pw_profile_photo_url') {
      if (savedPhoto) avatarImg.src = savedPhoto;
      else if (savedPhotoUrl) avatarImg.src = savedPhotoUrl;
    }
  });

  /* ─────────────────────────────────────────────
     RENDER EVERYTHING
  ───────────────────────────────────────────── */
  function renderAll() {
    const txns = store.getAll();
    const wallets = walletStore.getAll();

    /* 1. Compute total balance and per-wallet balances */
    let totalBalance = 0;
    const walletBalances = {};

    wallets.forEach(w => {
      const bal = computed.walletBalance(w.name);
      walletBalances[w.name] = bal;
      totalBalance += bal;
    });

    /* 2. Compute income/expense totals for stat cards */
    let totalIncome  = 0;
    let totalExpense = 0;
    txns.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    /* 3. Update balance card */
    const balEl = document.getElementById('balanceText');
    if (balEl) balEl.textContent = isBalanceHidden ? 'Rp •••••••' : format.rpFull(totalBalance);

    const eyeEl = document.getElementById('eyeIcon');
    if (eyeEl) eyeEl.setAttribute('data-lucide', isBalanceHidden ? 'eye-off' : 'eye');

    /* 4. Update wallet subtitle */
    const subEl = document.getElementById('walletSubtitle');
    if (subEl) subEl.textContent = wallets.length + ' wallet aktif';

    /* 5. Update wallet pills (dynamic) */
    const pillsContainer = document.getElementById('walletPillsContainer');
    if (pillsContainer) {
      pillsContainer.innerHTML = wallets.map(w => {
        const icon = walletStore.icon(w.type);
        const bal = walletBalances[w.name] || 0;
        return `
          <div class="wallet-pill">
            <div class="wallet-pill__icon">
              <i data-lucide="${icon}" style="width:16px;height:16px"></i>
            </div>
            <div class="wallet-pill__text">
              <span class="wallet-pill__name">${w.name}</span>
              <span class="wallet-pill__amount">${isBalanceHidden ? '•••' : format.rpCompact(bal)}</span>
            </div>
          </div>`;
      }).join('');
    }

    /* 6. Update stat cards */
    const incEl = document.querySelector('.stat-card__amount--income');
    const expEl = document.querySelector('.stat-card__amount--expense');
    if (incEl) incEl.textContent = format.rpFull(totalIncome);
    if (expEl) expEl.textContent = format.rpFull(totalExpense);

    /* 7. Render today's transactions (dashboard only shows today) */
    const today = store.todayStr();
    const todayTxns = txns
      .filter(t => t.date === today)
      .sort((a, b) => b.id - a.id);

    const expTxns = todayTxns.filter(t => t.type === 'expense');
    const incTxns = todayTxns.filter(t => t.type === 'income');

    /* tab counts */
    const expCount = document.querySelector('#tab-expense .tab__count');
    const incCount = document.querySelector('#tab-income .tab__count');
    if (expCount) expCount.textContent = expTxns.length;
    if (incCount) incCount.textContent = incTxns.length;

    renderPanel('expense-list', expTxns, 'Pengeluaran', today);
    renderPanel('income-list',  incTxns, 'Pemasukan',   today);

    lucide.createIcons();
  }

  function renderPanel(containerId, txns, label, dateStr) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!txns.length) {
      container.innerHTML = `
        <div class="empty">
          <div class="empty__icon"><i data-lucide="inbox" style="width:32px;height:32px"></i></div>
          <div class="empty__title">Belum ada ${label} hari ini</div>
        </div>`;
      return;
    }

    const labelText = `Hari Ini — ${format.dateLabel(dateStr)}`;
    container.innerHTML = renderer.groupHTML(dateStr, txns, labelText);

    renderer.attachHandlers(container, () => renderAll());
  }

  /* ─────────────────────────────────────────────
     TAB SWITCHER
  ───────────────────────────────────────────── */
  window.switchTab = function (tab, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    el.classList.add('tab--active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('tab-panel--active'));
    const panel = document.getElementById('panel-' + tab);
    if (panel) panel.classList.add('tab-panel--active');
    lucide.createIcons();
  };

  /* ─────────────────────────────────────────────
     BALANCE TOGGLE
  ───────────────────────────────────────────── */
  window.toggleBalance = function () {
    isBalanceHidden = !isBalanceHidden;
    renderAll();
  };

  /* ─────────────────────────────────────────────
     FAB BUTTON
  ───────────────────────────────────────────── */
  window.onFabClick = function () { modal.open(); };

  /* ─────────────────────────────────────────────
     MODAL TYPE SWITCHER (called from HTML buttons)
  ───────────────────────────────────────────── */
  window.setTxnType = function (type) { modal.setType(type); };

  /* ─────────────────────────────────────────────
     MODAL CLOSE
  ───────────────────────────────────────────── */
  window.closeModal = function () { modal.close(); };
});
