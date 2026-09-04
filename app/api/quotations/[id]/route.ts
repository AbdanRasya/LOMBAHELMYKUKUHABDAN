import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  try {
    const quotation = await db.quotation.findUnique({
      where: { id },
      include: {
        umkmProfile: { select: { businessName: true, id: true, userId: true, logo: true, province: true } },
        rfq: {
          include: {
            companyProfile: { select: { id: true, companyName: true, userId: true, logo: true, province: true } },
            category: true,
          },
        },
      },
    });
    if (!quotation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isUmkmOwner = quotation.umkmProfile?.userId === userId;
    const isCompanyOwner = quotation.rfq?.companyProfile?.userId === userId;
    if (!isUmkmOwner && !isCompanyOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ quotation });
  } catch (e) {
    console.error("[api/quotations/[id] GET] DB error:", e);
    return NextResponse.json(
      { error: "Gagal mengambil quotation. Detail: " + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { status, notes } = body as { status?: string; notes?: string };

    const existing = await db.quotation.findUnique({
      where: { id },
      include: {
        umkmProfile: { select: { userId: true, businessName: true, id: true } },
        rfq: {
          include: {
            companyProfile: { select: { userId: true, companyName: true, id: true } },
          },
        },
      },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isCompanyOwner = existing.rfq?.companyProfile?.userId === userId;
    const isUmkmOwner = existing.umkmProfile?.userId === userId;
    if (!isCompanyOwner && !isUmkmOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (status) {
      if (!isCompanyOwner) {
        return NextResponse.json(
          { error: "Hanya pemilik RFQ (perusahaan) yang dapat menerima/menolak penawaran" },
          { status: 403 },
        );
      }
      if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
        return NextResponse.json({ error: "Status quotation tidak valid" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const quotation = await db.quotation.update({
      where: { id },
      data: updateData,
      include: {
        umkmProfile: { select: { userId: true, businessName: true } },
        rfq: { include: { companyProfile: { select: { userId: true, companyName: true } } } },
      },
    });

    if (status === "ACCEPTED") {
      await db.notification
        .create({
          data: {
            userId: quotation.umkmProfile.userId,
            type: "QUOTATION_ACCEPTED",
            title: "Penawaran Anda Diterima!",
            body: `${quotation.rfq.companyProfile.companyName || 'Perusahaan'} menerima penawaran Anda untuk RFQ "${quotation.rfq.title}"`,
            link: `/umkm/quotations`,
          },
        })
        .catch(() => {});

      const existingOrder = await db.order.findUnique({ where: { quotationId: id } });
      if (!existingOrder) {
        await db.order.create({
          data: {
            quotationId: id,
            rfqId: quotation.rfqId,
            companyId: (quotation.rfq as { companyId?: string }).companyId || existing.rfq?.companyId || '',
            umkmId: quotation.umkmId,
            totalAmount: quotation.price,
            status: "PENDING_PAYMENT",
          },
        });
        await db.notification
          .create({
            data: {
              userId: quotation.umkmProfile.userId,
              type: "ORDER_CREATED",
              title: "Pesanan Baru!",
              body: `Order baru dibuat dari penawaran Anda untuk "${quotation.rfq.title}"`,
              link: `/umkm/orders`,
            },
          })
          .catch(() => {});
      }
    } else if (status === "REJECTED") {
      await db.notification
        .create({
          data: {
            userId: quotation.umkmProfile.userId,
            type: "QUOTATION_REJECTED",
            title: "Penawaran Tidak Diterima",
            body: `Penawaran Anda untuk RFQ "${quotation.rfq.title}" tidak diterima.`,
            link: `/umkm/quotations`,
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({ quotation });
  } catch (e) {
    console.error("[api/quotations/[id] PATCH] DB error:", e);
    return NextResponse.json(
      { error: "Gagal memperbarui quotation. Detail: " + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}
