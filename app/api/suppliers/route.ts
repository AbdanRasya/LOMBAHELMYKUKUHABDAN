import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const province = searchParams.get("province") || "";
  const verified = searchParams.get("verified") === "true";

  try {
    const suppliers = await db.umkmProfile.findMany({
      where: {
        ...(verified ? { verificationStatus: "APPROVED" } : {}),
        ...(province && province !== "all" ? { province: { equals: province, mode: "insensitive" } } : {}),
        ...(search ? { businessName: { contains: search, mode: "insensitive" } } : {}),
      },
      include: {
        trustScore: true,
        categories: true,
        products: { where: { isActive: true } },
        reviews: true,
      },
      orderBy: { readinessScore: "desc" },
      take: 50,
    });

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("[api/suppliers] DB error:", error);
    return NextResponse.json(
      {
        suppliers: [],
        error: "Gagal mengambil daftar supplier dari database: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
