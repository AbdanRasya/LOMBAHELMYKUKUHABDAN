"use client";
import { useState } from "react";
import { Shield, Clock, CheckCircle, XCircle, MessageSquare, ShoppingCart } from "lucide-react";
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
  const router = useRouter();

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
    } catch (e) {
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
      <Card className="border-0 shadow-sm">
        <CardContent className="py-16 text-center text-slate-400">
          <MessageSquare className="mx-auto h-12 w-12 opacity-30 mb-4" />
          <p className="font-medium">Belum ada penawaran masuk</p>
          <p className="text-sm mt-1">Supplier akan mengirimkan penawaran setelah melihat RFQ Anda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader><CardTitle className="text-base">Daftar Penawaran ({list.length})</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {list.map(q => {
          const st = qStatusMap[q.status] ?? { label: q.status, cls: "bg-slate-100 text-slate-600" };
          return (
            <div key={q.id} className="rounded-xl border border-slate-200 p-5 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shrink-0">
                    {q.umkmProfile?.businessName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{q.umkmProfile?.businessName || "Supplier"}</p>
                      {q.umkmProfile?.trustScore && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 rounded px-1.5 py-0.5">
                          <Shield className="h-3 w-3" />{q.umkmProfile.trustScore.overall}
                        </div>
                      )}
                    </div>
                    {q.umkmProfile?.province && <p className="text-xs text-slate-400">{q.umkmProfile.province}</p>}
                  </div>
                </div>
                <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${st.cls}`}>{st.label}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Harga Penawaran</p>
                  <p className="text-base font-bold text-slate-900">{formatRp(q.price)}</p>
                </div>
                {q.leadTimeDays && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Lead Time</p>
                    <p className="text-base font-bold text-slate-900">{q.leadTimeDays} hari</p>
                  </div>
                )}
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Dikirim</p>
                  <p className="text-sm font-medium">{new Date(q.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
              </div>

              {q.notes && (
                <div className="mt-3 rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Catatan Supplier</p>
                  <p className="text-sm text-blue-800">{q.notes}</p>
                </div>
              )}

              {q.status === "PENDING" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => updateStatus(q.id, "ACCEPTED")} disabled={loading === q.id} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <CheckCircle className="h-4 w-4" /> Terima
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(q.id, "REJECTED")} disabled={loading === q.id} className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
                    <XCircle className="h-4 w-4" /> Tolak
                  </Button>
                </div>
              )}
              {q.status === "ACCEPTED" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => createOrder(q.id)} disabled={loading === q.id} className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="h-4 w-4" /> Buat Pesanan
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
