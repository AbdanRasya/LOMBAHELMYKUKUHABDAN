"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

const stats = [
  { value: 2400, suffix: "+", label: "UMKM Terdaftar", color: "emerald" },
  { value: 850, suffix: "+", label: "Perusahaan Aktif", color: "emerald" },
  { value: 12000, suffix: "+", label: "RFQ Berhasil Diproses", color: "purple" },
  { value: 34, suffix: "", label: "Provinsi Terlayani", color: "orange" },
  { value: 96, suffix: "%", label: "Akurasi AI Matching", color: "emerald" },
  { value: 4.8, suffix: "/5", label: "Rating Rata-rata Platform", color: "yellow", isDecimal: true },
];

function useCountUp(target: number, isDecimal = false, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, isDecimal, duration, start]);

  return count;
}

function StatCard({ stat, start }: { stat: typeof stats[0]; start: boolean }) {
  const count = useCountUp(stat.value, stat.isDecimal, 2000, start);

  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
    orange: "text-orange-600 bg-orange-50 border-orange-200",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorMap[stat.color]} text-center group hover:scale-105 transition-transform duration-300`}>
      <p className={`text-4xl font-extrabold`}>
        {stat.isDecimal ? count.toFixed(1) : count.toLocaleString("id-ID")}
        <span className="text-2xl">{stat.suffix}</span>
      </p>
      <p className="text-sm font-medium mt-2 opacity-80">{stat.label}</p>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="w-4 h-4" />
            Dampak Nyata
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Angka yang <span className="gradient-text">Berbicara</span>
          </h2>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            PUSAKA telah membuktikan diri sebagai platform pengadaan B2B yang memberikan dampak nyata bagi ekosistem bisnis Indonesia.
          </p>
        </div>
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} start={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
