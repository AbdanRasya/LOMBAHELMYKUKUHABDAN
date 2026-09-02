"use client";
import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CertApprovalActions({ certId }: { certId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: "VERIFIED" | "REJECTED") => {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/certifications/${certId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) {
        toast.success(`Sertifikasi berhasil di-${action.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error("Gagal memproses sertifikasi");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2 border-t border-slate-100 pt-4">
      <Button
        size="sm"
        disabled={loading !== null}
        onClick={() => handleAction("VERIFIED")}
        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
      >
        {loading === "VERIFIED" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        Verifikasi
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={loading !== null}
        onClick={() => handleAction("REJECTED")}
        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 text-xs gap-1.5"
      >
        {loading === "REJECTED" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
        Tolak
      </Button>
    </div>
  );
}
