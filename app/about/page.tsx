import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Target, Users, Zap, Building2, Award, Heart, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Tentang Kami – PUSAKA (Pusat Pengadaan & Akreditasi Supplier Nusantara)",
  description: "Mengenal PUSAKA, platform B2B AI-powered pertama di Indonesia yang menghubungkan korporasi dengan UMKM lokal terpercaya.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            Tentang PUSAKA
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Memperkuat Rantai Pasok Nusantara Melalui AI &amp; Akreditasi Transparan
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            PUSAKA (Pusat Pengadaan &amp; Akreditasi Supplier Nusantara) didirikan untuk menjembatani korporasi skala besar dengan puluhan ribu UMKM manufaktur &amp; penyedia barang lokal di seluruh Indonesia.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 lg:py-24 space-y-16">
        {/* Visi Misi */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-md rounded-2xl bg-white p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Visi Kami</h3>
            <p className="text-slate-600 leading-relaxed">
              Menjadi ekosistem B2B terdepan dan terpercaya di Asia Tenggara yang mendorong kedaulatan industri dalam negeri melalui digitalisasi rantai pasok UMKM Indonesia.
            </p>
          </Card>

          <Card className="border-0 shadow-md rounded-2xl bg-white p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Misi Kami</h3>
            <p className="text-slate-600 leading-relaxed">
              Menghadirkan teknologi AI cerdas untuk mempercepat matching pengadaan, memberikan akreditasi transparan bagi UMKM, serta memangkas biaya operasional procurement korporasi.
            </p>
          </Card>
        </div>

        {/* Nilai Utama */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">Nilai &amp; Pilar Utama PUSAKA</h2>
            <p className="text-slate-500 mt-2">Prinsip dasar yang mengarahkan setiap inovasi dan layanan di PUSAKA</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Akreditasi & Kepercayaan", desc: "Verifikasi legalitas NPWP, NIB, sertifikasi industri (Halal, SNI, ISO), dan histori performa pengadaan.", icon: Award, color: "text-amber-500 bg-amber-50" },
              { title: "Kecerdasan Buatan (AI)", desc: "Algoritma AI Matching yang secara presisi memetakan spesifikasi teknis RFQ dengan kapabilitas produksi UMKM.", icon: Zap, color: "text-blue-600 bg-blue-50" },
              { title: "Dampak Ekonomi Lokal", desc: "Mendorong tingkat komponen dalam negeri (TKDN) dan membuka pasar korporasi bagi UMKM Nusantara.", icon: Heart, color: "text-emerald-600 bg-emerald-50" },
            ].map((n) => (
              <Card key={n.title} className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-3">
                <div className={`w-10 h-10 rounded-xl ${n.color} flex items-center justify-center`}>
                  <n.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 lg:p-12 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: "2,400+", lbl: "UMKM Terakreditasi" },
              { val: "850+", lbl: "Korporasi & Buyer" },
              { val: "94.8%", lbl: "Akurasi Match AI" },
              { val: "Rp 120B+", lbl: "Nilai Pengadaan" },
            ].map((s) => (
              <div key={s.lbl} className="space-y-1">
                <p className="text-3xl lg:text-4xl font-extrabold text-emerald-400">{s.val}</p>
                <p className="text-xs text-slate-400 font-medium">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
