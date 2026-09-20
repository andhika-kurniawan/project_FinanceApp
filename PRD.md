# 📄 Product Requirements Document (PRD)
# Personal Wallet — Aplikasi Manajemen Keuangan Pribadi

---

## 1. Informasi Dokumen

| Field                | Detail                                      |
|----------------------|---------------------------------------------|
| **Nama Produk**      | Personal Wallet                             |
| **Versi Dokumen**    | 1.0                                         |
| **Tanggal Dibuat**   | 7 September 2026                            |
| **Terakhir Diubah**  | 7 September 2026                            |
| **Status**           | Draft                                       |
| **Author**           | —                                           |
| **Dokumen Terkait**  | [PROJECT_BRIEF.md](./PROJECT_BRIEF.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |

---

## 2. Ringkasan Eksekutif

**Personal Wallet** adalah aplikasi web berbasis browser untuk mengelola keuangan pribadi secara offline. Aplikasi ini memungkinkan pengguna membuat dan mengelola beberapa dompet digital (wallet), mencatat setiap pemasukan dan pengeluaran, mengkategorikan transaksi, serta memantau kesehatan keuangan melalui statistik mingguan dan bulanan — semuanya tanpa membutuhkan server atau koneksi internet.

### Problem Statement

Banyak orang kesulitan melacak arus keuangan pribadi karena:
- Uang tersebar di berbagai tempat (cash, rekening bank, e-wallet) tanpa gambaran total
- Tidak tahu kemana uang dibelanjakan setiap bulannya
- Aplikasi keuangan yang ada terlalu kompleks, butuh registrasi, atau berbayar
- Kekhawatiran privasi data keuangan disimpan di server pihak ketiga

### Proposed Solution

Aplikasi web ringan yang:
- Berjalan 100% di browser tanpa backend
- Menyimpan semua data di `localStorage` (privasi terjaga)
- Memberikan visualisasi pengeluaran per kategori, mingguan, dan bulanan
- Bisa diakses dari perangkat apapun yang punya browser modern

---

## 3. Tujuan & Sasaran

### 3.1 Tujuan Produk

| #  | Tujuan                                                                                   |
|----|------------------------------------------------------------------------------------------|
| G1 | Memberikan pengguna visibilitas penuh terhadap keuangan pribadi di semua wallet           |
| G2 | Mempermudah pencatatan transaksi harian dengan proses ≤ 3 klik                           |
| G3 | Menyediakan insight keuangan melalui statistik visual (weekly & monthly)                 |
| G4 | Menjaga privasi pengguna dengan menyimpan data 100% di perangkat lokal                   |

### 3.2 Key Results (Metrik Keberhasilan)

| Metrik                               | Target                        |
|--------------------------------------|-------------------------------|
| Waktu input transaksi baru           | ≤ 15 detik (3 tap/klik)       |
| Waktu loading halaman                | ≤ 1 detik                     |
| Data persistent setelah reload       | 100%                          |
| Layout konsisten di semua device     | Mobile-first (max-width 480px, centered) |
| Error rate di console                | 0                             |

### 3.3 Non-Goals (Out of Scope)

Hal-hal yang **tidak** termasuk dalam scope v1.0:
- ❌ Multi-user / collaborative budgeting
- ❌ Sinkronisasi antar perangkat (cloud sync)
- ❌ Koneksi ke API bank atau e-wallet
- ❌ Fitur budgeting / perencanaan anggaran
- ❌ Notifikasi / pengingat
- ❌ Multi-currency (hanya Rupiah / IDR)
- ❌ Progressive Web App (PWA) — bisa ditambahkan di v2.0

---

## 4. Target Pengguna

### 4.1 User Persona

#### Persona Utama: "Andi — Pekerja Muda"
| Atribut        | Detail                                                   |
|----------------|----------------------------------------------------------|
| **Umur**       | 22–35 tahun                                              |
| **Pekerjaan**  | Karyawan / Freelancer                                    |
| **Kebiasaan**  | Menggunakan 2–4 metode pembayaran (cash, debit, e-wallet)|
| **Pain Point** | Tidak tahu kemana uang habis setiap bulan                |
| **Kebutuhan**  | Cara cepat dan simpel untuk catat pengeluaran harian     |
| **Perangkat**  | Smartphone (primary), Laptop (secondary)                 |

#### Persona Sekunder: "Rina — Mahasiswa"
| Atribut        | Detail                                                   |
|----------------|----------------------------------------------------------|
| **Umur**       | 18–24 tahun                                              |
| **Pekerjaan**  | Mahasiswa dengan uang saku terbatas                      |
| **Kebiasaan**  | Belanja impulsif, jarang tracking keuangan               |
| **Pain Point** | Uang saku habis sebelum akhir bulan                      |
| **Kebutuhan**  | Visualisasi pengeluaran agar bisa hemat                  |
| **Perangkat**  | Smartphone only                                          |

### 4.2 Use Case Diagram

```
                        ┌─────────────────────┐
                        │    Personal Wallet   │
                        └──────────┬──────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
  ┌───────▼───────┐    ┌──────────▼──────────┐   ┌─────────▼─────────┐
  │  Kelola Wallet │    │  Catat Transaksi    │   │  Lihat Statistik  │
  └───────┬───────┘    └──────────┬──────────┘   └─────────┬─────────┘
          │                        │                        │
     ┌────┴────┐            ┌──────┴──────┐          ┌──────┴──────┐
     │ Tambah  │            │ Pemasukan   │          │ Dashboard   │
     │ Edit    │            │ Pengeluaran │          │ Weekly      │
     │ Hapus   │            │ Transfer    │          │ Monthly     │
     │ Transfer│            │ Edit/Hapus  │          │ Kategori    │
     └─────────┘            └─────────────┘          └─────────────┘
```

---

## 5. Spesifikasi Teknis

### 5.1 Tech Stack

| Layer          | Teknologi                  | Versi / CDN                                    |
|----------------|----------------------------|------------------------------------------------|
| **Markup**     | HTML5 Semantic             | —                                              |
| **Styling**    | Tailwind CSS               | CDN (Play CDN atau v3.x)                       |
| **JavaScript** | Vanilla JS (ES6+)          | Tanpa framework                                |
| **Storage**    | localStorage               | Web Storage API                                |
| **Charts**     | Chart.js                   | CDN v4.x                                       |
| **Font**       | Inter                      | Google Fonts CDN                               |
| **Icons**      | Emoji / Heroicons (opsional)| —                                             |

### 5.2 Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │              index.html                   │    │
│  │  ┌──────────────────────────────────┐     │    │
│  │  │         Tailwind CSS (CDN)        │     │    │
│  │  └──────────────────────────────────┘     │    │
│  │  ┌──────────────────────────────────┐     │    │
│  │  │     app.js (Entry Point)          │     │    │
│  │  │  ┌───────────┐  ┌─────────────┐  │     │    │
│  │  │  │ router.js  │  │  store.js    │  │     │    │
│  │  │  │ (SPA Nav)  │  │ (CRUD/LS)   │  │     │    │
│  │  │  └───────────┘  └──────┬──────┘  │     │    │
│  │  │  ┌───────────────────────────────┐│     │    │
│  │  │  │      View Components          ││     │    │
│  │  │  │  dashboard │ wallets │ stats  ││     │    │
│  │  │  │  history   │ txn     │ settings││    │    │
│  │  │  └───────────────────────────────┘│     │    │
│  │  └──────────────────────────────────┘     │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │            localStorage                    │    │
│  │  pw_wallets │ pw_transactions │ pw_categories│  │
│  │  pw_transfers │ pw_settings                 │  │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### 5.3 Struktur File

```
project_financeApp/
├── index.html                  # Single HTML entry point
├── css/
│   └── app.css                 # Custom styles tambahan
├── js/
│   ├── app.js                  # Bootstrap, init, event listeners global
│   ├── store.js                # Data layer — CRUD operations ke localStorage
│   ├── router.js               # Hash-based SPA router
│   ├── utils.js                # Helpers: formatRupiah(), formatDate(), generateId()
│   ├── components/
│   │   ├── dashboard.js        # View: Dashboard & ringkasan
│   │   ├── wallets.js          # View: Kelola wallet
│   │   ├── transaction.js      # View: Form tambah/edit transaksi
│   │   ├── history.js          # View: Riwayat transaksi + filter
│   │   ├── stats.js            # View: Statistik + chart
│   │   └── settings.js         # View: Pengaturan + export/import
│   └── data/
│       └── defaults.js         # Seed data: kategori default
├── assets/
│   └── icons/
├── PROJECT_BRIEF.md
└── PRD.md                      # File ini
```

### 5.4 Browser Support

| Browser         | Versi Minimum       |
|-----------------|---------------------|
| Chrome          | 80+                 |
| Firefox         | 78+                 |
| Safari          | 14+                 |
| Edge            | 80+                 |
| Samsung Internet| 13+                 |

> **Requirement:** ES6+ support, localStorage API, CSS Grid/Flexbox.

---

## 6. Data Model

### 6.1 Entity Relationship

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  Wallet  │───1:N─│  Transaction │──N:1──│ Category │
│          │       │              │       │          │
│ id       │       │ id           │       │ id       │
│ name     │       │ type         │       │ name     │
│ color    │       │ amount       │       │ icon     │
│ icon     │       │ description  │       │ type     │
│ initBal  │       │ categoryId   │       │ isDefault│
│ createdAt│       │ walletId     │       └──────────┘
└────┬─────┘       │ date         │
     │             │ createdAt    │
     │             └──────────────┘
     │
     │         ┌──────────────┐
     └──1:N───│   Transfer   │
              │              │
              │ id           │
              │ fromWalletId │
              │ toWalletId   │
              │ amount       │
              │ description  │
              │ date         │
              │ createdAt    │
              └──────────────┘
```

### 6.2 Skema Data Detail

#### `pw_wallets` — Array\<Wallet\>
| Field            | Type     | Required | Deskripsi                            |
|------------------|----------|----------|--------------------------------------|
| `id`             | string   | ✅       | Unique ID: `wallet_{timestamp}`       |
| `name`           | string   | ✅       | Nama wallet (max 30 char)             |
| `color`          | string   | ✅       | Hex color code: `#RRGGBB`            |
| `icon`           | string   | ✅       | Emoji icon                            |
| `initialBalance` | number   | ✅       | Saldo awal (min: 0)                  |
| `createdAt`      | string   | ✅       | ISO 8601 timestamp                    |

**Computed Fields (tidak disimpan, dihitung runtime):**
- `currentBalance` = `initialBalance` + Σ(income di wallet) − Σ(expense di wallet) + Σ(transfer masuk) − Σ(transfer keluar)

#### `pw_transactions` — Array\<Transaction\>
| Field         | Type     | Required | Deskripsi                              |
|---------------|----------|----------|----------------------------------------|
| `id`          | string   | ✅       | Unique ID: `txn_{timestamp}`            |
| `type`        | string   | ✅       | Enum: `"income"` \| `"expense"`        |
| `amount`      | number   | ✅       | Nominal transaksi (> 0)                |
| `description` | string   | ✅       | Deskripsi / nama item (max 100 char)   |
| `categoryId`  | string   | ✅       | FK ke Category.id                      |
| `walletId`    | string   | ✅       | FK ke Wallet.id                        |
| `date`        | string   | ✅       | Format: `YYYY-MM-DD`                  |
| `createdAt`   | string   | ✅       | ISO 8601 timestamp                     |

#### `pw_categories` — Array\<Category\>
| Field       | Type     | Required | Deskripsi                                |
|-------------|----------|----------|------------------------------------------|
| `id`        | string   | ✅       | Unique ID: `cat_{slug}`                   |
| `name`      | string   | ✅       | Nama kategori (max 30 char)               |
| `icon`      | string   | ✅       | Emoji icon                                |
| `type`      | string   | ✅       | Enum: `"income"` \| `"expense"`          |
| `isDefault` | boolean  | ✅       | `true` = default (tidak bisa dihapus)     |

#### `pw_transfers` — Array\<Transfer\>
| Field          | Type     | Required | Deskripsi                             |
|----------------|----------|----------|---------------------------------------|
| `id`           | string   | ✅       | Unique ID: `transfer_{timestamp}`      |
| `fromWalletId` | string   | ✅       | FK ke Wallet.id (sumber)               |
| `toWalletId`   | string   | ✅       | FK ke Wallet.id (tujuan)               |
| `amount`       | number   | ✅       | Nominal transfer (> 0)                |
| `description`  | string   | ❌       | Catatan opsional                       |
| `date`         | string   | ✅       | Format: `YYYY-MM-DD`                  |
| `createdAt`    | string   | ✅       | ISO 8601 timestamp                     |

#### `pw_settings` — Object
| Field       | Type     | Default     | Deskripsi                        |
|-------------|----------|-------------|----------------------------------|
| `theme`     | string   | `"light"`   | `"light"` \| `"dark"`           |
| `currency`  | string   | `"IDR"`     | Kode mata uang                    |
| `locale`    | string   | `"id-ID"`   | Locale untuk format angka         |

### 6.3 Kategori Default (Seed Data)

#### Kategori Pengeluaran
| ID              | Nama               | Icon |
|-----------------|--------------------| -----|
| `cat_food`      | Makanan & Minuman  | 🍔   |
| `cat_transport` | Transportasi       | 🚗   |
| `cat_shopping`  | Belanja / Shopping | 🛒   |
| `cat_housing`   | Rumah & Utilitas   | 🏠   |
| `cat_entertain` | Hiburan            | 🎮   |
| `cat_health`    | Kesehatan          | 💊   |
| `cat_education` | Pendidikan         | 📚   |
| `cat_fashion`   | Fashion            | 👕   |
| `cat_other_exp` | Lainnya            | 💼   |

#### Kategori Pemasukan
| ID              | Nama         | Icon |
|-----------------|------------- | -----|
| `cat_salary`    | Gaji         | 💰   |
| `cat_bonus`     | Bonus        | 🎁   |
| `cat_freelance` | Freelance    | 💼   |
| `cat_invest`    | Investasi    | 📈   |
| `cat_other_inc` | Lainnya      | 💵   |

---

## 7. Functional Requirements

### FR-01: Manajemen Wallet

| ID       | Requirement                                                                                                   | Priority |
|----------|---------------------------------------------------------------------------------------------------------------|----------|
| FR-01.1  | Sistem harus menyediakan form untuk membuat wallet baru dengan field: nama, warna (color picker), icon (emoji selector), dan saldo awal. | 🔴 High |
| FR-01.2  | Sistem harus menampilkan daftar semua wallet dalam bentuk card/list dengan info: nama, icon, warna, dan saldo saat ini. | 🔴 High |
| FR-01.3  | Sistem harus menghitung dan menampilkan `currentBalance` secara real-time berdasarkan `initialBalance` ± semua transaksi terkait. | 🔴 High |
| FR-01.4  | Sistem harus menampilkan total saldo gabungan dari semua wallet di bagian atas halaman wallet dan dashboard. | 🔴 High |
| FR-01.5  | Sistem harus menyediakan opsi edit wallet (nama, warna, icon). Saldo awal **tidak boleh** diedit setelah wallet dibuat. | 🟡 Medium |
| FR-01.6  | Sistem harus menyediakan opsi hapus wallet dengan konfirmasi dialog. Menghapus wallet juga menghapus semua transaksi terkait. | 🟡 Medium |
| FR-01.7  | Sistem harus menyediakan form transfer antar wallet dengan field: wallet asal, wallet tujuan, jumlah, deskripsi (opsional), dan tanggal. | 🟡 Medium |
| FR-01.8  | Validasi: nama wallet harus unik, saldo awal ≥ 0, minimal harus ada 1 wallet untuk bisa melakukan transaksi. | 🔴 High |

### FR-02: Pencatatan Transaksi

| ID       | Requirement                                                                                                   | Priority |
|----------|---------------------------------------------------------------------------------------------------------------|----------|
| FR-02.1  | Sistem harus menyediakan form transaksi dengan toggle tipe: Income / Expense.                                  | 🔴 High |
| FR-02.2  | Form transaksi harus memiliki field: jumlah (number), deskripsi (text), kategori (dropdown sesuai tipe), wallet (dropdown), dan tanggal (date picker, default hari ini). | 🔴 High |
| FR-02.3  | Dropdown kategori harus otomatis menampilkan kategori sesuai tipe yang dipilih (income → kategori income, expense → kategori expense). | 🔴 High |
| FR-02.4  | Setelah transaksi disimpan, saldo wallet terkait harus otomatis ter-update (+ untuk income, − untuk expense). | 🔴 High |
| FR-02.5  | Sistem harus menyediakan opsi edit transaksi. Saldo wallet harus di-recalculate setelah edit.                 | 🟡 Medium |
| FR-02.6  | Sistem harus menyediakan opsi hapus transaksi dengan konfirmasi. Saldo wallet harus di-recalculate setelah hapus. | 🟡 Medium |
| FR-02.7  | Validasi: jumlah > 0, deskripsi tidak boleh kosong, kategori harus dipilih, wallet harus dipilih.             | 🔴 High |
| FR-02.8  | Untuk tipe expense, pengguna harus bisa melihat nama item/barang yang dibeli di deskripsi transaksi.          | 🟢 Low |

### FR-03: Kategori

| ID       | Requirement                                                                                                   | Priority |
|----------|---------------------------------------------------------------------------------------------------------------|----------|
| FR-03.1  | Sistem harus menyediakan 14 kategori default (9 expense + 5 income) saat pertama kali dijalankan.             | 🔴 High |
| FR-03.2  | Kategori default tidak boleh diedit atau dihapus oleh pengguna.                                               | 🔴 High |
| FR-03.3  | Sistem harus menyediakan form untuk menambah kategori custom dengan field: nama, icon (emoji), dan tipe (income/expense). | 🟡 Medium |
| FR-03.4  | Kategori custom bisa diedit dan dihapus. Menghapus kategori yang masih dipakai transaksi harus menampilkan warning. | 🟡 Medium |

### FR-04: Riwayat & Filter

| ID       | Requirement                                                                                                   | Priority |
|----------|---------------------------------------------------------------------------------------------------------------|----------|
| FR-04.1  | Sistem harus menampilkan riwayat transaksi dalam list terurut berdasarkan tanggal (terbaru di atas).           | 🔴 High |
| FR-04.2  | Setiap item riwayat harus menampilkan: icon kategori, deskripsi, nama wallet, tanggal, dan jumlah (warna hijau untuk income, merah untuk expense). | 🔴 High |
| FR-04.3  | Sistem harus menyediakan filter berdasarkan: wallet, kategori, tipe (income/expense), dan rentang tanggal.     | 🟡 Medium |
| FR-04.4  | Filter bisa dikombinasikan (contoh: filter wallet BCA + kategori Makanan + bulan September).                   | 🟡 Medium |
| FR-04.5  | Sistem harus menyediakan search bar untuk mencari transaksi berdasarkan deskripsi (case-insensitive).          | 🟢 Low |
| FR-04.6  | Riwayat harus dikelompokkan per tanggal dengan header tanggal dan subtotal per hari.                           | 🟡 Medium |
| FR-04.7  | Implementasi pagination atau infinite scroll jika transaksi > 50 item.                                         | 🟢 Low |

### FR-05: Dashboard

| ID       | Requirement                                                                                                   | Priority |
|----------|---------------------------------------------------------------------------------------------------------------|----------|
| FR-05.1  | Dashboard harus menampilkan 3 summary card: Total Saldo (semua wallet), Total Pemasukan (bulan ini), Total Pengeluaran (bulan ini). | 🔴 High |
| FR-05.2  | Dashboard harus menampilkan persentase perubahan dibanding bulan sebelumnya (↑ atau ↓).                        | 🟡 Medium |
| FR-05.3  | Dashboard harus menampilkan 5 transaksi terakhir dengan link ke halaman riwayat lengkap.                       | 🟡 Medium |
| FR-05.4  | Dashboard harus menampilkan quick-view chart pengeluaran minggu ini (mini bar chart).                          | 🟡 Medium |
| FR-05.5  | Dashboard harus menampilkan daftar wallet dengan saldo sebagai horizontal card yang bisa di-scroll horizontal.  | 🟡 Medium |

### FR-06: Statistik

| ID       | Requirement                                                                                                   | Priority |
|----------|---------------------------------------------------------------------------------------------------------------|----------|
| FR-06.1  | Halaman statistik harus memiliki tab/toggle: **Weekly** dan **Monthly**.                                       | 🔴 High |
| FR-06.2  | **Weekly view**: Bar chart menampilkan total income vs expense per hari (Senin–Minggu) untuk minggu yang dipilih. | 🔴 High |
| FR-06.3  | **Monthly view**: Bar chart menampilkan total income vs expense per minggu (W1–W4/W5) untuk bulan yang dipilih.  | 🔴 High |
| FR-06.4  | Navigasi minggu/bulan: tombol ◀ dan ▶ untuk berpindah ke minggu/bulan sebelumnya atau berikutnya.              | 🔴 High |
| FR-06.5  | **Breakdown kategori**: Doughnut/pie chart menampilkan distribusi pengeluaran per kategori untuk periode yang dipilih. | 🔴 High |
| FR-06.6  | Di bawah pie chart, tampilkan list kategori dengan jumlah dan persentase, diurutkan dari terbesar.             | 🔴 High |
| FR-06.7  | **Distribusi wallet**: Horizontal bar chart atau doughnut chart menampilkan saldo per wallet.                   | 🟡 Medium |
| FR-06.8  | Summary card di atas chart: Total Income, Total Expense, dan Net (Income − Expense) untuk periode yang dipilih. | 🔴 High |

### FR-07: Pengaturan & Data

| ID       | Requirement                                                                                                   | Priority |
|----------|---------------------------------------------------------------------------------------------------------------|----------|
| FR-07.1  | Semua data harus otomatis tersimpan ke `localStorage` setiap kali ada perubahan (auto-save).                  | 🔴 High |
| FR-07.2  | Sistem harus menyediakan tombol **Export Data** yang mengunduh semua data sebagai file `.json`.                | 🟡 Medium |
| FR-07.3  | Format export: `{ wallets: [...], transactions: [...], categories: [...], transfers: [...], settings: {...}, exportedAt: "..." }`. | 🟡 Medium |
| FR-07.4  | Sistem harus menyediakan tombol **Import Data** yang menerima file `.json` dan me-replace semua data.         | 🟡 Medium |
| FR-07.5  | Sebelum import, tampilkan preview ringkasan data (jumlah wallet, transaksi, dll.) dan konfirmasi dialog.       | 🟡 Medium |
| FR-07.6  | Sistem harus menyediakan tombol **Reset Semua Data** dengan double confirmation (ketik "RESET" untuk konfirmasi). | 🟢 Low |
| FR-07.7  | Sistem harus menyediakan toggle **Dark Mode / Light Mode** yang tersimpan di settings.                         | 🟡 Medium |
| FR-07.8  | Halaman pengaturan harus menampilkan info storage usage (berapa KB/MB data di localStorage).                   | 🟢 Low |

---

## 8. Non-Functional Requirements

### NFR-01: Performa

| ID        | Requirement                                                                  |
|-----------|------------------------------------------------------------------------------|
| NFR-01.1  | Halaman harus load dalam < 1 detik pada koneksi 3G (setelah CDN ter-cache).  |
| NFR-01.2  | Operasi CRUD ke localStorage harus selesai dalam < 50ms.                     |
| NFR-01.3  | Render chart/grafik harus selesai dalam < 500ms.                             |
| NFR-01.4  | Aplikasi harus bisa menangani minimal 10.000 transaksi tanpa lag.            |

### NFR-02: Layout — Mobile-First di Semua Device

| ID        | Requirement                                                                  |
|-----------|------------------------------------------------------------------------------|
| NFR-02.1  | Aplikasi menggunakan **mobile-first design** — layout single column identik di mobile, tablet, maupun desktop. |
| NFR-02.2  | Container utama memiliki `max-width: 480px` dan ter-center secara horizontal (`margin: 0 auto`) di layar yang lebih besar. |
| NFR-02.3  | **Tidak ada** sidebar navigation, multi-column grid, atau layout yang berubah di breakpoint lebih besar. |
| NFR-02.4  | Bottom navigation bar tampil di **semua device** (mobile, tablet, desktop) — tidak berubah menjadi sidebar atau top nav. |
| NFR-02.5  | Touch target minimum 44×44px di semua device.                                |
| NFR-02.6  | Pada layar > 480px, background area di luar container bisa diberi warna/pattern subtle sebagai visual frame. |
| NFR-02.7  | Font size, spacing, dan komponen **tidak di-scale up** di layar besar — tetap konsisten seperti tampilan mobile. |
| NFR-02.8  | Pengalaman pengguna harus identik apakah dibuka di HP 360px, tablet 768px, atau monitor 1440px. |

### NFR-03: Aksesibilitas

| ID        | Requirement                                                                  |
|-----------|------------------------------------------------------------------------------|
| NFR-03.1  | Semua form input harus memiliki `label` yang terhubung.                      |
| NFR-03.2  | Warna harus memiliki contrast ratio minimal 4.5:1 (WCAG AA).                |
| NFR-03.3  | Semua interactive element harus bisa diakses via keyboard (tab navigation).  |
| NFR-03.4  | Menggunakan semantic HTML (`nav`, `main`, `section`, `article`, `button`).   |

### NFR-04: Keamanan & Privasi

| ID        | Requirement                                                                  |
|-----------|------------------------------------------------------------------------------|
| NFR-04.1  | Tidak ada data yang dikirim ke server manapun.                               |
| NFR-04.2  | Data hanya tersimpan di `localStorage` browser pengguna.                     |
| NFR-04.3  | Input harus di-sanitize untuk mencegah XSS (terutama pada deskripsi).        |
| NFR-04.4  | Export file tidak boleh mengandung executable code.                          |

### NFR-05: Maintainability

| ID        | Requirement                                                                  |
|-----------|------------------------------------------------------------------------------|
| NFR-05.1  | Kode harus modular dengan separation of concerns (view/store/router).        |
| NFR-05.2  | Setiap file JavaScript harus < 300 baris.                                    |
| NFR-05.3  | Menggunakan JSDoc comment untuk semua fungsi publik.                         |
| NFR-05.4  | Naming convention: camelCase untuk variabel/fungsi, PascalCase untuk class.  |

---

## 9. User Interface Specification

### 9.1 Design System

#### 🎯 Design Principle: Mobile-First di Semua Layar

Aplikasi ini menggunakan pendekatan **mobile-first design** yang konsisten di semua ukuran layar. Artinya tampilan di tablet dan desktop **identik** dengan tampilan mobile — tidak ada perubahan layout, tidak ada sidebar, tidak ada multi-column grid.

**Aturan utama:**
- Layout selalu **single column** dengan `max-width: 480px`
- Container **ter-center horizontal** (`margin: 0 auto`) di layar yang lebih besar
- Bottom navigation bar tetap tampil di **semua device** (tidak berubah jadi sidebar)
- Font size, spacing, dan ukuran komponen **tidak berubah** di layar besar
- Area di luar container pada layar besar bisa menggunakan background warna subtle / pattern

**Rasional:**
- Konsistensi UX — pengguna mendapatkan pengalaman yang sama di semua perangkat
- Mengurangi kompleksitas development (tidak perlu banyak breakpoint)
- Fokus pada use case utama: pengguna mencatat keuangan via smartphone
- Memastikan readability dan focus area yang optimal

**Visualisasi Layout di Berbagai Device:**

```
📱 Mobile (360px)           📱 Tablet (768px)              🖥️ Desktop (1440px)
┌──────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────────────────┐
│ ┌──────────────┐ │    │       ┌──────────┐       │    │            ┌──────────┐              │
│ │   Header     │ │    │       │  Header  │       │    │            │  Header  │              │
│ ├──────────────┤ │    │       ├──────────┤       │    │            ├──────────┤              │
│ │              │ │    │       │          │       │    │            │          │              │
│ │   Content    │ │    │ bg    │ Content  │  bg   │    │    bg      │ Content  │     bg       │
│ │              │ │    │       │          │       │    │            │          │              │
│ │              │ │    │       │          │       │    │            │          │              │
│ ├──────────────┤ │    │       ├──────────┤       │    │            ├──────────┤              │
│ │  Bottom Nav  │ │    │       │Bottom Nav│       │    │            │Bottom Nav│              │
│ └──────────────┘ │    │       └──────────┘       │    │            └──────────┘              │
└──────────────────┘    └──────────────────────────┘    └──────────────────────────────────────┘
    100% width             max-w: 480px centered           max-w: 480px centered
```

**CSS Implementation:**

```css
/* Container utama */
.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

/* Background pada layar besar */
body {
  background-color: #f1f5f9; /* Light mode outer bg */
}
.app-container {
  background-color: #f8fafc; /* Light mode inner bg */
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
}
```

#### Color Palette

| Token             | Light Mode  | Dark Mode   | Penggunaan                      |
|-------------------|-------------|-------------|---------------------------------|
| `--bg-primary`    | `#f8fafc`   | `#0f172a`   | Background utama                |
| `--bg-card`       | `#ffffff`   | `#1e293b`   | Card, modal, form               |
| `--bg-hover`      | `#f1f5f9`   | `#334155`   | Hover state                     |
| `--color-primary` | `#3b82f6`   | `#60a5fa`   | Tombol, link, aksen             |
| `--color-income`  | `#22c55e`   | `#4ade80`   | Indikator pemasukan             |
| `--color-expense` | `#ef4444`   | `#f87171`   | Indikator pengeluaran           |
| `--color-warning` | `#f59e0b`   | `#fbbf24`   | Warning, alert                  |
| `--text-primary`  | `#1e293b`   | `#f1f5f9`   | Teks utama                      |
| `--text-secondary`| `#64748b`   | `#94a3b8`   | Teks sekunder, placeholder      |
| `--border`        | `#e2e8f0`   | `#334155`   | Border card, divider            |

#### Typography

| Elemen            | Font         | Size     | Weight    |
|-------------------|-------------|----------|-----------|
| Page Title        | Inter        | 24px     | Bold (700)|
| Section Title     | Inter        | 18px     | Semibold (600) |
| Card Title        | Inter        | 16px     | Semibold (600) |
| Body              | Inter        | 14px     | Regular (400)  |
| Caption           | Inter        | 12px     | Regular (400)  |
| Amount (Nominal)  | Inter / Mono | 16–24px  | Bold (700)|

#### Spacing & Radius

| Token      | Value  | Penggunaan                  |
|------------|--------|-----------------------------|
| `--gap-xs` | 4px    | Spacing antar inline items   |
| `--gap-sm` | 8px    | Spacing dalam card           |
| `--gap-md` | 16px   | Spacing antar card/section   |
| `--gap-lg` | 24px   | Spacing section utama        |
| `--gap-xl` | 32px   | Page padding                 |
| `--radius` | 12px   | Border radius card           |
| `--radius-sm` | 8px | Button, input border radius  |

### 9.2 Screen Specifications

> **📱 Catatan:** Semua wireframe di bawah merepresentasikan tampilan mobile-first (max-width 480px) yang **identik di semua device**. Di tablet dan desktop, layout ini tampil ter-center dengan background subtle di area luar container.

#### 9.2.1 Dashboard (`#/dashboard`)

```
┌────────────────────────────────────┐
│  Personal Wallet          [🌙/☀️]  │  ← Header + theme toggle
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Total Saldo                 │  │  ← Summary card (primary)
│  │  Rp 12.500.000              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌─────────┐  ┌─────────────────┐  │
│  │ Income  │  │ Expense         │  │  ← 2 summary cards
│  │+2.5jt   │  │ -1.8jt          │  │
│  │ ↑12%    │  │ ↓5%             │  │
│  └─────────┘  └─────────────────┘  │
│                                    │
│  Wallet Saya    [Lihat Semua →]    │
│  ┌──────┐ ┌──────┐ ┌──────┐       │  ← Horizontal scroll cards
│  │🏦BCA │ │💵Cash│ │📱OVO │       │
│  │5.2jt │ │800rb │ │500rb │       │
│  └──────┘ └──────┘ └──────┘       │
│                                    │
│  Transaksi Terakhir [Semua →]      │
│  ┌──────────────────────────────┐  │
│  │ 🍔 Makan siang    -Rp75.000 │  │  ← Recent transactions
│  │ BCA · Hari ini              │  │
│  ├──────────────────────────────┤  │
│  │ 💰 Gaji         +Rp8.000.000│  │
│  │ BCA · 1 Sep                 │  │
│  ├──────────────────────────────┤  │
│  │ 🚗 Grab            -Rp25.000│  │
│  │ OVO · 1 Sep                 │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  🏠    📊    [➕]    📋    ⚙️     │  ← Bottom nav (mobile)
└────────────────────────────────────┘
```

#### 9.2.2 Wallets (`#/wallets`)

```
┌────────────────────────────────────┐
│  ← Wallet Saya          [+ Baru]  │
├────────────────────────────────────┤
│                                    │
│  Total: Rp 12.500.000             │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🏦 BCA                      │  │
│  │ Rp 5.200.000                │  │  ← Wallet card
│  │ ━━━━━━━━━━━━━━━━            │  │  ← Proportional bar
│  │                 [✏️] [🗑️]   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 💵 Cash                     │  │
│  │ Rp 800.000                  │  │
│  │ ━━━━━━                      │  │
│  │                 [✏️] [🗑️]   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 📱 OVO                      │  │
│  │ Rp 500.000                  │  │
│  │ ━━━━                        │  │
│  │                 [✏️] [🗑️]   │  │
│  └──────────────────────────────┘  │
│                                    │
│  [🔄 Transfer Antar Wallet]        │
│                                    │
├────────────────────────────────────┤
│  🏠    📊    [➕]    📋    ⚙️     │
└────────────────────────────────────┘
```

#### 9.2.3 Tambah Transaksi (`#/transaction`)

```
┌────────────────────────────────────┐
│  ← Tambah Transaksi               │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────┬───────────────┐  │
│  │   INCOME     │   EXPENSE     │  │  ← Toggle (tab active=bold)
│  └──────────────┴───────────────┘  │
│                                    │
│  Jumlah                            │
│  ┌──────────────────────────────┐  │
│  │ Rp  │ 75.000                 │  │  ← Number input + auto format
│  └──────────────────────────────┘  │
│                                    │
│  Deskripsi                         │
│  ┌──────────────────────────────┐  │
│  │ Makan siang di restoran     │  │
│  └──────────────────────────────┘  │
│                                    │
│  Kategori                          │
│  ┌──────────────────────────────┐  │
│  │ 🍔 Makanan & Minuman      ▼ │  │  ← Dropdown
│  └──────────────────────────────┘  │
│                                    │
│  Wallet                            │
│  ┌──────────────────────────────┐  │
│  │ 🏦 BCA                    ▼ │  │  ← Dropdown
│  └──────────────────────────────┘  │
│                                    │
│  Tanggal                           │
│  ┌──────────────────────────────┐  │
│  │ 07 September 2026           │  │  ← Date picker
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │        💾 SIMPAN             │  │  ← Primary button
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  🏠    📊    [➕]    📋    ⚙️     │
└────────────────────────────────────┘
```

#### 9.2.4 Riwayat Transaksi (`#/history`)

```
┌────────────────────────────────────┐
│  ← Riwayat                [🔍]    │
├────────────────────────────────────┤
│                                    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │  ← Filter chips
│  │Semua│ │Wallet│ │Tipe │ │Date │  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│                                    │
│  📅 Hari Ini — 7 Sep 2026         │
│  ┌──────────────────────────────┐  │
│  │ 🍔 Makan siang    -Rp75.000 │  │
│  │ BCA · 12:30                 │  │
│  ├──────────────────────────────┤  │
│  │ 🚗 Grab            -Rp25.000│  │
│  │ OVO · 10:15                 │  │
│  └──────────────────────────────┘  │
│  Total hari ini: -Rp100.000        │
│                                    │
│  📅 6 Sep 2026                     │
│  ┌──────────────────────────────┐  │
│  │ 💰 Gaji         +Rp8.000.000│  │
│  │ BCA · 09:00                 │  │
│  ├──────────────────────────────┤  │
│  │ 🛒 Belanja bulanan -Rp450.000│ │
│  │ Cash · 14:00                │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  🏠    📊    [➕]    📋    ⚙️     │
└────────────────────────────────────┘
```

#### 9.2.5 Statistik (`#/stats`)

```
┌────────────────────────────────────┐
│  ← Statistik                      │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────┬───────────────┐  │
│  │   WEEKLY     │   MONTHLY     │  │  ← Tab toggle
│  └──────────────┴───────────────┘  │
│                                    │
│  ◀  1 - 7 Sep 2026  ▶             │  ← Week/Month navigator
│                                    │
│  ┌─────────┐ ┌─────────┐ ┌──────┐ │
│  │ Income  │ │ Expense │ │ Net  │ │  ← Summary cards
│  │+2.5jt   │ │ -1.8jt  │ │+700rb│ │
│  └─────────┘ └─────────┘ └──────┘ │
│                                    │
│  Income vs Expense                 │
│  ┌──────────────────────────────┐  │
│  │  ██                          │  │
│  │  ██ ▓▓                       │  │  ← Grouped bar chart
│  │  ██ ▓▓    ██                 │  │     (green=income, red=expense)
│  │  ██ ▓▓ ██ ██ ▓▓             │  │
│  │  ██ ▓▓ ██ ██ ▓▓ ██ ▓▓      │  │
│  │  Se Ra Rb Ka Ju Sa Mi       │  │
│  └──────────────────────────────┘  │
│                                    │
│  Pengeluaran per Kategori          │
│  ┌──────────────────────────────┐  │
│  │      ┌────┐                  │  │
│  │    ╱ 🍔35% ╲                │  │  ← Doughnut chart
│  │   │ 🚗20%   │               │  │
│  │    ╲ 🛒15% ╱                │  │
│  │      └────┘                  │  │
│  ├──────────────────────────────┤  │
│  │ 🍔 Makanan    Rp630.000 35% │  │  ← Category breakdown list
│  │ 🚗 Transport  Rp360.000 20% │  │
│  │ 🛒 Belanja    Rp270.000 15% │  │
│  │ 🎮 Hiburan    Rp180.000 10% │  │
│  │ 💼 Lainnya    Rp360.000 20% │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  🏠    📊    [➕]    📋    ⚙️     │
└────────────────────────────────────┘
```

### 9.3 User Interaction Flows

#### Flow 1: Pertama Kali Membuka Aplikasi
```
Buka App → Cek localStorage kosong?
  ├── Ya → Init default categories → Tampilkan onboarding
  │         → Prompt buat wallet pertama → Dashboard (kosong)
  └── Tidak → Load data → Dashboard
```

#### Flow 2: Mencatat Pengeluaran
```
Dashboard → Tap ➕ FAB → Form Transaksi
  → Pilih "Expense" → Input jumlah
  → Tulis deskripsi (misal: "Nasi Goreng")
  → Pilih kategori: 🍔 Makanan
  → Pilih wallet: 🏦 BCA
  → Tanggal: (default hari ini)
  → Tap "Simpan" → ✅ Toast "Berhasil!"
  → Redirect ke Dashboard (saldo ter-update)
```

#### Flow 3: Melihat Statistik Mingguan
```
Bottom Nav → Tap 📊 Statistik
  → Default: tab "Weekly", minggu ini
  → Lihat bar chart (Sen–Min)
  → Lihat breakdown kategori
  → Tap ◀ → Minggu sebelumnya
  → Tap kategori di chart → Lihat detail transaksi
```

#### Flow 4: Transfer Antar Wallet
```
Bottom Nav → Tap 🏠 Wallets
  → Tap "Transfer Antar Wallet"
  → Pilih wallet asal: BCA
  → Pilih wallet tujuan: OVO
  → Input jumlah: 500.000
  → Tap "Transfer" → ✅ Berhasil
  → Saldo BCA berkurang, saldo OVO bertambah
```

---

## 10. User Stories (Detail dengan Acceptance Criteria)

### US-101: Membuat Wallet Baru

**Sebagai** pengguna,
**Saya ingin** membuat wallet baru dengan nama, warna, dan saldo awal,
**Agar** saya bisa mengorganisir uang saya di berbagai tempat.

**Acceptance Criteria:**
- [ ] Form tersedia dengan field: Nama (text, required, max 30 char), Warna (color picker), Icon (emoji selector), Saldo Awal (number, required, ≥ 0)
- [ ] Nama wallet harus unik (validasi duplikat)
- [ ] Setelah submit, wallet muncul di daftar wallet
- [ ] Data tersimpan di `localStorage` key `pw_wallets`
- [ ] Tampilkan toast notification "Wallet berhasil dibuat!"
- [ ] Jika field required kosong, tampilkan error message inline

---

### US-201: Mencatat Pengeluaran

**Sebagai** pengguna,
**Saya ingin** mencatat pengeluaran dengan jumlah, deskripsi, kategori, tanggal, dan wallet,
**Agar** keuangan saya tercatat rapi.

**Acceptance Criteria:**
- [ ] Toggle tipe (Income / Expense) tersedia, default: Expense
- [ ] Field: Jumlah (number, > 0), Deskripsi (text, required), Kategori (dropdown, filtered by type), Wallet (dropdown), Tanggal (date, default: hari ini)
- [ ] Dropdown kategori hanya menampilkan kategori bertipe "expense"
- [ ] Setelah submit, transaksi tersimpan di `pw_transactions`
- [ ] Saldo wallet terkait otomatis berkurang sebesar jumlah transaksi
- [ ] Format input jumlah: auto-format ke format ribuan (75000 → 75.000)
- [ ] Redirect ke dashboard setelah berhasil simpan
- [ ] Tampilkan toast notification "Transaksi berhasil disimpan!"

---

### US-502: Statistik Mingguan

**Sebagai** pengguna,
**Saya ingin** melihat statistik mingguan berupa grafik pemasukan & pengeluaran per hari,
**Agar** saya bisa memantau pola keuangan mingguan.

**Acceptance Criteria:**
- [ ] Bar chart menampilkan 7 bar group (Senin–Minggu)
- [ ] Setiap group memiliki 2 bar: hijau (income) dan merah (expense)
- [ ] Default menampilkan minggu saat ini
- [ ] Tombol navigasi ◀ ▶ untuk berpindah minggu
- [ ] Label minggu: "1 Sep – 7 Sep 2026"
- [ ] Summary card di atas: Total Income, Total Expense, Net
- [ ] Jika tidak ada data, tampilkan empty state "Belum ada transaksi minggu ini"

---

### US-503: Statistik Bulanan

**Sebagai** pengguna,
**Saya ingin** melihat statistik bulanan berupa grafik pemasukan & pengeluaran per minggu,
**Agar** saya bisa memantau pola keuangan bulanan.

**Acceptance Criteria:**
- [ ] Bar chart menampilkan 4–5 bar group (Week 1 – Week 5)
- [ ] Setiap group memiliki 2 bar: hijau (income) dan merah (expense)
- [ ] Default menampilkan bulan saat ini
- [ ] Tombol navigasi ◀ ▶ untuk berpindah bulan
- [ ] Label bulan: "September 2026"
- [ ] Summary card di atas: Total Income, Total Expense, Net
- [ ] Breakdown kategori di bawah chart

---

## 11. Constraints & Limitations

### 11.1 Keterbatasan Teknis

| Constraint                        | Detail                                              | Mitigasi                                    |
|-----------------------------------|-----------------------------------------------------|---------------------------------------------|
| `localStorage` limit ~5-10 MB     | Tergantung browser                                  | Monitor usage, warn di > 4 MB               |
| Tidak ada sync antar device       | Data hanya di 1 browser                             | Export/import JSON sebagai manual sync       |
| Tidak ada undo/redo               | Aksi hapus bersifat permanen                        | Konfirmasi dialog sebelum hapus              |
| Tanpa autentikasi                 | Siapa saja yang akses browser bisa lihat data       | Tidak menyimpan data sensitif (no rekening)  |
| Single currency                   | Hanya support IDR (Rupiah)                          | Bisa ditambahkan di v2.0                     |

### 11.2 Asumsi

- Pengguna menggunakan browser modern (Chrome 80+, Firefox 78+, Safari 14+)
- Pengguna tidak menghapus localStorage browser secara berkala
- Jumlah wallet per user: ≤ 20
- Jumlah transaksi per user: ≤ 10.000
- Pengguna familiar dengan konsep pemasukan dan pengeluaran dasar

---

## 12. Release Plan

### v1.0 — MVP (Minimum Viable Product)

| Phase   | Fitur                                                   | Durasi      | Kriteria Selesai                              |
|---------|---------------------------------------------------------|-------------|-----------------------------------------------|
| Phase 1 | Setup project + Wallet CRUD + Transaksi CRUD            | Minggu ke-1 | Bisa buat wallet & catat transaksi             |
| Phase 2 | Riwayat transaksi + Filter & Search + Kategori custom   | Minggu ke-2 | Bisa filter & cari transaksi                   |
| Phase 3 | Dashboard + Statistik Weekly & Monthly + Charts         | Minggu ke-3 | Grafik & dashboard berfungsi akurat            |
| Phase 4 | Dark mode + Export/Import + Polish UI + Bug fixing       | Minggu ke-4 | Semua fitur high priority berfungsi            |

### v2.0 — Future Enhancements (Post-MVP)

| Fitur                       | Deskripsi                                         |
|-----------------------------|---------------------------------------------------|
| PWA Support                 | Installable, offline-first                        |
| Recurring Transactions      | Otomatis catat transaksi berulang (gaji, sewa)    |
| Budget Planner              | Set budget per kategori per bulan                 |
| Multi-Currency              | Support mata uang selain IDR                      |
| Cloud Sync                  | Sinkronisasi antar perangkat via Firebase/Supabase|
| Photo Receipt               | Lampirkan foto struk/bon ke transaksi             |
| Yearly Report               | Statistik tahunan dan ringkasan akhir tahun       |
| Split Transaction           | Pecah 1 transaksi ke beberapa kategori            |

---

## 13. Glossary

| Istilah        | Definisi                                                              |
|----------------|-----------------------------------------------------------------------|
| **Wallet**     | Representasi digital dari tempat menyimpan uang (rekening, e-wallet, cash) |
| **Transaction**| Catatan pemasukan (income) atau pengeluaran (expense)                 |
| **Category**   | Label pengelompokan transaksi (misal: Makanan, Transportasi)          |
| **Transfer**   | Pemindahan saldo dari satu wallet ke wallet lain                      |
| **Dashboard**  | Halaman utama berisi ringkasan keuangan                               |
| **Income**     | Pemasukan / uang masuk                                                |
| **Expense**    | Pengeluaran / uang keluar                                             |
| **Net**        | Selisih antara total income dan total expense                         |
| **Seed Data**  | Data awal yang otomatis dibuat saat pertama kali menjalankan aplikasi  |
| **SPA**        | Single Page Application — navigasi tanpa reload halaman               |
| **localStorage**| Web Storage API untuk menyimpan data di browser secara persistent     |

---

## 14. Lampiran

### A. Referensi Design Inspirasi

Aplikasi yang bisa dijadikan referensi visual:
- Money Manager (Mobile App)
- Wallet by BudgetBakers
- Monefy
- Bluecoins

### B. Format Mata Uang

```javascript
// Format: Rp 1.250.000
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
```

### C. ID Generation

```javascript
// Format: {prefix}_{timestamp}
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}
// Output: "wallet_1694000000000_a1b2c"
```

---

> **⚠️ PENTING:**
> Dokumen ini bersifat living document. Perubahan akan di-track melalui versi dokumen di bagian atas. Semua keputusan desain yang menyimpang dari PRD ini harus didokumentasikan.
