"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Lock, Bell, Eye, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UMKMSettingsPage() {
  const [saving, setSaving] = useState(false);

  const save = async (section: string) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success(`${section} berhasil disimpan!`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan UMKM</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola preferensi akun, keamanan, dan visibilitas bisnis Anda</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="flex flex-wrap w-full bg-slate-100/80 p-1.5 rounded-2xl gap-1 border border-slate-200/60">
          {[
            ["account", User, "Akun Saya"],
            ["security", Lock, "Keamanan"],
            ["notifications", Bell, "Notifikasi"],
            ["privacy", Eye, "Privasi"],
          ].map(([v, Icon, label]) => (
            <TabsTrigger
              key={v as string}
              value={v as string}
              className="flex-1 min-w-[110px] flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold sm:text-sm rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-md"
            >
              <Icon className="h-4 w-4" />
              {label as string}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: Account */}
        <TabsContent value="account">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Info Akun & Login</CardTitle>
              <CardDescription className="text-xs text-slate-500">Informasi utama pemilik akun UMKM</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Nama Lengkap Pemilik</Label>
                  <Input placeholder="Nama Pemilik Usaha" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Alamat Email Registered</Label>
                  <Input placeholder="email@bisnis.com" readOnly className="h-11 rounded-xl bg-slate-50 cursor-not-allowed opacity-75" />
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-emerald-950">Kelola Profil Bisnis & Produk</p>
                    <p className="text-xs text-emerald-800/80 mt-1">
                      Untuk mengubah nama usaha, alamat pabrik, upload NIB, sertifikasi, dan produk—buka wizard Profil Bisnis.
                    </p>
                  </div>
                  <Link href="/umkm/profile" className="shrink-0">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1 shadow-sm">
                      Edit Profil Bisnis <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Info Akun")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Security */}
        <TabsContent value="security">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Keamanan Kata Sandi</CardTitle>
              <CardDescription className="text-xs text-slate-500">Pastikan password akun Anda kuat dan rahasia</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPw" className="text-xs font-medium text-slate-700">Kata Sandi Saat Ini</Label>
                  <Input id="currentPw" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPw" className="text-xs font-medium text-slate-700">Kata Sandi Baru</Label>
                  <Input id="newPw" type="password" placeholder="Minimal 8 karakter" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPw" className="text-xs font-medium text-slate-700">Konfirmasi Kata Sandi Baru</Label>
                  <Input id="confirmPw" type="password" placeholder="Ulangi kata sandi baru" className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Kata Sandi")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengubah...</> : "Ubah Kata Sandi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Notifications */}
        <TabsContent value="notifications">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Notifikasi Pesanan & RFQ</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur saat kapan Anda menerima notifikasi email</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                ["Pemberitahuan Email Pengadaan", "Terima pesan email instan untuk pesanan baru & perubahan status transaksi", true],
                ["Peluang Pasar RFQ Baru", "Notifikasi saat ada perusahaan yang memposting RFQ sesuai kategori usaha Anda", true],
                ["Update Status Penawaran", "Notifikasi saat penawaran harga Anda diterima/ditolak perusahaan", true],
                ["Rekomendasi Cerdas AI", "Analisis tips mingguan dari AI untuk meningkatkan Skor Kesiapan UMKM", false],
              ].map(([l, d, def]) => (
                <div key={l as string} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">{l as string}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{d as string}</p>
                  </div>
                  <Switch defaultChecked={def as boolean} />
                </div>
              ))}

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Notifikasi")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Notifikasi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Privacy */}
        <TabsContent value="privacy">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Privasi & Visibilitas Publik</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur jangkauan pencarian bisnis Anda oleh pembeli/PT</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {[
                ["Profil Publik Dapat Diakses", "Izinkan tim pengadaan perusahaan pembeli melihat katalog produk & profil pabrik Anda", true],
                ["Tampilkan di Pencarian Supplier", "Muncul dalam hasil pencarian & rekomendasi AI pencocokan supplier B2B", true],
              ].map(([l, d, def]) => (
                <div key={l as string} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">{l as string}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{d as string}</p>
                  </div>
                  <Switch defaultChecked={def as boolean} />
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200/80 p-5 bg-slate-50/40">
                <p className="text-sm font-bold text-slate-900">Unduh Salinan Data Usaha</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">Unduh seluruh riwayat penawaran, katalog barang, dan dokumen legal Anda.</p>
                <Button variant="outline" size="sm" onClick={() => toast.info("Permintaan ekspor data sedang diproses...")} className="rounded-xl border-slate-300">
                  Ekspor Data Usaha (JSON)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
