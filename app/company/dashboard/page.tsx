import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, BarChart3, Plus, Sparkles, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-600",
    OPEN: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-yellow-100 text-yellow-700",
    AWARDED: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  const label: Record<string, string> = {
    DRAFT: "Draft", OPEN: "Terbuka", IN_REVIEW: "Ditinjau",
    AWARDED: "Diberikan", COMPLETED: "Selesai", CANCELLED: "Dibatalkan",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || "bg-slate-100 text-slate-600"}`}>{label[status] || status}</span>;
}

export default async function CompanyDashboardPage() {
  const session = await auth();
  const company = session?.user?.id
    ? await db.companyProfile.findUnique({ where: { userId: session.user.id } })
    : null;

  const [activeRfqs, savedCount, totalQuotations, recentRfqs] = await Promise.all([
    company ? db.rFQ.count({ where: { companyId: company.id, status: "OPEN", deletedAt: null } }) : Promise.resolve(0),
    session?.user?.id ? db.savedSupplier.count({ where: { userId: session.user.id } }) : Promise.resolve(0),
    company ? db.quotation.count({ where: { rfq: { companyId: company.id } } }) : Promise.resolve(0),
    company ? db.rFQ.findMany({ where: { companyId: company.id, deletedAt: null }, include: { category: true, _count: { select: { quotations: true } } }, orderBy: { createdAt: "desc" }, take: 5 }) : Promise.resolve([]),
  ]);

  const stats = [
    { label: "RFQ Aktif", value: activeRfqs, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+2 minggu ini" },
    { label: "Tersimpan", value: savedCount, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", trend: "supplier favorit" },
    { label: "Total Penawaran", value: totalQuotations, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "dari semua RFQ" },
    { label: "Aktif Bulan Ini", value: activeRfqs, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", trend: "sedang berjalan" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Selamat datang, {company?.companyName || session?.user?.name || "Pengguna"} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {company ? "Kelola procurement dan temukan supplier terbaik." : "Lengkapi profil perusahaan Anda untuk mulai."}
          </p>
        </div>
        <Link href="/company/rfq/create">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus className="h-4 w-4" /> Buat RFQ Baru
          </Button>
        </Link>
      </div>

      {!company && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center gap-4 p-6">
            <Sparkles className="h-8 w-8 text-blue-600 shrink-0" />
            <div>
              <p className="font-semibold text-blue-900">Lengkapi Profil Perusahaan</p>
              <p className="text-sm text-blue-700">Tambahkan info perusahaan Anda agar supplier dapat mengenal bisnis Anda.</p>
            </div>
            <Link href="/company/settings" className="ml-auto shrink-0">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Setup Profil</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.trend}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { href: "/company/rfq/create", icon: FileText, label: "Buat RFQ", desc: "Posting kebutuhan baru", color: "bg-blue-600 hover:bg-blue-700" },
          { href: "/company/suppliers", icon: Users, label: "Cari Supplier", desc: "Temukan mitra terpercaya", color: "bg-indigo-600 hover:bg-indigo-700" },
          { href: "/company/ai-match", icon: Sparkles, label: "AI Matching", desc: "Cocokkan dengan AI", color: "bg-purple-600 hover:bg-purple-700" },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <div className={`${a.color} rounded-xl p-5 text-white cursor-pointer transition-all hover:scale-[1.02] shadow-md`}>
              <a.icon className="h-7 w-7 mb-3 opacity-90" />
              <p className="font-semibold">{a.label}</p>
              <p className="text-sm opacity-75">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent RFQs */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">RFQ Terbaru</CardTitle>
          <Link href="/company/rfq"><Button variant="ghost" size="sm" className="text-blue-600">Lihat semua</Button></Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentRfqs.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="mx-auto h-10 w-10 opacity-40 mb-3" />
              <p>Belum ada RFQ. <Link href="/company/rfq/create" className="text-blue-600 underline">Buat sekarang</Link></p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentRfqs.map((rfq) => (
                <div key={rfq.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{rfq.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {rfq.category && <Badge variant="outline" className="text-xs">{rfq.category.name}</Badge>}
                      <span className="text-xs text-slate-400">{rfq._count.quotations} penawaran</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    {statusBadge(rfq.status)}
                    <Link href={`/company/rfq/${rfq.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-blue-600">Detail →</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
