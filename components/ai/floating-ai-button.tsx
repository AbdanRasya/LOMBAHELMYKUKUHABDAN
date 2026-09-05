"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, X, Send, Bot, User, Loader2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function FloatingAiButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya AI Assistant PUSAKA 👋 Ada yang bisa saya bantu terkait pengadaan, penawaran harga, atau rekomendasi supplier?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isUmkm = pathname?.startsWith("/umkm");
  const assistantPath = isUmkm ? "/umkm/assistant" : "/company/assistant";

  // Hide on full assistant pages — but MUST be after all hooks (Rules of Hooks)
  const isAssistantPage = pathname === "/umkm/assistant" || pathname === "/company/assistant";

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const quickStarters = isUmkm
    ? ["Tips Menang RFQ", "Skor Kesiapan UMKM", "Syarat Sertifikasi TKDN"]
    : ["Rekomendasi Supplier", "Bantu Buat RFQ", "Strategi Negosiasi"];

  // Early return AFTER hooks
  if (isAssistantPage) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: isUmkm ? "UMKM_SELLER" : "BUYER_COMPANY",
          messages: [...messages, userMsg].map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const replyText = data.response || data.reply || "Maaf, terjadi masalah koneksi. Silakan coba lagi.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: replyText,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isUmkm
            ? "Saya siap membantu Anda melengkapi profil, membuat penawaran harga kompetitif, atau menghitung estimasi margin B2B!"
            : "Saya siap membantu Anda mencari supplier terpercaya, membandingkan spesifikasi, atau membuat dokumen RFQ!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Popover Mini Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className={cn(
            "px-4 py-3.5 flex items-center justify-between text-white shadow-sm shrink-0",
            isUmkm ? "bg-gradient-to-r from-emerald-600 to-teal-700" : "bg-gradient-to-r from-blue-600 to-indigo-700"
          )}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-wide">PUSAKA AI Assistant</h3>
                  <Badge className="bg-white/20 hover:bg-white/20 text-white text-[9px] px-1.5 py-0 border-0">
                    Online
                  </Badge>
                </div>
                <p className="text-[11px] opacity-90">Konsultan Pengadaan & Bisnis 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Buka Layar Penuh"
                onClick={() => {
                  setIsOpen(false);
                  router.push(assistantPath);
                }}
                className="h-7 w-7 text-white hover:bg-white/20 rounded-lg"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 text-white hover:bg-white/20 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70 dark:bg-slate-950/50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 max-w-[88%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold text-white shadow-sm mt-0.5",
                    m.role === "user"
                      ? "bg-slate-800"
                      : isUmkm
                      ? "bg-emerald-600"
                      : "bg-blue-600"
                  )}
                >
                  {m.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                <div
                  className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 mr-auto items-center">
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]",
                  isUmkm ? "bg-emerald-600" : "bg-blue-600"
                )}>
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-2.5 text-xs text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>AI mengetik...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Starters */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {quickStarters.map((qs, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qs)}
                  className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-300 transition-colors font-medium"
                >
                  ✨ {qs}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex gap-2 items-center">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Tanyakan sesuatu ke AI..."
                className="min-h-[40px] max-h-[80px] py-2 text-xs rounded-xl border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500"
                rows={1}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-xl text-white shrink-0 shadow-md",
                  isUmkm ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Tampilkan AI Assistant PUSAKA"
        className={cn(
          "group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4",
          isUmkm
            ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white focus:ring-emerald-300/50 shadow-emerald-600/30"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white focus:ring-blue-300/50 shadow-blue-600/30"
        )}
      >
        {/* Pulsing Outer Glow */}
        <span className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-25",
          isUmkm ? "bg-emerald-500" : "bg-blue-500"
        )} />

        {/* Icon */}
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200 rotate-90" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
        )}

        {/* Hover Tooltip / Tag */}
        {!isOpen && (
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Tanya AI Assistant PUSAKA
          </span>
        )}
      </button>
    </div>
  );
}
