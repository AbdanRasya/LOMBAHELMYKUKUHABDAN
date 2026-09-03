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
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

type OrderStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
type Order = {
  id: string;
  quotationId: string;
  rfqId: string;
  status: OrderStatus;
  totalAmount: number;
  notes: string | null;
  trackingInfo: string | null;
  createdAt: string;
};

type UpdateOrderPayload = {
  status: OrderStatus;
  trackingInfo?: string;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING_PAYMENT: { label: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: CreditCard },
  CONFIRMED: { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
  IN_PRODUCTION: { label: 'Diproduksi', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Package },
  SHIPPED: { label: 'Dikirim', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Truck },
  DELIVERED: { label: 'Diterima', color: 'bg-teal-100 text-teal-700 border-teal-200', icon: Inbox },
  COMPLETED: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  DISPUTED: { label: 'Bermasalah', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle },
};

const ORDER_STEPS = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'IN_PRODUCTION',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED'
] as const;

export default function UMKMOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState("");
  const [, setSelectedOrderId] = useState<string | null>(null);

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

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, tracking?: string) => {
    try {
      const payload: UpdateOrderPayload = { status: newStatus };
      if (tracking) payload.trackingInfo = tracking;

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, trackingInfo: tracking || o.trackingInfo } : o))
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pesanan Masuk</h1>
          <p className="text-slate-500 mt-1">Kelola dan proses pesanan pelanggan Anda</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm shadow-slate-100 text-slate-700 font-medium text-sm flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          {orders.length} Pesanan
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center shadow-sm shadow-slate-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Belum ada pesanan masuk</h3>
          <p className="text-slate-500 max-w-md">Tetap aktif dan perbarui produk Anda untuk menarik pembeli!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            const StatusIcon = statusCfg.icon;
            const currentStepIndex = (ORDER_STEPS as readonly OrderStatus[]).indexOf(order.status);

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100/50 hover:shadow-md transition-shadow duration-300">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-sm text-slate-500">•</span>
                      <span className="text-sm text-slate-500">{format(new Date(order.createdAt), "dd MMM yyyy")}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {formatRupiah(order.totalAmount)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 ${statusCfg.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusCfg.label}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Progress Tracker */}
                  {order.status !== 'CANCELLED' && order.status !== 'DISPUTED' && (
                    <div className="relative mb-8 pb-4 overflow-x-auto">
                      <div className="min-w-[600px] flex items-center justify-between">
                        {ORDER_STEPS.map((step, idx) => {
                          const isCompleted = currentStepIndex >= idx;
                          const isCurrent = currentStepIndex === idx;
                          const StepIcon = STATUS_CONFIG[step].icon;
                          
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${isCompleted ? 'border-blue-500 text-blue-600' : 'border-slate-200 text-slate-300'} ${isCurrent ? 'ring-4 ring-blue-50' : ''}`}>
                                <StepIcon className="w-5 h-5" />
                              </div>
                              <span className={`text-xs font-medium mt-3 whitespace-nowrap ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                {STATUS_CONFIG[step].label}
                              </span>
                            </div>
                          );
                        })}
                        <div className="absolute top-5 left-5 right-5 h-[2px] bg-slate-200 -z-10">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` : '0%' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end mt-4">
                    {order.status === 'CONFIRMED' && (
                      <Button onClick={() => updateOrderStatus(order.id, 'IN_PRODUCTION')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 rounded-xl px-6">
                        Mulai Produksi <Package className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    {order.status === 'IN_PRODUCTION' && (
                      <Dialog>
                        <DialogTrigger render={
                          <Button onClick={() => setSelectedOrderId(order.id)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 rounded-xl px-6">
                            Kirim Pesanan <Send className="w-4 h-4 ml-2" />
                          </Button>
                        } />
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Informasi Pengiriman</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Nomor Resi / Info Pelacakan</label>
                            <input
                              type="text"
                              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Misal: JNE123456789"
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                            <DialogClose render={
                              <Button 
                                onClick={() => {
                                  updateOrderStatus(order.id, 'SHIPPED', trackingInput);
                                  setTrackingInput("");
                                }} 
                                className="bg-blue-600 text-white hover:bg-blue-700"
                              />
                            }>
                              Simpan & Kirim
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
