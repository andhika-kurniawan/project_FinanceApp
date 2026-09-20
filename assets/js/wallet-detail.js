/**
 * Wallet Detail Page Scripts
 * Handles specific logic for wallet-details.html
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if PersonalWealth is loaded
    if (!window.PW) {
        console.error('Core app (PW) not loaded. Please include app.js before wallet-detail.js');
        return;
    }

    const { store, walletStore, sync, computed, format, renderer, categories } = window.PW;

    const urlParams = new URLSearchParams(window.location.search);
    const walletId = parseInt(urlParams.get('id'));

    if (isNaN(walletId)) {
        alert('ID Dompet tidak ditemukan');
        window.location.href = 'wallet.html';
        return;
    }

    let wallet = walletStore.getById(walletId);

    if (!wallet) {
        alert('Dompet tidak ditemukan');
        window.location.href = 'wallet.html';
        return;
    }

    function renderPage() {
        wallet = walletStore.getById(walletId);
        if (!wallet) return;

        // Update Wallet Card
        const walletLabel = document.getElementById('walletLabel');
        const walletBadge = document.getElementById('walletBadge');
        const walletBalance = document.getElementById('walletBalance');
        const walletSubtitle = document.getElementById('walletSubtitle');

        if (walletLabel) walletLabel.textContent = 'Saldo ' + wallet.name;
        if (walletBadge) {
            if (wallet.primary) {
                walletBadge.textContent = 'Utama';
                walletBadge.style.display = 'inline-block';
            } else {
                walletBadge.style.display = 'none';
            }
        }
        if (walletBalance) walletBalance.textContent = format.rpFull(computed.walletBalance(wallet.name));
        if (walletSubtitle) {
            walletSubtitle.textContent = wallet.note || (walletStore.typeLabel(wallet.type) + ' ' + wallet.name);
        }

        // Update 7-day expense chart
        const chartData = computed.weeklyExpenses(wallet.name);
        const chartDateRange = document.getElementById('chartDateRange');
        const chartTotal = document.getElementById('chartTotal');
        const chartBars = document.getElementById('chartBars');
        const chartDays = document.getElementById('chartDays');

        if (chartDateRange) chartDateRange.textContent = chartData.dateRange || '';
        if (chartTotal) chartTotal.textContent = format.rpFull(chartData.total || 0);

        if (chartBars && chartDays) {
            // Rebuild the grid lines
            let htmlBars = `
              <div style="position: absolute; top: 0; left: 0; right: 0; border-top: 1px solid var(--neutral-100);"></div>
              <div style="position: absolute; top: 25%; left: 0; right: 0; border-top: 1px solid var(--neutral-100);"></div>
              <div style="position: absolute; top: 50%; left: 0; right: 0; border-top: 1px solid var(--neutral-100);"></div>
              <div style="position: absolute; top: 75%; left: 0; right: 0; border-top: 1px solid var(--neutral-100);"></div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; border-top: 1px solid var(--neutral-100);"></div>
            `;
            let htmlDays = '';
            
            const validAmounts = (chartData.amounts || []).map(a => Number(a) || 0);
            const maxAmount = Math.max(...validAmounts, 1);
            
            (chartData.days || []).forEach((dayLabel, idx) => {
                const amount = validAmounts[idx];
                const percentage = (amount / maxAmount) * 100;
                
                const titleStr = format.rpFull(amount);
                htmlBars += `
                  <div style="width: 24px; height: 100%; display: flex; align-items: flex-end; position: relative; z-index: 1;">
                    <div style="width: 100%; height: ${percentage}%; background: var(--primary-500); border-radius: 4px 4px 0 0;" title="${titleStr}"></div>
                  </div>
                `;

                const isToday = (idx === 6);
                htmlDays += `<div style="${isToday ? 'color: var(--neutral-900); font-weight: 800;' : ''}">${dayLabel}</div>`;
            });
            
            chartBars.innerHTML = htmlBars;
            chartDays.innerHTML = htmlDays;
        }

        // Update recent transactions
        const txnData = computed.weeklyTransactions(wallet.name) || { count: 0, txns: [], totalIncome: 0, totalExpense: 0 };
        const txnSummary = document.getElementById('txnSummary');
        const txnListContainer = document.getElementById('txnListContainer');

        if (txnSummary) {
            txnSummary.textContent = `${txnData.count} transaksi · masuk ${format.rpFull(txnData.totalIncome || 0)} · keluar ${format.rpFull(txnData.totalExpense || 0)}`;
        }

        const btnViewAll = document.getElementById('btnViewAll');
        if (btnViewAll) {
            btnViewAll.onclick = () => window.location.href = `transactions.html?wallet=${encodeURIComponent(wallet.name)}`;
        }

        if (txnListContainer) {
            if (txnData.count === 0) {
                txnListContainer.innerHTML = `
                    <div style="background: white; border-radius: 24px; padding: 40px 20px; text-align: center; box-shadow: var(--shadow-card);">
                        <div style="width: 64px; height: 64px; background: var(--primary-50); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                            <i data-lucide="receipt" style="width: 28px; height: 28px; color: var(--primary-500);"></i>
                        </div>
                        <div style="font-size: 16px; font-weight: 700; color: var(--neutral-900); margin-bottom: 8px;">Tidak ada transaksi</div>
                        <div style="font-size: 13px; color: var(--neutral-500);">Wallet ini belum pernah dipakai.</div>
                    </div>
                `;
            } else {
                const grouped = {};
                (txnData.txns || []).forEach(t => {
                    const d = t.date || 'Unknown';
                    if (!grouped[d]) grouped[d] = [];
                    grouped[d].push(t);
                });
                
                let html = '';
                Object.keys(grouped).sort().reverse().forEach(date => {
                    // Try to catch any invalid date errors inside groupHTML
                    try {
                        html += renderer.groupHTML(date, grouped[date]);
                    } catch(e) {
                        console.error('Error rendering date group', date, e);
                    }
                });
                
                txnListContainer.innerHTML = html;
                renderer.attachHandlers(txnListContainer, renderPage);
            }
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Modal Handlers (Note: edit modal must use same IDs as wallet.html for simplicity if possible, or distinct)
    window.openEditWalletModal = function() {
        const modal = document.getElementById('walletModal');
        if (!modal) return;
        
        wallet = walletStore.getById(walletId);
        
        document.getElementById('walletModalTitle').textContent = 'Edit Wallet';
        document.getElementById('walletSubmitBtn').textContent = 'Simpan Perubahan';
        document.getElementById('walletBalanceLabel').textContent = 'Saldo Saat Ini';
        
        document.getElementById('walletEditId').value = wallet.id;
        document.getElementById('walletName').value = wallet.name;
        document.getElementById('walletBalance').value = wallet.balance;
        document.getElementById('walletNote').value = wallet.note || '';
        document.getElementById('walletPrimary').checked = wallet.primary;
        
        document.querySelectorAll('.cat-pill').forEach(pill => {
            pill.classList.remove('active');
            if (pill.dataset.type === wallet.type) {
                pill.classList.add('active');
            }
        });
        document.getElementById('walletType').value = wallet.type;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeWalletModal = function() {
        const modal = document.getElementById('walletModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.setWalletType = function(el) {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('walletType').value = el.dataset.type;
    };

    window.handleWalletSubmit = function(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('walletEditId').value);
        const name = document.getElementById('walletName').value.trim();
        const type = document.getElementById('walletType').value;
        const balance = parseInt(document.getElementById('walletBalance').value) || 0;
        const note = document.getElementById('walletNote').value.trim();
        const primary = document.getElementById('walletPrimary').checked;

        if (!name) return;

        walletStore.update({ id, name, type, balance, note, primary });
        window.closeWalletModal();
    };

    // Subscriptions and Initial Render
    sync.on('data-changed', renderPage);
    
    // Close modal on click outside
    const modalOverlay = document.getElementById('walletModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) window.closeWalletModal();
        });
    }

    renderPage();
});
