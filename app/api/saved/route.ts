import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    // SavedSupplier has no Prisma relation to umkmProfile, so we join manually
    const savedList = await db.savedSupplier.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const umkmIds = savedList.map((s) => s.umkmId);
    const profiles = umkmIds.length > 0
      ? await db.umkmProfile.findMany({
          where: { id: { in: umkmIds } },
          include: { trustScore: true, categories: true },
        })
      : [];

    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    const saved = savedList.map((s) => ({
      ...s,
      umkmProfile: profileMap.get(s.umkmId) || null,
    }));

    return NextResponse.json({ saved });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { umkmId } = await request.json();
    const existing = await db.savedSupplier.findUnique({
      where: { userId_umkmId: { userId: session.user.id, umkmId } },
    });
    if (existing) {
      await db.savedSupplier.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await db.savedSupplier.create({ data: { userId: session.user.id, umkmId } });
      return NextResponse.json({ saved: true });
    }
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
