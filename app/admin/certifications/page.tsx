import { db } from "@/lib/db";
import { Award, Clock, Check, X, Loader2, ShieldCheck, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CertApprovalActions from "./cert-actions";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    VERIFIED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
    EXPIRED: "bg-slate-100 text-slate-700",
  };
  return <Badge className={`${map[status] || "bg-slate-100 text-slate-700"} border-0 capitalize`}>{status.toLowerCase()}</Badge>;
}

export default async function AdminCertificationsPage() {
  const certs = await db.certification.findMany({
    include: {
      umkmProfile: {
        select: {
          businessName: true,
          user: { select: { email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingCerts = certs.filter(c => c.status === "PENDING");

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Verifikasi Sertifikasi</h1>
        <p className="text-sm text-slate-500">Tinjau dan verifikasi sertifikat industri yang diajukan oleh UMKM</p>
      </div>

      {/* Grid of Pending */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          Menunggu Verifikasi ({pendingCerts.length})
        </h2>

        {pendingCerts.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-12 text-center text-slate-400">
              <ShieldCheck className="mx-auto h-12 w-12 opacity-30 mb-3 text-emerald-500" />
              <p className="font-semibold">Semua sertifikasi telah diproses</p>
              <p className="text-sm mt-1">Tidak ada pengajuan sertifikasi baru saat ini.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingCerts.map(c => (
              <Card key={c.id} className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 bg-slate-50/50">
                  <CardTitle className="text-sm font-bold">{c.name}</CardTitle>
                  <CardDescription className="text-xs">Diajukan oleh: <span className="font-medium text-slate-700">{c.umkmProfile.businessName}</span></CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="text-xs space-y-2">
                    {c.issuer && <p><span className="text-slate-400">Lembaga Penerbit:</span> <span className="font-semibold">{c.issuer}</span></p>}
                    {c.number && <p><span className="text-slate-400">Nomor Sertifikat:</span> <span className="font-mono">{c.number}</span></p>}
                    <div className="flex gap-4 mt-2">
                      {c.issuedAt && (
                        <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Terbit: {new Date(c.issuedAt).toLocaleDateString("id-ID")}</p>
                      )}
                      {c.expiresAt && (
                        <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Berlaku s.d: {new Date(c.expiresAt).toLocaleDateString("id-ID")}</p>
                      )}
                    </div>
                  </div>

                  {c.documentUrl && (
                    <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-2.5 bg-slate-50 text-xs">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="truncate flex-1 font-mono">Dokumen_Sertifikat.pdf</span>
                      <a href={c.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">Unduh</a>
                    </div>
                  )}

                  <CertApprovalActions certId={c.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Table of all */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Riwayat Verifikasi Sertifikasi</CardTitle>
          <CardDescription>Catatan verifikasi sertifikasi industri platform</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UMKM</TableHead>
                <TableHead>Nama Sertifikasi</TableHead>
                <TableHead>Lembaga Penerbit</TableHead>
                <TableHead>Masa Berlaku</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certs.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{c.umkmProfile.businessName}</p>
                      <p className="text-xs text-slate-400">{c.umkmProfile.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.issuer || "N/A"}</TableCell>
                  <TableCell>
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("id-ID") : "N/A"}
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
