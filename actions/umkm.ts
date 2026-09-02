"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateReadinessAnalysis } from "@/lib/ai";

async function getUmkmProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await db.umkmProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("UMKM profile not found");

  return profile;
}

export async function updateUmkmBasicInfoAction(data: {
  businessName: string;
  tagline?: string;
  description?: string;
  province?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  foundedYear?: number;
  employeeCount?: number;
  categoryIds?: string[];
}) {
  try {
    const profile = await getUmkmProfile();

    await db.umkmProfile.update({
      where: { id: profile.id },
      data: {
        businessName: data.businessName,
        tagline: data.tagline,
        description: data.description,
        province: data.province,
        city: data.city,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        foundedYear: data.foundedYear,
        employeeCount: data.employeeCount,
        categories: data.categoryIds
          ? { set: data.categoryIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    await recalculateReadinessScore(profile.id);
    revalidatePath("/umkm/profile");
    return { success: true };
  } catch (error) {
    console.error("Update UMKM info error:", error);
    return { success: false, error: "Gagal menyimpan informasi" };
  }
}

export async function updateUmkmLegalAction(data: {
  npwp?: string;
  nib?: string;
  siup?: string;
}) {
  try {
    const profile = await getUmkmProfile();
    await db.umkmProfile.update({
      where: { id: profile.id },
      data,
    });
    await recalculateReadinessScore(profile.id);
    revalidatePath("/umkm/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan dokumen legal" };
  }
}

export async function addProductAction(data: {
  name: string;
  categoryId?: string;
  description?: string;
  unit?: string;
  minOrder?: number;
  maxCapacity?: number;
  leadTimeDays?: number;
  priceMin?: number;
  priceMax?: number;
}) {
  try {
    const profile = await getUmkmProfile();
    await db.product.create({
      data: { umkmId: profile.id, ...data },
    });
    await recalculateReadinessScore(profile.id);
    revalidatePath("/umkm/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menambahkan produk" };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const profile = await getUmkmProfile();
    await db.product.deleteMany({
      where: { id: productId, umkmId: profile.id },
    });
    await recalculateReadinessScore(profile.id);
    revalidatePath("/umkm/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus produk" };
  }
}

export async function addCertificationAction(data: {
  name: string;
  issuer?: string;
  number?: string;
  issuedAt?: string;
  expiresAt?: string;
}) {
  try {
    const profile = await getUmkmProfile();
    await db.certification.create({
      data: {
        umkmId: profile.id,
        name: data.name,
        issuer: data.issuer,
        number: data.number,
        issuedAt: data.issuedAt ? new Date(data.issuedAt) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        status: "PENDING",
      },
    });
    revalidatePath("/umkm/certifications");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menambahkan sertifikasi" };
  }
}

export async function submitQuotationAction(data: {
  rfqId: string;
  price: number;
  leadTimeDays?: number;
  notes?: string;
  validUntil?: string;
}) {
  try {
    const profile = await getUmkmProfile();
    await db.quotation.upsert({
      where: { rfqId_umkmId: { rfqId: data.rfqId, umkmId: profile.id } },
      update: {
        price: data.price,
        leadTimeDays: data.leadTimeDays,
        notes: data.notes,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        status: "PENDING",
      },
      create: {
        rfqId: data.rfqId,
        umkmId: profile.id,
        price: data.price,
        leadTimeDays: data.leadTimeDays,
        notes: data.notes,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      },
    });

    // Create notification for company
    const rfq = await db.rFQ.findUnique({
      where: { id: data.rfqId },
      include: { companyProfile: { include: { user: true } } },
    });

    if (rfq) {
      await db.notification.create({
        data: {
          userId: rfq.companyProfile.userId,
          type: "NEW_QUOTATION",
          title: "Penawaran Baru Diterima",
          body: `${profile.businessName} mengirimkan penawaran untuk RFQ "${rfq.title}"`,
          link: `/company/rfq/${rfq.id}`,
        },
      });
    }

    revalidatePath("/umkm/quotations");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal mengirim penawaran" };
  }
}

async function recalculateReadinessScore(umkmId: string) {
  const profile = await db.umkmProfile.findUnique({
    where: { id: umkmId },
    include: {
      products: true,
      certifications: { where: { status: "VERIFIED" } },
      machines: true,
      factoryPhotos: true,
      portfolio: true,
    },
  });

  if (!profile) return;

  const analysis = await generateReadinessAnalysis(profile);

  await db.umkmProfile.update({
    where: { id: umkmId },
    data: { readinessScore: analysis.score },
  });

  // Update or create TrustScore
  await db.trustScore.upsert({
    where: { umkmId },
    update: {
      overall: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      calculatedAt: new Date(),
    },
    create: {
      umkmId,
      overall: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
    },
  });
}
