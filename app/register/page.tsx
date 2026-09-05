"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Sparkles, Loader2, Building2, Factory, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { registerAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const roles = [
  {
    value: "COMPANY" as const,
    icon: Building2,
    title: "Perusahaan",
    desc: "Saya mencari supplier untuk kebutuhan pengadaan",
    color: "blue",
  },
  {
    value: "UMKM" as const,
    icon: Factory,
    title: "UMKM / Supplier",
    desc: "Saya adalah supplier yang ingin mendapatkan pelanggan baru",
    color: "emerald",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as "COMPANY" | "UMKM") || "COMPANY";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole, agreeToTerms: false },
  });

  const selectedRole = watch("role");
  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await registerAction({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (result?.success) {
        toast.success(result.message || "Akun berhasil dibuat!");
        router.push("/login");
      } else {
        toast.error(result?.error || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan jaringan atau server. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">SourceHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Buat Akun Baru</h1>
          <p className="text-neutral-500 mt-1 text-sm">Bergabunglah dengan ribuan pengguna SourceHub</p>
        </div>

        <div className="glass rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Saya mendaftar sebagai</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setValue("role", role.value)}
                      className={cn(
                        "relative p-3 rounded-xl border-2 text-left transition-all duration-200",
                        isSelected
                          ? role.color === "blue"
                            ? "border-blue-500 bg-blue-50"
                            : "border-emerald-500 bg-emerald-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      {isSelected && (
                        <div className={cn(
                          "absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center",
                          role.color === "blue" ? "bg-blue-500" : "bg-emerald-500"
                        )}>
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <role.icon className={cn(
                        "w-5 h-5 mb-1.5",
                        isSelected
                          ? role.color === "blue" ? "text-blue-600" : "text-emerald-600"
                          : "text-neutral-500"
                      )} />
                      <p className={cn(
                        "text-xs font-bold",
                        isSelected
                          ? role.color === "blue" ? "text-blue-700" : "text-emerald-700"
                          : "text-neutral-700"
                      )}>{role.title}</p>
                      <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">{role.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                {selectedRole === "COMPANY" ? "Nama Perusahaan / Nama Anda" : "Nama Usaha / Nama Anda"}
              </Label>
              <Input id="name" placeholder="Contoh: PT Maju Bersama" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" placeholder="nama@email.com" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 rounded border-neutral-300"
                checked={agreeToTerms}
                onChange={(e) => setValue("agreeToTerms", e.target.checked)}
              />
              <Label htmlFor="terms" className="text-xs text-neutral-600 cursor-pointer">
                Saya menyetujui{" "}
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                  Kebijakan Privasi
                </Link>{" "}
                SourceHub
              </Label>
            </div>
            {errors.agreeToTerms && <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-brand text-white border-none shadow-md hover:opacity-90 h-11"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Membuat Akun...</>
              ) : (
                "Buat Akun Gratis"
              )}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-neutral-600">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
