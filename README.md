<div align="center">
  
  <img src="public/pusaka-logo.png" alt="PUSAKA Logo" width="220" style="border-radius: 16px; margin-bottom: 12px;" />

  # 🤝 PUSAKA
  ### Pusat Pengadaan & Akreditasi Supplier Nusantara
  **Platform AI-Powered B2B Sourcing Pertama di Indonesia yang Menghubungkan Korporasi dengan UMKM Lokal Terpercaya**
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://pusaka-lyart.vercel.app)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/AbdanRasya/LOMBAHELMYKUKUHABDAN)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  
  **Submission for ITECHNO CUP 2026 - Web Development**
  
  **By Manut Team**
  
</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Tim Developer](#-tim-developer)
- [Fitur Unggulan](#-fitur-unggulan)
- [Demo & Screenshot](#-demo--screenshot)
- [Teknologi](#-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Lisensi](#-lisensi)

---

## 👥 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **Helmy Asyraf Risqi Ariebowo** | Project Lead & Backend AI | [GitHub](https://github.com/henzih) |
| **Muhammad Kukuh Fauzi Prasetyadi** | Frontend & QA | [GitHub](https://github.com/KukuhFauzy) |
| **Abdan Muhammad Izzan Rasyadan** | Backend & Frontend | [GitHub](https://github.com/AbdanRasya) |

---

## 🎯 Tentang Proyek

### Latar Belakang

Banyak perusahaan korporasi membutuhkan supplier lokal yang mampu memenuhi kebutuhan produksi skala besar. Namun, mereka kerap kesulitan menemukan UMKM yang sesuai berdasarkan kriteria spesifik seperti kapasitas produksi, lokasi geografis, standar kualitas, legalitas (NIB, NPWP, SIUP), dan sertifikasi mutu (SNI, Halal, TKDN). 

Di sisi lain, jutaan UMKM lokal Indonesia memiliki produk berkualitas tinggi dan kemampuan manufaktur yang andal, namun kesulitan menembus pasar korporat akibat keterbatasan jaringan, informasi tender B2B, dan transparansi kesiapan usaha.

### Solusi yang Ditawarkan

**PUSAKA** (*Pusat Pengadaan & Akreditasi Supplier Nusantara*) hadir sebagai platform B2B sourcing berbasis kecerdasan buatan (AI) yang menjembatani UMKM lokal dengan perusahaan buyer secara transparan, efisien, dan terstruktur. Melalui PUSAKA, perusahaan dapat dengan cepat menemukan supplier terverifikasi, membuat *Request for Quotation* (RFQ), mengelola pesanan, serta menganalisis *Trust Score* supplier.

Kecerdasan Buatan (Google Gemini AI) diintegrasikan untuk:
- Mencocokkan kebutuhan pengadaan perusahaan dengan UMKM secara cerdas (*AI Supplier Matching*).
- Mengkalkulasi tingkat kesiapan usaha (*Supplier Readiness Score*).
- Membaca dan memverifikasi dokumen legalitas (*AI Document Reader*).
- Memetakan ketimpangan pasokan wilayah di Indonesia (*AI Supply Gap Map*).
- Memberikan konsultasi pengadaan & bisnis 24/7 (*PUSAKA AI Assistant*).

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Mempermudah perusahaan menemukan supplier UMKM lokal yang kredibel sekaligus membuka akses pasar B2B bagi UMKM Indonesia.
- 📊 **Target Pengguna**: UMKM lokal sebagai supplier dan perusahaan/industri sebagai korporasi buyer.
- 💡 **Value Proposition**: Mengubah proses pengadaan B2B yang lambat dan manual menjadi ekosistem digital yang cepat, transparan, terukur, dan didukung kecerdasan buatan.
- 🌏 **Dukungan SDG**: Berkontribusi nyata terhadap **SDG 8** (Pekerjaan Layak & Pertumbuhan Ekonomi) dan **SDG 9** (Industri, Inovasi, & Infrastruktur).

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|----------|--------------|---------------|
| **AI Supplier Matching** | Mencocokkan RFQ kebutuhan perusahaan dengan supplier UMKM berdasarkan spesifikasi produk, lokasi 34 provinsi, kapasitas, sertifikasi, MOQ, dan budget. | Mempercepat proses pencarian supplier dari hitungan minggu menjadi hitungan menit. |
| **Supplier Readiness Score** | Evaluasi otomatis kesiapan legalitas, kapasitas produksi, mesin pabrik, dan sertifikasi UMKM dengan skor 0–100. | Memberikan penilaian objektif bagi buyer dan panduan perbaikan bagi UMKM. |
| **RFQ & Quotation System** | Perusahaan membuat permintaan kebutuhan material/barang modal, kemudian UMKM mengirimkan penawaran terstruktur secara langsung. | Proses nego dan sourcing menjadi transparan, terdokumentasi, dan bebas salah paham. |
| **AI Supply Gap Map** | Peta interaktif (React Leaflet) yang memetakan wilayah dan kategori industri dengan ketimpangan pasokan (high opportunity / low supply). | Membantu UMKM menemukan peluang ekspansi pasar baru di daerah yang membutuhkan. |
| **PUSAKA AI Assistant** | Asisten pengadaan AI interaktif (didukung Google Gemini) yang dapat diakses di akun Company, UMKM, maupun floating shortcut button. | Memberikan konsultasi pengadaan, tips RFQ, dan navigasi fitur platform secara instan 24/7. |

### Fitur Tambahan

- **Smart Supplier Search**: Filter pencarian supplier dinamis berdasarkan 34 provinsi Indonesia, kategori industri, sertifikasi, dan skor kesiapan.
- **Digital UMKM Profile**: Etalase profil usaha digital lengkap dengan foto pabrik, fasilitas mesin, daftar produk, dan portofolio proyek.
- **AI Document Reader**: Analisis dan ekstraksi otomatis dokumen sertifikasi dan legalitas usaha menggunakan Google Gemini AI.
- **Supplier Trust Score**: Penilaian keandalan multidimensi (kualitas, pengiriman, kepekaan, sertifikasi) berdasarkan data transaksi nyata database.
- **Real Database Ratings & Reviews**: Sistem ulasan dan rating asli bintang 1–5 dari perusahaan setelah pesanan diselesaikan.
- **Business Chat (Encrypted)**: Ruang percakapan terenkripsi antara buyer dan supplier dilengkapi indikator pesan belum dibaca secara real-time.
- **Analytics Dashboard**: Panel analitik grafis interaktif (Recharts) untuk memantau pengeluaran RFQ, performa penawaran, dan statistik platform.
- **Smart Notification System**: Notifikasi terintegrasi dengan penanda *unread dot* otomatis untuk pembaruan pesanan dan penawaran.

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Website PUSAKA](https://pusaka-lyart.vercel.app)**

### Screenshot Aplikasi

<div align="center">
  <img src="public/hero-preview.png" alt="Homepage PUSAKA" width="800"/>
  <p><em>Homepage - Tampilan utama platform PUSAKA</em></p>
  
  <img src="public/dashboard-preview.png" alt="Dashboard Perusahaan & UMKM" width="800"/>
  <p><em>Dashboard - Panel kontrol pengelolaan RFQ & Penawaran</em></p>
  
  <img src="public/map-preview.png" alt="Peta Supply Gap AI" width="800"/>
  <p><em>Peta Supply Gap AI - Pemetaan peluang pasar & ketersediaan supplier lokal</em></p>
</div>

---

## 🛠️ Teknologi

### Tech Stack

#### Frontend
```text
Framework    : Next.js 16.3.0 (App Router, Turbopack)
Language     : TypeScript 5
UI Library   : Tailwind CSS v4, shadcn/ui, Base UI
Icons        : Lucide React
Charts & Map : Recharts, React Leaflet / Leaflet
Notifications: Sonner
```

#### Backend & Database
```text
Runtime      : Node.js (v20+)
API Engine   : Next.js Server Actions & API Routes
Database     : PostgreSQL (Neon Serverless PostgreSQL Adapter)
ORM          : Prisma ORM v7/v8
Authentication: Auth.js / NextAuth.js v5 (Credentials Provider & Bcrypt)
AI Engine    : Google Generative AI (Gemini 2.5 Flash API) + Dual-Engine Offline Knowledge Base
```

#### DevOps & Tools
```text
Hosting      : Vercel Deployment Platform
Environment  : Dotenv & Dotenv-CLI
Code Quality : ESLint 9, TypeScript Type Checking
```

### Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| **Next.js 16 (App Router)** | Performa Server-Side Rendering (SSR) tinggi, routing cepat, dan integrasi API bawaan yang seamless untuk platform B2B. |
| **Prisma & Neon PostgreSQL** | ORM type-safe dengan database serverless yang responsif, skalabel, serta mendukung transaksi B2B yang kompleks. |
| **Google Gemini AI** | Model kecerdasan buatan tercepat dan akurat untuk analisis dokumen legalitas, pencocokan supplier, dan rekomendasi B2B. |
| **Tailwind CSS v4 & shadcn/ui** | Desain antarmuka modern, responsif, aksesibel, dan memenuhi standar estetika SaaS profesional. |

---

## 🏗️ Arsitektur Sistem

### System Architecture

```mermaid
graph TD
    A[User / Browser] -->|HTTPS Requests| B[Next.js 16 App Router]
    B -->|Auth & Session| C[NextAuth.js v5]
    B -->|API Routes / Actions| D[Server Business Logic]
    D -->|AI Prompt & Analysis| E[Google Gemini AI Engine]
    D -->|Prisma Client| F[Prisma Neon Adapter]
    F -->|SQL Queries| G[(Neon PostgreSQL Database)]
```

### Database Schema Overview

```text
- User (id, name, email, role: COMPANY/UMKM/ADMIN, password)
- CompanyProfile (id, userId, companyName, industry, province, city, verified)
- UmkmProfile (id, userId, businessName, readinessScore, verificationStatus, latitude, longitude)
- Product (id, umkmId, categoryId, name, priceMin, priceMax, images)
- Certification (id, umkmId, name, issuer, status: PENDING/VERIFIED)
- RFQ (id, companyId, title, budgetMin, budgetMax, deadline, status: OPEN/COMPLETED)
- Quotation (id, rfqId, umkmId, price, leadTimeDays, status: PENDING/ACCEPTED)
- Order (id, quotationId, status: PENDING_PAYMENT/SHIPPED/DELIVERED/COMPLETED)
- Review (id, umkmId, companyId, rating, comment)
- TrustScore (id, umkmId, overall, deliveryScore, qualityScore)
- SupplyGapData (id, province, city, demandScore, supplierCount, opportunityScore)
```

### Folder Structure

```text
pusaka/
├── app/
│   ├── admin/            # Admin dashboard pages & management
│   ├── api/              # API endpoints (rfq, suppliers, orders, reviews, ai, assistant)
│   ├── company/          # Perusahaan buyer dashboard pages (rfq, orders, assistant)
│   ├── umkm/             # UMKM supplier dashboard pages (profile, products, readiness, assistant)
│   ├── globals.css       # Global styles & Tailwind CSS setup
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Landing page (Homepage)
├── components/
│   ├── admin/            # Admin UI components (Supply gap map, tables)
│   ├── ai/               # Floating AI shortcut button & interactive components
│   ├── landing/          # Landing page sections (Hero, Features, Suppliers, Reviews)
│   ├── notifications/    # Real-time notification components
│   ├── products/         # Product creation dialogs & cards
│   └── ui/               # shadcn/ui base components
├── lib/
│   ├── ai.ts             # Google Gemini AI & Dual-Engine Procurement Knowledge Base
│   ├── auth.ts           # NextAuth.js v5 configuration
│   └── db.ts             # Prisma Client & Neon Database Adapter initialization
├── prisma/
│   ├── schema.prisma     # Complete Prisma database schema
│   └── seed.ts           # Database seeder script
└── public/               # Static assets, PUSAKA logos & images
```

---

## ⚙️ Instalasi & Setup

### Prerequisites

Pastikan perangkat Anda telah terinstall:
- **Node.js**: v20.x atau lebih tinggi
- **npm** / **yarn** / **pnpm**
- **Git**

### Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/AbdanRasya/LOMBAHELMYKUKUHABDAN.git
cd LOMBAHELMYKUKUHABDAN
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Setup Environment Variables

Buat file `.env` di root folder proyek:

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Authentication (NextAuth / Auth.js v5)
AUTH_SECRET="your-super-secret-auth-key-32-chars-long"
AUTH_URL="http://localhost:3000"

# AI Integration (Google Gemini API)
GEMINI_API_KEY="your_google_gemini_api_key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="PUSAKA"
EMAIL_FROM="noreply@pusaka.id"
```

#### 4️⃣ Setup Database & Seed Data

```bash
# Push Prisma schema ke Database PostgreSQL
npx prisma db push

# Jalankan Seeding Data Awal (Kategori, Perusahaan, UMKM, RFQ, & Review)
npm run db:seed
```

#### 5️⃣ Run Development Server

```bash
npm run dev
```

Buka peramban (browser) Anda di `http://localhost:3000`.

---

## 🚀 Penggunaan

### Commands

```bash
# Mode Pengembang (Development)
npm run dev

# Kompilasi Production (Build)
npm run build

# Menjalankan Server Production
npm run start

# Type Checking TypeScript
npx tsc --noEmit

# Linting Codebase
npm run lint
```

### User Guide

#### Untuk Perusahaan (Buyer)
1. **Registrasi / Login**: Masuk sebagai akun *Company*.
2. **Cari Supplier**: Buka menu *Cari Supplier* dan filter berdasarkan lokasi 34 provinsi, kategori, atau rating.
3. **Buat RFQ**: Buat permintaan kebutuhan barang/material melalui form terstruktur atau bantuan AI Quick Input.
4. **Pilih Penawaran & Pesan**: Terima penawaran dari UMKM, lakukan pemesanan, dan selesaikan transaksi via escrow aman.
5. **Beri Rating & Ulasan**: Berikan ulasan dan bintang 1–5 setelah pesanan diterima.

#### Untuk UMKM (Supplier)
1. **Lengkapi Profil Digital**: Isi data usaha, unggah legalitas (NIB/NPWP), sertifikasi (TKDN/SNI/Halal), dan fasilitas mesin untuk meningkatkan *Skor Kesiapan*.
2. **Tambah Katalog Produk**: Daftarkan produk yang siap disuplai lengkap dengan foto, MOQ, dan kisaran harga B2B.
3. **Kirim Penawaran (Quotation)**: Telusuri *Pasar RFQ* dari perusahaan dan kirimkan harga penawaran terbaik serta lead time.
4. **Konsultasi AI**: Gunakan *Asisten AI* untuk strategi harga, tips menang RFQ, dan informasi sertifikasi.
5. **Pantau Pesanan**: Update status produksi dan pengiriman hingga selesai.

---

## 📚 API Documentation

### Base URL

```text
Development: http://localhost:3000/api
Production:  https://pusaka.vercel.app/api
```

### Key Endpoints

| Resource | Method | Endpoint | Deskripsi |
|----------|--------|----------|-----------|
| **Auth** | `POST` | `/api/auth/callback/credentials` | Login & Authentikasi Pengguna |
| **Suppliers** | `GET` | `/api/suppliers` | Mengambil daftar supplier terverifikasi & filter |
| **RFQ** | `GET`, `POST` | `/api/rfq` | Mengambil & membuat Request for Quotation baru |
| **Quotations** | `GET`, `POST` | `/api/quotations` | Mengirim penawaran UMKM untuk RFQ |
| **Orders** | `GET`, `PATCH` | `/api/orders/[id]` | Mengupdate status pesanan (Shipped/Delivered/Completed) |
| **Reviews** | `GET`, `POST` | `/api/reviews` | Mengambil & menyimpan ulasan real-time ke DB |
| **AI Assistant** | `POST` | `/api/assistant` | Tanya jawab AI seputar platform PUSAKA & analisis B2B |
| **AI Matching** | `POST` | `/api/ai/matching/dari-teks` | Pencocokan AI berbasis deskripsi teks natural |

---

## 🧪 Testing

### Verification & Linting

```bash
# TypeScript Compile Verification
npx tsc --noEmit

# Production Build Test
npm run build
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

<div align="center">

  **Made with ❤️ by Manut Team for ITECHNO CUP 2026**

</div>
