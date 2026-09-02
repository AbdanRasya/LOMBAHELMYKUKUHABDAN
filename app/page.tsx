import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturedSuppliersSection } from "@/components/landing/featured-suppliers-section";
import { SuccessStoriesSection } from "@/components/landing/success-stories-section";
import { SDGSection } from "@/components/landing/sdg-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SourceHub – Temukan Supplier Lokal Terpercaya untuk Bisnis Anda",
  description:
    "Platform AI-powered B2B pertama di Indonesia yang menghubungkan perusahaan dengan UMKM lokal terpercaya. Pengadaan lebih cerdas, lebih efisien.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <FeaturedSuppliersSection />
      <SuccessStoriesSection />
      <SDGSection />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
