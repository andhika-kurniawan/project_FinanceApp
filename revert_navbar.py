import re
import sys

with open("dashboard.html", "r") as f:
    content = f.read()

# 1. CSS
new_css = """
    .bottom-nav__bar {
      background: var(--gradient-nav);
      border-radius: 28px 28px 24px 24px;
      padding: 14px 16px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: var(--shadow-nav);
      position: relative;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
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
      display: none; /* Hidden label */
    }

    .nav-item--active {
      color: #fff;
    }
    .nav-item--active::after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 5px; height: 5px;
      background: var(--accent-400);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-400);
    }
"""

css_pattern = r'\.bottom-nav__bar\s*\{.*?\.nav-item--active span\s*\{.*?\}'
content = re.sub(css_pattern, new_css.strip(), content, flags=re.DOTALL)

# 2. Increase icon sizes in the bottom nav
html_nav_start = content.find('<nav class="bottom-nav">')
if html_nav_start != -1:
    nav_html = content[html_nav_start:]
    # Replace 22px with 26px
    nav_html = re.sub(r'width:22px;height:22px', r'width:26px;height:26px', nav_html)
    content = content[:html_nav_start] + nav_html

with open("dashboard.html", "w") as f:
    f.write(content)
print("Done updating navbar")
