'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Award,
  Tag,
  FileText,
  BarChart3,
  Map,
  Activity,
  Settings,
  Sparkles,
  ChevronLeft,
  LogOut,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { signOut } from 'next-auth/react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Pengguna', href: '/admin/users', icon: Users },
  { name: 'Approval UMKM', href: '/admin/umkm', icon: CheckCircle },
  { name: 'Sertifikasi', href: '/admin/certifications', icon: Award },
  { name: 'Kategori', href: '/admin/categories', icon: Tag },
  { name: 'Semua RFQ', href: '/admin/rfq', icon: FileText },
  { name: 'Analitik', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Peta Supply Gap', href: '/admin/map', icon: Map },
  { name: 'Log Sistem', href: '/admin/logs', icon: Activity },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-slate-800">SourceHub</span>
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Admin</span>
        </Link>
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

      <nav className="flex-1 space-y-0.5 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>SourceHub</span>
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Admin</span>
          </Link>
          <Sheet>
            <SheetTrigger className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Menu Admin</SheetTitle>
              <SidebarContent onNavigate={() => {}} />
            </SheetContent>
          </Sheet>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
