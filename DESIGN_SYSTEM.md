# 🎨 Design System — Personal Wallet

> Pedoman visual utama untuk membangun semua halaman HTML Personal Wallet.
> Gaya desain terinspirasi dari referensi UI finance app modern, dengan nuansa **biru** sebagai warna primer.

---

## 1. Referensi Visual

![Referensi UI yang dijadikan acuan design system](/Users/andikakurniawan/.gemini/antigravity/brain/67e63911-b0b0-4d32-accb-65455e56e756/.user_uploaded/media_1788791003753.png)

> **Catatan:** Semua nuansa hijau pada referensi di atas telah dikonversi ke nuansa **biru** dalam design system ini.

---

## 2. Design Principles

| Prinsip | Penjelasan |
|---------|------------|
| **Mobile-First Fixed** | Layout `max-width: 480px`, centered di semua device. Tidak ada perubahan layout di tablet/desktop. |
| **Premium & Modern** | Menggunakan gradient, glassmorphism, dan subtle shadow untuk kesan premium. |
| **High Contrast Cards** | Card utama (wallet balance) menggunakan gradient gelap dengan teks putih untuk emphasis. |
| **Rounded Everything** | Semua elemen menggunakan border-radius besar untuk kesan friendly dan modern. |
| **Consistent Iconography** | Icon menggunakan style outline/rounded yang konsisten dalam container circle. |
| **Visual Hierarchy** | Nominal uang selalu paling besar & bold. Label/subtitle selalu kecil & secondary color. |

---

## 3. Color Palette

### 3.1 Primary Colors (Nuansa Biru)

Semua warna primer menggunakan skala biru, menggantikan nuansa hijau dari referensi.

| Token | Hex | Preview | Penggunaan |
|-------|-----|---------|------------|
| `--primary-900` | `#0c1a3d` | 🟫 Sangat gelap | Onboarding background, dark sections |
| `--primary-800` | `#0f2557` | 🟫 Navy gelap | Gradient start pada wallet card, bottom nav |
| `--primary-700` | `#1e3a6e` | 🔵 Navy medium | Gradient end pada wallet card |
| `--primary-600` | `#1d4ed8` | 🔵 Biru kuat | Tombol primary, active state |
| `--primary-500` | `#3b82f6` | 🔵 Biru cerah | Aksen utama, icon active, toggle active |
| `--primary-400` | `#60a5fa` | 🔵 Biru medium | Chart bar primary, badge |
| `--primary-300` | `#93c5fd` | 🔵 Biru muda | Chart bar secondary, icon background |
| `--primary-200` | `#bfdbfe` | 🔵 Biru pastel | Light accent, tag background |
| `--primary-100` | `#dbeafe` | 🔵 Biru sangat muda | Hover state, subtle background |
| `--primary-50`  | `#eff6ff` | ⬜ Hampir putih | Page background tint |

### 3.2 Accent / Highlight (Cyan)

Menggantikan warna lime/yellow-green pada referensi sebagai warna aksen pelengkap.

| Token | Hex | Preview | Penggunaan |
|-------|-----|---------|------------|
| `--accent-500` | `#06b6d4` | 🔷 Cyan | Accent highlight, active tab |
| `--accent-400` | `#22d3ee` | 🔷 Cyan cerah | Chart highlight bar, sparkle |
| `--accent-300` | `#67e8f9` | 🔷 Cyan muda | Glow effect, decorative |
| `--accent-200` | `#a5f3fc` | ⬜ Cyan pastel | Light badge, subtle accent |

### 3.3 Semantic Colors

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--color-income` | `#22c55e` | Indikator pemasukan (tetap hijau) |
| `--color-income-light` | `#dcfce7` | Background badge income |
| `--color-expense` | `#ef4444` | Indikator pengeluaran |
| `--color-expense-light` | `#fee2e2` | Background badge expense |
| `--color-warning` | `#f59e0b` | Warning state |
| `--color-warning-light` | `#fef3c7` | Background warning |
| `--color-success` | `#10b981` | Success toast/notification |

