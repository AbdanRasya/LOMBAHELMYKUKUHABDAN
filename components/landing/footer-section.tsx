import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin, Globe, Share2, MessageSquare } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Cari Supplier", href: "/company/suppliers" },
    { label: "Daftar UMKM", href: "/register?role=UMKM" },
    { label: "Buat RFQ", href: "/company/rfq/create" },
    { label: "AI Matching", href: "/company/ai-match" },
  ],
  perusahaan: [
    { label: "Tentang Kami", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Karir", href: "/careers" },
    { label: "Press Kit", href: "/press" },
  ],
  dukungan: [
    { label: "Pusat Bantuan", href: "/help" },
    { label: "Dokumentasi", href: "/docs" },
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Syarat & Ketentuan", href: "/terms" },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-400/30 bg-white p-1 shadow-md">
                <img src="/pusaka-icon.png" alt="PUSAKA Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white tracking-tight leading-none">PUSAKA</span>
                <span className="text-[10px] font-medium text-blue-400 mt-0.5">Pusat Pengadaan &amp; Akreditasi Supplier Nusantara</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-neutral-300">
              Platform B2B berbasis AI pertama di Indonesia yang menghubungkan korporasi dengan UMKM lokal terpercaya melalui akreditasi transparan.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Sidoarjo, Jawa Timur, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>hello@pusaka.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+62 31 894 5678</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {[Globe, Share2, MessageSquare].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Perusahaan</h4>
            <ul className="space-y-2.5">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Dukungan</h4>
            <ul className="space-y-2.5">
              {footerLinks.dukungan.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            Â© 2025 PUSAKA. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span>Dibuat dengan â¤ï¸ untuk UMKM Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
