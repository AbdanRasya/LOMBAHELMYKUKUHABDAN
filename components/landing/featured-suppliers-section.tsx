"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, Leaf, Recycle, ShieldCheck, ArrowRight } from "lucide-react";

const suppliers = [
  {
    tag: "Ramah Lingkungan",
    tagColor: "bg-emerald-50 text-emerald-700",
    title: "CV Nusantara Pack",
    subtitle: "Kemasan Kraft & Daur Ulang",
    description:
      "Produsen kemasan kraft premium berbahan dasar singkong dan bambu. 100% biodegradable, telah digunakan oleh lebih dari 200 brand FMCG Indonesia.",
    pills: [
      { icon: MapPin, text: "Bandung, ID", color: "text-rose-500" },
      { icon: Package, text: "MOQ: 500 unit", color: "text-amber-500" },
      { icon: Leaf, text: "CO₂ -2.4 ton/batch", color: "text-emerald-600" },
    ],
    cta: "Lihat Profil",
    href: "/company/suppliers",
    image: "/supplier-packaging.jpg",
    badge: "✦ Terverifikasi",
    badgeBg: "bg-white/90 text-slate-800",
    imageRight: true,
    imageBg: "bg-stone-100",
  },
  {
    tag: "Tekstil Lokal",
    tagColor: "bg-sky-50 text-sky-700",
    title: "UD Tenun Jepara",
    subtitle: "Kain Tenun & Batik Premium",
    description:
      "Produsen tekstil premium hasil tenunan tangan pengrajin Jepara. Menggunakan pewarna alami dan bahan baku lokal. Ekspor ke 12 negara.",
    pills: [
      { icon: MapPin, text: "Jepara, ID", color: "text-rose-500" },
      { icon: Package, text: "MOQ: 20 roll", color: "text-amber-500" },
      { icon: Recycle, text: "Hemat 2.700L air/kg", color: "text-sky-600" },
    ],
    cta: "Negosiasi Harga",
    href: "/company/suppliers",
    image: "/supplier-textile.jpg",
    badge: "♻ Upcycled",
    badgeBg: "bg-white/90 text-slate-800",
    imageRight: false,
    imageBg: "bg-sky-50",
  },
  {
    tag: "Agro & Pangan",
    tagColor: "bg-amber-50 text-amber-700",
    title: "PT Rempah Nusantara",
    subtitle: "Bahan Baku Rempah & Herbal",
    description:
      "Supplier rempah dan herbal premium langsung dari petani Jawa Timur. Sudah tersertifikasi organik TÜV dan BPOM. Kapasitas 50 ton/bulan.",
    pills: [
      { icon: MapPin, text: "Sidoarjo, ID", color: "text-rose-500" },
      { icon: Package, text: "MOQ: 1.000 kg", color: "text-amber-500" },
      { icon: ShieldCheck, text: "TÜV Certified", color: "text-emerald-600" },
    ],
    cta: "Mulai Order",
    href: "/company/suppliers",
    image: "/supplier-agro.jpg",
    badge: "🌿 Ocean Safe",
    badgeBg: "bg-white/90 text-slate-800",
    imageRight: true,
    imageBg: "bg-amber-50",
  },
];

const stats = [
  { value: "500+", label: "Supplier Terkurasi" },
  { value: "98%", label: "Kepuasan Buyer" },
  { value: "34", label: "Kota di Indonesia" },
  { value: "SDG", label: "8 & 9 Compliant" },
];

export function FeaturedSuppliersSection() {
  return (
    <section className="bg-white py-20 lg:py-28" id="suppliers">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Supplier Unggulan
            </p>
            <h2 className="text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Supplier Lokal<br />Pilihan Terbaik
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="mb-5 text-slate-500 leading-relaxed">
              Jelajahi supplier terpercaya dari seluruh Nusantara, dikurasi untuk standar bisnis premium.
            </p>
            <Link
              href="/company/suppliers"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors"
            >
              Lihat Semua Supplier <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-20 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                <div className="mt-1 text-sm text-emerald-600 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternating items */}
        <div className="space-y-24">
          {suppliers.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${
                !s.imageRight ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text side */}
              <div className="flex-1 space-y-6">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.tagColor}`}
                >
                  {s.tag}
                </span>

                <div>
                  <h3 className="text-3xl font-bold text-slate-900 leading-snug">{s.title}</h3>
                  <p className="mt-1 text-base font-medium text-slate-400">{s.subtitle}</p>
                </div>

                <p className="text-slate-500 leading-relaxed">{s.description}</p>

                {/* Pill tags */}
                <div className="flex flex-wrap gap-2">
                  {s.pills.map((pill, pi) => (
                    <span
                      key={pi}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                    >
                      <pill.icon className={`h-3.5 w-3.5 ${pill.color}`} />
                      {pill.text}
                    </span>
                  ))}
                </div>

                <Link
                  href={s.href}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  {s.cta}
                </Link>
              </div>

              {/* Image side */}
              <div className="flex-1">
                <div className={`relative overflow-hidden rounded-2xl ${s.imageBg} aspect-[4/3]`}>
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Badge overlay */}
                  <div className="absolute bottom-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md ${s.badgeBg}`}>
                      {s.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom browser-like preview card */}
        <div className="mt-24 overflow-hidden rounded-2xl border border-slate-100 shadow-xl">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-5 py-3.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="mx-auto flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs text-slate-400">
              sourcehub.id/katalog
            </div>
          </div>

          {/* App preview inside */}
          <div className="flex bg-slate-50">
            {/* Sidebar */}
            <div className="hidden w-44 shrink-0 border-r border-slate-100 bg-white p-4 sm:block">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Kategori</p>
              {["Semua Supplier", "Kemasan", "Tekstil", "Agro & Pangan", "Elektronik"].map((cat, i) => (
                <div
                  key={cat}
                  className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                    i === 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span>{["🏪", "📦", "🧵", "🌾", "💡"][i]}</span>
                  {cat}
                </div>
              ))}
            </div>

            {/* Cards grid */}
            <div className="flex-1 p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { bg: "bg-emerald-100", emoji: "📦", tag: "Kemasan", name: "CV Nusantara Pack", loc: "Bandung · MOQ 500" },
                  { bg: "bg-sky-100", emoji: "🧵", tag: "Tekstil", name: "UD Tenun Jepara", loc: "Jepara · MOQ 20 roll" },
                  { bg: "bg-amber-100", emoji: "🌾", tag: "Agro", name: "PT Rempah Nusantara", loc: "Sidoarjo · MOQ 1K" },
                ].map((card) => (
                  <div key={card.name} className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className={`flex h-20 items-center justify-center ${card.bg}`}>
                      <span className="text-3xl">{card.emoji}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600">{card.tag}</p>
                      <p className="mt-0.5 truncate text-xs font-bold text-slate-800">{card.name}</p>
                      <p className="truncate text-[10px] text-slate-400">{card.loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
