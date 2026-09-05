"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const starters = [
  "Bagaimana cara meningkatkan Skor Kesiapan (Readiness Score) UMKM saya?",
  "Tips menyusun penawaran (Quotation) agar berpeluang menang di Pasar RFQ",
  "Sertifikasi apa saja yang wajib dimiliki untuk masuk ke pengadaan korporasi B2B?",
  "Bagaimana strategi menentukan harga produk B2B agar tetap untung & bersaing?",
];

export default function UmkmAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo Mitra UMKM PUSAKA! 👋\n\nSaya adalah **AI Business & Procurement Assistant**. Saya siap membantu usaha Anda berkembang — mulai dari meningkatkan Skor Kesiapan, strategi memenangkan penawaran RFQ, pengurusan sertifikasi industri, hingga perhitungan harga B2B.\n\nAda yang ingin Anda konsultasikan hari ini?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function getClientFallbackResponse(input: string): string {
    const q = input.trim().toLowerCase();

    // 1. STARTER: Readiness Score / Skor Kesiapan
    if (q.includes("kesiapan") || q.includes("readiness") || q.includes("skor") || q.includes("profil")) {
      return `🎯 **Panduan Praktis Meningkatkan Skor Kesiapan (Readiness Score) UMKM PUSAKA**

Skor Kesiapan Anda diukur berdasarkan 5 pilar utama industri B2B:

1. **Kelengkapan Legalitas Usaha (Bobot 25%)**
   • Upload NIB (Nomor Induk Berusaha) & NPWP Usaha.
   • Melengkapi alamat operasional & kontak penanggung jawab resmi.

2. **Portofolio & Katalog Produk (Bobot 25%)**
   • Tambahkan minimal **3–5 produk aktif** dengan foto jelas, estimasi harga, dan *lead time* produksi.
   • Cantumkan spesifikasi bahan baku dan kapasitas produksi bulanan.

3. **Sertifikasi Mutu & Kelayakan (Bobot 20%)**
   • Unggah sertifikat resmi seperti **TKDN, Halal, ISO 9001, atau SNI**.
   • UMKM dengan sertifikasi TKDN/SNI mendapatkan skor kesiapan +20 poin otomatis.

4. **Rekam Jarak & Performa Pengiriman (Bobot 15%)**
   • Menyelesaikan pesanan B2B tepat waktu (On-Time Delivery > 90%).
   • Mempertahankan rating ulasan dari perusahaan pembeli di atas ⭐ 4.5.

5. **Aktivitas & Responsivitas (Bobot 15%)**
   • Membalas pesan/RFQ perusahaan dalam waktu kurang dari 24 jam.

💡 **Aksi Cepat:** Buka menu **Profil Saya** dan **Sertifikasi** untuk melengkapi data yang masih kosong!`;
    }

    // 2. STARTER: Tips Menang RFQ / Quotation
    if (q.includes("menang") || q.includes("quotation") || q.includes("penawaran") || q.includes("rfq") || q.includes("tips")) {
      return `📝 **5 Strategi Emas Memenangkan Penawaran di Pasar RFQ PUSAKA**

1. **Respons Cepat (*First Responder Advantage*)**
   • Perusahaan pengadaan sering kali memilih 3 supplier pertama yang memberikan penawaran responsif. Ajukan penawaran dalam 1x24 jam setelah RFQ diterbitkan.

2. **Berikan Detail *Lead Time* & Garansi Jelas**
   • Jangan hanya mencantumkan harga! Sertakan rincian waktu pengerjaan (misal: *14 hari kerja*), skema QC, dan garansi penggantian barang cacat.

3. **Tawarkan *Sample* atau Proto-batch**
   • Tuliskan pada catatan penawaran bahwa usaha Anda siap menyediakan *Pre-Production Sample* sebelum produksi massal dimulai. Ini meningkatkan kepercayaan pembeli hingga 80%.

4. **Transparansi Struktur Biaya**
   • Berikan rincian harga transparan (Harga Satuan, Biaya Kemasan, dan Pengiriman). Pembeli B2B menyukai kejelasan tanpa biaya tersembunyi.

5. **Sertakan Bukti Portofolio Serupa**
   • Hubungkan penawaran Anda dengan pengalaman pengerjaan proyek sejenis yang pernah dilakukan sebelumnya.`;
    }

    // 3. STARTER: Sertifikasi Industri & B2B
    if (q.includes("sertifikat") || q.includes("sertifikasi") || q.includes("tkdn") || q.includes("sni") || q.includes("halal") || q.includes("iso")) {
      return `📜 **Sertifikasi Utama yang Dicari Perusahaan B2B di PUSAKA**

Untuk menembus pengadaan skala menengah hingga korporasi besar, berikut sertifikasi prioritas:

1. **TKDN (Tingkat Komponen Dalam Negeri)**
   • *Sangat Krusial!* Pengadaan BUMN dan instansi pemerintah memprioritaskan UMKM dengan persentase TKDN > 25%.

2. **NIB & Izin Usaha Risiko (OSS RBA)**
   • Wajib dimiliki seluruh UMKM untuk legalitas transaksi resmi dan pembuatan faktur pajak/SPK.

3. **Sertifikasi Halal (Kemenag / BPJPH)**
   • Kategori: Makanan, Minuman, Kosmetik, dan Kemasan Pangan.

4. **SNI (Standar Nasional Indonesia)**
   • Kategori: Material Konstruksi, Logam, Pakaian/Garmen, dan Alat Listrik.

5. **ISO 9001:2015 (Sistem Manajemen Mutu)**
   • Menunjukkan bahwa proses manufaktur usaha Anda memiliki prosedur kendali mutu standar internasional.

💡 *Tips PUSAKA:* Anda dapat mengunggah dokumen sertifikasi melalui menu **Sertifikasi** di sidebar dashboard untuk langsung mendapatkan Badge Terverifikasi.`;
    }

    // 4. STARTER: Strategi Harga B2B
    if (q.includes("harga") || q.includes("untung") || q.includes("biaya") || q.includes("margin") || q.includes("pricing")) {
      return `💰 **Formula Perhitungan Harga B2B (*Cost-Plus Pricing*) untuk UMKM**

Dalam transaksi B2B, penentuan harga berbasis skala volume (*Tiered Pricing*) sangat direkomendasikan:

**1. Hitung HPP (Harga Pokok Produksi) Riil Per Unit:**
   \`HPP = Biaya Bahan Baku + Biaya Tenaga Kerja Langsung + Biaya Overhead (Listrik, Kemasan, Penyusutan Mesin)\`

**2. Skema Harga Berjenjang (*Volume Tiering*):**
   • **Tier 1 (Qty 100 - 500 pcs):** HPP + Margin 30%
   • **Tier 2 (Qty 501 - 2.000 pcs):** HPP + Margin 22% (Diskon Volume)
   • **Tier 3 (Qty > 2.000 pcs):** HPP + Margin 15% (Kontrak Jangka Panjang)

**3. Pertimbangkan Termin Pembayaran (TOP):**
   • Jika perusahaan meminta tempo pembayaran 30 hari (TOP 30), tambahkan marjin penyesuaian arus kas 2%–3% untuk menutup biaya operasional Anda selama masa tunggu.`;
    }

    // 5. Greetings & General Fallback
    if (q.startsWith("halo") || q.startsWith("hai") || q.startsWith("hi") || q.startsWith("pagi") || q.startsWith("siang") || q.startsWith("sore") || q.startsWith("malam")) {
      return `Halo Mitra UMKM PUSAKA! 👋

Saya AI Business Assistant Anda. Saya dapat membantu dalam:
1. 🎯 **Meningkatkan Skor Kesiapan Profil UMKM**
2. 📝 **Strategi Memenangkan Penawaran RFQ Perusahaan**
3. 📜 **Informasi Sertifikasi Industri (TKDN, SNI, Halal)**
4. 💰 **Perhitungan Harga & Skema Diskon B2B**

Apa topik yang ingin kita bahas sekarang?`;
    }

    return `Terima kasih atas pertanyaan Anda. 

Sebagai AI Assistant Mitra UMKM PUSAKA, saya siap mendampingi Anda dalam meningkatkan kesiapan usaha, strategi penawaran harga, legalitas & sertifikasi, serta tips memenangkan proyek B2B dari perusahaan.

Silakan tanyakan hal spesifik terkait usaha UMKM Anda!`;
  }

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "UMKM_SELLER",
          messages: [...messages, userMessage].map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const answer = data.response || data.reply || getClientFallbackResponse(messageText);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.warn("API request failed, using fallback:", err);
      const fallbackAnswer = getClientFallbackResponse(messageText);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackAnswer,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-emerald-100 bg-white rounded-t-2xl shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-lg">AI Business Assistant UMKM</h1>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 text-[10px]">
                  PUSAKA AI
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-500">Aktif • Konsultan bisnis 24/7 untuk Mitra UMKM</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content: "Percakapan baru dimulai. Apa yang bisa saya bantu untuk perkembangan UMKM Anda?",
                  timestamp: new Date(),
                },
              ])
            }
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/60">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 max-w-3xl",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-xs font-bold",
                msg.role === "user"
                  ? "bg-slate-800 text-white"
                  : "bg-emerald-600 text-white"
              )}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={cn(
                "rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
              )}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.content}
              </div>
              <div
                className={cn(
                  "text-[10px] mt-2 text-right opacity-70",
                  msg.role === "user" ? "text-slate-300" : "text-slate-400"
                )}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 text-xs font-medium text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>AI PUSAKA sedang menyusun rekomendasi...</span>
            </div>
          </div>
        )}
      </div>

      {/* Starter Questions (if few messages) */}
      {messages.length <= 2 && (
        <div className="p-4 bg-white border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Rekomendasi Pertanyaan Cepat:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {starters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(starter)}
                className="text-left text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-800 transition-colors font-medium flex items-start gap-2"
              >
                <span className="text-emerald-600 font-bold shrink-0">•</span>
                <span>{starter}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl shadow-sm">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan strategi bisnis, tips RFQ, atau syarat sertifikasi UMKM..."
            className="min-h-[50px] max-h-[140px] resize-none rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm"
            rows={1}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="h-[50px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shrink-0 shadow-md shadow-emerald-100"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 text-center">
          AI Assistant memberikan panduan berdasarkan praktik terbaik pengadaan B2B & regulasi UMKM Indonesia.
        </p>
      </div>
    </div>
  );
}
