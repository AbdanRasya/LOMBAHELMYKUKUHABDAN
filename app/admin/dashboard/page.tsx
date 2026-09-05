import { db } from "@/lib/db";
import { Users, FileText, CheckCircle, Award, Activity, ShieldAlert, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminOverviewCharts from "./overview-charts";

export default async function AdminDashboardPage() {
  const [totalUsers, totalUmkm, totalCompanies, totalRfqs, totalQuotations, pendingUmkm, recentLogs] = await Promise.all([
    db.user.count(),
    db.umkmProfile.count(),
    db.companyProfile.count(),
    db.rFQ.count({ where: { deletedAt: null } }),
    db.quotation.count(),
    db.umkmProfile.count({ where: { verificationStatus: "PENDING" } }),
    db.systemLog.findMany({ include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Total Pengguna", value: totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "UMKM Terdaftar", value: totalUmkm, icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Perusahaan", value: totalCompanies, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total RFQ", value: totalRfqs, icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Total Penawaran", value: totalQuotations, icon: CheckCircle, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Persetujuan Pending", value: pendingUmkm, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-sm text-slate-500">Ringkasan operasional platform dan kesehatan ekosistem PUSAKA</p>
        </div>
      </div>

      {pendingUmkm > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 border shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 animate-bounce" />
            <div>
              <p className="font-semibold text-amber-950">Persetujuan UMKM Tertunda</p>
              <p className="text-xs text-amber-700">Ada {pendingUmkm} UMKM baru yang mendaftar dan menunggu verifikasi profil/NIB oleh admin.</p>
            </div>
            <Link href="/admin/umkm" className="ml-auto shrink-0">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Tinjau Sekarang</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {cards.map(c => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex flex-col justify-between h-28">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">{c.label}</span>
                <div className={`h-8 w-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                  <c.icon className={`h-4.5 w-4.5 ${c.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4.5 w-4.5" />Pertumbuhan Pendaftaran</CardTitle></CardHeader>
            <CardContent>
              <AdminOverviewCharts />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Aksi Cepat</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/admin/umkm"><Button className="w-full justify-start text-xs" variant="outline">Verifikasi UMKM ({pendingUmkm})</Button></Link>
              <Link href="/admin/certifications"><Button className="w-full justify-start text-xs" variant="outline">Verifikasi Sertifikasi</Button></Link>
              <Link href="/admin/categories"><Button className="w-full justify-start text-xs" variant="outline">Kelola Kategori</Button></Link>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between"><CardTitle className="text-base">Log Aktivitas</CardTitle><Link href="/admin/logs"><Button size="sm" variant="ghost" className="text-xs text-blue-600">Lihat semua</Button></Link></CardHeader>
            <CardContent className="p-0">
              {recentLogs.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-400">Belum ada log sistem.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentLogs.map(l => (
                    <div key={l.id} className="p-3.5 hover:bg-slate-50 transition-colors text-xs flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{l.action.toLowerCase().replace(/_/g, " ")}</p>
                        <p className="text-[10px] text-slate-400">{l.user?.name || "System"} • {new Date(l.createdAt).toLocaleDateString("id-ID")}</p>
                      </div>
                      <Badge className="text-[9px] border-0" variant="outline">{l.entity || "system"}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
