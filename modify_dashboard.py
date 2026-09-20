import re
import sys

with open("dashboard.html", "r") as f:
    content = f.read()

# 1. Add Modal CSS
modal_css = """
    /* ============================================================
       MODAL STYLES
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
      border-radius: 28px 28px 0 0;
      padding: 24px;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .modal-overlay.active .modal-content { transform: translateY(0); }
    
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px;
    }
    .modal-title { font-size: 18px; font-weight: 800; color: var(--neutral-900); }
    .modal-close {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--neutral-100); color: var(--neutral-600);
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer;
    }
    
    .form-group { margin-bottom: 16px; }
    .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--neutral-600); margin-bottom: 6px; }
    .form-input, .form-select {
      width: 100%; padding: 12px 16px;
      border: 1px solid var(--neutral-200); border-radius: 12px;
      font-size: 14px; font-family: var(--font); color: var(--neutral-900);
      background: var(--neutral-50);
      outline: none; transition: border-color 0.2s;
    }
    .form-input:focus, .form-select:focus { border-color: var(--primary-500); background: var(--white); }
    
    .btn-submit {
      width: 100%; padding: 14px;
      background: var(--primary-600); color: white;
      border: none; border-radius: 14px;
      font-size: 15px; font-weight: 700; font-family: var(--font);
      cursor: pointer; margin-top: 10px; transition: background 0.2s;
    }
    .btn-submit:hover { background: var(--primary-700); }
    
    .delete-btn {
        background: none; border: none; color: var(--color-expense);
        cursor: pointer; padding: 4px; border-radius: 4px;
        opacity: 0.5; transition: opacity 0.2s;
    }
    .delete-btn:hover { opacity: 1; background: var(--color-expense-light); }
    .txn__actions { display: flex; align-items: center; gap: 8px; margin-left: 12px; }
"""
content = content.replace("</style>", modal_css + "\n</style>")

# 2. Empty out the hardcoded transactions, prepare containers
txn_section_regex = r'(<!-- ─── EXPENSE PANEL ─── -->.*?<div class="tab-panel tab-panel--active" id="panel-expense">).*?(</div>\s*<!-- ─── INCOME PANEL ─── -->.*?<div class="tab-panel" id="panel-income">).*?(</div>\s*</div><!-- /txn-section -->)'
new_txn_section = r'\1\n        <div id="expense-list"></div>\n      \2\n        <div id="income-list"></div>\n      \3'
content = re.sub(txn_section_regex, new_txn_section, content, flags=re.DOTALL)


# 3. Add Modal HTML before closing </div><!-- /app -->
modal_html = """
  <!-- MODAL ADD TRANSACTION -->
  <div class="modal-overlay" id="txnModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Tambah Transaksi</h3>
        <button class="modal-close" onclick="closeModal()"><i data-lucide="x" style="width:18px;height:18px"></i></button>
      </div>
      <form id="txnForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label">Tipe Transaksi</label>
          <select class="form-select" id="txnType" required>
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Nama Transaksi</label>
          <input type="text" class="form-input" id="txnName" placeholder="Contoh: Makan Siang" required>
        </div>
        <div class="form-group">
          <label class="form-label">Nominal (Rp)</label>
          <input type="number" class="form-input" id="txnAmount" placeholder="0" min="1" required>
        </div>
        <div class="form-group">
          <label class="form-label">Kategori</label>
          <select class="form-select" id="txnCategory" required>
            <option value="food">Makanan & Minuman</option>
            <option value="transport">Transportasi</option>
            <option value="shopping">Belanja</option>
            <option value="health">Kesehatan</option>
            <option value="edu">Pendidikan</option>
            <option value="invest">Investasi</option>
            <option value="game">Hiburan</option>
            <option value="income">Gaji / Bonus</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Dompet</label>
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
        <button type="submit" class="btn-submit">Simpan Transaksi</button>
      </form>
    </div>
  </div>
"""
content = content.replace("</div><!-- /app -->", modal_html + "\n</div><!-- /app -->")

