"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Cpu, Bell, HardDrive, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const save = async (section: string) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success(`Pengaturan ${section} berhasil disimpan!`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Platform Admin</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi parameter global, fitur AI, dan preferensi sistem platform</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex flex-wrap w-full bg-slate-100/80 p-1.5 rounded-2xl gap-1 border border-slate-200/60">
          {[
            ["general", Settings, "Umum"],
            ["ai", Cpu, "Fitur AI"],
            ["notifications", Bell, "Notifikasi Global"],
            ["system", HardDrive, "Sistem"],
          ].map(([v, Icon, label]) => (
            <TabsTrigger
              key={v as string}
              value={v as string}
              className="flex-1 min-w-[110px] flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold sm:text-sm rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md"
            >
              <Icon className="h-4 w-4" />
              {label as string}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: General */}
        <TabsContent value="general">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Pengaturan Umum Platform</CardTitle>
              <CardDescription className="text-xs text-slate-500">Identitas dan parameter publik aplikasi SourceHub</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Nama Aplikasi</Label>
                  <Input defaultValue="SourceHub" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Domain Utama</Label>
                  <Input defaultValue="https://sourcehub.id" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-medium text-slate-700">Email Bantuan & Support</Label>
                  <Input defaultValue="support@sourcehub.id" className="h-11 rounded-xl max-w-md" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 mt-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Mode Pemeliharaan (Maintenance Mode)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Nonaktifkan akses umum publik sementara untuk keperluan sistem upgrade</p>
                </div>
                <Switch />
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Umum")} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: AI */}
        <TabsContent value="ai">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Konfigurasi AI Gemini & Analytics</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur aktif/nonaktif fitur cerdas pengadaan</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                ["AI Supplier Matching Engine", "Pencocokan supplier otomatis berbasis kebutuhan industri menggunakan Google Gemini", true],
                ["AI Supply Gap Opportunity Detector", "Deteksi peluang ketimpangan pasokan antar wilayah Indonesia", true],
                ["AI Readiness Score Heuristics", "Sistem penilaian kelayakan otomatis dokumen & kapasitas UMKM", true],
                ["AI Procurement Chat Assistant", "Chatbot asisten cerdas untuk membantu pembuatan RFQ perusahaan", true],
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
                <Button onClick={() => save("Fitur AI")} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Notifications */}
        <TabsContent value="notifications">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Notifikasi Global Platform</CardTitle>
              <CardDescription className="text-xs text-slate-500">Preferensi pengiriman email broadcast dan alert sistem</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                ["Email Pendaftaran Pengguna Baru", "Kirim email instruksi verifikasi otomatis saat registrasi", true],
                ["Broadcast Bulletin RFQ Mingguan", "Kirim email daftar RFQ baru secara berkala kepada UMKM terverifikasi", true],
                ["Alert Kegagalan Sistem & Log Audit", "Kirim email peringatan jika terjadi aktivitas tidak wajar pada platform", false],
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
                <Button onClick={() => save("Notifikasi Global")} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: System */}
        <TabsContent value="system">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Sistem & Keamanan Unggahan</CardTitle>
              <CardDescription className="text-xs text-slate-500">Atur batas berkas dan kebijakan verifikasi legalitas</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2 max-w-sm">
                <Label className="text-xs font-medium text-slate-700">Batas Maksimum Unggahan Dokumen (MB)</Label>
                <Input type="number" defaultValue="10" className="h-11 rounded-xl" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors pt-4 border-t border-slate-100">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-slate-900">Mewajibkan Verifikasi NIB</p>
                  <p className="text-xs text-slate-500 mt-0.5">UMKM wajib mengunggah NIB sebelum dapat mengirimkan penawaran harga pada RFQ</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <Button onClick={() => save("Sistem & Keamanan")} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-sm">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
