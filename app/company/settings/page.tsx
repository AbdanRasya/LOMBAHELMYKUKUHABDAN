"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Building2, Lock, Bell, Loader2 } from "lucide-react";

export default function CompanySettingsPage() {
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Perusahaan</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola preferensi akun, profil bisnis, dan keamanan perusahaan Anda</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex flex-wrap w-full bg-slate-100/80 p-1.5 rounded-2xl gap-1 border border-slate-200/60">
          {[
            ["profile", Building2, "Profil Bisnis"],
            ["security", Lock, "Keamanan"],
            ["notifications", Bell, "Notifikasi"],
          ].map(([v, Icon, label]) => (
            <TabsTrigger
              key={v as string}
              value={v as string}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold sm:text-sm rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
            >
              <Icon className="h-4 w-4" />
              {label as string}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Profil Perusahaan</CardTitle>
              <CardDescription className="text-xs text-slate-500">Informasi ini akan ditampilkan pada penawaran & RFQ publik</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-xs font-medium text-slate-700">Nama Perusahaan</Label>
                  <Input id="companyName" placeholder="PT. Maju Bersama Indonesia" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-xs font-medium text-slate-700">Sektor Industri</Label>
                  <Input id="industry" placeholder="Konstruksi & Properti" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium text-slate-700">Nomor Telepon / WhatsApp</Label>
                  <Input id="phone" placeholder="+62 812-3456-7890" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-medium text-slate-700">Website Perusahaan</Label>
                  <Input id="website" placeholder="https://majubersama.co.id" className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Provinsi</Label>
                  <Input placeholder="DKI Jakarta" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Kota / Kabupaten</Label>
                  <Input placeholder="Jakarta Selatan" className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-xs font-medium text-slate-700">Deskripsi Singkat Perusahaan</Label>
                <Textarea placeholder="Tuliskan deskripsi bidang usaha dan kebutuhan pengadaan perusahaan Anda..." className="min-h-[110px] rounded-xl resize-none" />
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={() => save("Profil Perusahaan")} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-sm">
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
              <CardTitle className="text-base font-bold text-slate-900">Keamanan & Password</CardTitle>
              <CardDescription className="text-xs text-slate-500">Perbarui kata sandi Anda secara berkala untuk keamanan akun</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-medium text-slate-700">Kata Sandi Saat Ini</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-medium text-slate-700">Kata Sandi Baru</Label>
                  <Input id="newPassword" type="password" placeholder="Minimal 8 karakter" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-700">Konfirmasi Kata Sandi Baru</Label>
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
        <TabsContent value="notifications">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Preferensi Notifikasi</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur pemberitahuan email dan aktivitas transaksi</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
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
