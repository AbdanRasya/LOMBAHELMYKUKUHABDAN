"use client";
import { useState } from "react";
import { Sparkles, Search, MapPin, Shield, CheckCircle, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const CATEGORIES = ["Bahan Bangunan", "Tekstil & Pakaian", "IT & Software", "Otomotif & Sparepart", "Makanan & Minuman", "Pertanian", "Elektronik", "Kimia & Plastik"];

type MatchResult = {
  id: string;
  name: string;
  province: string;
  score: number;
  tags: string[];
  trustScore: number;
  explanation: string;
  strengths: string[];
};

const mockResults: MatchResult[] = [
  { id: "1", name: "PT. Karya Baja Nusantara", province: "Jawa Barat", score: 96, tags: ["Bahan Bangunan", "Baja"], trustScore: 89, explanation: "Supplier ini memiliki kapasitas produksi yang sesuai dan rekam jejak pengiriman yang sangat baik.", strengths: ["Kapasitas besar", "Bersertifikat SNI", "Lead time 7 hari"] },
  { id: "2", name: "UD. Maju Bersama Steel", province: "DKI Jakarta", score: 88, tags: ["Baja", "Konstruksi"], trustScore: 82, explanation: "Spesialisasi di material konstruksi dengan harga kompetitif dan layanan pengiriman ke Jabodetabek.", strengths: ["Harga kompetitif", "Pengiriman cepat", "Min order rendah"] },
  { id: "3", name: "CV. Sumber Logam Prima", province: "Jawa Timur", score: 81, tags: ["Logam", "Manufaktur"], trustScore: 75, explanation: "Pengalaman 15+ tahun dalam penyediaan material logam untuk proyek konstruksi skala menengah.", strengths: ["Pengalaman luas", "Harga stabil", "Konsultasi gratis"] },
];

export default function AIMatchPage() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const handleMatch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2200));
    setResults(mockResults);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <Sparkles key={i} className="absolute animate-pulse" style={{ top: `${(i * 15) % 80}%`, left: `${(i * 23) % 90}%`, width: 20, height: 20, animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Supplier Matching</h1>
              <p className="text-sm text-white/75">Deskripsikan kebutuhan Anda, AI kami akan menemukan supplier terbaik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Deskripsikan kebutuhan Anda</label>
            <Textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Contoh: Saya membutuhkan supplier baja konstruksi tipe H-beam untuk proyek gedung 20 lantai di Jakarta. Butuh 500 ton, pengiriman bertahap selama 3 bulan, bersertifikat SNI..."
              className="min-h-28 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Kategori</label>
              <Select value={category} onValueChange={v => setCategory(v || "")}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Butuh supplier baja SNI", "Tekstil ramah lingkungan", "Software ERP UMKM", "Sparepart otomotif bulk"].map(s => (
              <button key={s} onClick={() => setPrompt(s)} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                {s}
              </button>
            ))}
          </div>
          <Button onClick={handleMatch} disabled={!prompt.trim() || loading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white h-12 text-base gap-2 shadow-lg">
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Mencari supplier terbaik...</> : <><Sparkles className="h-5 w-5" />Temukan Supplier AI Match</>}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900">{results.length} Supplier Tercocokkan</h2>
          </div>
          {results.map((r, i) => (
            <Card key={r.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${i === 0 ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`}>
              {i === 0 && <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />}
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                      {r.name.charAt(0)}
                    </div>
                    {i === 0 && <div className="absolute -top-1.5 -right-1.5 rounded-full bg-yellow-400 p-1"><Star className="h-3 w-3 text-white fill-white" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{r.name}</h3>
                      {i === 0 && <Badge className="bg-yellow-100 text-yellow-700 text-xs">Best Match</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.province}</span>
                      <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-500" />Trust {r.trustScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{r.explanation}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.strengths.map(s => <span key={s} className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle className="h-3.5 w-3.5" />{s}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative h-16 w-16">
                      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke={r.score >= 90 ? "#10b981" : r.score >= 75 ? "#3b82f6" : "#f59e0b"} strokeWidth="3" strokeDasharray={`${r.score} 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">{r.score}%</span>
                    </div>
                    <span className="text-xs text-slate-400 mt-1">AI Match</span>
                    <Link href={`/company/suppliers/${r.id}`} className="mt-2">
                      <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">Lihat Profil</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
