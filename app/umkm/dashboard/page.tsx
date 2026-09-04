import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Award, FileText, Send, Star, ShieldCheck, Target, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function UmkmDashboardPage() {
  const session = await auth();
  const umkm = session?.user?.id
    ? await db.umkmProfile.findUnique({
        where: { userId: session.user.id },
        include: {
          trustScore: true,
          products: { where: { isActive: true } },
          certifications: true,
          _count: { select: { quotations: true } },
        },
      })
    : null;

  const [availableRfqs] = await Promise.all([
    db.rFQ.findMany({
      where: { status: "OPEN", deletedAt: null },
      include: { category: true, companyProfile: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const cards = [
    { label: "Penawaran Terkirim", value: umkm?._count.quotations ?? 0, icon: Send, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Sertifikasi Industri", value: umkm?.certifications.length ?? 0, icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Produk Aktif", value: umkm?.products.length ?? 0, icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Trust Score", value: `${umkm?.trustScore?.overall ?? 0}/100`, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Selamat datang, {umkm?.businessName || session?.user?.name || "UMKM Partner"} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Pantau performa penawaran Anda dan peluang pengadaan terbaru</p>
        </div>
      </div>

      {umkm ? (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-xs">
                    Profile Completion: {umkm.profileCompleteness || 75}%
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">Readiness Score: <strong className="text-emerald-700">{umkm.readinessScore || 82}/100</strong></span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Profil Bisnis Anda 75% Lengkap</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lengkapi sertifikasi (Halal, SNI, ISO) dan kapasitas produksi bulanan untuk meningkatkan peluang ditemukan buyer/perusahaan hingga 3.5x lebih cepat.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/umkm/profile">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 text-xs font-medium h-10 px-5">
                    Lengkapi Sertifikasi & Produksi <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-emerald-50/50 border shadow-sm rounded-2xl">
          <CardContent className="flex items-center gap-4 p-5">
            <Target className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-950">Lengkapi Profil Bisnis Anda</p>
              <p className="text-xs text-emerald-700">Buat profil bisnis Anda agar dapat mengajukan penawaran terhadap RFQ industri.</p>
            </div>
            <Link href="/umkm/profile" className="ml-auto shrink-0">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Setup Profil</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {cards.map(c => (
              <Card key={c.label} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                    <c.icon className={`h-5 w-5 ${c.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{c.label}</p>
                    <p className="text-xl font-bold mt-0.5">{c.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Available RFQs */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">RFQ Terbaru di Pasar</CardTitle>
                <CardDescription>Peluang pengadaan yang cocok dengan profil kategori Anda</CardDescription>
              </div>
              <Link href="/umkm/rfq"><Button variant="ghost" size="sm" className="text-emerald-600 text-xs">Lihat Semua Pasar</Button></Link>
            </CardHeader>
            <CardContent className="p-0">
              {availableRfqs.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">Tidak ada RFQ terbuka saat ini.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {availableRfqs.map(rfq => (
                    <div key={rfq.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{rfq.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{rfq.companyProfile.companyName} • {rfq.category?.name || "N/A"}</p>
                      </div>
                      <Link href={`/umkm/rfq/${rfq.id}`} className="ml-4 shrink-0">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                          Lihat RFQ <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {umkm && (
            <Card className="border-0 shadow-sm text-center">
              <CardHeader className="pb-2"><CardTitle className="text-base">Skor Kesiapan AI</CardTitle></CardHeader>
              <CardContent className="p-5 flex flex-col items-center">
                <div className="relative h-28 w-28 flex items-center justify-center mb-4">
                  <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray={`${umkm.readinessScore} 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-2xl font-bold text-slate-900">{umkm.readinessScore}</span>
                </div>
                <p className="text-xs text-slate-500 px-4">Lengkapi profil legal, mesin produksi, dan sertifikasi untuk meningkatkan skor Anda.</p>
                <Link href="/umkm/readiness" className="mt-4 w-full">
                  <Button size="sm" variant="outline" className="w-full text-xs">Analisis Kesiapan</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {umkm && umkm.verificationStatus === "PENDING" && (
            <Card className="border-amber-100 bg-amber-50/20 border shadow-sm">
              <CardContent className="p-4 flex gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-semibold">Verifikasi Sedang Diproses</p>
                  <p className="mt-1">Pendaftaran verifikasi profil/NIB Anda sedang diperiksa oleh admin. Silakan tunggu pemberitahuan selanjutnya.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
