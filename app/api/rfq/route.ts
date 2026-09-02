import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const company = await db.companyProfile.findUnique({ where: { userId: session.user.id } });
    if (!company) return NextResponse.json({ rfqs: [] });
    const rfqs = await db.rFQ.findMany({
      where: { companyId: company.id, deletedAt: null },
      include: { category: true, _count: { select: { quotations: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ rfqs });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const company = await db.companyProfile.findUnique({ where: { userId: session.user.id } });
    if (!company) return NextResponse.json({ error: "No company profile" }, { status: 400 });
    if (!body.title || !String(body.title).trim()) {
      return NextResponse.json({ error: "Judul RFQ wajib diisi" }, { status: 400 });
    }
    const rfq = await db.rFQ.create({
      data: {
        companyId: company.id,
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
    return NextResponse.json({ rfq });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
