import re

with open("assets/js/app.js", "r") as f:
    app_js = f.read()

# 1. Update txnHTML in app.js
txnHTML_old = """
      const delBtn  = showDelete
        ? `<div class="txn__actions">
             <button class="delete-btn" data-id="${txn.id}" title="Hapus">
               <i data-lucide="trash-2" style="width:14px;height:14px"></i>
             </button>
           </div>`
        : '';

      return `
        <div class="txn slide-up" data-txn-id="${txn.id}">
          <div class="txn__icon ${iconCls}">
            <i data-lucide="${iconNm}" style="width:20px;height:20px"></i>
          </div>
          <div class="txn__info">
            <div class="txn__name">${txn.name}</div>
            <div class="txn__meta">
              <i data-lucide="${wIcon}" style="width:11px;height:11px"></i>
              ${txn.wallet} <span class="txn__wallet-dot"></span> ${catLbl}
            </div>
          </div>
          <div class="txn__right" style="display:flex;align-items:center;">
            <div>
              <div class="txn__amount ${amtCls}">${sign}${format.rpFull(txn.amount)}</div>
            </div>
            ${delBtn}
          </div>
        </div>`;
"""
txnHTML_new = """
      const delBtn  = showDelete
        ? `<div class="txn__actions" style="margin-left: 8px;">
             <button class="delete-btn" data-id="${txn.id}" title="Hapus" style="background: none; border: none; color: var(--neutral-300); cursor: pointer;">
               <i data-lucide="trash-2" style="width:16px;height:16px"></i>
             </button>
           </div>`
        : '';

      return `
        <div class="txn slide-up" data-txn-id="${txn.id}" style="display:flex; align-items:center; padding: 16px 0; border-bottom: 1px solid var(--neutral-100); margin: 0 20px;">
          <div class="txn__icon ${iconCls}" style="width:40px;height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <i data-lucide="${iconNm}" style="width:18px;height:18px"></i>
          </div>
          <div class="txn__info" style="flex:1; min-width:0; margin-left: 12px;">
            <div class="txn__name" style="font-size:15px; font-weight:700; color:var(--neutral-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${txn.name}</div>
            <div class="txn__meta" style="font-size:12px; color:var(--neutral-400); margin-top:3px;">
              ${catLbl} &bull; ${txn.wallet}
            </div>
          </div>
          <div class="txn__right" style="display:flex;align-items:center; text-align:right;">
            <div class="txn__amount ${amtCls}" style="font-size:15px; font-weight:800; letter-spacing:-0.02em;">${sign}${format.rpFull(txn.amount)}</div>
            ${delBtn}
          </div>
        </div>`;
"""
app_js = app_js.replace(txnHTML_old.strip(), txnHTML_new.strip())


# 2. Update groupHTML in app.js
groupHTML_old = """
    groupHTML(dateStr, txns, labelOverride = null) {
      const label = labelOverride || format.dateLabel(dateStr);
      let html = `<div class="date-group">
        <div class="date-label">${label}<div class="date-label__line"></div></div>`;
      txns.forEach(t => { html += renderer.txnHTML(t, true); });
      html += '</div>';
      return html;
    },
"""
groupHTML_new = """
    groupHTML(dateStr, txns, labelOverride = null) {
      const label = labelOverride || format.dateLabel(dateStr);
      let dayTotal = 0;
      txns.forEach(t => { dayTotal += (t.type === 'income' ? t.amount : -t.amount); });
      const sign = dayTotal > 0 ? '+' : (dayTotal < 0 ? '-' : '');
      const dayTotalFormatted = sign + format.rpFull(Math.abs(dayTotal));
      const colorCls = dayTotal >= 0 ? 'color: var(--color-income);' : 'color: var(--color-expense);';

      let html = `<div class="date-group" style="margin-bottom: 0;">
        <div class="date-label" style="display:flex; justify-content:space-between; align-items:center; padding: 24px 20px 8px; font-size:12px; font-weight:600; color:var(--neutral-500); text-transform:none; letter-spacing:0;">
           <span>${label}</span>
           <span style="${colorCls} font-weight:700;">${dayTotalFormatted}</span>
        </div>`;
      txns.forEach(t => { html += renderer.txnHTML(t, true); });
      html += '</div>';
      return html;
    },
"""
app_js = app_js.replace(groupHTML_old.strip(), groupHTML_new.strip())

with open("assets/js/app.js", "w") as f:
    f.write(app_js)
print("app.js updated")

# 3. Update transactions.js
with open("assets/js/transactions.js", "r") as f:
    tx_js = f.read()

# Make type active colors match our blue theme instead of white
tx_js = tx_js.replace(
    "el.classList.add('active');",
    "el.classList.add('active');\n    el.style.background = 'var(--primary-500)';\n    el.style.color = '#fff';"
)
tx_js = tx_js.replace(
    "document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));",
    "document.querySelectorAll('.type-tab').forEach(t => { t.classList.remove('active'); t.style.background = 'transparent'; t.style.color = 'rgba(255,255,255,0.7)'; });"
)

# Update renderList to calculate Selisih and listInfo
render_list_pattern = r'/\* Summary strip \*/.*?container\.innerHTML = \'\';'
render_list_new = """
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
"""
tx_js = re.sub(render_list_pattern, render_list_new.strip(), tx_js, flags=re.DOTALL)


# Advanced Filter Logic
advanced_filter_js = """
  /* ─────────────────────────────────────────────
     ADVANCED FILTER MODAL
  ───────────────────────────────────────────── */
  let activeWalletFilter = 'all';

  window.openFilterModal = function() {
    document.getElementById('filterModal').classList.add('active');
  };

  window.closeFilterModal = function() {
    document.getElementById('filterModal').classList.remove('active');
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
    applyAdvancedFilters();
  };
"""

tx_js = tx_js.replace("/* ─────────────────────────────────────────────\n     FAB / MODAL GLOBALS", advanced_filter_js + "\n  /* ─────────────────────────────────────────────\n     FAB / MODAL GLOBALS")

# Add wallet filter to filterTransactions
filter_fn_old = """
      const matchQuery = !searchQuery ||
        t.name.toLowerCase().includes(searchQuery) ||
        t.category.toLowerCase().includes(searchQuery);
      return matchDate && matchType && matchQuery;
"""
filter_fn_new = """
      const matchQuery = !searchQuery ||
        t.name.toLowerCase().includes(searchQuery) ||
        t.category.toLowerCase().includes(searchQuery);
      const matchWallet = (typeof activeWalletFilter === 'undefined' || activeWalletFilter === 'all') || t.wallet === activeWalletFilter;
      return matchDate && matchType && matchQuery && matchWallet;
"""
tx_js = tx_js.replace(filter_fn_old, filter_fn_new)

with open("assets/js/transactions.js", "w") as f:
    f.write(tx_js)
print("transactions.js updated")
