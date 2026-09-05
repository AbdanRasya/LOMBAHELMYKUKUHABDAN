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
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "SourceHub – Temukan Supplier Lokal Terpercaya untuk Bisnis Anda",
  description:
    "Platform AI-powered B2B pertama di Indonesia yang menghubungkan perusahaan dengan UMKM lokal terpercaya. Pengadaan lebih cerdas, lebih efisien.",
};

export const revalidate = 0;

export default async function LandingPage() {
  const [dbSuppliers, totalUmkm, totalProducts, totalRfqs, dbReviewsRaw] = await Promise.all([
    db.umkmProfile.findMany({
      take: 6,
      include: {
        trustScore: true,
        categories: true,
        products: { where: { isActive: true } },
        reviews: true,
      },
      orderBy: { readinessScore: "desc" },
    }).catch(() => []),
    db.umkmProfile.count().catch(() => 0),
    db.product.count({ where: { isActive: true } }).catch(() => 0),
    db.rFQ.count().catch(() => 0),
    db.review.findMany({
      take: 6,
      include: {
        umkmProfile: {
          select: {
            businessName: true,
            city: true,
            province: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
  ]);

  const dbReviews = await Promise.all(
    dbReviewsRaw.map(async (r) => {
      const company = await db.companyProfile.findUnique({
        where: { id: r.companyId },
        select: { companyName: true },
      }).catch(() => null);
      return {
        ...r,
        companyName: company?.companyName || "PT Bumi Teknik Nusantara",
      };
    })
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <FeaturedSuppliersSection
        realSuppliers={dbSuppliers}
        counts={{ umkm: totalUmkm, products: totalProducts, rfqs: totalRfqs }}
      />
      <SuccessStoriesSection realReviews={dbReviews} />
      <SDGSection />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
