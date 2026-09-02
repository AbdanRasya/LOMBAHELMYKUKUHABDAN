import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, Calendar, DollarSign, Package, ArrowRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default async function UmkmRfqFeedPage() {
  const rfqs = await db.rFQ.findMany({
    where: { status: "OPEN", deletedAt: null },
    include: {
      companyProfile: true,
      category: true,
      _count: { select: { quotations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pasar RFQ</h1>
        <p className="text-sm text-slate-500">Lihat permintaan penawaran aktif dari berbagai perusahaan nasional</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">RFQ Aktif</p><p className="text-2xl font-bold">{rfqs.length}</p></div>
            <FileText className="h-8 w-8 text-emerald-600 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {rfqs.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <FileText className="mx-auto h-14 w-14 opacity-30 mb-4" />
          <h3 className="font-semibold">Belum ada RFQ Aktif</h3>
          <p className="text-sm mt-1">Saat ini tidak ada RFQ terbuka dari perusahaan pembeli.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rfqs.map(rfq => (
            <Card key={rfq.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">{rfq.title}</h3>
                    {rfq.category && <Badge variant="outline" className="text-xs">{rfq.category.name}</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{rfq.companyProfile.companyName} • {rfq.companyProfile.city || "N/A"}</p>
                  
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500">
                    {rfq.quantity && <div>Kuantitas: {rfq.quantity} {rfq.unit || ""}</div>}
                    {rfq.deadline && <div>Batas: {new Date(rfq.deadline).toLocaleDateString("id-ID")}</div>}
                    {rfq.budgetMax && <div>Budget Maks: {formatRp(rfq.budgetMax)}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Penawaran</p>
                    <p className="text-sm font-bold flex items-center gap-1 justify-end mt-0.5"><MessageSquare className="h-4 w-4" /> {rfq._count.quotations}</p>
                  </div>
                  <Link href={`/umkm/rfq/${rfq.id}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                      Detail RFQ <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
