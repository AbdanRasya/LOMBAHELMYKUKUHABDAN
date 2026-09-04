import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Shield, Star, Package, Award, CheckCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactSupplierButton from "@/components/suppliers/contact-supplier-button";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await db.umkmProfile.findUnique({
    where: { id },
    include: {
      products: { where: { isActive: true }, take: 6 },
      certifications: true,
      trustScore: true,
      categories: true,
      _count: { select: { products: true, certifications: true, projects: true } },
    },
  });

  if (!supplier) return notFound();

  const scoreColor = (s: number) => s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-blue-500" : s >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="space-y-6 text-slate-900">
      <Link href="/company/suppliers">
        <Button variant="ghost" className="gap-2 text-slate-600 pl-0 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Pencarian
        </Button>
      </Link>

      {/* Hero */}
      <Card className="overflow-hidden border-0 shadow-sm">
        {supplier.coverImage ? (
          <div className="h-40 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={supplier.coverImage} alt="Cover" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        )}
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-bold shadow-lg overflow-hidden">
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
                  <Badge className="bg-emerald-100 text-emerald-700 gap-1"><Shield className="h-3 w-3" />Terverifikasi</Badge>
                )}
              </div>
              {supplier.tagline && <p className="text-slate-500 text-sm mt-1">{supplier.tagline}</p>}
              {(supplier.province || supplier.city) && (
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4" /> {[supplier.city, supplier.province].filter(Boolean).join(", ")}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {supplier.categories.map(c => <Badge key={c.id} variant="outline">{c.name}</Badge>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <ContactSupplierButton otherUserId={supplier.userId} />
              <Link href={`/company/rfq/create`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Buat RFQ</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Skor Kesiapan", value: `${supplier.readinessScore}/100`, icon: BarChart3, color: "text-blue-600" },
          { label: "Trust Score", value: `${supplier.trustScore?.overall ?? 0}/100`, icon: Star, color: "text-yellow-500" },
          { label: "Total Produk", value: supplier._count.products, icon: Package, color: "text-indigo-600" },
          { label: "Sertifikasi", value: supplier._count.certifications, icon: Award, color: "text-emerald-600" },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <s.icon className={`h-5 w-5 ${s.color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About */}
        <div className="lg:col-span-2 space-y-6">
          {supplier.description && (
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="text-base">Tentang Perusahaan</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-slate-600 leading-relaxed">{supplier.description}</p></CardContent>
            </Card>
          )}

          {/* Products */}
          {supplier.products.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-blue-600" />Produk & Layanan</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supplier.products.map(p => (
                    <div key={p.id} className="rounded-lg border border-slate-100 p-3 hover:border-blue-200 transition-colors">
                      <p className="font-medium text-sm text-slate-900">{p.name}</p>
                      {p.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-400">
                        {p.unit && <span>Satuan: {p.unit}</span>}
                        {p.minOrder && <span>Min. {p.minOrder}</span>}
                        {p.leadTimeDays && <span>{p.leadTimeDays} hari</span>}
                      </div>
                      {(p.priceMin || p.priceMax) && (
                        <p className="text-xs font-medium text-blue-600 mt-1">
                          Rp {(p.priceMin ?? 0).toLocaleString("id-ID")} {p.priceMax ? `– Rp ${p.priceMax.toLocaleString("id-ID")}` : ""}
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
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-emerald-600" />Sertifikasi</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supplier.certifications.map(c => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <CheckCircle className={`h-5 w-5 shrink-0 ${c.status === "VERIFIED" ? "text-emerald-500" : "text-slate-300"}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{c.name}</p>
                        {c.issuer && <p className="text-xs text-slate-500">{c.issuer} {c.number ? `• No. ${c.number}` : ""}</p>}
                      </div>
                      <Badge className="ml-auto text-xs" variant={c.status === "VERIFIED" ? "default" : "secondary"}>{c.status === "VERIFIED" ? "Terverifikasi" : c.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trust Score Sidebar */}
        <div className="space-y-4">
          {supplier.trustScore && (
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="text-base">Trust Score Detail</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Pengiriman", value: supplier.trustScore.deliveryScore },
                  { label: "Responsivitas", value: supplier.trustScore.responsivenessScore },
                  { label: "Kualitas", value: supplier.trustScore.qualityScore },
                  { label: "Sertifikasi", value: supplier.trustScore.certificationScore },
                  { label: "Portofolio", value: supplier.trustScore.portfolioScore },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold">{item.value}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${scoreColor(item.value)} transition-all`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Company Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Info Bisnis</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {supplier.foundedYear && <div className="flex justify-between"><span className="text-slate-500">Berdiri</span><span className="font-medium">{supplier.foundedYear}</span></div>}
              {supplier.employeeCount && <div className="flex justify-between"><span className="text-slate-500">Karyawan</span><span className="font-medium">{supplier.employeeCount} orang</span></div>}
              {supplier.phone && <div className="flex justify-between"><span className="text-slate-500">Telepon</span><span className="font-medium">{supplier.phone}</span></div>}
              {supplier.email && <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium truncate max-w-36">{supplier.email}</span></div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
