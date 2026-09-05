"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Package,
  Truck,
  Inbox,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Copy,
  Upload,
  X,
  Building2,
  Clock,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

type Order = {
  id: string;
  quotationId: string;
  rfqId: string;
  status: OrderStatus;
  totalAmount: number;
  notes: string | null;
  trackingInfo: string | null;
  createdAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  rfq?: { id: string; title: string } | null;
  umkm?: { id: string; businessName: string } | null;
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDING_PAYMENT: {
    label: "Menunggu Pembayaran",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: CreditCard,
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },
  IN_PRODUCTION: {
    label: "Diproduksi",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Package,
  },
  SHIPPED: {
    label: "Dikirim",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Diterima",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    icon: Inbox,
  },
  COMPLETED: {
    label: "Selesai",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
  DISPUTED: {
    label: "Bermasalah",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: AlertCircle,
  },
};

const ORDER_STEPS = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "IN_PRODUCTION",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
] as const;

// Bank transfer info (simulated)
const BANK_ACCOUNTS = [
  { bank: "BCA", logo: "🏦", norek: "1234567890", atas: "PT PUSAKA Indonesia" },
  { bank: "BNI", logo: "🏦", norek: "9876543210", atas: "PT PUSAKA Indonesia" },
  { bank: "Mandiri", logo: "🏦", norek: "1122334455", atas: "PT PUSAKA Indonesia" },
];

