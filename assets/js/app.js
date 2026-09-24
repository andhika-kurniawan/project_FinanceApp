/**
 * app.js — Personal Wallet
 * Shared application logic used by all pages.
 *
 * Exports (as window globals):
 *   PW.store        — transaction localStorage CRUD
 *   PW.walletStore  — wallet localStorage CRUD
 *   PW.sync         — event bus for cross-component reactivity
 *   PW.computed     — derived state helpers (balances, last expense, chart data)
 *   PW.format       — currency & date formatters
 *   PW.categories   — category metadata
 *   PW.modal        — add-transaction modal controller
 *   PW.nav          — bottom-nav active-state helper
 *   PW.greeting     — dynamic greeting text
 */

(function (window) {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     1. STORAGE — single source of truth (localStorage)
  ───────────────────────────────────────────────────────── */
  const STORAGE_KEY = 'pw_transactions';

  const store = {
    /** Return all transactions (array). */
    getAll() {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },

    /** Persist the full transactions array. */
    saveAll(txns) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
    },

    /** Append one transaction object and persist. */
    add(txn) {
      const all = store.getAll();
      all.push(txn);
      store.saveAll(all);
      sync.emit('data-changed', { action: 'txn-add', txn });
    },

    /** Remove a transaction by id and persist. */
    remove(id) {
      const all = store.getAll().filter(t => t.id !== id);
      store.saveAll(all);
      sync.emit('data-changed', { action: 'txn-remove', id });
    },

    /** Update an existing transaction by id. */
    update(txn) {
      const all = store.getAll();
      const index = all.findIndex(t => t.id === txn.id);
      if (index !== -1) {
        all[index] = txn;
        store.saveAll(all);
        sync.emit('data-changed', { action: 'txn-update', txn });
      }
    },

    /** Return today's YYYY-MM-DD string (local time). */
    todayStr() {
      const d = new Date();
      return (
        d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0')
      );
    },
  };

  /* ─────────────────────────────────────────────────────────
     1b. SYNC — simple event bus for in-page reactivity
  ───────────────────────────────────────────────────────── */
  const sync = {
    _listeners: {},

    /** Subscribe to an event. */
    on(event, cb) {
      if (!sync._listeners[event]) sync._listeners[event] = [];
      sync._listeners[event].push(cb);
    },

    /** Unsubscribe from an event. */
    off(event, cb) {
      if (!sync._listeners[event]) return;
      sync._listeners[event] = sync._listeners[event].filter(fn => fn !== cb);
    },

    /** Emit an event to all subscribers. */
    emit(event, data) {
      (sync._listeners[event] || []).forEach(cb => cb(data));
    },
  };

  // Cross-tab reactivity via storage event
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY || e.key === WALLET_KEY) {
      sync.emit('data-changed', { key: e.key, source: 'storage-event' });
    }
  });

  /* ─────────────────────────────────────────────────────────
     1c. WALLET STORE — localStorage CRUD for wallets
  ───────────────────────────────────────────────────────── */
  const WALLET_KEY = 'pw_wallets';

  const WALLET_ICONS = { 'bank': 'landmark', 'e-wallet': 'smartphone', 'tunai': 'banknote' };
  const WALLET_TYPE_LABELS = { 'bank': 'Bank', 'e-wallet': 'E-Wallet', 'tunai': 'Tunai' };

  const DEFAULT_WALLETS = [
    { id: 1, name: 'GoPay',  type: 'e-wallet', balance: 733000,    note: '',                   primary: false },
    { id: 2, name: 'BCA',    type: 'bank',     balance: 12217000,  note: 'Rekening utama gaji', primary: true  },
    { id: 3, name: 'Tunai',  type: 'tunai',    balance: 229000,    note: '',                   primary: false },
  ];

  const walletStore = {
    /** Return all wallets (array). */
    getAll() {
      const raw = localStorage.getItem(WALLET_KEY);
      if (!raw) {
        // Seed default wallets on first load
        walletStore.saveAll(DEFAULT_WALLETS);
        return DEFAULT_WALLETS.map(w => Object.assign({}, w));
      }
      return JSON.parse(raw);
    },

    /** Persist the full wallets array. */
    saveAll(wallets) {
      localStorage.setItem(WALLET_KEY, JSON.stringify(wallets));
    },

    /** Add a wallet and persist. */
    add(wallet) {
      const all = walletStore.getAll();
      if (wallet.primary) all.forEach(w => w.primary = false);
      all.push(wallet);
      walletStore.saveAll(all);
      sync.emit('data-changed', { action: 'wallet-add', wallet });
    },

    /** Update a wallet by id and persist. */
    update(wallet) {
      const all = walletStore.getAll();
      if (wallet.primary) all.forEach(w => w.primary = false);
      const idx = all.findIndex(w => w.id === wallet.id);
      if (idx !== -1) {
        all[idx] = wallet;
        walletStore.saveAll(all);
        sync.emit('data-changed', { action: 'wallet-update', wallet });
      }
    },

    /** Remove a wallet by id and persist. Also removes its transactions. */
    remove(id) {
      const all = walletStore.getAll();
      const wallet = all.find(w => w.id === id);
      const remaining = all.filter(w => w.id !== id);
      walletStore.saveAll(remaining);
      // Also remove transactions for this wallet
      if (wallet) {
        const txns = store.getAll().filter(t => t.wallet !== wallet.name);
        store.saveAll(txns);
      }
      sync.emit('data-changed', { action: 'wallet-remove', id });
    },

    /** Find a wallet by id. */
    getById(id) {
      return walletStore.getAll().find(w => w.id === id) || null;
    },

    /** Find a wallet by name. */
    getByName(name) {
      return walletStore.getAll().find(w => w.name === name) || null;
    },

    /** Generate the next wallet id. */
    nextId() {
      const all = walletStore.getAll();
      return all.length ? Math.max(...all.map(w => w.id)) + 1 : 1;
    },

    /** Icon and label helpers. */
    icon(type) { return WALLET_ICONS[type] || 'wallet'; },
    typeLabel(type) { return WALLET_TYPE_LABELS[type] || type; },
  };

  /* ─────────────────────────────────────────────────────────
     1d. COMPUTED — derived state helpers
  ───────────────────────────────────────────────────────── */
  const computed = {
    /** Get the effective balance for a wallet (base balance adjusted by transactions). */
    walletBalance(walletName) {
      const wallet = walletStore.getByName(walletName);
      if (!wallet) return 0;
      const txns = store.getAll().filter(t => t.wallet === walletName);
      let balance = wallet.balance;
      txns.forEach(t => {
        balance += (t.type === 'income' ? t.amount : -t.amount);
      });
      return balance;
    },

    /** Sum of all wallet effective balances. */
    totalBalance() {
      const wallets = walletStore.getAll();
      const txns = store.getAll();
      let total = 0;
      wallets.forEach(w => {
        let bal = w.balance;
        txns.filter(t => t.wallet === w.name).forEach(t => {
          bal += (t.type === 'income' ? t.amount : -t.amount);
        });
        total += bal;
      });
      return total;
    },

    /** Get the most recent expense transaction for a wallet. Returns {amount, name} or null. */
    lastExpense(walletName) {
      const txns = store.getAll()
        .filter(t => t.wallet === walletName && t.type === 'expense')
        .sort((a, b) => b.id - a.id);
      if (!txns.length) return null;
      return { amount: txns[0].amount, name: txns[0].name };
    },

    /** Count transactions for a wallet. */
    walletTxnCount(walletName) {
      return store.getAll().filter(t => t.wallet === walletName).length;
    },

    /** Get last 7 days expense totals per day for a wallet. Returns { days: [...labels], amounts: [...numbers], total, dateRange }. */
    weeklyExpenses(walletName) {
      const now = new Date();
      const days = [];
      const amounts = [];
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      let total = 0;

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.getFullYear() + '-' +
          String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');
        days.push(dayNames[d.getDay()]);

        const dayExpense = store.getAll()
          .filter(t => t.wallet === walletName && t.type === 'expense' && t.date === dateStr)
          .reduce((sum, t) => sum + t.amount, 0);
        amounts.push(dayExpense);
        total += dayExpense;
      }

      // Date range label
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dateRange = startDate.getDate() + ' - ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();

      return { days, amounts, total, dateRange };
    },

    /** Get last 7 days transactions for a wallet, grouped for rendering. Returns { txns, totalIncome, totalExpense, count }. */
    weeklyTransactions(walletName) {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 6);
      const weekAgoStr = weekAgo.getFullYear() + '-' +
        String(weekAgo.getMonth() + 1).padStart(2, '0') + '-' +
        String(weekAgo.getDate()).padStart(2, '0');

      const txns = store.getAll()
        .filter(t => t.wallet === walletName && t.date >= weekAgoStr)
        .sort((a, b) => b.id - a.id);

      let totalIncome = 0, totalExpense = 0;
      txns.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        else totalExpense += t.amount;
      });

      return { txns, totalIncome, totalExpense, count: txns.length };
    },
  };

  /* ─────────────────────────────────────────────────────────
     1e. DATA MIGRATION — one-time fixes
  ───────────────────────────────────────────────────────── */
  (function migrate() {
    // Migrate wallet name "Cash" → "Tunai" in existing transactions
    const txns = store.getAll();
    let changed = false;
    txns.forEach(t => {
      if (t.wallet === 'Cash') { t.wallet = 'Tunai'; changed = true; }
    });
    if (changed) store.saveAll(txns);

    // Migrate wallet name "OVO" transactions — keep for backward compat
    // OVO wallet will be available if user creates it
  })();

  /* ─────────────────────────────────────────────────────────
     2. FORMATTERS
  ───────────────────────────────────────────────────────── */
  const format = {
    /** Full IDR currency string e.g. "Rp9.600.000". */
    rpFull(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
      }).format(value);
    },

    /** Compact IDR e.g. "Rp9,6jt" / "Rp500rb". */
    rpCompact(value) {
      if (value >= 1_000_000) return 'Rp' + (value / 1_000_000).toFixed(1).replace('.0', '') + 'jt';
      if (value >= 1_000)    return 'Rp' + (value / 1_000).toFixed(0) + 'rb';
      return format.rpFull(value);
    },

    /** "Senin, 9 September 2026" from a YYYY-MM-DD string. */
    dateLabel(dateStr) {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    },

    /** Current month label e.g. "September 2026". */
    currentMonth() {
      return new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    },
  };

  /* ─────────────────────────────────────────────────────────
     3. CATEGORY METADATA
  ───────────────────────────────────────────────────────── */
   const categories = {
     expense: [
       { id: 'transport', label: 'Transport',  icon: 'car',            transactions: 3, amount: 75000 },
       { id: 'shopping',  label: 'Belanja',    icon: 'shopping-bag',   transactions: 1, amount: 450000 },
       { id: 'health',    label: 'Tagihan',    icon: 'clipboard',      transactions: 1, amount: 285000 },
       { id: 'game',      label: 'Hiburan',    icon: 'gamepad-2',      transactions: 1, amount: 180000 },
       { id: 'health',    label: 'Kesehatan',  icon: 'heart-pulse',    transactions: 1, amount: 220000 },
       { id: 'edu',       label: 'Pendidikan', icon: 'book-open',      transactions: 0, amount: 0 },
       { id: 'travel',    label: 'Travel',     icon: 'plane',          transactions: 0, amount: 0 },
       { id: 'food',      label: 'Makanan',    icon: 'utensils',       transactions: 0, amount: 0 },
       { id: 'other',     label: 'Olahraga',   icon: 'dumbbell',       transactions: 1, amount: 350000 },
     ],
     income: [
       { id: 'income',  label: 'Gaji/Bonus', icon: 'banknote',        transactions: 0, amount: 0 },
       { id: 'invest',  label: 'Investasi',  icon: 'landmark',        transactions: 0, amount: 0 },
       { id: 'other',   label: 'Lainnya',    icon: 'more-horizontal', transactions: 0, amount: 0 },
     ],

    /** Icon class for a given category id. */
    iconClass(id) {
      return 'txn__icon--' + (id === 'income' || id === 'invest' ? id : id);
    },

    /** Lucide icon name for a given category id. */
    iconName(id) {
      const customCats = (() => {
        try {
          const stored = localStorage.getItem('pw_custom_categories');
          return stored ? JSON.parse(stored) : { expense: [], income: [] };
        } catch(e) { return { expense: [], income: [] }; }
      })();
      const allCustom = [...customCats.expense, ...customCats.income];
      const custom = allCustom.find(c => c.id === id);
      if (custom) return custom.icon;
      
      const defaultCat = [...categories.expense, ...categories.income].find(c => c.id === id);
      if (defaultCat) return defaultCat.icon;
      
      const map = {
        food: 'utensils', transport: 'car', shopping: 'shopping-bag',
        health: 'heart-pulse', edu: 'book-open', invest: 'landmark',
        game: 'gamepad-2', income: 'banknote', other: 'more-horizontal',
      };
      return map[id] || 'circle';
    },

    /** Display label for a given category id. */
    label(id) {
      const customCats = (() => {
        try {
          const stored = localStorage.getItem('pw_custom_categories');
          return stored ? JSON.parse(stored) : { expense: [], income: [] };
        } catch(e) { return { expense: [], income: [] }; }
      })();
      const allCustom = [...customCats.expense, ...customCats.income];
      const custom = allCustom.find(c => c.id === id);
      if (custom) return custom.label;
      
      const defaultCat = [...categories.expense, ...categories.income].find(c => c.id === id);
      if (defaultCat) return defaultCat.label;
      
      const map = {
        food: 'Makanan', transport: 'Transport', shopping: 'Belanja',
        health: 'Kesehatan', edu: 'Pendidikan', invest: 'Investasi',
        game: 'Hiburan', income: 'Gaji/Bonus', other: 'Lainnya',
      };
      return map[id] || id;
    },

    /** Color hex for a given category id. */
    color(id) {
      const customCats = (() => {
        try {
          const stored = localStorage.getItem('pw_custom_categories');
          return stored ? JSON.parse(stored) : { expense: [], income: [] };
        } catch(e) { return { expense: [], income: [] }; }
      })();
      const allCustom = [...customCats.expense, ...customCats.income];
      const custom = allCustom.find(c => c.id === id);
      if (custom) return custom.color;
      
      const map = {
        transport: '#0369a1', shopping: '#2563eb', health: '#dc2626',
        game: '#d97706', edu: '#22c55e', travel: '#a855f7',
        food: '#f97316', other: '#6b7280', income: '#166534', invest: '#92400e',
      };
      return map[id] || '#8bc34a';
    },

    /** Background color (rgba) for icon. */
    iconBg(id) {
      const c = this.color(id);
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return `rgba(${r},${g},${b},0.12)`;
    },
  };

  /** Lucide icon name for wallet — dynamic lookup from walletStore. */
  const walletIcon = new Proxy({}, {
    get(_, name) {
      const w = walletStore.getByName(name);
      return w ? walletStore.icon(w.type) : 'wallet';
    },
  });

  /* ─────────────────────────────────────────────────────────
     4. ADD-TRANSACTION MODAL
     Attach to any page that includes the modal HTML.
  ───────────────────────────────────────────────────────── */
  const modal = {
    _overlay: null,
    _form: null,
    _onSave: null,   // callback(newTxn)
    _editId: null,   // if editing, holds the id

    /** Call once after DOM is ready. Pass a callback invoked after save. */
    init(onSaveCb) {
      modal._overlay = document.getElementById('txnModal');
      modal._form    = document.getElementById('txnForm');
      modal._onSave  = onSaveCb || (() => {});

      if (!modal._overlay) return;

      // Close on overlay backdrop click
      modal._overlay.addEventListener('click', function (e) {
        if (e.target === modal._overlay) modal.close();
      });

      modal._form.addEventListener('submit', modal._handleSubmit);
    },

    open() {
      if (!modal._overlay) return;
      modal._editId = null;
      document.querySelector('#txnModal .modal-title').textContent = 'Tambah Transaksi';
      const dateEl = document.getElementById('txnDate');
      if (dateEl) dateEl.valueAsDate = new Date();
      modal._populateWalletSelect();
      modal.setType('expense');
      modal._overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    /** Dynamically populate the wallet select from walletStore. */
    _populateWalletSelect() {
      const sel = document.getElementById('txnWallet');
      if (!sel) return;
      const wallets = walletStore.getAll();
      sel.innerHTML = wallets.map(w =>
        `<option value="${w.name}">${w.name}</option>`
      ).join('');
    },

    openForEdit(txn) {
      if (!modal._overlay) return;
      modal._editId = txn.id;
      document.querySelector('#txnModal .modal-title').textContent = 'Edit Transaksi';
      modal._populateWalletSelect();
      modal.setType(txn.type);
      document.getElementById('txnAmount').value = txn.amount;
      
      // We need to wait a tick for categories to render before setting the category
      setTimeout(() => {
        const catBtn = document.querySelector(`#categoryGrid .cat-pill:has(i[data-lucide="${categories.iconName(txn.category)}"])`);
        if(catBtn) catBtn.click();
        else document.getElementById('txnCategory').value = txn.category;
      }, 0);

      document.getElementById('txnWallet').value = txn.wallet;
      document.getElementById('txnDate').value = txn.date;
      document.getElementById('txnName').value = txn.name;
      
      modal._overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      if (!modal._overlay) return;
      modal._overlay.classList.remove('active');
      modal._form.reset();
      modal.setType('expense');
      document.body.style.overflow = '';
    },

    setType(type) {
      document.getElementById('txnType').value = type;
      document.querySelectorAll('.segment-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-val') === type);
      });
      modal._renderCategories(type);
    },

    _getAllCategories(type) {
      const defaultCats = categories[type] || categories.expense;
      const customCats = (() => {
        try {
          const stored = localStorage.getItem('pw_custom_categories');
          return stored ? JSON.parse(stored) : { expense: [], income: [] };
        } catch(e) { return { expense: [], income: [] }; }
      })();
      const hiddenKey = 'pw_hidden_categories';
      const hiddenIds = new Set(JSON.parse(localStorage.getItem(hiddenKey) || '[]'));
      
      const customList = customCats[type] || [];
      return [...defaultCats.filter(c => !hiddenIds.has(c.id)), ...customList];
    },

    _renderCategories(type) {
      const grid = document.getElementById('categoryGrid');
      if (!grid) return;
      grid.innerHTML = '';
      const list = this._getAllCategories(type);
      list.forEach((c, i) => {
        const pill = document.createElement('div');
        pill.className = 'cat-pill' + (i === 0 ? ' active' : '');
        pill.innerHTML = `<i data-lucide="${c.icon}" style="width:16px;height:16px"></i> ${c.label}`;
        pill.onclick = () => {
          document.getElementById('txnCategory').value = c.id;
          grid.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        };
        grid.appendChild(pill);
        if (i === 0) document.getElementById('txnCategory').value = c.id;
      });
      lucide.createIcons({ root: grid });
    },

    _handleSubmit(e) {
      e.preventDefault();
      const txn = {
        id:       modal._editId || Date.now(),
        type:     document.getElementById('txnType').value,
        name:     document.getElementById('txnName').value.trim(),
        amount:   parseFloat(document.getElementById('txnAmount').value),
        category: document.getElementById('txnCategory').value,
        wallet:   document.getElementById('txnWallet').value,
        date:     document.getElementById('txnDate').value,
      };
      
      if (modal._editId) {
        store.update(txn);
      } else {
        store.add(txn);
      }
      
      modal.close();
      modal._onSave(txn);
    },
  };

  /* ─────────────────────────────────────────────────────────
     5. BOTTOM NAV ACTIVE STATE
  ───────────────────────────────────────────────────────── */
  const nav = {
    /**
     * Mark the nav item whose data-page matches `pageId`.
     * Usage: nav.setActive('home')  |  'transactions'  |  'stats'  |  'settings'
     */
    setActive(pageId) {
      document.querySelectorAll('.nav-item[data-page]').forEach(el => {
        el.classList.toggle('nav-item--active', el.dataset.page === pageId);
      });
    },
  };

  /* ─────────────────────────────────────────────────────────
     6. DYNAMIC GREETING
  ───────────────────────────────────────────────────────── */
  const greeting = {
    text() {
      const h = new Date().getHours();
      if (h < 5)  return 'Selamat malam 🌙';
      if (h < 11) return 'Selamat pagi 🌤';
      if (h < 15) return 'Selamat siang ☀️';
      if (h < 18) return 'Selamat sore 🌆';
      return 'Selamat malam 🌙';
    },
    /** Write greeting text into element #greeting. */
    apply() {
      const el = document.getElementById('greeting');
      if (el) el.textContent = greeting.text();
    },
  };

  /* ─────────────────────────────────────────────────────────
     7. TRANSACTION RENDERER (shared by both pages)
  ───────────────────────────────────────────────────────── */
  const renderer = {
    /**
     * Build one .txn element HTML string.
     * @param {Object} txn  - transaction object
     * @param {boolean} showDelete - include delete button
     */
    txnHTML(txn, showDelete = true) {
      const sign    = txn.type === 'income' ? '+' : '-';
      const amtCls  = txn.type === 'income' ? 'txn__amount--income' : 'txn__amount--expense';
      const iconNm  = categories.iconName(txn.category);
      const catLbl  = categories.label(txn.category);
      const catColor = categories.color(txn.category);
      const iconBg = categories.iconBg(txn.category);
      const delBtn  = showDelete
        ? `<div class="txn__actions">
             <button class="delete-btn" data-id="${txn.id}" title="Hapus">
               <i data-lucide="trash-2" style="width:16px;height:16px"></i>
             </button>
           </div>`
        : '';

      return `
        <div class="txn" data-txn-id="${txn.id}">
          <div class="txn__icon" style="background:${iconBg};">
            <i data-lucide="${iconNm}" style="width:20px;height:20px;color:${catColor};"></i>
          </div>
          <div class="txn__info" >
            <div class="txn__name" >${txn.name}</div>
            <div class="txn__meta" >
              ${catLbl} &bull; ${txn.wallet}
            </div>
          </div>
          <div class="txn__right" >
            <div class="txn__amount ${amtCls}" >${sign}${format.rpFull(txn.amount)}</div>
            ${delBtn}
          </div>
        </div>`;
    },

    /**
     * Build a .date-group container with a label and transactions.
     * @param {string} dateStr   - YYYY-MM-DD
     * @param {Array}  txns      - transactions for this date
     * @param {string} labelOverride - override the date label text
     */
    groupHTML(dateStr, txns, labelOverride = null) {
      const label = labelOverride || format.dateLabel(dateStr);
      let dayTotal = 0;
      txns.forEach(t => { dayTotal += (t.type === 'income' ? t.amount : -t.amount); });
      const dayTotalFormatted = (dayTotal > 0 ? '+' : '') + format.rpFull(dayTotal);
      const colorCls = dayTotal >= 0 ? 'color: var(--color-income);' : 'color: var(--neutral-900);';

      let html = `<div class="date-group">
        <div class="date-label">
           <span>${label}</span>
           <span style="${colorCls} font-weight:700;">${dayTotalFormatted}</span>
        </div>
        <div class="txn-group-card">`;
      txns.forEach(t => { html += renderer.txnHTML(t, true); });
      html += '</div></div>';
      return html;
    },

    /** Attach row click and delete handlers inside a container element. */
    attachHandlers(container, onDelete) {
      // Row clicks for detail page
      container.querySelectorAll('.txn').forEach(row => {
        row.addEventListener('click', (e) => {
          // Ignore if clicking delete button
          if (e.target.closest('.delete-btn')) return;
          const id = row.getAttribute('data-txn-id');
          if (id) window.location.href = `detail.html?id=${id}`;
        });
      });

      // Delete buttons
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent row click
          const id = parseInt(btn.dataset.id, 10);
          if (confirm('Yakin ingin menghapus transaksi ini?')) {
            store.remove(id);
            if (onDelete) onDelete(id);
          }
        });
      });
    },
  };

  /* ─────────────────────────────────────────────────────────
     8. EXPOSE as window.PW
  ───────────────────────────────────────────────────────── */
  window.PW = { store, walletStore, sync, computed, format, categories, walletIcon, modal, nav, greeting, renderer };

}(window));
