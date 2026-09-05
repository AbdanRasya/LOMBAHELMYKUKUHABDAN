"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Bookmark, 
  BarChart3, 
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
  ShoppingCart,
  MessageSquare,
  Building2,
  Bell,
  Boxes,
  Store,
  GitCompare,
  Cpu,
  BotMessageSquare,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { name: "Profil Perusahaan", href: "/company/profile", icon: Building2 },
  { name: "Cari Supplier", href: "/company/suppliers", icon: Search },
  { name: "Pasar Produk", href: "/company/products", icon: Store },
  { name: "Bandingkan Supplier", href: "/company/compare", icon: GitCompare },
  { name: "RFQ / Procurement", href: "/company/rfq", icon: FileText },
  { name: "Pesanan / Orders", href: "/company/orders", icon: ShoppingCart },
  { name: "Tersimpan", href: "/company/saved", icon: Bookmark },
  { name: "Pesan", href: "/company/messages", icon: MessageSquare },
  { name: "Notifikasi", href: "/company/notifications", icon: Bell },
  { name: "Analitik", href: "/company/analytics", icon: BarChart3 },
  { name: "AI Match", href: "/company/ai-match", icon: Cpu },
  { name: "Asisten AI", href: "/company/assistant", icon: BotMessageSquare },
  { name: "Pengaturan", href: "/company/settings", icon: Settings },
];


function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [unreadNotifCount, setUnreadNotifCount] = React.useState(0);
  const [unreadMsgCount, setUnreadMsgCount] = React.useState(0);

  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        const [notifRes, msgRes] = await Promise.all([
          fetch("/api/notifications"),
          fetch("/api/conversations"),
        ]);
        if (notifRes.ok) {
          const data = await notifRes.json();
          const unread = (data.notifications || []).filter((n: { read?: boolean }) => !n.read).length;
          setUnreadNotifCount(unread);
        }
        if (msgRes.ok) {
          const data = await msgRes.json();
          setUnreadMsgCount(data.unreadCount || 0);
        }
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-2 px-6 border-b border-slate-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Boxes className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold text-slate-800">SourceHub</span>
      </div>

      {/* Back to landing */}
      <div className="px-4 pt-3 pb-1">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="grid gap-0.5 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.name === "Notifikasi" && unreadNotifCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
                {item.name === "Pesan" && unreadMsgCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                    {unreadMsgCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="absolute left-4 top-3 z-40 md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-lg">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r-0">
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 shrink-0 md:block">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 shadow-sm md:hidden">
          <div className="ml-12 flex items-center gap-2 font-bold text-emerald-600">
            <Boxes className="h-5 w-5" />
            SourceHub
          </div>
        </div>

        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
