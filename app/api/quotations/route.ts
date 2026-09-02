import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const umkm = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
    if (!umkm) return NextResponse.json({ quotations: [] });
    const quotations = await db.quotation.findMany({
      where: { umkmId: umkm.id },
      include: { rfq: { include: { companyProfile: true, category: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ quotations });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const umkm = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
    if (!umkm) return NextResponse.json({ error: "No UMKM profile" }, { status: 400 });

    if (!body.rfqId || !body.price || isNaN(parseFloat(body.price))) {
      return NextResponse.json({ error: "Harga dan RFQ ID wajib diisi dengan benar" }, { status: 400 });
    }

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

    // Notify company
    const rfq = await db.rFQ.findUnique({ where: { id: body.rfqId }, include: { companyProfile: true } });
    if (rfq?.companyProfile?.userId) {
      await db.notification.create({
        data: {
          userId: rfq.companyProfile.userId,
          type: "NEW_QUOTATION",
          title: "Penawaran baru masuk!",
          body: `${umkm.businessName} telah mengirimkan penawaran untuk RFQ "${rfq.title}"`,
          link: `/company/rfq/${rfq.id}`,
        },
      });
    }

    return NextResponse.json({ quotation });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
