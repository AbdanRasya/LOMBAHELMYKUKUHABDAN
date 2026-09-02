"use client";

import { 
  Brain, 
  MapPin, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  FileSearch,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Brain,
    title: "AI Supplier Matching",
    description:
      "Teknologi AI kami menganalisis ribuan data point untuk merekomendasikan supplier paling tepat berdasarkan kategori, kapasitas, lokasi, dan track record.",
    badge: "AI-Powered",
    badgeColor: "emerald",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    icon: FileSearch,
    title: "Smart RFQ Assistant",
    description:
      "Buat RFQ profesional hanya dengan mendeskripsikan kebutuhan Anda dalam bahasa natural. AI kami akan mengkonversi ke format terstruktur secara otomatis.",
    badge: "Hemat Waktu",
    badgeColor: "purple",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    icon: Shield,
    title: "Supplier Trust Score",
    description:
      "Setiap supplier mendapat Trust Score berbasis delivery performance, ulasan pelanggan, waktu respons, dan status sertifikasi yang diperbarui secara real-time.",
    badge: "Terverifikasi",
    badgeColor: "emerald",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    icon: MapPin,
    title: "Supply Gap Map",
    description:
      "Peta interaktif Indonesia yang menampilkan wilayah dengan potensi demand tinggi namun kekurangan supplier. Data berharga untuk ekspansi bisnis UMKM.",
    badge: "Interactive",
    badgeColor: "orange",
    gradient: "from-orange-500 to-orange-700",
  },
  {
    icon: MessageSquare,
    title: "AI Procurement Assistant",
    description:
      "Copilot pengadaan berbasis AI yang membantu membandingkan penawaran, merangkum kekuatan supplier, mendeteksi risiko, dan menyarankan alternatif terbaik.",
    badge: "Chat AI",
    badgeColor: "pink",
    gradient: "from-pink-500 to-pink-700",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Dashboard analytics real-time dengan tren pengadaan bulanan, distribusi supplier, heatmap regional, dan insight bisnis berbasis data.",
    badge: "Real-time",
    badgeColor: "cyan",
    gradient: "from-cyan-500 to-cyan-700",
  },
];

const badgeColors: Record<string, string> = {
  blue: "bg-emerald-50 text-emerald-700 border-emerald-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  pink: "bg-pink-50 text-pink-700 border-pink-200",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4 text-xs font-semibold">
            Platform Lengkap
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900">
            Semua yang Anda Butuhkan untuk{" "}
            <span className="gradient-text">Pengadaan Cerdas</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Dari pencarian supplier hingga finalisasi kontrak, SourceHub hadir di setiap tahap proses pengadaan Anda.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl border border-neutral-200/80 hover:border-emerald-200 bg-white shadow-sm hover:shadow-xl hover:shadow-emerald-50 card-hover transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300"
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Badge */}
              <Badge
                className={`${badgeColors[feature.badgeColor]} text-[11px] font-semibold mb-3 hover:bg-inherit`}
              >
                {feature.badge}
              </Badge>

              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover arrow */}
              <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Pelajari lebih lanjut <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
