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
      include: { category: true, _count: { select: { quotations: true } } },
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

    // Auto-create company profile if missing
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
  } catch (error) {
    console.error("[api/rfq POST] DB error:", error);
    return NextResponse.json(
      { error: "Gagal membuat RFQ. Detail: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    );
  }
}
