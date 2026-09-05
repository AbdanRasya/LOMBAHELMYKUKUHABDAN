"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Send, CheckCircle, Star, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

type AnalyticsData = {
  hasProfile: boolean;
  businessName?: string;
  stats: { label: string; value: string; trend: string }[];
  monthlyQuotations: { bulan: string; penawaran: number }[];
  categoryData: { name: string; val: number }[];
  statusData: { name: string; value: number }[];
  readinessData: { bulan: string; skor: number }[];
};

export default function UMKMAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/umkm/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchAnalytics();
  }, []);

  const statIcons = [Send, CheckCircle, TrendingUp, Star];
  const statColors = ["text-emerald-600", "text-blue-600", "text-indigo-600", "text-amber-500"];
  const statBgs = ["bg-emerald-50", "bg-blue-50", "bg-indigo-50", "bg-amber-50"];

  if (!isMounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">Menganalisis performa bisnis akun Anda...</p>
      </div>
    );
  }

  const hasAnyActivity = data?.statusData.some((s) => s.value > 0) || Number(data?.stats?.[0]?.value || 0) > 0;

  return (
    <div className="space-y-6 text-slate-900 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analitik Bisnis {data?.businessName ? `• ${data.businessName}` : ""}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Data performa penawaran, tingkat konversi, dan skor kesiapan khusus akun Anda
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAnalytics}
          className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Segarkan Data
        </Button>
      </div>

      {!hasAnyActivity && (
        <Card className="border-amber-200/80 bg-amber-50/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-950">Belum Ada Aktivitas Penawaran</p>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Grafik analitik ini dikhususkan untuk akun Anda. Mulai ajukan penawaran harga di Pasar RFQ agar statistik performa mulai tercatat.
                </p>
              </div>
            </div>
            <Link href="/umkm/rfq" className="shrink-0">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs">
                Jelajahi Pasar RFQ
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(data?.stats || []).map((s, idx) => {
          const Icon = statIcons[idx % statIcons.length];
          const color = statColors[idx % statColors.length];
          const bg = statBgs[idx % statBgs.length];

          return (
            <Card key={s.label} className="border border-slate-200/80 shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                    <p className="text-2xl font-bold mt-1 text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{s.trend}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Monthly Quotations Area Chart */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Penawaran Dikirim Per Bulan</CardTitle>
            <CardDescription className="text-xs text-slate-500">Jumlah penawaran harga yang Anda kirimkan sepanjang tahun ini</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={data?.monthlyQuotations || []}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(val) => [`${val} penawaran`, "Total Dikirim"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Area type="monotone" dataKey="penawaran" stroke="#10b981" strokeWidth={2.5} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Readiness Score Trend */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Perkembangan Skor Kesiapan</CardTitle>
            <CardDescription className="text-xs text-slate-500">Kesiapan usaha berdasarkan kelengkapan mesin, profil, & sertifikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={data?.readinessData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v) => [`${v}/100`, "Skor Kesiapan"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="skor"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 4, strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Category Distribution Bar Chart */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Distribusi Kategori RFQ Anda</CardTitle>
            <CardDescription className="text-xs text-slate-500">Kategori kebutuhan yang paling sering Anda tawar</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={data?.categoryData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v) => [`${v} penawaran`, "Jumlah"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="val" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Quotation Status Pie Chart */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Status Penawaran Anda</CardTitle>
            <CardDescription className="text-xs text-slate-500">Rasio penawaran yang diterima, pending, atau dinegosiasikan</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {hasAnyActivity ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={data?.statusData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      percent !== undefined && percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                    }
                    labelLine={false}
                  >
                    {(data?.statusData || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v} transaksi`, "Status"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-1">
                <p className="text-sm font-semibold">Belum Ada Riwayat Penawaran</p>
                <p className="text-xs text-slate-400">Diagram status akan muncul setelah Anda mengirim penawaran.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
