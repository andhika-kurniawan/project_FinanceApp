import re

with open("assets/css/style.css", "r") as f:
    css = f.read()

# Update .txn to match the reference (flat row, border bottom, no full border/gap)
txn_css = """
/* ── Transaction Row ────────────────────────────────────────── */
.txn { 
  display:flex; align-items:center; gap:14px; 
  background:transparent; 
  padding:16px 0; margin: 0;
  border-bottom: 1px solid var(--neutral-100);
  cursor:pointer; transition:all var(--tr); 
}
.txn:last-child { border-bottom: none; }
.txn:hover  { background:rgba(0,0,0,0.02); padding-left: 8px; padding-right: 8px; margin-left: -8px; margin-right: -8px; border-radius: 12px; }
.txn:active { background:rgba(0,0,0,0.05); }
"""
css = re.sub(r'/\* ── Transaction Row ──.*?\.txn:active\s*\{.*?\}', txn_css.strip(), css, flags=re.DOTALL)

# Adjust padding of txn-list-wrapper so the rows go edge-to-edge if we want, or keep 20px padding.
# The date header also needs adjustment. 
# We will use .date-group and .date-label for this.
css = css.replace('.date-group  { margin-bottom:24px; display:flex; flex-direction:column; gap:10px; }', '.date-group  { margin-bottom:0; display:flex; flex-direction:column; gap:0; }')

# In dashboard, txn-section padding: 24px 20px 0;
# In transactions, txn-list-wrapper padding: 24px 20px 40px;
# This means .txn rows will be inset by 20px, which is perfect and aligns with the top elements.

with open("assets/css/style.css", "w") as f:
    f.write(css)

# Now, revert the inline styles in app.js
with open("assets/js/app.js", "r") as f:
    app_js = f.read()

txnHTML_inline = r'<div class="txn slide-up" data-txn-id="\$\{txn.id\}" style="display:flex; align-items:center; padding: 16px 0; border-bottom: 1px solid var\(--neutral-100\); margin: 0 20px;">'
app_js = re.sub(txnHTML_inline, '<div class="txn slide-up" data-txn-id="${txn.id}">', app_js)

app_js = app_js.replace('style="width:40px;height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"', '')
app_js = app_js.replace('style="flex:1; min-width:0; margin-left: 12px;"', '')
app_js = app_js.replace('style="font-size:15px; font-weight:700; color:var(--neutral-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"', '')
app_js = app_js.replace('style="font-size:12px; color:var(--neutral-400); margin-top:3px;"', '')
app_js = app_js.replace('style="display:flex;align-items:center; text-align:right;"', '')
app_js = app_js.replace('style="font-size:15px; font-weight:800; letter-spacing:-0.02em;"', '')

# Ensure groupHTML inline styling isn't breaking dashboard
# The dashboard expects a simple label with a line. The transactions page expects Day + Amount.
# We changed groupHTML to return Day + Amount. This is fine for Dashboard too! It's a nice upgrade.
# We just need to remove the hardcoded padding: 24px 20px 8px from inline style in groupHTML since the container already has 20px padding.
app_js = app_js.replace('padding: 24px 20px 8px;', 'padding: 24px 0 8px;')

with open("assets/js/app.js", "w") as f:
    f.write(app_js)
print("css & js fixed")
