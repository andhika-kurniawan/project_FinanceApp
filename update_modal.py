import re
import sys

with open("dashboard.html", "r") as f:
    content = f.read()

# 1. Update Modal CSS
new_modal_css = """
    /* ============================================================
       MODAL STYLES (UPDATED)
    ============================================================ */
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: none;
      align-items: flex-end;
      justify-content: center;
    }
    .modal-overlay.active { display: flex; }
    
    .modal-content {
      width: 100%; max-width: 480px;
      background: var(--white);
      border-radius: 32px 32px 0 0;
      padding: 16px 24px 24px;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; flex-direction: column; gap: 20px;
      max-height: 90vh; overflow-y: auto;
    }
    .modal-overlay.active .modal-content { transform: translateY(0); }
    .modal-content::-webkit-scrollbar { display: none; }
    
    .modal-drag-handle {
      width: 40px; height: 5px; border-radius: 3px;
      background: var(--neutral-200); margin: 0 auto 12px;
    }

    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
    }
    .modal-title { font-size: 20px; font-weight: 800; color: var(--neutral-900); letter-spacing: -0.02em; }
    .modal-close {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--neutral-100); color: var(--neutral-600);
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer; transition: background 0.2s;
    }
    .modal-close:hover { background: var(--neutral-200); }
    
    /* Segmented Control */
    .segment-control {
      display: flex; background: var(--neutral-100); border-radius: 999px; padding: 4px; gap: 4px;
    }
    .segment-btn {
      flex: 1; padding: 12px; border-radius: 999px; border: none; background: transparent;
      font-size: 14px; font-weight: 700; color: var(--neutral-500); cursor: pointer;
      transition: all 0.2s; font-family: var(--font);
    }
    .segment-btn.active[data-val="expense"] { background: var(--color-expense); color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
    .segment-btn.active[data-val="income"] { background: var(--color-income); color: white; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }

    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-label { font-size: 13px; font-weight: 600; color: var(--neutral-500); }
    
    /* Nominal Input */
    .nominal-wrapper {
      position: relative; display: flex; align-items: center;
      background: var(--neutral-50); border-radius: 16px; padding: 0 16px; border: 1px solid transparent;
      transition: border-color 0.2s, background 0.2s;
    }
    .nominal-wrapper:focus-within { border-color: var(--primary-500); background: var(--white); box-shadow: 0 0 0 4px var(--primary-50); }
    .nominal-prefix { font-size: 18px; font-weight: 700; color: var(--neutral-400); margin-right: 8px; }
    .nominal-input {
      flex: 1; padding: 16px 0; border: none; background: transparent;
      font-size: 24px; font-weight: 700; color: var(--neutral-900); font-family: var(--font); outline: none;
    }
    .nominal-input::placeholder { color: var(--neutral-300); }

    /* Category Pills */
    .category-grid {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .cat-pill {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 14px; background: var(--neutral-50); border: 1px solid var(--neutral-100);
      border-radius: 12px; font-size: 13px; font-weight: 600; color: var(--neutral-600);
      cursor: pointer; transition: all 0.2s;
    }
    .cat-pill:hover { background: var(--neutral-100); border-color: var(--neutral-200); }
    .cat-pill.active {
      background: var(--primary-50); border-color: var(--primary-200); color: var(--primary-700);
    }
    
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    
    .form-input, .form-select {
      width: 100%; padding: 14px 16px;
      border: 1px solid var(--neutral-100); border-radius: 14px;
      font-size: 14px; font-weight: 600; font-family: var(--font); color: var(--neutral-800);
      background: var(--neutral-50); outline: none; transition: all 0.2s;
    }
    .form-input:focus, .form-select:focus { border-color: var(--primary-400); background: var(--white); box-shadow: 0 0 0 3px var(--primary-50); }
    
    /* Action Buttons */
    .modal-actions { display: flex; gap: 12px; margin-top: 10px; }
    .btn-cancel {
      flex: 1; padding: 16px; background: var(--neutral-50); color: var(--neutral-700);
      border: none; border-radius: 16px; font-size: 15px; font-weight: 700; font-family: var(--font);
      cursor: pointer; transition: background 0.2s;
    }
    .btn-cancel:hover { background: var(--neutral-100); }
    .btn-submit {
      flex: 2; padding: 16px; background: var(--primary-500); color: white;
      border: none; border-radius: 16px; font-size: 15px; font-weight: 700; font-family: var(--font);
      cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .btn-submit:hover { background: var(--primary-600); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); }
"""

# Replace old modal CSS (everything from /* MODAL STYLES */ to the end of style)
css_pattern = r'/\*\s*={60}\s*MODAL STYLES\s*={60}\s*\*/.*?\.txn__actions.*?\}'
content = re.sub(css_pattern, new_modal_css, content, flags=re.DOTALL)

