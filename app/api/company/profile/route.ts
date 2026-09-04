import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await db.companyProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[api/company/profile GET] Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil profil perusahaan" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const raw = body || {};

    const scalarData: Record<string, any> = {};

    if (raw.companyName !== undefined) scalarData.companyName = String(raw.companyName);
    if (raw.industry !== undefined) scalarData.industry = String(raw.industry);
    if (raw.province !== undefined) scalarData.province = String(raw.province);
    if (raw.city !== undefined) scalarData.city = String(raw.city);
    if (raw.address !== undefined) scalarData.address = String(raw.address);
    if (raw.phone !== undefined) scalarData.phone = String(raw.phone);
    if (raw.website !== undefined) scalarData.website = String(raw.website);
    if (raw.description !== undefined) scalarData.description = String(raw.description);
    if (raw.logo !== undefined) scalarData.logo = String(raw.logo);
    if (raw.npwp !== undefined) scalarData.npwp = String(raw.npwp);

    const profile = await db.companyProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: scalarData.companyName || session.user.name || "PT Perusahaan Indonesia",
        ...scalarData,
      },
      update: scalarData,
    });

    if (scalarData.logo) {
      await db.user.update({
        where: { id: session.user.id },
        data: { image: scalarData.logo },
      }).catch(() => {});
    }

    return NextResponse.json({ profile, success: true });
  } catch (error) {
    console.error("[api/company/profile PATCH] Error:", error);
    return NextResponse.json(
      {
        error: "Gagal menyimpan profil perusahaan. Detail: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
