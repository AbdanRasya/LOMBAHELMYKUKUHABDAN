"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, MapPin, Shield, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type SavedItem = {
  id: string;
  umkmId: string;
  createdAt: string;
  umkmProfile: {
    id: string;
    businessName: string;
    tagline?: string | null;
    province?: string | null;
    city?: string | null;
    readinessScore: number;
    verificationStatus: string;
    categories: { id: string; name: string }[];
    trustScore?: { overall: number } | null;
  };
};

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/saved").then(r => r.json()).then(d => { setSaved(d.saved || []); setLoading(false); });
  }, []);

  const remove = async (umkmId: string) => {
    await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ umkmId }) });
    setSaved(prev => prev.filter(s => s.umkmId !== umkmId));
    toast.success("Supplier dihapus dari daftar tersimpan");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supplier Tersimpan</h1>
          <p className="text-sm text-slate-500 mt-1">{saved.length} supplier dalam daftar favorit Anda</p>
        </div>
        <Link href="/company/suppliers">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"><Search className="h-4 w-4" />Cari Supplier Baru</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : saved.length === 0 ? (
        <div className="py-24 text-center">
          <Bookmark className="mx-auto h-16 w-16 text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Belum ada supplier tersimpan</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">Simpan supplier favorit Anda untuk mudah ditemukan kembali.</p>
          <Link href="/company/suppliers"><Button className="bg-blue-600 hover:bg-blue-700 text-white">Cari Supplier Sekarang</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {saved.filter(({ umkmProfile: s }) => !!s).map(({ umkmProfile: s, id, umkmId }) => (
            <Card key={id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                    {s!.businessName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-slate-900 truncate">{s!.businessName}</h3>
                      {s!.verificationStatus === "APPROVED" && <Shield className="h-4 w-4 text-emerald-500 shrink-0" />}
                    </div>
                    {s!.tagline && <p className="text-xs text-slate-500 truncate">{s!.tagline}</p>}
                    {(s!.province || s!.city) && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3" /> {[s!.city, s!.province].filter(Boolean).join(", ")}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(s!.categories || []).slice(0, 2).map(c => <Badge key={c.id} variant="secondary" className="text-xs">{c.name}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-slate-400 text-xs">Skor Kesiapan </span>
                    <span className={`font-bold ${s!.readinessScore >= 80 ? "text-emerald-600" : s!.readinessScore >= 60 ? "text-blue-600" : "text-yellow-600"}`}>{s!.readinessScore}/100</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/company/suppliers/${s!.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">Lihat Profil</Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => remove(umkmId)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
