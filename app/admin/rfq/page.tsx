import { db } from "@/lib/db";
import { FileText, Calendar, DollarSign, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

function formatRp(n: number) {
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
  return <Badge className={`${map[status] || "bg-slate-100 text-slate-700"} border-0 capitalize`}>{status.toLowerCase()}</Badge>;
}

export default async function AdminRfqPage() {
  const rfqs = await db.rFQ.findMany({
    include: {
      companyProfile: true,
      category: true,
      _count: { select: { quotations: true } },
    },
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const activeRfqs = rfqs.filter(r => r.status === "OPEN").length;
  const completedRfqs = rfqs.filter(r => r.status === "COMPLETED").length;

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Semua RFQ</h1>
        <p className="text-sm text-slate-500">Monitor seluruh Request for Quotation yang diposting oleh Perusahaan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">Total RFQ</p><p className="text-2xl font-bold">{rfqs.length}</p></div>
            <FileText className="h-8 w-8 text-blue-600 opacity-20" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">RFQ Terbuka</p><p className="text-2xl font-bold">{activeRfqs}</p></div>
            <FileText className="h-8 w-8 text-emerald-600 opacity-20" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">RFQ Selesai</p><p className="text-2xl font-bold">{completedRfqs}</p></div>
            <FileText className="h-8 w-8 text-purple-600 opacity-20" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Daftar RFQ Platform</CardTitle>
          <CardDescription>Semua RFQ aktif dan riwayat RFQ</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Judul Kebutuhan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Estimasi Budget</TableHead>
                <TableHead>Penawaran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map(rfq => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-semibold">{rfq.companyProfile.companyName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{rfq.title}</p>
                      <p className="text-xs text-slate-400 font-mono">ID: {rfq.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{rfq.category?.name || "N/A"}</TableCell>
                  <TableCell>
                    {rfq.budgetMin ? formatRp(rfq.budgetMin) : ""}{rfq.budgetMax ? ` – ${formatRp(rfq.budgetMax)}` : "N/A"}
                  </TableCell>
                  <TableCell className="font-bold">{rfq._count.quotations}</TableCell>
                  <TableCell>{statusBadge(rfq.status)}</TableCell>
                  <TableCell>{new Date(rfq.createdAt).toLocaleDateString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
