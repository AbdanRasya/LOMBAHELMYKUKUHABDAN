import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Akses Ditolak</h1>
        <p className="text-slate-500 mb-6 leading-relaxed">
          Anda tidak memiliki izin atau peran (role) yang sesuai untuk mengakses halaman ini. Silakan kembali ke dashboard atau masuk menggunakan akun yang sesuai.
        </p>
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-2.5 font-medium transition-colors">
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full rounded-full py-2.5 font-medium border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors">
              Masuk dengan Akun Lain
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
