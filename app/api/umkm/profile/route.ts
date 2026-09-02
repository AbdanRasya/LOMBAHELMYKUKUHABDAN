import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const profile = await db.umkmProfile.findUnique({
      where: { userId: session.user.id },
      include: { categories: true, trustScore: true },
    });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { categories, ...data } = body;
    const profile = await db.umkmProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, businessName: data.businessName || "My Business", ...data },
      update: data,
    });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
