import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  try {
    const notifications = await db.notification.findMany({
      where: { userId },
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
  const userId = session.user.id;
  try {
    const body = await request.json();
    if (body.markAllRead) {
      await db.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
      return NextResponse.json({ success: true });
    } else if (body.id) {
      const notifId = String(body.id);
      const notif = await db.notification.findUnique({ where: { id: notifId } });
      if (!notif) return NextResponse.json({ error: "Notifikasi tidak ditemukan" }, { status: 404 });
      if (notif.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      await db.notification.update({ where: { id: notifId }, data: { read: true } });
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
