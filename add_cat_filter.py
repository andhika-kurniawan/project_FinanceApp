import re

with open("transactions.html", "r") as f:
    html = f.read()

# Replace the modal body to include Categories
old_modal = r'<div class="form-group">\s*<label class="form-label">Pilih Wallet</label>.*?</div>'
new_modal = """
        <div class="form-group">
          <label class="form-label">Pilih Kategori</label>
          <div class="category-grid" id="filterCatGrid">
             <div class="cat-pill active" data-filter-cat="all" onclick="toggleFilterCat('all')">Semua Kategori</div>
             <div class="cat-pill" data-filter-cat="food" onclick="toggleFilterCat('food')">Makanan</div>
             <div class="cat-pill" data-filter-cat="transport" onclick="toggleFilterCat('transport')">Transport</div>
             <div class="cat-pill" data-filter-cat="shopping" onclick="toggleFilterCat('shopping')">Belanja</div>
             <div class="cat-pill" data-filter-cat="health" onclick="toggleFilterCat('health')">Kesehatan</div>
             <div class="cat-pill" data-filter-cat="edu" onclick="toggleFilterCat('edu')">Pendidikan</div>
             <div class="cat-pill" data-filter-cat="game" onclick="toggleFilterCat('game')">Hiburan</div>
             <div class="cat-pill" data-filter-cat="income" onclick="toggleFilterCat('income')">Gaji/Bonus</div>
             <div class="cat-pill" data-filter-cat="invest" onclick="toggleFilterCat('invest')">Investasi</div>
             <div class="cat-pill" data-filter-cat="other" onclick="toggleFilterCat('other')">Lainnya</div>
          </div>
        </div>

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
"""
html = re.sub(old_modal, new_modal.strip(), html, flags=re.DOTALL)

with open("transactions.html", "w") as f:
    f.write(html)
print("transactions.html updated for category filter")

with open("assets/js/transactions.js", "r") as f:
    js = f.read()

# Add activeCatFilter to JS
js = js.replace("let activeWalletFilter = 'all';", "let activeWalletFilter = 'all';\n  let activeCatFilter = 'all';")

# Add toggleFilterCat function
toggle_cat_fn = """
  window.toggleFilterCat = function(cat) {
    document.querySelectorAll('#filterCatGrid .cat-pill').forEach(el => el.classList.remove('active'));
    document.querySelector(`#filterCatGrid .cat-pill[data-filter-cat="${cat}"]`).classList.add('active');
    activeCatFilter = cat;
  };
"""
js = js.replace("window.toggleFilterWallet =", toggle_cat_fn + "\n  window.toggleFilterWallet =")

# Reset cat filter
js = js.replace("toggleFilterWallet('all');", "toggleFilterWallet('all');\n    toggleFilterCat('all');")

# Filter logic
filter_logic_old = "const matchWallet = (typeof activeWalletFilter === 'undefined' || activeWalletFilter === 'all') || t.wallet === activeWalletFilter;\n      return matchDate && matchType && matchQuery && matchWallet;"
filter_logic_new = """
      const matchWallet = (typeof activeWalletFilter === 'undefined' || activeWalletFilter === 'all') || t.wallet === activeWalletFilter;
      const matchCat = (typeof activeCatFilter === 'undefined' || activeCatFilter === 'all') || t.category === activeCatFilter;
      return matchDate && matchType && matchQuery && matchWallet && matchCat;
"""
js = js.replace(filter_logic_old, filter_logic_new.strip())

with open("assets/js/transactions.js", "w") as f:
    f.write(js)
print("transactions.js updated for category filter")

