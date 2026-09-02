import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const rfq = await db.rFQ.findUnique({
      where: { id },
      include: {
        category: true,
        companyProfile: true,
        quotations: {
          include: { umkmProfile: { include: { trustScore: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { quotations: true } },
      },
    });
    if (!rfq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ rfq });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await db.rFQ.update({ where: { id }, data: { deletedAt: new Date(), status: "CANCELLED" } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
