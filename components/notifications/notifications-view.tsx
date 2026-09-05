"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  FileText,
  Shield,
  Sparkles,
  CheckCircle,
  Send,
  ArrowRight,
  ShoppingCart,
  MessageSquare,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link?: string | null;
  createdAt: string | Date;
};

const typeIconMap: Record<string, typeof Bell> = {
  DIRECT_RFQ: Send,
  NEW_QUOTATION: FileText,
  QUOTATION_RECEIVED: FileText,
  VERIFICATION_UPDATE: Shield,
  AI_RECOMMENDATION: Sparkles,
  RFQ_UPDATE: FileText,
  PROJECT_UPDATE: CheckCircle,
  ORDER_CREATED: ShoppingCart,
  ORDER_UPDATE: ShoppingCart,
  MESSAGE_RECEIVED: MessageSquare,
};

function groupByDate(notifications: NotificationItem[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const groups: Record<string, NotificationItem[]> = {
    "Hari Ini": [],
    Kemarin: [],
    "Lebih Lama": [],
  };
  for (const n of notifications) {
    const d = new Date(n.createdAt);
    d.setHours(0, 0, 0, 0);
    if (d >= today) groups["Hari Ini"].push(n);
    else if (d >= yesterday) groups["Kemarin"].push(n);
    else groups["Lebih Lama"].push(n);
  }
  return groups;
}

export default function NotificationsView({
  initialNotifications,
  themeColor = "emerald",
}: {
  initialNotifications: NotificationItem[];
  themeColor?: "emerald" | "blue";
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const groups = groupByDate(notifications);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      toast.info("Semua notifikasi sudah dibaca");
      return;
    }
    setIsMarkingAll(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("Semua notifikasi berhasil ditandai telah dibaca! ✅");
        router.refresh();
      } else {
        toast.error("Gagal menandai notifikasi");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.read) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id }),
        });
        router.refresh();
      } catch (err) {
        console.error("Failed to mark notification read:", err);
      }
    }
  };

  const badgeColor =
    themeColor === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-blue-100 text-blue-700";

  const btnBg =
    themeColor === "emerald"
      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifikasi</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca`
              : "Semua notifikasi telah dibaca"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge className={`${badgeColor} font-semibold text-xs py-1 px-3`}>
              {unreadCount} baru
            </Badge>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll || unreadCount === 0}
            className={`text-xs gap-1.5 font-medium rounded-xl h-9 border ${btnBg} disabled:opacity-50`}
          >
            {isMarkingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Tandai Semua Dibaca
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <BellOff className="mx-auto h-14 w-14 text-slate-200 mb-4" />
          <h3 className="font-bold text-slate-800 text-lg">Tidak ada notifikasi</h3>
          <p className="text-sm text-slate-500 mt-1">
            Notifikasi aktivitas terbaru akan muncul di sini secara otomatis.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([group, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  {group}
                </h2>
                <div className="space-y-2">
                  {items.map((n) => {
                    const Icon = typeIconMap[n.type] ?? Bell;
                    const isDirect = n.type === "DIRECT_RFQ";

                    const CardWrapper = n.link
                      ? ({ children }: { children: React.ReactNode }) => (
                          <Link
                            href={n.link!}
                            onClick={() => handleNotificationClick(n)}
                            className="block"
                          >
                            {children}
                          </Link>
                        )
                      : ({ children }: { children: React.ReactNode }) => (
                          <div onClick={() => handleNotificationClick(n)} className="cursor-pointer">
                            {children}
                          </div>
                        );

                    return (
                      <CardWrapper key={n.id}>
                        <Card
                          className={`border-0 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                            !n.read
                              ? isDirect
                                ? "bg-indigo-50/80 border-l-4 border-indigo-600"
                                : themeColor === "emerald"
                                ? "bg-emerald-50/60 border-l-4 border-emerald-600"
                                : "bg-blue-50/60 border-l-4 border-blue-600"
                              : "bg-white opacity-85 hover:opacity-100"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                  isDirect
                                    ? "bg-indigo-100 text-indigo-600"
                                    : !n.read
                                    ? themeColor === "emerald"
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-blue-100 text-blue-600"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <p
                                      className={`text-sm font-semibold ${
                                        !n.read ? "text-slate-900" : "text-slate-700"
                                      }`}
                                    >
                                      {n.title}
                                    </p>
                                    {!n.read && (
                                      <span
                                        className={`h-2 w-2 rounded-full ${
                                          themeColor === "emerald"
                                            ? "bg-emerald-500"
                                            : "bg-blue-500"
                                        } shrink-0`}
                                      />
                                    )}
                                  </div>
                                  {n.link && (
                                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5">{n.body}</p>
                                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                                  {new Date(n.createdAt).toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CardWrapper>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
