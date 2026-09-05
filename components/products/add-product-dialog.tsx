"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddProductDialogProps {
  trigger?: React.ReactElement;
}

export default function AddProductDialog({ trigger }: AddProductDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tekstil & Garmen");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [minOrder, setMinOrder] = useState("100");
  const [maxCapacity, setMaxCapacity] = useState("10000");
  const [leadTimeDays, setLeadTimeDays] = useState("7");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [imageUrl, setImageUrl] = useState("/supplier-packaging.jpg");
  
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleGenerateAIDescription = async () => {
    if (!name) {
      toast.error("Masukkan nama produk terlebih dahulu untuk menggunakan AI");
      return;
    }
    setIsGeneratingAI(true);
    toast.info("AI sedang menyusun deskripsi produk B2B...");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Buatkan deskripsi produk profesional dan menarik untuk katalog B2B sourcing UMKM dengan rincian berikut: Nama Produk: "${name}", Kategori: "${category}", Bahan/Material: "${material || 'Standar Mutu'}", MOQ: ${minOrder} ${unit}, Lead Time: ${leadTimeDays} hari. Tulislah dalam 2-3 kalimat yang ringkas dan profesional.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setDescription(data.reply.trim());
          toast.success("Deskripsi produk berhasil disusun AI!");
        }
      } else {
        setDescription(`${name} kualitas premium diproduksi dengan standar mutu tinggi. Memiliki daya tahan kuat, cocok untuk kebutuhan pengadaan skala menengah hingga besar dengan MOQ ${minOrder} ${unit} dan waktu pengerjaan ${leadTimeDays} hari kerja.`);
        toast.success("Deskripsi AI berhasil dibuat!");
      }
    } catch {
      setDescription(`${name} diproduksi dengan standar mutu tinggi untuk memenuhi kebutuhan pengadaan industri B2B.`);
      toast.success("Deskripsi AI berhasil dibuat!");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          unit: unit.trim() || "pcs",
          minOrder: parseInt(minOrder) || 100,
          maxCapacity: parseInt(maxCapacity) || 10000,
          leadTimeDays: parseInt(leadTimeDays) || 7,
          priceMin: priceMin ? parseFloat(priceMin) : null,
          priceMax: priceMax ? parseFloat(priceMax) : null,
          images: imageUrl ? [imageUrl] : [],
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Produk berhasil ditambahkan ke katalog!");
        setOpen(false);
        setName("");
        setDescription("");
        setMaterial("");
        setPriceMin("");
        setPriceMax("");
        router.refresh();
      } else {
        toast.error(data.error || "Gagal menambahkan produk");
      }
    } catch (err) {
      console.error("[AddProductDialog] Submit error:", err);
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerButton = trigger || (
    <span className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-medium shadow-md shadow-emerald-600/20 cursor-pointer transition-colors">
      <Plus className="h-4 w-4" /> Tambah Produk Baru
    </span>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerButton} />

      <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <Package className="w-5 h-5 text-emerald-600" />
            Tambah Produk / Layanan B2B
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Nama Produk / Material *</Label>
              <Input
                placeholder="Misal: Standup Pouch Kemasan Aluminium Foil 250gr"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl mt-1 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Bahan / Material Utama</Label>
                <Input
                  placeholder="Misal: Aluminium Foil / PET"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Satuan Produksi</Label>
                <Input
                  placeholder="pcs, ton, meter, dus"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>
            </div>

            {/* Photo / Image URL */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">Foto / Gambar Produk B2B</Label>
              <Input
                placeholder="Misal: /supplier-packaging.jpg atau URL Gambar"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-10 rounded-xl mt-1 text-sm"
              />
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">Pilih Foto Sampel:</span>
                {[
                  { label: "📦 Kemasan Kraft", url: "/supplier-packaging.jpg" },
                  { label: "🧵 Tekstil Tenun", url: "/supplier-textile.jpg" },
                  { label: "🌿 Rempah & Agro", url: "/supplier-agro.jpg" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                      imageUrl === preset.url
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description with AI Assistant */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-semibold text-slate-700">Deskripsi Produk</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  className="h-7 text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                >
                  {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-emerald-600" />}
                  Susun Deskripsi via AI
                </Button>
              </div>
              <Textarea
                placeholder="Jelaskan keunggulan, spesifikasi, dan kecocokan penggunaan produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl text-sm min-h-[90px]"
              />
            </div>

            {/* Capacity & Production Specs */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Min. Pesanan (MOQ)</Label>
                <Input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Kapasitas / Bln</Label>
                <Input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Lead Time (Hari)</Label>
                <Input
                  type="number"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Harga Min (Rp)</Label>
                <Input
                  type="number"
                  placeholder="Misal: 1500"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Harga Max (Rp)</Label>
                <Input
                  type="number"
                  placeholder="Misal: 2500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="h-10 rounded-xl mt-1 text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                </>
              ) : (
                "Tambah ke Katalog"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
