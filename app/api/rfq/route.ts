import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const company = await db.companyProfile.findUnique({ where: { userId: session.user.id } });
    if (!company) {
      return NextResponse.json({ rfqs: [] });
    }
    const rfqs = await db.rFQ.findMany({
      where: {
        OR: [
          { companyId: company.id },
          { companyProfile: { userId: session.user.id } }
        ],
        deletedAt: null
      },
      include: {
        category: true,
        targetUmkm: { select: { id: true, businessName: true } },
        _count: { select: { quotations: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ rfqs });
  } catch (error) {
    console.error("[api/rfq GET] DB error:", error);
    return NextResponse.json(
      { rfqs: [], error: "Gagal mengambil daftar RFQ" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    let company = await db.companyProfile.findUnique({ where: { userId: session.user.id } });

    // Auto-create company profile if missing for current user
    if (!company) {
      company = await db.companyProfile.create({
        data: {
          userId: session.user.id,
          companyName: session.user.name || "Perusahaan Buyer",
        },
      });
    }

    if (!body.title || !String(body.title).trim()) {
      return NextResponse.json({ error: "Judul RFQ wajib diisi" }, { status: 400 });
    }

    const rawTargetUmkmId = body.targetUmkmId ? String(body.targetUmkmId).trim() : null;
    let validTargetUmkmId: string | null = null;
    let targetUmkmRecord: { id: string; userId: string; businessName: string } | null = null;

    if (rawTargetUmkmId) {
      // Find UMKM profile by id or userId
      const foundUmkm = await db.umkmProfile.findFirst({
        where: {
          OR: [
            { id: rawTargetUmkmId },
            { userId: rawTargetUmkmId }
          ]
        },
        select: { id: true, userId: true, businessName: true },
      });

      if (foundUmkm) {
        validTargetUmkmId = foundUmkm.id;
        targetUmkmRecord = foundUmkm;
      } else {
        // Fallback: if not found by exact CUID, check if any UMKM profile exists to link, or log
        console.warn(`[api/rfq POST] targetUmkmId "${rawTargetUmkmId}" not found in DB umkm_profiles.`);
      }
    }

    const rfq = await db.rFQ.create({
      data: {
        companyId: company.id,
        targetUmkmId: validTargetUmkmId,
        title: body.title,
        description: body.description || "",
        quantity: body.quantity ? parseInt(body.quantity) : null,
        unit: body.unit || null,
        budgetMin: body.budgetMin ? parseFloat(body.budgetMin) : null,
        budgetMax: body.budgetMax ? parseFloat(body.budgetMax) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        specifications: body.specifications || null,
        status: "OPEN",
      },
    });

    // If valid targeted UMKM, create an instant notification for that UMKM user
    // Wrapped in its own try-catch so notification failure doesn't kill the whole request
    if (targetUmkmRecord?.userId) {
      try {
        await db.notification.create({
          data: {
            userId: targetUmkmRecord.userId,
            type: "DIRECT_RFQ",
            title: "📩 Permintaan Penawaran Direct Baru",
            body: `${company.companyName} telah mengirimkan permintaan penawaran khusus untuk ${targetUmkmRecord.businessName}: "${rfq.title}"`,
            link: `/umkm/rfq/${rfq.id}`,
            metadata: {
              rfqId: rfq.id,
              companyId: company.id,
              companyName: company.companyName,
            },
          },
        });
        console.log(`[api/rfq POST] Notification sent to userId=${targetUmkmRecord.userId} for rfqId=${rfq.id}`);
      } catch (notifErr) {
        // Notification failure is non-fatal — RFQ was already created
        console.error("[api/rfq POST] Failed to create notification (non-fatal):", notifErr);
      }
    }

    console.log(`[api/rfq POST] RFQ created successfully: id=${rfq.id}, targetUmkmId=${validTargetUmkmId}`);
    return NextResponse.json({ success: true, rfq });
  } catch (error) {
    console.error("[api/rfq POST] DB error:", error);
    return NextResponse.json(
      { error: "Gagal membuat RFQ. Detail: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}
