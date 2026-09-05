import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Download, Newspaper, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Press Kit & Rilis Media – PUSAKA",
  description: "Informasi media, logo resmi, rilis pers, dan kontak publik PUSAKA.",
};

export default function PressPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            Press Kit &amp; Media
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Pusat Informasi &amp; Rilis Pers PUSAKA
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Unduh aset branding resmi, logo resolusi tinggi, dan ikuti kabar perkembangan platform PUSAKA.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 lg:py-20 space-y-10">
        {/* Brand Assets Card */}
        <Card className="border-0 shadow-md rounded-2xl bg-white p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border border-blue-200 bg-white p-1 shadow-md shrink-0">
              <img src="/pusaka-icon.png" alt="PUSAKA Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Aset Brand Resmi PUSAKA</h3>
              <p className="text-xs text-slate-500 mt-1">Logo PNG, SVG, Vector EPS, &amp; Pedoman Penggunaan Brand</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a href="/pusaka-logo.png" download className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" /> Unduh Logo Utama (PNG)
            </a>
            <a href="/pusaka-icon.png" download className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" /> Unduh Icon Mark (PNG)
            </a>
          </div>
        </Card>

        {/* Contact Media */}
        <Card className="border-0 shadow-sm rounded-2xl bg-emerald-50 border-emerald-100 p-8 space-y-3">
          <h4 className="font-bold text-emerald-950 text-lg">Kontak Hubungan Media &amp; Hubungan Masyarakat</h4>
          <p className="text-xs text-emerald-800 leading-relaxed max-w-xl">
            Untuk wawancara media, tanggapan pers, atau liputan khusus seputar digitalisasi pengadaan B2B Indonesia, silakan hubungi tim PR kami.
          </p>
          <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <Mail className="w-4 h-4 text-emerald-600" /> press@pusaka.id
          </div>
        </Card>
      </section>

      <FooterSection />
    </main>
  );
}