# 2. Update Modal HTML
new_modal_html = """
  <!-- MODAL ADD TRANSACTION -->
  <div class="modal-overlay" id="txnModal">
    <div class="modal-content">
      <div class="modal-drag-handle"></div>
      
      <div class="modal-header">
        <h3 class="modal-title">Tambah Transaksi</h3>
        <button class="modal-close" onclick="closeModal()"><i data-lucide="x" style="width:18px;height:18px"></i></button>
      </div>
      
      <form id="txnForm" onsubmit="handleFormSubmit(event)" style="display:flex; flex-direction:column; gap:20px;">
        <!-- Segmented Type -->
        <div class="segment-control">
          <button type="button" class="segment-btn active" data-val="expense" onclick="setTxnType('expense')">Pengeluaran</button>
          <button type="button" class="segment-btn" data-val="income" onclick="setTxnType('income')">Pemasukan</button>
        </div>
        <input type="hidden" id="txnType" value="expense">

        <!-- Nominal -->
        <div class="form-group">
          <label class="form-label">Nominal</label>
          <div class="nominal-wrapper">
            <span class="nominal-prefix">Rp</span>
            <input type="number" class="nominal-input" id="txnAmount" placeholder="0" min="1" required>
          </div>
        </div>

        <!-- Categories -->
        <div class="form-group">
          <label class="form-label">Kategori</label>
          <div class="category-grid" id="categoryGrid">
            <!-- Populated by JS -->
          </div>
          <input type="hidden" id="txnCategory" required>
        </div>

        <!-- Wallet & Date -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Wallet</label>
            <select class="form-select" id="txnWallet" required>
              <option value="BCA">BCA</option>
              <option value="GoPay">GoPay</option>
              <option value="OVO">OVO</option>
              <option value="Cash">Tunai</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal</label>
            <input type="date" class="form-input" id="txnDate" required>
          </div>
        </div>

        <!-- Note/Name -->
        <div class="form-group">
          <label class="form-label">Catatan (opsional)</label>
          <input type="text" class="form-input" id="txnName" placeholder="Contoh: Makan siang di kantin" required>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn-submit">Simpan</button>
        </div>
      </form>
    </div>
  </div>
"""

# Replace old modal HTML
html_pattern = r'<!-- MODAL ADD TRANSACTION -->.*?</div>\s*</div>\s*</div><!-- /app -->'
content = re.sub(html_pattern, new_modal_html + '\n</div><!-- /app -->', content, flags=re.DOTALL)


# 3. Update JS for Category selection and Type switching
js_insert = """
  // ── Modal UI Logic
  const allCategories = [
    { id: 'food', label: 'Makanan', icon: 'utensils', type: 'expense' },
    { id: 'transport', label: 'Transport', icon: 'car', type: 'expense' },
    { id: 'shopping', label: 'Belanja', icon: 'shopping-bag', type: 'expense' },
    { id: 'health', label: 'Kesehatan', icon: 'heart-pulse', type: 'expense' },
    { id: 'edu', label: 'Pendidikan', icon: 'book-open', type: 'expense' },
    { id: 'game', label: 'Hiburan', icon: 'gamepad-2', type: 'expense' },
    { id: 'income', label: 'Gaji/Bonus', icon: 'banknote', type: 'income' },
    { id: 'invest', label: 'Investasi', icon: 'landmark', type: 'income' },
    { id: 'other', label: 'Lainnya', icon: 'more-horizontal', type: 'both' }
  ];

  function setTxnType(type) {
    document.getElementById('txnType').value = type;
    document.querySelectorAll('.segment-btn').forEach(btn => {
      if (btn.getAttribute('data-val') === type) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    renderCategories(type);
  }

  function renderCategories(type) {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = '';
    const filtered = allCategories.filter(c => c.type === type || c.type === 'both');
    
    filtered.forEach((c, index) => {
      const pill = document.createElement('div');
      pill.className = 'cat-pill' + (index === 0 ? ' active' : '');
      pill.innerHTML = `<i data-lucide="${c.icon}" style="width:16px;height:16px"></i> ${c.label}`;
      pill.onclick = () => selectCategory(c.id, pill);
      grid.appendChild(pill);
      if(index === 0) document.getElementById('txnCategory').value = c.id;
    });
    lucide.createIcons({ root: grid });
  }

  function selectCategory(id, el) {
    document.getElementById('txnCategory').value = id;
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }

  // Override onFabClick
  function onFabClick() {
    document.getElementById('txnDate').valueAsDate = new Date();
    setTxnType('expense'); // default
    document.getElementById('txnModal').classList.add('active');
  }

  // Hook into modal close to reset things properly
  const originalClose = closeModal;
  closeModal = function() {
    document.getElementById('txnModal').classList.remove('active');
    document.getElementById('txnForm').reset();
    setTxnType('expense');
  };
"""

content = content.replace("// ── Modal Handlers", js_insert + "\n  // ── Original Modal Handlers (overridden)")

with open("dashboard.html", "w") as f:
    f.write(content)
print("Done updating modal UI")
