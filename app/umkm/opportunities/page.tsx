"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Lightbulb, 
  ArrowUpRight, 
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  Building2,
  Calendar,
  Loader2,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock AI opportunity data
const trendingProducts = [
  { name: "Dus Karton Box Corrugated Custom", category: "Kemasan & Percetakan", growth: "+45%", trend: "up", demandLevel: "Tinggi", urgency: "HIGH" },
  { name: "Seragam PDL Bahan Drill Premium", category: "Tekstil & Garmen", growth: "+32%", trend: "up", demandLevel: "Sedang-Tinggi", urgency: "MEDIUM" },
  { name: "Baut & Mur Baja Karbon Grade 8.8", category: "Manufaktur & Logam", growth: "+28%", trend: "up", demandLevel: "Tinggi", urgency: "HIGH" },
  { name: "Minyak Kelapa Murni (VCO)", category: "Pertanian & Pangan", growth: "+18%", trend: "up", demandLevel: "Sedang", urgency: "LOW" },
];

const underservedRegions = [
  { province: "Kalimantan Timur (IKN)", city: "Balikpapan & Penajam", missingCategory: "Manufaktur & Logam", supplierCount: 4, activeRfqCount: 42, opportunityIndex: "96/100" },
  { province: "Sulawesi Selatan", city: "Makassar", missingCategory: "Kemasan & Percetakan", supplierCount: 8, activeRfqCount: 28, opportunityIndex: "85/100" },
  { province: "Sumatera Utara", city: "Medan", missingCategory: "Pertanian & Pangan", supplierCount: 12, activeRfqCount: 38, opportunityIndex: "79/100" },
  { province: "Papua", city: "Jayapura", missingCategory: "Pertanian & Pangan", supplierCount: 1, activeRfqCount: 9, opportunityIndex: "72/100" },
];

const expansionRecommendations = [
  {
    title: "Ekspansi Jalur Logistik ke IKN Baru",
    description: "Tingginya pembangunan infrastruktur di Ibu Kota Nusantara (IKN) memicu lonjakan permintaan produk Manufaktur Logam sebesar 120%. UMKM dengan kapasitas fabrikasi direkomendasikan membuka depo logistik di Balikpapan.",
    impact: "Potensi peningkatan omset s.d 40%",
    difficulty: "Medium",
  },
  {
    title: "Sertifikasi Halal & BPOM untuk Bahan Pangan",
    description: "Analisis RFQ menunjukkan 92% perusahaan makanan mensyaratkan sertifikasi Halal dan BPOM. UMKM yang melengkapi sertifikasi ini berpeluang 5x lipat lebih tinggi memenangkan tender.",
    impact: "Akses ke 80+ Korporat Besar",
    difficulty: "Mudah-Medium",
  },
  {
    title: "Diversifikasi ke Kemasan Biodegradable",
    description: "Ada pergeseran tren di mana perusahaan ritel mulai meninggalkan plastik konvensional dan beralih ke kemasan ramah lingkungan (paper box/biodegradable). Pertumbuhan demand mencapai 50% tahun ini.",
    impact: "Margin keuntungan +15% lebih tinggi",
    difficulty: "Tinggi",
  },
];

export default function OpportunitiesPage() {
  const [analyzing, setAnalyzing] = useState(false);

  const triggerAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Sparkles className="text-emerald-600 w-4 h-4" />
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
              AI Opportunity Detector
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900">Detektor Peluang Pasar</h1>
          <p className="text-neutral-500 mt-1">Analisis trend pengadaan nasional dan temukan celah pasar terbaik untuk bisnis Anda.</p>
        </div>
        <Button 
          onClick={triggerAnalysis} 
          disabled={analyzing}
          className="gradient-brand text-white border-none shadow-md hover:opacity-90 transition-all flex items-center gap-2 h-11"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menganalisis Tren...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh Analisis AI
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Trending Products */}
        <Card className="lg:col-span-2 shadow-sm border border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="text-emerald-600 w-5 h-5" />
                Produk dengan Kenaikan Demand Tertinggi
              </CardTitle>
              <CardDescription>Produk yang paling banyak dicari oleh korporasi dalam 30 hari terakhir</CardDescription>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Real-time</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingProducts.map((p, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:border-emerald-200 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-neutral-500">{p.category}</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center">
                      {p.growth} <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-950 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400">Demand: <strong className="text-neutral-600">{p.demandLevel}</strong></span>
                    <Badge className={cn(
                      "text-[10px] px-2 py-0.5 border",
                      p.urgency === "HIGH" ? "bg-red-50 text-red-700 border-red-200" :
                      p.urgency === "MEDIUM" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-blue-50 text-blue-700 border-blue-200"
                    )}>
                      {p.urgency}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Region stats / supply map quick preview */}
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="text-blue-600 w-5 h-5" />
              Daerah Minim Supplier
            </CardTitle>
            <CardDescription>Wilayah dengan ketimpangan demand vs supply tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {underservedRegions.map((region, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-sm text-neutral-800">{region.city}</h4>
                  <p className="text-xs text-neutral-500">{region.province}</p>
                  <p className="text-[11px] text-blue-600 mt-1 font-medium">{region.missingCategory}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-800">{region.activeRfqCount} RFQ</span>
                  <p className="text-[10px] text-neutral-500">{region.supplierCount} Supplier</p>
                  <Badge className="bg-red-50 text-red-700 border border-red-200 text-[10px] mt-1.5">
                    Gap {region.opportunityIndex}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Strategic Expansion Recommendations */}
      <Card className="shadow-sm border border-neutral-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="text-amber-500 w-5 h-5" />
            Rekomendasi Ekspansi Strategis AI
          </CardTitle>
          <CardDescription>Langkah-langkah strategis hasil rekomendasi AI untuk pertumbuhan bisnis Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {expansionRecommendations.map((rec, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl border border-neutral-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">Rekomendasi {i+1}</Badge>
                  <span className="text-xs text-neutral-400 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> Diperbarui hari ini</span>
                </div>
                <h4 className="font-bold text-base text-neutral-950">{rec.title}</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">{rec.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 min-w-[200px] pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100">
                <div className="text-left md:text-right">
                  <span className="text-xs text-neutral-400 block">Dampak Bisnis</span>
                  <span className="text-sm font-bold text-emerald-600">{rec.impact}</span>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-xs text-neutral-400 block">Tingkat Kesulitan</span>
                  <Badge variant="outline" className="mt-1 text-xs border-neutral-300 text-neutral-700">
                    {rec.difficulty}
                  </Badge>
                </div>
                <Button size="sm" className="mt-2 w-full md:w-auto gradient-brand text-white border-none">
                  Ambil Peluang <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
