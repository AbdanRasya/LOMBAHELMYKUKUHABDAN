import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Shield, Star, Package, Award, CheckCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEMO_SUPPLIERS: Record<string, any> = {
  "demo-1": {
    id: "demo-1",
    userId: "demo-user-1",
    businessName: "CV Sumber Tekstil Bandung",
    tagline: "Produsen Kain & Garmen Industri",
    description: "Pabrik pembuat bahan kain katun, drill, dan garmen berkualitas tinggi dengan kapasitas produksi skala besar.",
    province: "Jawa Barat",
    city: "Bandung",
    readinessScore: 92,
    verificationStatus: "APPROVED",
    foundedYear: 2015,
    employeeCount: 45,
    phone: "081234567890",
    email: "info@sumbertekstil.co.id",
    categories: [{ id: "c1", name: "Tekstil & Garmen" }],
    products: [
      { id: "p1", name: "Kain Katun Premium", description: "Katun combed 30s kualitas grade A", unit: "meter", minOrder: 500, leadTimeDays: 7, priceMin: 25000, priceMax: 45000 },
      { id: "p2", name: "Kain Drill Japan", description: "Bahan seragam kerja tahan lama", unit: "meter", minOrder: 300, leadTimeDays: 5, priceMin: 35000, priceMax: 55000 },
    ],
    certifications: [
      { id: "cert1", name: "ISO 9001:2015", issuer: "SGS Indonesia", number: "ID9001-2023", status: "VERIFIED" },
      { id: "cert2", name: "Sertifikat OEKO-TEX Standard 100", issuer: "Testex", number: "TEX-100-2024", status: "VERIFIED" },
    ],
    trustScore: { overall: 94, deliveryScore: 95, responsivenessScore: 92, qualityScore: 96, certificationScore: 90, portfolioScore: 94 },
    _count: { products: 2, certifications: 2, projects: 12 },
  },
  "demo-2": {
    id: "demo-2",
    userId: "demo-user-2",
    businessName: "CV Nusantara Pack",
    tagline: "Kemasan Kraft & Aluminium Foil",
    description: "Produsen kemasan berdiri (standup pouch), karton box, dan aluminium foil untuk industri makanan & FMCG.",
    province: "Jawa Barat",
    city: "Bandung",
    readinessScore: 88,
    verificationStatus: "APPROVED",
    foundedYear: 2018,
    employeeCount: 30,
    phone: "081987654321",
    email: "contact@nusantarapack.id",
    categories: [{ id: "c2", name: "Kemasan" }],
    products: [
      { id: "p3", name: "Standup Pouch Aluminium Foil", description: "Food grade dengan ziplock seal tahan bocor", unit: "pcs", minOrder: 1000, leadTimeDays: 10, priceMin: 1200, priceMax: 2500 },
    ],
    certifications: [
      { id: "cert3", name: "Sertifikat Halal MUI", issuer: "LPPOM MUI", number: "ID3211000012345", status: "VERIFIED" },
    ],
    trustScore: { overall: 90, deliveryScore: 90, responsivenessScore: 88, qualityScore: 92, certificationScore: 88, portfolioScore: 90 },
    _count: { products: 1, certifications: 1, projects: 8 },
  },
  "demo-3": {
    id: "demo-3",
    userId: "demo-user-3",
    businessName: "PT Rempah Nusantara",
    tagline: "Bahan Baku Rempah & Herbal Organik",
    description: "Supplier utama rempah olahan, ekstrak jahe, kunyit, dan tanaman obat bersertifikat BPOM & Halal.",
    province: "Jawa Timur",
    city: "Sidoarjo",
    readinessScore: 95,
    verificationStatus: "APPROVED",
    foundedYear: 2012,
    employeeCount: 80,
    phone: "081122334455",
    email: "sales@rempahnusantara.com",
    categories: [{ id: "c3", name: "Makanan & Minuman" }],
    products: [
      { id: "p4", name: "Ekstrak Jahe Merah Bubuk", description: "Ekstrak murni tanpa gula buatan, kelas ekspor", unit: "kg", minOrder: 100, leadTimeDays: 14, priceMin: 85000, priceMax: 120000 },
    ],
    certifications: [
      { id: "cert4", name: "Izin Edar BPOM RI", issuer: "BPOM RI", number: "MD 223113001889", status: "VERIFIED" },
      { id: "cert5", name: "Sertifikat Halal MUI", issuer: "LPPOM MUI", number: "ID3511000098765", status: "VERIFIED" },
    ],
    trustScore: { overall: 96, deliveryScore: 98, responsivenessScore: 94, qualityScore: 98, certificationScore: 96, portfolioScore: 95 },
    _count: { products: 1, certifications: 2, projects: 25 },
  },
};

