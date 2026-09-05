import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Code, BookOpen, Terminal, Key, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Dokumentasi API & Panduan Pengadaan – PUSAKA",
  description: "Dokumentasi teknis REST API, webhook, dan panduan integrasi sistem pengadaan PUSAKA.",
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            Dokumentasi Teknis
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Dokumentasi REST API &amp; Panduan Integrasi PUSAKA
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Panduan teknis bagi tim pengembang korporasi dan mitra ERP untuk mengintegrasikan alur pengadaan &amp; RFQ otomatis.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 lg:py-20 space-y-10">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-3">
            <Terminal className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">REST API Reference</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Endpoint publik untuk manajemen RFQ, pencarian supplier, dan data akreditasi.</p>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-3">
            <Key className="w-8 h-8 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Otentikasi &amp; API Key</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Keamanan akses API menggunakan JWT &amp; Bearer Tokens bertingkat.</p>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-3">
            <BookOpen className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base">Panduan Pengadaan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Praktik terbaik membuat RFQ berkualitas dan mengevaluasi penawaran UMKM.</p>
          </Card>
        </div>

        {/* Sample API Code Block */}
        <Card className="border-0 shadow-md rounded-2xl bg-slate-900 text-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-emerald-400 font-semibold">GET /api/suppliers?search=tekstil</span>
            <Badge className="bg-slate-800 text-slate-300 text-[10px]">JSON Response</Badge>
          </div>
          <pre className="font-mono text-xs overflow-x-auto text-emerald-300/90 leading-relaxed">
{`{
  "suppliers": [
    {
      "id": "cm123xyz",
      "businessName": "CV Sumber Tekstil Bandung",
      "verificationStatus": "APPROVED",
      "readinessScore": 92,
      "trustScore": { "overall": 94 }
    }
  ]
}`}
          </pre>
        </Card>
      </section>

      <FooterSection />
    </main>
  );
}
