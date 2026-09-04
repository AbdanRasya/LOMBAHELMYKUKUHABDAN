"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, 
  UploadCloud, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  Image as ImageIcon, 
  Trash2, 
  Building2, 
  ShieldCheck,
  Wrench,
  Factory
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

const CITIES_BY_PROVINCE: Record<string, string[]> = {
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Utara", "Jakarta Timur", "Kepulauan Seribu"],
  "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Depok", "Karawang", "Cimahi", "Cirebon", "Sukabumi", "Purwakarta", "Tasikmalaya"],
  "Jawa Tengah": ["Semarang", "Surakarta (Solo)", "Magelang", "Pekalongan", "Tegal", "Salatiga", "Kudus", "Cilacap", "Banyumas"],
  "Jawa Timur": ["Surabaya", "Sidoarjo", "Malang", "Gresik", "Pasuruan", "Mojokerto", "Kediri", "Madiun", "Jember", "Banyuwangi"],
  "Banten": ["Tangerang", "Tangerang Selatan", "Cilegon", "Serang", "Lebak", "Pandeglang"],
  "DI Yogyakarta": ["Yogyakarta", "Sleman", "Bantul", "Gunungkidul", "Kulon Progo"],
  "Sumatera Utara": ["Medan", "Deli Serdang", "Binjai", "Pematangsiantar", "Tebing Tinggi"],
  "Sumatera Barat": ["Padang", "Bukittinggi", "Payakumbuh", "Solok"],
  "Riau": ["Pekanbaru", "Dumai", "Siak", "Kampar"],
  "Sumatera Selatan": ["Palembang", "Prabumulih", "Lubuklinggau", "Banyuasin"],
  "Lampung": ["Bandar Lampung", "Metro", "Lampung Selatan"],
  "Bali": ["Denpasar", "Badung", "Gianyar", "Tabanan", "Buleleng"],
  "Kalimantan Barat": ["Pontianak", "Singkawang", "Kubu Raya"],
  "Kalimantan Timur": ["Balikpapan", "Samarinda", "Bontang", "Kutai Kartanegara"],
  "Sulawesi Selatan": ["Makassar", "Gowa", "Maros", "Parepare", "Palopo"],
  "Nusa Tenggara Barat": ["Mataram", "Lombok Barat", "Lombok Tengah", "Sumbawa"],
};

const BUSINESS_CATEGORIES = [
  "Manufaktur & Permesinan Logam",
  "Tekstil, Pakaian & Seragam",
  "Kemasan, Plastik & Percetakan",
  "Makanan & Minuman Olahan (F&B)",
  "Bahan Bangunan & Konstruksi",
  "Kerajinan, Kayu & Furniture",
  "Komponen Otomotif & Mesin",
  "Elektronik & Otomasi Pabrik",
  "Kimia, Pembersih & Sanitasi",
  "Agrobisnis & Produk Pertanian",
  "IT, Perangkat Keras & Solusi Digital",
  "Lainnya",
];

const EMPLOYEE_RANGES = [
  { value: "5", label: "1 - 5 Tenaga Kerja (Usaha Mikro)" },
  { value: "15", label: "6 - 19 Tenaga Kerja (Usaha Kecil)" },
  { value: "50", label: "20 - 99 Tenaga Kerja (Usaha Menengah)" },
  { value: "250", label: "100+ Tenaga Kerja (Skala Besar)" },
];

