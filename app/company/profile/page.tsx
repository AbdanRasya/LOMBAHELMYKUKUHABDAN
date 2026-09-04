"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  UploadCloud, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  Trash2, 
  Building2, 
  FileText, 
  ShieldCheck,
  FileCheck,
  AlertCircle,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

const PROVINCES = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Banten",
  "DI Yogyakarta",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Sumatera Selatan",
  "Lampung",
  "Bali",
  "Kalimantan Barat",
  "Kalimantan Timur",
  "Sulawesi Selatan",
  "Nusa Tenggara Barat",
];

const INDUSTRIES = [
  "Konstruksi & Properti",
  "Manufaktur & Alat Berat",
  "Pertambangan & Energi",
  "Teknologi Informasi & Telekomunikasi",
  "FMCG & Ritel",
  "Logistik & Transportasi",
  "Farmasi & Layanan Kesehatan",
  "Otomotif & Transportasi",
  "Pertanian & Perkebunan",
  "Lainnya",
];

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingNpwp, setUploadingNpwp] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const npwpInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    province: "",
    city: "",
    address: "",
    phone: "",
    website: "",
    description: "",
    logo: "",
    npwp: "",
    npwpDocName: "",
    verified: false,
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/company/profile");
      const data = await res.json();
      if (data.profile) {
        const p = data.profile;
        setFormData({
          companyName: p.companyName || "",
          industry: p.industry || "",
          province: p.province || "",
          city: p.city || "",
          address: p.address || "",
          phone: p.phone || "",
          website: p.website || "",
          description: p.description || "",
          logo: p.logo || "",
          npwp: p.npwp || "",
          npwpDocName: p.npwp ? "Bukti_NPWP_Perusahaan.pdf" : "",
          verified: p.verified || false,
        });
      }
    } catch (e) {
      console.error("Failed to load company profile", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateField = (field: string, val: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: val || "" }));
  };

  const handleFileUpload = async (
    file: File,
    type: "logo" | "doc",
    setLoadingState: (b: boolean) => void,
    onSuccess: (url: string, fileName: string) => void
  ) => {
    setLoadingState(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        onSuccess(json.url, file.name);
        toast.success(`${type === "logo" ? "Logo perusahaan" : "Dokumen bukti NPWP"} berhasil diunggah!`);
      } else {
        toast.error(json.error || "Gagal mengunggah berkas");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah");
    } finally {
      setLoadingState(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/company/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Profil perusahaan berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan profil perusahaan");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Memuat profil perusahaan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-900 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Profil Perusahaan & Legalitas</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Kelola identitas korporat, alamat kantor pusat, dan dokumen legalitas NPWP perusahaan Anda
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-xs font-semibold text-blue-800 border border-blue-200 shrink-0">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>{formData.verified ? "Akun Terverifikasi" : "Verifikasi Pajak & Legalitas"}</span>
        </div>
      </div>

      {/* Tabs with Vertical Sidebar Navigation */}
      <Tabs defaultValue="company-info" orientation="vertical" className="w-full">
        <TabsList className="bg-slate-100/90 p-2 rounded-2xl border border-slate-200/70 h-auto">
          <TabsTrigger value="company-info" className="gap-3 py-3 px-4">
            <Building2 className="h-4 w-4 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Identitas Korporasi</p>
              <p className="text-[11px] text-slate-400 font-normal">Nama PT, Sektor, & Logo</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="location-contact" className="gap-3 py-3 px-4">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Lokasi & Kontak</p>
              <p className="text-[11px] text-slate-400 font-normal">Alamat Kantor & PIC</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="legal-npwp" className="gap-3 py-3 px-4">
            <FileText className="h-4 w-4 text-indigo-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Legalitas & NPWP</p>
              <p className="text-[11px] text-slate-400 font-normal">Bukti NPWP & Izin Usaha</p>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Identitas Korporasi */}
        <TabsContent value="company-info" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Identitas Resmi Perusahaan</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Informasi nama entitas, logo perusahaan, dan sektor industri yang ditampilkan saat membuat RFQ publik.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Logo Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl border border-slate-100 bg-slate-50/40">
                <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0">
                  {formData.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.logo} alt="Company Logo" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-10 w-10 text-slate-300" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, "logo", setUploadingLogo, (url) => {
                          setFormData((prev) => ({ ...prev, logo: url }));
                        });
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                      className="rounded-xl border-slate-300 text-xs gap-1.5 h-9"
                    >
                      {uploadingLogo ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengunggah...</>
                      ) : (
                        <><Camera className="h-3.5 w-3.5 text-blue-600" /> {formData.logo ? "Ganti Logo PT" : "Upload Logo PT"}</>
                      )}
                    </Button>
                    {formData.logo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, logo: "" }))}
                        className="rounded-xl text-xs text-red-600 hover:bg-red-50 h-9 gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Logo perusahaan dalam format JPG, PNG, atau WebP (Maks 5MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-xs font-semibold text-slate-700">
                    Nama Badan Usaha / PT / CV <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Contoh: PT Sumber Makmur Nusantara"
                    className="h-11 rounded-xl"
                  />
                </div>

                {/* Sektor Industri (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Sektor Industri Utama <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.industry || undefined}
                    onValueChange={(val) => updateField("industry", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Sektor Industri" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
                    Deskripsi Bidang Usaha & Kebutuhan Procurement
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tuliskan spesifikasi umum pengadaan dan bidang operasional perusahaan Anda..."
                    className="rounded-xl resize-none"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 shadow-sm gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 2: Lokasi & Kontak Kantor */}
        <TabsContent value="location-contact" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Lokasi Kantor Pusat & Kontak PIC</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Alamat pengiriman kontrak, penagihan invoice, dan PIC procurement yang dapat dihubungi supplier.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Provinsi (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Provinsi Kantor Pusat <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.province || undefined}
                    onValueChange={(val) => updateField("province", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-semibold text-slate-700">
                    Kota / Kabupaten <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Contoh: Jakarta Selatan"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-xs font-semibold text-slate-700">Alamat Lengkap Kantor Pusat</Label>
                  <Textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Gedung Menara Mandiri Lt. 15, Jl. Jend. Sudirman Kav. 54..."
                    className="rounded-xl resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Nomor Telepon / PIC Procurement</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62 812-3456-7890"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-semibold text-slate-700">Website Resmi Perusahaan</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://perusahaan.co.id"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 shadow-sm gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Lokasi & Kontak
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 3: Legalitas & NPWP Perusahaan */}
        <TabsContent value="legal-npwp" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Dokumen Legalitas & NPWP Perusahaan</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Lampirkan bukti NPWP dan dokumen legalitas perusahaan pembeli untuk validasi transaksi B2B resmi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nomor NPWP Perusahaan */}
                <div className="space-y-2">
                  <Label htmlFor="npwp" className="text-xs font-semibold text-slate-700">
                    Nomor NPWP Perusahaan / Badan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="npwp"
                    name="npwp"
                    value={formData.npwp}
                    onChange={handleChange}
                    placeholder="Contoh: 01.234.567.8-012.000"
                    className="h-11 rounded-xl font-mono"
                  />
                </div>

                {/* Upload Bukti Dokumen NPWP */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Lampirkan Bukti Dokumen NPWP (PDF/JPG/PNG) <span className="text-red-500">*</span>
                  </Label>
                  <input
                    ref={npwpInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, "doc", setUploadingNpwp, (_, name) => {
                          setFormData((prev) => ({ ...prev, npwpDocName: name }));
                        });
                      }
                    }}
                  />

                  <div
                    onClick={() => npwpInputRef.current?.click()}
                    className="border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 transition-all rounded-xl p-3.5 cursor-pointer text-center group"
                  >
                    {uploadingNpwp ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-blue-700 font-medium py-1">
                        <Loader2 className="h-4 w-4 animate-spin" /> Mengunggah bukti NPWP...
                      </div>
                    ) : formData.npwpDocName ? (
                      <div className="flex items-center justify-between px-2 py-0.5">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck className="h-5 w-5 text-blue-600 shrink-0" />
                          <span className="text-xs font-semibold text-slate-800 truncate">{formData.npwpDocName}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 shrink-0">Terunggah</Badge>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="h-5 w-5 text-blue-600 mx-auto group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-medium text-slate-700">Klik untuk upload bukti NPWP perusahaan</p>
                        <p className="text-[10px] text-slate-400">PDF, JPG, atau PNG (Maks 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-900">Verifikasi Pajak & Faktur Pajak Otomatis</p>
                  <p className="text-xs text-blue-800/90 leading-relaxed">
                    Dokumen NPWP Perusahaan digunakan untuk validasi legalitas korporasi pembeli, penerbitan Purchase Order (PO) bermaterai, dan rekonsiliasi e-Faktur Pajak dengan supplier mitra.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 shadow-sm gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Dokumen Legalitas
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
