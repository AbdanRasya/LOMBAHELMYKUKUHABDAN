"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, FileText, Calendar, DollarSign, Wand2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function CreateRfqForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const targetUmkmIdParam = searchParams.get("targetUmkmId") || searchParams.get("umkmId") || null;
  const productParam = searchParams.get("product") || null;
  const umkmNameParam = searchParams.get("umkmName") || null;

  const [step, setStep] = useState(1);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: productParam ? `Request Quote: ${productParam}` : "",
    category: "",
    quantity: "",
    unit: "pcs",
    description: productParam ? `Kami tertarik untuk meminta penawaran harga untuk produk "${productParam}".` : "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    specifications: ""
  });

  useEffect(() => {
    if (productParam && !formData.title) {
      setFormData(prev => ({
        ...prev,
        title: `Request Quote: ${productParam}`,
        description: `Kami tertarik untuk meminta penawaran harga untuk produk "${productParam}".`
      }));
    }
  }, [productParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAIGenerate = () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    // Simulate AI Generation
    setTimeout(() => {
      setFormData({
        title: "Kebutuhan Material Baja Konstruksi Tipe A36",
        category: "bahan-bangunan",
        quantity: "1500",
        unit: "ton",
        description: "Kami membutuhkan suplai baja konstruksi tipe A36 untuk proyek pembangunan gedung perkantoran 20 lantai di Jakarta Selatan. Baja harus memiliki sertifikat SNI dan mill certificate.",
        budgetMin: "150000000",
        budgetMax: "200000000",
        deadline: "2023-12-15",
        specifications: "- Tipe: Baja Karbon A36\n- Bentuk: H-Beam dan IWF\n- Ukuran bervariasi sesuai lampiran teknis\n- Dilengkapi sertifikat SNI\n- Pengiriman bertahap (3 fase) ke site Jakarta Selatan"
      });
      setIsGenerating(false);
      setStep(1);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Judul RFQ wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          unit: formData.unit || null,
          budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
          budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
          deadline: formData.deadline || null,
          specifications: formData.specifications || null,
          targetUmkmId: targetUmkmIdParam || null,
        }),
      });
      if (res.ok) {
        if (targetUmkmIdParam) {
          toast.success("Penawaran direct berhasil dikirim! UMKM target telah mendapatkan notifikasi.");
        } else {
          toast.success("RFQ berhasil dibuat! Supplier akan segera merespons.");
        }
        router.push("/company/rfq");
      } else {
        const err = await res.json();
        toast.error(err.error || "Gagal membuat RFQ");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {targetUmkmIdParam ? "Kirim Penawaran Direct" : "Buat RFQ Baru"}
        </h1>
        <p className="text-sm text-slate-500">
          {targetUmkmIdParam 
            ? "Permintaan penawaran ini akan dikirimkan khusus ke UMKM terpilih." 
            : "Isi detail kebutuhan Anda untuk mendapatkan penawaran terbaik dari supplier."}
        </p>
      </div>

      {targetUmkmIdParam && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 flex items-center gap-3 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-indigo-600 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Privat & Khusus untuk {umkmNameParam || "UMKM Terpilih"}</p>
            <p className="mt-0.5 text-indigo-700">
              RFQ ini akan dikirimkan secara langsung ke notifikasi UMKM tersebut dan **tidak dipublikasikan ke pasar terbuka**.
            </p>
          </div>
        </div>
      )}

      {/* AI Quick Input */}
      <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wand2 className="h-24 w-24 text-indigo-600" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 space-y-2 w-full">
              <Label className="text-indigo-900 font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI Quick Fill
              </Label>
              <Textarea 
                placeholder="Ceritakan apa yang Anda butuhkan secara natural. Contoh: 'Saya butuh 500 kaos polo warna navy untuk seragam panitia event, budget maksimal 50 ribu per pcs, harus selesai akhir bulan ini.'"
                className="resize-none h-20 bg-white border-indigo-200"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAIGenerate} 
              disabled={!aiPrompt || isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto transition-all shadow-md shadow-indigo-500/20"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 animate-spin" /> Menganalisa...</span>
              ) : (
                <span className="flex items-center gap-2"><Wand2 className="h-4 w-4" /> Generate Form</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 ease-in-out -z-10 rounded-full`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        {[1, 2, 3].map((num) => (
          <div key={num} className={`flex flex-col items-center gap-2 bg-slate-50 px-2`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2 ${
              step >= num 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30' 
                : 'bg-white border-slate-300 text-slate-400'
            }`}>
              {step > num ? <CheckCircle2 className="h-5 w-5" /> : num}
            </div>
            <span className={`text-xs font-medium ${step >= num ? 'text-slate-900' : 'text-slate-400'}`}>
              {num === 1 ? 'Detail Kebutuhan' : num === 2 ? 'Budget & Waktu' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-none shadow-md shadow-slate-200/50">
        <CardContent className="p-6 md:p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul RFQ <span className="text-red-500">*</span></Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Pengadaan Seragam Karyawan 2024" className="h-12" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
                    <Select value={formData.category || ""} onValueChange={(val) => handleSelectChange('category', val || "")}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bahan-bangunan">Bahan Bangunan</SelectItem>
                        <SelectItem value="tekstil">Tekstil & Pakaian</SelectItem>
                        <SelectItem value="it">IT & Software</SelectItem>
                        <SelectItem value="otomotif">Otomotif & Sparepart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Kuantitas <span className="text-red-500">*</span></Label>
                      <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="100" className="h-12" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Satuan</Label>
                      <Select value={formData.unit || ""} onValueChange={(val) => handleSelectChange('unit', val || "")}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Satuan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pcs">Pcs</SelectItem>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="ton">Ton</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                          <SelectItem value="unit">Unit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi Singkat <span className="text-red-500">*</span></Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Jelaskan secara garis besar apa yang Anda butuhkan..." className="min-h-[120px]" />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 px-8 h-12 rounded-xl">
                  Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budgetMin">Estimasi Budget Minimal (Rp)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="budgetMin" name="budgetMin" type="number" value={formData.budgetMin} onChange={handleChange} placeholder="10.000.000" className="pl-10 h-12" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budgetMax">Estimasi Budget Maksimal (Rp) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="budgetMax" name="budgetMax" type="number" value={formData.budgetMax} onChange={handleChange} placeholder="50.000.000" className="pl-10 h-12" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="deadline">Batas Waktu Penawaran <span className="text-red-500">*</span></Label>
                  <div className="relative md:w-1/2">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="pl-10 h-12" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="specifications">Spesifikasi Detail / Syarat Khusus</Label>
                  <Textarea id="specifications" name="specifications" value={formData.specifications} onChange={handleChange} placeholder="Tuliskan spesifikasi teknis, syarat pengiriman, termin pembayaran, dll..." className="min-h-[150px]" />
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6 rounded-xl">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
                <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 px-8 h-12 rounded-xl">
                  Review <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Judul RFQ</h3>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formData.title || '-'}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><FileText className="h-4 w-4" /> Kategori</h3>
                    <p className="font-medium">{formData.category || '-'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Kuantitas</h3>
                    <p className="font-medium">{formData.quantity} {formData.unit}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Batas Waktu</h3>
                    <p className="font-medium">{formData.deadline || '-'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Estimasi Budget</h3>
                  <p className="font-medium text-emerald-600">
                    Rp {Number(formData.budgetMin).toLocaleString('id-ID')} - Rp {Number(formData.budgetMax).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Deskripsi Kebutuhan</h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-100">{formData.description || '-'}</p>
                </div>

                {formData.specifications && (
                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Spesifikasi Detail</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-100">{formData.specifications}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-6 rounded-xl">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Edit Kembali
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl shadow-md shadow-emerald-500/20">
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</>
                  ) : (
                    <><CheckCircle2 className="mr-2 h-4 w-4" /> {targetUmkmIdParam ? "Kirim Penawaran Direct" : "Kirim RFQ"}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateRfqPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
      <CreateRfqForm />
    </Suspense>
  );
}
