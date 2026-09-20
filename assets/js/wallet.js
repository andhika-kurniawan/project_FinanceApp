/**
 * Page-Specific JS: Wallet
 * Mengatur tampilan daftar wallet dan interaksi modal.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Alias dari window.PW
    const { store, walletStore, sync, computed, format } = PW;

    // 2. Constants
    const walletIcons = { 'bank':'landmark', 'e-wallet':'smartphone', 'tunai':'banknote' };
    const typeLabels  = { 'bank':'Bank', 'e-wallet':'E-Wallet', 'tunai':'Tunai' };

    // DOM Elements
    const walletCount = document.getElementById('walletCount');
    const totalBalance = document.getElementById('totalBalance');
    const typePills = document.getElementById('typePills');
    const walletListContainer = document.getElementById('walletListContainer');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    let deleteTargetId = null;

    // 3. renderWallets
    function renderWallets() {
        const wallets = walletStore.getAll();
        
        if (walletCount) walletCount.textContent = wallets.length + ' wallet aktif';
        
        const total = computed.totalBalance();
        if (totalBalance) totalBalance.textContent = format.rpFull(total);

        const grouped = {
            'bank': 0,
            'e-wallet': 0,
            'tunai': 0
        };
        wallets.forEach(w => {
            if (grouped[w.type] !== undefined) {
                grouped[w.type] += computed.walletBalance(w.name);
            }
        });

        if (typePills) {
            typePills.className = 'wallet-pills';
            typePills.innerHTML = Object.keys(grouped).map(type => {
                return `
                    <div class="wallet-pill">
                        <div class="wallet-pill__icon">
                            <i data-lucide="${walletIcons[type]}" style="width:16px;height:16px"></i>
                        </div>
                        <div class="wallet-pill__text">
                            <span class="wallet-pill__name">${typeLabels[type]}</span>
                            <span class="wallet-pill__amount">${format.rpCompact(grouped[type])}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (walletListContainer) {
            if (wallets.length === 0) {
                walletListContainer.innerHTML = '<div style="text-align:center; padding:32px 0; color:var(--neutral-400); font-size:14px;">Belum ada wallet</div>';
            } else {
                walletListContainer.innerHTML = wallets.map((w, i) => {
                    const balance = computed.walletBalance(w.name);
                    const txnCount = computed.walletTxnCount(w.name);
                    const lastExp = computed.lastExpense(w.name);
                    
                    let lastExpenseHtml = `<span class="wlc-stat-period">Pengeluaran terakhir:</span><br/>Belum ada`;
                    if (lastExp) {
                        lastExpenseHtml = `<span class="wlc-stat-period">Pengeluaran terakhir:</span><br/><span class="wlc-stat--expense">-${format.rpFull(lastExp.amount)}</span> &bull; ${lastExp.name}`;
                    }
                    
                    const badgeHtml = w.primary ? `<span class="wallet-card__badge" style="position:static; margin-left:8px; font-size:10px; padding:2px 8px;">Utama</span>` : '';

                    return `
                        <div class="wallet-list-card slide-up d${i + 1}" onclick="window.location.href='wallet-details.html?id=${w.id}'">
                            <div class="wlc-header">
                                <div class="wlc-icon-wrap">
                                    <i data-lucide="${walletIcons[w.type] || 'help-circle'}"></i>
                                </div>
                                <div class="wlc-title-wrap">
                                    <div class="wlc-title" style="display:flex; align-items:center;">${w.name} ${badgeHtml}</div>
                                    <div class="wlc-subtitle">${typeLabels[w.type] || w.type} &bull; ${txnCount} transaksi</div>
                                </div>
                                <i data-lucide="chevron-right" class="wlc-chevron"></i>
                            </div>
                            
                            <div class="wlc-balance">${format.rpFull(balance)}</div>
                            
                            <div class="wlc-stats">
                                <div class="wlc-stat">
                                    ${lastExpenseHtml}
                                </div>
                            </div>
                            
                            <div class="wlc-actions">
                                <button class="wlc-btn wlc-btn--edit" onclick="event.stopPropagation(); openEditWalletModal(${w.id})">
                                    <i data-lucide="edit-2" style="width:16px;height:16px"></i> Edit
                                </button>
                                <button class="wlc-btn wlc-btn--delete" onclick="event.stopPropagation(); confirmDelete(${w.id})" style="color:#fca5a5; border-color:rgba(248,113,113,0.3);">
                                    <i data-lucide="trash-2" style="width:16px;height:16px"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // 4. Modal helpers
    function showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            setTimeout(() => {
                if (window.lucide) lucide.createIcons();
            }, 50);
        }
    }

    function hideModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    modal.classList.remove('active');
                    content.style.transform = '';
                }, 300);
            } else {
                modal.classList.remove('active');
            }
        }
    }

    // 11. showToast
    function showToast(msg) {
        if (toast && toastMessage) {
            toastMessage.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
    }

    // 5. openAddWalletModal
    window.openAddWalletModal = function() {
        document.getElementById('walletModalTitle').textContent = 'Tambah Wallet';
        document.getElementById('walletSubmitBtn').textContent = 'Tambah Wallet';
        document.getElementById('walletBalanceLabel').textContent = 'Saldo Awal';
        
        document.getElementById('walletForm').reset();
        document.getElementById('walletEditId').value = '';
        
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        const bankPill = document.querySelector('.cat-pill[data-type="bank"]');
        if (bankPill) bankPill.classList.add('active');
        document.getElementById('walletType').value = 'bank';
        
        showModal('walletModal');
    };

    // 6. openEditWalletModal
    window.openEditWalletModal = function(id) {
        const w = walletStore.getById(id);
        if (!w) return;

        document.getElementById('walletModalTitle').textContent = 'Edit Wallet';
        document.getElementById('walletSubmitBtn').textContent = 'Simpan Perubahan';
        document.getElementById('walletBalanceLabel').textContent = 'Saldo Saat Ini';
        
        document.getElementById('walletEditId').value = w.id;
        document.getElementById('walletName').value = w.name;
        document.getElementById('walletBalance').value = w.balance;
        document.getElementById('walletNote').value = w.note || '';
        document.getElementById('walletPrimary').checked = w.primary;
        
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        const typePill = document.querySelector('.cat-pill[data-type="' + w.type + '"]');
        if (typePill) typePill.classList.add('active');
        document.getElementById('walletType').value = w.type;
        
        showModal('walletModal');
    };

    // 7. closeWalletModal
    window.closeWalletModal = function() {
        hideModal('walletModal');
    };

    // 8. setWalletType
    window.setWalletType = function(el) {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('walletType').value = el.dataset.type;
    };

    // 9. handleWalletSubmit
    window.handleWalletSubmit = function(e) {
        e.preventDefault();
        
        const editId = document.getElementById('walletEditId').value;
        const name = document.getElementById('walletName').value;
        const type = document.getElementById('walletType').value;
        const balance = parseInt(document.getElementById('walletBalance').value) || 0;
        const note = document.getElementById('walletNote').value;
        const primary = document.getElementById('walletPrimary').checked;
        
        if (editId) {
            const existing = walletStore.getById(parseInt(editId));
            if (existing) {
                walletStore.update({ ...existing, name, type, balance, note, primary });
                showToast('Wallet berhasil diperbarui!');
            }
        } else {
            walletStore.add({
                id: walletStore.nextId(),
                name,
                type,
                balance,
                note,
                primary
            });
            showToast('Wallet berhasil ditambahkan!');
        }
        
        closeWalletModal();
        setTimeout(renderWallets, 350);
    };

    // 10. Delete Modal Logic
    window.confirmDelete = function(id) {
        const w = walletStore.getById(id);
        if (!w) return;
        deleteTargetId = id;
        document.getElementById('deleteWalletName').textContent = w.name;
        showModal('deleteModal');
    };

    window.executeDelete = function() {
        if (deleteTargetId !== null) {
            walletStore.remove(deleteTargetId);
            deleteTargetId = null;
            hideModal('deleteModal');
            showToast('Wallet berhasil dihapus!');
            setTimeout(renderWallets, 350);
        }
    };

    window.closeDeleteModal = function() {
        deleteTargetId = null;
        hideModal('deleteModal');
    };

    // 12. Click-outside-to-close listeners
    const modals = ['walletModal', 'deleteModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    hideModal(id);
                }
            });
        }
    });

    // 13. Subscribe to sync events
    sync.on('data-changed', renderWallets);

    // 14. Init
    renderWallets();
});
