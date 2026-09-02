"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rfqSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { parseRFQFromText, matchSuppliers } from "@/lib/ai";

async function getCompanyProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("Company profile not found");

  return profile;
}

export async function createRFQAction(data: {
  title: string;
  description: string;
  categoryId?: string;
  quantity?: number;
  unit?: string;
  budgetMin?: number;
  budgetMax?: number;
  deadline?: string;
  specifications?: string;
}) {
  try {
    const profile = await getCompanyProfile();

    const rfq = await db.rFQ.create({
      data: {
        companyId: profile.id,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        quantity: data.quantity,
        unit: data.unit,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        specifications: data.specifications,
        status: "OPEN",
      },
    });

    revalidatePath("/company/rfq");
    return { success: true, rfqId: rfq.id };
  } catch (error) {
    console.error("Create RFQ error:", error);
    return { success: false, error: "Gagal membuat RFQ" };
  }
}

export async function createRFQFromAIAction(naturalText: string) {
  try {
    const profile = await getCompanyProfile();
    const structured = await parseRFQFromText(naturalText);

    const rfq = await db.rFQ.create({
      data: {
        companyId: profile.id,
        title: structured.title,
        description: structured.description,
        quantity: structured.quantity || undefined,
        unit: structured.unit,
        budgetMin: structured.budgetMin || undefined,
        budgetMax: structured.budgetMax || undefined,
        specifications: structured.specifications,
        status: "DRAFT",
        isAIGenerated: true,
      },
    });

    revalidatePath("/company/rfq");
    return { success: true, rfq: { ...rfq, ...structured } };
  } catch (error) {
    return { success: false, error: "Gagal memproses dengan AI" };
  }
}

export async function updateRFQStatusAction(rfqId: string, status: string) {
  try {
    const profile = await getCompanyProfile();
    await db.rFQ.update({
      where: { id: rfqId, companyId: profile.id },
      data: { status: status as any },
    });
    revalidatePath("/company/rfq");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal update status" };
  }
}

export async function getAIMatchAction(rfqId: string) {
  try {
    const rfq = await db.rFQ.findUnique({
      where: { id: rfqId },
      include: { category: true },
    });
    if (!rfq) return { success: false, error: "RFQ tidak ditemukan" };

    const suppliers = await db.umkmProfile.findMany({
      where: { verificationStatus: "APPROVED" },
      include: {
        categories: true,
        products: { take: 3 },
        certifications: { where: { status: "VERIFIED" } },
        trustScore: true,
      },
      take: 20,
    });

    const matches = await matchSuppliers(
      {
        title: rfq.title,
        description: rfq.description,
        category: rfq.category?.name,
        quantity: rfq.quantity || undefined,
        specifications: rfq.specifications || undefined,
      },
      suppliers
    );

    // Save recommendations to DB
    for (const match of matches.slice(0, 10)) {
      await db.aIRecommendation.upsert({
        where: { rfqId_umkmId: { rfqId: rfq.id, umkmId: match.umkmId } },
        update: { matchScore: match.matchScore, explanation: match.explanation, reasons: match.reasons },
        create: {
          rfqId: rfq.id,
          umkmId: match.umkmId,
          matchScore: match.matchScore,
          explanation: match.explanation,
          reasons: match.reasons,
          rank: matches.indexOf(match) + 1,
        },
      });
    }

    return { success: true, matches };
  } catch (error) {
    console.error("AI match error:", error);
    return { success: false, error: "Gagal mendapatkan rekomendasi AI" };
  }
}

export async function saveSupplierAction(umkmId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await db.savedSupplier.upsert({
      where: { userId_umkmId: { userId: session.user.id, umkmId } },
      update: {},
      create: { userId: session.user.id, umkmId },
    });

    revalidatePath("/company/saved");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan supplier" };
  }
}

export async function removeSavedSupplierAction(umkmId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await db.savedSupplier.delete({
      where: { userId_umkmId: { userId: session.user.id, umkmId } },
    });

    revalidatePath("/company/saved");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus dari tersimpan" };
  }
}
