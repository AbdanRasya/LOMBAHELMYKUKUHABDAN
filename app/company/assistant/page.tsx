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
      content: "Halo! Saya adalah AI Procurement Assistant SourceHub. Saya siap membantu Anda dalam proses pengadaan — mulai dari mencari supplier, membandingkan penawaran, hingga strategi negosiasi. Apa yang bisa saya bantu hari ini?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "Maaf, terjadi kesalahan. Silakan coba lagi.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, saya mengalami gangguan koneksi. Silakan coba lagi.",
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
              <span className="text-xs text-neutral-500">Online • Siap membantu</span>
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
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
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
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                msg.role === "assistant"
                  ? "bg-white text-neutral-800 rounded-tl-none border border-neutral-200"
                  : "bg-blue-600 text-white rounded-tr-none"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p
                className={cn(
                  "text-[10px] mt-2",
                  msg.role === "assistant" ? "text-neutral-400" : "text-blue-200"
                )}
              >
                {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
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
        <div ref={bottomRef} />
      </div>

      {/* Starters (show only at beginning) */}
      {messages.length === 1 && (
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 mb-2">💡 Coba tanyakan:</p>
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
