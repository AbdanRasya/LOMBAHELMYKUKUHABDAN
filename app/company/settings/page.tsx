"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Lock, Bell, Loader2, Globe, Clock, DollarSign, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompanySettingsPage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    picName: "",
    email: "",
    language: "id",
    timezone: "WIB",
    currency: "IDR",
    emailFrequency: "instant",
  });

  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      setFormData((prev) => ({
        ...prev,
        picName: prev.picName || user.name || "",
        email: user.email || prev.email || "",
      }));
    }
  }, [session]);

  const updateField = (field: string, val: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: val || "" }));
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Pengaturan Perusahaan</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola preferensi akun, regional, keamanan, dan parameter notifikasi pengadaan</p>
      </div>

      <Tabs defaultValue="account" orientation="vertical" className="w-full">
        <TabsList className="bg-slate-100/90 p-2 rounded-2xl border border-slate-200/70 h-auto">
          <TabsTrigger value="account" className="gap-3 py-3 px-4">
            <User className="h-4 w-4 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Akun & Preferensi</p>
              <p className="text-[11px] text-slate-400 font-normal">PIC, Bahasa & Mata Uang</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="security" className="gap-3 py-3 px-4">
            <Lock className="h-4 w-4 text-emerald-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Keamanan & Password</p>
              <p className="text-[11px] text-slate-400 font-normal">Kata Sandi & Proteksi</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="notifications" className="gap-3 py-3 px-4">
            <Bell className="h-4 w-4 text-indigo-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Notifikasi Procurement</p>
              <p className="text-[11px] text-slate-400 font-normal">Email & Peringatan RFQ</p>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Account & Preferences */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Info Akun & Preferensi Regional</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pengaturan penanggung jawab pengadaan, bahasa antarmuka, dan format mata uang sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Nama PIC Pengadaan (Procurement Manager)</Label>
                  <Input
                    value={formData.picName}
                    onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                    placeholder="Nama Lengkap PIC"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Email Akun Procurement</Label>
                  <Input
                    value={formData.email}
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
                    value={formData.language}
                    onValueChange={(val) => updateField("language", val)}
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
                    value={formData.timezone}
                    onValueChange={(val) => updateField("timezone", val)}
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
                    Format Mata Uang Default
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(val) => updateField("currency", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Format Mata Uang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR - Rupiah Indonesia (Rp)</SelectItem>
                      <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Link to Corporate Profile */}
              <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-blue-950 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" /> Profil & Legalitas NPWP Perusahaan
                    </p>
                    <p className="text-xs text-blue-800/80 mt-1">
                      Untuk mengubah nama PT, logo perusahaan, sektor industri, dan melampirkan berkas NPWP/NIB, buka menu Profil Perusahaan.
                    </p>
                  </div>
                  <Link href="/company/profile" className="shrink-0">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1 shadow-sm">
                      Buka Profil Perusahaan <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Pengaturan Akun")} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-sm">
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
              <CardTitle className="text-base font-bold text-slate-900">Keamanan & Password</CardTitle>
              <CardDescription className="text-xs text-slate-500">Perbarui kata sandi Anda secara berkala untuk keamanan akun perusahaan</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-semibold text-slate-700">Kata Sandi Saat Ini</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-700">Kata Sandi Baru</Label>
                  <Input id="newPassword" type="password" placeholder="Minimal 8 karakter" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</Label>
                  <Input id="confirmPassword" type="password" placeholder="Ulangi kata sandi baru" className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Kata Sandi")} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-sm">
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
              <CardTitle className="text-base font-bold text-slate-900">Preferensi Notifikasi Procurement</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur pemberitahuan email dan aktivitas transaksi pengadaan</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Selector Box: Frekuensi Notifikasi */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Frekuensi Ringkasan Email Procurement</Label>
                <Select
                  value={formData.emailFrequency}
                  onValueChange={(v) => updateField("emailFrequency", v)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Pilih Frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instan (Notifikasi saat penawaran masuk diterima)</SelectItem>
                    <SelectItem value="daily">Harian (Ringkasan status RFQ & order tiap pagi)</SelectItem>
                    <SelectItem value="weekly">Mingguan (Laporan analisis procurement mingguan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {[
                ["Notifikasi Email Transactional", "Terima pemberitahuan email untuk setiap perubahan status transaksi & RFQ", true],
                ["Penawaran Masuk Baru", "Notifikasi instan saat supplier mengirim penawaran atas RFQ Anda", true],
                ["Update Pesanan & Pengiriman", "Pemberitahuan saat supplier memperbarui status barang/resi pengiriman", true],
                ["Rekomendasi AI Supplier", "Email mingguan supplier baru yang cocok dengan kriteria procurement Anda", false],
              ].map(([label, desc, def]) => (
                <div key={label as string} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-slate-900">{label as string}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc as string}</p>
                  </div>
                  <Switch defaultChecked={def as boolean} />
                </div>
              ))}

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Preferensi Notifikasi")} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Preferensi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
