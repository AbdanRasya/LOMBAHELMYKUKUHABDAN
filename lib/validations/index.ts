import { z } from "zod";

// ============================================================
// AUTH SCHEMAS
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
  role: z.enum(["COMPANY", "UMKM"]),
  agreeToTerms: z.boolean().refine((val) => val === true, "Anda harus menyetujui syarat dan ketentuan"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

// ============================================================
// COMPANY SCHEMAS
// ============================================================

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  industry: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("URL website tidak valid").optional().or(z.literal("")),
  description: z.string().optional(),
  npwp: z.string().optional(),
});

// ============================================================
// RFQ SCHEMAS
// ============================================================

export const rfqSchema = z.object({
  title: z.string().min(5, "Judul RFQ minimal 5 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  categoryId: z.string().optional(),
  quantity: z.number().positive("Kuantitas harus lebih dari 0").optional(),
  unit: z.string().optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  deadline: z.string().optional(),
  specifications: z.string().optional(),
});

export const rfqAISchema = z.object({
  naturalLanguageRequest: z.string().min(20, "Deskripsi minimal 20 karakter"),
});

// ============================================================
// UMKM SCHEMAS
// ============================================================

export const umkmBasicInfoSchema = z.object({
  businessName: z.string().min(2, "Nama usaha minimal 2 karakter"),
  tagline: z.string().max(100).optional(),
  description: z.string().min(50, "Deskripsi minimal 50 karakter"),
  province: z.string().min(1, "Provinsi harus dipilih"),
  city: z.string().min(1, "Kota harus diisi"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  website: z.string().url("URL website tidak valid").optional().or(z.literal("")),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  employeeCount: z.number().positive().optional(),
});

export const umkmLegalSchema = z.object({
  npwp: z.string().optional(),
  nib: z.string().optional(),
  siup: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  minOrder: z.number().positive().optional(),
  maxCapacity: z.number().positive().optional(),
  leadTimeDays: z.number().positive().optional(),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
});

export const certificationSchema = z.object({
  name: z.string().min(2, "Nama sertifikasi minimal 2 karakter"),
  issuer: z.string().optional(),
  number: z.string().optional(),
  issuedAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const quotationSchema = z.object({
  price: z.number().positive("Harga harus lebih dari 0"),
  leadTimeDays: z.number().positive("Lead time harus lebih dari 0").optional(),
  notes: z.string().optional(),
  validUntil: z.string().optional(),
});

// ============================================================
// REVIEW SCHEMA
// ============================================================

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Komentar minimal 10 karakter").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;
export type RFQFormData = z.infer<typeof rfqSchema>;
export type UmkmBasicInfoFormData = z.infer<typeof umkmBasicInfoSchema>;
export type UmkmLegalFormData = z.infer<typeof umkmLegalSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type QuotationFormData = z.infer<typeof quotationSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
