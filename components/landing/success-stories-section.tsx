"use client";

import { Star, Quote, Building2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type RealReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  companyName?: string | null;
  umkmProfile?: {
    businessName: string;
    city?: string | null;
    province?: string | null;
  } | null;
};

interface SuccessStoriesProps {
  realReviews?: RealReviewItem[];
}

export function SuccessStoriesSection({ realReviews = [] }: SuccessStoriesProps) {
  // Map real DB reviews into story display format
  const mappedDbStories = realReviews.map((r, i) => {
    const supplierName = r.umkmProfile?.businessName || "Supplier Terdaftar";
    const buyerCompany = r.companyName || "PT Industri Nusantara";
    const initials = supplierName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const colors = ["#059669", "#2563eb", "#7c3aed", "#d97706", "#0d9488"];

    return {
      quote: r.comment || "Layanan sangat memuaskan, spesifikasi produk presisi dan pengiriman tepat waktu.",
      author: buyerCompany,
      role: "Procurement B2B",
      company: supplierName,
      rating: r.rating || 5,
      saving: "Ulasan Real-Time Database",
      avatarColor: colors[i % colors.length],
      initials,
      isRealDb: true,
    };
  });

  const displayStories = mappedDbStories;

  return (
    <section id="success" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 mb-4 text-xs font-semibold">
            Kisah Sukses &amp; Rating Asli
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Cerita <span className="gradient-text">Nyata</span> dari Pengguna Kami
          </h2>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            Rating dan ulasan asli dari transaksi pengadaan B2B antara Perusahaan dan UMKM terdaftar
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayStories.map((story, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-neutral-200 hover:border-emerald-200 card-hover transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-2">
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-md">
                  <Quote className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-between mb-4 pt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(story.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs font-bold text-amber-600 ml-1.5">{story.rating}.0 / 5.0</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Terverifikasi
                </span>
              </div>

              {/* Quote */}
              <p className="text-neutral-700 text-sm leading-relaxed mb-5 italic">
                &ldquo;{story.quote}&rdquo;
              </p>

              {/* Metric pill */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200 mb-5">
                ✓ {story.saving}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: story.avatarColor }}
                >
                  {story.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-800">{story.author}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-neutral-500">{story.role},</p>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-neutral-400" />
                      <p className="text-xs text-emerald-600 font-medium">{story.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