export default async function UmkmSupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let supplier = await db.umkmProfile.findUnique({
    where: { id },
    include: {
      products: { where: { isActive: true }, take: 6 },
      certifications: true,
      trustScore: true,
      categories: true,
      _count: { select: { products: true, certifications: true, projects: true } },
    },
  }).catch(() => null);

  if (!supplier && DEMO_SUPPLIERS[id]) {
    supplier = DEMO_SUPPLIERS[id];
  }

  if (!supplier) return notFound();

  const scoreColor = (s: number) => (s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-blue-500" : s >= 40 ? "bg-yellow-500" : "bg-red-500");

  return (
    <div className="space-y-6 text-slate-900">
      <Link href="/umkm/suppliers">
        <Button variant="ghost" className="gap-2 text-slate-600 pl-0 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog &amp; Kompetitor
        </Button>
      </Link>

      {/* Hero */}
      <Card className="overflow-hidden border-0 shadow-sm bg-white">
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-3xl font-bold shadow-lg overflow-hidden">
              {supplier.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={supplier.logo} alt={supplier.businessName} className="h-full w-full object-cover" />
              ) : (
                supplier.businessName.charAt(0)
              )}
            </div>

            <div className="flex-1 pt-10 sm:pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{supplier.businessName}</h1>
                {supplier.verificationStatus === "APPROVED" && (
                  <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                    <Shield className="h-3 w-3" />
                    Terverifikasi
                  </Badge>
                )}
              </div>
              {supplier.tagline && <p className="text-slate-500 text-sm mt-1">{supplier.tagline}</p>}
              {(supplier.province || supplier.city) && (
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 text-rose-500" /> {[supplier.city, supplier.province].filter(Boolean).join(", ")}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {supplier.categories.map((c: any) => (
                  <Badge key={c.id} variant="outline">
                    {c.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Skor Kesiapan", value: `${supplier.readinessScore}/100`, icon: BarChart3, color: "text-emerald-600" },
          { label: "Trust Score", value: `${supplier.trustScore?.overall ?? 0}/100`, icon: Star, color: "text-amber-500" },
          { label: "Total Produk", value: supplier._count.products, icon: Package, color: "text-teal-600" },
          { label: "Sertifikasi", value: supplier._count.certifications, icon: Award, color: "text-indigo-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 text-center">
              <s.icon className={`h-5 w-5 ${s.color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About & Products */}
        <div className="lg:col-span-2 space-y-6">
          {supplier.description && (
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-base">Tentang Usaha / Kompetitor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed">{supplier.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {supplier.products.length > 0 && (
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Katalog Produk Kompetitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supplier.products.map((p: any) => (
                    <div key={p.id} className="rounded-lg border border-slate-100 p-3 hover:border-emerald-200 transition-colors bg-slate-50/50">
                      <p className="font-medium text-sm text-slate-900">{p.name}</p>
                      {p.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-400">
                        {p.unit && <span>Satuan: {p.unit}</span>}
                        {p.minOrder && <span>Min. {p.minOrder}</span>}
                        {p.leadTimeDays && <span>{p.leadTimeDays} hari</span>}
                      </div>
                      {(p.priceMin || p.priceMax) && (
                        <p className="text-xs font-semibold text-emerald-600 mt-1">
                          Rp {(p.priceMin ?? 0).toLocaleString("id-ID")}{" "}
                          {p.priceMax ? `– Rp ${p.priceMax.toLocaleString("id-ID")}` : ""}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certifications */}
          {supplier.certifications.length > 0 && (
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Sertifikasi Usaha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supplier.certifications.map((c: any) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <CheckCircle className={`h-5 w-5 shrink-0 ${c.status === "VERIFIED" ? "text-emerald-500" : "text-slate-300"}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{c.name}</p>
                        {c.issuer && (
                          <p className="text-xs text-slate-500">
                            {c.issuer} {c.number ? `• No. ${c.number}` : ""}
                          </p>
                        )}
                      </div>
                      <Badge className="ml-auto text-xs" variant={c.status === "VERIFIED" ? "default" : "secondary"}>
                        {c.status === "VERIFIED" ? "Terverifikasi" : c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trust Score & Info Sidebar */}
        <div className="space-y-4">
          {supplier.trustScore && (
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-base">Trust Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Pengiriman", value: supplier.trustScore.deliveryScore },
                  { label: "Responsivitas", value: supplier.trustScore.responsivenessScore },
                  { label: "Kualitas", value: supplier.trustScore.qualityScore },
                  { label: "Sertifikasi", value: supplier.trustScore.certificationScore },
                  { label: "Portofolio", value: supplier.trustScore.portfolioScore },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold">{item.value}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${scoreColor(item.value)} transition-all`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base">Info Usaha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {supplier.foundedYear && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Berdiri</span>
                  <span className="font-medium">{supplier.foundedYear}</span>
                </div>
              )}
              {supplier.employeeCount && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Karyawan</span>
                  <span className="font-medium">{supplier.employeeCount} orang</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