### 3.4 Neutral Colors

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--neutral-900` | `#0f172a` | Heading text, primary text |
| `--neutral-800` | `#1e293b` | Subheading text |
| `--neutral-700` | `#334155` | Body text |
| `--neutral-600` | `#475569` | Secondary text |
| `--neutral-500` | `#64748b` | Placeholder, caption |
| `--neutral-400` | `#94a3b8` | Disabled text, icon inactive |
| `--neutral-300` | `#cbd5e1` | Border, divider |
| `--neutral-200` | `#e2e8f0` | Light border, separator |
| `--neutral-100` | `#f1f5f9` | Card background (alt), outer bg desktop |
| `--neutral-50`  | `#f8fafc` | Page background |
| `--white`       | `#ffffff` | Card background, text on dark |

### 3.5 Dark Mode Colors

| Token | Light Value | Dark Value |
|-------|-------------|------------|
| `--bg-page` | `#f8fafc` | `#0c1a3d` |
| `--bg-card` | `#ffffff` | `#142244` |
| `--bg-card-alt` | `#f1f5f9` | `#1a2d54` |
| `--bg-outer` | `#f1f5f9` | `#060e1f` |
| `--text-primary` | `#0f172a` | `#f1f5f9` |
| `--text-secondary` | `#64748b` | `#94a3b8` |
| `--border-color` | `#e2e8f0` | `#1e3a6e` |

---

## 4. Gradients

Gradients adalah elemen kunci visual dari referensi UI ini.

### 4.1 Gradient Definitions

```css
/* Wallet Balance Card — gradient utama (menggantikan dark green gradient) */
--gradient-wallet: linear-gradient(135deg, #0f2557 0%, #1e3a6e 50%, #1d4ed8 100%);

/* Onboarding / Splash Screen background */
--gradient-dark: linear-gradient(180deg, #0c1a3d 0%, #0f2557 60%, #1e3a6e 100%);

/* Bottom Navigation Bar */
--gradient-nav: linear-gradient(135deg, #0f2557 0%, #142244 100%);

/* Accent gradient untuk tombol CTA */
--gradient-accent: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);

/* Chart area / stats card background */
--gradient-chart-bg: linear-gradient(180deg, #0f2557 0%, #1a2d54 100%);

/* Glassmorphism overlay */
--gradient-glass: linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.08) 100%);

/* Light background gradient untuk page */
--gradient-page-bg: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
```

### 4.2 Penggunaan Gradient

| Elemen | Gradient | Keterangan |
|--------|----------|------------|
| Wallet Balance Card | `--gradient-wallet` | Card utama di dashboard, teks putih |
| Onboarding Screen | `--gradient-dark` | Full screen background |
| Bottom Navigation | `--gradient-nav` | Fixed bottom, dengan icon putih |
| CTA Button | `--gradient-accent` | Tombol bulat dengan arrow, FAB |
| Stats Card | `--gradient-chart-bg` | Background chart di halaman analytics |
| Glass Card | `--gradient-glass` | Overlay pada card dengan backdrop-blur |
| Page Background | `--gradient-page-bg` | Subtle gradient pada body background |

---

## 5. Typography

### 5.1 Font Family

