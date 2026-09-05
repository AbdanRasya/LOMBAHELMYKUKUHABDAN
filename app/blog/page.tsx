import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight, TrendingUp, BookOpen, Sparkles } from "lucide-react";

export const metadata = {
  title: "Blog & Insight B2B – PUSAKA",
  description: "Artikel, tren pengadaan B2B, strategi optimalisasi rantai pasok, dan berita UMKM Indonesia.",
};

const ARTICLES = [
  {
    id: 1,
    title: "Strategi Efisiensi Pengadaan B2B Korporasi Menggunakan AI Matching 2026",
    excerpt: "Bagaimana integrasi teknologi kecerdasan buatan mampu memangkas waktu pencarian supplier hingga 70% dan meningkatkan akurasi spesifikasi barang.",
    category: "Teknologi B2B",
    author: "Tim Riset PUSAKA",
    date: "1 September 2026",
    image: "/supplier-textile.jpg",
  },
  {
    id: 2,
    title: "Panduan Sertifikasi Halal & ISO Bagi UMKM Manufaktur Naik Kelas",
    excerpt: "Langkah mudah melengkapi sertifikasi resmi agar produk UMKM Anda dapat dengan cepat diakreditasi oleh pembeli skala industri.",
    category: "Panduan UMKM",
    author: "Spesialis Akreditasi",
    date: "28 Agustus 2026",
    image: "/supplier-packaging.jpg",
  },
  {
    id: 3,
    title: "Analisis Supply Gap Industri Bahan Baku Olahan Organik di Jawa Timur",
    excerpt: "Tinjauan mendalam mengenai tingginya permintaan rempah & herbal olahan yang belum terpenuhi sepenuhnya oleh kapasitas produksi lokal.",
    category: "Tren Pasar",
    author: "Analitis Riset Pasar",
    date: "20 Agustus 2026",
    image: "/supplier-agro.jpg",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            PUSAKA Blog &amp; Insights
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Berita, Tren Pengadaan &amp; Edukasi Industri B2B
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Dapatkan wawasan terkini seputar optimalisasi rantai pasok, akreditasi supplier, dan strategi pertumbuhan bisnis UMKM.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((a) => (
            <Card key={a.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white flex flex-col">
              <div className="h-44 relative bg-slate-100 overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                <Badge className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-md text-xs">
                  {a.category}
                </Badge>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {a.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {a.author}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2">{a.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{a.excerpt}</p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    Baca Artikel Lengkap <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
