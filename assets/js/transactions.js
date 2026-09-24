/**
 * transactions.js — Personal Wallet
 * Page-specific logic for transactions.html.
 * Depends on: app.js (window.PW)
 */

document.addEventListener('DOMContentLoaded', function () {
  const { store, format, modal, nav, renderer } = PW;

  /* ── State ── */
  let currentRange = 'all';
  let currentType  = 'all';
  let customFrom   = null;
  let customTo     = null;
  let searchQuery  = '';
  let activeWalletFilter = 'all';
  let activeCatFilter = 'all';

  /* ── Init ── */
  nav.setActive('transactions');
  modal.init(() => renderList());
  setupSearch();
  renderFilterOptions();
  renderList();
  lucide.createIcons();

  /* ─────────────────────────────────────────────
     DATE RANGE HELPERS
  ───────────────────────────────────────────── */
  function shiftDate(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return (
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  function getDateRange(range) {
    const today = store.todayStr();
    if (range === 'all')   return { from: null, to: null };
    if (range === 'today') return { from: today, to: today };
    if (range === 'week')  return { from: shiftDate(today, -6), to: today };
    if (range === 'month') {
      const d = new Date(); d.setDate(1);
      return {
        from: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-01',
        to:   today,
      };
    }
    if (range === 'last_month') {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1);
      const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0');
      const last = new Date(y, d.getMonth() + 1, 0).getDate();
      return { from: `${y}-${m}-01`, to: `${y}-${m}-${String(last).padStart(2, '0')}` };
    }
    if (range === 'custom') return { from: customFrom, to: customTo };
    return { from: null, to: null };
  }

  /* ─────────────────────────────────────────────
     FILTER
  ───────────────────────────────────────────── */
  function filterTransactions() {
    const { from, to } = getDateRange(currentRange);
    return store.getAll().filter(t => {
      const matchDate  = (!from || t.date >= from) && (!to || t.date <= to);
      const matchType  = currentType === 'all' || t.type === currentType;
      const matchQuery = !searchQuery ||
        t.name.toLowerCase().includes(searchQuery) ||
        t.category.toLowerCase().includes(searchQuery);
      const matchWallet = (typeof activeWalletFilter === 'undefined' || activeWalletFilter === 'all') || t.wallet === activeWalletFilter;
      const matchCat = (typeof activeCatFilter === 'undefined' || activeCatFilter === 'all') || t.category === activeCatFilter;
      return matchDate && matchType && matchQuery && matchWallet && matchCat;
    });
  }

  /* ─────────────────────────────────────────────
     RENDER LIST
  ───────────────────────────────────────────── */
  function renderList() {
    const filtered = filterTransactions().sort(
      (a, b) => b.date.localeCompare(a.date) || b.id - a.id
    );

    /* Summary strip */
    let totalInc = 0, totalExp = 0;
    filtered.forEach(t => (t.type === 'income' ? (totalInc += t.amount) : (totalExp += t.amount)));
    const diff = totalInc - totalExp;
    const diffSign = diff >= 0 ? '+' : '-';
    
    document.getElementById('summaryIncome').textContent  = format.rpCompact(totalInc);
    document.getElementById('summaryExpense').textContent = format.rpCompact(totalExp);
    
    const diffEl = document.getElementById('summaryDiff');
    diffEl.textContent = diffSign + format.rpCompact(Math.abs(diff));
    diffEl.style.color = diff >= 0 ? 'var(--color-income)' : 'var(--color-expense)';

    /* List Info */
    const rangeLabels = {
      'all': 'Semua waktu',
      'today': 'Hari Ini',
      'week': '7 Hari Terakhir',
      'month': 'Bulan Ini',
      'last_month': 'Bulan Lalu',
      'custom': 'Kustom'
    };
    const rangeName = rangeLabels[currentRange] || 'Semua waktu';
    document.getElementById('listInfo').innerHTML = `${filtered.length} transaksi &bull; ${rangeName}`;
    const subTitle = document.getElementById('topSubtitle');
    if(subTitle) subTitle.textContent = rangeName;

    /* List container */
    const container = document.getElementById('txnList');
    container.innerHTML = '';

    if (!filtered.length) {
      container.innerHTML = `
        <div class="empty-state slide-up">
          <i data-lucide="inbox" style="width:48px;height:48px"></i>
          <div class="empty-state__title">Tidak ada transaksi</div>
          <div class="empty-state__sub">Coba ubah filter atau rentang tanggal</div>
        </div>`;
      lucide.createIcons();
      return;
    }

    /* Group by date */
    const groups = {};
    filtered.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });

    for (const [date, txns] of Object.entries(groups)) {
      container.innerHTML += renderer.groupHTML(date, txns);
    }

    renderer.attachHandlers(container, () => renderList());
    lucide.createIcons();
  }

  /* ─────────────────────────────────────────────
     QUICK FILTER
  ───────────────────────────────────────────── */
  window.setQuickFilter = function (el, range) {
    document.querySelectorAll('.qf-pill').forEach(p => {
      p.classList.remove('active');
      p.style.background = '';
      p.style.color = '';
    });
    el.classList.add('active');
    currentRange = range;
    const customRow = document.getElementById('customDateRow');
    if (customRow) customRow.style.display = range === 'custom' ? 'grid' : 'none';
    renderList();
  };

  window.applyCustomDate = function () {
    customFrom = document.getElementById('dateFrom').value || null;
    customTo   = document.getElementById('dateTo').value   || null;
    renderList();
  };

  /* ─────────────────────────────────────────────
     TYPE FILTER
  ───────────────────────────────────────────── */
  window.setTypeFilter = function (el, type) {
    document.querySelectorAll('.type-tab').forEach(t => { t.classList.remove('active'); t.style.background = 'transparent'; t.style.color = 'rgba(255,255,255,0.7)'; });
    el.classList.add('active');
    el.style.background = 'var(--primary-500)';
    el.style.color = '#fff';
    currentType = type;
    renderList();
  };

  /* ─────────────────────────────────────────────
     SEARCH
  ───────────────────────────────────────────── */
  function setupSearch() {
    const input = document.getElementById('searchInput');
    const clear = document.getElementById('clearSearch');
    if (!input) return;

    input.addEventListener('input', function () {
      searchQuery = this.value.trim().toLowerCase();
      if (clear) clear.style.display = searchQuery ? 'flex' : 'none';
      renderList();
    });

    if (clear) {
      clear.addEventListener('click', function () {
        input.value = '';
        searchQuery = '';
        this.style.display = 'none';
        renderList();
      });
    }
  }

  /* ─────────────────────────────────────────────
     EXPORT CSV
  ───────────────────────────────────────────── */
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const filtered = filterTransactions().sort((a, b) => b.date.localeCompare(a.date));
      if (!filtered.length) { alert('Tidak ada data untuk diekspor.'); return; }
      const header = ['Tanggal', 'Nama', 'Tipe', 'Kategori', 'Wallet', 'Nominal (Rp)'];
      const rows   = filtered.map(t => [t.date, `"${t.name}"`, t.type, t.category, t.wallet, t.amount]);
      const csv    = [header, ...rows].map(r => r.join(',')).join('\n');
      const blob   = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url    = URL.createObjectURL(blob);
      const a      = Object.assign(document.createElement('a'), { href: url, download: `transaksi-${store.todayStr()}.csv` });
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  
  /* ─────────────────────────────────────────────
     ADVANCED FILTER MODAL
  ───────────────────────────────────────────── */
  
  function renderFilterOptions() {
    const { categories, walletStore } = PW;
    
    // Render kategori
    const customCats = (() => {
      try {
        const stored = localStorage.getItem('pw_custom_categories');
        return stored ? JSON.parse(stored) : { expense: [], income: [] };
      } catch(e) { return { expense: [], income: [] }; }
    })();
    const hiddenKey = 'pw_hidden_categories';
    const hiddenIds = new Set(JSON.parse(localStorage.getItem(hiddenKey) || '[]'));
    
    const allCats = [
      ...categories.expense.filter(c => !hiddenIds.has(c.id)),
      ...categories.income.filter(c => !hiddenIds.has(c.id)),
      ...customCats.expense,
      ...customCats.income
    ];
    
    const catGrid = document.getElementById('filterCatGrid');
    if (catGrid) {
      catGrid.innerHTML = '<div class="cat-pill active" data-filter-cat="all" onclick="toggleFilterCat(\'all\')">Semua Kategori</div>';
      allCats.forEach(c => {
        catGrid.innerHTML += `<div class="cat-pill" data-filter-cat="${c.id}" onclick="toggleFilterCat('${c.id}')">${c.label}</div>`;
      });
    }
    
    // Render wallet
    const wallets = walletStore.getAll();
    const walletGrid = document.getElementById('filterWalletGrid');
    if (walletGrid) {
      walletGrid.innerHTML = '<div class="cat-pill active" data-filter-wallet="all" onclick="toggleFilterWallet(\'all\')">Semua Wallet</div>';
      wallets.forEach(w => {
        walletGrid.innerHTML += `<div class="cat-pill" data-filter-wallet="${w.name}" onclick="toggleFilterWallet('${w.name}')">${w.name}</div>`;
      });
    }
  }

  window.openFilterModal = function() {
    document.getElementById('filterModal').classList.add('active');
  };

  window.closeFilterModal = function() {
    document.getElementById('filterModal').classList.remove('active');
  };

  
  window.toggleFilterCat = function(cat) {
    document.querySelectorAll('#filterCatGrid .cat-pill').forEach(el => el.classList.remove('active'));
    document.querySelector(`#filterCatGrid .cat-pill[data-filter-cat="${cat}"]`).classList.add('active');
    activeCatFilter = cat;
  };

  window.toggleFilterWallet = function(wallet) {
    document.querySelectorAll('#filterWalletGrid .cat-pill').forEach(el => el.classList.remove('active'));
    document.querySelector(`#filterWalletGrid .cat-pill[data-filter-wallet="${wallet}"]`).classList.add('active');
    activeWalletFilter = wallet;
  };

  window.applyAdvancedFilters = function() {
    closeFilterModal();
    renderList();
  };

  window.resetFilters = function() {
    toggleFilterWallet('all');
    toggleFilterCat('all');
    applyAdvancedFilters();
  };

  /* ─────────────────────────────────────────────
     FAB / MODAL GLOBALS (called from HTML)
  ───────────────────────────────────────────── */
  window.onFabClick  = function () { modal.open(); };
  window.closeModal  = function () { modal.close(); };
  window.setTxnType  = function (type) { modal.setType(type); };
});