```css
/* Primary font */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace untuk angka nominal */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

**CDN Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 5.2 Type Scale

| Token | Size | Weight | Line Height | Penggunaan |
|-------|------|--------|-------------|------------|
| `--text-display` | 32px | 800 (ExtraBold) | 1.1 | Nominal saldo utama (`$8,182.00`) |
| `--text-h1` | 28px | 700 (Bold) | 1.2 | Greeting ("Hello Ridoy!"), halaman onboarding |
| `--text-h2` | 22px | 700 (Bold) | 1.25 | Nominal wallet card (`$2,455.00`) |
| `--text-h3` | 18px | 600 (Semibold) | 1.3 | Section title ("Quick Transfer", "Analytics") |
| `--text-h4` | 16px | 600 (Semibold) | 1.35 | Card title, subsection |
| `--text-body` | 14px | 400 (Regular) | 1.5 | Body text, description |
| `--text-body-medium` | 14px | 500 (Medium) | 1.5 | List item text, button label |
| `--text-small` | 12px | 400 (Regular) | 1.4 | Caption, subtitle, "Updated: 12/08/2025" |
| `--text-tiny` | 10px | 500 (Medium) | 1.3 | Badge text, label very small |

### 5.3 Aturan Penulisan Nominal

```css
/* Nominal uang selalu menggunakan: */
.amount {
  font-family: var(--font-primary);  /* Inter, bukan mono */
  font-weight: 700;                  /* Bold */
  font-variant-numeric: tabular-nums; /* Angka rata/fixed-width */
  letter-spacing: -0.02em;           /* Sedikit rapat */
}

/* Nominal besar (saldo utama) */
.amount-display {
  font-size: 32px;
  font-weight: 800;
}

/* Nominal medium (wallet card) */
.amount-card {
  font-size: 22px;
  font-weight: 700;
}

/* Nominal kecil (list item) */
.amount-small {
  font-size: 14px;
  font-weight: 600;
}
```

---

## 6. Spacing & Sizing

### 6.1 Spacing Scale

| Token | Value | Penggunaan |
|-------|-------|------------|
| `--space-1` | 4px | Icon gap, inline spacing minimal |
| `--space-2` | 8px | Padding dalam badge, gap antar small elements |
| `--space-3` | 12px | Padding icon container, inner card spacing |
| `--space-4` | 16px | Horizontal page padding, card padding |
| `--space-5` | 20px | Card padding medium, section gap |
| `--space-6` | 24px | Section spacing, card padding large |
| `--space-8` | 32px | Page top/bottom padding, gap antar section |
| `--space-10` | 40px | Large spacing between major sections |
| `--space-12` | 48px | Bottom navigation height safe area |

### 6.2 Fixed Dimensions

| Elemen | Size | Keterangan |
|--------|------|------------|
| App container | max-width: 480px | Centered di semua device |
| Bottom nav height | 64px | Termasuk padding |
| Bottom nav safe area | 80px | Dengan safe area bawah |
| Header height | 56px | Top bar |
| Icon circle (action) | 48×48px | Send, Receive, Top-Up icons |
| Icon circle (small) | 40×40px | List item icon, expense icon |
| Avatar | 40×40px | Profile, contact avatar |
| Avatar (small) | 32×32px | Quick transfer contacts |
| FAB button | 56×56px | Floating action button |
| Touch target min | 44×44px | Minimum tap area |
| Card wallet balance | height: ~180px | Auto based on content |

---

## 7. Border Radius

| Token | Value | Penggunaan |
|-------|-------|------------|
| `--radius-full` | 9999px | Circle icons, avatar, pill buttons, toggle |
| `--radius-2xl` | 24px | Wallet balance card, bottom nav top corners |
| `--radius-xl` | 20px | Stats card, large card |
| `--radius-lg` | 16px | Standard card, modal |
| `--radius-md` | 12px | Input field, dropdown, small card |
| `--radius-sm` | 8px | Button, tag, badge |

---

## 8. Shadows & Effects

### 8.1 Box Shadows

```css
/* Card shadow — subtle, untuk card di atas white bg */
--shadow-card: 0 2px 8px rgba(15, 23, 42, 0.06),
               0 1px 3px rgba(15, 23, 42, 0.04);

/* Card shadow — elevated, untuk card yang perlu emphasis */
--shadow-card-elevated: 0 4px 16px rgba(15, 23, 42, 0.08),
                        0 2px 6px rgba(15, 23, 42, 0.04);

