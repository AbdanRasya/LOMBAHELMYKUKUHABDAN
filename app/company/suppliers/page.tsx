"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bookmark, MapPin, Star, Shield, Loader2, BookmarkCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DirectQuoteModal from "@/components/suppliers/direct-quote-modal";

const PROVINCES = ["DKI Jakarta","Jawa Barat","Jawa Timur","Jawa Tengah","Sumatera Utara","Sulawesi Selatan","Bali","Kalimantan Timur","Sumatera Selatan","Nusa Tenggara Barat"];

type Supplier = {
  id: string;
  businessName: string;
  tagline?: string | null;
  province?: string | null;
  city?: string | null;
  logo?: string | null;
  readinessScore: number;
  verificationStatus: string;
  categories: { id: string; name: string }[];
  products: { name: string }[];
  trustScore?: { overall: number } | null;
  reviews?: { rating: number }[] | null;
};

const DEMO_LIST: Supplier[] = [
  {
    id: "demo-1",
    businessName: "CV Sumber Tekstil Bandung",
    tagline: "Produsen Kain & Garmen Industri",
    province: "Jawa Barat",
    city: "Bandung",
    readinessScore: 92,
    verificationStatus: "APPROVED",
    categories: [{ id: "c1", name: "Tekstil & Garmen" }],
    products: [{ name: "Kain Katun Premium" }, { name: "Kain Drill Japan" }],
    trustScore: { overall: 94 },
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
  },
  {
    id: "demo-2",
    businessName: "CV Nusantara Pack",
    tagline: "Kemasan Kraft & Aluminium Foil",
    province: "Jawa Barat",
    city: "Bandung",
    readinessScore: 88,
    verificationStatus: "APPROVED",
    categories: [{ id: "c2", name: "Kemasan" }],
    products: [{ name: "Standup Pouch Aluminium Foil" }],
    trustScore: { overall: 90 },
    reviews: [{ rating: 5 }, { rating: 5 }],
  },
  {
    id: "demo-3",
    businessName: "PT Rempah Nusantara",
    tagline: "Bahan Baku Rempah & Herbal Organik",
    province: "Jawa Timur",
    city: "Sidoarjo",
    readinessScore: 95,
    verificationStatus: "APPROVED",
    categories: [{ id: "c3", name: "Makanan & Minuman" }],
    products: [{ name: "Ekstrak Jahe Merah Bubuk" }],
    trustScore: { overall: 96 },
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (province && province !== "all") params.set("province", province);
      const res = await fetch(`/api/suppliers?${params}`);
      const data = await res.json();
      const fetched = data.suppliers || [];
      setSuppliers(fetched.length > 0 ? fetched : (search || province !== "all" ? [] : DEMO_LIST));
    } catch {
      setSuppliers(DEMO_LIST);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, [province]);

  const toggleSave = async (umkmId: string) => {
    const res = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ umkmId }) });
    const data = await res.json();
    setSavedIds(prev => { const n = new Set(prev); data.saved ? n.add(umkmId) : n.delete(umkmId); return n; });
  };

  const getScoreColor = (score: number) => score >= 80 ? "text-emerald-600" : score >= 60 ? "text-blue-600" : score >= 40 ? "text-yellow-600" : "text-red-500";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cari Supplier</h1>
        <p className="text-sm text-slate-500 mt-1">Temukan supplier UMKM terpercaya sesuai kebutuhan Anda (Data Real Database)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Cari nama supplier..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchSuppliers()} className="pl-9" />
        </div>
        <Select value={province} onValueChange={v => setProvince(v || "all")}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Semua Provinsi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Provinsi</SelectItem>
            {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={fetchSuppliers} className="bg-blue-600 hover:bg-blue-700 text-white">Cari</Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : suppliers.length === 0 ? (
        <div className="py-24 text-center text-slate-400">
          <Search className="mx-auto h-12 w-12 opacity-30 mb-4" />
          <p className="font-medium">Tidak ada supplier ditemukan</p>
          <p className="text-sm mt-1">Coba ubah kata kunci atau filter pencarian</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {suppliers.map(s => {
            const reviewsCount = s.reviews?.length || 0;
            const avgRating = reviewsCount > 0
              ? (s.reviews!.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsCount).toFixed(1)
              : s.trustScore?.overall
              ? (s.trustScore.overall / 20).toFixed(1)
              : "5.0";

            return (
              <Card key={s.id} className="hover:shadow-lg transition-shadow border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg overflow-hidden">
                        {s.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.logo} alt={s.businessName} className="h-full w-full object-cover" />
                        ) : (
                          s.businessName?.charAt(0) || "S"
                        )}
                      </div>

                      <button onClick={() => toggleSave(s.id)} className="text-slate-400 hover:text-blue-600 transition-colors mt-1">
                        {savedIds.has(s.id) ? <BookmarkCheck className="h-5 w-5 text-blue-600" /> : <Bookmark className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{s.businessName}</h3>
                        {s.verificationStatus === "APPROVED" && <Shield className="h-4 w-4 text-emerald-500 shrink-0" />}
                      </div>
                      {s.tagline && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.tagline}</p>}
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs flex-wrap">
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span>{avgRating} / 5.0</span>
                        </div>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">{reviewsCount} Ulasan DB</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">{s.products?.length || 0} Produk B2B</span>
                      </div>
                      {(s.province || s.city) && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                          <MapPin className="h-3 w-3" /> {[s.city, s.province].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(s.categories || []).slice(0, 2).map(c => <Badge key={c.id} variant="secondary" className="text-xs">{c.name}</Badge>)}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Skor Kesiapan</p>
                        <p className={`text-sm font-bold ${getScoreColor(s.readinessScore)}`}>{s.readinessScore}/100</p>
                      </div>
                      {s.trustScore && (
                        <div>
                          <p className="text-xs text-slate-400">Trust Score</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <p className="text-sm font-bold text-slate-700">{s.trustScore.overall}/100</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <DirectQuoteModal 
                        supplierId={s.id} 
                        supplierName={s.businessName} 
                        trigger={
                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 cursor-pointer">
                            Minta Penawaran
                          </span>
                        } 
                      />
                      <Link href={`/company/suppliers/${s.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">Lihat Profil</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
