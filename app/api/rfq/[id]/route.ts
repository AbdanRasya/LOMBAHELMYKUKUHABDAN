import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const rfq = await db.rFQ.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        companyProfile: {
          select: { id: true, companyName: true, logo: true, province: true, userId: true },
        },
        quotations: userId
          ? {
              where: {
                OR: [
                  { umkmProfile: { userId } },
                  { rfq: { companyProfile: { userId } } },
                ],
              },
              include: {
                umkmProfile: {
                  include: { trustScore: true },
                  select: {
                    id: true,
                    businessName: true,
                    logo: true,
                    province: true,
                    userId: true,
                    trustScore: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            }
          : false,
        _count: { select: { quotations: true } },
      },
    });
    if (!rfq) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = rfq.companyProfile?.userId === userId;
    if (!isOwner && rfq.quotations && Array.isArray(rfq.quotations)) {
      (rfq as { quotations?: unknown[] }).quotations = undefined;
    }

    return NextResponse.json({ rfq });
  } catch (e) {
    console.error("[api/rfq/[id] GET] DB error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const userId = session.user.id;

  try {
    const rfq = await db.rFQ.findUnique({
      where: { id },
      include: { companyProfile: { select: { userId: true } } },
    });
    if (!rfq) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (rfq.companyProfile?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.rFQ.update({ where: { id }, data: { deletedAt: new Date(), status: "CANCELLED" } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/rfq/[id] DELETE] DB error:", e);
    return NextResponse.json(
      { error: "Gagal menghapus RFQ. Detail: " + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}
