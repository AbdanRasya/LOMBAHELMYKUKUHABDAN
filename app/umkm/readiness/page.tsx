'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const FILL_COLOR = (s: number) => s >= 80 ? '#10b981' : s >= 60 ? '#3b82f6' : s >= 40 ? '#eab308' : '#ef4444';

export default function ReadinessScore() {
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState('');
  const [rincian, setRincian] = useState<{[k: string]: number}>({});
  const [kekuatan, setKekuatan] = useState<string[]>([]);
  const [kelemahan, setKelemahan] = useState<string[]>([]);
  const [rekomendasi, setRekomendasi] = useState<{title: string; desc: string; poin: number}[]>([]);

  useEffect(() => {
    setIsMounted(true);
    (async () => {
      try {
        const res = await fetch('/api/ai/readiness/demo-u2');
        const data = await res.json();
        if (data) {
          setScore(Math.round(data.skor_total || 0));
          setLevel(data.level_kesiapan || 'Belum Siap');
          setRincian(data.rincian_skor || {});
          setKekuatan(data.kekuatan || []);
          setKelemahan(data.area_perbaikan || []);
          setRekomendasi((data.rekomendasi || []).map((r: string, i: number) => ({
            title: r.split('. ')[0] || `Rekomendasi ${i+1}`,
            desc: r,
            poin: [15, 10, 8, 5][i] || 5,
          })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scoreBreakdown = Object.entries(rincian).map(([name, score]) => ({
    name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    score: Math.round(score),
    fill: FILL_COLOR(score),
  }));

  if (!isMounted || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-500">AI sedang menganalisis kesiapan bisnis Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analisis Skor Kesiapan B2B</h1>
        <p className="text-slate-500 mt-1">Evaluasi berbasis AI untuk mengukur peluang Anda memenangkan pengadaan B2B perusahaan besar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Ring Card */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200">
          <CardHeader className="text-center pb-2">
            <CardTitle>Skor Kesiapan Keseluruhan</CardTitle>
            <CardDescription>Berdasarkan kelengkapan profil & kapasitas</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="112" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="128" cy="128" r="112" 
                  stroke="currentColor" 
                  strokeWidth="16" 
                  fill="transparent" 
                  strokeDasharray="703.7" 
                  strokeDashoffset={703.7 - (703.7 * score) / 100}
                  className="text-blue-500 transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-bold text-slate-900">{score}</span>
                <span className={cn(
                  "text-lg font-medium mt-2 px-3 py-1 rounded-full",
                  score >= 80 ? "text-emerald-700 bg-emerald-50" :
                  score >= 60 ? "text-blue-700 bg-blue-50" :
                  score >= 40 ? "text-amber-700 bg-amber-50" :
                  "text-red-700 bg-red-50"
                )}>{level}</span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-600 mt-8 px-4">
              {score >= 80
                ? "Skor Anda sangat baik! Anda siap bersaing di proyek-proyek skala besar korporasi."
                : score >= 60
                ? "Skor Anda cukup baik, namun masih ada ruang untuk ditingkatkan agar dapat bersaing di proyek berskala besar."
                : score >= 40
                ? "Skor Anda perlu ditingkatkan agar dapat memenangkan tender B2B. Ikuti rekomendasi AI di bawah."
                : "Skor Anda masih rendah. Lengkapi profil bisnis dan ikuti rekomendasi AI untuk mulai bersaing."}
            </p>
            <Link 
              href="/umkm/profile"
              className={cn(buttonVariants({}), "w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white border-none text-center flex justify-center items-center")}
            >
              Tingkatkan Profil Anda
            </Link>
          </CardContent>
        </Card>

        {/* Breakdown Chart & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Rincian Parameter Skor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                      {scoreBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-emerald-50/50 border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-800 flex items-center text-base">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Kekuatan Bisnis Anda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  {(kekuatan.length ? kekuatan : [
                    "Dokumen legalitas (NPWP, NIB) sudah lengkap dan tervalidasi.",
                    "Informasi dasar bisnis dan kontak sangat jelas.",
                    "Katalog produk telah dilengkapi dengan spesifikasi detail.",
                  ]).map((item, i) => (
                    <li key={i} className="flex items-start"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" /> {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-red-50/50 border-red-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-800 flex items-center text-base">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Area Perbaikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-700">
                  {(kelemahan.length ? kelemahan : [
                    "Belum memiliki sertifikasi industri (ISO/SNI).",
                    "Data kapasitas mesin produksi belum diisi lengkap.",
                    "Portofolio proyek masa lalu masih kurang dari 3.",
                  ]).map((item, i) => (
                    <li key={i} className="flex items-start"><XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" /> {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card className="shadow-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <TrendingUp className="mr-2 h-5 w-5" />
            Rekomendasi Tindakan AI
          </CardTitle>
          <CardDescription>Lakukan tindakan berikut untuk menaikkan Skor Kesiapan hingga 90+ dan membuka proyek Premium.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(rekomendasi.length ? rekomendasi : [
              { title: "Unggah Sertifikat TKDN atau ISO", desc: "Sertifikasi ini meningkatkan kepercayaan perusahaan besar hingga 40%.", poin: 15 },
              { title: "Tambahkan Detail Kapasitas Mesin", desc: "Perusahaan manufaktur mencari vendor dengan spesifikasi mesin yang jelas.", poin: 10 },
              { title: "Tambah Portofolio Proyek Lebih Banyak", desc: "Minimal 3 portofolio proyek untuk meyakinkan calon klien korporat.", poin: 8 },
            ]).map((rec, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{rec.desc} (+{rec.poin} Poin)</p>
                  </div>
                </div>
                <Link 
                  href="/umkm/profile"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
                >
                  {i === 0 ? "Unggah Dokumen" : "Edit Profil"}
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
