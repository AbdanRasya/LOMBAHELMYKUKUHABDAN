import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, Calendar, DollarSign, Package, Plus, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const statusMap: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  OPEN: { label: "Terbuka", className: "bg-blue-100 text-blue-700" },
  IN_REVIEW: { label: "Ditinjau", className: "bg-yellow-100 text-yellow-700" },
  AWARDED: { label: "Diberikan", className: "bg-purple-100 text-purple-700" },
  COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-700" },
};

export default async function CompanyRfqPage() {
  const session = await auth();
  const company = session?.user?.id
    ? await db.companyProfile.findUnique({ where: { userId: session.user.id } })
    : null;

  const rfqs = company
    ? await db.rFQ.findMany({
        where: { companyId: company.id, deletedAt: null },
        include: { category: true, _count: { select: { quotations: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daftar RFQ Saya</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola penawaran dan negosiasi dari satu tempat</p>
        </div>
        <Link href="/company/rfq/create">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus className="h-4 w-4" /> Buat RFQ Baru
          </Button>
        </Link>
      </div>

      {rfqs.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <FileText className="mx-auto h-14 w-14 opacity-30 mb-4" />
          <h3 className="font-semibold text-slate-700">Belum ada RFQ</h3>
          <p className="text-sm text-slate-500 mt-1 mb-5">Mulai posting kebutuhan produk/jasa Anda ke ekosistem supplier.</p>
          <Link href="/company/rfq/create"><Button className="bg-blue-600 hover:bg-blue-700 text-white">Buat RFQ Sekarang</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rfqs.map(rfq => {
            const st = statusMap[rfq.status] ?? { label: rfq.status, className: "bg-slate-100 text-slate-600" };
            return (
              <Card key={rfq.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 truncate">{rfq.title}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${st.className}`}>{st.label}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500">
                      {rfq.category && <div className="truncate">Kategori: {rfq.category.name}</div>}
                      {rfq.quantity && <div>Kuantitas: {rfq.quantity} {rfq.unit || ""}</div>}
                      {rfq.deadline && <div>Batas: {new Date(rfq.deadline).toLocaleDateString("id-ID")}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Penawaran Masuk</p>
                      <p className="text-lg font-bold text-blue-600 flex items-center gap-1 justify-end mt-0.5">
                        <MessageCircle className="h-4.5 w-4.5" />
                        {rfq._count.quotations}
                      </p>
                    </div>
                    <Link href={`/company/rfq/${rfq.id}`}>
                      <Button size="sm" variant="outline" className="text-xs text-blue-600 hover:bg-blue-50">Kelola</Button>
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
