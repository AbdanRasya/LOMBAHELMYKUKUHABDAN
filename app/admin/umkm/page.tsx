import { db } from "@/lib/db";
import { Clock, Shield, Star, ShieldCheck, ShieldAlert, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminApprovalActions from "./approval-actions";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
    SUSPENDED: "bg-slate-100 text-slate-700",
  };
  return <Badge className={`${map[status] || "bg-slate-100 text-slate-700"} border-0 capitalize`}>{status.toLowerCase()}</Badge>;
}

export default async function AdminUmkmApprovalPage() {
  const pendingUmkm = await db.umkmProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      categories: true,
      _count: { select: { products: true, certifications: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const allUmkm = await db.umkmProfile.findMany({
    include: {
      user: { select: { name: true, email: true } },
      trustScore: true,
      _count: { select: { products: true, certifications: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Persetujuan UMKM</h1>
        <p className="text-sm text-slate-500">Verifikasi dokumen dan profil pendaftaran UMKM baru</p>
      </div>

      {/* Grid of Pending */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          Menunggu Persetujuan ({pendingUmkm.length})
        </h2>

        {pendingUmkm.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center text-slate-400">
              <ShieldCheck className="mx-auto h-12 w-12 opacity-30 mb-3 text-emerald-500" />
              <p className="font-semibold">Semua bersih!</p>
              <p className="text-sm mt-1">Tidak ada pendaftaran UMKM yang tertunda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingUmkm.map(umkm => (
              <Card key={umkm.id} className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 bg-slate-50/50 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold">{umkm.businessName}</CardTitle>
                    <CardDescription className="text-xs">{umkm.user.email} • Terdaftar {new Date(umkm.createdAt).toLocaleDateString("id-ID")}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">{umkm.province || "N/A"}</Badge>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg"><p className="font-bold">{umkm._count.products}</p><p className="text-slate-400">Produk</p></div>
                    <div className="bg-slate-50 p-2 rounded-lg"><p className="font-bold">{umkm._count.certifications}</p><p className="text-slate-400">Sertifikasi</p></div>
                    <div className="bg-slate-50 p-2 rounded-lg"><p className="font-bold">{umkm.readinessScore}/100</p><p className="text-slate-400">Readiness</p></div>
                  </div>
                  
                  <div className="text-xs space-y-1.5 border-t border-slate-100 pt-3">
                    {umkm.nib && <p><span className="text-slate-400">NIB:</span> <span className="font-mono">{umkm.nib}</span></p>}
                    {umkm.npwp && <p><span className="text-slate-400">NPWP:</span> <span className="font-mono">{umkm.npwp}</span></p>}
                  </div>

                  <AdminApprovalActions umkmId={umkm.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Table of all */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Daftar Semua UMKM</CardTitle>
          <CardDescription>Status seluruh UMKM terdaftar di platform</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Bisnis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Kesiapan</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Sertifikat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUmkm.map(umkm => (
                <TableRow key={umkm.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{umkm.businessName}</p>
                      <p className="text-xs text-slate-400">{umkm.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(umkm.verificationStatus)}</TableCell>
                  <TableCell>{umkm.city || "N/A"}, {umkm.province || "N/A"}</TableCell>
                  <TableCell><span className="font-semibold">{umkm.readinessScore}</span>/100</TableCell>
                  <TableCell>{umkm._count.products}</TableCell>
                  <TableCell>{umkm._count.certifications}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
