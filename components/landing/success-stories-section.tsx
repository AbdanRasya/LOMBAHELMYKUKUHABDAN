"use client";

import { Star, Quote, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stories = [
  {
    quote:
      "SourceHub mengubah cara kami mencari supplier. Dengan AI matching, kami menemukan mitra produksi yang sempurna dalam hitungan menit, bukan minggu. Penghematan waktu dan biaya yang luar biasa.",
    author: "Budi Santoso",
    role: "Procurement Manager",
    company: "PT Industri Nusantara",
    rating: 5,
    saving: "Hemat 60% waktu pengadaan",
    avatarColor: "#059669",
    initials: "BS",
  },
  {
    quote:
      "Sebagai UMKM, kami kesulitan menembus pasar korporat. SourceHub membuka pintu ke ratusan perusahaan yang butuh supplier seperti kami. Revenue kami naik 3x dalam 6 bulan!",
    author: "Siti Rahayu",
    role: "Pemilik",
    company: "CV Tekstil Maju Jaya",
    rating: 5,
    saving: "Revenue naik 300%",
    avatarColor: "#059669",
    initials: "SR",
  },
  {
    quote:
      "Transparansi adalah nilai utama yang kami cari. Trust Score dan proses verifikasi SourceHub memberikan keyakinan bahwa supplier yang kami pilih benar-benar terpercaya.",
    author: "Ahmad Fauzi",
    role: "CEO",
    company: "PT Retail Mandiri Group",
    rating: 5,
    saving: "0 kasus supplier bermasalah",
    avatarColor: "#7c3aed",
    initials: "AF",
  },
];

export function SuccessStoriesSection() {
  return (
    <section id="success" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 mb-4 text-xs font-semibold">
            Kisah Sukses
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Cerita <span className="gradient-text">Nyata</span> dari Pengguna Kami
          </h2>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            Lebih dari 850 perusahaan and 2,400 UMKM telah merasakan manfaat platform kami
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
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
              <div className="flex items-center gap-0.5 mb-4 pt-2">
                {[...Array(story.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
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
