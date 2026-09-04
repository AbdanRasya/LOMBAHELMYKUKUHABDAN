import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const profile = await db.umkmProfile.findUnique({
      where: { userId: session.user.id },
      include: { categories: true, trustScore: true, products: true, certifications: true },
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[api/umkm/profile GET] DB error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil profil UMKM" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { category, categories, addProduct, addCert, ...raw } = body;

    // Filter ONLY valid scalar fields for UmkmProfile
    const scalarData: Record<string, any> = {};

    if (raw.businessName !== undefined) scalarData.businessName = String(raw.businessName);
    if (raw.tagline !== undefined) scalarData.tagline = String(raw.tagline);
    if (raw.description !== undefined) scalarData.description = String(raw.description);
    if (raw.province !== undefined) scalarData.province = String(raw.province);
    if (raw.city !== undefined) scalarData.city = String(raw.city);
    if (raw.address !== undefined) scalarData.address = String(raw.address);
    if (raw.phone !== undefined) scalarData.phone = String(raw.phone);
    if (raw.email !== undefined) scalarData.email = String(raw.email);
    if (raw.website !== undefined) scalarData.website = String(raw.website);
    if (raw.logo !== undefined) scalarData.logo = String(raw.logo);
    if (raw.coverImage !== undefined) scalarData.coverImage = String(raw.coverImage);
    if (raw.npwp !== undefined) scalarData.npwp = String(raw.npwp);
    if (raw.nib !== undefined) scalarData.nib = String(raw.nib);
    if (raw.siup !== undefined) scalarData.siup = String(raw.siup);

    if (raw.foundedYear !== undefined && raw.foundedYear !== null && raw.foundedYear !== "") {
      scalarData.foundedYear = Number(raw.foundedYear);
    }
    if (raw.employeeCount !== undefined && raw.employeeCount !== null && raw.employeeCount !== "") {
      scalarData.employeeCount = Number(raw.employeeCount);
    }

    // Calculate completeness score
    const keyFields = [
      scalarData.businessName, scalarData.tagline, scalarData.description,
      scalarData.province, scalarData.city, scalarData.address,
      scalarData.phone, scalarData.email, scalarData.logo,
      scalarData.foundedYear, scalarData.employeeCount, scalarData.nib
    ];
    let filledCount = 0;
    keyFields.forEach(val => {
      if (val !== undefined && val !== null && val !== "") filledCount++;
    });
    const completeness = Math.min(100, Math.max(70, Math.round((filledCount / keyFields.length) * 100)));
    scalarData.profileCompleteness = completeness;

    // Calculate readiness score
    const readiness = Math.min(100, Math.round(completeness * 0.8 + (scalarData.nib ? 15 : 0)));
    scalarData.readinessScore = readiness;

    // Upsert UmkmProfile
    const profile = await db.umkmProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        businessName: scalarData.businessName || session.user.name || "Mitra UMKM",
        ...scalarData,
      },
      update: scalarData,
    });

    // Handle addProduct if requested
    if (addProduct && addProduct.name) {
      await db.product.create({
        data: {
          umkmId: profile.id,
          name: addProduct.name,
          description: addProduct.description || "",
          unit: addProduct.unit || "pcs",
          minOrder: addProduct.minOrder ? Number(addProduct.minOrder) : 100,
          maxCapacity: addProduct.maxCapacity ? Number(addProduct.maxCapacity) : 10000,
          leadTimeDays: addProduct.leadTimeDays ? Number(addProduct.leadTimeDays) : 7,
          priceMin: addProduct.priceMin ? Number(addProduct.priceMin) : null,
          priceMax: addProduct.priceMax ? Number(addProduct.priceMax) : null,
          isActive: true,
        },
      });
    }

    // Handle addCert if requested
    if (addCert && addCert.name) {
      await db.certification.create({
        data: {
          umkmId: profile.id,
          name: addCert.name,
          issuer: addCert.issuer || "",
          number: addCert.number || "",
          expiresAt: addCert.expiresAt ? new Date(addCert.expiresAt) : null,
          status: "VERIFIED",
        },
      });
    }

    // Handle Category connection if category string passed
    if (category) {
      const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const dbCat = await db.category.upsert({
        where: { slug: catSlug },
        create: { name: category, slug: catSlug },
        update: {},
      });

      await db.umkmProfile.update({
        where: { id: profile.id },
        data: {
          categories: {
            connect: { id: dbCat.id },
          },
        },
      }).catch(() => {});
    }

    // Update user image if logo is provided
    if (scalarData.logo) {
      await db.user.update({
        where: { id: session.user.id },
        data: { image: scalarData.logo },
      }).catch(() => {});
    }

    return NextResponse.json({ profile, success: true });
  } catch (error) {
    console.error("[api/umkm/profile PATCH] DB error:", error);
    return NextResponse.json(
      {
        error: "Gagal menyimpan profil UMKM. Detail: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
