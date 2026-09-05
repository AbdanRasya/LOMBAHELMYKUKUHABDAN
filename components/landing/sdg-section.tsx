"use client";

import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

const sdgGoals = [
  {
    number: "SDG 8",
    title: "Pekerjaan Layak & Pertumbuhan Ekonomi",
    description: "Mendukung pertumbuhan UMKM yang inklusif dan berkelanjutan melalui akses pasar yang lebih luas.",
    color: "from-red-500 to-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
  {
    number: "SDG 9",
    title: "Industri, Inovasi & Infrastruktur",
    description: "Membangun infrastruktur digital yang mendukung industrialisasi inklusif dan inovatif di Indonesia.",
    color: "from-orange-500 to-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  {
    number: "SDG 10",
    title: "Berkurangnya Kesenjangan",
    description: "Mengurangi kesenjangan antara UMKM dan perusahaan besar melalui teknologi AI yang demokratis.",
    color: "from-pink-500 to-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
  },
  {
    number: "SDG 17",
    title: "Kemitraan untuk Tujuan",
    description: "Membangun kemitraan yang kuat antara perusahaan dan UMKM demi masa depan ekonomi yang lebih baik.",
    color: "from-teal-500 to-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
  },
];

export function SDGSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                SDG Alignment
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
              Berkontribusi pada{" "}
              <span className="gradient-text">Tujuan Pembangunan</span>{" "}
              Berkelanjutan
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              PUSAKA tidak hanya membangun bisnis â€” kami membangun ekosistem yang inklusif dan 
              berkelanjutan. Setiap transaksi di platform kami berkontribusi langsung pada pencapaian 
              SDGs yang ditetapkan PBB.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-600">10,000+</p>
                <p className="text-xs text-emerald-700 mt-1">Lapangan kerja tercipta</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-600">34</p>
                <p className="text-xs text-emerald-700 mt-1">Provinsi terjangkau</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-4">
            {sdgGoals.map((goal, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border ${goal.bg} ${goal.border} hover:scale-105 transition-transform duration-300`}
              >
                <div
                  className={`inline-block bg-gradient-to-br ${goal.color} text-white text-xs font-bold px-2.5 py-1 rounded-lg mb-3 shadow-sm`}
                >
                  {goal.number}
                </div>
                <h3 className={`text-sm font-bold mb-2 ${goal.text}`}>{goal.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
