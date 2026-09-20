import re

with open("assets/js/app.js", "r") as f:
    app_js = f.read()

# 1. Add store.update
store_old = """
    /** Remove a transaction by id and persist. */
    remove(id) {
      const all = store.getAll().filter(t => t.id !== id);
      store.saveAll(all);
    },
"""
store_new = """
    /** Remove a transaction by id and persist. */
    remove(id) {
      const all = store.getAll().filter(t => t.id !== id);
      store.saveAll(all);
    },

    /** Update an existing transaction by id. */
    update(txn) {
      const all = store.getAll();
      const index = all.findIndex(t => t.id === txn.id);
      if (index !== -1) {
        all[index] = txn;
        store.saveAll(all);
      }
    },
"""
app_js = app_js.replace(store_old.strip(), store_new.strip())


# 2. Update PW.modal to support edit mode
modal_init_old = """
    _overlay: null,
    _form: null,
    _onSave: null,   // callback(newTxn)

    /** Call once after DOM is ready. Pass a callback invoked after save. */
    init(onSaveCb) {
"""
modal_init_new = """
    _overlay: null,
    _form: null,
    _onSave: null,   // callback(newTxn)
    _editId: null,   // if editing, holds the id

    /** Call once after DOM is ready. Pass a callback invoked after save. */
    init(onSaveCb) {
"""
app_js = app_js.replace(modal_init_old.strip(), modal_init_new.strip())

modal_open_old = """
    open() {
      if (!modal._overlay) return;
      const dateEl = document.getElementById('txnDate');
      if (dateEl) dateEl.valueAsDate = new Date();
      modal.setType('expense');
      modal._overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
"""
modal_open_new = """
    open() {
      if (!modal._overlay) return;
      modal._editId = null;
      document.querySelector('#txnModal .modal-title').textContent = 'Tambah Transaksi';
      const dateEl = document.getElementById('txnDate');
      if (dateEl) dateEl.valueAsDate = new Date();
      modal.setType('expense');
      modal._overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    openForEdit(txn) {
      if (!modal._overlay) return;
      modal._editId = txn.id;
      document.querySelector('#txnModal .modal-title').textContent = 'Edit Transaksi';
      modal.setType(txn.type);
      document.getElementById('txnAmount').value = txn.amount;
      
      // We need to wait a tick for categories to render before setting the category
      setTimeout(() => {
        const catBtn = document.querySelector(`#categoryGrid .cat-pill:has(i[data-lucide="${categories.iconName(txn.category)}"])`);
        if(catBtn) catBtn.click();
        else document.getElementById('txnCategory').value = txn.category;
      }, 0);

      document.getElementById('txnWallet').value = txn.wallet;
      document.getElementById('txnDate').value = txn.date;
      document.getElementById('txnName').value = txn.name;
      
      modal._overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
"""
app_js = app_js.replace(modal_open_old.strip(), modal_open_new.strip())


modal_submit_old = """
    _handleSubmit(e) {
      e.preventDefault();
      const txn = {
        id:       Date.now(),
        type:     document.getElementById('txnType').value,
        name:     document.getElementById('txnName').value.trim(),
        amount:   parseFloat(document.getElementById('txnAmount').value),
        category: document.getElementById('txnCategory').value,
        wallet:   document.getElementById('txnWallet').value,
        date:     document.getElementById('txnDate').value,
      };
      store.add(txn);
      modal.close();
      modal._onSave(txn);
    },
"""
modal_submit_new = """
    _handleSubmit(e) {
      e.preventDefault();
      const txn = {
        id:       modal._editId || Date.now(),
        type:     document.getElementById('txnType').value,
        name:     document.getElementById('txnName').value.trim(),
        amount:   parseFloat(document.getElementById('txnAmount').value),
        category: document.getElementById('txnCategory').value,
        wallet:   document.getElementById('txnWallet').value,
        date:     document.getElementById('txnDate').value,
      };
      
      if (modal._editId) {
        store.update(txn);
      } else {
        store.add(txn);
      }
      
      modal.close();
      modal._onSave(txn);
    },
"""
app_js = app_js.replace(modal_submit_old.strip(), modal_submit_new.strip())

with open("assets/js/app.js", "w") as f:
    f.write(app_js)

print("app.js updated")
