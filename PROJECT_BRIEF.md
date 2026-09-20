# 💰 Personal Wallet — Project Brief

## Overview

**Personal Wallet** adalah aplikasi web untuk mengelola keuangan pribadi secara offline. Pengguna dapat membuat dan mengelola beberapa wallet (dompet), mencatat pemasukan dan pengeluaran, mengkategorikan transaksi, serta melihat statistik keuangan secara mingguan dan bulanan.

## Tech Stack

| Layer       | Teknologi                        |
|-------------|----------------------------------|
| Markup      | HTML5 (Semantic)                 |
| Styling     | Tailwind CSS (CDN)               |
| Logic       | Vanilla JavaScript (ES6+)        |
| Storage     | `localStorage` (Browser)         |
| Charts      | Chart.js (CDN) — opsional        |

> **Catatan:** Tidak ada backend/server. Semua data disimpan di `localStorage` browser pengguna.

---

## Fitur Utama

### 1. 🏦 Manajemen Wallet
- Buat, edit, dan hapus wallet (misal: Cash, BCA, GoPay, OVO, Dana, dll.)
- Setiap wallet punya nama, ikon/warna, dan saldo awal
- Lihat saldo real-time per wallet dan total keseluruhan
- Transfer antar wallet

### 2. 💸 Pencatatan Transaksi
- Catat **pemasukan** (income) dan **pengeluaran** (expense)
- Pilih wallet sumber untuk setiap transaksi
- Input: jumlah, deskripsi, kategori, tanggal, wallet
- Edit dan hapus transaksi yang sudah ada
- Saldo wallet otomatis ter-update setelah transaksi

### 3. 🏷️ Kategori Transaksi
- Kategori default untuk pengeluaran:
  - 🍔 Makanan & Minuman
  - 🚗 Transportasi
  - 🛒 Belanja / Shopping
  - 🏠 Rumah & Utilitas
  - 🎮 Hiburan
  - 💊 Kesehatan
  - 📚 Pendidikan
  - 👕 Fashion
  - 💼 Lainnya
- Kategori default untuk pemasukan:
  - 💰 Gaji
  - 🎁 Bonus
  - 💼 Freelance
  - 📈 Investasi
  - 💵 Lainnya
- User bisa menambah kategori custom

### 4. 📊 Statistik & Laporan
- **Dashboard** — ringkasan total saldo, pemasukan, pengeluaran bulan ini
- **Weekly Stats** — grafik pengeluaran & pemasukan per hari dalam 1 minggu
- **Monthly Stats** — grafik pengeluaran & pemasukan per minggu dalam 1 bulan
- **Breakdown Kategori** — pie chart / bar chart pengeluaran per kategori
- **Perbandingan Wallet** — distribusi saldo antar wallet
- Filter berdasarkan rentang tanggal

### 5. 🔍 Riwayat Transaksi
- List semua transaksi dengan filter:
  - Per wallet
  - Per kategori
  - Per tipe (pemasukan / pengeluaran)
  - Per rentang tanggal
- Pencarian berdasarkan deskripsi transaksi
- Sortir berdasarkan tanggal, jumlah, atau kategori

---

## Halaman / Views

| #  | Halaman              | Deskripsi                                                  |
|----|----------------------|------------------------------------------------------------|
| 1  | **Dashboard**        | Ringkasan saldo, statistik cepat, transaksi terakhir       |
| 2  | **Wallets**          | Daftar semua wallet, saldo, dan opsi kelola                |
| 3  | **Tambah Transaksi** | Form input transaksi (income/expense)                      |
| 4  | **Riwayat**          | Daftar lengkap transaksi dengan filter & search            |
| 5  | **Statistik**        | Grafik weekly, monthly, breakdown kategori                 |
| 6  | **Pengaturan**       | Kelola kategori custom, export/import data, reset data     |

> **Tips:** Gunakan SPA (Single Page Application) pattern dengan vanilla JS untuk navigasi antar halaman tanpa reload.

---

## Data Model (localStorage)

