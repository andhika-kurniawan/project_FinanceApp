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
    // For now, we show an edit modal inline.
    // This is a simple approach: delete old + go to add-new on the transactions page.
    alert('Fitur edit akan segera hadir! Untuk saat ini, Anda bisa menghapus dan membuat ulang transaksi.');
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

    /* Hero card */
    const heroCard = document.getElementById('heroCard');
    heroCard.classList.add(isExpense ? 'detail-hero--expense' : 'detail-hero--income');

    document.getElementById('heroIcon').innerHTML =
      `<i data-lucide="${iconName}" style="width:28px;height:28px"></i>`;

    document.getElementById('heroLabel').textContent = typeLabel;
    document.getElementById('heroAmount').textContent = sign + format.rpFull(t.amount);

    const badge = document.getElementById('heroBadge');
    badge.classList.add(isExpense ? 'detail-hero__badge--expense' : 'detail-hero__badge--income');
    badge.innerHTML = `<i data-lucide="${isExpense ? 'arrow-down-right' : 'arrow-up-right'}" style="width:14px;height:14px"></i> ${typeLabel}`;

    /* Info rows */
    document.getElementById('detailCategory').textContent = catLabel;
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
  function deleteTxn(t) {
    if (!confirm(`Yakin ingin menghapus transaksi "${t.name}"?`)) return;
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
});
