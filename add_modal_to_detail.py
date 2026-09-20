import re

# 1. Add modal HTML to detail.html
with open("detail.html", "r") as f:
    html = f.read()

modal_html = """
  <!-- MODAL ADD/EDIT TRANSACTION -->
  <div class="modal-overlay" id="txnModal">
    <div class="modal-content">
      <div class="modal-drag-handle"></div>
      
      <div class="modal-header">
        <h3 class="modal-title">Tambah Transaksi</h3>
        <button class="modal-close" onclick="closeModal()"><i data-lucide="x" style="width:18px;height:18px"></i></button>
      </div>
      
      <form id="txnForm" style="display:flex; flex-direction:column; gap:20px;">
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

# Insert right before </div><!-- /app --> if it exists, otherwise before script tags
if "</div><!-- /app -->" in html:
    html = html.replace("</div><!-- /app -->", modal_html + "\n</div><!-- /app -->")
else:
    html = html.replace("  <script src=", modal_html + "\n  <script src=", 1)

with open("detail.html", "w") as f:
    f.write(html)
print("detail.html updated with modal")

# 2. Update detail.js to use modal
with open("assets/js/detail.js", "r") as f:
    detail_js = f.read()

# Add PW.modal.init inside DOMContentLoaded
detail_js = detail_js.replace("renderDetail(txn);\n});", "renderDetail(txn);\n  \n  PW.modal.init((updatedTxn) => {\n    renderDetail(updatedTxn);\n  });\n});")

# Update editTxn function
edit_old = """
window.editTxn = function(id) {
  alert("Fitur edit akan tersedia di pembaruan selanjutnya.");
};
"""
edit_new = """
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
"""
detail_js = detail_js.replace(edit_old.strip(), edit_new.strip())

with open("assets/js/detail.js", "w") as f:
    f.write(detail_js)
print("detail.js updated for edit")
