import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("[api/notifications GET] DB error:", error);
    return NextResponse.json(
      {
        notifications: [],
        demo: true,
        error: "Gagal mengambil notifikasi. Detail: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 200 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (body.markAllRead) {
      await db.notification.updateMany({ where: { userId: session.user.id, read: false }, data: { read: true } });
      return NextResponse.json({ success: true });
    } else if (body.id) {
      await db.notification.update({ where: { id: body.id }, data: { read: true } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Sertakan 'id' atau 'markAllRead: true'" }, { status: 400 });
  } catch (error) {
    console.error("[api/notifications PATCH] DB error:", error);
    return NextResponse.json(
      {
        error: "Gagal menandai notifikasi dibaca. Detail: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
