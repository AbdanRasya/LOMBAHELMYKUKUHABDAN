"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Lock, Bell, Eye, ArrowRight, Loader2, Globe, Clock, DollarSign, ShieldCheck, Building2 } from "lucide-react";
import Link from "next/link";

export default function UMKMSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    ownerName: "Kukuh Rahmadi",
    email: "umkm@sourcehub.id",
    language: "id",
    timezone: "WIB",
    currency: "IDR",
    emailFrequency: "instant",
    visibility: "public",
    paymentMethod: "bca",
  });

  const updatePref = (field: string, val: string | null) => {
    setPreferences((prev) => ({ ...prev, [field]: val || "" }));
  };

  const save = async (section: string) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success(`${section} berhasil disimpan!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-900 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Pengaturan Akun Mitra</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola preferensi akun, regional, keamanan, dan notifikasi pesanan Anda</p>
      </div>

      <Tabs defaultValue="account" orientation="vertical" className="w-full">
        <TabsList className="bg-slate-100/90 p-2 rounded-2xl border border-slate-200/70 h-auto">
          <TabsTrigger value="account" className="gap-3 py-3 px-4">
            <User className="h-4 w-4 text-emerald-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Akun & Preferensi</p>
              <p className="text-[11px] text-slate-400 font-normal">Pemilik & Regional</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="security" className="gap-3 py-3 px-4">
            <Lock className="h-4 w-4 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Keamanan</p>
              <p className="text-[11px] text-slate-400 font-normal">Kata Sandi & Proteksi</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="notifications" className="gap-3 py-3 px-4">
            <Bell className="h-4 w-4 text-amber-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Notifikasi</p>
              <p className="text-[11px] text-slate-400 font-normal">Email & Peringatan RFQ</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="privacy" className="gap-3 py-3 px-4">
            <Eye className="h-4 w-4 text-indigo-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Privasi & Visibilitas</p>
              <p className="text-[11px] text-slate-400 font-normal">Katalog & Direktori</p>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Account & Preferences */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Info Pemilik & Preferensi Regional</CardTitle>
              <CardDescription className="text-xs text-slate-500">Informasi pengguna, bahasa, dan format mata uang sistem</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Nama Lengkap Pemilik Usaha</Label>
                  <Input
                    value={preferences.ownerName}
                    onChange={(e) => setPreferences({ ...preferences, ownerName: e.target.value })}
                    placeholder="Nama Pemilik Usaha"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Alamat Email Terdaftar</Label>
                  <Input
                    value={preferences.email}
                    readOnly
                    className="h-11 rounded-xl bg-slate-50 cursor-not-allowed opacity-75"
                  />
                </div>

                {/* Bahasa (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-slate-500" />
                    Bahasa Antarmuka
                  </Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(v) => updatePref("language", v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia (ID)</SelectItem>
                      <SelectItem value="en">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Zona Waktu (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    Zona Waktu
                  </Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(v) => updatePref("timezone", v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Zona Waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WIB">WIB (Waktu Indonesia Barat - UTC+7)</SelectItem>
                      <SelectItem value="WITA">WITA (Waktu Indonesia Tengah - UTC+8)</SelectItem>
                      <SelectItem value="WIT">WIT (Waktu Indonesia Timur - UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Format Mata Uang (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                    Mata Uang Default Penawaran
                  </Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(v) => updatePref("currency", v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Format Mata Uang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR - Rupiah Indonesia (Rp)</SelectItem>
                      <SelectItem value="USD">USD - United States Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank Penampung (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Bank Penampung Pembayaran Utama</Label>
                  <Select
                    value={preferences.paymentMethod}
                    onValueChange={(v) => updatePref("paymentMethod", v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bca">BCA (Bank Central Asia)</SelectItem>
                      <SelectItem value="mandiri">Bank Mandiri</SelectItem>
                      <SelectItem value="bni">BNI (Bank Negara Indonesia)</SelectItem>
                      <SelectItem value="bri">BRI (Bank Rakyat Indonesia)</SelectItem>
                      <SelectItem value="cimb">CIMB Niaga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-600" /> Profil Fasilitas & Workshop Supplier
                    </p>
                    <p className="text-xs text-emerald-800/80 mt-1">
                      Untuk mengelola nama bengkel, upload logo/banner workshop, dan kapasitas mesin produksi—buka menu Profil Saya.
                    </p>
                  </div>
                  <Link href="/umkm/profile" className="shrink-0">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1 shadow-sm">
                      Buka Profil Saya <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Preferensi Akun")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Pengaturan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Keamanan Kata Sandi</CardTitle>
              <CardDescription className="text-xs text-slate-500">Pastikan password akun Anda kuat dan diperbarui secara berkala</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPw" className="text-xs font-semibold text-slate-700">Kata Sandi Saat Ini</Label>
                  <Input id="currentPw" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPw" className="text-xs font-semibold text-slate-700">Kata Sandi Baru</Label>
                  <Input id="newPw" type="password" placeholder="Minimal 8 karakter" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPw" className="text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</Label>
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
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Notifikasi Pesanan & RFQ</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur frekuensi dan pemicu pemberitahuan email</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Selector Box: Frekuensi Notifikasi */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Frekuensi Ringkasan Email</Label>
                <Select
                  value={preferences.emailFrequency}
                  onValueChange={(v) => updatePref("emailFrequency", v)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Pilih Frekuensi Notifikasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instan (Kirim email langsung setiap ada event)</SelectItem>
                    <SelectItem value="daily">Ringkasan Harian (Kompilasi 1x per hari pukul 08:00)</SelectItem>
                    <SelectItem value="weekly">Ringkasan Mingguan (Setiap Senin pagi)</SelectItem>
                    <SelectItem value="disabled">Nonaktifkan Ringkasan Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                <Button onClick={() => save("Preferensi Notifikasi")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Notifikasi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Privacy & Visibility */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Privasi & Visibilitas Publik</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur jangkauan pencarian bisnis Anda oleh pembeli korporat</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Selector Box: Visibilitas Profil */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                  Tingkat Visibilitas Profil Usaha
                </Label>
                <Select
                  value={preferences.visibility}
                  onValueChange={(v) => updatePref("visibility", v)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200">
                    <SelectValue placeholder="Pilih Tingkat Visibilitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Publik (Dapat ditemukan oleh semua perusahaan di Marketplace)</SelectItem>
                    <SelectItem value="verified_only">Hanya Perusahaan Terverifikasi (Hanya akun PT terverifikasi yang dapat melihat)</SelectItem>
                    <SelectItem value="private">Privat (Hanya dapat diakses melalui link penawaran langsung)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {[
                ["Tampilkan di Rekomendasi AI Match", "Muncul otomatis dalam hasil rekomendasi AI saat perusahaan memposting RFQ sejenis", true],
                ["Tampilkan Skor Kesiapan & Trust Score", "Izinkan calon pembeli melihat metrik performa on-time delivery & rating bisnis", true],
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
                <p className="text-xs text-slate-500 mt-1 mb-4">Unduh seluruh riwayat penawaran, katalog produk, dan log transaksi akun Anda.</p>
                <Button variant="outline" size="sm" onClick={() => toast.info("Permintaan ekspor data sedang diproses...")} className="rounded-xl border-slate-300">
                  Ekspor Data Usaha (JSON)
                </Button>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Pengaturan Privasi")} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Privasi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
