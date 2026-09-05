"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Package, MapPin, Shield, Filter, Loader2, ArrowRight, Star, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DirectQuoteModal from "@/components/suppliers/direct-quote-modal";

const CATEGORIES = [
  "Semua Kategori",
  "Makanan & Minuman",
  "Tekstil & Garmen",
  "Kemasan",
  "Logam & Metal Work",
  "Furniture & Kayu",
  "Kimia & Plastik",
  "Elektronik & Komponen",
];

const PROVINCES = [
  "Semua Provinsi",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Timur",
  "Jawa Tengah",
  "Sumatera Utara",
  "Sulawesi Selatan",
  "Bali",
];

type Product = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  unit?: string | null;
  minOrder?: number | null;
  maxCapacity?: number | null;
  leadTimeDays?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  umkmProfile: {
    id: string;
    businessName: string;
    province?: string | null;
    city?: string | null;
    verificationStatus: string;
    readinessScore: number;
    trustScore?: { overall: number } | null;
  };
};

export default function ProductMarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedProvince, setSelectedProvince] = useState("Semua Provinsi");
  const [sortBy, setSortBy] = useState("relevance");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedProvince !== "Semua Provinsi") params.set("province", selectedProvince);

      const res = await fetch(`/api/suppliers?${params}`);
      const data = await res.json();
      
      const aggregated: Product[] = [];
      (data.suppliers || []).forEach((supplier: any) => {
        (supplier.products || []).forEach((prod: any) => {
          aggregated.push({
            id: prod.id || `${supplier.id}-${prod.name}`,
            name: prod.name,
            description: prod.description,
            category: supplier.categories?.[0]?.name || "Komoditas",
            unit: prod.unit || "pcs",
            minOrder: prod.minOrder || 100,
            maxCapacity: prod.maxCapacity || 10000,
            leadTimeDays: prod.leadTimeDays || 7,
            priceMin: prod.priceMin,
            priceMax: prod.priceMax,
            umkmProfile: {
              id: supplier.id,
              businessName: supplier.businessName,
              province: supplier.province,
              city: supplier.city,
              verificationStatus: supplier.verificationStatus,
              readinessScore: supplier.readinessScore || 75,
              trustScore: supplier.trustScore,
            },
          });
        });
      });

      let filtered = aggregated;
      if (selectedCategory !== "Semua Kategori") {
        filtered = filtered.filter(p => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
      }

      if (sortBy === "readiness") {
        filtered.sort((a, b) => b.umkmProfile.readinessScore - a.umkmProfile.readinessScore);
      } else if (sortBy === "leadTime") {
        filtered.sort((a, b) => (a.leadTimeDays || 99) - (b.leadTimeDays || 99));
      }

      setProducts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedProvince, sortBy]);

  const formatPrice = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Request Price / Quotation";
    if (min && max) return `Rp ${min.toLocaleString("id-ID")} - Rp ${max.toLocaleString("id-ID")}`;
    if (min) return `Mulai Rp ${min.toLocaleString("id-ID")}`;
    return `s.d Rp ${max?.toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pasar Produk & Material B2B</h1>
        <p className="text-sm text-slate-500 mt-1">Cari bahan baku, komponen, dan produk olahan langsung dari supplier UMKM terverifikasi</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama produk, spesifikasi, atau material (misal: Karton Box, Kemasan Standup Pouch)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              className="pl-9 h-11 rounded-xl"
            />
          </div>
          <Button onClick={fetchProducts} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 font-medium">
            Cari Produk
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <Select value={selectedCategory} onValueChange={(v) => v && setSelectedCategory(v)}>
            <SelectTrigger className="w-44 h-9 rounded-lg text-xs">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedProvince} onValueChange={(v) => v && setSelectedProvince(v)}>
            <SelectTrigger className="w-44 h-9 rounded-lg text-xs">
              <SelectValue placeholder="Lokasi Supplier" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
            <SelectTrigger className="w-44 h-9 rounded-lg text-xs ml-auto">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance" className="text-xs">Relevansi</SelectItem>
              <SelectItem value="readiness" className="text-xs">Skor Kesiapan Tertinggi</SelectItem>
              <SelectItem value="leadTime" className="text-xs">Lead Time Tercepat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
          <p className="text-sm text-slate-500">Memuat katalog produk B2B...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800">Tidak ada produk ditemukan</h3>
          <p className="text-sm mt-1">Coba sesuaikan filter pencarian atau gunakan kata kunci lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-all border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-700">
                    {p.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{p.name}</h3>
                  <Link href={`/company/suppliers/${p.umkmProfile.id}`} className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors">
                    <span className="font-medium text-slate-700">{p.umkmProfile.businessName}</span>
                    {p.umkmProfile.verificationStatus === "APPROVED" && (
                      <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                  </Link>
                  {(p.umkmProfile.city || p.umkmProfile.province) && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3 h-3" /> {[p.umkmProfile.city, p.umkmProfile.province].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>

                {p.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {p.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">MIN. PESANAN (MOQ)</span>
                    <span className="font-semibold text-slate-800">{p.minOrder?.toLocaleString("id-ID")} {p.unit}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">LEAD TIME</span>
                    <span className="font-semibold text-slate-800">{p.leadTimeDays} Hari Kerja</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Estimasi Harga / Penawaran</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {formatPrice(p.priceMin, p.priceMax)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <Link href={`/company/suppliers/${p.umkmProfile.id}`} className="flex-1">
                  <Button variant="outline" className="w-full text-xs rounded-xl h-9 border-slate-200 text-slate-700">
                    Lihat Supplier
                  </Button>
                </Link>
                <div className="flex-1">
                  <DirectQuoteModal
                    supplierId={p.umkmProfile.id}
                    supplierName={p.umkmProfile.businessName}
                    initialTitle={`Request Quote: ${p.name}`}
                    initialQuantity={p.minOrder?.toString() || "100"}
                    initialUnit={p.unit || "pcs"}
                    initialDescription={`Halo ${p.umkmProfile.businessName}, kami tertarik untuk memesan produk "${p.name}". Mohon berikan penawaran harga dan estimasi waktu pengiriman.`}
                    trigger={
                      <span className="w-full inline-flex items-center justify-center text-xs rounded-xl h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-medium cursor-pointer">
                        Request Quote <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    }
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
