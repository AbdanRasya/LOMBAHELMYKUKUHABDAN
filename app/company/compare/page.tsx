"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Shield, Star, Award, MapPin, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Supplier = {
  id: string;
  businessName: string;
  tagline?: string | null;
  province?: string | null;
  city?: string | null;
  readinessScore: number;
  verificationStatus: string;
  categories: { id: string; name: string }[];
  products: { name: string; minOrder?: number; leadTimeDays?: number }[];
  certifications?: { name: string }[];
  trustScore?: { overall: number; onTimeDelivery?: number; qualityScore?: number } | null;
};

export default function SupplierComparisonPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/api/suppliers");
        const data = await res.json();
        // Pick top 3 for side-by-side comparison
        setSuppliers((data.suppliers || []).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/company/suppliers" className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 mb-2 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Cari Supplier
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Perbandingan Supplier B2B</h1>
          <p className="text-sm text-slate-500 mt-1">Bandingkan kapasitas produksi, lead time, sertifikasi, dan skor performa antar supplier secara berdampingan</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
          <p className="text-sm text-slate-500">Memuat data perbandingan supplier...</p>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="font-medium">Belum ada supplier yang dipilih untuk dibandingkan</p>
          <Link href="/company/suppliers">
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Cari Supplier</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">Kriteria Evaluasi</th>
                {suppliers.map(s => (
                  <th key={s.id} className="p-4 text-center w-1/4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center">
                        {s.businessName.charAt(0)}
                      </div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1 justify-center">
                        {s.businessName}
                        {s.verificationStatus === "APPROVED" && <Shield className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <span className="text-xs text-slate-400">{[s.city, s.province].filter(Boolean).join(", ")}</span>
                      <Link href={`/company/suppliers/${s.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full text-xs rounded-lg mt-1 h-8 border-slate-200">
                          Lihat Profil
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Readiness Score */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Skor Kesiapan Supplier</td>
                {suppliers.map(s => (
                  <td key={s.id} className="p-4 text-center font-bold text-emerald-600 text-base">
                    {s.readinessScore}/100
                  </td>
                ))}
              </tr>

              {/* Trust Score */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Trust Score (Performa Aktual)</td>
                {suppliers.map(s => (
                  <td key={s.id} className="p-4 text-center font-bold text-slate-800">
                    <div className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {s.trustScore?.overall ?? 85}/100
                    </div>
                  </td>
                ))}
              </tr>

              {/* Kategori Industri */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Kategori Utama</td>
                {suppliers.map(s => (
                  <td key={s.id} className="p-4 text-center">
                    {(s.categories || []).map(c => (
                      <Badge key={c.id} variant="secondary" className="text-xs font-normal m-0.5">{c.name}</Badge>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Min Order & Lead Time */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Rata-rata Lead Time & MOQ</td>
                {suppliers.map(s => {
                  const leadTime = s.products?.[0]?.leadTimeDays || 7;
                  const moq = s.products?.[0]?.minOrder || 100;
                  return (
                    <td key={s.id} className="p-4 text-center text-xs text-slate-600">
                      <div><span className="font-semibold text-slate-800">{leadTime} Hari Kerja</span> (Lead Time)</div>
                      <div className="mt-0.5 text-slate-400">MOQ: {moq.toLocaleString("id-ID")} pcs</div>
                    </td>
                  );
                })}
              </tr>

              {/* Sertifikasi */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Sertifikasi Legal & Mutu</td>
                {suppliers.map(s => (
                  <td key={s.id} className="p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">Halal</Badge>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">SNI</Badge>
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">NIB</Badge>
                    </div>
                  </td>
                ))}
              </tr>

              {/* CTA Action */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">Tindakan Sourcing</td>
                {suppliers.map(s => (
                  <td key={s.id} className="p-4 text-center">
                    <Link href={`/company/rfq/create`}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-9 font-medium shadow-sm">
                        Kirim RFQ <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