### Wallet
```json
{
  "id": "wallet_1694000000000",
  "name": "BCA",
  "color": "#2563eb",
  "icon": "🏦",
  "initialBalance": 5000000,
  "createdAt": "2026-09-07T12:00:00.000Z"
}
```

### Transaction
```json
{
  "id": "txn_1694000000001",
  "type": "expense",
  "amount": 75000,
  "description": "Makan siang di restoran",
  "categoryId": "cat_food",
  "walletId": "wallet_1694000000000",
  "date": "2026-09-07",
  "createdAt": "2026-09-07T12:30:00.000Z"
}
```

### Category
```json
{
  "id": "cat_food",
  "name": "Makanan & Minuman",
  "icon": "🍔",
  "type": "expense",
  "isDefault": true
}
```

### Transfer
```json
{
  "id": "transfer_1694000000002",
  "fromWalletId": "wallet_1694000000000",
  "toWalletId": "wallet_1694000000001",
  "amount": 500000,
  "description": "Top up GoPay",
  "date": "2026-09-07",
  "createdAt": "2026-09-07T13:00:00.000Z"
}
```

### localStorage Keys
| Key                  | Tipe       | Deskripsi                        |
|----------------------|------------|----------------------------------|
| `pw_wallets`         | `Array`    | Daftar semua wallet              |
| `pw_transactions`    | `Array`    | Daftar semua transaksi           |
| `pw_categories`      | `Array`    | Daftar kategori (default+custom) |
| `pw_transfers`       | `Array`    | Daftar transfer antar wallet     |
| `pw_settings`        | `Object`   | Pengaturan aplikasi              |

---

## User Stories

### Epic 1: Manajemen Wallet

| ID     | User Story                                                                                                          | Priority |
|--------|---------------------------------------------------------------------------------------------------------------------|----------|
| US-101 | Sebagai pengguna, saya ingin **membuat wallet baru** dengan nama, warna, dan saldo awal agar saya bisa mengorganisir uang saya di berbagai tempat. | 🔴 High |
| US-102 | Sebagai pengguna, saya ingin **melihat daftar semua wallet** beserta saldonya agar saya tahu berapa uang yang tersedia. | 🔴 High |
| US-103 | Sebagai pengguna, saya ingin **mengedit detail wallet** (nama, warna) agar informasinya tetap akurat. | 🟡 Medium |
| US-104 | Sebagai pengguna, saya ingin **menghapus wallet** yang sudah tidak digunakan agar daftar wallet tetap rapi. | 🟡 Medium |
| US-105 | Sebagai pengguna, saya ingin **melihat total saldo** dari semua wallet agar tahu total kekayaan saya. | 🔴 High |
| US-106 | Sebagai pengguna, saya ingin **melakukan transfer antar wallet** agar saya bisa memindahkan uang dari satu tempat ke tempat lain. | 🟡 Medium |

### Epic 2: Pencatatan Transaksi

| ID     | User Story                                                                                                          | Priority |
|--------|---------------------------------------------------------------------------------------------------------------------|----------|
| US-201 | Sebagai pengguna, saya ingin **mencatat pengeluaran** dengan jumlah, deskripsi, kategori, tanggal, dan wallet agar keuangan tercatat rapi. | 🔴 High |
| US-202 | Sebagai pengguna, saya ingin **mencatat pemasukan** dengan jumlah, deskripsi, kategori, tanggal, dan wallet agar saya tahu sumber income saya. | 🔴 High |
| US-203 | Sebagai pengguna, saya ingin **memilih wallet** saat mencatat transaksi agar saldo wallet yang tepat ter-update. | 🔴 High |
| US-204 | Sebagai pengguna, saya ingin **memilih kategori** untuk setiap transaksi agar pengeluaran terkategorisasi. | 🔴 High |
| US-205 | Sebagai pengguna, saya ingin **mengedit transaksi** yang sudah tercatat jika ada kesalahan input. | 🟡 Medium |
| US-206 | Sebagai pengguna, saya ingin **menghapus transaksi** yang salah agar data keuangan akurat. | 🟡 Medium |
| US-207 | Sebagai pengguna, saya ingin **melihat detail item yang dibeli** pada setiap transaksi pengeluaran. | 🟢 Low |

