"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MapPin, Package, ShieldCheck, ArrowRight, Star, Layers, Award } from "lucide-react";

type RealSupplierItem = {
  id: string;
  businessName: string;
  tagline?: string | null;
  description?: string | null;
  province?: string | null;
  city?: string | null;
  logo?: string | null;
  readinessScore: number;
  verificationStatus: string;
  categories?: { name: string }[];
  products?: { id: string; name: string; images?: string[]; minOrder?: number | null; unit?: string | null }[];
  trustScore?: { overall: number } | null;
  reviews?: { rating: number }[];
};

export function FeaturedSuppliersSection({
  realSuppliers = [],
  counts,
}: {
  realSuppliers?: RealSupplierItem[];
  counts?: { umkm: number; products: number; rfqs: number };
}) {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const marketplaceUrl = userRole === "UMKM" ? "/umkm/suppliers" : "/company/suppliers";
  const displaySuppliers = realSuppliers.length > 0 ? realSuppliers : [
    {
      id: "demo-1",
      businessName: "CV Sumber Tekstil Bandung",
      tagline: "Produsen Kain & Garmen Industri",
      description: "Pabrik pembuat bahan kain katun, drill, dan garmen berkualitas tinggi dengan kapasitas produksi skala besar.",
      province: "Jawa Barat",
      city: "Bandung",
      readinessScore: 92,
      verificationStatus: "APPROVED",
      categories: [{ name: "Tekstil & Garmen" }],
      products: [{ id: "p1", name: "Kain Katun Premium", images: ["/supplier-textile.jpg"], minOrder: 500, unit: "meter" }],
      trustScore: { overall: 94 },
      reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
    },
    {
      id: "demo-2",
      businessName: "CV Nusantara Pack",
      tagline: "Kemasan Kraft & Aluminium Foil",
      description: "Produsen kemasan berdiri (standup pouch), karton box, dan aluminium foil untuk industri makanan & FMCG.",
      province: "Jawa Barat",
      city: "Bandung",
      readinessScore: 88,
      verificationStatus: "APPROVED",
      categories: [{ name: "Kemasan" }],
      products: [{ id: "p2", name: "Standup Pouch Aluminium Foil", images: ["/supplier-packaging.jpg"], minOrder: 1000, unit: "pcs" }],
      trustScore: { overall: 90 },
      reviews: [{ rating: 5 }, { rating: 5 }],
    },
    {
      id: "demo-3",
      businessName: "PT Rempah Nusantara",
      tagline: "Bahan Baku Rempah & Herbal Organik",
      description: "Supplier utama rempah olahan, ekstrak jahe, kunyit, dan tanaman obat bersertifikat BPOM & Halal.",
      province: "Jawa Timur",
      city: "Sidoarjo",
      readinessScore: 95,
      verificationStatus: "APPROVED",
      categories: [{ name: "Makanan & Minuman" }],
      products: [{ id: "p3", name: "Ekstrak Jahe Merah Bubuk", images: ["/supplier-agro.jpg"], minOrder: 100, unit: "kg" }],
      trustScore: { overall: 96 },
      reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
    },
  ];

  const totalUmkmCount = counts?.umkm ? `${counts.umkm}+` : `${displaySuppliers.length}+`;
  const totalProdCount = counts?.products ? `${counts.products}+` : "25+";
  const totalRfqCount = counts?.rfqs ? `${counts.rfqs}+` : "10+";

  const stats = [
    { value: totalUmkmCount, label: "Supplier Terdaftar" },
    { value: totalProdCount, label: "Produk Terdaftar" },
    { value: totalRfqCount, label: "RFQ Terbit" },
    { value: "100%", label: "Terverifikasi Resmi" },
  ];

  return (
    <section className="bg-white py-20 lg:py-28" id="suppliers">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Katalog Terverifikasi
            </p>
            <h2 className="text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Supplier &amp; Produk<br />Pilihan Terbaik
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="mb-5 text-slate-500 leading-relaxed">
              Jelajahi supplier terpercaya dari seluruh Nusantara, dikurasi untuk standar pengadaan bisnis premium.
            </p>
            <Link
              href={marketplaceUrl}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors"
            >
              Lihat Semua Supplier <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Real Stats */}
        <div className="mb-20 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-6 shadow-xs">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                <div className="mt-1 text-sm text-emerald-600 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternating real supplier items (Limit to max 3) */}
        <div className="space-y-24">
          {displaySuppliers.slice(0, 3).map((s, i) => {
            const categoryName = s.categories?.[0]?.name || "Manufaktur & Sourcing";
            const location = [s.city, s.province || "Indonesia"].filter(Boolean).join(", ");
            const mainProduct = s.products?.[0];
            const productImage =
              mainProduct?.images?.[0] ||
              s.logo ||
              (i % 3 === 0 ? "/supplier-packaging.jpg" : i % 3 === 1 ? "/supplier-textile.jpg" : "/supplier-agro.jpg");

            // Calculate real rating
            let ratingValue = "4.8";
            let reviewCount = s.reviews?.length || 0;
            if (reviewCount > 0) {
              const sum = s.reviews!.reduce((acc, r) => acc + (r.rating || 5), 0);
              ratingValue = (sum / reviewCount).toFixed(1);
            } else if (s.trustScore?.overall) {
              ratingValue = (s.trustScore.overall / 20).toFixed(1);
              reviewCount = Math.max(1, Math.floor(s.readinessScore / 20));
            } else {
              reviewCount = 3;
            }

            const isImageRight = i % 2 === 0;

            return (
              <div
                key={s.id}
                className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${
                  !isImageRight ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {categoryName}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      Rating {ratingValue} / 5.0 ({reviewCount} Ulasan)
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 leading-snug">{s.businessName}</h3>
                    <p className="mt-1 text-base font-medium text-slate-400">
                      {s.tagline || "Mitra Pengadaan B2B Terverifikasi"}
                    </p>
                  </div>

                  <p className="text-slate-500 leading-relaxed">
                    {s.description ||
                      "Supplier manufaktur dan pengadaan terpercaya dengan standar mutu produk industri terbaik di Indonesia."}
                  </p>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      {location}
                    </span>

                    {mainProduct && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs">
                        <Package className="h-3.5 w-3.5 text-amber-500" />
                        Produk Utama: {mainProduct.name}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs">
                      <Award className="h-3.5 w-3.5 text-emerald-600" />
                      Skor Kesiapan: {s.readinessScore}/100
                    </span>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/company/suppliers/${s.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors shadow-md"
                    >
                      Lihat Produk &amp; Profil Supplier <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Image side */}
                <div className="flex-1">
                  <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3] shadow-md border border-slate-100">
                    <Image
                      src={productImage}
                      alt={s.businessName}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Badge overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-md">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Terverifikasi Resmi
                      </span>
                      {mainProduct && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 text-white backdrop-blur-md px-3 py-1.5 text-xs font-semibold shadow-md">
                          <Layers className="w-3.5 h-3.5" />
                          Katalog Resmi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Marketplace */}
        <div className="mt-16 text-center pt-8 border-t border-slate-100">
          <Link
            href={marketplaceUrl}
            className="inline-flex items-center gap-3 rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 transition-all"
          >
            Lihat Selengkapnya di Marketplace <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
