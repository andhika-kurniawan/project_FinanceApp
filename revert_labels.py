import re
import sys

with open("dashboard.html", "r") as f:
    content = f.read()

# Update bottom-nav__bar to have gap: 16px to fit text
content = re.sub(r'gap:\s*28px;', 'gap: 16px;', content)

# Update nav-item CSS
new_css = """
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 8px;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      transition: all var(--tr);
      position: relative;
    }
    .nav-item:hover {
      color: rgba(255,255,255,0.8);
      transform: translateY(-2px);
    }
    .nav-item span {
      display: block; /* Show label */
      font-size: 10px;
      font-weight: 600;
      white-space: nowrap;
    }

    .nav-item--active {
      color: #fff;
    }
    .nav-item--active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px; height: 4px;
      background: var(--accent-400);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-400);
    }
"""

css_pattern = r'\.nav-item\s*\{.*?\.nav-item--active::after\s*\{.*?\}'
content = re.sub(css_pattern, new_css.strip(), content, flags=re.DOTALL)

# Revert icon size back to 22px
html_nav_start = content.find('<nav class="bottom-nav">')
if html_nav_start != -1:
    nav_html = content[html_nav_start:]
    # Replace 26px with 22px
    nav_html = re.sub(r'width:26px;height:26px', r'width:24px;height:24px', nav_html) # Using 24px as a sweet spot
    content = content[:html_nav_start] + nav_html

with open("dashboard.html", "w") as f:
    f.write(content)
print("Done adding labels back")
