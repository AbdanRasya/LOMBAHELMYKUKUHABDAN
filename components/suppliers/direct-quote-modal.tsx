"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, FileText, Calendar, DollarSign, Loader2, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DirectQuoteModalProps {
  supplierId: string;
  supplierName: string;
  initialTitle?: string;
  initialQuantity?: string;
  initialUnit?: string;
  initialDescription?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function DirectQuoteModal({
  supplierId,
  supplierName,
  initialTitle,
  initialQuantity,
  initialUnit,
  initialDescription,
  trigger,
  onSuccess,
}: DirectQuoteModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: initialTitle || "",
    quantity: initialQuantity || "",
    unit: initialUnit || "pcs",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    description: initialDescription || "",
    specifications: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: initialTitle || "",
        quantity: initialQuantity || "",
        unit: initialUnit || "pcs",
        budgetMin: "",
        budgetMax: "",
        deadline: "",
        description: initialDescription || "",
        specifications: "",
      });
      // Focus title on open
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, initialTitle, initialQuantity, initialUnit, initialDescription]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const doSubmit = async () => {
    // Manual validation
    if (!formData.title || !formData.title.trim()) {
      toast.error("Judul kebutuhan wajib diisi");
      titleRef.current?.focus();
      return;
    }

    if (!supplierId) {
      toast.error("ID supplier tidak valid");
      return;
    }

    setIsSubmitting(true);

    const toastId = toast.loading("Mengirimkan permintaan penawaran...");

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description || "",
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        unit: formData.unit || "pcs",
        budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
        deadline: formData.deadline || null,
        specifications: formData.specifications || null,
        targetUmkmId: supplierId,
      };

      console.log("[DirectQuoteModal] Submitting payload:", payload);

      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("[DirectQuoteModal] Response status:", res.status, res.statusText);

      let data: { rfq?: unknown; success?: boolean; error?: string } = {};
      try {
        data = await res.json();
        console.log("[DirectQuoteModal] Response data:", data);
      } catch (jsonErr) {
        console.error("[DirectQuoteModal] Failed to parse JSON response:", jsonErr);
      }

      if (res.ok && (data.rfq || data.success)) {
        toast.success(`✅ Penawaran berhasil dikirim ke ${supplierName}!`, { id: toastId });
        setOpen(false);
        if (onSuccess) onSuccess();
        setTimeout(() => router.push("/company/rfq"), 1000);
      } else if (res.status === 401) {
        toast.error("⚠️ Anda harus login sebagai Company terlebih dahulu", { id: toastId });
      } else {
        const errMsg = data.error || `Error ${res.status}: Gagal mengirim penawaran`;
        toast.error(errMsg, { id: toastId });
        console.error("[DirectQuoteModal] Server error:", errMsg);
      }
    } catch (err) {
      console.error("[DirectQuoteModal] Network/fetch error:", err);
      toast.error("Terjadi kesalahan jaringan. Cek koneksi internet Anda.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void doSubmit();
  };

  const handleOpenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {/* Trigger wrapper */}
      <span
        role="button"
        tabIndex={0}
        onClick={handleOpenClick}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        style={{ display: "inline-block", cursor: "pointer" }}
      >
        {trigger || (
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium px-4 py-2 text-xs flex items-center gap-2 transition-colors"
          >
            <Send className="h-4 w-4" /> Minta Penawaran Direct
          </button>
        )}
      </span>

      {/* Modal Portal */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            // Close when clicking backdrop
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "1rem",
              maxWidth: "36rem",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              padding: "1.5rem",
              position: "relative",
              color: "#0f172a",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.375rem",
                borderRadius: "0.5rem",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText style={{ width: "1.25rem", height: "1.25rem", color: "#4f46e5" }} />
                Minta Penawaran Direct
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                Kirim rincian kebutuhan langsung &amp; privat ke{" "}
                <strong style={{ color: "#1e293b" }}>{supplierName}</strong>
              </p>
            </div>

            {/* Info Box */}
            <div
              style={{
                background: "#eef2ff",
                border: "1px solid #c7d2fe",
                borderRadius: "0.75rem",
                padding: "0.875rem",
                fontSize: "0.75rem",
                color: "#312e81",
                display: "flex",
                gap: "0.625rem",
                marginBottom: "1rem",
              }}
            >
              <ShieldAlert style={{ width: "1rem", height: "1rem", color: "#4f46e5", flexShrink: 0, marginTop: "0.125rem" }} />
              <div>
                <p style={{ fontWeight: 600, color: "#1e1b4b" }}>Privat &amp; Khusus untuk {supplierName}</p>
                <p style={{ marginTop: "0.25rem", color: "#4338ca" }}>
                  Notifikasi instan dikirimkan ke akun UMKM ini. UMKM lain tidak dapat melihat permintaan ini.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>
                  Judul Permintaan <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  ref={titleRef}
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pengadaan 500 Pcs Kemasan Box Karton"
                  style={{
                    width: "100%",
                    height: "2.5rem",
                    padding: "0 0.75rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>
                    Kuantitas
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="500"
                    style={{
                      width: "100%",
                      height: "2.5rem",
                      padding: "0 0.75rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>
                    Satuan
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{
                      width: "100%",
                      height: "2.5rem",
                      padding: "0 0.75rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                    }}
                  >
                    <option value="pcs">Pcs</option>
                    <option value="kg">Kg</option>
                    <option value="ton">Ton</option>
                    <option value="liter">Liter</option>
                    <option value="unit">Unit</option>
                    <option value="pack">Pack / Paket</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>
                    Budget Min (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    placeholder="1000000"
                    style={{
                      width: "100%",
                      height: "2.5rem",
                      padding: "0 0.75rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>
                    Budget Maks (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    placeholder="5000000"
                    style={{
                      width: "100%",
                      height: "2.5rem",
                      padding: "0 0.75rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.875rem",
                      outline: "none",
                      boxSizing: "border-box",
                      background: "#fff",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>
                  Batas Waktu Penawaran
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  style={{
                    width: "100%",
                    height: "2.5rem",
                    padding: "0 0.75rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#fff",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>
                  Catatan &amp; Spesifikasi Kebutuhan
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan spesifikasi material, ukuran, atau instruksi khusus untuk UMKM..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    minHeight: "90px",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "none",
                    background: "#fff",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  style={{
                    height: "2.5rem",
                    padding: "0 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    color: "#475569",
                    background: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    height: "2.5rem",
                    padding: "0 1.25rem",
                    borderRadius: "0.75rem",
                    background: isSubmitting ? "#818cf8" : "#4f46e5",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.375rem",
                    border: "none",
                    minWidth: "160px",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 style={{ width: "0.875rem", height: "0.875rem", animation: "spin 1s linear infinite" }} />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send style={{ width: "0.875rem", height: "0.875rem" }} />
                      Kirim Penawaran Direct
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
