import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        umkmProfile: { select: { id: true, businessName: true } },
        companyProfile: { select: { id: true, companyName: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    // Determine actual effective role
    let effectiveRole = user.role;
    if (user.umkmProfile && !user.companyProfile) {
      effectiveRole = "UMKM";
    } else if (user.companyProfile && !user.umkmProfile) {
      effectiveRole = "COMPANY";
    }

    return NextResponse.json({
      user: {
        ...user,
        role: effectiveRole,
      },
    });
  } catch (error) {
    console.error("[api/auth/me] Error:", error);
    return NextResponse.json({ user: null, error: String(error) }, { status: 500 });
  }
}
