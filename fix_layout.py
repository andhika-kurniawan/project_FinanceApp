import re

with open("assets/css/style.css", "r") as f:
    css = f.read()

# 1. Update quick-filters to allow proper scrolling and add padding right
css = re.sub(
    r'\.quick-filters\s*\{.*?\}',
    '.quick-filters { display:flex; gap:6px; overflow-x:auto; padding-bottom:2px; padding-right:20px; }',
    css, flags=re.DOTALL
)

# 2. Update txn-list to be a white box/card
# We will add a new class .txn-list-wrapper for this
new_txn_css = """
/* ── Transactions List Wrapper ── */
.txn-list-wrapper {
  background: var(--white);
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -4px 24px rgba(15,23,42,0.06);
  flex: 1;
  padding: 24px 20px 40px;
  margin-top: 8px;
  min-height: 50vh;
}

/* ── Date Group ─────────────────────────────────────────────── */
.date-group  { margin-bottom:24px; display:flex; flex-direction:column; gap:10px; }
.date-label  { font-size:11px; font-weight:700; color:var(--neutral-400); text-transform:uppercase; letter-spacing:.07em; padding:0 0 6px; display:flex; align-items:center; gap:6px; margin: 0; }
.date-label__line { flex:1; height:1px; background:var(--neutral-100); }

/* ── Transaction Row ────────────────────────────────────────── */
.txn { 
  display:flex; align-items:center; gap:14px; 
  background:var(--white); border: 1px solid var(--neutral-100);
  border-radius:16px; padding:14px; margin:0;
  cursor:pointer; transition:all var(--tr); 
}
.txn:last-child { border-bottom: 1px solid var(--neutral-100); }
.txn:hover  { background:var(--neutral-50); box-shadow: 0 4px 12px rgba(15,23,42,0.03); transform: translateY(-1px); }
.txn:active { background:var(--neutral-100); }
"""

# Replace the old Date Group and Transaction Row sections with the new one
css = re.sub(r'/\* ── Date Group ──.*?\.txn:active\s*\{.*?\}', new_txn_css.strip(), css, flags=re.DOTALL)

with open("assets/css/style.css", "w") as f:
    f.write(css)

# Now update transactions.html to use .txn-list-wrapper
with open("transactions.html", "r") as f:
    html = f.read()

# Make sure quick filters container doesn't get cut off on the right
html = html.replace('<div class="quick-filters">', '<div class="quick-filters" style="margin-right: -20px;">') # offset the padding right of parent if needed, or just let it scroll

# Change txn-list to use wrapper
html = html.replace('<div class="txn-list" id="txnList"></div>', '<div class="txn-list-wrapper" id="txnList"></div>')

with open("transactions.html", "w") as f:
    f.write(html)

print("done")
