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
    const { ...data } = body;

    const profile = await db.companyProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: data.companyName || "PT Perusahaan Indonesia",
        ...data,
      },
      update: data,
    });

    // Also update user image if logo is provided
    if (data.logo) {
      await db.user.update({
        where: { id: session.user.id },
        data: { image: data.logo },
      }).catch(() => {});
    }

    return NextResponse.json({ profile });
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