/* Bottom navigation shadow */
--shadow-nav: 0 -4px 20px rgba(15, 23, 42, 0.08);

/* FAB shadow — lebih kuat dan berwarna */
--shadow-fab: 0 4px 16px rgba(59, 130, 246, 0.35),
              0 2px 8px rgba(59, 130, 246, 0.2);

/* Wallet card inner glow */
--shadow-wallet-glow: inset 0 1px 0 rgba(255, 255, 255, 0.1),
                      0 8px 32px rgba(15, 37, 87, 0.4);

/* App container shadow — pada desktop */
--shadow-container: 0 0 40px rgba(15, 23, 42, 0.08);
```

### 8.2 Glassmorphism

```css
/* Glassmorphism card (digunakan pada wallet card overlay, onboarding elements) */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
}

/* Glassmorphism yang lebih terang (untuk card di atas gradient gelap) */
.glass-light {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### 8.3 Decorative Elements

```css
/* Sparkle / star effect — circle blur (menggantikan sparkle hijau) */
.sparkle {
  width: 6px;
  height: 6px;
  background: var(--accent-400); /* #22d3ee cyan */
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent-400);
}

/* Decorative ring (menggantikan ring hijau di onboarding) */
.deco-ring {
  border: 2px solid rgba(96, 165, 250, 0.3); /* primary-400 */
  border-radius: 50%;
}

/* Gradient orb decorative */
.deco-orb {
  background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);
  border-radius: 50%;
}
```

---

## 9. Component Styles

### 9.1 Wallet Balance Card

Komponen utama di dashboard — card dengan gradient gelap dan teks putih.

```css
.wallet-card {
  background: linear-gradient(135deg, #0f2557 0%, #1e3a6e 50%, #1d4ed8 100%);
  border-radius: 24px;
  padding: 24px;
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(15, 37, 87, 0.4);
  position: relative;
  overflow: hidden;
}

/* Glassmorphism overlay circle (efek dekoratif) */
.wallet-card::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%);
  top: -50px;
  right: -50px;
  border-radius: 50%;
}

.wallet-card__label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.wallet-card__balance {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 8px 0;
  font-variant-numeric: tabular-nums;
}

.wallet-card__subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* Badge persentase (contoh: "4%") */
.wallet-card__badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #67e8f9; /* accent-300 cyan */
}
```

### 9.2 Quick Action Icons

Icon lingkaran untuk aksi: Send, Receive, Top-Up, More.

```css
.action-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.action-icon__circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-50);       /* #eff6ff */
  border: 1.5px solid var(--primary-200); /* #bfdbfe */
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);           /* #1d4ed8 */
  font-size: 20px;
  transition: all 0.2s ease;
}

.action-icon__circle:active {
  background: var(--primary-100);
  transform: scale(0.95);
}

.action-icon__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--neutral-600);
}
```

### 9.3 Bottom Navigation

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background: linear-gradient(135deg, #0f2557 0%, #142244 100%);
  border-radius: 24px 24px 0 0;
  padding: 8px 16px;
  padding-bottom: env(safe-area-inset-bottom, 8px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.08);
  z-index: 50;
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.bottom-nav__item--active {
  background: var(--primary-500); /* #3b82f6 */
  color: #ffffff;
  padding: 8px 20px;
  border-radius: 9999px;
}

.bottom-nav__icon {
  font-size: 20px;
}
```

### 9.4 Transaction List Item

```css
.transaction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--neutral-200);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.transaction-item__info {
  flex: 1;
  min-width: 0;
}

.transaction-item__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-item__meta {
  font-size: 12px;
  color: var(--neutral-500);
  margin-top: 2px;
}

.transaction-item__amount {
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.transaction-item__amount--income {
  color: var(--color-income); /* #22c55e */
}

.transaction-item__amount--expense {
  color: var(--neutral-900);
}
```

### 9.5 Toggle Tabs (Income / Expense)

```css
.toggle-tabs {
  display: flex;
  background: var(--neutral-100);
  border-radius: 9999px;
  padding: 4px;
  gap: 4px;
}

.toggle-tabs__item {
  flex: 1;
  padding: 10px 20px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  color: var(--neutral-500);
  background: transparent;
}

.toggle-tabs__item--active {
  background: var(--primary-500); /* #3b82f6 */
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
```

### 9.6 Stats Chart Card

```css
.stats-card {
  background: linear-gradient(180deg, #0f2557 0%, #1a2d54 100%);
  border-radius: 20px;
  padding: 20px;
  color: #ffffff;
}

.stats-card__title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.stats-card__amount {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
}

/* Bar chart bars */
.chart-bar {
  border-radius: 6px 6px 2px 2px;
  min-width: 24px;
}

.chart-bar--primary {
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
}

.chart-bar--secondary {
  background: rgba(96, 165, 250, 0.25);
}

.chart-bar--highlight {
  background: linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%);
}

/* Chart tooltip */
.chart-tooltip {
  background: #ffffff;
  color: var(--neutral-900);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Chart x-axis labels */
.chart-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}
```

### 9.7 Summary Card (Income / Expense / Net)

```css
.summary-card {
  background: var(--white);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-card);
  text-align: center;
}

.summary-card__label {
  font-size: 12px;
  color: var(--neutral-500);
  font-weight: 500;
}

.summary-card__amount {
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
}

.summary-card__trend {
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.summary-card__trend--up {
  color: var(--color-income);
}

.summary-card__trend--down {
  color: var(--color-expense);
}
```

### 9.8 Category / Payment Card

```css
.category-card {
  background: var(--white);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-card);
  text-align: center;
}

.category-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: var(--primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.category-card__name {
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-800);
}

.category-card__amount {
  font-size: 12px;
  font-weight: 500;
  color: var(--neutral-500);
}
```

### 9.9 Standard Card

```css
.card {
  background: var(--white);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06),
              0 1px 3px rgba(15, 23, 42, 0.04);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--neutral-900);
}

