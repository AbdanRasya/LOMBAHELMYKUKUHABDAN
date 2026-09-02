"use client";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, FileText, DollarSign, Users } from "lucide-react";

const monthlyRfq = [
  { bulan: "Jan", rfq: 3 }, { bulan: "Feb", rfq: 5 }, { bulan: "Mar", rfq: 4 },
  { bulan: "Apr", rfq: 7 }, { bulan: "Mei", rfq: 6 }, { bulan: "Jun", rfq: 9 },
  { bulan: "Jul", rfq: 8 }, { bulan: "Agu", rfq: 11 }, { bulan: "Sep", rfq: 10 },
  { bulan: "Okt", rfq: 13 }, { bulan: "Nov", rfq: 12 }, { bulan: "Des", rfq: 15 },
];

const categoryData = [
  { name: "Bahan Bangunan", penawaran: 18 }, { name: "Tekstil", penawaran: 12 },
  { name: "IT & Software", penawaran: 22 }, { name: "Otomotif", penawaran: 8 },
  { name: "Makanan", penawaran: 15 },
];

const statusData = [
  { name: "Terbuka", value: 4 }, { name: "Selesai", value: 11 },
  { name: "Ditinjau", value: 3 }, { name: "Dibatalkan", value: 2 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const stats = [
  { label: "Total RFQ", value: "20", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+4 bulan ini" },
  { label: "Total Penawaran", value: "75", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+15 bulan ini" },
  { label: "Supplier Tersimpan", value: "12", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", trend: "favorit" },
  { label: "Estimasi Budget", value: "Rp 2.4M", icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50", trend: "total procurement" },
];

export default function CompanyAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analitik Procurement</h1>
        <p className="text-sm text-slate-500 mt-1">Pantau performa pengadaan perusahaan Anda</p>
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
          <CardHeader><CardTitle className="text-base">RFQ Per Bulan</CardTitle><CardDescription>Jumlah RFQ yang dibuat sepanjang tahun</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyRfq}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="rfq" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Penawaran per Kategori</CardTitle><CardDescription>Distribusi penawaran berdasarkan kategori</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="penawaran" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Status RFQ</CardTitle><CardDescription>Distribusi status seluruh RFQ</CardDescription></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`} labelLine={false}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Tingkat Respons Supplier</CardTitle><CardDescription>% supplier yang merespons RFQ dalam 48 jam</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyRfq.slice(-6).map((m, i) => ({ ...m, respons: [72, 68, 75, 80, 78, 85][i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
                <Tooltip formatter={(v) => [`${v}%`, "Tingkat Respons"]} />
                <Bar dataKey="respons" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