// Payment Modal
function PaymentModal({
  order,
  onClose,
  onPaid,
}: {
  order: Order;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [step, setStep] = useState<"choose" | "transfer" | "confirm" | "success">("choose");
  const [selectedBank, setSelectedBank] = useState(BANK_ACCOUNTS[0]);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // Unique virtual account (simulated: last 5 digits of order id + amount mod 100)
  const virtualAccount = `${selectedBank.norek.slice(0, 5)}${order.id.slice(-5).toUpperCase()}`;
  const uniqueAmount = order.totalAmount + (parseInt(order.id.slice(-3), 16) % 999);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} berhasil disalin!`);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success("Bukti pembayaran dipilih: " + file.name);
    }
  };

  const handleConfirmPayment = async () => {
    if (!fileName) {
      toast.error("Upload bukti transfer terlebih dahulu");
      return;
    }
    setUploading(true);
    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 2000));
    setUploading(false);
    setStep("success");
    setTimeout(() => {
      onPaid();
      onClose();
    }, 2500);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "1.25rem",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)",
            padding: "1.25rem 1.5rem",
            borderRadius: "1.25rem 1.25rem 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
              Total Pembayaran
            </p>
            <p style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>
              {formatRupiah(step === "transfer" ? uniqueAmount : order.totalAmount)}
            </p>
            {step === "transfer" && (
              <p style={{ color: "#fcd34d", fontSize: "0.7rem", marginTop: "0.125rem" }}>
                âš  Nominal unik sudah ditambahkan untuk verifikasi otomatis
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "0.5rem", padding: "0.5rem", cursor: "pointer", color: "#fff" }}
          >
            <X style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Step: Choose Bank */}
          {step === "choose" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: "0.25rem" }}>
                  Pilih Metode Pembayaran
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Platform B2B PUSAKA menggunakan transfer bank untuk keamanan transaksi bisnis
                </p>
              </div>

              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.75rem", color: "#14532d", display: "flex", gap: "0.5rem" }}>
                <CheckCircle style={{ width: "1rem", height: "1rem", color: "#16a34a", flexShrink: 0, marginTop: "0.125rem" }} />
                <div>
                  <strong>Transfer Bank â€” Aman untuk B2B</strong>
                  <p style={{ marginTop: "0.125rem", color: "#166534" }}>Cocok untuk transaksi bisnis besar. Dana dilindungi sistem escrow PUSAKA.</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {BANK_ACCOUNTS.map((bank) => (
                  <button
                    key={bank.bank}
                    type="button"
                    onClick={() => { setSelectedBank(bank); setStep("transfer"); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      border: "1.5px solid #e2e8f0",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                  >
                    <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                      <Building2 style={{ width: "1.25rem", height: "1.25rem", color: "#2563eb" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>Bank {bank.bank}</p>
                      <p style={{ color: "#64748b", fontSize: "0.75rem" }}>Transfer Antar Bank</p>
                    </div>
                    <ChevronRight style={{ width: "1rem", height: "1rem", color: "#94a3b8" }} />
                  </button>
                ))}
              </div>

              <div style={{ background: "#f8fafc", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.7rem", color: "#64748b" }}>
                <p style={{ fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>📋 Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p>{order.rfq?.title || "Pesanan B2B"}</p>
                <p>Supplier: {order.umkm?.businessName || "-"}</p>
              </div>
            </div>
          )}

          {/* Step: Transfer Instructions */}
          {step === "transfer" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button type="button" onClick={() => setStep("choose")} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>
                  ← Kembali
                </button>
              </div>

              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>
                  Transfer ke Bank {selectedBank.bank}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.125rem" }}>Selesaikan pembayaran dalam 24 jam</p>
              </div>

              {/* Countdown */}
              <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "0.75rem", padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock style={{ width: "1rem", height: "1rem", color: "#d97706" }} />
                <div style={{ fontSize: "0.75rem", color: "#92400e" }}>
                  <strong>Batas Pembayaran: 24 Jam</strong>
                  <p>Pesanan akan otomatis dibatalkan jika belum dibayar</p>
                </div>
              </div>

              {/* Bank Details */}
              <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "0.875rem", overflow: "hidden" }}>
                <div style={{ background: "#f8fafc", padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>
                  <p style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Detail Rekening Tujuan
                  </p>
                </div>
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {[
                    { label: "Bank", value: `Bank ${selectedBank.bank}` },
                    { label: "No. Rekening", value: virtualAccount, copyable: true },
                    { label: "Atas Nama", value: selectedBank.atas },
                    { label: "Nominal Transfer", value: formatRupiah(uniqueAmount), copyable: true, highlight: true },
                  ].map(({ label, value, copyable, highlight }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{
                          fontSize: "0.85rem",
                          fontWeight: highlight ? 700 : 600,
                          color: highlight ? "#0ea5e9" : "#0f172a",
                          background: highlight ? "#f0f9ff" : "transparent",
                          padding: highlight ? "0.125rem 0.5rem" : "0",
                          borderRadius: "0.375rem",
                        }}>
                          {value}
                        </span>
                        {copyable && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(value.replace(/[^0-9]/g, ""), label)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "0.25rem" }}
                          >
                            <Copy style={{ width: "0.875rem", height: "0.875rem" }} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "0.75rem", padding: "0.75rem", fontSize: "0.72rem", color: "#7c2d12" }}>
                <AlertTriangle style={{ width: "0.875rem", height: "0.875rem", color: "#ea580c", display: "inline", marginRight: "0.375rem" }} />
                <strong>Penting:</strong> Transfer tepat nominal unik <strong>{formatRupiah(uniqueAmount)}</strong> (termasuk 3 digit terakhir) agar sistem dapat memverifikasi pembayaran Anda secara otomatis.
              </div>

              <Button
                onClick={() => setStep("confirm")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-semibold"
              >
                Saya Sudah Transfer â†’ Upload Bukti
              </Button>
            </div>
          )}

          {/* Step: Upload Proof */}
          {step === "confirm" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button type="button" onClick={() => setStep("transfer")} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>
                  â† Kembali
                </button>
              </div>

              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>Upload Bukti Transfer</h3>
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.125rem" }}>Tim PUSAKA akan memverifikasi dalam 1x10 menit</p>
              </div>

              {/* Summary */}
              <div style={{ background: "#f8fafc", borderRadius: "0.75rem", padding: "1rem", fontSize: "0.8rem", color: "#475569" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span>Bank Tujuan</span>
                  <strong style={{ color: "#0f172a" }}>Bank {selectedBank.bank}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span>No. Rekening</span>
                  <strong style={{ color: "#0f172a" }}>{virtualAccount}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Nominal Transfer</span>
                  <strong style={{ color: "#0ea5e9" }}>{formatRupiah(uniqueAmount)}</strong>
                </div>
              </div>

              {/* Upload Area */}
              <label
                htmlFor="bukti-upload"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  padding: "2rem",
                  border: `2px dashed ${fileName ? "#22c55e" : "#cbd5e1"}`,
                  borderRadius: "0.875rem",
                  background: fileName ? "#f0fdf4" : "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <input
                  id="bukti-upload"
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <Upload style={{ width: "2rem", height: "2rem", color: fileName ? "#16a34a" : "#94a3b8" }} />
                {fileName ? (
                  <>
                    <p style={{ fontWeight: 600, color: "#16a34a", fontSize: "0.85rem" }}>âœ“ {fileName}</p>
                    <p style={{ fontSize: "0.7rem", color: "#4ade80" }}>Klik untuk ganti file</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: 600, color: "#475569", fontSize: "0.85rem" }}>Klik untuk upload bukti transfer</p>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Format: JPG, PNG, atau PDF â€¢ Maks 5 MB</p>
                  </>
                )}
              </label>

              <Button
                onClick={handleConfirmPayment}
                disabled={uploading || !fileName}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-semibold disabled:opacity-50"
              >
                {uploading ? "Memverifikasi Pembayaran..." : "Konfirmasi & Kirim Bukti Bayar"}
              </Button>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "1rem 0", textAlign: "center" }}>
              <div style={{ width: "5rem", height: "5rem", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle style={{ width: "2.5rem", height: "2.5rem", color: "#16a34a" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1.25rem", color: "#0f172a" }}>Pembayaran Dikonfirmasi!</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem" }}>
                  Bukti transfer Anda sedang diverifikasi. Supplier akan segera memulai produksi.
                </p>
              </div>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.75rem", padding: "0.875rem", width: "100%", fontSize: "0.8rem", color: "#166534" }}>
                <p className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0" /> Email konfirmasi telah dikirim ke akun Anda</p>
                <p className="flex items-center gap-1.5" style={{ marginTop: "0.25rem" }}><CheckCircle className="w-3.5 h-3.5 shrink-0" /> Supplier mendapat notifikasi untuk memulai produksi</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Review Modal
function ReviewModal({
  order,
  onClose,
  onSubmit,
}: {
  order: Order;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      toast.success("Terima kasih! Ulasan & rating berhasil disimpan ke database.");
      onClose();
    } catch (error) {
      toast.error("Gagal mengirim ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "1.25rem",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            padding: "1.25rem 1.5rem",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Beri Ulasan &amp; Rating Supplier</h3>
            <p style={{ fontSize: "0.75rem", opacity: 0.9 }}>
              {order.umkm?.businessName || "Supplier UMKM"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "0.5rem", padding: "0.4rem", color: "#fff", cursor: "pointer" }}
          >
            <X style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.5rem" }}>
              Rating Kepuasan (1 - 5 Bintang)
            </label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
                  aria-label={`Beri bintang ${star}`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 fill-slate-100"
                    }`}
                  />
                </button>
              ))}
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#d97706", marginLeft: "0.5rem" }}>
                {rating}.0 / 5.0
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.375rem" }}>
              Tulis Pengalaman / Ulasan Nyata Anda
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Contoh: Hasil pengerjaan sangat rapi, spesifikasi presisi, dan pengiriman tepat waktu. Rekomendasi supplier!"
              rows={4}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.75rem", borderRadius: "0.75rem", fontSize: "0.75rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Ulasan Anda akan ditampilkan secara transparan di profil supplier dan etalase platform.</span>
          </div>

          <Button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-semibold"
          >
            {submitting ? "Mengirim Ulasan..." : "Kirim Rating & Selesaikan Pesanan"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function CompanyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const tid = toast.loading("Memperbarui status pesanan...");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success(`Status pesanan diperbarui: ${STATUS_CONFIG[newStatus]?.label || newStatus}`, { id: tid });
      } else {
        toast.error(data.error || "Gagal memperbarui status pesanan", { id: tid });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Terjadi kesalahan koneksi", { id: tid });
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      {/* Payment Modal */}
      {payingOrder && (
        <PaymentModal
          order={payingOrder}
          onClose={() => setPayingOrder(null)}
          onPaid={() => {
            updateOrderStatus(payingOrder.id, "CONFIRMED");
            setPayingOrder(null);
            toast.success("Pembayaran dikonfirmasi! Supplier akan segera memproses pesanan Anda.");
          }}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pesanan Saya</h1>
          <p className="text-slate-500 mt-1">Kelola dan pantau semua pesanan Anda</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-slate-700 font-medium text-sm flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          {orders.length} Pesanan
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum ada pesanan</h3>
          <p className="text-slate-500 max-w-md">
            Anda belum melakukan pemesanan. Mulai cari supplier dan buat RFQ pertama Anda!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            const StatusIcon = statusCfg.icon;
            const currentStepIndex = ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-slate-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-sm text-slate-400">•</span>
                      <span className="text-sm text-slate-500">
                        {format(new Date(order.createdAt), "dd MMM yyyy")}
                      </span>
                    </div>
                    {order.rfq?.title && (
                      <p className="text-sm font-semibold text-slate-800 mt-1">{order.rfq.title}</p>
                    )}
                    {order.umkm?.businessName && (
                      <p className="text-xs text-slate-500">
                        Supplier: <span className="font-medium text-slate-700">{order.umkm.businessName}</span>
                      </p>
                    )}
                    {order.trackingInfo && (
                      <p className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 font-medium inline-flex items-center gap-1.5 w-fit mt-1">
                        <Truck className="w-3.5 h-3.5" /> No. Resi / Pengiriman: <span className="font-mono font-bold">{order.trackingInfo}</span>
                      </p>
                    )}
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {formatRupiah(order.totalAmount)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 ${statusCfg.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusCfg.label}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Progress Tracker */}
                  {order.status !== "CANCELLED" && order.status !== "DISPUTED" && (
                    <div className="relative mb-8 pb-4 overflow-x-auto">
                      <div className="min-w-[600px] flex items-center justify-between">
                        {ORDER_STEPS.map((step, idx) => {
                          const isCompleted = currentStepIndex >= idx;
                          const isCurrent = currentStepIndex === idx;
                          const StepIcon = STATUS_CONFIG[step].icon;
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${
                                  isCompleted
                                    ? "border-emerald-500 text-emerald-600"
                                    : "border-slate-200 text-slate-300"
                                } ${isCurrent ? "ring-4 ring-emerald-50" : ""}`}
                              >
                                <StepIcon className="w-5 h-5" />
                              </div>
                              <span
                                className={`text-xs font-medium mt-3 whitespace-nowrap ${
                                  isCurrent
                                    ? "text-emerald-700"
                                    : isCompleted
                                    ? "text-slate-700"
                                    : "text-slate-400"
                                }`}
                              >
                                {STATUS_CONFIG[step].label}
                              </span>
                            </div>
                          );
                        })}
                        <div className="absolute top-5 left-5 right-5 h-[2px] bg-slate-200 -z-10">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{
                              width:
                                currentStepIndex >= 0
                                  ? `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end mt-4 gap-3">
                    {order.status === "PENDING_PAYMENT" && (
                      <Button
                        onClick={() => setPayingOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 rounded-xl px-6 gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Bayar Sekarang
                      </Button>
                    )}
                    {order.status === "SHIPPED" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                        className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200 rounded-xl px-6 gap-2"
                      >
                        <Inbox className="w-4 h-4" />
                        Konfirmasi Pesanan Diterima
                      </Button>
                    )}
                    {order.status === "DELIVERED" && (
                      <Button
                        onClick={() => setReviewingOrder(order)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 rounded-xl px-6 gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Selesaikan & Beri Ulasan
                      </Button>
                    )}
                    {order.status === "COMPLETED" && (
                      <div className="flex items-center gap-3">
                        <div className="text-emerald-600 font-medium flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg font-semibold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pesanan Selesai
                        </div>
                        <Button
                          onClick={() => setReviewingOrder(order)}
                          variant="outline"
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm"
                        >
                          â­ Beri Rating &amp; Ulasan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewingOrder && (
        <ReviewModal
          order={reviewingOrder}
          onClose={() => setReviewingOrder(null)}
          onSubmit={async (rating, comment) => {
            if (!reviewingOrder.umkm?.id) {
              toast.error("Supplier ID tidak ditemukan");
              return;
            }
            const res = await fetch("/api/reviews", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                umkmId: reviewingOrder.umkm.id,
                rating,
                comment,
              }),
            });
            if (res.ok) {
              await updateOrderStatus(reviewingOrder.id, "COMPLETED");
            } else {
              throw new Error("Failed to submit review");
            }
          }}
        />
      )}
    </div>
  );
}
