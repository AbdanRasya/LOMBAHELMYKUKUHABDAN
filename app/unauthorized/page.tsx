import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full border-slate-200 shadow-xl rounded-2xl bg-white text-center">
        <CardContent className="p-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Akses Tidak Diizinkan</h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Halaman ini khusus untuk jenis akun yang berbeda. Anda telah dialihkan demi keamanan akun Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full text-xs rounded-xl gap-1.5">
                <Home className="w-3.5 h-3.5" /> Beranda
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Masuk Ulang
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
