import re

with open('assets/js/wallet-detail.js', 'r') as f:
    content = f.read()

# Add btnViewAll handler
insertion = """
        if (txnListContainer) {
"""

new_code = """
        const btnViewAll = document.getElementById('btnViewAll');
        if (btnViewAll) {
            btnViewAll.onclick = () => window.location.href = `transactions.html?wallet=${encodeURIComponent(wallet.name)}`;
        }

        if (txnListContainer) {
"""

content = content.replace(insertion, new_code)

with open('assets/js/wallet-detail.js', 'w') as f:
    f.write(content)
