import re

with open("transactions.html", "r") as f:
    html = f.read()

# 1. Update Topbar
topbar_html = """
    <!-- TOP BAR -->
    <div class="topbar" style="background: transparent; border: none; padding-top: 20px;">
      <button class="topbar__back" onclick="window.location.href='dashboard.html'" title="Kembali" style="border-radius: 50%; width: 44px; height: 44px; background: rgba(255,255,255,0.4);">
        <i data-lucide="chevron-left" style="width:24px;height:24px"></i>
      </button>
      <div class="topbar__title-col" style="flex:1; margin-left: 12px;">
        <div class="topbar__title" style="font-size: 18px;">Semua Transaksi</div>
        <div class="topbar__subtitle" id="topSubtitle" style="font-size: 13px; color: var(--neutral-500); font-weight: 500;">Semua waktu</div>
      </div>
      <button class="topbar__action" onclick="openFilterModal()" title="Filter" style="border-radius: 50%; width: 44px; height: 44px; background: rgba(255,255,255,0.4);">
        <i data-lucide="sliders-horizontal" style="width:20px;height:20px"></i>
      </button>
    </div>
"""
html = re.sub(r'<!-- TOP BAR -->.*?</div>\n\n    <!-- FILTER BAR -->', topbar_html + '\n    <!-- FILTER BAR -->', html, flags=re.DOTALL)


# 2. Update Filter Bar background and Search input
html = html.replace('<div class="filter-bar">', '<div class="filter-bar" style="background: transparent; border: none; box-shadow: none;">')
html = html.replace('placeholder="Cari nama atau kategori..."', 'placeholder="Cari catatan, kategori, wallet..."')


# 3. Update Summary Strip
summary_html = """
    <!-- SUMMARY STRIP -->
    <div class="summary-group-wrapper" style="padding: 16px 20px;">
      <div class="summary-group" style="display: flex; background: var(--white); border-radius: 20px; box-shadow: var(--shadow-card); align-items: center; justify-content: space-between; padding: 16px 0;">
        <div class="summary-item" style="flex: 1; text-align: center;">
          <div class="summary-card__label" style="margin-bottom: 8px;">MASUK</div>
          <div class="summary-card__amount summary-card__amount--income" id="summaryIncome">Rp0</div>
        </div>
        <div style="width: 1px; height: 40px; background: var(--neutral-200);"></div>
        <div class="summary-item" style="flex: 1; text-align: center;">
          <div class="summary-card__label" style="margin-bottom: 8px;">KELUAR</div>
          <div class="summary-card__amount summary-card__amount--expense" id="summaryExpense">Rp0</div>
        </div>
        <div style="width: 1px; height: 40px; background: var(--neutral-200);"></div>
        <div class="summary-item" style="flex: 1; text-align: center;">
          <div class="summary-card__label" style="margin-bottom: 8px;">SELISIH</div>
          <div class="summary-card__amount" id="summaryDiff">Rp0</div>
        </div>
      </div>
    </div>
    
    <div class="list-info" id="listInfo" style="padding: 0 20px 12px; font-size: 13px; color: var(--neutral-600); font-weight: 500;">
      0 transaksi &bull; Semua waktu
    </div>
"""
html = re.sub(r'<!-- SUMMARY STRIP -->.*?</div>\n    </div>', summary_html.strip(), html, flags=re.DOTALL)


# 4. Add Advanced Filter Modal right before the end of the body
filter_modal_html = """
  <!-- ADVANCED FILTER MODAL -->
  <div class="modal-overlay" id="filterModal">
    <div class="modal-content">
      <div class="modal-drag-handle"></div>
      <div class="modal-header">
        <h3 class="modal-title">Filter Transaksi</h3>
        <button class="modal-close" onclick="closeFilterModal()"><i data-lucide="x" style="width:18px;height:18px"></i></button>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px;">
        <div class="form-group">
          <label class="form-label">Pilih Wallet</label>
          <div class="category-grid" id="filterWalletGrid">
             <div class="cat-pill active" data-filter-wallet="all" onclick="toggleFilterWallet('all')">Semua Wallet</div>
             <div class="cat-pill" data-filter-wallet="BCA" onclick="toggleFilterWallet('BCA')">BCA</div>
             <div class="cat-pill" data-filter-wallet="GoPay" onclick="toggleFilterWallet('GoPay')">GoPay</div>
             <div class="cat-pill" data-filter-wallet="OVO" onclick="toggleFilterWallet('OVO')">OVO</div>
             <div class="cat-pill" data-filter-wallet="Cash" onclick="toggleFilterWallet('Cash')">Tunai</div>
          </div>
        </div>
        
        <div class="modal-actions" style="margin-top: 20px;">
          <button type="button" class="btn-cancel" onclick="resetFilters()">Reset</button>
          <button type="button" class="btn-submit" onclick="applyAdvancedFilters()">Terapkan</button>
        </div>
      </div>
    </div>
  </div>
"""
html = html.replace('</div><!-- /app -->', filter_modal_html + '\n</div><!-- /app -->')


# 5. Type Tabs Design (Segmented Control)
# We will use inline styles to match the reference (dark container, active is bright)
type_tabs_old = r'<div class="type-tabs">.*?</div>\n    </div>'
type_tabs_new = """
      <!-- Type filter tabs -->
      <div class="type-tabs" style="background: var(--primary-900); border-radius: 999px; padding: 6px; gap: 4px; display: flex;">
        <button class="type-tab active" data-type="all"     onclick="setTypeFilter(this,'all')" style="border-radius: 999px; color: rgba(255,255,255,0.7);">Semua</button>
        <button class="type-tab"        data-type="expense" onclick="setTypeFilter(this,'expense')" style="border-radius: 999px; color: rgba(255,255,255,0.7);">Pengeluaran</button>
        <button class="type-tab"        data-type="income"  onclick="setTypeFilter(this,'income')" style="border-radius: 999px; color: rgba(255,255,255,0.7);">Pemasukan</button>
      </div>
    </div>
"""
html = re.sub(type_tabs_old, type_tabs_new.strip(), html, flags=re.DOTALL)

with open("transactions.html", "w") as f:
    f.write(html)
print("transactions.html updated")
