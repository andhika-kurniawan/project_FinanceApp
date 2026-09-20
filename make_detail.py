import re

# 1. Update app.js to handle row clicks
with open("assets/js/app.js", "r") as f:
    app_js = f.read()

old_handlers = """
    /** Attach delete handlers inside a container element. */
    attachDeleteHandlers(container, onDelete) {
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          if (confirm('Yakin ingin menghapus transaksi ini?')) {
            store.remove(id);
            if (onDelete) onDelete(id);
          }
        });
      });
    },
"""

new_handlers = """
    /** Attach row click and delete handlers inside a container element. */
    attachHandlers(container, onDelete) {
      // Row clicks for detail page
      container.querySelectorAll('.txn').forEach(row => {
        row.addEventListener('click', (e) => {
          // Ignore if clicking delete button
          if (e.target.closest('.delete-btn')) return;
          const id = row.getAttribute('data-txn-id');
          if (id) window.location.href = `detail.html?id=${id}`;
        });
      });

      // Delete buttons
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent row click
          const id = parseInt(btn.dataset.id, 10);
          if (confirm('Yakin ingin menghapus transaksi ini?')) {
            store.remove(id);
            if (onDelete) onDelete(id);
          }
        });
      });
    },
"""
app_js = app_js.replace(old_handlers.strip(), new_handlers.strip())

with open("assets/js/app.js", "w") as f:
    f.write(app_js)

# 2. Update dashboard.js and transactions.js to call attachHandlers instead of attachDeleteHandlers
for file in ["assets/js/dashboard.js", "assets/js/transactions.js"]:
    with open(file, "r") as f:
        js = f.read()
    js = js.replace("attachDeleteHandlers", "attachHandlers")
    with open(file, "w") as f:
        f.write(js)

print("App JS updated for routing")
