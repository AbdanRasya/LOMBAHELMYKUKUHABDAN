"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Save, UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UMKMProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    description: "",
    province: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    foundedYear: "",
    employeeCount: "",
    npwp: "",
    nib: "",
    siup: "",
  });

  const [completeness, setCompleteness] = useState(0);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/umkm/profile");
      const data = await res.json();
      if (data.profile) {
        const p = data.profile;
        setFormData({
          businessName: p.businessName || "",
          tagline: p.tagline || "",
          description: p.description || "",
          province: p.province || "",
          city: p.city || "",
          address: p.address || "",
          phone: p.phone || "",
          email: p.email || "",
          website: p.website || "",
          foundedYear: p.foundedYear?.toString() || "",
          employeeCount: p.employeeCount?.toString() || "",
          npwp: p.npwp || "",
          nib: p.nib || "",
          siup: p.siup || "",
        });
        setCompleteness(p.profileCompleteness || 65);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/umkm/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          foundedYear: formData.foundedYear ? Number(formData.foundedYear) : null,
          employeeCount: formData.employeeCount ? Number(formData.employeeCount) : null,
          profileCompleteness: 85, // update completeness score
        }),
      });
      if (res.ok) {
        toast.success("Profil berhasil diperbarui!");
        setCompleteness(85);
      } else {
        toast.error("Gagal memperbarui profil");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-900">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Bisnis</h1>
        <p className="text-slate-500 mt-1 font-medium">Lengkapi profil untuk meningkatkan kepercayaan perusahaan pembeli.</p>
      </div>

      <Card className="bg-emerald-50/50 border-emerald-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full">
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold text-emerald-800">Kelengkapan Profil</span>
                <span className="font-bold text-emerald-600 text-lg">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-3 bg-emerald-200" />
            </div>
            <div className="shrink-0 flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Status: Aktif</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit">
          <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Info Dasar</TabsTrigger>
          <TabsTrigger value="legal" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Dokumen Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="focus-visible:outline-none">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Informasi Dasar Perusahaan</CardTitle>
              <CardDescription>Informasi ini akan ditampilkan di halaman profil publik Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nama Bisnis / Perusahaan</Label>
                  <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline Bisnis</Label>
                  <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="Contoh: Solusi permesinan presisi tinggi" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Deskripsi Singkat</Label>
                  <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Ceritakan tentang sejarah, fokus utama, dan keunggulan bisnis Anda." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input id="province" name="province" value={formData.province} onChange={handleChange} placeholder="Contoh: Jawa Barat" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Kota/Kabupaten</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Contoh: Bandung" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Textarea id="address" name="address" rows={2} value={formData.address} onChange={handleChange} placeholder="Alamat lengkap kantor atau pabrik..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon (Perusahaan)</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Resmi</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Opsional)</Label>
                  <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Tahun Berdiri</Label>
                    <Input id="foundedYear" name="foundedYear" type="number" value={formData.foundedYear} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Jumlah Karyawan</Label>
                    <Input id="employeeCount" name="employeeCount" type="number" value={formData.employeeCount} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
              <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white ml-auto gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="focus-visible:outline-none">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Dokumen Legalitas</CardTitle>
              <CardDescription>Dokumen ini diperlukan untuk verifikasi identitas dan legalitas bisnis Anda di SourceHub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="npwp">Nomor NPWP Perusahaan</Label>
                  <Input id="npwp" name="npwp" value={formData.npwp} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Upload NPWP</Label>
                  <div className="border border-dashed border-slate-200 rounded-lg p-3 text-center text-xs text-slate-400">
                    <UploadCloud className="h-5 w-5 text-emerald-600 mx-auto mb-1.5" />
                    <span>Upload dokumen NPWP (PDF/JPG)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nib">Nomor Induk Berusaha (NIB)</Label>
                  <Input id="nib" name="nib" value={formData.nib} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siup">Nomor SIUP / Izin Lain</Label>
                  <Input id="siup" name="siup" value={formData.siup} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
              <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white ml-auto gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Dokumen
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
