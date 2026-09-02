import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("id-ID").format(num);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  if (minutes > 0) return `${minutes} menit lalu`;
  return "Baru saja";
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function calculateReadinessScore(profile: {
  hasNpwp: boolean;
  hasNib: boolean;
  hasDescription: boolean;
  hasLogo: boolean;
  hasCoverImage: boolean;
  productCount: number;
  certificationCount: number;
  machineCount: number;
  photoCount: number;
  portfolioCount: number;
  employeeCount: number | null;
  foundedYear: number | null;
}): number {
  let score = 0;
  const maxScore = 100;

  // Legal documents (25%)
  if (profile.hasNpwp) score += 10;
  if (profile.hasNib) score += 15;

  // Business info completeness (20%)
  if (profile.hasDescription) score += 5;
  if (profile.hasLogo) score += 5;
  if (profile.hasCoverImage) score += 5;
  if (profile.employeeCount) score += 3;
  if (profile.foundedYear) score += 2;

  // Products (15%)
  score += Math.min(profile.productCount * 3, 15);

  // Certifications (20%)
  score += Math.min(profile.certificationCount * 7, 20);

  // Machines & capacity (10%)
  score += Math.min(profile.machineCount * 2, 10);

  // Portfolio (10%)
  score += Math.min(profile.portfolioCount * 3, 10);

  return Math.min(Math.round((score / maxScore) * 100), 100);
}

export function getTrustScoreLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: "Sangat Terpercaya", color: "emerald" };
  if (score >= 75) return { label: "Terpercaya", color: "green" };
  if (score >= 60) return { label: "Cukup Terpercaya", color: "blue" };
  if (score >= 40) return { label: "Sedang", color: "yellow" };
  return { label: "Perlu Perhatian", color: "red" };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 60) return "bg-blue-50 border-blue-200";
  if (score >= 40) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
}
