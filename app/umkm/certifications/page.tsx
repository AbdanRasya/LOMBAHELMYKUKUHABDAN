import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Award, Shield, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CertUploadDialog from "@/components/certifications/cert-upload-dialog";

const statusConfig: Record<string, { label: string; icon: typeof Shield; cls: string }> = {
  VERIFIED: { label: "Terverifikasi", icon: Shield, cls: "text-emerald-600 bg-emerald-50" },
  PENDING: { label: "Menunggu Verifikasi", icon: Clock, cls: "text-yellow-600 bg-yellow-50" },
  REJECTED: { label: "Ditolak", icon: XCircle, cls: "text-red-600 bg-red-50" },
  EXPIRED: { label: "Kadaluarsa", icon: AlertTriangle, cls: "text-gray-500 bg-gray-50" },
};

export default async function UMKMCertificationsPage() {
  const session = await auth();
  const umkm = session?.user?.id
    ? await db.umkmProfile.findUnique({ where: { userId: session.user.id } })
    : null;

  const certs = umkm
    ? await db.certification.findMany({
        where: { umkmId: umkm.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const verified = certs.filter(c => c.status === "VERIFIED").length;
  const pending = certs.filter(c => c.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sertifikasi Legal & Mutu</h1>
          <p className="text-sm text-slate-500 mt-1">{verified} terverifikasi · {pending} menunggu verifikasi</p>
        </div>
        <CertUploadDialog />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[["Total", certs.length, "text-slate-700"], ["Verified", verified, "text-emerald-600"], ["Pending", pending, "text-yellow-600"], ["Ditolak", certs.filter(c => c.status === "REJECTED").length, "text-red-600"]].map(([l, v, cls]) => (
          <Card key={l as string} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${cls}`}>{v}</p>
              <p className="text-xs text-slate-500 mt-0.5">{l}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {certs.length === 0 ? (
        <div className="py-20 text-center">
          <Award className="mx-auto h-14 w-14 text-slate-200 mb-4" />
          <h3 className="font-semibold text-slate-700">Belum ada sertifikasi</h3>
          <p className="text-sm text-slate-500 mt-1 mb-5">Tambahkan sertifikasi untuk meningkatkan kepercayaan pembeli.</p>
          <Link href="/umkm/profile"><Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Tambah Sertifikasi</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {certs.map(cert => {
            const cfg = statusConfig[cert.status] ?? statusConfig.PENDING;
            const Icon = cfg.icon;
            return (
              <Card key={cert.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.cls}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">{cert.name}</h3>
                        <Badge className={`text-xs shrink-0 border-0 ${cfg.cls}`}>{cfg.label}</Badge>
                      </div>
                      {cert.issuer && <p className="text-xs text-slate-500 mt-0.5">{cert.issuer}</p>}
                      {cert.number && <p className="text-xs text-slate-400 font-mono mt-0.5">No. {cert.number}</p>}
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                        {cert.issuedAt && <span>Terbit: {new Date(cert.issuedAt).toLocaleDateString("id-ID")}</span>}
                        {cert.expiresAt && (
                          <span className={new Date(cert.expiresAt) < new Date() ? "text-red-500" : ""}>
                            Berlaku hingga: {new Date(cert.expiresAt).toLocaleDateString("id-ID")}
                          </span>
                        )}
                      </div>
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
