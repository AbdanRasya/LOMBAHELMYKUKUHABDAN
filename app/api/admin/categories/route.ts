import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { products: true, rfqs: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const category = await db.category.create({ data: { name, slug, description } });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description } = await request.json();
    const category = await db.category.update({ where: { id }, data: { name, description } });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
