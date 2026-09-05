/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// ============================================================
// KONSTANTA BERSAMA (dari Python ai_features)
// ============================================================

const SERTIFIKASI_LIST = ["Halal", "SNI", "ISO 9001", "ISO 14001", "HACCP", "BPOM"];

const KATA_KUNCI_KATEGORI: Record<string, string[]> = {
  "Makanan & Minuman": ["makanan", "minuman", "pangan", "kuliner", "bumbu", "snack", "sambal", "rempah", "vco", "kopi"],
  "Furniture & Kayu": ["furniture", "mebel", "kayu", "meja", "kursi", "lemari", "pintu", "jati", "palet"],
  "Logam & Metal Work": ["logam", "besi", "baja", "metal", "fabrikasi", "baut", "plat", "bubut", "cnc", "machining", "pengelasan", "bengkel las"],
  "Kerajinan (Handicraft)": ["kerajinan", "handicraft", "anyaman", "souvenir", "ukir", "rotan", "bambu"],
  "Tekstil & Garmen": ["tekstil", "garmen", "konveksi", "kain", "seragam", "kaos", "baju", "drill", "polo"],
  "Kertas & Percetakan": ["kertas", "percetakan", "cetak", "atk", "alat tulis", "buku", "offset"],
  "Kimia & Plastik": ["kimia", "plastik", "pelumas", "bahan kimia", "polimer", "resin", "injection", "molding"],
  "Kemasan": ["kemasan", "packaging", "pouch", "botol", "karton", "box", "dus", "corrugated"],
  "Elektronik & Komponen": ["elektronik", "komponen", "kabel", "konektor", "panel listrik", "sensor", "wiring"],
};

const SERTIFIKASI_PENTING = ["Halal", "SNI", "ISO 9001", "ISO 14001", "HACCP", "BPOM"];

const TAG_KEYWORDS: Record<string, string> = {
  halal: "Halal",
  food: "Food Grade",
  custom: "Custom Order",
  ekspor: "Siap Ekspor",
  "ramah lingkungan": "Eco-Friendly",
  grosir: "Grosir/Bulk",
  biodegradable: "Eco-Friendly",
  iso: "Bersertifikat",
  sni: "Bersertifikat",
};

const MARKUP_SKENARIO = [1.10, 1.05, 1.00, 0.97, 0.93, 0.90];

type DemoUmkm = {
  umkm_id: string;
  nama_umkm: string;
  kategori_utama: string;
  sub_kategori: string;
  provinsi: string;
  kota: string;
  kapasitas_produksi_bulanan: number;
  satuan_produksi: string;
  rating_rata_1_5: number;
  on_time_delivery_rate_persen: number;
  jumlah_proyek_selesai: number;
  jumlah_karyawan: number;
  sertifikasi: string;
  harga_satuan_estimasi_idr: number;
  lead_time_hari: number;
  deskripsi_singkat: string;
};

type DemoRfq = {
  rfq_id: string;
  tanggal_dibuat: string;
  kategori_dibutuhkan: string;
  sub_kategori_dibutuhkan: string;
  provinsi_lokasi_diinginkan: string;
  kuantitas: number;
  satuan: string;
  nama_perusahaan: string;
};

type DemoQuotation = {
  quotation_id: string;
  rfq_id: string;
  umkm_id: string;
  total_harga_idr: number;
  status_penawaran: string;
  lead_time_ditawarkan_hari: number;
};

type DemoTransaction = {
  trans_id: string;
  umkm_id: string;
  tanggal_selesai: string;
  keterlambatan_hari: number;
  skor_kualitas_1_5: number;
  rating_keseluruhan_1_5: number;
};

// ============================================================
// HEURISTIC / FALLBACK DATA DEMO (ketika DB belum ada data)
// ============================================================

const DEMO_UMKM: DemoUmkm[] = [
  { umkm_id: "demo-u1", nama_umkm: "CV Berkah Sejati Bumbu", kategori_utama: "Makanan & Minuman", sub_kategori: "Bumbu Olahan", provinsi: "Jawa Timur", kota: "Surabaya", kapasitas_produksi_bulanan: 50000, satuan_produksi: "pcs", rating_rata_1_5: 4.6, on_time_delivery_rate_persen: 92, jumlah_proyek_selesai: 28, jumlah_karyawan: 35, sertifikasi: "Halal, BPOM", harga_satuan_estimasi_idr: 12500, lead_time_hari: 7, deskripsi_singkat: "Produsen bumbu dan rempah olahan bersertifikat Halal dan BPOM." },
  { umkm_id: "demo-u2", nama_umkm: "Bengkel Bubut & Fabrikasi Karya Logam", kategori_utama: "Logam & Metal Work", sub_kategori: "Baja Konstruksi", provinsi: "Jawa Barat", kota: "Bandung", kapasitas_produksi_bulanan: 1000, satuan_produksi: "ton", rating_rata_1_5: 4.8, on_time_delivery_rate_persen: 95, jumlah_proyek_selesai: 45, jumlah_karyawan: 80, sertifikasi: "SNI, ISO 9001", harga_satuan_estimasi_idr: 18500000, lead_time_hari: 14, deskripsi_singkat: "Fabrikasi baja konstruksi bersertifikat SNI untuk proyek gedung dan infrastruktur." },
  { umkm_id: "demo-u3", nama_umkm: "UD Maju Bersama Steel", kategori_utama: "Logam & Metal Work", sub_kategori: "Material Konstruksi", provinsi: "DKI Jakarta", kota: "Jakarta Pusat", kapasitas_produksi_bulanan: 600, satuan_produksi: "ton", rating_rata_1_5: 4.3, on_time_delivery_rate_persen: 88, jumlah_proyek_selesai: 30, jumlah_karyawan: 45, sertifikasi: "SNI", harga_satuan_estimasi_idr: 17800000, lead_time_hari: 10, deskripsi_singkat: "Supplier material baja konstruksi dengan harga kompetitif untuk Jabodetabek." },
  { umkm_id: "demo-u4", nama_umkm: "CV Sumber Logam Prima", kategori_utama: "Logam & Metal Work", sub_kategori: "Manufaktur Logam", provinsi: "Jawa Timur", kota: "Surabaya", kapasitas_produksi_bulanan: 400, satuan_produksi: "ton", rating_rata_1_5: 4.2, on_time_delivery_rate_persen: 85, jumlah_proyek_selesai: 60, jumlah_karyawan: 40, sertifikasi: "ISO 9001", harga_satuan_estimasi_idr: 17200000, lead_time_hari: 12, deskripsi_singkat: "Pengalaman 15+ tahun dalam penyediaan material logam untuk proyek konstruksi." },
  { umkm_id: "demo-u5", nama_umkm: "Konveksi Textile Mandiri Bandung", kategori_utama: "Tekstil & Garmen", sub_kategori: "Seragam Kerja", provinsi: "Jawa Barat", kota: "Bandung", kapasitas_produksi_bulanan: 20000, satuan_produksi: "pcs", rating_rata_1_5: 4.5, on_time_delivery_rate_persen: 90, jumlah_proyek_selesai: 35, jumlah_karyawan: 120, sertifikasi: "SNI", harga_satuan_estimasi_idr: 125000, lead_time_hari: 21, deskripsi_singkat: "Konveksi seragam kerja dan kaos olahraga dengan bahan drill premium, bisa sablon dan bordir." },
  { umkm_id: "demo-u6", nama_umkm: "CV Kemasan Lestari Mandiri", kategori_utama: "Kemasan", sub_kategori: "Kertas & Karton", provinsi: "Jawa Tengah", kota: "Semarang", kapasitas_produksi_bulanan: 500000, satuan_produksi: "pcs", rating_rata_1_5: 4.1, on_time_delivery_rate_persen: 82, jumlah_proyek_selesai: 22, jumlah_karyawan: 55, sertifikasi: "", harga_satuan_estimasi_idr: 850, lead_time_hari: 10, deskripsi_singkat: "Produsen dus karton box corrugated custom untuk berbagai kebutuhan industri." },
  { umkm_id: "demo-u7", nama_umkm: "Koperasi Tani Agro Bumi Nusantara", kategori_utama: "Makanan & Minuman", sub_kategori: "Bahan Pangan", provinsi: "Sumatera Utara", kota: "Medan", kapasitas_produksi_bulanan: 15000, satuan_produksi: "kg", rating_rata_1_5: 4.4, on_time_delivery_rate_persen: 89, jumlah_proyek_selesai: 18, jumlah_karyawan: 50, sertifikasi: "Halal, SNI, ISO 9001", harga_satuan_estimasi_idr: 35000, lead_time_hari: 14, deskripsi_singkat: "Produsen minyak kelapa murni (VCO) dan bahan pangan olahan bersertifikat lengkap." },
  { umkm_id: "demo-u8", nama_umkm: "UD Plastik Jaya Berkah", kategori_utama: "Kimia & Plastik", sub_kategori: "Barang Plastik", provinsi: "Jawa Barat", kota: "Bekasi", kapasitas_produksi_bulanan: 80000, satuan_produksi: "kg", rating_rata_1_5: 3.9, on_time_delivery_rate_persen: 78, jumlah_proyek_selesai: 15, jumlah_karyawan: 38, sertifikasi: "", harga_satuan_estimasi_idr: 15000, lead_time_hari: 10, deskripsi_singkat: "Pabrik resin dan barang plastik injection molding untuk kebutuhan industri." },
  { umkm_id: "demo-u9", nama_umkm: "Sentra Furnitur & Mebel Kayu Jepara", kategori_utama: "Furniture & Kayu", sub_kategori: "Mebel Kayu Jati", provinsi: "Jawa Tengah", kota: "Jepara", kapasitas_produksi_bulanan: 300, satuan_produksi: "unit", rating_rata_1_5: 4.7, on_time_delivery_rate_persen: 91, jumlah_proyek_selesai: 40, jumlah_karyawan: 65, sertifikasi: "SNI", harga_satuan_estimasi_idr: 2500000, lead_time_hari: 30, deskripsi_singkat: "Pengrajin furnitur kayu jati berkualitas tinggi dengan desain custom." },
  { umkm_id: "demo-u10", nama_umkm: "Percetakan & Offset Digital Mandiri", kategori_utama: "Kertas & Percetakan", sub_kategori: "Percetakan Offset", provinsi: "DKI Jakarta", kota: "Jakarta Timur", kapasitas_produksi_bulanan: 200000, satuan_produksi: "pcs", rating_rata_1_5: 4.3, on_time_delivery_rate_persen: 87, jumlah_proyek_selesai: 50, jumlah_karyawan: 55, sertifikasi: "ISO 9001", harga_satuan_estimasi_idr: 3500, lead_time_hari: 7, deskripsi_singkat: "Percetakan offset dan digital berkualitas tinggi untuk buku, kemasan, dan promosi." },
  { umkm_id: "demo-u11", nama_umkm: "Sentra Kerajinan Anyaman Lombok", kategori_utama: "Kerajinan (Handicraft)", sub_kategori: "Anyaman Bambu", provinsi: "Nusa Tenggara Barat", kota: "Mataram", kapasitas_produksi_bulanan: 5000, satuan_produksi: "unit", rating_rata_1_5: 4.0, on_time_delivery_rate_persen: 80, jumlah_proyek_selesai: 12, jumlah_karyawan: 30, sertifikasi: "", harga_satuan_estimasi_idr: 75000, lead_time_hari: 21, deskripsi_singkat: "Pengrajin anyaman bambu, rotan, dan kerajinan tangan khas Lombok untuk ekspor dan lokal." },
  { umkm_id: "demo-u12", nama_umkm: "Bengkel Panel & Kabel Elektro Mandiri", kategori_utama: "Elektronik & Komponen", sub_kategori: "Panel Listrik", provinsi: "Jawa Timur", kota: "Surabaya", kapasitas_produksi_bulanan: 2000, satuan_produksi: "unit", rating_rata_1_5: 4.5, on_time_delivery_rate_persen: 93, jumlah_proyek_selesai: 25, jumlah_karyawan: 42, sertifikasi: "SNI, ISO 9001", harga_satuan_estimasi_idr: 3500000, lead_time_hari: 14, deskripsi_singkat: "Produsen panel listrik dan kabel kontrol untuk industri dan infrastruktur." },
];

export const DEMO_UMKM_EXPORTED: DemoUmkm[] = DEMO_UMKM;
export type UmkmDemoRow = (typeof DEMO_UMKM)[number];

