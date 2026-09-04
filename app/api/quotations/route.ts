import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { Quotation } from "@prisma/client";

type SessionUserWithRole = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const sessionUser = session.user as SessionUserWithRole;
  const rawRole = sessionUser.role || '';
  const role = String(rawRole).toUpperCase();

  try {
    const [umkmProfile, companyProfile] = await Promise.all([
      db.umkmProfile.findUnique({ where: { userId } }),
      db.companyProfile.findUnique({ where: { userId } }),
    ]);

    let quotations: (Quotation & Record<string, unknown>)[] = [];

    if (role === "COMPANY" || companyProfile) {
      const companyId = companyProfile?.id;
      quotations = await db.quotation.findMany({
        where: companyId
          ? { OR: [{ rfq: { companyId } }, { rfq: { companyProfile: { userId } } }] }
          : { rfq: { companyProfile: { userId } } },
        include: {
          umkmProfile: { select: { id: true, businessName: true, logo: true, province: true, trustScore: true } },
          rfq: { include: { companyProfile: true, category: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      const umkmId = umkmProfile?.id;
      quotations = await db.quotation.findMany({
        where: umkmId
          ? { OR: [{ umkmId }, { umkmProfile: { userId } }] }
          : { umkmProfile: { userId } },
        include: {
          umkmProfile: { select: { id: true, businessName: true, logo: true, province: true, trustScore: true } },
          rfq: { include: { companyProfile: true, category: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ quotations });
  } catch (error) {
    console.error("[api/quotations GET] DB error:", error);
    return NextResponse.json(
      { quotations: [], error: "Gagal mengambil quotations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    let umkm = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
    
    // Auto-create UMKM profile if missing
    if (!umkm) {
      umkm = await db.umkmProfile.create({
        data: {
          userId: session.user.id,
          businessName: session.user.name || "Mitra UMKM",
        },
      });
    }

    if (!body.rfqId) return NextResponse.json({ error: "rfqId wajib diisi" }, { status: 400 });
    if (!body.price || isNaN(parseFloat(body.price)))
      return NextResponse.json({ error: "Harga penawaran wajib diisi angka yang valid" }, { status: 400 });

    const quotation = await db.quotation.create({
      data: {
        rfqId: body.rfqId,
        umkmId: umkm.id,
        price: parseFloat(body.price),
        leadTimeDays: body.leadTimeDays ? parseInt(body.leadTimeDays) : null,
        notes: body.notes || null,
        status: "PENDING",
      },
    });

    const rfq = await db.rFQ.findUnique({ where: { id: body.rfqId }, include: { companyProfile: true } });
    if (rfq?.companyProfile?.userId) {
      await db.notification.create({
        data: {
          userId: rfq.companyProfile.userId,
          type: "QUOTATION_RECEIVED",
          title: "Penawaran Baru Diterima! 🎉",
          body: `UMKM ${umkm.businessName} telah mengirim penawaran senilai Rp ${parseFloat(body.price).toLocaleString('id-ID')} untuk RFQ "${rfq.title}"`,
          link: `/company/rfq/${rfq.id}`,
        },
      });
    }

    return NextResponse.json({ quotation });
  } catch (error) {
    console.error("[api/quotations POST] DB error:", error);
    return NextResponse.json(
      { error: "Gagal membuat quotation. Detail: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}
