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
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, DollarSign, Users, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

type CompanyAnalyticsData = {
  hasProfile: boolean;
  companyName?: string;
  stats: { label: string; value: string; trend: string }[];
  monthlyRfq: { bulan: string; rfq: number }[];
  categoryData: { name: string; penawaran: number }[];
  statusData: { name: string; value: number }[];
  responseRateData: { bulan: string; respons: number }[];
};

export default function CompanyAnalyticsPage() {
  const [data, setData] = useState<CompanyAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/company/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to fetch company analytics", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statIcons = [FileText, TrendingUp, Users, DollarSign];
  const statColors = ["text-blue-600", "text-emerald-600", "text-indigo-600", "text-orange-600"];
  const statBgs = ["bg-blue-50", "bg-emerald-50", "bg-indigo-50", "bg-orange-50"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Menganalisis data procurement perusahaan Anda...</p>
      </div>
    );
  }

  const hasAnyRfq = Number(data?.stats?.[0]?.value || 0) > 0;

  return (
    <div className="space-y-6 text-slate-900 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analitik Procurement {data?.companyName ? `• ${data.companyName}` : ""}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau aktivitas pembuatan RFQ, efektivitas penawaran supplier, dan estimasi budget pengadaan
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

      {!hasAnyRfq && (
        <Card className="border-blue-200/80 bg-blue-50/50 rounded-2xl shadow-sm">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-950">Belum Ada RFQ yang Dibuat</p>
                <p className="text-xs text-blue-800/90 mt-0.5">
                  Grafik analitik ini khusus untuk pengadaan perusahaan Anda. Buat RFQ pertama Anda untuk mulai mengumpulkan penawaran harga dari ribuan supplier UMKM.
                </p>
              </div>
            </div>
            <Link href="/company/rfq/create" className="shrink-0">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs">
                Buat RFQ Sekarang
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.stats.map((s, idx) => {
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
        {/* 1. Monthly RFQ Line Chart */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Pembuatan RFQ Per Bulan</CardTitle>
            <CardDescription className="text-xs text-slate-500">Jumlah permintaan penawaran yang dipublikasikan perusahaan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={data?.monthlyRfq || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(val) => [`${val} RFQ`, "Dibuat"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="rfq"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Category Distribution Bar Chart */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Penawaran Masuk per Kategori</CardTitle>
            <CardDescription className="text-xs text-slate-500">Distribusi penawaran yang diterima berdasarkan kategori pengadaan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={data?.categoryData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v) => [`${v} penawaran`, "Total Masuk"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="penawaran" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. RFQ Status Distribution Pie Chart */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Status RFQ Perusahaan</CardTitle>
            <CardDescription className="text-xs text-slate-500">Komposisi status seluruh RFQ yang pernah Anda buat</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {hasAnyRfq ? (
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
                    {data?.statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v} RFQ`, "Status"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-1">
                <p className="text-sm font-semibold">Belum Ada RFQ</p>
                <p className="text-xs text-slate-400">Diagram status akan muncul setelah Anda membuat RFQ.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Response Rate */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Tingkat Respons Supplier</CardTitle>
            <CardDescription className="text-xs text-slate-500">Persentase RFQ yang mendapatkan penawaran dari mitra supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={data?.responseRateData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Tingkat Respons"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="respons" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
