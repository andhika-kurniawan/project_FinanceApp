import re

with open('wallet.html', 'r') as f:
    content = f.read()

# Replace all <script>...</script> at the end with external script tags
script_tags = """
<script src="assets/js/app.js"></script>
<script src="assets/js/wallet.js"></script>
</body>
"""

content = re.sub(r'<script>.*?</script>\n</body>', script_tags, content, flags=re.DOTALL)

with open('wallet.html', 'w') as f:
    f.write(content)
