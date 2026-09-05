import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { umkmId, action } = await request.json();
    const statusMap: Record<string, "APPROVED" | "REJECTED" | "SUSPENDED"> = {
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
      SUSPEND: "SUSPENDED",
    };
    const newStatus = statusMap[action];
    if (!newStatus) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    const umkm = await db.umkmProfile.update({
      where: { id: umkmId },
      data: { verificationStatus: newStatus },
      include: { user: true },
    });

    await db.notification.create({
      data: {
        userId: umkm.userId,
        type: "VERIFICATION_UPDATE",
        title: action === "APPROVE" ? "Profil Anda telah diverifikasi!" : action === "REJECT" ? "Verifikasi ditolak" : "Akun ditangguhkan",
        body: action === "APPROVE"
          ? "Selamat! Profil bisnis Anda telah diverifikasi oleh admin PUSAKA."
          : action === "REJECT"
          ? "Maaf, verifikasi profil Anda ditolak. Hubungi admin untuk informasi lebih lanjut."
          : "Akun Anda telah ditangguhkan. Hubungi admin PUSAKA.",
        link: "/umkm/profile",
      },
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
