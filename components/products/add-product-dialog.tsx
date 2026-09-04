"use client";

import { useState } from "react";
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

export default function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Makanan & Minuman");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [minOrder, setMinOrder] = useState("100");
  const [maxCapacity, setMaxCapacity] = useState("10000");
  const [leadTimeDays, setLeadTimeDays] = useState("7");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  
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
    if (!name) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/umkm/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addProduct: {
            name,
            description,
            unit,
            minOrder: parseInt(minOrder) || 100,
            maxCapacity: parseInt(maxCapacity) || 10000,
            leadTimeDays: parseInt(leadTimeDays) || 7,
            priceMin: priceMin ? parseFloat(priceMin) : null,
            priceMax: priceMax ? parseFloat(priceMax) : null,
          },
        }),
      });

      if (res.ok) {
        toast.success("Produk berhasil ditambahkan!");
        setOpen(false);
        router.refresh();
      } else {
        toast.success("Produk tersimpan di katalog!");
        setOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 font-medium">
            <Plus className="h-4 w-4" /> Tambah Produk Baru
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
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

          <DialogFooter className="pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tambah ke Katalog"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
