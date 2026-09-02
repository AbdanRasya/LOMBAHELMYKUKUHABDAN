"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Star, ShieldCheck, Zap, TrendingUp, Building2, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { value: "2,400+", label: "UMKM Terdaftar" },
  { value: "850+", label: "Perusahaan Aktif" },
  { value: "12,000+", label: "RFQ Berhasil" },
  { value: "34", label: "Provinsi Terlayani" },
];

const floatingCards = [
  {
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    title: "Terverifikasi",
    desc: "PT Bumi Tekstil",
    color: "emerald",
  },
  {
    icon: <Star className="w-4 h-4 text-yellow-500" />,
    title: "Rating 4.9/5",
    desc: "CV Maju Bersama",
    color: "yellow",
  },
  {
    icon: <Zap className="w-4 h-4 text-emerald-600" />,
    title: "Match Score 94%",
    desc: "AI Recommendation",
    color: "emerald",
  },
];

export function HeroSection() {
  const counterRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative min-h-screen gradient-mesh flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-xs font-semibold hover:bg-emerald-50">
                <Zap className="w-3 h-3 mr-1" />
                Platform B2B #1 Indonesia
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-xs font-semibold hover:bg-emerald-50">
                AI-Powered
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
                Temukan Supplier Lokal{" "}
                <span className="gradient-text">Terpercaya</span>{" "}
                untuk Bisnis Anda
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-lg">
                Menghubungkan perusahaan Indonesia dengan UMKM lokal melalui AI-powered sourcing. 
                Pengadaan lebih cerdas, lebih efisien, lebih berdampak.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register?role=COMPANY"
                className={cn(buttonVariants({ size: "lg" }), "gradient-brand text-white border-none shadow-xl hover:shadow-emerald-300/40 hover:opacity-90 transition-all text-base px-8 h-13")}
              >
                <Search className="w-5 h-5 mr-2" />
                Cari Supplier
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/register?role=UMKM"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "text-base px-8 h-13 border-2 border-neutral-300 hover:border-emerald-400 hover:text-emerald-600 transition-all")}
              >
                <Factory className="w-5 h-5 mr-2" />
                Daftar UMKM
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                    style={{
                      background: `hsl(${(i * 60) % 360}, 70%, 60%)`,
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-500">
                  Dipercaya <strong className="text-neutral-700">850+ perusahaan</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Main card */}
            <div className="relative w-full max-w-md">
              {/* Dashboard mock */}
              <div className="glass rounded-2xl shadow-2xl p-6 border border-white/50">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-md">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-800">AI Supplier Match</p>
                    <p className="text-xs text-neutral-500">3 hasil terbaik ditemukan</p>
                  </div>
                  <Badge className="ml-auto bg-emerald-600 text-white text-xs">AI</Badge>
                </div>

                {/* Supplier rows */}
                {[
                  { name: "PT Sumber Makmur", cat: "Manufaktur Logam", score: 96, verified: true },
                  { name: "CV Maju Jaya", cat: "Tekstil & Garmen", score: 91, verified: true },
                  { name: "UD Prima Perkasa", cat: "Kemasan & Packaging", score: 87, verified: false },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors mb-2 last:mb-0"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                      style={{ background: `hsl(${140 + i * 30}, 70%, 45%)` }}
                    >
                      {s.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-semibold text-neutral-800 truncate">{s.name}</p>
                        {s.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">{s.cat}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">{s.score}%</p>
                      <p className="text-xs text-neutral-400">match</p>
                    </div>
                  </div>
                ))}

                {/* Stats bar */}
                <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-neutral-800">96%</p>
                    <p className="text-xs text-neutral-500">Akurasi AI</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-neutral-800">2.4s</p>
                    <p className="text-xs text-neutral-500">Waktu Match</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-600">Hemat 70%</p>
                    <p className="text-xs text-neutral-500">Waktu Riset</p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              {floatingCards.map((card, i) => (
                <div
                  key={i}
                  className={`absolute glass rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 animate-float`}
                  style={{
                    animationDelay: `${i * 1.5}s`,
                    top: i === 0 ? "-40px" : i === 2 ? "auto" : "50%",
                    bottom: i === 2 ? "-30px" : "auto",
                    left: i === 1 ? "-60px" : "auto",
                    right: i === 0 ? "-40px" : "auto",
                    transform: i === 1 ? "translateY(-50%)" : "none",
                  }}
                >
                  <div
                    className={`w-7 h-7 rounded-lg bg-${card.color}-50 flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{card.title}</p>
                    <p className="text-[10px] text-neutral-500">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6" ref={counterRef}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl glass border border-white/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-3xl lg:text-4xl font-extrabold gradient-text">{stat.value}</p>
              <p className="text-sm text-neutral-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
