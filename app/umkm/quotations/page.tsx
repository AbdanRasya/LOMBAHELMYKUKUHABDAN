import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const statusMap: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Menunggu", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  ACCEPTED: { label: "Diterima", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Ditolak", cls: "bg-red-100 text-red-700 border-red-200" },
  NEGOTIATING: { label: "Negosiasi", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  WITHDRAWN: { label: "Ditarik", cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

export default async function UMKMQuotationsPage() {
  const session = await auth();
  const umkm = session?.user?.id
    ? await db.umkmProfile.findUnique({ where: { userId: session.user.id } })
    : null;

  const quotations = umkm
    ? await db.quotation.findMany({
        where: { umkmId: umkm.id },
        include: { rfq: { include: { companyProfile: true, category: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const counts = { all: quotations.length, PENDING: 0, ACCEPTED: 0, REJECTED: 0 };
  quotations.forEach(q => { if (q.status in counts) (counts as Record<string, number>)[q.status]++; });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Penawaran Saya</h1>
        <p className="text-sm text-slate-500 mt-1">Pantau status semua penawaran yang telah Anda kirimkan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[["Total", counts.all, "text-slate-700"], ["Menunggu", counts.PENDING, "text-yellow-600"], ["Diterima", counts.ACCEPTED, "text-emerald-600"], ["Ditolak", counts.REJECTED, "text-red-600"]].map(([label, val, cls]) => (
          <Card key={label as string} className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${cls}`}>{val}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotations.length === 0 ? (
        <div className="py-20 text-center">
          <FileText className="mx-auto h-14 w-14 text-slate-200 mb-4" />
          <h3 className="font-semibold text-slate-700">Belum ada penawaran</h3>
          <p className="text-sm text-slate-500 mt-1 mb-5">Lihat RFQ yang tersedia dan kirimkan penawaran Anda.</p>
          <Link href="/umkm/rfq"><Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Lihat Pasar RFQ</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotations.map(q => {
            const st = statusMap[q.status] ?? { label: q.status, cls: "bg-slate-100 text-slate-600 border-slate-200" };
            return (
              <Card key={q.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">{q.rfq.title}</h3>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{q.rfq.companyProfile.companyName}</span>
                        {q.rfq.category && <Badge variant="outline" className="text-xs">{q.rfq.category.name}</Badge>}
                        <span>{new Date(q.createdAt).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-emerald-600">{formatRp(q.price)}</p>
                      {q.leadTimeDays && <p className="text-xs text-slate-400">{q.leadTimeDays} hari</p>}
                    </div>
                  </div>
                  {q.notes && <p className="mt-3 text-sm text-slate-500 bg-slate-50 rounded-lg p-3 line-clamp-2">{q.notes}</p>}
                  <div className="mt-3 flex justify-end">
                    <Link href={`/umkm/rfq/${q.rfq.id}`}>
                      <Button variant="ghost" size="sm" className="text-emerald-600 gap-1">Lihat RFQ <ArrowRight className="h-3.5 w-3.5" /></Button>
                    </Link>
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
