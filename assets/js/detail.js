document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  
  if (!id) {
    alert("Transaksi tidak ditemukan!");
    window.location.href = 'dashboard.html';
    return;
  }
  
  const txns = PW.store.getAll();
  const txn = txns.find(t => t.id === id);
  
  if (!txn) {
    alert("Transaksi tidak ditemukan!");
    window.location.href = 'dashboard.html';
    return;
  }
  
  renderDetail(txn);
  
  PW.modal.init((updatedTxn) => {
    renderDetail(updatedTxn);
  });
});

function renderDetail(txn) {
  const { format, categories, walletIcon } = PW;
  
  const sign = txn.type === 'income' ? '+' : '-';
  const colorCls = txn.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)';
  const bgCls = txn.type === 'income' ? 'var(--color-income-light)' : 'var(--color-expense-light)';
  
  const iconNm = categories.iconName(txn.category);
  const catLbl = categories.label(txn.category);
  const wIcon = walletIcon[txn.wallet] || 'wallet';
  
  const html = `
    <div class="detail-card slide-up">
      <div class="detail-icon" style="background: ${bgCls}; color: ${colorCls};">
        <i data-lucide="${iconNm}"></i>
      </div>
      <div class="detail-amount" style="color: ${colorCls};">${sign}${format.rpFull(txn.amount)}</div>
      <div class="detail-title">${txn.name}</div>
      
      <div class="detail-info">
        <div class="detail-row">
          <div class="detail-label">Status</div>
          <div class="detail-value" style="color: var(--color-income);">
            <i data-lucide="check-circle-2" style="width:16px;height:16px"></i> Berhasil
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Tanggal</div>
          <div class="detail-value">${format.dateLabel(txn.date)}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Kategori</div>
          <div class="detail-value">
            <div style="width:24px;height:24px;background:var(--neutral-100);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--neutral-600)">
               <i data-lucide="${iconNm}" style="width:14px;height:14px"></i>
            </div>
            ${catLbl}
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Sumber Dana</div>
          <div class="detail-value">
            <div style="width:24px;height:24px;background:var(--primary-100);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--primary-600)">
               <i data-lucide="${wIcon}" style="width:14px;height:14px"></i>
            </div>
            ${txn.wallet}
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Tipe Transaksi</div>
          <div class="detail-value">${txn.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</div>
        </div>
      </div>
    </div>
    
    <div class="detail-actions slide-up d1">
       <button class="btn-action btn-delete" onclick="deleteTxn(${txn.id})">
         <i data-lucide="trash-2" style="width:18px;height:18px"></i> Hapus
       </button>
       <button class="btn-action btn-edit" onclick="editTxn(${txn.id})">
         <i data-lucide="pencil" style="width:18px;height:18px"></i> Edit
       </button>
    </div>
  `;
  
  document.getElementById('detailContent').innerHTML = html;
  lucide.createIcons();
}

window.deleteTxn = async function(id) {
  const txn = PW.store.getAll().find(t => t.id === id);
  const confirmed = await PW.confirmDialog.show({
    title: 'Hapus Transaksi?',
    message: txn ? `Transaksi "${txn.name}" akan dihapus secara permanen.` : 'Transaksi ini akan dihapus secara permanen.'
  });
  if (!confirmed) return;
  PW.store.remove(id);
  window.location.href = document.referrer || 'dashboard.html';
};

window.editTxn = function(id) {
  const txn = PW.store.getAll().find(t => t.id === id);
  if (txn) {
    PW.modal.openForEdit(txn);
  }
};

window.closeModal = function() {
  PW.modal.close();
};

window.setTxnType = function(type) {
  PW.modal.setType(type);
};
