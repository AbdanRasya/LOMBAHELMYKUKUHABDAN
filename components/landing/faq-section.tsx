"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Apa perbedaan PUSAKA dengan marketplace B2B biasa?",
    a: "PUSAKA bukan marketplace e-commerce. Kami adalah platform digital procurement yang fokus pada proses pengadaan B2B jangka panjang. Fitur AI Matching kami merekomendasikan supplier berdasarkan kebutuhan spesifik, bukan sekadar daftar produk. Kami juga menyediakan RFQ management, supplier verification, dan analytics â€” fitur yang tidak ada di marketplace biasa.",
  },
  {
    q: "Bagaimana proses verifikasi supplier di PUSAKA?",
    a: "Setiap UMKM melewati proses verifikasi berlapis: (1) Verifikasi dokumen legal (NIB, NPWP, SIUP), (2) Review profil bisnis oleh tim kami, (3) Verifikasi sertifikasi oleh administrator. Supplier terverifikasi mendapat badge khusus dan diprioritaskan dalam hasil pencarian. Trust Score kami juga dihitung otomatis berdasarkan performa historis.",
  },
  {
    q: "Apakah PUSAKA gratis untuk UMKM?",
    a: "UMKM dapat mendaftar dan membuat profil dasar secara gratis. Fitur premium seperti prioritas tampilan di pencarian, akses ke RFQ eksklusif, dan laporan analytics mendalam tersedia dalam paket berbayar. Perusahaan juga dapat memulai dengan paket gratis untuk mencoba platform.",
  },
  {
    q: "Bagaimana AI Matching bekerja?",
    a: "Ketika perusahaan membuat RFQ, AI kami menganalisis: kategori produk, kuantitas yang dibutuhkan, lokasi pengiriman, budget, timeline, dan riwayat kinerja supplier. Sistem kemudian memberikan Match Score (0-100%) untuk setiap supplier yang relevan, lengkap dengan penjelasan mengapa supplier tersebut direkomendasikan.",
  },
  {
    q: "Berapa lama proses approval UMKM?",
    a: "Proses approval standar memakan waktu 2-3 hari kerja setelah semua dokumen diunggah. UMKM dapat mulai mengisi profil dan menambahkan produk sambil menunggu approval. Notifikasi akan dikirim via email dan platform ketika status berubah.",
  },
  {
    q: "Apakah data perusahaan dan UMKM aman?",
    a: "Keamanan data adalah prioritas utama kami. Data disimpan di Neon PostgreSQL dengan enkripsi end-to-end. Informasi sensitif seperti kontrak dan harga hanya terlihat oleh pihak terkait. Kami juga mematuhi peraturan perlindungan data pribadi Indonesia (UU PDP).",
  },
];

function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      className={cn(
        "border rounded-xl overflow-hidden transition-all duration-200",
        isOpen
          ? "border-emerald-300 shadow-md shadow-emerald-50"
          : "border-neutral-200 hover:border-neutral-300"
      )}
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
        onClick={onClick}
      >
        <span className={cn("font-semibold text-sm", isOpen ? "text-emerald-700" : "text-neutral-800")}>
          {q}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-200 text-neutral-400",
            isOpen ? "rotate-180 text-emerald-600" : ""
          )}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed bg-white">
          {a}
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4 text-xs font-semibold">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Pertanyaan yang <span className="gradient-text">Sering Ditanyakan</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