.card__link {
  font-size: 13px;
  font-weight: 500;
  color: var(--primary-500);
}
```

### 9.10 Form Input

```css
.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--neutral-200);
  border-radius: 12px;
  font-size: 14px;
  font-family: var(--font-primary);
  color: var(--neutral-900);
  background: var(--white);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-input::placeholder {
  color: var(--neutral-400);
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 6px;
}

/* Amount input — larger */
.form-input--amount {
  font-size: 24px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
  padding: 16px;
}
```

### 9.11 Buttons

```css
/* Primary button — gradient */
.btn-primary {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

/* Secondary button — outline */
.btn-secondary {
  padding: 12px 24px;
  background: transparent;
  color: var(--primary-600);
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid var(--primary-300);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:active {
  background: var(--primary-50);
}

/* FAB — Floating Action Button (menggantikan tombol hijau bulat) */
.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: #ffffff;
  font-size: 24px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35),
              0 2px 8px rgba(59, 130, 246, 0.2);
  transition: all 0.2s ease;
}

.fab:active {
  transform: scale(0.93);
}

/* Icon button (search, notification, back) */
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--neutral-100);
  border: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral-700);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:active {
  background: var(--neutral-200);
}
```

### 9.12 Toast Notification

```css
.toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 440px;
  width: calc(100% - 32px);
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.12);
  z-index: 100;
  animation: toast-in 0.3s ease;
}

.toast--success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.toast--error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

---

## 10. Layout Structure

### 10.1 App Container

