import Link from "next/link";
import { Metadata } from "next";
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Database, 
  Cpu, 
  Eye, 
  UserCheck, 
  Cookie, 
  FileCheck, 
  HelpCircle,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | PUSAKA",
  description: "Kebijakan privasi dan perlindungan data pribadi pengguna platform B2B PUSAKA sesuai UU Perlindungan Data Pribadi (UU PDP).",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back button */}
          <div className="mb-8">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Halaman Pendaftaran
            </Link>
          </div>

          {/* Header Banner */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-sm mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Perlindungan Data
                </span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Kebijakan Privasi PUSAKA
            </h1>
            <p className="text-slate-500 mt-3 text-base sm:text-lg leading-relaxed">
              Komitmen kami dalam melindungi privasi, data perusahaan, serta kerahasiaan dokumen usaha Anda sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022).
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Terakhir Diperbarui:</span> 5 September 2026
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Kepatuhan Regulasi:</span> UU PDP No. 27 Tahun 2022 & Standar Keamanan ISO/IEC 27001
              </div>
            </div>
          </div>

          {/* Quick Summary Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-5 mb-10 text-sm text-emerald-950 flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-900">Jaminan Keamanan & Kerahasiaan Data Bisnis</p>
              <p className="text-emerald-800 leading-relaxed">
                PUSAKA <strong>tidak pernah menjual</strong> data pribadi, data RFQ rahasia, maupun dokumen sertifikasi Anda kepada pihak pengiklan luar. Data Anda dienkripsi dan hanya diproses untuk keperluan pencocokan B2B, verifikasi keaslian profil usaha, dan transaksi resmi di platform.
              </p>
            </div>
          </div>

          {/* Main Content Articles */}
          <div className="space-y-8 text-slate-700 leading-relaxed bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-sm">
            
            {/* Bagian 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">1. Pendahuluan & Prinsip Privasi</h2>
              </div>
              <p className="text-sm sm:text-base">
                Kebijakan Privasi ini menjelaskan bagaimana <strong>PUSAKA Indonesia</strong> (&ldquo;Kami&rdquo;) mengumpulkan, menyimpan, mengolah, dan melindungi informasi pribadi dan data usaha saat Anda menggunakan platform kami. Kami memegang teguh prinsip transparansi, batasan tujuan pemrosesan, akurasi data, serta keamanan berstandar industri tinggi.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Database className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">2. Data yang Kami Kumpulkan</h2>
              </div>
              <p className="text-sm sm:text-base">
                Dalam rangka menyediakan layanan pengadaan B2B yang optimal, kami mengumpulkan kategori data berikut:
              </p>
              <div className="space-y-3 pl-1 text-sm sm:text-base">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-800">a. Data Akun & Identitas Pengguna</p>
                  <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                    Nama lengkap narahubung/PIC, alamat email bisnis, nomor telepon/WhatsApp, dan kata sandi terenkripsi (salted hash).
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-800">b. Profil Usaha (Perusahaan & UMKM)</p>
                  <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                    Nama badan usaha, sektor industri, alamat kantor/pabrik, koordinat geografis untuk peta persebaran, jumlah tenaga kerja, kapasitas produksi bulanan, dan portofolio proyek terdahulu.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-800">c. Dokumen Legalitas & Sertifikasi Mutu</p>
                  <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                    Berkas NIB, NPWP perusahaan, sertifikasi SNI, Halal, ISO, serta foto fasilitas mesin pabrik untuk keperluan perhitungan <em>Supplier Readiness Score</em>.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-800">d. Data Aktivitas Pengadaan (RFQ & Penawaran)</p>
                  <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                    Rincian spesifikasi pengadaan, volume barang, riwayat penawaran harga, pesan negosiasi, dan status penyelesaian pesanan.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">3. Penggunaan Data & Teknologi Kecerdasan Buatan (AI)</h2>
              </div>
              <p className="text-sm sm:text-base">
                Data yang dikumpulkan dipergunakan semata-mata untuk tujuan yang sah:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm sm:text-base text-slate-600">
                <li><strong>Algoritma AI Supplier Matching:</strong> Menganalisis parameter kebutuhan RFQ Perusahaan dan mencocokkannya dengan kapabilitas UMKM yang paling relevan.</li>
                <li><strong>AI Document Reader (OCR):</strong> Mengekstraksi nomor sertifikat, tanggal berlaku, dan status legalitas dokumen UMKM secara otomatis tanpa intervensi pihak ketiga yang tidak berwenang.</li>
                <li><strong>Pemetaan Supply Gap Map:</strong> Mengagregasi data pasokan dan permintaan antar provinsi untuk membantu visualisasi peluang bisnis UMKM daerah.</li>
                <li><strong>Notifikasi & Keamanan:</strong> Mengirimkan pemberitahuan status penawaran, verifikasi akun email, dan pencegahan tindakan mencurigakan.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Eye className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">4. Pembagian Informasi & Visibilitas Data</h2>
              </div>
              <p className="text-sm sm:text-base">
                4.1. <strong>Profil Publik Marketplace:</strong> Nama usaha UMKM, kategori produk, lokasi kota/provinsi, badge sertifikasi terverifikasi, dan skor kesiapan ditampilkan secara transparan kepada calon pembeli korporasi.
              </p>
              <p className="text-sm sm:text-base">
                4.2. <strong>Data Privat:</strong> Rincian NPWP pribadi, laporan keuangan internal, dan percakapan negosiasi RFQ hanya dapat diakses oleh pihak yang terlibat langsung dalam transaksi dan admin verifikator PUSAKA.
              </p>
              <p className="text-sm sm:text-base">
                4.3. <strong>Pihak Penegak Hukum:</strong> Kami hanya akan membuka data jika diwajibkan oleh putusan pengadilan atau peraturan perundang-undangan Republik Indonesia yang sah.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 5 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Lock className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">5. Keamanan Penyimpanan Data</h2>
              </div>
              <p className="text-sm sm:text-base">
                Kami menerapkan standar keamanan teknis dan organisasional berlapis:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm sm:text-base text-slate-600">
                <li>Enkripsi data saat transit menggunakan TLS 1.3 dan HTTPS modern.</li>
                <li>Enkripsi kata sandi menggunakan algoritma <code>bcrypt</code> dengan salt factor tinggi.</li>
                <li>Proteksi header keamanan (CSP, HSTS, X-Frame-Options DENY) untuk mencegah serangan XSS, Clickjacking, dan injeksi script.</li>
                <li>Penyimpanan database terisolasi dengan akses terbatas berbasis peran (Role-Based Access Control).</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 6 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">6. Hak-Hak Anda sebagai Pemilik Data (UU PDP)</h2>
              </div>
              <p className="text-sm sm:text-base">
                Sesuai hak yang dijamin oleh UU PDP No. 27/2022, Anda berhak:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm sm:text-base text-slate-600">
                <li>Mengakses dan memperbarui informasi profil usaha Anda kapan saja melalui dashboard.</li>
                <li>Menarik kembali persetujuan pemrosesan data tertentu dengan konsekuensi pembatasan fitur tertentu.</li>
                <li>Meminta penghapusan akun dan pemusnahan dokumen legalitas dari server kami (&ldquo;Right to be Forgotten&rdquo;) sepanjang tidak bertentangan dengan kewajiban arsip transaksi legal/perpajakan.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 7 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Cookie className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">7. Penggunaan Cookie & Sesi</h2>
              </div>
              <p className="text-sm sm:text-base">
                PUSAKA menggunakan cookie sesi (HTTP-only JWT cookies) semata-mata untuk menjaga sesi login aktif dan token keamanan CSRF. Kami tidak menggunakan cookie pelacak pihak ketiga (third-party tracking cookies) untuk tujuan periklanan komersial.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 8 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">8. Kontak Petugas Perlindungan Data (DPO)</h2>
              </div>
              <p className="text-sm sm:text-base">
                Apabila Anda memiliki pertanyaan, permohonan eksekusi hak data, atau kekhawatiran terkait perlindungan data pribadi di PUSAKA, silakan hubungi tim Data Protection Officer (DPO) kami:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-1">
                <p><strong>Email Tim Privasi:</strong> privacy@pusaka.id</p>
                <p><strong>Dukungan Teknis:</strong> support@pusaka.id</p>
                <p><strong>Layanan Pengaduan:</strong> Wisma PUSAKA Nusantara Lt. 4, Sidoarjo, Jawa Timur, Indonesia</p>
              </div>
            </section>

          </div>

          {/* Action Bar */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Data usaha Anda aman dan terlindungi bersama ekosistem PUSAKA.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/terms" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-xl">
                  Lihat Syarat & Ketentuan
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                  Kembali Mendaftar
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}