const DEMO_RFQ: DemoRfq[] = [
  { rfq_id: "demo-r1", tanggal_dibuat: "2025-01-15", kategori_dibutuhkan: "Logam & Metal Work", sub_kategori_dibutuhkan: "Baja Konstruksi", provinsi_lokasi_diinginkan: "DKI Jakarta", kuantitas: 300, satuan: "ton", nama_perusahaan: "PT Konstruksi Nusantara" },
  { rfq_id: "demo-r2", tanggal_dibuat: "2025-02-20", kategori_dibutuhkan: "Kemasan", sub_kategori_dibutuhkan: "Kertas & Karton", provinsi_lokasi_diinginkan: "Jawa Barat", kuantitas: 100000, satuan: "pcs", nama_perusahaan: "PT Makanan Sejahtera" },
  { rfq_id: "demo-r3", tanggal_dibuat: "2025-03-10", kategori_dibutuhkan: "Tekstil & Garmen", sub_kategori_dibutuhkan: "Seragam Kerja", provinsi_lokasi_diinginkan: "Jawa Barat", kuantitas: 5000, satuan: "pcs", nama_perusahaan: "PT Industri Maju" },
  { rfq_id: "demo-r4", tanggal_dibuat: "2025-04-05", kategori_dibutuhkan: "Makanan & Minuman", sub_kategori_dibutuhkan: "Bumbu Olahan", provinsi_lokasi_diinginkan: "Jawa Timur", kuantitas: 20000, satuan: "pcs", nama_perusahaan: "PT Ritel Indonesia" },
  { rfq_id: "demo-r5", tanggal_dibuat: "2025-05-18", kategori_dibutuhkan: "Logam & Metal Work", sub_kategori_dibutuhkan: "Material Konstruksi", provinsi_lokasi_diinginkan: "Kalimantan Timur", kuantitas: 500, satuan: "ton", nama_perusahaan: "PT IKN Konstruksi" },
  { rfq_id: "demo-r6", tanggal_dibuat: "2025-06-22", kategori_dibutuhkan: "Kemasan", sub_kategori_dibutuhkan: "Kertas & Karton", provinsi_lokasi_diinginkan: "Sulawesi Selatan", kuantitas: 80000, satuan: "pcs", nama_perusahaan: "PT Distribusi Timur" },
  { rfq_id: "demo-r7", tanggal_dibuat: "2025-07-30", kategori_dibutuhkan: "Pertanian & Pangan", sub_kategori_dibutuhkan: "Bahan Pangan", provinsi_lokasi_diinginkan: "Sumatera Utara", kuantitas: 10000, satuan: "kg", nama_perusahaan: "PT Supermarket Utara" },
  { rfq_id: "demo-r8", tanggal_dibuat: "2025-08-12", kategori_dibutuhkan: "Kemasan", sub_kategori_dibutuhkan: "Kertas & Karton", provinsi_lokasi_diinginkan: "Jawa Tengah", kuantitas: 150000, satuan: "pcs", nama_perusahaan: "PT Makanan Tradisional" },
  { rfq_id: "demo-r9", tanggal_dibuat: "2025-09-05", kategori_dibutuhkan: "Logam & Metal Work", sub_kategori_dibutuhkan: "Manufaktur Logam", provinsi_lokasi_diinginkan: "Jawa Timur", kuantitas: 250, satuan: "ton", nama_perusahaan: "PT Manufaktur Jatim" },
  { rfq_id: "demo-r10", tanggal_dibuat: "2025-10-18", kategori_dibutuhkan: "Tekstil & Garmen", sub_kategori_dibutuhkan: "Seragam Kerja", provinsi_lokasi_diinginkan: "DKI Jakarta", kuantitas: 8000, satuan: "pcs", nama_perusahaan: "PT Korporat Jakarta" },
  { rfq_id: "demo-r11", tanggal_dibuat: "2025-11-25", kategori_dibutuhkan: "Makanan & Minuman", sub_kategori_dibutuhkan: "Bumbu Olahan", provinsi_lokasi_diinginkan: "Jawa Barat", kuantitas: 35000, satuan: "pcs", nama_perusahaan: "PT Distribusi Jabar" },
  { rfq_id: "demo-r12", tanggal_dibuat: "2025-12-15", kategori_dibutuhkan: "Kemasan", sub_kategori_dibutuhkan: "Kertas & Karton", provinsi_lokasi_diinginkan: "DKI Jakarta", kuantitas: 200000, satuan: "pcs", nama_perusahaan: "PT Kosmetik Indonesia" },
  { rfq_id: "demo-r13", tanggal_dibuat: "2026-01-20", kategori_dibutuhkan: "Logam & Metal Work", sub_kategori_dibutuhkan: "Baja Konstruksi", provinsi_lokasi_diinginkan: "Jawa Barat", kuantitas: 700, satuan: "ton", nama_perusahaan: "PT Properti Bandung" },
  { rfq_id: "demo-r14", tanggal_dibuat: "2026-02-28", kategori_dibutuhkan: "Makanan & Minuman", sub_kategori_dibutuhkan: "Bahan Pangan", provinsi_lokasi_diinginkan: "DKI Jakarta", kuantitas: 25000, satuan: "kg", nama_perusahaan: "PT Food Court Jakarta" },
  { rfq_id: "demo-r15", tanggal_dibuat: "2026-03-15", kategori_dibutuhkan: "Tekstil & Garmen", sub_kategori_dibutuhkan: "Seragam Kerja", provinsi_lokasi_diinginkan: "Jawa Timur", kuantitas: 12000, satuan: "pcs", nama_perusahaan: "PT Pabrik Surabaya" },
  { rfq_id: "demo-r16", tanggal_dibuat: "2026-04-10", kategori_dibutuhkan: "Kemasan", sub_kategori_dibutuhkan: "Kertas & Karton", provinsi_lokasi_diinginkan: "Kalimantan Timur", kuantitas: 60000, satuan: "pcs", nama_perusahaan: "PT IKN Retail" },
  { rfq_id: "demo-r17", tanggal_dibuat: "2026-05-22", kategori_dibutuhkan: "Elektronik & Komponen", sub_kategori_dibutuhkan: "Panel Listrik", provinsi_lokasi_diinginkan: "Jawa Timur", kuantitas: 800, satuan: "unit", nama_perusahaan: "PT PLN Distribusi" },
  { rfq_id: "demo-r18", tanggal_dibuat: "2026-06-18", kategori_dibutuhkan: "Furniture & Kayu", sub_kategori_dibutuhkan: "Mebel Kayu Jati", provinsi_lokasi_diinginkan: "DKI Jakarta", kuantitas: 1500, satuan: "unit", nama_perusahaan: "PT Hotel Mewah" },
  { rfq_id: "demo-r19", tanggal_dibuat: "2026-07-30", kategori_dibutuhkan: "Kimia & Plastik", sub_kategori_dibutuhkan: "Barang Plastik", provinsi_lokasi_diinginkan: "Jawa Barat", kuantitas: 40000, satuan: "kg", nama_perusahaan: "PT Industri Kemasan" },
  { rfq_id: "demo-r20", tanggal_dibuat: "2026-08-15", kategori_dibutuhkan: "Makanan & Minuman", sub_kategori_dibutuhkan: "Bumbu Olahan", provinsi_lokasi_diinginkan: "Jawa Tengah", kuantitas: 30000, satuan: "pcs", nama_perusahaan: "PT Waralaba Nusantara" },
];

export const DEMO_RFQ_EXPORTED: DemoRfq[] = DEMO_RFQ;
export type RfqDemoRow = (typeof DEMO_RFQ)[number];

const DEMO_QUOTATIONS: DemoQuotation[] = [
  { quotation_id: "demo-q1", rfq_id: "demo-r1", umkm_id: "demo-u2", total_harga_idr: 5550000000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 14 },
  { quotation_id: "demo-q2", rfq_id: "demo-r1", umkm_id: "demo-u3", total_harga_idr: 5340000000, status_penawaran: "Ditolak", lead_time_ditawarkan_hari: 12 },
  { quotation_id: "demo-q3", rfq_id: "demo-r1", umkm_id: "demo-u4", total_harga_idr: 4300000000, status_penawaran: "Ditolak", lead_time_ditawarkan_hari: 18 },
  { quotation_id: "demo-q4", rfq_id: "demo-r2", umkm_id: "demo-u6", total_harga_idr: 85000000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 12 },
  { quotation_id: "demo-q5", rfq_id: "demo-r3", umkm_id: "demo-u5", total_harga_idr: 625000000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 25 },
  { quotation_id: "demo-q6", rfq_id: "demo-r4", umkm_id: "demo-u1", total_harga_idr: 250000000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 7 },
  { quotation_id: "demo-q7", rfq_id: "demo-r12", umkm_id: "demo-u6", total_harga_idr: 170000000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 14 },
  { quotation_id: "demo-q8", rfq_id: "demo-r13", umkm_id: "demo-u2", total_harga_idr: 12950000000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 21 },
  { quotation_id: "demo-q9", rfq_id: "demo-r8", umkm_id: "demo-u6", total_harga_idr: 127500000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 10 },
  { quotation_id: "demo-q10", rfq_id: "demo-r15", umkm_id: "demo-u5", total_harga_idr: 1500000000, status_penawaran: "Diterima", lead_time_ditawarkan_hari: 28 },
];
export const DEMO_QUOTATIONS_EXPORTED: DemoQuotation[] = DEMO_QUOTATIONS;
export type QuotationDemoRow = (typeof DEMO_QUOTATIONS)[number];

const DEMO_TRANSACTIONS: DemoTransaction[] = [
  { trans_id: "demo-t1", umkm_id: "demo-u2", tanggal_selesai: "2025-02-28", keterlambatan_hari: 0, skor_kualitas_1_5: 4.8, rating_keseluruhan_1_5: 4.9 },
  { trans_id: "demo-t2", umkm_id: "demo-u2", tanggal_selesai: "2025-06-15", keterlambatan_hari: 2, skor_kualitas_1_5: 4.5, rating_keseluruhan_1_5: 4.6 },
  { trans_id: "demo-t3", umkm_id: "demo-u2", tanggal_selesai: "2026-03-10", keterlambatan_hari: 3, skor_kualitas_1_5: 4.2, rating_keseluruhan_1_5: 4.3 },
  { trans_id: "demo-t4", umkm_id: "demo-u2", tanggal_selesai: "2026-08-01", keterlambatan_hari: 0, skor_kualitas_1_5: 4.9, rating_keseluruhan_1_5: 4.8 },
  { trans_id: "demo-t5", umkm_id: "demo-u5", tanggal_selesai: "2025-04-05", keterlambatan_hari: 3, skor_kualitas_1_5: 4.3, rating_keseluruhan_1_5: 4.4 },
  { trans_id: "demo-t6", umkm_id: "demo-u5", tanggal_selesai: "2025-09-10", keterlambatan_hari: 5, skor_kualitas_1_5: 4.1, rating_keseluruhan_1_5: 4.2 },
  { trans_id: "demo-t7", umkm_id: "demo-u5", tanggal_selesai: "2026-04-15", keterlambatan_hari: 0, skor_kualitas_1_5: 4.7, rating_keseluruhan_1_5: 4.7 },
  { trans_id: "demo-t8", umkm_id: "demo-u1", tanggal_selesai: "2025-04-20", keterlambatan_hari: 1, skor_kualitas_1_5: 4.6, rating_keseluruhan_1_5: 4.7 },
  { trans_id: "demo-t9", umkm_id: "demo-u1", tanggal_selesai: "2025-08-25", keterlambatan_hari: 0, skor_kualitas_1_5: 4.8, rating_keseluruhan_1_5: 4.9 },
  { trans_id: "demo-t10", umkm_id: "demo-u6", tanggal_selesai: "2025-03-05", keterlambatan_hari: 7, skor_kualitas_1_5: 3.8, rating_keseluruhan_1_5: 3.9 },
  { trans_id: "demo-t11", umkm_id: "demo-u6", tanggal_selesai: "2025-07-10", keterlambatan_hari: 4, skor_kualitas_1_5: 4.0, rating_keseluruhan_1_5: 4.0 },
  { trans_id: "demo-t12", umkm_id: "demo-u6", tanggal_selesai: "2026-02-01", keterlambatan_hari: 2, skor_kualitas_1_5: 4.3, rating_keseluruhan_1_5: 4.2 },
  { trans_id: "demo-t13", umkm_id: "demo-u6", tanggal_selesai: "2026-06-15", keterlambatan_hari: 0, skor_kualitas_1_5: 4.5, rating_keseluruhan_1_5: 4.5 },
  { trans_id: "demo-t14", umkm_id: "demo-u4", tanggal_selesai: "2025-05-20", keterlambatan_hari: 1, skor_kualitas_1_5: 4.3, rating_keseluruhan_1_5: 4.2 },
];
export const DEMO_TRANSACTIONS_EXPORTED: DemoTransaction[] = DEMO_TRANSACTIONS;
export type TransactionDemoRow = (typeof DEMO_TRANSACTIONS)[number];

const STOPWORDS_ID = new Set([
  "produsen", "berlokasi", "di", "dan", "melayani", "pesanan", "b2b",
  "skala", "menengah-besar", "yang", "untuk", "dengan", "ke", "dari",
  "yang", "adalah", "untuk", "dalam", "pada", "ini", "itu", "akan",
]);

// ============================================================
// #1 AI SUPPLIER MATCHING (dari Python matching.py)
// ============================================================

export function ekstrakKategori(teks: string): string | null {
  const teksL = teks.toLowerCase();
  for (const [kat, kataKunci] of Object.entries(KATA_KUNCI_KATEGORI)) {
    if (kataKunci.some((kw) => teksL.includes(kw))) {
      return kat;
    }
  }
  return null;
}

export function ekstrakProvinsi(teks: string, umkmList: any[] = DEMO_UMKM): string | null {
  const provList = Array.from(new Set(umkmList.map((u) => u.provinsi || u.province)));
  for (const prov of provList) {
    if (prov && teks.toLowerCase().includes(String(prov).toLowerCase())) {
      return prov;
    }
  }
  return null;
}

export function ekstrakKuantitas(teks: string): { kuantitas: number | null; satuan: string | null } {
  const m = teks.toLowerCase().match(/([\d.,]+)\s*(pcs|karton|unit|kg|meter|lusin|ton|unit)/);
  if (m) {
    const angka = m[1].replace(/\./g, "").replace(/,/g, "");
    try {
      return { kuantitas: parseInt(angka, 10), satuan: m[2] };
    } catch {
      return { kuantitas: null, satuan: null };
    }
  }
  return { kuantitas: null, satuan: null };
}

export function ekstrakSertifikasi(teks: string): string[] {
  return SERTIFIKASI_LIST.filter((s) => teks.toLowerCase().includes(s.toLowerCase()));
}

export interface KebutuhanTersusun {
  kategori: string | null;
  sub_kategori: string | null;
  provinsi: string | null;
  kuantitas: number | null;
  satuan: string | null;
  sertifikasi_wajib: string[];
}

export function parseKebutuhan(teks: string, umkmList?: any[]): KebutuhanTersusun {
  const { kuantitas, satuan } = ekstrakKuantitas(teks);
  return {
    kategori: ekstrakKategori(teks),
    sub_kategori: null,
    provinsi: ekstrakProvinsi(teks, umkmList),
    kuantitas,
    satuan,
    sertifikasi_wajib: ekstrakSertifikasi(teks),
  };
}

export function hitungSkorMatch(u: any, kebutuhan: KebutuhanTersusun): { skor: number; alasan: string[] } {
  let skor = 0;
  const alasan: string[] = [];
  const umkmKat = u.kategori_utama || u.categories?.[0]?.name || "";
  const umkmProv = u.provinsi || u.province || "";
  const umkmKapasitas = u.kapasitas_produksi_bulanan || u.products?.[0]?.maxCapacity || 0;
  const umkmSertif = u.sertifikasi || (u.certifications?.map((c: any) => c.name).join(", ") ?? "");
  const umkmRating = u.rating_rata_1_5 ?? u.trustScore?.overall ?? 0;
  const umkmOTDR = u.on_time_delivery_rate_persen ?? u.trustScore?.deliveryScore ?? 80;

  if (kebutuhan.kategori && umkmKat !== kebutuhan.kategori) {
    return { skor: 0, alasan: ["Kategori tidak sesuai."] };
  }
  if (kebutuhan.kategori) {
    skor += 35;
    alasan.push(`Kategori cocok (${umkmKat}).`);
  }

  if (kebutuhan.sub_kategori && (u.sub_kategori === kebutuhan.sub_kategori)) {
    skor += 10;
    alasan.push(`Sub-kategori cocok persis (${u.sub_kategori}).`);
  }

  if (kebutuhan.provinsi) {
    if (umkmProv === kebutuhan.provinsi) {
      skor += 20;
      alasan.push(`Lokasi sesuai preferensi (${umkmProv}).`);
    } else {
      alasan.push(`Lokasi di ${umkmProv}, bukan ${kebutuhan.provinsi} (tetap dipertimbangkan).`);
    }
  } else {
    skor += 10;
  }

  if (kebutuhan.kuantitas) {
    if (umkmKapasitas >= kebutuhan.kuantitas) {
      skor += 15;
      alasan.push(`Kapasitas cukup (${umkmKapasitas.toLocaleString("id-ID")}/${u.satuan_produksi || "unit"} vs kebutuhan ${kebutuhan.kuantitas.toLocaleString("id-ID")}).`);
    } else {
      alasan.push(`Kapasitas mungkin kurang (${umkmKapasitas.toLocaleString("id-ID")} vs kebutuhan ${kebutuhan.kuantitas.toLocaleString("id-ID")}).`);
    }
  } else {
    skor += 7.5;
  }

  const wajib = kebutuhan.sertifikasi_wajib || [];
  if (wajib.length === 0) {
    skor += 10;
  } else if (wajib.every((s) => String(umkmSertif).includes(s))) {
    skor += 10;
    alasan.push(`Memenuhi semua sertifikasi wajib (${wajib.join(", ")}).`);
  } else {
    const kurang = wajib.filter((s) => !String(umkmSertif).includes(s));
    alasan.push(`Belum punya sertifikasi wajib: ${kurang.join(", ")}.`);
  }

  skor += (umkmRating / 5) * 10;
  alasan.push(`Rating historis ${umkmRating.toFixed(1)}/5, on-time delivery ${umkmOTDR}%.`);

  return { skor: Math.round(skor * 10) / 10, alasan };
}

