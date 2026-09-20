with open("transactions.html", "r") as f:
    html = f.read()

# The broken part is from the end of the filter modal
broken_part = """
          <div class="category-grid" id="filterWalletGrid">
             <div class="cat-pill active" data-filter-wallet="all" onclick="toggleFilterWallet('all')">Semua Wallet</div>
             <div class="cat-pill" data-filter-wallet="BCA" onclick="toggleFilterWallet('BCA')">BCA</div>
             <div class="cat-pill" data-filter-wallet="GoPay" onclick="toggleFilterWallet('GoPay')">GoPay</div>
             <div class="cat-pill" data-filter-wallet="OVO" onclick="toggleFilterWallet('OVO')">OVO</div>
             <div class="cat-pill" data-filter-wallet="Cash" onclick="toggleFilterWallet('Cash')">Tunai</div>
          </div>
        </div>
             <div class="cat-pill" data-filter-wallet="BCA" onclick="toggleFilterWallet('BCA')">BCA</div>
             <div class="cat-pill" data-filter-wallet="GoPay" onclick="toggleFilterWallet('GoPay')">GoPay</div>
             <div class="cat-pill" data-filter-wallet="OVO" onclick="toggleFilterWallet('OVO')">OVO</div>
             <div class="cat-pill" data-filter-wallet="Cash" onclick="toggleFilterWallet('Cash')">Tunai</div>
          </div>
        </div>
"""
fixed_part = """
          <div class="category-grid" id="filterWalletGrid">
             <div class="cat-pill active" data-filter-wallet="all" onclick="toggleFilterWallet('all')">Semua Wallet</div>
             <div class="cat-pill" data-filter-wallet="BCA" onclick="toggleFilterWallet('BCA')">BCA</div>
             <div class="cat-pill" data-filter-wallet="GoPay" onclick="toggleFilterWallet('GoPay')">GoPay</div>
             <div class="cat-pill" data-filter-wallet="OVO" onclick="toggleFilterWallet('OVO')">OVO</div>
             <div class="cat-pill" data-filter-wallet="Cash" onclick="toggleFilterWallet('Cash')">Tunai</div>
          </div>
        </div>
"""
html = html.replace(broken_part.strip(), fixed_part.strip())

with open("transactions.html", "w") as f:
    f.write(html)
