'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  LayoutDashboard,
  User,
  FileSearch,
  FileText,
  Package,
  Award,
  BarChart3,
  Target,
  Bell,
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  PackageCheck,
  Boxes,
  Store,
  Sparkles,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { signOut } from 'next-auth/react';
import { FloatingAiButton } from "@/components/ai/floating-ai-button";

const navItems = [
  { name: 'Dashboard', href: '/umkm/dashboard', icon: LayoutDashboard },
  { name: 'Profil Saya', href: '/umkm/profile', icon: User },
  { name: 'Pasar RFQ', href: '/umkm/rfq', icon: FileSearch },
  { name: 'Peluang Pasar', href: '/umkm/opportunities', icon: TrendingUp },
  { name: 'Katalog & Kompetitor', href: '/umkm/suppliers', icon: Store },
  { name: 'Penawaran', href: '/umkm/quotations', icon: FileText },
  { name: 'Pesanan', href: '/umkm/orders', icon: ShoppingCart },
  { name: 'Pesan', href: '/umkm/messages', icon: MessageSquare },
  { name: 'Produk Saya', href: '/umkm/products', icon: Package },
  { name: 'Sertifikasi', href: '/umkm/certifications', icon: Award },
  { name: 'Analitik', href: '/umkm/analytics', icon: BarChart3 },
  { name: 'Skor Kesiapan', href: '/umkm/readiness', icon: Target },
  { name: 'Asisten AI', href: '/umkm/assistant', icon: Sparkles },
  { name: 'Notifikasi', href: '/umkm/notifications', icon: Bell },
  { name: 'Pengaturan', href: '/umkm/settings', icon: Settings },
];


function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [unreadNotifCount, setUnreadNotifCount] = React.useState(0);
  const [unreadMsgCount, setUnreadMsgCount] = React.useState(0);

  React.useEffect(() => {
    const fetchUnread = async () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const [notifRes, msgRes] = await Promise.all([
          fetch('/api/notifications'),
          fetch('/api/conversations'),
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
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-6 border-b border-slate-200">
        <div className="h-8 w-8 rounded-lg overflow-hidden border border-emerald-200 shadow-sm bg-white shrink-0">
          <img src="/pusaka-logo.jpg" alt="PUSAKA Logo" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">PUSAKA</span>
          <span className="text-[10px] font-semibold text-emerald-600">Mitra UMKM</span>
        </div>
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

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-0.5 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600 font-semibold'
                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.name === 'Notifikasi' && unreadNotifCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
                {item.name === 'Pesan' && unreadMsgCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                    {unreadMsgCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function UMKMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <SidebarNav />
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
          <Link href="/umkm/dashboard" className="flex items-center gap-2 font-bold text-emerald-600">
            <Boxes className="h-5 w-5" />
            <span>PUSAKA UMKM</span>
          </Link>
          <Sheet>
            <SheetTrigger className="md:hidden p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SidebarNav onNavigate={() => {}} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <FloatingAiButton />
      </div>
    </div>
  );
}