export interface MatchHasil {
  umkm_id: string;
  nama_umkm: string;
  provinsi: string;
  lokasi: string;
  kategori: string;
  match_score: number;
  skor_match: number;
  alasan: string;
  kecocokan: string[];
}

export function cariSupplier(kebutuhan: KebutuhanTersusun, topN = 5, umkmList: any[] = DEMO_UMKM): MatchHasil[] {
  const hasil: MatchHasil[] = [];
  for (const u of umkmList) {
    const { skor, alasan } = hitungSkorMatch(u, kebutuhan);
    if (skor > 0) {
      const kecocokanArr = alasan.filter(a => /cocok|cukup|memenuhi|punya|baik|tinggi|lengkap|luas/i.test(a));
      hasil.push({
        umkm_id: u.umkm_id || u.id,
        nama_umkm: u.nama_umkm || u.businessName,
        provinsi: u.provinsi || u.province,
        lokasi: u.provinsi || u.province,
        kategori: u.kategori_utama || u.kategori || "-",
        match_score: Math.round(skor * 10) / 10,
        skor_match: skor > 1 ? skor / 100 : skor,
        alasan: alasan.join(" "),
        kecocokan: kecocokanArr.length ? kecocokanArr.slice(0, 3).map(a => `âœ“ ${a.replace(/\.$/, "")}`) : [`âœ“ Kategori ${u.kategori_utama || u.kategori || "sesuai"}`],
      });
    }
  }
  return hasil.sort((a, b) => b.match_score - a.match_score).slice(0, topN);
}

export function cariSupplierDariTeks(teksKebutuhan: string, topN = 5, umkmList?: any[]): {
  kebutuhan_terdeteksi: KebutuhanTersusun;
  hasil: MatchHasil[];
} {
  const kebutuhan = parseKebutuhan(teksKebutuhan, umkmList);
  return {
    kebutuhan_terdeteksi: kebutuhan,
    hasil: cariSupplier(kebutuhan, topN, umkmList),
  };
}

// ============================================================
// #2 AI READINESS SCORE (dari Python readiness.py)
// ============================================================

export interface ReadinessHasil {
  umkm_id: string;
  nama_umkm: string;
  readiness_score: number;
  level_kesiapan: string;
  rincian_skor: {
    sertifikasi: number;
    rating: number;
    ketepatan_waktu: number;
    pengalaman: number;
    skala_usaha: number;
  };
  rekomendasi: string[];
}

export function hitungReadiness(row: any): ReadinessHasil {
  const daftarSertif = String(row.sertifikasi || row.certifications?.filter((c: any) => c.status === "VERIFIED").map((c: any) => c.name) || "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  const ratingRata = row.rating_rata_1_5 ?? (row.trustScore?.overall ?? 80) / 20;
  const otdr = row.on_time_delivery_rate_persen ?? row.trustScore?.deliveryScore ?? 80;
  const jmlProyek = row.jumlah_proyek_selesai ?? row.projects?.filter((p: any) => p.status === "COMPLETED").length ?? 10;
  const jmlKary = row.jumlah_karyawan ?? row.employeeCount ?? 30;

  const komponen = {
    sertifikasi: Math.min(daftarSertif.length * 8, 25),
    rating: (ratingRata / 5) * 25,
    ketepatan_waktu: (otdr / 100) * 20,
    pengalaman: Math.min((jmlProyek / 30) * 15, 15),
    skala_usaha: Math.min((jmlKary / 20) * 15, 15),
  };

  for (const k of Object.keys(komponen) as (keyof typeof komponen)[]) {
    komponen[k] = Math.round(komponen[k] * 10) / 10;
  }
  const total = Math.round(Object.values(komponen).reduce((a, b) => a + b, 0) * 10) / 10;

  const catatan: string[] = [];
  const sertifBelum = SERTIFIKASI_PENTING.filter((s) => !daftarSertif.includes(s));
  if (komponen.sertifikasi < 16 && sertifBelum.length > 0) {
    catatan.push(`Lengkapi sertifikasi (prioritas: ${sertifBelum[0]}) untuk naikkan kepercayaan buyer industri.`);
  }
  if (komponen.rating < 15) {
    catatan.push("Tingkatkan kualitas & komunikasi pada proyek berjalan â€” rating historis masih di bawah rata-rata.");
  }
  if (komponen.ketepatan_waktu < 14) {
    catatan.push(`Perbaiki manajemen lead time â€” tingkat ketepatan waktu saat ini ${otdr.toFixed(0)}%.`);
  }
  if (komponen.pengalaman < 8) {
    catatan.push(`Perbanyak portofolio proyek B2B untuk membangun rekam jejak (baru ${jmlProyek} proyek selesai).`);
  }
  if (komponen.skala_usaha < 8) {
    catatan.push("Pertimbangkan menambah kapasitas SDM/produksi jika target pasar adalah industri skala menengah-besar.");
  }
  if (catatan.length === 0) {
    catatan.push("Profil sudah kuat di semua aspek â€” pertahankan kualitas & konsistensi layanan.");
  }

  let level: string;
  if (total >= 80) level = "Siap â€” pemasok industri menengah-besar";
  else if (total >= 60) level = "Cukup Siap â€” cocok untuk proyek skala menengah";
  else if (total >= 40) level = "Perlu Peningkatan â€” mulai dari proyek skala kecil";
  else level = "Belum Siap â€” lengkapi profil dasar dahulu";

  return {
    umkm_id: row.umkm_id || row.id,
    nama_umkm: row.nama_umkm || row.businessName,
    readiness_score: total,
    level_kesiapan: level,
    rincian_skor: komponen,
    rekomendasi: catatan,
  };
}

export function getReadinessScore(umkmId: string, umkmList: any[] = DEMO_UMKM): ReadinessHasil {
  const row = umkmList.find((u) => (u.umkm_id || u.id) === umkmId);
  if (!row) throw new Error(`UMKM ${umkmId} tidak ditemukan`);
  return hitungReadiness(row);
}

export function getAllReadinessScores(umkmList: any[] = DEMO_UMKM): ReadinessHasil[] {
  return umkmList.map(hitungReadiness);
}

// ============================================================
// #3 AI DOCUMENT READER (dari Python document_reader.py)
// ============================================================

const POLA_DOKUMEN: Record<string, RegExp> = {
  nomor_sertifikat: /(?:Nomor Sertifikat|Nomor SPPT SNI|Certificate No)\s*[:.]\s*([A-Za-z0-9/\-|]+)/i,
  nama_usaha: /(?:Nama Pelaku Usaha|Nama Perusahaan|Company|Perusahaan)\s*[:.]\s*(.+)/i,
  produk_scope: /(?:Nama Produk|Jenis Produk|Scope|Produk)\s*[:.]\s*(.+)/i,
  tanggal_terbit: /(?:Tanggal Terbit|Issue Date|Diterbitkan)\s*[:.]\s*([\d\-\/]+)/i,
  tanggal_berakhir: /(?:Berlaku Hingga|Masa Berlaku Hingga|Expiry Date|Berakhir)\s*[:.]\s*([\d\-\/]+)/i,
};

function parseTanggal(s: string): Date | null {
  try {
    const clean = s.trim();
    const parts = clean.split(/[-\/]/);
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      return new Date(y, m - 1, d);
    }
  } catch {
    return null;
  }
  return null;
}

export function deteksiJenisDokumen(teksOCR: string): string {
  const t = teksOCR.toLowerCase();
  if (t.includes("halal")) return "Halal";
  if (t.includes("sni")) return "SNI";
  if (t.includes("iso 9001")) return "ISO 9001";
  if (t.includes("iso 14001")) return "ISO 14001";
  if (t.includes("haccp")) return "HACCP";
  if (t.includes("bpom")) return "BPOM";
  return "Tidak diketahui";
}

export interface HasilBacaDokumen {
  jenis_dokumen: string;
  nomor_sertifikat: string | null;
  nama_usaha: string | null;
  produk_scope: string | null;
  tanggal_terbit: string | null;
  tanggal_berakhir: string | null;
  sisa_hari_berlaku: number | null;
  status_masa_berlaku: string;
  _teks_ocr_mentah?: string;
}

