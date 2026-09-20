import re

with open("assets/js/transactions.js", "r") as f:
    js = f.read()

# Remove the late declarations
js = js.replace("let activeWalletFilter = 'all';\n  let activeCatFilter = 'all';", "")

# Add them to the top state
state_old = """
  /* ── State ── */
  let currentRange = 'all';
  let currentType  = 'all';
  let customFrom   = null;
  let customTo     = null;
  let searchQuery  = '';
"""
state_new = """
  /* ── State ── */
  let currentRange = 'all';
  let currentType  = 'all';
  let customFrom   = null;
  let customTo     = null;
  let searchQuery  = '';
  let activeWalletFilter = 'all';
  let activeCatFilter = 'all';
"""
js = js.replace(state_old.strip(), state_new.strip())

with open("assets/js/transactions.js", "w") as f:
    f.write(js)
