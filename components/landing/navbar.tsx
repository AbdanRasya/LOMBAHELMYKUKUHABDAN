"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Boxes, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";

import { cn } from "@/lib/utils";

type SessionUserWithRole = {
  role?: Role;
};

const navLinks = [
  { label: "Fitur", href: "#features" },
  { label: "Marketplace Supplier", href: "/company/suppliers" },
  { label: "Pasar RFQ", href: "/umkm/rfq" },
  { label: "Sukses", href: "#success" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const userRole = (session?.user as SessionUserWithRole | undefined)?.role;
  const dashboardUrl = session?.user
    ? userRole === "UMKM"
      ? "/umkm/dashboard"
      : userRole === "ADMIN"
      ? "/admin/dashboard"
      : "/company/dashboard"
    : null;

  return (
    <>
      {/* Floating pill navbar */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className={cn(
            "w-full max-w-4xl rounded-full transition-all duration-300",
            isScrolled
              ? "bg-white/75 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/50"
              : "bg-white/60 backdrop-blur-md shadow-md shadow-black/5 border border-white/40"
          )}
        >
          <div className="flex items-center justify-between h-13 px-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm group-hover:shadow-emerald-200 transition-shadow">
                <Boxes className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-slate-800">
                Source<span className="text-emerald-600">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-emerald-600 transition-colors font-medium px-3 py-1.5 rounded-full hover:bg-emerald-50"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {dashboardUrl ? (
                <Link
                  href={dashboardUrl}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm text-xs px-4 h-8"
                  )}
                >
                  Dashboard <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "rounded-full text-xs h-8 px-4 text-slate-600"
                    )}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm text-xs px-4 h-8"
                    )}
                  >
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu — expanded below pill */}
          {mobileOpen && (
            <div className="md:hidden border-t border-slate-200/60 mx-2 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 px-2 border-t border-slate-200/60">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full rounded-full text-xs")}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-none text-xs"
                  )}
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Spacer so content doesn't go under navbar */}
      <div className="h-20" />
    </>
  );
}
