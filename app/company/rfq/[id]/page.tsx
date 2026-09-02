import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, DollarSign, Package, FileText, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuotationsList from "./quotations-list";

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

export default async function RFQDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const rfq = await db.rFQ.findUnique({
    where: { id },
    include: {
      category: true,
      companyProfile: true,
      quotations: {
        include: { umkmProfile: { include: { trustScore: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!rfq) return notFound();

  const s = statusMap[rfq.status] ?? { label: rfq.status, className: "bg-slate-100 text-slate-600" };
  const daysLeft = rfq.deadline ? Math.ceil((rfq.deadline.getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/company/rfq">
          <Button variant="ghost" size="sm" className="gap-1 pl-0 text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Kembali</Button>
        </Link>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${s.className}`}>{s.label}</span>
      </div>

      {/* RFQ Header */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="p-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{rfq.title}</h1>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {rfq.category && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div><p className="text-xs text-slate-400">Kategori</p><p className="text-sm font-medium">{rfq.category.name}</p></div>
              </div>
            )}
            {(rfq.budgetMin || rfq.budgetMax) && (
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div><p className="text-xs text-slate-400">Budget</p><p className="text-sm font-medium">{rfq.budgetMin ? formatRp(rfq.budgetMin) : ""}{rfq.budgetMax ? ` – ${formatRp(rfq.budgetMax)}` : ""}</p></div>
              </div>
            )}
            {rfq.quantity && (
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                <div><p className="text-xs text-slate-400">Kuantitas</p><p className="text-sm font-medium">{rfq.quantity} {rfq.unit || ""}</p></div>
              </div>
            )}
            {rfq.deadline && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Deadline</p>
                  <p className="text-sm font-medium">{rfq.deadline.toLocaleDateString("id-ID")}</p>
                  {daysLeft !== null && <p className={`text-xs ${daysLeft < 0 ? "text-red-500" : daysLeft < 7 ? "text-orange-500" : "text-slate-400"}`}>{daysLeft < 0 ? "Sudah lewat" : `${daysLeft} hari lagi`}</p>}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Deskripsi Kebutuhan</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{rfq.description}</p></CardContent>
          </Card>
          {rfq.specifications && (
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="text-base">Spesifikasi Teknis</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-slate-600 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">{rfq.specifications}</p></CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" />Info Perusahaan</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1 text-slate-600 dark:text-slate-300">
              <p className="font-medium">{rfq.companyProfile.companyName}</p>
              {rfq.companyProfile.city && <p>{rfq.companyProfile.city}, {rfq.companyProfile.province}</p>}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Penawaran Masuk
                <Badge className="ml-auto">{rfq.quotations.length}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Quotations */}
      <QuotationsList quotations={rfq.quotations} rfqId={rfq.id} />
    </div>
  );
}
