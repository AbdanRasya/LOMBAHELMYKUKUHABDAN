"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubmitQuotationForm({ rfqId }: { rfqId: string }) {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || isNaN(Number(price))) {
      toast.error("Masukkan harga penawaran yang valid");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId,
          price: Number(price),
          leadTimeDays: leadTime ? Number(leadTime) : null,
          notes,
        }),
      });
      if (res.ok) {
        toast.success("Penawaran Anda berhasil dikirim!");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Gagal mengirim penawaran");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Kirim Penawaran</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="price">Harga Penawaran (IDR) <span className="text-red-500">*</span></Label>
            <Input
              id="price"
              type="number"
              placeholder="Contoh: 150000000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="leadTime">Lead Time (Hari)</Label>
            <Input
              id="leadTime"
              type="number"
              placeholder="Contoh: 14"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Catatan & Keterangan</Label>
            <Textarea
              id="notes"
              placeholder="Jelaskan detail penawaran Anda, kesiapan material, dll..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Mengirim...</>
            ) : (
              <><Send className="h-4 w-4" />Kirim Penawaran</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