```css
/* Outer body — visible on tablet/desktop */
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, #e0ecff 0%, #f1f5f9 100%);
  /* Subtle blue tint, menggantikan sage/mint green dari referensi */
  min-height: 100vh;
  font-family: var(--font-primary);
}

/* App shell — mobile frame */
.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--neutral-50); /* #f8fafc */
  position: relative;
  box-shadow: 0 0 40px rgba(15, 23, 42, 0.08);
  overflow-x: hidden;
}

/* Content area — with bottom nav padding */
.app-content {
  padding: 0 16px;
  padding-bottom: 96px; /* 64px nav + 32px space */
}
```

### 10.2 Page Structure Template

```html
<!-- Struktur dasar setiap halaman -->
<body>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <!-- Konten header sesuai halaman -->
    </header>

    <!-- Content -->
    <main class="app-content" id="app-content">
      <!-- Konten halaman di-render di sini oleh router -->
    </main>

    <!-- Bottom Navigation (selalu tampil) -->
    <nav class="bottom-nav">
      <div class="bottom-nav__item bottom-nav__item--active">
        <span class="bottom-nav__icon">🏠</span>
        <span>Home</span>
      </div>
      <div class="bottom-nav__item">
        <span class="bottom-nav__icon">👛</span>
        <span>Wallet</span>
      </div>
      <div class="bottom-nav__item">
        <button class="fab">➕</button>
      </div>
      <div class="bottom-nav__item">
        <span class="bottom-nav__icon">📋</span>
        <span>History</span>
      </div>
      <div class="bottom-nav__item">
        <span class="bottom-nav__icon">⚙️</span>
        <span>Settings</span>
      </div>
    </nav>
  </div>
</body>
```

---

## 11. Animation & Transitions

```css
/* Default transition untuk interactive elements */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Page transition */
@keyframes page-enter {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-enter {
  animation: page-enter 0.3s ease;
}

/* Card press effect */
.pressable:active {
  transform: scale(0.97);
  transition: transform 100ms ease;
}

/* Number count up animation (opsional via JS) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 12. Pemetaan Warna: Referensi → Design System

Tabel konversi lengkap dari nuansa hijau di referensi ke nuansa biru di design system:

| Elemen di Referensi | Warna Asli (Hijau) | Warna Baru (Biru) | Token |
|---------------------|--------------------|--------------------|-------|
| Onboarding background | Dark forest green `#0a2e1a` | Dark navy `#0c1a3d` | `--primary-900` |
| Wallet card gradient start | Deep green `#1a4a2e` | Deep navy `#0f2557` | `--primary-800` |
| Wallet card gradient end | Medium green `#2d6a4f` | Navy blue `#1e3a6e` | `--primary-700` |
| Bottom nav background | Very dark green `#1a3a2a` | Dark navy `#0f2557` | `--primary-800` |
| Active tab / toggle | Bright green `#4ade80` | Blue `#3b82f6` | `--primary-500` |
| Bottom nav active pill | Lime green `#84cc16` | Blue `#3b82f6` | `--primary-500` |
| Chart bar primary | Lime/yellow-green `#a3e635` | Cyan `#22d3ee` | `--accent-400` |
| Chart bar secondary | Muted green `#4a7c5f` | Muted blue `rgba(96,165,250,0.25)` | `--primary-400` (25%) |
| Sparkle/star accents | Yellow-green glow | Cyan glow `#22d3ee` | `--accent-400` |
| CTA button | Bright green `#4ade80` | Blue-cyan gradient | `--gradient-accent` |
| Card ring/badge | Green tint | Blue tint `#bfdbfe` | `--primary-200` |
| Page outer bg | Sage/mint `#e8f5e9` | Light blue `#e0ecff` | Custom |
| Icon circle bg | Light mint | Light blue `#eff6ff` | `--primary-50` |
| Icon active color | Green | Blue `#1d4ed8` | `--primary-600` |

> **Catatan:** Warna `--color-income` (hijau `#22c55e`) dan `--color-expense` (merah `#ef4444`) tetap dipertahankan karena ini adalah warna semantik universal untuk pemasukan dan pengeluaran, bukan bagian dari tema warna utama.

