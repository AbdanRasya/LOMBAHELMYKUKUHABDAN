"use client";
import { useState } from "react";
import { Check, X, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminApprovalActions({ umkmId }: { umkmId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: "APPROVE" | "REJECT" | "SUSPEND") => {
    setLoading(action);
    try {
      const res = await fetch("/api/admin/umkm/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ umkmId, action }),
      });
      if (res.ok) {
        toast.success(`UMKM berhasil di-${action.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error("Gagal memproses persetujuan");
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
        onClick={() => handleAction("APPROVE")}
        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
      >
        {loading === "APPROVE" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        Setujui
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={loading !== null}
        onClick={() => handleAction("REJECT")}
        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 text-xs gap-1.5"
      >
        {loading === "REJECT" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
        Tolak
      </Button>
    </div>
  );
}
