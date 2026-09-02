import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const quotation = await db.quotation.findUnique({
      where: { id },
      include: {
        umkmProfile: { select: { businessName: true, id: true, userId: true } },
        rfq: { include: { companyProfile: true, category: true } },
      },
    });
    if (!quotation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ quotation });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const { status, notes } = body;

    const quotation = await db.quotation.update({
      where: { id },
      data: { status, ...(notes !== undefined ? { notes } : {}) },
      include: {
        umkmProfile: { select: { userId: true, businessName: true } },
        rfq: { include: { companyProfile: { select: { userId: true, companyName: true } } } },
      },
    });

    // Send notification on status change
    if (status === "ACCEPTED") {
      // Notify UMKM
      await db.notification.create({
        data: {
          userId: quotation.umkmProfile.userId,
          type: "QUOTATION_ACCEPTED",
          title: "Penawaran Anda Diterima! 🎉",
          body: `${quotation.rfq.companyProfile.companyName} menerima penawaran Anda untuk RFQ "${quotation.rfq.title}"`,
          link: `/umkm/quotations`,
        },
      });
      // Auto-create order
      const existingOrder = await db.order.findUnique({ where: { quotationId: id } });
      if (!existingOrder) {
        await db.order.create({
          data: {
            quotationId: id,
            rfqId: quotation.rfqId,
            companyId: quotation.rfq.companyId,
            umkmId: quotation.umkmId,
            totalAmount: quotation.price,
            status: "PENDING_PAYMENT",
          },
        });
        // Notify UMKM about order
        await db.notification.create({
          data: {
            userId: quotation.umkmProfile.userId,
            type: "ORDER_CREATED",
            title: "Pesanan Baru!",
            body: `Order baru dibuat dari penawaran Anda untuk "${quotation.rfq.title}"`,
            link: `/umkm/orders`,
          },
        });
      }
    } else if (status === "REJECTED") {
      await db.notification.create({
        data: {
          userId: quotation.umkmProfile.userId,
          type: "QUOTATION_REJECTED",
          title: "Penawaran Tidak Diterima",
          body: `Penawaran Anda untuk RFQ "${quotation.rfq.title}" tidak diterima.`,
          link: `/umkm/quotations`,
        },
      });
    }

    return NextResponse.json({ quotation });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