---

## 13. CSS Variables — Copy-Paste Ready

```css
:root {
  /* === PRIMARY (Biru) === */
  --primary-900: #0c1a3d;
  --primary-800: #0f2557;
  --primary-700: #1e3a6e;
  --primary-600: #1d4ed8;
  --primary-500: #3b82f6;
  --primary-400: #60a5fa;
  --primary-300: #93c5fd;
  --primary-200: #bfdbfe;
  --primary-100: #dbeafe;
  --primary-50:  #eff6ff;

  /* === ACCENT (Cyan) === */
  --accent-500: #06b6d4;
  --accent-400: #22d3ee;
  --accent-300: #67e8f9;
  --accent-200: #a5f3fc;

  /* === SEMANTIC === */
  --color-income: #22c55e;
  --color-income-light: #dcfce7;
  --color-expense: #ef4444;
  --color-expense-light: #fee2e2;
  --color-warning: #f59e0b;
  --color-warning-light: #fef3c7;
  --color-success: #10b981;

  /* === NEUTRAL === */
  --neutral-900: #0f172a;
  --neutral-800: #1e293b;
  --neutral-700: #334155;
  --neutral-600: #475569;
  --neutral-500: #64748b;
  --neutral-400: #94a3b8;
  --neutral-300: #cbd5e1;
  --neutral-200: #e2e8f0;
  --neutral-100: #f1f5f9;
  --neutral-50:  #f8fafc;
  --white:       #ffffff;

  /* === GRADIENTS === */
  --gradient-wallet:   linear-gradient(135deg, #0f2557 0%, #1e3a6e 50%, #1d4ed8 100%);
  --gradient-dark:     linear-gradient(180deg, #0c1a3d 0%, #0f2557 60%, #1e3a6e 100%);
  --gradient-nav:      linear-gradient(135deg, #0f2557 0%, #142244 100%);
  --gradient-accent:   linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  --gradient-chart-bg: linear-gradient(180deg, #0f2557 0%, #1a2d54 100%);
  --gradient-glass:    linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.08) 100%);
  --gradient-page-bg:  linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);

  /* === SHADOWS === */
  --shadow-card:          0 2px 8px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04);
  --shadow-card-elevated: 0 4px 16px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04);
  --shadow-nav:           0 -4px 20px rgba(15,23,42,0.08);
  --shadow-fab:           0 4px 16px rgba(59,130,246,0.35), 0 2px 8px rgba(59,130,246,0.2);
  --shadow-container:     0 0 40px rgba(15,23,42,0.08);

  /* === RADIUS === */
  --radius-full: 9999px;
  --radius-2xl:  24px;
  --radius-xl:   20px;
  --radius-lg:   16px;
  --radius-md:   12px;
  --radius-sm:   8px;

  /* === SPACING === */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;

  /* === TYPOGRAPHY === */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  /* === TRANSITIONS === */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

/* === DARK MODE === */
[data-theme="dark"] {
  --bg-page:        #0c1a3d;
  --bg-card:        #142244;
  --bg-card-alt:    #1a2d54;
  --bg-outer:       #060e1f;
  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color:   #1e3a6e;
  --neutral-50:     #0c1a3d;
  --neutral-100:    #142244;
  --neutral-200:    #1e3a6e;
  --white:          #142244;
}
```

---

> **📌 Cara Menggunakan:**
> 1. Copy seluruh blok CSS Variables (Section 13) ke dalam file `css/app.css`
> 2. Gunakan token variable saat styling, contoh: `color: var(--primary-500);`
> 3. Untuk komponen, copy CSS dari Section 9 sesuai kebutuhan
> 4. Selalu rujuk tabel pemetaan warna (Section 12) jika ragu konversi
> 5. Pastikan semua nominal uang menggunakan `font-variant-numeric: tabular-nums`
