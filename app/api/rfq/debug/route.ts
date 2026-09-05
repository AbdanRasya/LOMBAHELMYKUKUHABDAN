import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Debug endpoint — GET /api/rfq/debug
 * Returns session + company profile info to diagnose auth issues
 * REMOVE IN PRODUCTION
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        ok: false,
        error: "No session — user not logged in",
        session: null,
      });
    }

    const company = await db.companyProfile.findUnique({
      where: { userId: session.user.id },
    });

    const umkmCount = await db.umkmProfile.count();
    const rfqCount = await db.rFQ.count();

    return NextResponse.json({
      ok: true,
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as { role?: string }).role,
      },
      companyProfile: company
        ? { id: company.id, name: company.companyName }
        : null,
      dbStats: {
        umkmProfiles: umkmCount,
        rfqs: rfqCount,
      },
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: String(error),
    });
  }
}
