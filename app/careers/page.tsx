import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, ArrowRight, Sparkles, Building2, Code, Zap } from "lucide-react";

export const metadata = {
  title: "Karir – PUSAKA",
  description: "Bergabung bersama tim PUSAKA dalam membangun ekosistem pengadaan B2B berbasis AI terbesar di Indonesia.",
};

const JOBS = [
  { title: "Senior AI & Machine Learning Engineer", dept: "Engineering", type: "Full-Time", location: "Sidoarjo / Remote" },
  { title: "Lead B2B Procurement Specialist", dept: "Operations", type: "Full-Time", location: "Sidoarjo, Jawa Timur" },
  { title: "UMKM Relationship & Onboarding Manager", dept: "Partnership", type: "Full-Time", location: "Sidoarjo / Surabaya" },
  { title: "Senior Frontend Engineer (Next.js & React)", dept: "Engineering", type: "Full-Time", location: "Remote" },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-slate-900 text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            Karir di PUSAKA
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Mari Membangun Masa Depan Rantai Pasok Nusantara
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Kami mencari talenta terbaik Indonesia yang berhasrat menciptakan dampak nyata bagi kemajuan UMKM dan industri nasional.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 lg:py-20 space-y-8">
        <h2 className="text-2xl font-bold text-slate-900">Posisi Terbuka saat Ini</h2>

        <div className="space-y-4">
          {JOBS.map((j) => (
            <Card key={j.title} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">{j.dept}</Badge>
                    <span className="text-xs text-slate-400">• {j.type}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{j.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {j.location}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer self-start sm:self-center">
                  Lamar Posisi <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