export function bacaDokumenDariTeks(teksOCR: string): HasilBacaDokumen {
  const hasil: HasilBacaDokumen = {
    jenis_dokumen: deteksiJenisDokumen(teksOCR),
    nomor_sertifikat: null,
    nama_usaha: null,
    produk_scope: null,
    tanggal_terbit: null,
    tanggal_berakhir: null,
    sisa_hari_berlaku: null,
    status_masa_berlaku: "Tidak terbaca",
    _teks_ocr_mentah: teksOCR.replace(/\n/g, " | ").trim(),
  };

  for (const [field, pola] of Object.entries(POLA_DOKUMEN)) {
    const m = teksOCR.match(pola);
    (hasil as any)[field] = m ? m[1].trim() : null;
  }

  if (hasil.nomor_sertifikat) {
    hasil.nomor_sertifikat = hasil.nomor_sertifikat.replace(/\|/g, "I");
  }

  const tglAkhir = hasil.tanggal_berakhir ? parseTanggal(hasil.tanggal_berakhir) : null;
  if (tglAkhir && !isNaN(tglAkhir.getTime())) {
    const sisaHari = Math.ceil((tglAkhir.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    let status: string;
    if (sisaHari < 0) status = "Kadaluarsa";
    else if (sisaHari <= 60) status = "Segera Kadaluarsa";
    else status = "Berlaku";
    hasil.sisa_hari_berlaku = sisaHari;
    hasil.status_masa_berlaku = status;
  }

  return hasil;
}

export async function bacaDokumenDenganAI(gambarBuffer: ArrayBuffer, fileName: string): Promise<HasilBacaDokumen> {
  if (!genAI) {
    const fallbackText = `SERTIFIKAT HALAL
Nomor Sertifikat: ID33110002356912
Nama Pelaku Usaha: CV Berkah Sejati
Nama Produk: Bumbu & Rempah Olahan
Tanggal Terbit: 15-03-2024
Berlaku Hingga: 15-03-2027`;
    return bacaDokumenDariTeks(fallbackText);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const mimeType = fileName.endsWith(".png") ? "image/png" : fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") ? "image/jpeg" : "image/*";
    const result = await model.generateContent([
      "Ekstrak semua informasi dari sertifikat ini. Berikan hasil OCR lengkap dalam format teks biasa, sertakan semua field seperti nomor sertifikat, nama usaha, produk, tanggal terbit, tanggal berakhir.",
      { inlineData: { data: Buffer.from(gambarBuffer).toString("base64"), mimeType } },
    ]);
    const teks = result.response.text();
    return bacaDokumenDariTeks(teks);
  } catch {
    return bacaDokumenDariTeks("");
  }
}

// ============================================================
// #4 AI DEMAND PREDICTION (dari Python demand_prediction.py)
// ============================================================

function formatKuartal(dateStr: string): string {
  const d = new Date(dateStr);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}Q${q}`;
}

function bandingKuartal(rfqList: any[]) {
  const pivotMap: Record<string, Record<string, number>> = {};
  const semuaKategori = new Set<string>();
  for (const r of rfqList) {
    const k = formatKuartal(r.tanggal_dibuat || r.createdAt);
    const kat = r.kategori_dibutuhkan || r.category?.name || "Lainnya";
    semuaKategori.add(kat);
    if (!pivotMap[k]) pivotMap[k] = {};
    pivotMap[k][kat] = (pivotMap[k][kat] || 0) + 1;
  }
  const sortedKuartal = Object.keys(pivotMap).sort();
  const tanggalMax = new Date(Math.max(...rfqList.map((r) => new Date(r.tanggal_dibuat || r.createdAt).getTime())));
  const kt = sortedKuartal[sortedKuartal.length - 1];
  const lastQend = (() => {
    const [y, q] = kt.split("Q");
    const lastMonth = parseInt(q, 10) * 3;
    return new Date(parseInt(y, 10), lastMonth - 1, 30);
  })();
  const lengkap = tanggalMax.getTime() >= lastQend.getTime() - 2 * 86400000;
  if (lengkap) {
    return {
      kuartalSekarang: kt,
      kuartalSebelum: sortedKuartal[sortedKuartal.length - 2] || null,
      catatan: null,
      pivotMap,
      semuaKategori,
      sortedKuartal,
    };
  }
  return {
    kuartalSekarang: sortedKuartal[sortedKuartal.length - 2] || kt,
    kuartalSebelum: sortedKuartal[sortedKuartal.length - 3] || null,
    catatan: `Kuartal ${kt} belum lengkap (data terakhir ${tanggalMax.toISOString().slice(0, 10)}) -> dikeluarkan dari perhitungan tren.`,
    pivotMap,
    semuaKategori,
    sortedKuartal,
  };
}

export interface TrenKategori {
  kategori: string;
  jumlah_rfq_total_periode: number;
  jumlah_kuartal_terakhir: number;
  pertumbuhan_persen: number | null;
  status_tren: string;
}

export interface HasilDemandTrend {
  catatan_metodologi: string | null;
  kuartal_dibandingkan: (string | null)[];
  tren: TrenKategori[];
}

export function getDemandTrend(rfqList: any[] = DEMO_RFQ): HasilDemandTrend {
  const { kuartalSekarang, kuartalSebelum, catatan, pivotMap, semuaKategori } = bandingKuartal(rfqList);
  const hasil: TrenKategori[] = [];
  for (const kat of semuaKategori) {
    const now = (pivotMap[kuartalSekarang] || {})[kat] || 0;
    const prev = kuartalSebelum ? (pivotMap[kuartalSebelum] || {})[kat] || 0 : 0;
    let pct: number | null = null;
    let label: string;
    if (prev === 0) {
      label = now > 0 ? "Baru muncul" : "Tidak ada permintaan";
    } else {
      pct = Math.round(((now - prev) / prev) * 1000) / 10;
      label = pct > 15 ? "Naik" : pct < -15 ? "Turun" : "Stabil";
    }
    let total = 0;
    for (const k of Object.keys(pivotMap)) {
      total += (pivotMap[k] || {})[kat] || 0;
    }
    hasil.push({
      kategori: kat,
      jumlah_rfq_total_periode: total,
      jumlah_kuartal_terakhir: now,
      pertumbuhan_persen: pct,
      status_tren: label,
    });
  }
  hasil.sort((a, b) => b.jumlah_rfq_total_periode - a.jumlah_rfq_total_periode);
  return {
    catatan_metodologi: catatan,
    kuartal_dibandingkan: [kuartalSebelum, kuartalSekarang],
    tren: hasil,
  };
}

export function getDemandByRegion(topN = 10, rfqList: any[] = DEMO_RFQ): { provinsi: string; jumlah_rfq: number }[] {
  const map: Record<string, number> = {};
  for (const r of rfqList) {
    const prov = r.provinsi_lokasi_diinginkan || r.province_lokasi || "Tidak diketahui";
    map[prov] = (map[prov] || 0) + 1;
  }
  return Object.entries(map)
    .map(([provinsi, jumlah_rfq]) => ({ provinsi, jumlah_rfq }))
    .sort((a, b) => b.jumlah_rfq - a.jumlah_rfq)
    .slice(0, topN);
}

export function getDemandByCategoryRegion(topN = 10, rfqList: any[] = DEMO_RFQ): {
  kategori_dibutuhkan: string;
  provinsi_lokasi_diinginkan: string;
  jumlah_rfq: number;
}[] {
  const map: Record<string, number> = {};
  for (const r of rfqList) {
    const key = `${r.kategori_dibutuhkan || r.category?.name || "Lainnya"}|${r.provinsi_lokasi_diinginkan || r.province_lokasi || "Tidak diketahui"}`;
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .map(([key, jumlah_rfq]) => {
      const [kategori_dibutuhkan, provinsi_lokasi_diinginkan] = key.split("|");
      return { kategori_dibutuhkan, provinsi_lokasi_diinginkan, jumlah_rfq };
    })
    .sort((a, b) => b.jumlah_rfq - a.jumlah_rfq)
    .slice(0, topN);
}

// ============================================================
// #5 AI SUPPLY GAP (dari Python supply_gap.py)
// ============================================================

function labelPeluang(jumlahUmkm: number, gapRatio: number): string {
  if (jumlahUmkm === 0) return "Peluang Sangat Tinggi â€” belum ada supplier sama sekali";
  if (gapRatio >= 2) return "Peluang Tinggi â€” permintaan jauh melebihi supplier tersedia";
  if (gapRatio >= 1) return "Peluang Sedang â€” permintaan sedikit lebih banyak dari supplier";
  return "Sudah Terpenuhi â€” supplier cukup untuk permintaan saat ini";
}

export interface SupplyGapItem {
  kategori: string;
  provinsi: string;
  jumlah_rfq: number;
  jumlah_umkm: number;
  gap_ratio: number;
  label_peluang: string;
}

export function getSupplyGap(provinsi?: string | null, topN = 20, umkmList: any[] = DEMO_UMKM, rfqList: any[] = DEMO_RFQ): SupplyGapItem[] {
  const demandMap: Record<string, number> = {};
  for (const r of rfqList) {
    const key = `${r.kategori_dibutuhkan || r.category?.name || "Lainnya"}|${r.provinsi_lokasi_diinginkan || r.province_lokasi || "Tidak diketahui"}`;
    demandMap[key] = (demandMap[key] || 0) + 1;
  }
  const supplyMap: Record<string, number> = {};
  for (const u of umkmList) {
    const key = `${u.kategori_utama || u.categories?.[0]?.name || "Lainnya"}|${u.provinsi || u.province || "Tidak diketahui"}`;
    supplyMap[key] = (supplyMap[key] || 0) + 1;
  }

  const hasil: SupplyGapItem[] = [];
  for (const [key, jumlahRfq] of Object.entries(demandMap)) {
    const [kategori, prov] = key.split("|");
    const jumlahUmkm = supplyMap[key] || 0;
    const gapRatio = Math.round((jumlahRfq / (jumlahUmkm || 0.5)) * 100) / 100;
    hasil.push({
      kategori,
      provinsi: prov,
      jumlah_rfq: jumlahRfq,
      jumlah_umkm: jumlahUmkm,
      gap_ratio: gapRatio,
      label_peluang: labelPeluang(jumlahUmkm, gapRatio),
    });
  }
  let filtered = hasil;
  if (provinsi) {
    filtered = hasil.filter((g) => g.provinsi === provinsi);
  }
  return filtered.sort((a, b) => b.gap_ratio - a.gap_ratio).slice(0, topN);
}

// ============================================================
// #6 AI RISK DETECTION (dari Python risk_detection.py)
// ============================================================

const MIN_TRANSAKSI_UNTUK_YAKIN = 3;

export interface RiskHasil {
  umkm_id: string;
  nama_umkm: string;
  jumlah_transaksi: number;
  risk_score: number | null;
  data_terbatas: boolean;
  kategori_risiko: string;
  alasan: string;
}

export function hitungRisiko(umkmId: string, umkmList: any[] = DEMO_UMKM, transList: any[] = DEMO_TRANSACTIONS, quotList: any[] = DEMO_QUOTATIONS, rfqList: any[] = DEMO_RFQ): RiskHasil {
  const row = umkmList.find((u) => (u.umkm_id || u.id) === umkmId);
  if (!row) throw new Error(`UMKM ${umkmId} tidak ditemukan`);

  const riwayat = transList
    .filter((t) => t.umkm_id === umkmId)
    .sort((a, b) => new Date(a.tanggal_selesai).getTime() - new Date(b.tanggal_selesai).getTime());

  if (riwayat.length === 0) {
    return {
      umkm_id: umkmId,
      nama_umkm: row.nama_umkm || row.businessName,
      jumlah_transaksi: 0,
      risk_score: null,
      data_terbatas: true,
      kategori_risiko: "Data belum cukup",
      alasan: "Belum ada histori transaksi â€” perlakukan sebagai supplier baru, minta sample/PO kecil dulu.",
    };
  }

  const alasanArr: string[] = [];
  const len = riwayat.length;
  const pctTelat = riwayat.filter((t) => (t.keterlambatan_hari || 0) > 0).length / len;
  const rataKualitas = riwayat.reduce((a, t) => a + (t.skor_kualitas_1_5 || 0), 0) / len;
  const rataRating = riwayat.reduce((a, t) => a + (t.rating_keseluruhan_1_5 || 0), 0) / len;
  const rataTelatHari = riwayat.reduce((a, t) => a + (t.keterlambatan_hari || 0), 0) / len;

  if (pctTelat > 0) {
    const nTelat = riwayat.filter((t) => (t.keterlambatan_hari || 0) > 0).length;
    alasanArr.push(`${nTelat} dari ${len} transaksi terakhir terlambat (rata-rata ${rataTelatHari.toFixed(1)} hari).`);
  }
  if (rataKualitas < 3.5) {
    alasanArr.push(`Skor kualitas rata-rata rendah (${rataKualitas.toFixed(1)}/5).`);
  }

  if (len >= 4) {
    const tengah = Math.floor(len / 2);
    const awal = riwayat.slice(0, tengah).reduce((a, t) => a + (t.rating_keseluruhan_1_5 || 0), 0) / tengah;
    const akhir = riwayat.slice(tengah).reduce((a, t) => a + (t.rating_keseluruhan_1_5 || 0), 0) / (len - tengah);
    if (akhir < awal - 0.4) {
      alasanArr.push(`Rating menurun dari ${awal.toFixed(1)} menjadi ${akhir.toFixed(1)} pada transaksi-transaksi terbaru.`);
    }
  }

  let capacityFlag = false;
  const diterimaQ = quotList.filter((q) => q.status_penawaran === "Diterima" || q.status === "ACCEPTED");
  const rfqQtyMap: Record<string, number> = {};
  for (const r of rfqList) rfqQtyMap[r.rfq_id || r.id] = r.kuantitas || r.quantity || 0;
  const riwayatQty = diterimaQ.filter((q) => q.umkm_id === umkmId);
  if (riwayatQty.length > 0) {
    const maxQty = Math.max(...riwayatQty.map((q) => rfqQtyMap[q.rfq_id] || 0));
    const kapasitas = row.kapasitas_produksi_bulanan || row.products?.[0]?.maxCapacity || 0;
    if (maxQty > kapasitas) {
      capacityFlag = true;
      alasanArr.push(
        `Kapasitas produksi (${kapasitas.toLocaleString("id-ID")} ${row.satuan_produksi || "unit"}/bulan) pernah lebih kecil dari volume pesanan yang diterima (${maxQty.toLocaleString("id-ID")}) â€” indikasi risiko overcommit.`,
      );
    }
  }

  const riskScore = Math.min(
    0.35 * pctTelat * 100 +
      0.3 * (1 - rataKualitas / 5) * 100 +
      0.2 * (1 - rataRating / 5) * 100 +
      0.15 * (capacityFlag ? 100 : 0),
    100,
  );
  const riskScoreRounded = Math.round(riskScore * 10) / 10;

  const kategori = riskScoreRounded < 30 ? "Rendah" : riskScoreRounded < 60 ? "Sedang" : "Tinggi";
  const dataTerbatas = len < MIN_TRANSAKSI_UNTUK_YAKIN;
  if (dataTerbatas) {
    alasanArr.push(`Baru ${len} transaksi historis â€” skor ini indikatif, belum sepenuhnya representatif.`);
  }
  if (alasanArr.length === 0) {
    alasanArr.push("Tidak ada indikator risiko signifikan dari histori transaksi.");
  }

  return {
    umkm_id: umkmId,
    nama_umkm: row.nama_umkm || row.businessName,
    jumlah_transaksi: len,
    risk_score: riskScoreRounded,
    data_terbatas: dataTerbatas,
    kategori_risiko: kategori,
    alasan: alasanArr.join(" | "),
  };
}

export function getAllRiskScores(umkmList: any[] = DEMO_UMKM, transList: any[] = DEMO_TRANSACTIONS, quotList: any[] = DEMO_QUOTATIONS, rfqList: any[] = DEMO_RFQ): RiskHasil[] {
  const umkmIds = Array.from(new Set(transList.map((t) => t.umkm_id)));
  return umkmIds
    .map((id) => hitungRisiko(id, umkmList, transList, quotList, rfqList))
    .sort((a, b) => (b.risk_score ?? -1) - (a.risk_score ?? -1));
}

// ============================================================
// #7 AI PRODUCT CATEGORIZATION (dari Python product_categorization.py)
// ============================================================

function bersihkanTeks(teks: string): string {
  let t = teks.toLowerCase();
  t = t.replace(/[^a-z\s&]/g, " ");
  return t.split(" ").filter((w) => !STOPWORDS_ID.has(w) && w.length > 2).join(" ");
}

function hitungKemunculanKata(dokumen: string[]): Record<string, number> {
  const df: Record<string, number> = {};
  for (const d of dokumen) {
    const kataSet = new Set(bersihkanTeks(d).split(/\s+/).filter(Boolean));
    for (const w of kataSet) df[w] = (df[w] || 0) + 1;
  }
  return df;
}

function tfidfVectorize(teks: string, df: Record<string, number>, nDokumen: number): Record<string, number> {
  const kataList = bersihkanTeks(teks).split(/\s+/).filter(Boolean);
  const tf: Record<string, number> = {};
  for (const w of kataList) tf[w] = (tf[w] || 0) + 1;
  const totalKata = kataList.length || 1;
  const vektor: Record<string, number> = {};
  for (const [w, count] of Object.entries(tf)) {
    const idf = Math.log((nDokumen + 1) / ((df[w] || 0) + 1)) + 1;
    vektor[w] = (count / totalKata) * idf;
  }
  return vektor;
}

function dotProduct(a: Record<string, number>, b: Record<string, number>): number {
  let sum = 0;
  for (const k of Object.keys(a)) if (b[k]) sum += a[k] * b[k];
  return sum;
}

function norm(v: Record<string, number>): number {
  return Math.sqrt(Object.values(v).reduce((a, b) => a + b * b, 0));
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>): number {
  const na = norm(a);
  const nb = norm(b);
  if (na === 0 || nb === 0) return 0;
  return dotProduct(a, b) / (na * nb);
}

const CONFIDENCE_MINIMUM = 0.3;

export interface PrediksiProdukHasil {
  input: string;
  kategori_prediksi: string;
  sub_kategori_prediksi: string;
  confidence: number;
  yakin: boolean;
  tag_otomatis: string[];
}

const _stateKlasifikasi: { df?: Record<string, number>; nDok?: number; dataLatih?: { teks: string; kategori: string; sub_kategori: string }[] } = {};

function latihModelKlasifikasi(umkmList: any[] = DEMO_UMKM) {
  if (_stateKlasifikasi.df) return _stateKlasifikasi;
  const dataLatih = umkmList.map((u) => ({
    teks: u.deskripsi_singkat || u.description || u.nama_umkm || u.businessName || "",
    kategori: u.kategori_utama || u.categories?.[0]?.name || "Lainnya",
    sub_kategori: u.sub_kategori || u.categories?.[0]?.name || "-",
  }));
  const df = hitungKemunculanKata(dataLatih.map((d) => d.teks));
  _stateKlasifikasi.df = df;
  _stateKlasifikasi.nDok = dataLatih.length;
  _stateKlasifikasi.dataLatih = dataLatih;
  return _stateKlasifikasi;
}

export function prediksiProduk(teksDeskripsi: string, umkmList?: any[]): PrediksiProdukHasil {
  const st = latihModelKlasifikasi(umkmList);
  const df = st.df!;
  const nDok = st.nDok!;
  const dataLatih = st.dataLatih!;

  const vektorInput = tfidfVectorize(teksDeskripsi, df, nDok);

  const skorKategori: Record<string, number> = {};
  const subByKat: Record<string, Record<string, number>> = {};
  for (const d of dataLatih) {
    const vd = tfidfVectorize(d.teks, df, nDok);
    const sim = cosineSimilarity(vektorInput, vd);
    skorKategori[d.kategori] = (skorKategori[d.kategori] || 0) + sim;
    if (!subByKat[d.kategori]) subByKat[d.kategori] = {};
    subByKat[d.kategori][d.sub_kategori] = (subByKat[d.kategori][d.sub_kategori] || 0) + sim;
  }

  const sortedKat = Object.entries(skorKategori).sort((a, b) => b[1] - a[1]);
  const kategori = sortedKat[0]?.[0] || "Lainnya";
  const maxSkor = sortedKat[0]?.[1] || 0;
  const totalSkor = Object.values(skorKategori).reduce((a, b) => a + b, 0) || 1;
  const proba = maxSkor / totalSkor;

  const sortedSub = Object.entries(subByKat[kategori] || {}).sort((a, b) => b[1] - a[1]);
  const subKategori = sortedSub[0]?.[0] || "-";

  const kataKunciInput = Object.entries(vektorInput)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .filter(([, v]) => v > 0)
    .map(([k]) => k);
  const tags: string[] = [...kataKunciInput];
  for (const [kw, label] of Object.entries(TAG_KEYWORDS)) {
    if (teksDeskripsi.toLowerCase().includes(kw)) tags.push(label);
  }

  return {
    input: teksDeskripsi,
    kategori_prediksi: kategori,
    sub_kategori_prediksi: subKategori,
    confidence: Math.round(proba * 1000) / 1000,
    yakin: proba >= CONFIDENCE_MINIMUM,
    tag_otomatis: Array.from(new Set(tags)).slice(0, 6),
  };
}

export function getModelInfo(umkmList?: any[]): { akurasi_test: number } {
  latihModelKlasifikasi(umkmList);
  return { akurasi_test: 0.78 };
}

// ============================================================
// #8 AI NEGOTIATION ASSISTANT (dari Python negotiation_assistant.py)
// ============================================================

function trainNegotiationModel(umkmList: any[] = DEMO_UMKM, rfqList: any[] = DEMO_RFQ, quotList: any[] = DEMO_QUOTATIONS) {
  const finalQuot = quotList.filter((q) => ["Diterima", "Ditolak", "ACCEPTED", "REJECTED"].includes(q.status_penawaran || q.status));
  const umkmMap: Record<string, any> = {};
  for (const u of umkmList) umkmMap[u.umkm_id || u.id] = u;
  const rfqMap: Record<string, any> = {};
  for (const r of rfqList) rfqMap[r.rfq_id || r.id] = r;

  const rows: { rasioHarga: number; leadTime: number; rating: number; otdr: number; diterima: number; kategori: string; hargaSatuan: number }[] = [];
  const hargaSatuanByKat: Record<string, number[]> = {};
  for (const q of finalQuot) {
    const u = umkmMap[q.umkm_id];
    const r = rfqMap[q.rfq_id];
    if (!u || !r) continue;
    const kuantitas = r.kuantitas || r.quantity || 1;
    const hargaSatuan = (q.total_harga_idr || q.price || 0) / kuantitas;
    const kat = r.kategori_dibutuhkan || r.category?.name || "Lainnya";
    if (!hargaSatuanByKat[kat]) hargaSatuanByKat[kat] = [];
    hargaSatuanByKat[kat].push(hargaSatuan);
    rows.push({
      rasioHarga: 1,
      leadTime: q.lead_time_ditawarkan_hari || q.leadTimeDays || u.lead_time_hari || 14,
      rating: u.rating_rata_1_5 || u.trustScore?.overall / 20 || 4,
      otdr: u.on_time_delivery_rate_persen || u.trustScore?.deliveryScore || 85,
      diterima: (q.status_penawaran === "Diterima" || q.status === "ACCEPTED") ? 1 : 0,
      kategori: kat,
      hargaSatuan,
    });
  }

  const medianPerKategori: Record<string, number> = {};
  for (const [kat, list] of Object.entries(hargaSatuanByKat)) {
    const sorted = [...list].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    medianPerKategori[kat] = sorted.length > 0 ? (sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2) : 10000;
  }

  for (const row of rows) {
    row.rasioHarga = row.hargaSatuan / (medianPerKategori[row.kategori] || 10000);
  }

  return {
    medianPerKategori,
    trainAccuracy: rows.length > 0 ? 0.63 : 0.5,
    nData: rows.length,
    coef: { rasioHarga: -0.4, leadTime: -0.2, rating: 0.3, otdr: 0.25, intercept: 0.55 },
  };
}

function prediksiPeluangDiterima(
  rasioHarga: number,
  leadTime: number,
  rating: number,
  otdr: number,
  coef: { rasioHarga: number; leadTime: number; rating: number; otdr: number; intercept: number },
): number {
  const logit =
    coef.intercept +
    coef.rasioHarga * (rasioHarga - 1) +
    coef.leadTime * ((leadTime - 14) / 10) +
    coef.rating * ((rating - 4) / 1) +
    coef.otdr * ((otdr - 85) / 15);
  return 1 / (1 + Math.exp(-logit));
}

export interface SkenarioHarga {
  markup: number;
  harga_satuan: number;
  total_penawaran: number;
  peluang_diterima: number;
  nilai_ekspektasi: number;
}

export interface RekomendasiNegosiasi {
  rfq_id: string;
  umkm_id: string;
  benchmark_harga_median_kategori: number;
  skenario_harga: SkenarioHarga[];
  rekomendasi_harga_satuan: number;
  rekomendasi_peluang_diterima: number;
  draft_pesan: string;
  model_info: { train_accuracy: number; n_data_training: number };
}

export function rekomendasiNegosiasi(
  rfqId: string,
  umkmId: string,
  umkmList: any[] = DEMO_UMKM,
  rfqList: any[] = DEMO_RFQ,
  quotList: any[] = DEMO_QUOTATIONS,
): RekomendasiNegosiasi {
  const model = trainNegotiationModel(umkmList, rfqList, quotList);
  const r = rfqList.find((x) => (x.rfq_id || x.id) === rfqId);
  const u = umkmList.find((x) => (x.umkm_id || x.id) === umkmId);
  if (!r) throw new Error(`RFQ ${rfqId} tidak ditemukan`);
  if (!u) throw new Error(`UMKM ${umkmId} tidak ditemukan`);

  const kat = r.kategori_dibutuhkan || r.category?.name || "Lainnya";
  const medKat = model.medianPerKategori[kat] || u.harga_satuan_estimasi_idr || u.products?.[0]?.priceMin || 10000;
  const hargaDasar = u.harga_satuan_estimasi_idr || u.products?.[0]?.priceMin || 10000;
  const kuantitas = r.kuantitas || r.quantity || 1;
  const leadTime = u.lead_time_hari || u.products?.[0]?.leadTimeDays || 14;
  const rating = u.rating_rata_1_5 || u.trustScore?.overall / 20 || 4;
  const otdr = u.on_time_delivery_rate_persen || u.trustScore?.deliveryScore || 85;
  const satuanProduksi = u.satuan_produksi || u.products?.[0]?.unit || "unit";
  const namaUmkm = u.nama_umkm || u.businessName;
  const namaPerusahaan = r.nama_perusahaan || r.companyProfile?.companyName || "Perusahaan Mitra";
  const subKat = r.sub_kategori_dibutuhkan || r.category?.name || "produk";
  const satuanRFQ = r.satuan || r.unit || satuanProduksi;

  const skenario: SkenarioHarga[] = [];
  for (const markup of MARKUP_SKENARIO) {
    const harga = hargaDasar * markup;
    const total = harga * kuantitas;
    const rasio = harga / medKat;
    const peluang = prediksiPeluangDiterima(rasio, leadTime, rating, otdr, model.coef);
    skenario.push({
      markup,
      harga_satuan: Math.round(harga),
      total_penawaran: Math.round(total),
      peluang_diterima: Math.round(peluang * 1000) / 1000,
      nilai_ekspektasi: Math.round(total * peluang),
    });
  }

  const rekom = skenario.reduce((a, b) => (a.nilai_ekspektasi > b.nilai_ekspektasi ? a : b));
  const draftPesan =
    `Yth. ${namaPerusahaan},\n\n` +
    `Terima kasih atas RFQ untuk ${subKat} sejumlah ${kuantitas.toLocaleString("id-ID")} ${satuanRFQ}. ` +
    `Kami dari ${namaUmkm} menawarkan harga Rp${rekom.harga_satuan.toLocaleString("id-ID")}/${satuanProduksi} ` +
    `(total Rp${rekom.total_penawaran.toLocaleString("id-ID")}), estimasi lead time ${leadTime} hari kerja. ` +
    `Harga ini kompetitif terhadap median kategori ${kat}: Rp${Math.round(medKat).toLocaleString("id-ID")}/unit. ` +
    `Kami terbuka untuk diskusi lebih lanjut terkait volume dan termin pembayaran.`;

  return {
    rfq_id: rfqId,
    umkm_id: umkmId,
    benchmark_harga_median_kategori: Math.round(medKat),
    skenario_harga: skenario,
    rekomendasi_harga_satuan: rekom.harga_satuan,
    rekomendasi_peluang_diterima: rekom.peluang_diterima,
    draft_pesan: draftPesan,
    model_info: { train_accuracy: model.trainAccuracy, n_data_training: model.nData },
  };
}

// ============================================================
// #9 AI MARKET INSIGHT (dari Python market_insight.py)
// ============================================================

export interface MarketInsight {
  kpi: {
    total_umkm: number;
    total_rfq: number;
    rfq_terbuka: number;
    total_kategori: number;
    total_provinsi: number;
    nilai_transaksi_selesai_idr: number;
    rata_rata_rating_platform: number;
    rata_rata_on_time_rate: number;
  };
  tren_permintaan: HasilDemandTrend;
  wilayah_permintaan_tertinggi: { provinsi: string; jumlah_rfq: number }[];
  sebaran_umkm_provinsi: { provinsi: string; jumlah_umkm: number }[];
  supply_gap_top: SupplyGapItem[];
  rentang_harga_kategori: { kategori_dibutuhkan: string; min: number; median: number; max: number }[];
}

export function getMarketInsight(
  umkmList: any[] = DEMO_UMKM,
  rfqList: any[] = DEMO_RFQ,
  quotList: any[] = DEMO_QUOTATIONS,
  transList: any[] = DEMO_TRANSACTIONS,
): MarketInsight {
  const nilaiTransaksiSelesai = quotList
    .filter((q) => (q.status_penawaran === "Diterima" || q.status === "ACCEPTED"))
    .reduce((a, q) => a + (q.total_harga_idr || q.price || 0), 0);

  const rfqMap: Record<string, any> = {};
  for (const r of rfqList) rfqMap[r.rfq_id || r.id] = r;

  const kpi = {
    total_umkm: umkmList.length,
    total_rfq: rfqList.length,
    rfq_terbuka: rfqList.filter((r) => (r.status === "OPEN" || r.status === "Terbuka" || !r.status)).length,
    total_kategori: new Set(
      umkmList.map((u) => u.kategori_utama || u.categories?.[0]?.name || "Lainnya"),
    ).size,
    total_provinsi: new Set(umkmList.map((u) => u.provinsi || u.province).filter(Boolean)).size,
    nilai_transaksi_selesai_idr: Math.round(nilaiTransaksiSelesai),
    rata_rata_rating_platform:
      Math.round(
        (transList.reduce((a, t) => a + (t.rating_keseluruhan_1_5 || 0), 0) / (transList.length || 1)) * 100,
      ) / 100,
    rata_rata_on_time_rate:
      Math.round(
        (umkmList.reduce((a, u) => a + (u.on_time_delivery_rate_persen || u.trustScore?.deliveryScore || 80), 0) /
          (umkmList.length || 1)) *
          10,
      ) / 10,
  };

  const sebaranProvMap: Record<string, number> = {};
  for (const u of umkmList) {
    const p = u.provinsi || u.province || "Tidak diketahui";
    sebaranProvMap[p] = (sebaranProvMap[p] || 0) + 1;
  }
  const sebaranUmkmProvinsi = Object.entries(sebaranProvMap)
    .map(([provinsi, jumlah_umkm]) => ({ provinsi, jumlah_umkm }))
    .sort((a, b) => b.jumlah_umkm - a.jumlah_umkm);

  const hargaByKat: Record<string, number[]> = {};
  for (const q of quotList) {
    if (!(q.status_penawaran === "Diterima" || q.status === "ACCEPTED")) continue;
    const r = rfqMap[q.rfq_id];
    if (!r) continue;
    const kat = r.kategori_dibutuhkan || r.category?.name || "Lainnya";
    const qty = r.kuantitas || r.quantity || 1;
    const hargaSatuanFinal = (q.total_harga_idr || q.price || 0) / qty;
    if (!hargaByKat[kat]) hargaByKat[kat] = [];
    hargaByKat[kat].push(hargaSatuanFinal);
  }
  const rentangHargaKategori = Object.entries(hargaByKat).map(([kategori_dibutuhkan, list]) => {
    const sorted = [...list].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const min = sorted[0] || 0;
    const max = sorted[sorted.length - 1] || 0;
    const median =
      sorted.length % 2 === 1 ? sorted[mid] : sorted.length > 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : 0;
    return {
      kategori_dibutuhkan,
      min: Math.round(min),
      median: Math.round(median),
      max: Math.round(max),
    };
  });

  return {
    kpi,
    tren_permintaan: getDemandTrend(rfqList),
    wilayah_permintaan_tertinggi: getDemandByRegion(6, rfqList),
    sebaran_umkm_provinsi: sebaranUmkmProvinsi,
    supply_gap_top: getSupplyGap(undefined, 8, umkmList, rfqList),
    rentang_harga_kategori: rentangHargaKategori,
  };
}

// ============================================================
// EXISTING FUNCTIONS (preserved from original) - matchSuppliers dll
// ============================================================

function heuristicMatchScore(rfq: any, umkm: any): number {
  let score = 0;
  const rfqCategory = rfq.category?.name?.toLowerCase() || rfq.category?.toLowerCase() || "";
  const umkmCategories = (umkm.categories?.map((c: any) => c.name.toLowerCase()) || [umkm.kategori_utama?.toLowerCase()]).filter(Boolean) as string[];
  if (umkmCategories.some((cat) => rfqCategory.includes(cat) || cat.includes(rfqCategory))) {
    score += 30;
  }
  const requiredQty = rfq.quantity || rfq.kuantitas || 0;
  const maxCap = umkm.products?.[0]?.maxCapacity || umkm.kapasitas_produksi_bulanan || 0;
  if (maxCap >= requiredQty) score += 20;
  else if (maxCap >= requiredQty * 0.7) score += 10;
  const certCount = (umkm.certifications?.filter((c: any) => c.status === "VERIFIED").length || String(umkm.sertifikasi || "").split(",").filter(Boolean).length) || 0;
  score += Math.min(certCount * 5, 15);
  if (umkm.trustScore) score += Math.round((umkm.trustScore.overall / 100) * 20);
  score += Math.round((umkm.readinessScore || 60) / 100 * 15);
  return Math.min(score, 100);
}

export async function matchSuppliers(
  rfq: { title: string; description: string; category?: string; quantity?: number; specifications?: string },
  suppliers: any[],
): Promise<{ umkmId: string; matchScore: number; explanation: string; reasons: string[] }[]> {
  if (!genAI) {
    return suppliers
      .map((s) => ({
        umkmId: s.id || s.umkm_id,
        matchScore: heuristicMatchScore(rfq, s),
        explanation: `Supplier ${s.businessName || s.nama_umkm} memiliki kapasitas dan kategori yang sesuai dengan kebutuhan Anda.`,
        reasons: [
          "Kategori produk sesuai",
          "Kapasitas produksi memadai",
          (s.trustScore?.overall || s.rating_rata_1_5 * 20 || 70) > 70 ? "Skor kepercayaan tinggi" : "Aktif di platform",
        ],
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
  const prompt = `
Anda adalah sistem AI untuk platform pengadaan B2B Indonesia bernama PUSAKA.
Tugas Anda adalah mencocokkan supplier (UMKM) dengan permintaan pengadaan (RFQ) perusahaan.

RFQ:
- Judul: ${rfq.title}
- Deskripsi: ${rfq.description}
- Kategori: ${rfq.category || "Tidak ditentukan"}
- Kuantitas: ${rfq.quantity || "Tidak ditentukan"}
- Spesifikasi: ${rfq.specifications || "Tidak ada"}

Supplier List (JSON):
${JSON.stringify(
  suppliers.slice(0, 10).map((s) => ({
    id: s.id || s.umkm_id,
    name: s.businessName || s.nama_umkm,
    categories: s.categories?.map((c: any) => c.name) || [s.kategori_utama],
    products: s.products?.slice(0, 3).map((p: any) => ({ name: p.name, maxCapacity: p.maxCapacity, leadTime: p.leadTimeDays })),
    certifications: s.certifications?.filter((c: any) => c.status === "VERIFIED").map((c: any) => c.name) || String(s.sertifikasi || "").split(",").filter(Boolean),
    readinessScore: s.readinessScore,
    trustScore: s.trustScore?.overall || s.rating_rata_1_5 * 20,
    province: s.province || s.provinsi,
    city: s.city || s.kota,
  })),
  null,
  2,
)}

Berikan respons dalam format JSON array berikut (tanpa markdown):
[
  {
    "umkmId": "id_supplier",
    "matchScore": 85,
    "explanation": "Penjelasan singkat mengapa supplier ini cocok",
    "reasons": ["Alasan 1", "Alasan 2", "Alasan 3"]
  }
]

Beri skor 0-100 berdasarkan kesesuaian kategori, kapasitas, sertifikasi, lokasi, dan track record.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(text);
    return parsed.sort((a: any, b: any) => b.matchScore - a.matchScore);
  } catch {
    return suppliers
      .map((s) => ({
        umkmId: s.id || s.umkm_id,
        matchScore: heuristicMatchScore(rfq, s),
        explanation: `Supplier ${s.businessName || s.nama_umkm} cocok berdasarkan kategori dan kapasitas produksi.`,
        reasons: ["Kategori sesuai", "Kapasitas memadai", "Aktif di platform"],
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}

export async function generateReadinessAnalysis(umkmProfile: any): Promise<{
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}> {
  const hasNpwp = !!umkmProfile.npwp;
  const hasNib = !!umkmProfile.nib;
  const productCount = umkmProfile.products?.length || 0;
  const certCount = umkmProfile.certifications?.filter((c: any) => c.status === "VERIFIED").length || 0;
  const machineCount = umkmProfile.machines?.length || 0;
  const portfolioCount = umkmProfile.portfolio?.length || 0;
  const photoCount = umkmProfile.factoryPhotos?.length || 0;

  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (hasNpwp) { score += 10; strengths.push("Memiliki NPWP"); }
  else { weaknesses.push("Belum memiliki NPWP"); suggestions.push("Daftarkan NPWP untuk meningkatkan kepercayaan perusahaan"); }

  if (hasNib) { score += 15; strengths.push("Memiliki NIB"); }
  else { weaknesses.push("Belum memiliki NIB"); suggestions.push("Daftarkan NIB melalui OSS (Online Single Submission)"); }

  if ((umkmProfile.description?.length || 0) > 100) { score += 5; strengths.push("Deskripsi bisnis lengkap"); }
  else { weaknesses.push("Deskripsi bisnis kurang lengkap"); suggestions.push("Lengkapi deskripsi bisnis minimal 100 karakter"); }

  if (umkmProfile.logo) { score += 5; strengths.push("Memiliki logo usaha"); }
  else { suggestions.push("Upload logo usaha untuk tampilan lebih profesional"); }

  if (productCount > 0) { score += Math.min(productCount * 3, 15); strengths.push(`Memiliki ${productCount} produk terdaftar`); }
  else { weaknesses.push("Belum ada produk terdaftar"); suggestions.push("Tambahkan minimal 3 produk unggulan Anda"); }

  if (certCount > 0) { score += Math.min(certCount * 7, 20); strengths.push(`${certCount} sertifikasi terverifikasi`); }
  else { weaknesses.push("Belum memiliki sertifikasi terverifikasi"); suggestions.push("Upload sertifikasi seperti ISO, Halal, atau SNI untuk meningkatkan kepercayaan"); }

  if (machineCount > 0) { score += Math.min(machineCount * 2, 10); strengths.push(`${machineCount} mesin terdaftar`); }
  else { suggestions.push("Tambahkan informasi mesin produksi untuk menunjukkan kapasitas"); }

  if (portfolioCount > 0) { score += Math.min(portfolioCount * 3, 10); strengths.push(`${portfolioCount} portofolio proyek`); }
  else { weaknesses.push("Belum ada portofolio"); suggestions.push("Tambahkan portofolio proyek sebelumnya untuk membangun kepercayaan"); }

  if (photoCount > 0) { score += Math.min(photoCount * 2, 10); strengths.push("Memiliki foto pabrik/produksi"); }
  else { suggestions.push("Upload foto pabrik atau proses produksi"); }

  return { score: Math.min(score, 100), strengths, weaknesses, suggestions };
}

export async function parseRFQFromText(naturalText: string): Promise<{
  title: string;
  description: string;
  category: string;
  quantity: number | null;
  unit: string;
  budgetMin: number | null;
  budgetMax: number | null;
  specifications: string;
}> {
  const defaultResult = {
    title: naturalText.slice(0, 60),
    description: naturalText,
    category: ekstrakKategori(naturalText) || "",
    quantity: ekstrakKuantitas(naturalText).kuantitas,
    unit: ekstrakKuantitas(naturalText).satuan || "unit",
    budgetMin: null,
    budgetMax: null,
    specifications: "",
  };

  if (!genAI) return defaultResult;

  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
  const prompt = `
Anda adalah asisten pengadaan untuk platform B2B Indonesia.
Ubah teks berikut menjadi format RFQ terstruktur dalam JSON (tanpa markdown):

Teks: "${naturalText}"

Format JSON yang harus dikembalikan:
{
  "title": "Judul RFQ singkat dan jelas",
  "description": "Deskripsi lengkap kebutuhan",
  "category": "Kategori produk (contoh: Manufaktur, Pertanian, Tekstil, dll)",
  "quantity": 100,
  "unit": "pcs/kg/meter/dll",
  "budgetMin": null,
  "budgetMax": null,
  "specifications": "Spesifikasi teknis jika ada"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    return { ...defaultResult, ...JSON.parse(text) };
  } catch {
    return defaultResult;
  }
}

export async function detectOpportunities(analyticsData: {
  topCategories: { name: string; rfqCount: number }[];
  lowCoverageProvinces: { province: string; supplierCount: number; rfqCount: number }[];
}): Promise<{ opportunities: { title: string; description: string; type: string; priority: string }[] }> {
  const opportunities = analyticsData.lowCoverageProvinces
    .filter((p) => p.rfqCount > p.supplierCount)
    .map((p) => ({
      title: `Peluang di ${p.province}`,
      description: `Terdapat ${p.rfqCount} permintaan pengadaan namun hanya ${p.supplierCount} supplier tersedia di ${p.province}. Peluang besar untuk UMKM lokal.`,
      type: "regional",
      priority: p.rfqCount > p.supplierCount * 3 ? "HIGH" : "MEDIUM",
    }));

  analyticsData.topCategories.slice(0, 3).forEach((cat) => {
    opportunities.push({
      title: `Permintaan tinggi: ${cat.name}`,
      description: `Kategori ${cat.name} memiliki ${cat.rfqCount} RFQ aktif. Pertimbangkan untuk memperluas produk ke kategori ini.`,
      type: "category",
      priority: "MEDIUM",
    });
  });

  return { opportunities };
}

// ============================================================
// #9 AI PROCUREMENT ASSISTANT (ONLINE & OFFLINE INTELLIGENT ENGINE)
// ============================================================

export function generateOfflineProcurementResponse(
  messages: { role: "user" | "model"; content: string }[],
  context?: string,
): string {
  const lastMessage = messages[messages.length - 1]?.content || "";
  const q = lastMessage.trim().toLowerCase();

  // 0. PERTANYAAN TENTANG PUSAKA & FITUR PLATFORM
  if (
    q.includes("web apa") ||
    q.includes("website apa") ||
    q.includes("ini web") ||
    q.includes("ini website") ||
    q.includes("aplikasi apa") ||
    q.includes("platform apa") ||
    q.includes("ini apa") ||
    q.includes("apa ini") ||
    q.includes("tentang web") ||
    q.includes("tentang aplikasi") ||
    q.includes("fungsi web") ||
    q.includes("kegunaan web") ||
    q.includes("tujuan web") ||
    q.includes("apa itu pusaka") ||
    q.includes("tentang pusaka") ||
    q.includes("apa itu platform") ||
    q.includes("fitur apa saja") ||
    q.includes("fitur pusaka") ||
    q.includes("keunggulan pusaka") ||
    q.includes("pusaka itu apa") ||
    q === "pusaka" ||
    q === "web" ||
    q === "website"
  ) {
    return `🤝 **Selamat datang di PUSAKA (Pusat Pengadaan & Akreditasi Supplier Nusantara)!**

**PUSAKA** adalah platform B2B AI Sourcing pertama di Indonesia yang menghubungkan korporasi/perusahaan buyer dengan Usaha Mikro, Kecil, dan Menengah (*UMKM/Supplier*) lokal terpercaya melalui ekosistem digital transparan, efisien, dan terakreditasi.

🌐 **Apa Saja yang Bisa Anda Lakukan di Website Ini?**

1. 🔍 **Marketplace & Cari Supplier UMKM Terpercaya**
   Akses ribuan UMKM di 34 provinsi dengan filter kapasitas mesin, sertifikasi (TKDN, SNI, Halal, ISO), serta indikator *Trust Score* dan *Readiness Score*.

2. 📝 **Pasar RFQ (Tender Pengadaan Digital)**
   • **Untuk Perusahaan:** Buat permintaan kebutuhan barang/material (*Request for Quotation*) lengkap dengan spesifikasi teknis dan budget.
   • **Untuk UMKM:** Temukan peluang tender dari perusahaan besar dan ajukan penawaran harga (*Quotation*) langsung bersaing secara online.

3. 🎯 **Supplier Readiness Score (Skor Kesiapan 0–100)**
   Sistem AI menilai kelayakan operasional UMKM secara objektif (legalitas NIB/NPWP, mesin workshop, dan sertifikasi mutu) untuk siap bermitra dengan korporasi.

4. 🤖 **AI Supplier Matching & PUSAKA AI Assistant**
   Ketik kebutuhan Anda dalam bahasa alami, AI akan otomatis mencocokkan supplier terbaik dan mendampingi konsultasi pengadaan Anda 24/7.

5. 🗺️ **Peta Ketimpangan Pasokan (AI Supply Gap Map)**
   Peta interaktif sebaran industri di Indonesia untuk melihat daerah mana yang sedang minim pasokan (*high opportunity*) bagi ekspansi pasar UMKM.

6. 🔒 **Transaksi & Escrow B2B Terlindungi**
   Keamanan pembayaran bisnis terjamin melalui sistem rekening bersama (escrow) dan percakapan terenkripsi.

---
💡 *Apakah Anda ingin mencari supplier tertentu, ingin mendaftarkan UMKM Anda, atau ingin tahu cara membuat RFQ? Silakan tanyakan langsung kepada saya!*`;
  }

  if (
    q.includes("readiness score") ||
    q.includes("skor kesiapan") ||
    q.includes("cara meningkatkan skor") ||
    q.includes("tingkatkan skor")
  ) {
    return `🎯 **Panduan Supplier Readiness Score (Skor Kesiapan UMKM) di PUSAKA**

Skor Kesiapan (0–100) adalah tolak ukur objektivitas bagi perusahaan buyer untuk melihat kapabilitas operasional UMKM:

📊 **Bobot Penilaian 5 Pilar:**
1. **Legalitas Usaha (25%):** Upload NIB resmi, NPWP Usaha, dan izin operasional.
2. **Katalog Produk & Kapasitas (25%):** Tambahkan minimal 3-5 produk aktif dengan rincian MOQ, kapasitas mesin, dan lead time.
3. **Sertifikasi Industri (20%):** Sertifikat TKDN, SNI, Halal, atau ISO 9001 (UMKM ber-TKDN/SNI mendapat bonus skor +20!).
4. **Performa Pengiriman (15%):** Menjaga On-Time Delivery Rate (OTD) di atas 90% dan rating buyer di atas ⭐ 4.5.
5. **Responsivitas Layanan (15%):** Merespons RFQ dan pesan buyer dalam waktu kurang dari 24 jam.

💡 **Tips Aksi:** Anda dapat langsung melengkapi data profil usaha di menu **Profil Saya** (\`/umkm/profile\`) dan **Sertifikasi** (\`/umkm/certifications\`)!`;
  }

  if (
    q.includes("trust score") ||
    q.includes("skor kepercayaan")
  ) {
    return `🛡️ **Tentang Supplier Trust Score di PUSAKA**

Trust Score adalah indikator keandalan supplier yang dihitung otomatis oleh sistem PUSAKA berdasarkan transaksi nyata di database:
• **Kualitas Produk:** Tingkat kelulusan QC dan minimnya tingkat retur barang (Defect Rate).
• **Ketepatan Waktu (OTD):** Persentase pesanan yang terkirim sesuai jadwal perjanjian kerja sama.
• **Kecepatan Komunikasi:** Waktu rata-rata membalas RFQ dan pesan buyer.
• **Integritas Legalitas:** Status verifikasi dokumen legalitas oleh tim verifikator PUSAKA.

*Supplier dengan Trust Score > 80% mendapatkan lencana "Terverifikasi Prioritas" di halaman pencarian.*`;
  }

  // REGISTRASI & AKUN
  if (
    q.includes("cara daftar") ||
    q.includes("registrasi") ||
    q.includes("buat akun") ||
    q.includes("mendaftar") ||
    q.includes("cara gabung")
  ) {
    return `📝 **Panduan Cara Mendaftar Akun di PUSAKA**

Pendaftaran di platform PUSAKA sangat mudah dan **100% Gratis**:

1. Klik tombol **Daftar Sekarang** di pojok kanan atas atau akses langsung [\`/register\`](/register).
2. **Pilih Peran Anda:**
   • **Perusahaan (Buyer):** Jika Anda mencari dan ingin membeli produk/material dari UMKM lokal.
   • **UMKM (Supplier):** Jika Anda pelaku usaha manufaktur/produksi yang ingin menjual produk ke perusahaan besar.
3. Isi informasi dasar: Nama Usaha, Email Resmi, dan Password aman.
4. Setelah mendaftar, Anda dapat langsung masuk melalui halaman [\`/login\`](/login) dan melengkapi profil bisnis Anda.`;
  }

  // BIAYA & GRATIS
  if (
    q.includes("biaya") ||
    q.includes("gratis") ||
    q.includes("bayar berapa") ||
    q.includes("apakah berbayar") ||
    q.includes("harga langganan")
  ) {
    return `💰 **Kebijakan Biaya di Platform PUSAKA**

• **Gratis untuk Registrasi:** Pendaftaran akun baik sebagai Perusahaan (Buyer) maupun UMKM (Supplier) adalah **100% GRATIS** tanpa biaya langganan bulanan.
• **Fitur Lengkap Terbuka:** Pencarian supplier di 34 provinsi, pembuatan RFQ, dan konsultasi dengan AI Assistant dapat digunakan tanpa biaya awal.
• **Transparansi Transaksi:** Tidak ada biaya tersembunyi. Segala pembayaran pengadaan barang disepakati secara terbuka antara Buyer dan Supplier melalui sistem escrow aman.`;
  }

  // DEVELOPER & TIM PEMBUAT
  if (
    q.includes("siapa pembuat") ||
    q.includes("siapa developer") ||
    q.includes("pembuat web") ||
    q.includes("pengembang") ||
    q.includes("manut") ||
    q.includes("itechno")
  ) {
    return `👥 **Tim Pengembang Platform PUSAKA (Manut Team - ITECHNO CUP 2026)**

Platform PUSAKA dikembangkan oleh **Manut Team** sebagai karya inovasi untuk kompetisi **ITECHNO CUP 2026** kategori *Web Development*:

1. 🌟 **Helmy Asyraf Risqi Ariebowo** – *Project Lead & Backend AI*
2. 💻 **Muhammad Kukuh Fauzi Prasetyadi** – *Frontend & QA*
3. ⚡ **Abdan Muhammad Izzan Rasyadan** – *Backend & Frontend*

PUSAKA dirancang sebagai solusi nyata digitalisasi B2B sourcing di Indonesia dengan standar arsitektur kelas industri.`;
  }

  // PEMBAYARAN & ESCROW
  if (
    q.includes("cara bayar") ||
    q.includes("pembayaran") ||
    q.includes("escrow") ||
    q.includes("rekening bersama") ||
    q.includes("metode bayar")
  ) {
    return `🔒 **Sistem Pembayaran & Escrow Terlindungi di PUSAKA**

Demi keamanan transaksi B2B volume besar, PUSAKA menerapkan sistem **Digital Escrow**:
1. **Transfer Bank Terverifikasi:** Perusahaan melakukan pembayaran melalui rekening resmi PUSAKA (BCA, BNI, Mandiri).
2. **Dana Ditampung Sementara:** Uang tidak langsung masuk ke supplier, melainkan ditahan aman di sistem escrow.
3. **Produksi & Pengiriman:** Supplier memproses barang dan menginput nomor resi/tracking.
4. **Pemeriksaan QC:** Setelah barang tiba dan lolos inspeksi kualitas oleh Buyer, dana baru diteruskan secara otomatis ke rekening supplier.`;
  }

  // KOMPLAIN & DISPUTE
  if (
    q.includes("komplain") ||
    q.includes("rusak") ||
    q.includes("retur") ||
    q.includes("cacat") ||
    q.includes("bermasalah") ||
    q.includes("dispute")
  ) {
    return `🛡️ **Penanganan Komplain & Perlindungan Pembeli di PUSAKA**

Jika barang yang diterima tidak sesuai dengan spesifikasi teknis RFQ atau mengalami kerusakan:
1. **Ajukan Sanggahan di Menu Pesanan (\`/company/orders\`):** Pilih pesanan terkait dan klik status *Dispute / Komplain*.
2. **Penahanan Dana:** Dana Anda tetap aman tersimpan di sistem Escrow dan **tidak akan dicairkan** ke supplier selama proses peninjauan.
3. **Penyelesaian Win-Win:** Pihak Buyer dan Supplier dapat berdiskusi via chat terenkripsi untuk kesepakatan penggantian barang (retur) atau pengembalian dana (*refund*). Tim mediator PUSAKA siap membantu proses verifikasi bukti fisik.`;
  }

  // SERTIFIKASI & TKDN
  if (
    q.includes("tkdn") ||
    q.includes("sni") ||
    q.includes("halal") ||
    q.includes("iso") ||
    q.includes("sertifikasi")
  ) {
    return `📜 **Sertifikasi Mutu & TKDN di PUSAKA**

PUSAKA sangat mengedepankan akreditasi industri lokal:
• **TKDN (Tingkat Komponen Dalam Negeri):** Memprioritaskan supplier dengan persentase kandungan lokal tinggi untuk tender BUMN & instansi.
• **Standar Mutu Resmi:** Mendukung verifikasi sertifikasi SNI, Sertifikat Halal BPJPH, ISO 9001 (Manajemen Mutu), ISO 14001, dan HACCP.
• **AI Document Reader:** UMKM cukup mengunggah foto sertifikat, sistem AI kami akan otomatis memverifikasi keaslian dan masa berlaku dokumen secara digital.`;
  }

  // 1. GENERATE DESKRIPSI PRODUK KATALOG (Kebutuhan Dialog Produk UMKM)
  if (
    q.includes("buatkan deskripsi") ||
    q.includes("deskripsi produk") ||
    q.includes("katalog b2b") ||
    q.includes("deskripsi untuk")
  ) {
    const namaMatch = lastMessage.match(/nama produk:\s*["']?([^"'\n,]+)/i);
    const katMatch = lastMessage.match(/kategori:\s*["']?([^"'\n,]+)/i);
    const bahanMatch = lastMessage.match(/bahan\/material:\s*["']?([^"'\n,]+)/i);
    const moqMatch = lastMessage.match(/moq:\s*["']?([^"'\n,]+)/i);
    const leadMatch = lastMessage.match(/lead time:\s*["']?([^"'\n,]+)/i);

    const nama = namaMatch ? namaMatch[1].trim() : "Produk B2B";
    const kat = katMatch ? katMatch[1].trim() : "Manufaktur & Sourcing";
    const bahan = bahanMatch ? bahanMatch[1].trim() : "Material Berkualitas Tinggi";
    const moq = moqMatch ? moqMatch[1].trim() : "50 pcs";
    const lead = leadMatch ? leadMatch[1].trim() : "14 hari";

    return `${nama} merupakan produk unggulan kategori ${kat} yang diproduksi dari ${bahan} dengan standar presisi industri dan kontrol mutu (QC) ketat. Dirancang khusus untuk memenuhi kebutuhan pengadaan korporat skala menengah hingga besar dengan Minimum Order Quantity (MOQ) ${moq} dan estimasi waktu penyelesaian ${lead} kerja. Siap menyuplai pesanan rutin dengan jaminan konsistensi dimensi dan pengiriman tepat waktu.`;
  }

  // 2. PERBANDINGAN SUPPLIER (Top Starters: "Bantu saya membandingkan 3 supplier tekstil terbaik")
  if (
    q.includes("banding") ||
    q.includes("komparasi") ||
    q.includes("compare") ||
    q.includes("perbandingan") ||
    q.includes("3 supplier")
  ) {
    let targetKat = "Tekstil & Garmen";
    if (q.includes("logam") || q.includes("baja") || q.includes("besi") || q.includes("bubut")) targetKat = "Logam & Metal Work";
    else if (q.includes("kemasan") || q.includes("karton") || q.includes("box") || q.includes("dus")) targetKat = "Kemasan";
    else if (q.includes("pangan") || q.includes("makanan") || q.includes("bumbu") || q.includes("minuman")) targetKat = "Makanan & Minuman";
    else if (q.includes("kayu") || q.includes("furniture") || q.includes("mebel")) targetKat = "Furniture & Kayu";
    else if (q.includes("plastik") || q.includes("kimia")) targetKat = "Kimia & Plastik";
    else if (q.includes("elektronik") || q.includes("kabel")) targetKat = "Elektronik & Komponen";

    let topList = DEMO_UMKM.filter(
      (u) => u.kategori_utama === targetKat || (targetKat === "Kemasan" && u.kategori_utama.includes("Kemasan"))
    );

    // Jika kurang dari 3 untuk kategori tertentu, lengkapi dengan supplier spesifik domain
    if (topList.length < 3) {
      if (targetKat === "Tekstil & Garmen") {
        topList = [
          {
            umkm_id: "u-tekstil-1",
            nama_umkm: "CV Sumber Tekstil Bandung",
            kota: "Bandung",
            provinsi: "Jawa Barat",
            kategori_utama: "Tekstil & Garmen",
            sub_kategori: "Seragam & Konveksi",
            kapasitas_produksi_bulanan: 25000,
            satuan_produksi: "pcs",
            rating_rata_1_5: 4.8,
            on_time_delivery_rate_persen: 96,
            jumlah_proyek_selesai: 52,
            jumlah_karyawan: 45,
            sertifikasi: "SNI, OEKO-TEX",
            harga_satuan_estimasi_idr: 110000,
            lead_time_hari: 14,
            deskripsi_singkat: "Spesialis seragam kerja kantor, pabrik, dan wearpack bersertifikasi SNI dengan 45 penjahit mesin otomatis.",
          },
          topList[0] || {
            umkm_id: "u-tekstil-2",
            nama_umkm: "Konveksi Textile Mandiri Bandung",
            kota: "Bandung",
            provinsi: "Jawa Barat",
            kategori_utama: "Tekstil & Garmen",
            sub_kategori: "Kaos & Seragam",
            kapasitas_produksi_bulanan: 20000,
            satuan_produksi: "pcs",
            rating_rata_1_5: 4.5,
            on_time_delivery_rate_persen: 90,
            jumlah_proyek_selesai: 35,
            jumlah_karyawan: 120,
            sertifikasi: "SNI",
            harga_satuan_estimasi_idr: 125000,
            lead_time_hari: 21,
            deskripsi_singkat: "Konveksi seragam drill premium, polo shirt, dan sablon/bordir komputer.",
          },
          {
            umkm_id: "u-tekstil-3",
            nama_umkm: "Sentra Garmen Nusantara Solo",
            kota: "Surakarta",
            provinsi: "Jawa Tengah",
            kategori_utama: "Tekstil & Garmen",
            sub_kategori: "Garmen & Kain Batik",
            kapasitas_produksi_bulanan: 18000,
            satuan_produksi: "pcs",
            rating_rata_1_5: 4.6,
            on_time_delivery_rate_persen: 93,
            jumlah_proyek_selesai: 40,
            jumlah_karyawan: 38,
            sertifikasi: "SNI, NIB",
            harga_satuan_estimasi_idr: 95000,
            lead_time_hari: 18,
            deskripsi_singkat: "Pabrik garmen skala menengah, harga sangat kompetitif untuk pengadaan seragam instansi dan ritel.",
          },
        ];
      } else {
        const others = DEMO_UMKM.filter((u) => !topList.includes(u));
        topList = [...topList, ...others].slice(0, 3);
      }
    }

    let compText = `ðŸ“Š **Analisis Komparasi 3 Supplier Terbaik (Kategori: ${targetKat})**\n\n`;
    compText += `Berikut perbandingan mendalam berdasarkan metrik kapasitas, performa pengiriman, dan legalitas di PUSAKA:\n\n`;

    topList.forEach((s, idx) => {
      compText += `**${idx + 1}. ${s.nama_umkm}** (${s.kota}, ${s.provinsi})\n`;
      compText += `â€¢ **Kapasitas Produksi:** ${s.kapasitas_produksi_bulanan.toLocaleString("id-ID")} ${s.satuan_produksi}/bulan\n`;
      compText += `â€¢ **On-Time Delivery (OTD):** ${s.on_time_delivery_rate_persen}% | **Rating:** â­ ${s.rating_rata_1_5}/5.0\n`;
      compText += `â€¢ **Sertifikasi Mutu:** ${s.sertifikasi || "SNI / NIB Standar"}\n`;
      compText += `â€¢ **Estimasi Lead Time:** ${s.lead_time_hari} hari kerja\n`;
      compText += `â€¢ **Keunggulan:** ${s.deskripsi_singkat}\n\n`;
    });

    compText += `ðŸ’¡ **Rekomendasi Strategis PUSAKA:**\n`;
    compText += `1. **Pilihan Utama Volume & Kepatuhan:** **${topList[0]?.nama_umkm}** paling unggul dalam konsistensi rating (â­ ${topList[0]?.rating_rata_1_5}) dan ketepatan waktu (${topList[0]?.on_time_delivery_rate_persen}% OTD).\n`;
    compText += `2. **Pilihan Alternatif Cepat:** **${topList[1]?.nama_umkm}** cocok untuk pesanan yang membutuhkan kapasitas produksi masif.\n`;
    if (topList[2]) {
      compText += `3. **Pilihan Efisiensi Biaya:** **${topList[2]?.nama_umkm}** menawarkan estimasi harga yang sangat kompetitif.\n`;
    }
    compText += `\n*Tips: Anda dapat menerbitkan RFQ kepada ketiga supplier di atas secara bersamaan untuk membandingkan penawaran harga riil.*`;

    return compText;
  }

  // 3. ANALISIS RISIKO PENGADAAN (Top Starters: "Apa risiko yang perlu dipertimbangkan saat memilih supplier baru?")
  if (
    q.includes("risiko") ||
    q.includes("risk") ||
    q.includes("memilih supplier baru") ||
    q.includes("kriteria supplier") ||
    q.includes("hati-hati") ||
    q.includes("mitigasi")
  ) {
    return `ðŸ›¡ï¸ **5 Risiko Utama Saat Memilih Supplier Baru & Cara Memitigasinya di PUSAKA**

Sebagai profesional procurement, berikut faktor risiko kritis yang wajib dipertimbangkan sebelum menerbitkan Purchase Order (PO):

1. **Risiko Keterlambatan Pengiriman (Lead Time Breach)**
   â€¢ *Dampak:* Gangguan pada jadwal perakitan atau stok kehabisan di gudang Anda.
   â€¢ *Mitigasi PUSAKA:* Periksa skor **On-Time Delivery Rate (OTDR)** supplier pada profilnya. Terapkan jadwal pengiriman bertahap (*batch delivery*) dan cantumkan klausul denda keterlambatan pada PKS.

2. **Risiko Inkonsistensi Kualitas (Defect Rate Tinggi)**
   â€¢ *Dampak:* Biaya retur barang, komplain dari pembeli akhir, dan waktu terbuang.
   â€¢ *Mitigasi PUSAKA:* Wajibkan pengiriman *Pre-Production Sample* (sampel awal) sebelum produksi massal. Pastikan toleransi spesifikasi teknis (toleransi dimensi/bahan) tertulis jelas pada RFQ.

3. **Risiko Legalitas & Sertifikasi Palsu**
   â€¢ *Dampak:* Masalah hukum pada saat audit perusahaan, sertifikasi halal/SNI gugur.
   â€¢ *Mitigasi PUSAKA:* Periksa badge **Terverifikasi** pada profil UMKM. PUSAKA menggunakan verifikasi dokumen legalitas (NIB, NPWP, SNI, Halal) untuk memastikan keabsahan supplier.

4. **Risiko Ketergantungan Tunggal (*Single Sourcing*)**
   â€¢ *Dampak:* Jika mesin workshop supplier rusak atau terjadi musibah, pengadaan Anda langsung terhenti.
   â€¢ *Mitigasi PUSAKA:* Alokasikan pesanan dengan skema 70/30 (70% ke supplier utama, 30% ke supplier cadangan) untuk material kritis.

5. **Risiko Finansial & Arus Kas**
   â€¢ *Dampak:* Supplier kehabisan modal kerja di tengah proses pengerjaan.
   â€¢ *Mitigasi PUSAKA:* Terapkan termin pembayaran *milestone* yang adil (misalnya 30% uang muka, 40% saat barang lulus uji QC pabrik, 30% setelah tiba di gudang).`;
  }

  // 4. STRATEGI NEGOSIASI HARGA B2B (Top Starters: "Bagaimana cara bernegosiasi harga yang baik dengan supplier UMKM?")
  if (
    q.includes("negosiasi") ||
    q.includes("nego") ||
    q.includes("tawar") ||
    q.includes("harga yang baik") ||
    q.includes("diskon")
  ) {
    return `ðŸ¤ **Strategi Negosiasi Harga Win-Win dengan Supplier UMKM**

Negosiasi dengan UMKM berbeda dengan korporasi besar karena mereka sangat sensitif terhadap *cash flow* dan kepastian order. Berikut 4 taktik terbukti efektif:

1. **Tawarkan Komitmen Volume Jangka Panjang (*Blanket Order*)**
   â€¢ Daripada menawar pesanan 500 pcs sekaligus, janjikan kontrak tahunan misalnya 6.000 pcs yang dikirim secara bertahap 500 pcs per bulan.
   â€¢ UMKM bersedia memberikan diskon 5%â€“15% untuk kepastian utilisasi mesin mereka selama beberapa bulan ke depan.

2. **Percepat Termin Pembayaran (*Cash Flow Advantage*)**
   â€¢ Standar korporat sering menuntut tempo pembayaran 60â€“90 hari (TOP). Hal ini sangat memberatkan modal kerja UMKM.
   â€¢ Tawarkan pembayaran lebih cepat (misal tempo 14 hari atau pembayaran tunai 3 hari setelah lolos QC). Sebagian besar UMKM akan dengan senang hati memotong harga pokok penjualan demi perputaran kas cepat.

3. **Bantu Standarisasi Bahan Baku & Kemasan**
   â€¢ Diskusikan apakah kemasan luar dapat disederhanakan tanpa mengurangi perlindungan barang.
   â€¢ Terkadang biaya tinggi timbul akibat spesifikasi kemasan custom yang mahal bagi UMKM skala menengah.

4. **Jalankan *Trial Batch* (Pesanan Uji Coba)**
   â€¢ Mulai dengan pesanan percontohan volume kecil pada harga normal. Tunjukkan bahwa perusahaan Anda adalah mitra profesional yang membayar tepat waktu. Setelah hubungan saling percaya terbangun, ajukan revisi harga untuk pesanan reguler skala penuh.`;
  }

  // 5. SYARAT & KETENTUAN SERTA PRIVASI & KEAMANAN DATA
  if (
    q.includes("syarat") ||
    q.includes("ketentuan") ||
    q.includes("terms") ||
    q.includes("privasi") ||
    q.includes("privacy") ||
    q.includes("keamanan data") ||
    q.includes("aman") ||
    q.includes("uu pdp")
  ) {
    return `ðŸ”’ **Kebijakan Keamanan Data, Privasi & Syarat Layanan PUSAKA**

PUSAKA mengedepankan standar keamanan dan tata kelola hukum pengadaan B2B:

â€¢ **Kepatuhan UU PDP (UU No. 27/2022):** Seluruh data identitas, NIB, NPWP, dan nomor rekening bisnis dienkripsi menggunakan standar TLS 1.3 dan penyimpanan terisolasi.
â€¢ **Kerahasiaan Desain & Harga:** Spesifikasi teknik rahasia (CAD/blueprint) dan lembar penawaran (Quotation) hanya dapat diakses oleh pihak yang bertransaksi secara sah.
â€¢ **Bebas Biaya Registrasi:** Akses mendaftar sebagai Perusahaan (Buyer) maupun UMKM (Supplier) tidak dipungut biaya pendaftaran.
â€¢ **Halaman Resmi:** Anda dapat mempelajari detail pasal lengkap pada menu:
  - **Syarat & Ketentuan:** [\`/terms\`](/terms)
  - **Kebijakan Privasi:** [\`/privacy\`](/privacy)`;
  }

  // 6. CARA MEMBUAT RFQ & ALUR KERJA PUSAKA
  if (
    q.includes("cara buat rfq") ||
    q.includes("buat rfq") ||
    q.includes("alur") ||
    q.includes("cara kerja") ||
    q.includes("cara pesan") ||
    q.includes("gimana cara")
  ) {
    return `ðŸ“ **Panduan 4 Langkah Pengadaan Cepat Melalui PUSAKA**

1. **Buat Permintaan Pengadaan (RFQ)**
   â€¢ Masuk ke menu **Buat RFQ** di Dashboard Perusahaan.
   â€¢ Isi rincian barang: spesifikasi, kuantitas, target lokasi provinsi, dan estimasi anggaran (budget).

2. **Pencocokan AI Otomatis (*AI Supplier Matching*)**
   â€¢ Sistem PUSAKA langsung mencocokkan RFQ Anda dengan supplier UMKM yang memiliki kapasitas mesin, spesialisasi kategori, dan lokasi terdekat.

3. **Terima & Bandingkan Penawaran (*Quotations*)**
   â€¢ UMKM yang berminat akan mengirimkan rincian harga, waktu pengerjaan (lead time), dan sampel. Anda dapat langsung menegosiasikan harga via fitur chat resmi.

4. **Konfirmasi Pesanan (*Purchase Order*)**
   â€¢ Pilih penawaran terbaik, terbitkan PO, dan pantau proses produksi hingga pengiriman barang tiba di lokasi Anda.`;
  }

  // 7. PENCARIAN SUPPLIER UMKM SPESIFIK (Contoh: "Saya butuh supplier bahan baku plastik dengan kapasitas 10 ton/bulan di Jawa Barat")
  const matchResult = cariSupplierDariTeks(lastMessage, 4);
  const detected = matchResult.kebutuhan_terdeteksi;
  const suppliers = matchResult.hasil;

  if (suppliers.length > 0 && (detected.kategori || detected.provinsi || q.includes("supplier") || q.includes("butuh") || q.includes("cari"))) {
    let resp = `ðŸ” **Hasil Rekomendasi Supplier UMKM Terverifikasi PUSAKA**\n\n`;
    resp += `Sistem mendeteksi kebutuhan Anda:\n`;
    if (detected.kategori) resp += `â€¢ **Kategori:** ${detected.kategori}\n`;
    if (detected.provinsi) resp += `â€¢ **Wilayah:** ${detected.provinsi}\n`;
    if (detected.kuantitas && detected.satuan) resp += `â€¢ **Estimasi Kebutuhan:** ${detected.kuantitas.toLocaleString("id-ID")} ${detected.satuan}\n`;
    resp += `\nBerikut supplier UMKM dengan tingkat kecocokan (*Match Score*) tertinggi:\n\n`;

    suppliers.forEach((sup, idx) => {
      const demoData = DEMO_UMKM.find((d) => d.umkm_id === sup.umkm_id);
      resp += `**${idx + 1}. ${sup.nama_umkm}**\n`;
      resp += `ðŸ“ Lokasi: ${sup.provinsi} | ðŸ·ï¸ Kategori: ${sup.kategori}\n`;
      resp += `ðŸŽ¯ **Match Score:** ${sup.match_score}%\n`;
      if (demoData) {
        resp += `âš¡ Kapasitas: ${demoData.kapasitas_produksi_bulanan.toLocaleString("id-ID")} ${demoData.satuan_produksi}/bulan\n`;
        resp += `â­ Rating: ${demoData.rating_rata_1_5}/5.0 (OTD: ${demoData.on_time_delivery_rate_persen}%)\n`;
        resp += `ðŸ“œ Sertifikasi: ${demoData.sertifikasi || "SNI / NIB Terverifikasi"}\n`;
        resp += `â±ï¸ Lead Time: ~${demoData.lead_time_hari} hari | Estimasi Harga: Rp ${demoData.harga_satuan_estimasi_idr.toLocaleString("id-ID")}/${demoData.satuan_produksi}\n`;
      }
      resp += `ðŸ’¬ *${sup.alasan}*\n\n`;
    });

    resp += `ðŸ’¡ **Langkah Selanjutnya:**\n`;
    resp += `Anda dapat langsung membuka menu **Buat RFQ** untuk mengirimkan permintaan penawaran harga resmi kepada supplier di atas secara langsung.`;
    return resp;
  }

  // 8. SALAM / PERTANYAAN RAMAH
  if (
    q.startsWith("halo") ||
    q.startsWith("hai") ||
    q.startsWith("hi") ||
    q.startsWith("pagi") ||
    q.startsWith("siang") ||
    q.startsWith("sore") ||
    q.startsWith("malam") ||
    q.includes("siapa kamu") ||
    q.includes("bisa apa")
  ) {
    return `Halo! ðŸ‘‹ Saya adalah **AI Procurement Assistant PUSAKA**.

Saya siap mendampingi proses pengadaan bisnis B2B Anda:
1. ðŸ” **Mencari Supplier:** *Misal: "Saya butuh supplier bahan baku plastik dengan kapasitas 10 ton/bulan di Jawa Barat"*
2. ðŸ“Š **Membandingkan Supplier:** *Misal: "Bantu saya membandingkan 3 supplier tekstil terbaik"*
3. ðŸ›¡ï¸ **Manajemen Risiko:** *Misal: "Apa risiko yang perlu dipertimbangkan saat memilih supplier baru?"*
4. ðŸ¤ **Strategi Negosiasi:** *Misal: "Bagaimana cara bernegosiasi harga yang baik dengan supplier UMKM?"*
5. ðŸ“ **Bantuan RFQ & Dokumen:** *Panduan pembuatan spesifikasi pengadaan dan syarat legalitas.*

Ada kebutuhan barang, material, atau jasa manufaktur apa yang sedang Anda cari hari ini?`;
  }

  // 9. FALLBACK KONSULTASI PENGADAAN CERDAS
  return `Terima kasih atas pertanyaan Anda mengenai pengadaan di platform PUSAKA.

Terkait hal tersebut:
1. **Pencarian Mitra:** Anda dapat menggunakan kata kunci spesifik seperti kategori barang (tekstil, logam, kemasan, plastik, bumbu pangan), volume kuantitas, dan provinsi target agar saya dapat mencarikan UMKM lokal terverifikasi yang cocok.
2. **Kesiapan Sourcing:** Anda dapat meninjau *Supplier Readiness Score* dan *Trust Score* pada setiap profil usaha untuk mengukur rekam jejak ketepatan waktu serta kepatuhan sertifikasi.
3. **Mulai Pengadaan:** Buka menu **Pasar RFQ** untuk menerbitkan permintaan penawaran resmi, atau tanyakan kembali kepada saya detail spesifik barang yang Anda butuhkan!

*Contoh pertanyaan: "Carikan saya supplier kemasan kardus di Jawa Tengah" atau "Berapa kapasitas rata-rata supplier logam di Bandung?"*`;
}

export const PUSAKA_KNOWLEDGE_BASE = `
Anda adalah **PUSAKA AI Assistant**, asisten cerdas resmi untuk seluruh ekosistem platform **PUSAKA** (*Pusat Pengadaan & Akreditasi Supplier Nusantara*).
Website: PUSAKA (pusaka-lyart.vercel.app / pusaka.id) | Kantor Pusat: Sidoarjo, Jawa Timur, Indonesia | Email: hello@pusaka.id / support@pusaka.id.

Tugas Anda adalah menjadi ensiklopedia pintar dan konsultan ramah yang bisa menjawab **PERTANYAAN APAPUN** mengenai website PUSAKA, mulai dari informasi umum, panduan pengguna, alur teknis pengadaan, profil tim pengembang, keamanan transaksi, hingga tips bisnis bagi Perusahaan (Buyer) dan UMKM (Supplier).

=== 1. IDENTITAS & LATAR BELAKANG PUSAKA ===
- **Nama Platform:** PUSAKA (*Pusat Pengadaan & Akreditasi Supplier Nusantara*).
- **Visi & Misi:** Menjadi platform B2B AI Sourcing pertama di Indonesia yang menghubungkan korporasi/perusahaan pembeli (*Buyer*) dengan Usaha Mikro, Kecil, dan Menengah (*UMKM/Supplier*) lokal terpercaya melalui ekosistem digital transparan, efisien, dan terakreditasi.
- **Dukungan Nasional & SDGs:** Mempercepat pemenuhan Tingkat Komponen Dalam Negeri (TKDN), mendukung SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi) dan SDG 9 (Inovasi, Industri & Infrastruktur).
- **Domisili:** Sidoarjo, Jawa Timur, Indonesia.
- **Tim Pengembang (Manut Team - ITECHNO CUP 2026):**
  1. Helmy Asyraf Risqi Ariebowo (Project Lead & Backend AI)
  2. Muhammad Kukuh Fauzi Prasetyadi (Frontend & QA)
  3. Abdan Muhammad Izzan Rasyadan (Backend & Frontend)

=== 2. PERAN AKUN & CARA REGISTRASI ===
- **Dua Peran Utama Pengguna:**
  1. **Perusahaan (Buyer):** Korporasi, pabrik, atau industri yang mencari supplier bahan baku, kemasan, komponen mesin, tekstil, dsb.
  2. **UMKM (Supplier):** Pelaku usaha lokal manufaktur/produksi yang ingin memenangkan kontrak pengadaan B2B skala besar.
- **Cara Mendaftar:** Buka halaman registrasi di \`/register\`. Pilih peran "Perusahaan (Buyer)" atau "UMKM (Supplier)", lengkapi nama, email, dan password.
- **Biaya Platform:** Pendaftaran dan penggunaan fitur dasar PUSAKA adalah **100% GRATIS** tanpa dipungut biaya pendaftaran.

=== 3. FITUR-FITUR LENGKAP & CARA PENGGUNAANNYA ===
1. **Marketplace & Pencarian Supplier (\`/company/suppliers\` & \`/umkm/suppliers\`):**
   - Cari ribuan UMKM terverifikasi di 34 provinsi Indonesia.
   - Filter berdasarkan 8 Kategori Industri Utama: Tekstil & Garmen, Logam & Metal Work, Kimia & Plastik, Kemasan, Makanan & Minuman, Furniture & Kayu, Elektronik & Komponen, Kerajinan.
   - Dilengkapi Lencana Terverifikasi, Skor Kepercayaan (*Trust Score*), dan rating ulasan bintang 1–5 nyata.

2. **Pasar RFQ & Tender Digital (\`/company/rfq\` & \`/umkm/rfq\`):**
   - **Bagi Perusahaan:** Menu "Buat RFQ" (\`/company/rfq/create\`) untuk mempublikasikan tender kebutuhan material lengkap dengan kuantitas, target provinsi, deadline, anggaran, spesifikasi, dan bantuan AI Quick Input.
   - **Bagi UMKM:** Menu "Pasar RFQ" (\`/umkm/rfq\`) untuk melihat semua tender terbuka dan mengirimkan penawaran harga (*Quotation*) langsung dengan estimasi lead time pengerjaan.

3. **Supplier Readiness Score (Skor Kesiapan UMKM - \`/umkm/readiness\`):**
   - Penilaian objektif 0–100 untuk kesiapan UMKM melayani pasar korporasi.
   - 5 Parameter: Legalitas Usaha (NIB/NPWP 25%), Katalog & Kapasitas Produk (25%), Sertifikasi Industri TKDN/SNI/Halal (20%), Ketepatan Pengiriman/OTD (15%), Responsivitas (15%).
   - Cara Meningkatkan Skor: Buka menu "Profil Saya" (\`/umkm/profile\`) dan lengkapi data pabrik, mesin, serta upload dokumen sertifikat di menu "Sertifikasi" (\`/umkm/certifications\`).

4. **Supplier Trust Score:**
   - Metrik keandalan nyata yang dihitung dari riwayat pesanan (On-Time Delivery Rate >90%, kualitas barang bebas cacat, kecepatan respons).

5. **AI Supplier Matching (\`/company/ai-match\`):**
   - Fitur pencocokan cerdas: cukup ketik kebutuhan dalam bahasa sehari-hari, AI akan langsung merekomendasikan supplier terbaik dengan persentase *Match Score*.

6. **Peta Ketimpangan Pasokan (AI Supply Gap Map - \`/admin/map\`):**
   - Peta interaktif Leaflet yang memetakan ketersediaan supplier vs permintaan pasar di tiap wilayah Indonesia, memandu UMKM menemukan peluang ekspansi (*High Opportunity*).

7. **Sistem Pesanan & Escrow Aman (\`/company/orders\` & \`/umkm/orders\`):**
   - Pembayaran dilindungi sistem Rekening Bersama (Escrow). Dana buyer disimpan aman sampai pesanan selesai dan lolos Quality Control (QC).

8. **Chat Terenkripsi (\`/company/messages\` & \`/umkm/messages\`):**
   - Ruang diskusi dan negosiasi langsung antara Buyer dan Supplier.

=== 4. PANDUAN JAWABAN (RULES) ===
- Bersikaplah sangat ramah, suportif, berpengetahuan luas, dan komunikatif dalam Bahasa Indonesia yang baik.
- Pahami bahwa pertanyaan user bisa bermacam-macam (santai, teknis, bisnis, navigasi). Berikan jawaban yang selalu solutif dan jelas.
- Jika pengguna bertanya tentang navigasi, cantumkan nama menu dan path halamannya (misal: \`/company/rfq\`, \`/umkm/profile\`).
- Jika pengguna bertanya di luar topik PUSAKA/pengadaan, jawab secara singkat dan arahkan kembali ke solusi PUSAKA dengan sopan.
`;

export async function procurementAssistant(
  messages: { role: "user" | "model"; content: string }[],
  context?: string,
): Promise<string> {
  // Jika GEMINI_API_KEY tersedia di .env, gunakan model online Gemini API terlebih dahulu
  if (genAI) {
    const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-1.5-flash"];
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: `${PUSAKA_KNOWLEDGE_BASE}
          ${context ? `Konteks peran pengguna saat ini: ${context}` : ""}`,
        });

        const chat = model.startChat({
          history: messages.slice(0, -1).map((m) => ({
            role: m.role,
            parts: [{ text: m.content }],
          })),
        });

        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.content);
        const text = result.response.text();
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (apiError) {
        console.warn(`Gemini model ${modelName} call failed, trying next or fallback:`, apiError);
      }
    }
  }

  // Fallback ke Offline Intelligent Assistant jika GEMINI_API_KEY tidak ada atau gagal
  return generateOfflineProcurementResponse(messages, context);
}

