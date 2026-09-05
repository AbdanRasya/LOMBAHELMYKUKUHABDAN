"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Sparkles, Loader2, CheckCircle2, LayoutDashboard, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { signIn, getSession } from "next-auth/react";

type LoginSuccessData = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  redirectUrl: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<LoginSuccessData | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Email atau password salah");
      } else if (res?.ok) {
        toast.success("Login berhasil! Mengalihkan...");

        // Fetch real effective role from server endpoint
        let role = "COMPANY";
        try {
          const meRes = await fetch("/api/auth/me");
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData?.user?.role) {
              role = meData.user.role;
            }
          }
        } catch {}

        if (role === "COMPANY") {
          const session = await getSession();
          if ((session?.user as any)?.role) {
            role = (session?.user as any).role;
          }
        }

        const cleanCallback = callbackUrl && !callbackUrl.includes("/login") ? callbackUrl : "";
        const targetUrl = cleanCallback || (
          role === "ADMIN" ? "/admin/dashboard" :
          role === "UMKM" ? "/umkm/dashboard" :
          "/company/dashboard"
        );

        window.location.href = targetUrl;
        return;
      } else {
        toast.error("Terjadi kesalahan saat login");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan jaringan atau server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">Source<span className="text-emerald-600">Hub</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {loginSuccess ? "Login Berhasil!" : "Selamat Datang Kembali"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {loginSuccess ? "Anda telah terautentikasi di sistem PUSAKA" : "Masuk ke akun PUSAKA Anda"}
          </p>
        </div>

        {/* Success Card */}
        {loginSuccess ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                {loginSuccess.name || "Pengguna PUSAKA"}
              </h3>
              <p className="text-xs text-slate-500 font-mono">{loginSuccess.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full border border-emerald-200">
                Akses: {loginSuccess.role || "MEMBER"}
              </span>
            </div>

            <p className="text-sm text-slate-600">
              Silakan pilih tujuan navigasi Anda di bawah ini:
            </p>

            <div className="space-y-3 pt-2">
              <Button
                onClick={() => router.push(loginSuccess.redirectUrl)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 shadow-md shadow-emerald-600/20 font-medium"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Masuk ke Dashboard ({loginSuccess.role || "USER"})
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl h-11 font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda Utama
              </Button>
            </div>
          </div>
        ) : (
          /* Form Card */
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  className={errors.email ? "border-red-400 focus-visible:ring-red-400" : ""}
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className={`pr-10 ${errors.password ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all h-11 font-medium"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Masuk...</>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Belum punya akun?{" "}
                <Link href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
