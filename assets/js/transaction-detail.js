/**
 * transaction-detail.js — Personal Wallet
 * Page-specific logic for transaction-detail.html.
 * Reads ?id=<timestamp> from the URL to find the transaction.
 * Depends on: app.js (window.PW)
 */

document.addEventListener('DOMContentLoaded', function () {
  const { store, format, categories } = PW;

  /* ── Get transaction ID from URL ── */
  const params   = new URLSearchParams(window.location.search);
  const txnId    = parseInt(params.get('id'), 10);
  const fromPage = params.get('from') || 'transactions';

  if (!txnId) {
    alert('Transaksi tidak ditemukan.');
    goBack();
    return;
  }

  const txn = store.getAll().find(t => t.id === txnId);

  if (!txn) {
    alert('Transaksi tidak ditemukan atau sudah dihapus.');
    goBack();
    return;
  }

  /* ── Populate the page ── */
  renderDetail(txn);
  lucide.createIcons();

  /* ── Back button ── */
  document.getElementById('backBtn').addEventListener('click', goBack);

  /* ── Delete buttons ── */
  document.getElementById('deleteTopBtn').addEventListener('click', () => deleteTxn(txn));
  document.getElementById('deleteBtnBottom').addEventListener('click', () => deleteTxn(txn));

  /* ── Edit button ── */
  document.getElementById('editBtn').addEventListener('click', () => {
    openEditModal(txn);
  });

  /* ─────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────── */
  function renderDetail(t) {
    const isExpense = t.type === 'expense';
    const sign      = isExpense ? '-' : '+';
    const typeLabel = isExpense ? 'Pengeluaran' : 'Pemasukan';
    const iconName  = categories.iconName(t.category);
    const catLabel  = categories.label(t.category);
    const catColor  = categories.color(t.category);
    const iconBg    = categories.iconBg(t.category);

    /* Hero card */
    const heroCard = document.getElementById('heroCard');
    heroCard.classList.add(isExpense ? 'detail-hero--expense' : 'detail-hero--income');

    const heroIconEl = document.getElementById('heroIcon');
    heroIconEl.style.background = iconBg;
    heroIconEl.innerHTML = `<i data-lucide="${iconName}" style="width:28px;height:28px;color:${catColor};"></i>`;

    document.getElementById('heroLabel').textContent = typeLabel;
    document.getElementById('heroAmount').textContent = sign + format.rpFull(t.amount);

    const badge = document.getElementById('heroBadge');
    badge.classList.add(isExpense ? 'detail-hero__badge--expense' : 'detail-hero__badge--income');
    badge.innerHTML = `<i data-lucide="${isExpense ? 'arrow-down-right' : 'arrow-up-right'}" style="width:14px;height:14px"></i> ${typeLabel}`;

    /* Info rows */
    document.getElementById('detailCategory').textContent = catLabel;
    const catIconEl = document.getElementById('detailCategoryIcon');
    catIconEl.style.background = iconBg;
    catIconEl.innerHTML = `<i data-lucide="${iconName}" style="width:18px;height:18px;color:${catColor};"></i>`;
    document.getElementById('detailWallet').textContent   = t.wallet;
    document.getElementById('detailDate').textContent     = format.dateLabel(t.date);

    /* Time created — extract from timestamp id */
    const createdAt = new Date(t.id);
    const timeStr   = createdAt.toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    document.getElementById('detailTime').textContent = timeStr;

    /* Notes */
    const notesEl = document.getElementById('detailNotes');
    notesEl.textContent = t.name || '—';

    /* Full timestamp at bottom */
    const fullTimestamp = createdAt.toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    document.getElementById('detailTimestamp').textContent =
      `Dibuat pada ${fullTimestamp}`;
  }

  /* ─────────────────────────────────────────────────
     DELETE
  ───────────────────────────────────────────────── */
  async function deleteTxn(t) {
    const confirmed = await PW.confirmDialog.show({
      title: 'Hapus Transaksi?',
      message: `Transaksi "${t.name}" akan dihapus secara permanen.`
    });
    if (!confirmed) return;
    store.remove(t.id);
    goBack();
  }

  /* ─────────────────────────────────────────────────
     NAVIGATION
  ───────────────────────────────────────────────── */
  function goBack() {
    if (fromPage === 'dashboard') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'transactions.html';
    }
  }

  /* ─────────────────────────────────────────────────
     EDIT MODAL
  ───────────────────────────────────────────────── */
  let currentEditTxn = null;

  function openEditModal(t) {
    currentEditTxn = t;
    
    document.getElementById('editTxnType').value = t.type;
    document.getElementById('editTxnAmount').value = t.amount;
    document.getElementById('editTxnCategory').value = t.category;
    document.getElementById('editTxnWallet').value = t.wallet;
    document.getElementById('editTxnDate').value = t.date;
    document.getElementById('editTxnName').value = t.name;

    const segmentBtns = document.querySelectorAll('#editTxnModal .segment-btn');
    segmentBtns.forEach(btn => {
      if (btn.dataset.val === t.type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    populateEditWallets();
    populateEditCategories(t.type);
    
    document.getElementById('editTxnModal').classList.add('active');
    setTimeout(() => lucide.createIcons(), 100);
  }

  window.closeEditModal = function() {
    document.getElementById('editTxnModal').classList.remove('active');
    currentEditTxn = null;
  };

  window.setEditTxnType = function(type) {
    document.getElementById('editTxnType').value = type;
    document.querySelectorAll('#editTxnModal .segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.val === type);
    });
    populateEditCategories(type);
    document.getElementById('editTxnCategory').value = '';
  };

  function populateEditWallets() {
    const select = document.getElementById('editTxnWallet');
    const wallets = PW.walletStore.getAll();
    select.innerHTML = wallets.map(w => 
      `<option value="${w.name}">${w.name}</option>`
    ).join('');
    select.value = currentEditTxn.wallet;
  }

  function populateEditCategories(type) {
    const grid = document.getElementById('editCategoryGrid');
    const cats = type === 'expense' ? categories.expense : categories.income;
    
    const stored = localStorage.getItem('pw_custom_categories');
    let customCats = { expense: [], income: [] };
    if (stored) {
      try { customCats = JSON.parse(stored); } catch(e) {}
    }
    const hiddenKey = 'pw_hidden_categories';
    const hiddenIds = new Set(JSON.parse(localStorage.getItem(hiddenKey) || '[]'));
    
    const allCats = [...cats, ...(customCats[type] || [])].filter(c => !hiddenIds.has(c.id));
    
    grid.innerHTML = allCats.map(c => `
      <div class="cat-pill ${c.id === currentEditTxn.category ? 'active' : ''}" 
           data-cat="${c.id}" 
           onclick="selectEditCategory('${c.id}')">
        <i data-lucide="${c.icon}" style="width:16px;height:16px"></i>
        <span>${c.label}</span>
      </div>
    `).join('');
    
    lucide.createIcons({ nodes: [grid] });
  }

  window.selectEditCategory = function(catId) {
    document.getElementById('editTxnCategory').value = catId;
    document.querySelectorAll('#editCategoryGrid .cat-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.cat === catId);
    });
  };

  window.handleEditSubmit = function(e) {
    e.preventDefault();
    
    const type = document.getElementById('editTxnType').value;
    const amount = parseInt(document.getElementById('editTxnAmount').value, 10);
    const category = document.getElementById('editTxnCategory').value;
    const wallet = document.getElementById('editTxnWallet').value;
    const date = document.getElementById('editTxnDate').value;
    const name = document.getElementById('editTxnName').value;

    if (!category) {
      alert('Pilih kategori terlebih dahulu.');
      return;
    }

    const updated = {
      ...currentEditTxn,
      type,
      amount,
      category,
      wallet,
      date,
      name
    };

    store.update(updated);
    
    closeEditModal();
    location.reload();
  };
});
