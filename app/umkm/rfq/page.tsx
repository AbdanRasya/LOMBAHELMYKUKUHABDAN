import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, ArrowRight, MessageSquare, Sparkles, Send, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const DEMO_RFQS = [
  {
    id: "demo-rfq-1",
    title: "Pengadaan Bahan Kain Katun Combed 30s untuk Seragam Industri",
    companyProfile: { companyName: "PT Bumi Tekstil Nusantara", city: "Bandung" },
    category: { name: "Tekstil & Garmen" },
    quantity: 10000,
    unit: "meter",
    deadline: new Date(Date.now() + 14 * 86400000),
    budgetMax: 350000000,
    targetUmkmId: null,
    _count: { quotations: 4 },
  },
  {
    id: "demo-rfq-2",
    title: "Kemasan Standup Pouch Kraft & Foil Food-Grade 250g",
    companyProfile: { companyName: "PT Foodindo Utama", city: "Jakarta Selatan" },
    category: { name: "Kemasan & Packaging" },
    quantity: 50000,
    unit: "pcs",
    deadline: new Date(Date.now() + 10 * 86400000),
    budgetMax: 85000000,
    targetUmkmId: null,
    _count: { quotations: 6 },
  },
  {
    id: "demo-rfq-3",
    title: "Pasokan Bahan Baku Ekstrak Jahe Merah & Temulawak Organik",
    companyProfile: { companyName: "PT Jamu Herbal Indonesia", city: "Semarang" },
    category: { name: "Makanan & Minuman" },
    quantity: 500,
    unit: "kg",
    deadline: new Date(Date.now() + 21 * 86400000),
    budgetMax: 60000000,
    targetUmkmId: null,
    _count: { quotations: 2 },
  },
];

export default async function UmkmRfqFeedPage() {
  const session = await auth();
  const umkm = session?.user?.id
    ? await db.umkmProfile.findUnique({ where: { userId: session.user.id } }).catch(() => null)
    : null;

  let dbRfqs = await db.rFQ.findMany({
    where: {
      status: "OPEN",
      deletedAt: null,
      OR: [
        { targetUmkmId: null }, // RFQ Umum (Global)
        ...(umkm?.id ? [{ targetUmkmId: umkm.id }] : []), // Direct RFQ khusus UMKM ini
      ],
    },
    include: {
      companyProfile: true,
      category: true,
      _count: { select: { quotations: true } },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const rfqs = dbRfqs.length > 0 ? dbRfqs : DEMO_RFQS;

  const directRfqsCount = rfqs.filter((r) => r.targetUmkmId !== null).length;
  const globalRfqsCount = rfqs.filter((r) => r.targetUmkmId === null).length;

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pasar RFQ & Permintaan Penawaran</h1>
        <p className="text-sm text-slate-500">
          Lihat permintaan penawaran umum dan permintaan direct khusus untuk usaha Anda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Total RFQ Tersedia</p>
              <p className="text-2xl font-bold text-slate-900">{rfqs.length}</p>
            </div>
            <FileText className="h-8 w-8 text-emerald-600 opacity-20" />
          </CardContent>
        </Card>

        <Card className="border border-indigo-100 bg-indigo-50/50 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-600 font-medium">Permintaan Direct (Khusus)</p>
              <p className="text-2xl font-bold text-indigo-900">{directRfqsCount}</p>
            </div>
            <Send className="h-8 w-8 text-indigo-600 opacity-30" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">RFQ Umum / Publik</p>
              <p className="text-2xl font-bold text-slate-900">{globalRfqsCount}</p>
            </div>
            <Globe className="h-8 w-8 text-slate-400 opacity-30" />
          </CardContent>
        </Card>
      </div>

      {rfqs.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <FileText className="mx-auto h-14 w-14 opacity-30 mb-4" />
          <h3 className="font-semibold text-slate-700">Belum ada RFQ Aktif</h3>
          <p className="text-sm mt-1 text-slate-400">Saat ini tidak ada permintaan penawaran terbuka untuk Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rfqs.map((rfq) => {
            const isDirect = rfq.targetUmkmId !== null;
            return (
              <Card
                key={rfq.id}
                className={`transition-all overflow-hidden ${
                  isDirect
                    ? "border-2 border-indigo-400 bg-gradient-to-r from-indigo-50/40 via-white to-white shadow-md"
                    : "border border-slate-100 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isDirect && (
                        <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1 px-2.5 py-0.5 shadow-sm">
                          <Sparkles className="h-3 w-3" /> Direct Request (Khusus Anda)
                        </Badge>
                      )}
                      <h3 className="font-bold text-slate-900 text-base truncate">{rfq.title}</h3>
                      {rfq.category && (
                        <Badge variant="outline" className="text-xs">
                          {rfq.category.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">
                      {rfq.companyProfile.companyName} • {rfq.companyProfile.city || "Lokasi N/A"}
                    </p>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                      {rfq.quantity && (
                        <div className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          Kuantitas: <span className="font-semibold text-slate-900">{rfq.quantity} {rfq.unit || ""}</span>
                        </div>
                      )}
                      {rfq.deadline && (
                        <div className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          Batas: <span className="font-semibold text-slate-900">{new Date(rfq.deadline).toLocaleDateString("id-ID")}</span>
                        </div>
                      )}
                      {rfq.budgetMax && (
                        <div className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          Budget Maks: <span className="font-semibold text-emerald-600">{formatRp(rfq.budgetMax)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Penawaran</p>
                      <p className="text-sm font-bold flex items-center gap-1 justify-end mt-0.5 text-slate-700">
                        <MessageSquare className="h-4 w-4 text-emerald-600" /> {rfq._count.quotations}
                      </p>
                    </div>
                    <Link href={`/umkm/rfq/${rfq.id}`}>
                      <Button
                        size="sm"
                        className={`${
                          isDirect
                            ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        } text-white text-xs gap-1.5 rounded-xl font-medium px-4 py-2`}
                      >
                        Respon Penawaran <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
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
