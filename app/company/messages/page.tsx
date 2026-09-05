"use client";

import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { MessageSquare, Send, Search, ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type Conversation = {
  id: string;
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
};

type ConversationApiItem = {
  id: string;
  otherUser?: { id: string; companyName?: string; businessName?: string };
  messages?: { content: string }[];
  lastMessageAt?: string;
  createdAt?: string;
};

type MessageApiItem = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export default function CompanyMessagesPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const searchParams = useSearchParams();
  const queryConvId = searchParams.get("id");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(queryConvId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Responsive state
  const [showListOnMobile, setShowListOnMobile] = useState(!queryConvId);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    // Fetch conversations
    const fetchConvs = async () => {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          const list = (data.conversations || []) as ConversationApiItem[];
          const formatted = list.map((c: ConversationApiItem) => ({
            id: c.id,
            partnerId: c.otherUser?.id || "",
            partnerName: c.otherUser?.businessName || "Unknown Supplier",
            lastMessage: c.messages?.[0]?.content || "",
            lastMessageAt: c.lastMessageAt || c.createdAt || "",
            unreadCount: 0
          }));
          setConversations(formatted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConvs();
  }, []);

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const list = (data.messages || []) as MessageApiItem[];
        const formatted = list.map((m: MessageApiItem) => ({
          ...m,
          isOwn: m.senderId === currentUserId
        }));
        setMessages(formatted);
        scrollToBottom();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeConvId) {
      queueMicrotask(() => fetchMessages(activeConvId));
      const interval = setInterval(() => fetchMessages(activeConvId), 3000);
      return () => clearInterval(interval);
    }
  }, [activeConvId, currentUserId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !activeConvId) return;

    try {
      const res = await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText }),
      });
      if (res.ok) {
        setInputText("");
        fetchMessages(activeConvId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    setShowListOnMobile(false);
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/50 flex overflow-hidden h-full">
        
        {/* Left Sidebar - Conversations */}
        <div className={`w-full md:w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50 ${!showListOnMobile ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Pesan</h2>
            <div className="mt-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari obrolan..." 
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm">Belum ada obrolan</p>
                <Button variant="link" className="text-emerald-600 mt-2">Cari Supplier</Button>
              </div>
            ) : (
              conversations.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => handleSelectConv(c.id)}
                  className={`p-4 border-b border-slate-100/50 cursor-pointer transition-all hover:bg-slate-50 ${activeConvId === c.id ? 'bg-emerald-50/30 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-200 shrink-0">
                      {(c.partnerName?.charAt(0) || "U").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-slate-900 truncate pr-2">{c.partnerName}</h3>
                        <span className="text-xs text-slate-400 shrink-0">{c.lastMessageAt ? format(new Date(c.lastMessageAt), "HH:mm") : ''}</span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{c.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Area - Chat Window */}
        <div className={`w-full md:w-2/3 flex flex-col bg-white ${showListOnMobile ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                  <button 
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    onClick={() => setShowListOnMobile(true)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-200">
                    {(activeConv.partnerName?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{activeConv.partnerName}</h3>
                    <p className="text-xs text-emerald-600 font-medium">Online</p>
                  </div>
                </div>

                {/* Encryption Badge */}
                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🔒 Chat Terenkripsi B2B</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                <div className="space-y-6">
                  {/* Encryption Banner */}
                  <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-3 text-center text-xs text-slate-600 shadow-xs flex items-center justify-center gap-2 max-w-lg mx-auto mb-4">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pesan &amp; dokumen dalam obrolan ini <strong>terenkripsi SSL (256-bit) &amp; rahasia</strong>. Hanya Anda dan {activeConv.partnerName} yang dapat mengaksesnya.</span>
                  </div>
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${m.isOwn ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'}`}>
                        <p className="leading-relaxed">{m.content}</p>
                        <p className={`text-[10px] mt-2 text-right ${m.isOwn ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {m.createdAt ? format(new Date(m.createdAt), "HH:mm") : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ketik pesan Anda..."
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2 px-3 text-sm text-slate-800"
                    rows={1}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 w-11 p-0 shrink-0 transition-colors"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm shadow-slate-200 mb-6 border border-slate-100">
                <MessageSquare className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Pesan SourceHub</h3>
              <p className="text-slate-500 text-center max-w-sm">
                Pilih obrolan dari daftar di sebelah kiri untuk mulai mengirim pesan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