### Epic 3: Kategori

| ID     | User Story                                                                                                          | Priority |
|--------|---------------------------------------------------------------------------------------------------------------------|----------|
| US-301 | Sebagai pengguna, saya ingin **kategori default** sudah tersedia saat pertama kali membuka aplikasi. | 🔴 High |
| US-302 | Sebagai pengguna, saya ingin **menambahkan kategori custom** agar sesuai dengan kebutuhan saya. | 🟡 Medium |
| US-303 | Sebagai pengguna, saya ingin **mengedit kategori custom** yang sudah saya buat. | 🟢 Low |
| US-304 | Sebagai pengguna, saya ingin **menghapus kategori custom** yang tidak terpakai. | 🟢 Low |

### Epic 4: Riwayat & Filter

| ID     | User Story                                                                                                          | Priority |
|--------|---------------------------------------------------------------------------------------------------------------------|----------|
| US-401 | Sebagai pengguna, saya ingin **melihat riwayat semua transaksi** agar saya bisa review pengeluaran dan pemasukan. | 🔴 High |
| US-402 | Sebagai pengguna, saya ingin **memfilter transaksi berdasarkan wallet** agar saya bisa lihat transaksi per wallet. | 🟡 Medium |
| US-403 | Sebagai pengguna, saya ingin **memfilter transaksi berdasarkan kategori** agar saya tahu pengeluaran per kategori. | 🟡 Medium |
| US-404 | Sebagai pengguna, saya ingin **memfilter transaksi berdasarkan tipe** (income/expense) agar lebih fokus. | 🟡 Medium |
| US-405 | Sebagai pengguna, saya ingin **memfilter transaksi berdasarkan tanggal** agar saya bisa lihat data periode tertentu. | 🟡 Medium |
| US-406 | Sebagai pengguna, saya ingin **mencari transaksi berdasarkan deskripsi** agar mudah menemukan transaksi spesifik. | 🟢 Low |

### Epic 5: Statistik & Dashboard

| ID     | User Story                                                                                                          | Priority |
|--------|---------------------------------------------------------------------------------------------------------------------|----------|
| US-501 | Sebagai pengguna, saya ingin **melihat dashboard** dengan ringkasan total saldo, pemasukan & pengeluaran bulan ini. | 🔴 High |
| US-502 | Sebagai pengguna, saya ingin **melihat statistik mingguan (weekly)** berupa grafik pemasukan & pengeluaran per hari. | 🔴 High |
| US-503 | Sebagai pengguna, saya ingin **melihat statistik bulanan (monthly)** berupa grafik pemasukan & pengeluaran per minggu. | 🔴 High |
| US-504 | Sebagai pengguna, saya ingin **melihat breakdown pengeluaran per kategori** dalam bentuk chart agar tahu pos terbesar. | 🔴 High |
| US-505 | Sebagai pengguna, saya ingin **melihat distribusi saldo antar wallet** agar tahu persebaran uang saya. | 🟡 Medium |
| US-506 | Sebagai pengguna, saya ingin **melihat 5 transaksi terakhir** di dashboard agar cepat review. | 🟡 Medium |
| US-507 | Sebagai pengguna, saya ingin **memilih rentang tanggal** pada halaman statistik agar bisa analisis periode tertentu. | 🟡 Medium |

### Epic 6: Pengaturan & Data

| ID     | User Story                                                                                                          | Priority |
|--------|---------------------------------------------------------------------------------------------------------------------|----------|
| US-601 | Sebagai pengguna, saya ingin **export data** ke format JSON agar saya punya backup data. | 🟡 Medium |
| US-602 | Sebagai pengguna, saya ingin **import data** dari file JSON agar bisa restore data. | 🟡 Medium |
| US-603 | Sebagai pengguna, saya ingin **reset semua data** jika ingin mulai dari awal. | 🟢 Low |
| US-604 | Sebagai pengguna, saya ingin **data tersimpan otomatis** di browser tanpa perlu login. | 🔴 High |

