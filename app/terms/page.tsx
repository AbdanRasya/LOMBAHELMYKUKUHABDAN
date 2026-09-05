import Link from "next/link";
import { Metadata } from "next";
import { 
  FileText, 
  Shield, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Scale, 
  Building2, 
  Factory, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | PUSAKA",
  description: "Syarat dan ketentuan penggunaan platform B2B PUSAKA (Pusat Pengadaan & Akreditasi Supplier Nusantara) untuk Perusahaan dan UMKM di Indonesia.",
};

export default function TermsPage() {
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
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Dokumen Legalitas
                </span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Syarat & Ketentuan Penggunaan
            </h1>
            <p className="text-slate-500 mt-3 text-base sm:text-lg leading-relaxed">
              Selamat datang di <strong>PUSAKA</strong>. Dokumen ini mengatur hak, kewajiban, dan tanggung jawab Anda sebagai pengguna platform B2B AI Sourcing kami.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Terakhir Diperbarui:</span> 5 September 2026
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Versi:</span> 2.1 (Sesuai Regulasi ITE & Perlindungan Konsumen RI)
              </div>
            </div>
          </div>

          {/* Quick Summary Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-5 mb-10 text-sm text-emerald-950 flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-900">Ringkasan Utama untuk Pengguna</p>
              <p className="text-emerald-800 leading-relaxed">
                Dengan mendaftar sebagai <strong>Perusahaan (Buyer)</strong> atau <strong>UMKM (Supplier)</strong>, Anda menyetujui integritas data yang diunggah, mematuhi etika pengadaan B2B yang adil, serta memberi hak terbatas bagi sistem AI PUSAKA untuk memproses profil dan dokumen demi keperluan pencocokan bisnis.
              </p>
            </div>
          </div>

          {/* Main Content Articles */}
          <div className="space-y-8 text-slate-700 leading-relaxed bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-sm">
            
            {/* Bagian 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">1. Ketentuan Umum & Penerimaan Syarat</h2>
              </div>
              <p className="text-sm sm:text-base">
                1.1. Layanan ini diselenggarakan oleh <strong>PUSAKA Indonesia</strong> (&ldquo;Kami&rdquo;), sebuah platform digital yang mempertemukan badan usaha perusahaan korporasi/pembeli (&ldquo;Buyer&rdquo;) dengan pelaku Usaha Mikro, Kecil, dan Menengah (&ldquo;UMKM/Supplier&rdquo;).
              </p>
              <p className="text-sm sm:text-base">
                1.2. Dengan mengakses, membuat akun, atau menggunakan layanan PUSAKA, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu klausul di dalamnya, mohon untuk tidak melanjutkan pendaftaran.
              </p>
              <p className="text-sm sm:text-base">
                1.3. Jika Anda bertindak atas nama badan hukum, perusahaan, atau persekutuan perdata (PT, CV, UD, Koperasi), Anda menjamin bahwa Anda memiliki wewenang hukum yang sah untuk mewakili dan mengikat badan usaha tersebut.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">2. Pendaftaran Akun & Verifikasi Identitas</h2>
              </div>
              <p className="text-sm sm:text-base">
                2.1. <strong>Tipe Akun:</strong> Pendaftar wajib memilih peran yang sesuai:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm sm:text-base text-slate-600">
                <li><strong className="text-slate-800">Perusahaan (Buyer):</strong> Badan usaha yang membutuhkan supplier untuk proyek pengadaan bahan baku, barang modal, atau jasa manufaktur.</li>
                <li><strong className="text-slate-800">UMKM (Supplier):</strong> Pelaku usaha lokal yang menyediakan kapasitas produksi, jasa manufaktur, atau produk siap suplai.</li>
              </ul>
              <p className="text-sm sm:text-base">
                2.2. <strong>Kebenaran Data:</strong> Anda berkewajiban memberikan informasi yang akurat, mutakhir, dan lengkap mengenai nama penanggung jawab, email resmi, nomor kontak, NPWP, NIB (Nomor Induk Berusaha), serta alamat workshop/pabrik yang valid.
              </p>
              <p className="text-sm sm:text-base">
                2.3. <strong>Keamanan Kredensial:</strong> Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi (password) akun Anda. Segala bentuk aktivitas transaksi yang dilakukan melalui akun Anda dianggap sebagai tindakan sah dari pemilik akun.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Factory className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">3. Permintaan Penawaran (RFQ) & Pengajuan Penawaran (Quotation)</h2>
              </div>
              <p className="text-sm sm:text-base">
                3.1. <strong>Penerbitan RFQ:</strong> Perusahaan berhak membuat permintaan penawaran (Request for Quotation) dengan mencantumkan rincian spesifikasi barang, kuantitas, estimasi anggaran (budget), serta tenggat waktu (deadline) yang jelas dan beritikad baik.
              </p>
              <p className="text-sm sm:text-base">
                3.2. <strong>Penawaran UMKM:</strong> UMKM yang mengajukan harga penawaran menyatakan kesanggupan produksi, kapasitas mesin, dan komitmen waktu pengiriman (lead time) sebagaimana dicantumkan dalam lembar penawaran.
              </p>
              <p className="text-sm sm:text-base">
                3.3. <strong>Komunikasi Beretika:</strong> Seluruh fitur interaksi, negosiasi, dan perpesanan dalam platform wajib dijalankan secara profesional, bebas dari konten ujaran kebencian, penipuan, atau persekongkolan tender yang melanggar hukum persaingan usaha sehat di Indonesia (UU No. 5/1999).
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">4. Fitur AI Matching & Skor Kesiapan (Readiness Score)</h2>
              </div>
              <p className="text-sm sm:text-base">
                4.1. PUSAKA memanfaatkan model kecerdasan buatan (Google Gemini AI) untuk membantu menghitung <em>Supplier Readiness Score</em>, rekomendasi kesesuaian RFQ, serta pembacaan dokumen sertifikasi (OCR).
              </p>
              <p className="text-sm sm:text-base">
                4.2. Rekomendasi AI disediakan sebagai alat bantu penunjang keputusan (decision support system). Keputusan akhir penunjukan kontrak pengadaan, kesepakatan harga, dan penerimaan hasil pekerjaan sepenuhnya berada di bawah pertimbangan masing-masing pihak yang bertransaksi.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 5 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">5. Transaksi, Pembayaran & Tanggung Jawab Kontrak</h2>
              </div>
              <p className="text-sm sm:text-base">
                5.1. PUSAKA bertindak sebagai platform penghubung (facilitator & marketplace). Perjanjian jual beli, perjanjian kerja sama (PKS), purchase order (PO), serta ketentuan termin pembayaran disepakati secara langsung antara Buyer dan Supplier.
              </p>
              <p className="text-sm sm:text-base">
                5.2. Para pihak wajib mematuhi standar mutu, pengiriman tepat waktu, serta penyelesaian garansi produk sesuai dengan spesifikasi yang telah disepakati dalam penawaran.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 6 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Lock className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">6. Kerahasiaan Informasi Bisnis & Hak Cipta</h2>
              </div>
              <p className="text-sm sm:text-base">
                6.1. Segala desain teknis, rancangan produk (CAD/blueprint), spesifikasi manufaktur rahasia, serta informasi penawaran harga yang diunggah dalam RFQ direct bersifat rahasia dan tidak diperkenankan untuk disebarluaskan kepada pihak ketiga tanpa persetujuan tertulis.
              </p>
              <p className="text-sm sm:text-base">
                6.2. Hak cipta atas logo, foto workshop, dan merek dagang masing-masing UMKM dan Perusahaan tetap menjadi milik sah dari entitas yang bersangkutan.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 7 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold">7. Larangan & Penangguhan Akun</h2>
              </div>
              <p className="text-sm sm:text-base">
                PUSAKA berhak melakukan penangguhan sementara atau penutupan permanen akun pengguna apabila ditemukan:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm sm:text-base text-slate-600">
                <li>Pemalsuan dokumen legalitas usaha (NIB, NPWP, sertifikat SNI, Halal, atau BPOM palsu).</li>
                <li>Penyalahgunaan platform untuk spamming penawaran tidak bertanggung jawab.</li>
                <li>Upaya peretasan, manipulasi skor kesiapan AI, atau gangguan pada server dan sistem basis data.</li>
                <li>Kegagalan berulang dalam memenuhi komitmen pesanan yang telah dikonfirmasi tanpa alasan force majeure yang sah.</li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* Bagian 8 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">8. Kontak & Pertanyaan</h2>
              </div>
              <p className="text-sm sm:text-base">
                Apabila Anda memiliki pertanyaan, keluhan, atau memerlukan klarifikasi terkait Syarat dan Ketentuan ini, tim legalitas dan dukungan kami dapat dihubungi melalui:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-1">
                <p><strong>Email Tim Legal:</strong> legal@pusaka.id</p>
                <p><strong>Pusat Bantuan:</strong> hello@pusaka.id</p>
                <p><strong>Alamat Operasional:</strong> Wisma PUSAKA Nusantara Lt. 4, Sidoarjo, Jawa Timur, Indonesia</p>
              </div>
            </section>

          </div>

          {/* Action Bar */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Dengan melanjutkan pendaftaran, Anda menyetujui seluruh ketentuan di atas.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/privacy" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-xl">
                  Lihat Kebijakan Privasi
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                  Lanjut Mendaftar
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

