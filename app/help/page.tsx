import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, HelpCircle, MessageSquare, Phone, Mail, FileText, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Pusat Bantuan – PUSAKA",
  description: "Pusat bantuan, FAQ, dan panduan lengkap penggunaan platform B2B PUSAKA.",
};

const FAQS = [
  { q: "Apa itu PUSAKA?", a: "PUSAKA (Pusat Pengadaan & Akreditasi Supplier Nusantara) adalah platform AI-powered B2B sourcing yang menghubungkan korporasi (buyer) dengan mitra UMKM manufaktur & supplier terpercaya di seluruh Indonesia." },
  { q: "Bagaimana cara kerja AI Supplier Matching?", a: "Algoritma AI PUSAKA secara otomatis menganalisis dokumen spesifikasi RFQ yang Anda unggah, lalu mencocokkannya dengan kapabilitas produksi, sertifikasi, lokasi, dan skor kesiapan mitra UMKM terakreditasi." },
  { q: "Apakah akun UMKM dikenakan biaya pendaftaran?", a: "Pendaftaran awal dan pembuatan profil UMKM 100% Gratis. UMKM dapat mengunggah produk, sertifikasi, dan merespon RFQ dari perusahaan tanpa biaya pendaftaran." },
  { q: "Bagaimana proses verifikasi & akreditasi supplier?", a: "Tim verifikator PUSAKA memeriksa keabsahan dokumen legalitas (NPWP, NIB, SIUP), sertifikat mutu produk (Halal, SNI, ISO), serta histori pengiriman sebelum memberikan status Terverifikasi Resmi." },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            Pusat Bantuan &amp; FAQ
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ada yang Bisa Kami Bantu?
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Temukan jawaban atas pertanyaan umum seputar pengadaan B2B, penawaran RFQ, dan verifikasi akun.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 lg:py-20 space-y-12">
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Bantuan via Email</h4>
            <p className="text-xs text-slate-500">Tim dukungan kami siap melayani pertanyaan teknis &amp; akun 24/7.</p>
            <p className="text-xs font-semibold text-blue-600 pt-1">support@pusaka.id</p>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Layanan Pelanggan (WhatsApp)</h4>
            <p className="text-xs text-slate-500">Senin – Jumat, pukul 08.00 – 17.00 WIB</p>
            <p className="text-xs font-semibold text-emerald-600 pt-1">+62 812-3456-7890</p>
          </Card>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Pertanyaan Sering Diajukan (FAQ)</h2>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <Card key={i} className="border-0 shadow-sm bg-white rounded-2xl p-6 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{f.q}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
