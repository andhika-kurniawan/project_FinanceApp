import re
import sys

with open("dashboard.html", "r") as f:
    content = f.read()

# 1. Update .nav-item CSS to include flex: 1
nav_item_css = """
    .nav-item {
      display: flex;
      flex: 1; /* Make items take up equal space to center the FAB perfectly */
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 4px; /* Reduced horizontal padding to prevent overflow */
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      transition: all var(--tr);
      position: relative;
    }
"""

css_pattern = r'\.nav-item\s*\{.*?\n    \}'
content = re.sub(r'\.nav-item\s*\{.*?position:\s*relative;\s*\}', nav_item_css.strip(), content, flags=re.DOTALL)


# 2. Enlarge the + icon
# We find the plus icon inside nav-fab
plus_pattern = r'<i data-lucide="plus" style="width:28px;height:28px"></i>'
new_plus = r'<i data-lucide="plus" style="width:34px;height:34px"></i>'
content = content.replace(plus_pattern, new_plus)

with open("dashboard.html", "w") as f:
    f.write(content)
print("Done centering FAB and enlarging +")