# 4. Inject JS logic
# Replace the whole <script>...</script> with new comprehensive logic
js_logic = """
<script>
  // ── Init Lucide
  lucide.createIcons();

  // ── Dynamic Greeting
  function setGreeting() {
    const h = new Date().getHours();
    const el = document.getElementById('greeting');
    if      (h < 5)  el.textContent = 'Selamat malam 🌙';
    else if (h < 11) el.textContent = 'Selamat pagi 🌤';
    else if (h < 15) el.textContent = 'Selamat siang ☀️';
    else if (h < 18) el.textContent = 'Selamat sore 🌆';
    else             el.textContent = 'Selamat malam 🌙';
  }
  setGreeting();

  // ── Tab Switcher
  function switchTab(tab, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    el.classList.add('tab--active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('tab-panel--active'));
    document.getElementById('panel-' + tab).classList.add('tab-panel--active');
  }

  // ── Nav item active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('nav-item--active'));
      item.classList.add('nav-item--active');
    });
  });

  // ── App State & LocalStorage
  let transactions = JSON.parse(localStorage.getItem('pw_transactions')) || [];
  let isBalanceHidden = false;

  const categoryIcons = {
    food: { icon: 'utensils', colorClass: 'txn__icon--food' },
    transport: { icon: 'car', colorClass: 'txn__icon--transport' },
    shopping: { icon: 'shopping-bag', colorClass: 'txn__icon--shopping' },
    health: { icon: 'heart-pulse', colorClass: 'txn__icon--health' },
    edu: { icon: 'book-open', colorClass: 'txn__icon--edu' },
    invest: { icon: 'landmark', colorClass: 'txn__icon--invest' },
    game: { icon: 'gamepad-2', colorClass: 'txn__icon--game' },
    income: { icon: 'banknote', colorClass: 'txn__icon--income' }
  };

  const walletIcons = {
    BCA: 'landmark',
    GoPay: 'smartphone',
    OVO: 'smartphone',
    Cash: 'banknote'
  };

  // Format currency
  function formatRp(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  // Format date readable
  function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  }

  function renderData() {
    // 1. Calculate balances
    let totalIncome = 0;
    let totalExpense = 0;
    let walletBalances = { BCA: 0, GoPay: 0, OVO: 0, Cash: 0 };
    
    // Initial balances (mock)
    walletBalances.BCA = 12000000;
    walletBalances.GoPay = 500000;
    walletBalances.Cash = 200000;

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
        if(walletBalances[t.wallet] !== undefined) walletBalances[t.wallet] += t.amount;
      } else {
        totalExpense += t.amount;
        if(walletBalances[t.wallet] !== undefined) walletBalances[t.wallet] -= t.amount;
      }
    });

    const totalBalance = walletBalances.BCA + walletBalances.GoPay + walletBalances.OVO + walletBalances.Cash;

    // Update DOM
    const balanceEl = document.getElementById('balanceText');
    balanceEl.textContent = isBalanceHidden ? 'Rp •••••••' : formatRp(totalBalance);
    
    document.querySelector('.stat-card__amount--income').textContent = formatRp(totalIncome);
    document.querySelector('.stat-card__amount--expense').textContent = formatRp(totalExpense);

    // Update wallet pills
    document.querySelectorAll('.wallet-pill').forEach(pill => {
       const name = pill.querySelector('.wallet-pill__name').textContent;
       const amtEl = pill.querySelector('.wallet-pill__amount');
       if(walletBalances[name] !== undefined) {
           // compact format for pills (e.g. 1.2jt)
           let amt = walletBalances[name];
           let displayAmt = '';
           if(amt >= 1000000) displayAmt = 'Rp' + (amt/1000000).toFixed(1).replace('.0','') + 'jt';
           else if (amt >= 1000) displayAmt = 'Rp' + (amt/1000).toFixed(0) + 'rb';
           else displayAmt = formatRp(amt);
           amtEl.textContent = isBalanceHidden ? '•••' : displayAmt;
       }
    });

    // 2. Render Transactions
    const expenseList = document.getElementById('expense-list');
    const incomeList = document.getElementById('income-list');
    expenseList.innerHTML = '';
    incomeList.innerHTML = '';

    let expCount = 0;
    let incCount = 0;

    // Group by date
    const groupedExp = {};
    const groupedInc = {};

    transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(t => {
       if (t.type === 'expense') {
           expCount++;
           if(!groupedExp[t.date]) groupedExp[t.date] = [];
           groupedExp[t.date].push(t);
       } else {
           incCount++;
           if(!groupedInc[t.date]) groupedInc[t.date] = [];
           groupedInc[t.date].push(t);
       }
    });

    document.querySelector('#tab-expense .tab__count').textContent = expCount;
    document.querySelector('#tab-income .tab__count').textContent = incCount;

    const renderGroup = (groups, container, isIncome) => {
        if(Object.keys(groups).length === 0) {
            container.innerHTML = `<div class="empty">
              <div class="empty__icon"><i data-lucide="inbox" style="width:32px;height:32px"></i></div>
              <div class="empty__title">Belum ada transaksi</div>
            </div>`;
            return;
        }

        for (const [date, txns] of Object.entries(groups)) {
            let groupHtml = `<div class="date-group">
              <div class="date-label">${formatDate(date)}<div class="date-label__line"></div></div>`;
            
            txns.forEach(t => {
                const catInfo = categoryIcons[t.category] || categoryIcons.shopping;
                const sign = isIncome ? '+' : '-';
                const amtClass = isIncome ? 'txn__amount--income' : 'txn__amount--expense';
                
                groupHtml += `
                  <div class="txn slide-up">
                    <div class="txn__icon ${catInfo.colorClass}">
                      <i data-lucide="${catInfo.icon}" style="width:20px;height:20px"></i>
                    </div>
                    <div class="txn__info">
                      <div class="txn__name">${t.name}</div>
                      <div class="txn__meta">
                        <i data-lucide="${walletIcons[t.wallet] || 'wallet'}" style="width:11px;height:11px"></i>
                        ${t.wallet} <span class="txn__wallet-dot"></span> ${t.category}
                      </div>
                    </div>
                    <div class="txn__right" style="display:flex; align-items:center;">
                      <div>
                          <div class="txn__amount ${amtClass}">${sign}${formatRp(t.amount)}</div>
                      </div>
                      <div class="txn__actions">
                          <button class="delete-btn" onclick="deleteTxn(${t.id})" title="Hapus"><i data-lucide="trash-2" style="width:14px;height:14px"></i></button>
                      </div>
                    </div>
                  </div>
                `;
            });
            groupHtml += `</div>`;
            container.innerHTML += groupHtml;
        }
    };

    renderGroup(groupedExp, expenseList, false);
    renderGroup(groupedInc, incomeList, true);

    lucide.createIcons();
  }

  // ── Modal Handlers
  function onFabClick() {
    document.getElementById('txnDate').valueAsDate = new Date();
    document.getElementById('txnModal').classList.add('active');
  }

  function closeModal() {
    document.getElementById('txnModal').classList.remove('active');
    document.getElementById('txnForm').reset();
  }

  // ── Form Submit Handler
  function handleFormSubmit(e) {
    e.preventDefault();
    const type = document.getElementById('txnType').value;
    const name = document.getElementById('txnName').value;
    const amount = parseFloat(document.getElementById('txnAmount').value);
    const category = document.getElementById('txnCategory').value;
    const wallet = document.getElementById('txnWallet').value;
    const date = document.getElementById('txnDate').value;

    const newTxn = {
        id: Date.now(),
        type, name, amount, category, wallet, date
    };

    transactions.push(newTxn);
    localStorage.setItem('pw_transactions', JSON.stringify(transactions));
    
    closeModal();
    renderData();
  }

  // ── Delete Transaction
  function deleteTxn(id) {
      if(confirm('Yakin ingin menghapus transaksi ini?')) {
          transactions = transactions.filter(t => t.id !== id);
          localStorage.setItem('pw_transactions', JSON.stringify(transactions));
          renderData();
      }
  }

  // ── Toggle Balance Visibility
  function toggleBalance() {
      isBalanceHidden = !isBalanceHidden;
      document.getElementById('eyeIcon').setAttribute('data-lucide', isBalanceHidden ? 'eye-off' : 'eye');
      renderData();
  }

  // Init
  renderData();

</script>
"""

# Replace script tag entirely
content = re.sub(r'<script>.*?</script>', js_logic, content, flags=re.DOTALL)

with open("dashboard.html", "w") as f:
    f.write(content)
print("Done rewriting dashboard.html")
