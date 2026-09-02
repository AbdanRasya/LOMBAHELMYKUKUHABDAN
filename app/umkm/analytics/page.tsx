"use client";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Send, CheckCircle, Star } from "lucide-react";

const monthlyQuotations = [
  { bulan: "Jan", penawaran: 2 }, { bulan: "Feb", penawaran: 3 }, { bulan: "Mar", penawaran: 1 },
  { bulan: "Apr", penawaran: 5 }, { bulan: "Mei", penawaran: 4 }, { bulan: "Jun", penawaran: 7 },
  { bulan: "Jul", penawaran: 6 }, { bulan: "Agu", penawaran: 9 }, { bulan: "Sep", penawaran: 8 },
  { bulan: "Okt", penawaran: 11 }, { bulan: "Nov", penawaran: 10 }, { bulan: "Des", penawaran: 13 },
];

const categoryData = [
  { name: "Bangunan", val: 18 }, { name: "Tekstil", val: 12 }, { name: "IT", val: 7 },
  { name: "Otomotif", val: 5 }, { name: "Lainnya", val: 9 },
];

const statusData = [
  { name: "Diterima", value: 32 }, { name: "Pending", value: 28 },
  { name: "Ditolak", value: 15 }, { name: "Negosiasi", value: 9 },
];

const readinessData = [
  { bulan: "Jan", skor: 42 }, { bulan: "Mar", skor: 55 }, { bulan: "Mei", skor: 63 },
  { bulan: "Jul", skor: 70 }, { bulan: "Sep", skor: 75 }, { bulan: "Des", skor: 82 },
];

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const stats = [
  { label: "Total Penawaran", value: "84", icon: Send, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+9 bulan ini" },
  { label: "Tingkat Diterima", value: "38%", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", trend: "dari total penawaran" },
  { label: "Proyek Aktif", value: "3", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", trend: "sedang berjalan" },
  { label: "Rating Rata-rata", value: "4.7", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50", trend: "dari semua review" },
];

export default function UMKMAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analitik Bisnis</h1>
        <p className="text-sm text-slate-500 mt-1">Pantau perkembangan bisnis dan performa penawaran Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold mt-1 text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.trend}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Penawaran Per Bulan</CardTitle><CardDescription>Jumlah penawaran yang dikirimkan</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyQuotations}>
                <defs><linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="penawaran" stroke="#10b981" fill="url(#emeraldGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Skor Kesiapan</CardTitle><CardDescription>Perkembangan skor kesiapan bisnis</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip formatter={(v) => [`${v}`, "Skor"]} />
                <Line type="monotone" dataKey="skor" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Kategori RFQ</CardTitle><CardDescription>Distribusi penawaran per kategori</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Status Penawaran</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`} labelLine={false}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