export default function UMKMProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    description: "",
    category: "",
    province: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    foundedYear: "",
    employeeCount: "",
    logo: "",
    coverImage: "",
    nib: "",
  });

  const [completeness, setCompleteness] = useState(65);

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
          category: p.categories?.[0]?.name || "",
          province: p.province || "",
          city: p.city || "",
          address: p.address || "",
          phone: p.phone || "",
          email: p.email || "",
          website: p.website || "",
          foundedYear: p.foundedYear?.toString() || "",
          employeeCount: p.employeeCount?.toString() || "",
          logo: p.logo || "",
          coverImage: p.coverImage || "",
          nib: p.nib || "",
        });
        setCompleteness(p.profileCompleteness || 65);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
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

  const handleSelectChange = (field: string, value: string | null) => {
    const safeVal = value || "";
    setFormData((prev) => {
      const next = { ...prev, [field]: safeVal };
      if (field === "province") {
        const validCities = CITIES_BY_PROVINCE[safeVal] || [];
        if (!validCities.includes(prev.city)) {
          next.city = validCities[0] || "";
        }
      }
      return next;
    });
  };

  const handleFileUpload = async (
    file: File,
    type: "logo" | "cover",
    setLoadingState: (b: boolean) => void,
    onSuccess: (url: string) => void
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
        onSuccess(json.url);
        toast.success(`${type === "logo" ? "Foto logo usaha" : "Banner fasilitas"} berhasil diunggah!`);
      } else {
        toast.error(json.error || "Gagal mengunggah file");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah file");
    } finally {
      setLoadingState(false);
    }
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
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Profil mitra supplier berhasil diperbarui!");
        if (data.profile?.profileCompleteness) {
          setCompleteness(data.profile.profileCompleteness);
        }
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
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">Memuat profil supplier...</p>
      </div>
    );
  }

  const availableCities = formData.province
    ? CITIES_BY_PROVINCE[formData.province] || []
    : Object.values(CITIES_BY_PROVINCE).flat();

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-900 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Profil Usaha & Fasilitas Supplier</h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">
          Lengkapi profil bengkel, pabrik, dan kapasitas produksi untuk menarik tim pengadaan perusahaan pembeli.
        </p>
      </div>

      {/* Profile Completeness Score Card */}
      <Card className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border-emerald-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="w-full space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-emerald-950 text-sm">Skor Kesiapan Profil Supplier</span>
                </div>
                <span className="font-extrabold text-emerald-600 text-xl">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2.5 bg-emerald-200/70" />
              <p className="text-xs text-emerald-700/90 pt-0.5">
                {completeness >= 80
                  ? "Profil usaha Anda lengkap dan siap menerima pesanan RFQ industri."
                  : "Lengkapi data workshop dan foto fasilitas produksi untuk meningkatkan skor kepercayaan pembeli."}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100/70 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Status: Mitra Aktif</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs with Vertical Sidebar Navigation */}
      <Tabs defaultValue="basic" orientation="vertical" className="w-full">
        <TabsList className="bg-slate-100/90 p-2 rounded-2xl border border-slate-200/70 h-auto">
          <TabsTrigger value="basic" className="gap-3 py-3 px-4">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Identitas & Workshop</p>
              <p className="text-[11px] text-slate-400 font-normal">Nama Usaha, Lokasi & PIC</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="media" className="gap-3 py-3 px-4">
            <ImageIcon className="h-4 w-4 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Foto Fasilitas & Logo</p>
              <p className="text-[11px] text-slate-400 font-normal">Logo & Banner Pabrik</p>
            </div>
          </TabsTrigger>

          <TabsTrigger value="capacity" className="gap-3 py-3 px-4">
            <Factory className="h-4 w-4 text-indigo-600" />
            <div className="text-left">
              <p className="font-semibold text-xs sm:text-sm">Kapasitas Produksi</p>
              <p className="text-[11px] text-slate-400 font-normal">Skala Karyawan & Legalitas</p>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Info Dasar & Workshop */}
        <TabsContent value="basic" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Identitas Usaha & Lokasi Workshop</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Informasi utama yang akan dilihat oleh perusahaan pembeli saat mencari supplier di direktori.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama Bisnis */}
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-xs font-semibold text-slate-700">
                    Nama Usaha / Bengkel / Pabrik <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Contoh: Bengkel Bubut Mandiri Perkasa"
                    className="h-11 rounded-xl"
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-2">
                  <Label htmlFor="tagline" className="text-xs font-semibold text-slate-700">Spesialisasi / Tagline</Label>
                  <Input
                    id="tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="Contoh: Fabrikasi Logam Presisi & Bubut CNC"
                    className="h-11 rounded-xl"
                  />
                </div>

                {/* Sektor Industri (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Kategori Produksi Utama <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category || undefined}
                    onValueChange={(val) => handleSelectChange("category", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Kategori Produksi" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Nomor Telepon / WhatsApp PIC</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="h-11 rounded-xl"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Deskripsi Kemampuan Produksi</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Jelaskan spesialisasi produk, mesin yang dimiliki, toleransi presisi, dan pengalaman suplai Anda..."
                    className="rounded-xl resize-none"
                  />
                </div>

                {/* Provinsi (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Provinsi Lokasi Workshop <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.province || undefined}
                    onValueChange={(val) => handleSelectChange("province", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((prov) => (
                        <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Kota/Kabupaten (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Kota / Kabupaten <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.city || undefined}
                    onValueChange={(val) => handleSelectChange("city", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Kota / Kabupaten" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Alamat Lengkap */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-xs font-semibold text-slate-700">Alamat Lengkap Workshop / Pabrik</Label>
                  <Textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Jl. Raya Industri Km. 12, Kel. Sukamaju..."
                    className="rounded-xl resize-none"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 shadow-sm gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Informasi Workshop
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 2: Foto Fasilitas & Logo */}
        <TabsContent value="media" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Logo Usaha & Foto Fasilitas Produksi</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Foto workshop atau mesin yang jelas meningkatkan kepercayaan tim procurement hingga 3x lipat.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Logo Usaha */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Logo / Foto Profil Usaha</h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl border border-slate-100 bg-slate-50/40">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0">
                    {formData.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.logo} alt="Logo" className="h-full w-full object-cover" />
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
                        {uploadingLogo ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengunggah...</> : <><Camera className="h-3.5 w-3.5 text-emerald-600" /> {formData.logo ? "Ganti Logo" : "Upload Logo"}</>}
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
                    <p className="text-[11px] text-slate-400">JPG, PNG, atau WebP persegi (Maks 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Cover Banner */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Foto Banner Workshop / Fasilitas</h4>
                <div className="space-y-3">
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                    {formData.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formData.coverImage} alt="Cover Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <UploadCloud className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-600">Belum ada foto banner fasilitas</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Unggah foto workshop atau lini produksi Anda</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, "cover", setUploadingCover, (url) => {
                          setFormData((prev) => ({ ...prev, coverImage: url }));
                        });
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingCover}
                      onClick={() => coverInputRef.current?.click()}
                      className="rounded-xl border-slate-300 text-xs gap-1.5 h-9"
                    >
                      {uploadingCover ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengunggah...</> : <><ImageIcon className="h-3.5 w-3.5 text-emerald-600" /> {formData.coverImage ? "Ganti Banner" : "Upload Banner Fasilitas"}</>}
                    </Button>
                    {formData.coverImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, coverImage: "" }))}
                        className="rounded-xl text-xs text-red-600 hover:bg-red-50 h-9 gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 shadow-sm gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Perubahan Media
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 3: Kapasitas Produksi & Legalitas Dasar */}
        <TabsContent value="capacity" className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-base font-bold text-slate-900">Kapasitas Produksi & Legalitas Dasar Usaha</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Parameter kapasitas produksi untuk pencocokan otomatis dengan kuantitas pesanan RFQ pembeli.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skala Karyawan (Selector Box) */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Jumlah Tenaga Kerja / Operator Mesin</Label>
                  <Select
                    value={formData.employeeCount || undefined}
                    onValueChange={(val) => handleSelectChange("employeeCount", val)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Pilih Skala Tenaga Kerja" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEE_RANGES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tahun Berdiri */}
                <div className="space-y-2">
                  <Label htmlFor="foundedYear" className="text-xs font-semibold text-slate-700">Tahun Berdiri Workshop</Label>
                  <Input
                    id="foundedYear"
                    name="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    placeholder="Contoh: 2018"
                    className="h-11 rounded-xl"
                  />
                </div>

                {/* Nomor Induk Berusaha (NIB OSS) */}
                <div className="space-y-2">
                  <Label htmlFor="nib" className="text-xs font-semibold text-slate-700">Nomor Induk Berusaha (NIB OSS)</Label>
                  <Input
                    id="nib"
                    name="nib"
                    value={formData.nib}
                    onChange={handleChange}
                    placeholder="Nomor NIB 13 digit OSS..."
                    className="h-11 rounded-xl font-mono"
                  />
                </div>

                {/* Website / Portfolio */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-semibold text-slate-700">Website / Media Sosial Bisnis</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://instagram.com/workshop..."
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 shadow-sm gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Kapasitas Usaha
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
