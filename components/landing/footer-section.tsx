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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SourceHub</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Platform AI-powered B2B yang menghubungkan perusahaan Indonesia dengan UMKM lokal terpercaya.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>hello@sourcehub.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+62 21 1234 5678</span>
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
            © 2025 SourceHub. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span>Dibuat dengan ❤️ untuk UMKM Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
