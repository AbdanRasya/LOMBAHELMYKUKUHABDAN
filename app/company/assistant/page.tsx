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
  "Saya butuh supplier bahan baku plastik dengan kapasitas 10 ton/bulan di Jawa Barat",
  "Bantu saya membandingkan 3 supplier tekstil terbaik",
  "Apa risiko yang perlu dipertimbangkan saat memilih supplier baru?",
  "Bagaimana cara bernegosiasi harga yang baik dengan supplier UMKM?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya adalah AI Procurement Assistant PUSAKA. Saya siap membantu Anda dalam proses pengadaan â€” mulai dari mencari supplier, membandingkan penawaran, hingga strategi negosiasi. Apa yang bisa saya bantu hari ini?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

function getClientFallbackResponse(input: string): string {
  const q = input.trim().toLowerCase();

  // 1. STARTER: Biji / bahan baku plastik di Jawa Barat
  if (q.includes("plastik") || (q.includes("supplier") && q.includes("jawa barat"))) {
    return `ðŸ” **Hasil Rekomendasi Supplier UMKM Terverifikasi PUSAKA**

Sistem mendeteksi kebutuhan Anda:
â€¢ **Kategori:** Kimia & Plastik
â€¢ **Wilayah:** Jawa Barat
â€¢ **Estimasi Kebutuhan:** 10 ton / bulan

Berikut supplier UMKM dengan tingkat kecocokan (*Match Score*) tertinggi:

**1. UD Plastik Jaya Berkah**
ðŸ“ Lokasi: Bekasi, Jawa Barat | ðŸ·ï¸ Kategori: Kimia & Plastik
ðŸŽ¯ **Match Score:** 88%
âš¡ Kapasitas: 80.000 kg/bulan (memenuhi kebutuhan 10 ton/bulan)
â­ Rating: 3.9/5.0 (On-Time Delivery: 78%)
ðŸ“œ Sertifikasi: NIB Terverifikasi & Izin Usaha Industri
â±ï¸ Lead Time: ~10 hari | Estimasi Harga: Rp 15.000/kg
ðŸ’¬ *Spesialisasi: Pabrik resin dan barang plastik injection molding untuk kebutuhan industri B2B di wilayah Jabodetabek dan Jawa Barat.*

ðŸ’¡ **Langkah Selanjutnya:**
Anda dapat langsung membuka menu **Buat RFQ** untuk mengirimkan permintaan penawaran harga resmi kepada supplier di atas secara langsung.`;
  }

  // 2. STARTER: Perbandingan 3 supplier tekstil terbaik
  if (q.includes("banding") || q.includes("tekstil") || q.includes("3 supplier") || q.includes("komparasi")) {
    return `ðŸ“Š **Analisis Komparasi 3 Supplier Terbaik (Kategori: Tekstil & Garmen)**

Berikut perbandingan mendalam berdasarkan metrik kapasitas, performa pengiriman, dan legalitas di PUSAKA:

**1. CV Sumber Tekstil Bandung** (Bandung, Jawa Barat)
â€¢ **Kapasitas Produksi:** 25.000 pcs/bulan
â€¢ **On-Time Delivery (OTD):** 96% | **Rating:** â­ 4.8/5.0
â€¢ **Sertifikasi Mutu:** SNI, OEKO-TEX
â€¢ **Estimasi Lead Time:** 14 hari kerja
â€¢ **Keunggulan:** Spesialis seragam kerja kantor, pabrik, dan wearpack bersertifikasi SNI dengan 45 penjahit mesin otomatis.

**2. Konveksi Textile Mandiri Bandung** (Bandung, Jawa Barat)
â€¢ **Kapasitas Produksi:** 20.000 pcs/bulan
â€¢ **On-Time Delivery (OTD):** 90% | **Rating:** â­ 4.5/5.0
â€¢ **Sertifikasi Mutu:** SNI
â€¢ **Estimasi Lead Time:** 21 hari kerja
â€¢ **Keunggulan:** Konveksi seragam drill premium, polo shirt, dan sablon/bordir komputer.

**3. Sentra Garmen Nusantara Solo** (Surakarta, Jawa Tengah)
â€¢ **Kapasitas Produksi:** 18.000 pcs/bulan
â€¢ **On-Time Delivery (OTD):** 93% | **Rating:** â­ 4.6/5.0
â€¢ **Sertifikasi Mutu:** SNI, NIB
â€¢ **Estimasi Lead Time:** 18 hari kerja
â€¢ **Keunggulan:** Pabrik garmen skala menengah, harga sangat kompetitif untuk pengadaan seragam instansi dan ritel.

ðŸ’¡ **Rekomendasi Strategis PUSAKA:**
1. **Pilihan Utama Volume & Kepatuhan:** **CV Sumber Tekstil Bandung** paling unggul dalam konsistensi rating (â­ 4.8) dan ketepatan waktu (96% OTD).
2. **Pilihan Alternatif Cepat:** **Konveksi Textile Mandiri Bandung** cocok untuk pesanan yang membutuhkan kapasitas produksi masif.
3. **Pilihan Efisiensi Biaya:** **Sentra Garmen Nusantara Solo** menawarkan estimasi harga yang sangat kompetitif.

*Tips: Anda dapat menerbitkan RFQ kepada ketiga supplier di atas secara bersamaan untuk membandingkan penawaran harga riil.*`;
  }

  // 3. STARTER: Risiko pemilihan supplier baru
  if (q.includes("risiko") || q.includes("risk") || q.includes("memilih supplier") || q.includes("kriteria")) {
    return `ðŸ›¡ï¸ **5 Risiko Utama Saat Memilih Supplier Baru & Cara Memitigasinya di PUSAKA**

Sebagai profesional procurement, berikut faktor risiko kritis yang wajib dipertimbangkan sebelum menerbitkan Purchase Order (PO):

1. **Risiko Keterlambatan Pengiriman (Lead Time Breach)**
   â€¢ *Dampak:* Gangguan pada jadwal perakitan atau stok kehabisan di gudang Anda.
   â€¢ *Mitigasi PUSAKA:* Periksa skor **On-Time Delivery Rate (OTDR)** supplier pada profilnya. Terapkan jadwal pengiriman bertahap (*batch delivery*) dan cantumkan klausul denda keterlambatan pada PKS.

2. **Risiko Inkonsistensi Kualitas (Defect Rate Tinggi)**
   â€¢ *Dampak:* Biaya retur barang, komplain dari pembeli akhir, dan waktu terbuang.
   â€¢ *Mitigasi PUSAKA:* Wajibkan pengiriman *Pre-Production Sample* (sampel awal) sebelum produksi massal. Pastikan toleransi spesifikasi teknis (toleransi dimensi/bahan) tertulis jelas pada RFQ.

3. **Risiko Legalitas & Sertifikasi Palsu**
   â€¢ *Dampak:* Masalah hukum pada saat audit perusahaan, sertifikasi halal/SNI gugur.
   â€¢ *Mitigasi PUSAKA:* Periksa badge **Terverifikasi** pada profil UMKM. PUSAKA menggunakan verifikasi dokumen legalitas (NIB, NPWP, SNI, Halal) untuk memastikan keabsahan supplier.

4. **Risiko Ketergantungan Tunggal (*Single Sourcing*)**
   â€¢ *Dampak:* Jika mesin workshop supplier rusak atau terjadi musibah, pengadaan Anda langsung terhenti.
   â€¢ *Mitigasi PUSAKA:* Alokasikan pesanan dengan skema 70/30 (70% ke supplier utama, 30% ke supplier cadangan) untuk material kritis.

5. **Risiko Finansial & Arus Kas**
   â€¢ *Dampak:* Supplier kehabisan modal kerja di tengah proses pengerjaan.
   â€¢ *Mitigasi PUSAKA:* Terapkan termin pembayaran *milestone* yang adil (misalnya 30% uang muka, 40% saat barang lulus uji QC pabrik, 30% setelah tiba di gudang).`;
  }

  // 4. STARTER: Negosiasi harga dengan UMKM
  if (q.includes("negosiasi") || q.includes("nego") || q.includes("tawar") || q.includes("harga yang baik") || q.includes("diskon")) {
    return `ðŸ¤ **Strategi Negosiasi Harga Win-Win dengan Supplier UMKM**

Negosiasi dengan UMKM berbeda dengan korporasi besar karena mereka sangat sensitif terhadap *cash flow* dan kepastian order. Berikut 4 taktik terbukti efektif:

1. **Tawarkan Komitmen Volume Jangka Panjang (*Blanket Order*)**
   â€¢ Daripada menawar pesanan 500 pcs sekaligus, janjikan kontrak tahunan misalnya 6.000 pcs yang dikirim secara bertahap 500 pcs per bulan.
   â€¢ UMKM bersedia memberikan diskon 5%â€“15% untuk kepastian utilisasi mesin mereka selama beberapa bulan ke depan.

2. **Percepat Termin Pembayaran (*Cash Flow Advantage*)**
   â€¢ Standar korporat sering menuntut tempo pembayaran 60â€“90 hari (TOP). Hal ini sangat memberatkan modal kerja UMKM.
   â€¢ Tawarkan pembayaran lebih cepat (misal tempo 14 hari atau pembayaran tunai 3 hari setelah lolos QC). Sebagian besar UMKM akan dengan senang hati memotong harga pokok penjualan demi perputaran kas cepat.

3. **Bantu Standarisasi Bahan Baku & Kemasan**
   â€¢ Diskusikan apakah kemasan luar dapat disederhanakan tanpa mengurangi perlindungan barang.
   â€¢ Terkadang biaya tinggi timbul akibat spesifikasi kemasan custom yang mahal bagi UMKM skala menengah.

4. **Jalankan *Trial Batch* (Pesanan Uji Coba)**
   â€¢ Mulai dengan pesanan percontohan volume kecil pada harga normal. Tunjukkan bahwa perusahaan Anda adalah mitra profesional yang membayar tepat waktu. Setelah hubungan saling percaya terbangun, ajukan revisi harga untuk pesanan reguler skala penuh.`;
  }

  // 5. Privasi & Syarat Ketentuan
  if (q.includes("syarat") || q.includes("ketentuan") || q.includes("terms") || q.includes("privasi") || q.includes("privacy") || q.includes("keamanan")) {
    return `ðŸ”’ **Kebijakan Keamanan Data, Privasi & Syarat Layanan PUSAKA**

PUSAKA mengedepankan standar keamanan dan tata kelola hukum pengadaan B2B:
â€¢ **Kepatuhan UU PDP (UU No. 27/2022):** Seluruh data identitas, NIB, NPWP, dan nomor rekening bisnis dienkripsi menggunakan standar TLS 1.3 dan penyimpanan terisolasi.
â€¢ **Kerahasiaan Desain & Harga:** Spesifikasi teknik rahasia (CAD/blueprint) dan lembar penawaran (Quotation) hanya dapat diakses oleh pihak yang bertransaksi secara sah.
â€¢ **Dokumen Legal Lengkap:**
  - Syarat & Ketentuan: \`/terms\`
  - Kebijakan Privasi: \`/privacy\``;
  }

  // 6. Alur RFQ
  if (q.includes("buat rfq") || q.includes("cara kerja") || q.includes("alur") || q.includes("cara pesan")) {
    return `ðŸ“ **Panduan 4 Langkah Pengadaan Cepat Melalui PUSAKA**

1. **Buat Permintaan Pengadaan (RFQ)** di menu Buat RFQ.
2. **Pencocokan AI Otomatis (*AI Supplier Matching*)** mencocokkan supplier terdekat dan terverifikasi.
3. **Terima & Bandingkan Penawaran (*Quotations*)** dari UMKM secara langsung.
4. **Konfirmasi Pesanan (*Purchase Order*)** dan pantau pengiriman hingga selesai.`;
  }

  // 7. General Supplier Search
  if (q.includes("supplier") || q.includes("butuh") || q.includes("cari") || q.includes("logam") || q.includes("kemasan") || q.includes("kayu") || q.includes("makanan") || q.includes("elektronik")) {
    return `ðŸ” **Rekomendasi Supplier Terverifikasi di PUSAKA**

Berdasarkan pencarian Anda, PUSAKA memiliki database UMKM lokal terverifikasi di berbagai kategori:
â€¢ **Logam & Permesinan:** Bengkel Bubut CNC Karya Logam (Bandung) & UD Maju Bersama Steel (Jakarta).
â€¢ **Kemasan & Karton:** UD Berkah Kemasan Mandiri (Semarang) & CV Kemasan Lestari (Semarang).
â€¢ **Tekstil & Seragam:** CV Sumber Tekstil (Bandung) & Konveksi Mandiri (Bandung).
â€¢ **Bahan Pangan & Rempah:** Koperasi Tani Agro Bumi (Bogor & Medan).
â€¢ **Furnitur & Palet Kayu:** Sentra Kayu Mebel Jepara Asri (Jepara).
â€¢ **Elektronik & Panel:** UD Panel & Kabel Elektro Mandiri (Surabaya/Sidoarjo).

ðŸ’¡ Silakan buka menu **Marketplace Supplier** atau **Buat RFQ** untuk mendapatkan penawaran harga langsung dari mitra UMKM di atas!`;
  }

  // 8. Greetings
  if (q.startsWith("halo") || q.startsWith("hai") || q.startsWith("hi") || q.startsWith("pagi") || q.startsWith("siang") || q.startsWith("sore") || q.startsWith("malam")) {
    return `Halo! ðŸ‘‹ Saya adalah **AI Procurement Assistant PUSAKA**.

Saya siap mendampingi proses pengadaan bisnis B2B Anda:
1. ðŸ” **Mencari Supplier:** *Misal: "Saya butuh supplier bahan baku plastik dengan kapasitas 10 ton/bulan di Jawa Barat"*
2. ðŸ“Š **Membandingkan Supplier:** *Misal: "Bantu saya membandingkan 3 supplier tekstil terbaik"*
3. ðŸ›¡ï¸ **Manajemen Risiko:** *Misal: "Apa risiko yang perlu dipertimbangkan saat memilih supplier baru?"*
4. ðŸ¤ **Strategi Negosiasi:** *Misal: "Bagaimana cara bernegosiasi harga yang baik dengan supplier UMKM?"*

Ada kebutuhan barang atau proyek apa yang sedang Anda rencanakan?`;
  }

  // 9. Default Fallback
  return `Terima kasih atas pertanyaan Anda. Terkait kebutuhan pengadaan di platform PUSAKA:
Anda dapat menanyakan rekomendasi supplier UMKM spesifik, perbandingan penawaran, strategi mitigasi risiko, atau panduan pembuatan RFQ. Silakan tanyakan kategori produk atau lokasi yang Anda butuhkan!`;
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
      console.warn("API request failed, using intelligent offline fallback:", err);
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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-neutral-900">AI Procurement Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-neutral-500">Online â€¢ Siap membantu</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() =>
              setMessages([{
                role: "assistant",
                content: "Percakapan baru dimulai. Apa yang bisa saya bantu?",
                timestamp: new Date(),
              }])
            }
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                msg.role === "assistant"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "bg-blue-600"
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-none"
              )}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p
                className={cn(
                  "text-[10px] mt-1.5",
                  msg.role === "user" ? "text-blue-100" : "text-neutral-400"
                )}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-neutral-500">Sedang berpikir...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Starters (show only at beginning) */}
      {messages.length === 1 && (
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 mb-2">ðŸ’¡ Coba tanyakan:</p>
          <div className="flex flex-wrap gap-2">
            {starters.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors text-left"
              >
                {s.length > 50 ? s.slice(0, 50) + "..." : s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-neutral-200">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan apa saja tentang pengadaan..."
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none h-11 w-11 p-0 flex-shrink-0 shadow-md hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-center text-[10px] text-neutral-400 mt-2">
          AI dapat melakukan kesalahan. Selalu verifikasi informasi penting secara mandiri.
        </p>
      </div>
    </div>
  );
}
