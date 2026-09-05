import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const umkm = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
    if (!umkm) return NextResponse.json({ products: [] });

    const products = await db.product.findMany({
      where: { umkmId: umkm.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[api/products GET] DB error:", error);
    return NextResponse.json({ products: [], error: "Gagal mengambil produk" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { name, description, unit, minOrder, maxCapacity, leadTimeDays, priceMin, priceMax, images, image } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Nama produk wajib diisi" }, { status: 400 });
    }

    const imageList: string[] = [];
    if (Array.isArray(images)) {
      images.forEach((img) => img && imageList.push(String(img).trim()));
    } else if (image || images) {
      imageList.push(String(image || images).trim());
    }

    // Find or create UMKM profile for current user
    let profile = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
    if (!profile) {
      profile = await db.umkmProfile.create({
        data: {
          userId: session.user.id,
          businessName: session.user.name || "Mitra UMKM",
          verificationStatus: "APPROVED",
          readinessScore: 80,
          profileCompleteness: 80,
        },
      });
    }

    const product = await db.product.create({
      data: {
        umkmId: profile.id,
        name: String(name).trim(),
        description: description ? String(description).trim() : "",
        unit: unit ? String(unit).trim() : "pcs",
        minOrder: minOrder ? parseInt(String(minOrder)) : 100,
        maxCapacity: maxCapacity ? parseInt(String(maxCapacity)) : 10000,
        leadTimeDays: leadTimeDays ? parseInt(String(leadTimeDays)) : 7,
        priceMin: priceMin ? parseFloat(String(priceMin)) : null,
        priceMax: priceMax ? parseFloat(String(priceMax)) : null,
        images: imageList,
        isActive: true,
      },
    });

    // Automatically update readiness score & completeness
    const productCount = await db.product.count({ where: { umkmId: profile.id } });
    const newCompleteness = Math.min(100, Math.max(profile.profileCompleteness, 80 + productCount * 5));
    const newReadiness = Math.min(100, Math.max(profile.readinessScore, 80 + productCount * 4));

    await db.umkmProfile.update({
      where: { id: profile.id },
      data: {
        profileCompleteness: newCompleteness,
        readinessScore: newReadiness,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[api/products POST] DB error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan produk: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