---

## UI/UX Guidelines

### Design Principles
- **Mobile-first** — Responsive, optimal di layar HP 360px–428px
- **Clean & minimal** — Warna netral dengan aksen hijau (income) dan merah (expense)
- **Quick input** — Proses catat transaksi harus bisa selesai dalam 3 tap/klik
- **Dark mode ready** — Support light & dark theme

### Color Palette
| Elemen          | Light Mode      | Dark Mode       |
|-----------------|-----------------|-----------------|
| Background      | `#f8fafc`       | `#0f172a`       |
| Card            | `#ffffff`       | `#1e293b`       |
| Primary         | `#3b82f6`       | `#60a5fa`       |
| Income (Green)  | `#22c55e`       | `#4ade80`       |
| Expense (Red)   | `#ef4444`       | `#f87171`       |
| Text Primary    | `#1e293b`       | `#f1f5f9`       |
| Text Secondary  | `#64748b`       | `#94a3b8`       |

### Typography
- Font: `Inter` (Google Fonts) atau sistem default (`ui-sans-serif`)
- Heading: `font-bold`
- Angka/nominal: `font-mono` atau `tabular-nums`

### Layout
```
┌──────────────────────────────┐
│         Top Bar / Header     │
├──────────────────────────────┤
│                              │
│        Content Area          │
│                              │
│                              │
│                              │
├──────────────────────────────┤
│   ➕ Floating Action Button  │
├──────────────────────────────┤
│  🏠  📊  ➕  📋  ⚙️          │
│      Bottom Navigation       │
└──────────────────────────────┘
```

---

## Struktur File

```
project_financeApp/
├── index.html              # Entry point, semua views
├── css/
│   └── app.css             # Custom styles (di luar Tailwind)
├── js/
│   ├── app.js              # Entry point, router, init
│   ├── store.js            # localStorage manager (CRUD)
│   ├── router.js           # SPA navigation handler
│   ├── utils.js            # Helper functions (format currency, date, etc.)
│   ├── components/
│   │   ├── dashboard.js    # Dashboard view
│   │   ├── wallets.js      # Wallet management view
│   │   ├── transaction.js  # Add/edit transaction form
│   │   ├── history.js      # Transaction history view
│   │   ├── stats.js        # Statistics & charts view
│   │   └── settings.js     # Settings view
│   └── data/
│       └── defaults.js     # Default categories & initial data
├── assets/
│   └── icons/              # Custom icons (jika ada)
└── PROJECT_BRIEF.md        # File ini
```

---

## Acceptance Criteria (Definition of Done)

- [ ] Semua user story dengan priority 🔴 High sudah terimplementasi
- [ ] Aplikasi berjalan sepenuhnya di browser tanpa server
- [ ] Data persist di `localStorage` setelah browser ditutup
- [ ] Responsive di mobile (360px) dan desktop (1280px+)
- [ ] Tidak ada error di console browser
- [ ] Format angka menggunakan format Rupiah (Rp)
- [ ] Grafik/chart statistik berfungsi dan akurat
- [ ] Export/Import JSON berfungsi dengan benar

---

## Milestones

| Phase   | Scope                                       | Target       |
|---------|---------------------------------------------|--------------|
| Phase 1 | Setup + Wallet Management + Transaksi Dasar | Minggu ke-1  |
| Phase 2 | Riwayat + Filter + Kategori Custom          | Minggu ke-2  |
| Phase 3 | Dashboard + Statistik (Weekly & Monthly)    | Minggu ke-3  |
| Phase 4 | Polish UI + Dark Mode + Export/Import        | Minggu ke-4  |

---

> **⚠️ PENTING:**
> Semua data disimpan di `localStorage` browser. Jika pengguna menghapus data browser, data aplikasi akan hilang. Fitur export/import JSON sangat penting sebagai backup.
