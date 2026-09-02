"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactSupplierButton({ otherUserId }: { otherUserId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/company/messages?id=${data.conversation.id}`);
      } else {
        toast.error("Gagal memulai chat");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleStartChat} 
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageSquare className="h-4 w-4" />
      )}
      Hubungi Supplier
    </Button>
  );
}
