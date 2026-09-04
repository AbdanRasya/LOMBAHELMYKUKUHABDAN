"use client";

import { useState } from "react";
import { Shield, Clock, CheckCircle, XCircle, MessageSquare, ShoppingCart, Sparkles, Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Quotation = {
  id: string;
  price: number;
  leadTimeDays?: number | null;
  notes?: string | null;
  status: string;
  createdAt: Date;
  umkmProfile: {
    id: string;
    businessName: string;
    province?: string | null;
    trustScore?: { overall: number } | null;
  };
};

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const qStatusMap: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Menunggu", cls: "bg-yellow-100 text-yellow-700" },
  ACCEPTED: { label: "Diterima", cls: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Ditolak", cls: "bg-red-100 text-red-700" },
  NEGOTIATING: { label: "Negosiasi", cls: "bg-blue-100 text-blue-700" },
  WITHDRAWN: { label: "Ditarik", cls: "bg-slate-100 text-slate-600" },
};

export default function QuotationsList({ quotations, rfqId }: { quotations: Quotation[]; rfqId: string }) {
  const [list, setList] = useState(quotations);
  const [loading, setLoading] = useState<string | null>(null);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const router = useRouter();

  // Find best quotation (lowest price & highest trust score)
  const bestQuotation = list.length > 0
    ? [...list].sort((a, b) => (a.price - b.price) - ((a.umkmProfile?.trustScore?.overall || 0) - (b.umkmProfile?.trustScore?.overall || 0)) * 1000)[0]
    : null;

  const createOrder = async (quotationId: string) => {
    setLoading(quotationId);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotationId }),
      });
      if (res.ok) {
        toast.success("Pesanan berhasil dibuat!");
        router.push("/company/orders");
      } else {
        toast.error("Gagal membuat pesanan");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(null);
    }
  };

  const updateStatus = async (quotationId: string, status: "ACCEPTED" | "REJECTED") => {
    setLoading(quotationId);
    try {
      const res = await fetch(`/api/quotations/${quotationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setList(prev => prev.map(q => q.id === quotationId ? { ...q, status } : q));
        toast.success(status === "ACCEPTED" ? "Penawaran diterima!" : "Penawaran ditolak");
      }
    } finally {
      setLoading(null);
    }
  };

  if (list.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="py-16 text-center text-slate-400">
          <MessageSquare className="mx-auto h-12 w-12 opacity-30 mb-4 text-emerald-600" />
          <p className="font-bold text-slate-700">Belum ada penawaran masuk</p>
          <p className="text-sm mt-1">Supplier UMKM akan mengirimkan penawaran setelah meninjau kebutuhan RFQ Anda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation Box */}
      {bestQuotation && (
        <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Rekomendasi AI Supplier</span>
                  <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5">Match Terlengkap</Badge>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>{bestQuotation.umkmProfile?.businessName}</strong> menawarkan harga kompetitif ({formatRp(bestQuotation.price)}) dengan lead time singkat ({bestQuotation.leadTimeDays || 7} hari) dan Trust Score tinggi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Container */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Masuk Penawaran ({list.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparisonTable(!showComparisonTable)}
            className="text-xs rounded-xl border-slate-200 text-slate-700"
          >
            {showComparisonTable ? "Tampilkan Kartu Penawaran" : "Tabel Komparasi Penawaran"}
          </Button>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {showComparisonTable ? (
            /* Side-by-Side Comparison Table */
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3">Supplier UMKM</th>
                    <th className="p-3">Harga Penawaran</th>
                    <th className="p-3">Lead Time</th>
                    <th className="p-3">Trust Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{q.umkmProfile?.businessName}</td>
                      <td className="p-3 font-bold text-emerald-600">{formatRp(q.price)}</td>
                      <td className="p-3 text-slate-700">{q.leadTimeDays || 7} Hari</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {q.umkmProfile?.trustScore?.overall || 85}/100
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${qStatusMap[q.status]?.cls}`}>
                          {qStatusMap[q.status]?.label}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {q.status === "PENDING" && (
                          <Button size="sm" onClick={() => updateStatus(q.id, "ACCEPTED")} className="bg-emerald-600 text-white text-xs h-7 rounded-lg">
                            Terima
                          </Button>
                        )}
                        {q.status === "ACCEPTED" && (
                          <Button size="sm" onClick={() => createOrder(q.id)} className="bg-blue-600 text-white text-xs h-7 rounded-lg">
                            Buat Pesanan
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card View */
            list.map(q => {
              const st = qStatusMap[q.status] ?? { label: q.status, cls: "bg-slate-100 text-slate-600" };
              return (
                <div key={q.id} className="rounded-2xl border border-slate-200 p-5 hover:border-emerald-200 transition-colors bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shrink-0">
                        {q.umkmProfile?.businessName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{q.umkmProfile?.businessName || "Supplier"}</p>
                          {q.umkmProfile?.trustScore && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 border border-amber-200">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />{q.umkmProfile.trustScore.overall}/100
                            </div>
                          )}
                        </div>
                        {q.umkmProfile?.province && <p className="text-xs text-slate-400">{q.umkmProfile.province}</p>}
                      </div>
                    </div>
                    <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${st.cls}`}>{st.label}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Harga Penawaran</p>
                      <p className="text-base font-bold text-emerald-600">{formatRp(q.price)}</p>
                    </div>
                    {q.leadTimeDays && (
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Lead Time</p>
                        <p className="text-base font-bold text-slate-900">{q.leadTimeDays} Hari Kerja</p>
                      </div>
                    )}
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Tanggal Penawaran</p>
                      <p className="text-xs font-medium text-slate-700 mt-1">{new Date(q.createdAt).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>

                  {q.notes && (
                    <div className="mt-3 rounded-xl bg-blue-50/70 border border-blue-100 p-3">
                      <p className="text-xs text-blue-700 font-semibold mb-0.5">Catatan Supplier:</p>
                      <p className="text-xs text-blue-900 leading-relaxed">{q.notes}</p>
                    </div>
                  )}

                  {q.status === "PENDING" && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(q.id, "ACCEPTED")} disabled={loading === q.id} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                        <CheckCircle className="h-4 w-4" /> Terima Penawaran
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(q.id, "REJECTED")} disabled={loading === q.id} className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 rounded-xl">
                        <XCircle className="h-4 w-4" /> Tolak
                      </Button>
                    </div>
                  )}
                  {q.status === "ACCEPTED" && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" onClick={() => createOrder(q.id)} disabled={loading === q.id} className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        <ShoppingCart className="h-4 w-4" /> Buat Pesanan Sekarang
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
