import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as { role?: string; name?: string | null } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { status } = await request.json();
    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const cert = await db.certification.update({
      where: { id },
      data: {
        status,
        verifiedAt: status === "VERIFIED" ? new Date() : null,
        verifiedBy: user?.name || "Admin",
      },
      include: { umkmProfile: true },
    });

    // Notify user
    await db.notification.create({
      data: {
        userId: cert.umkmProfile.userId,
        type: "VERIFICATION_UPDATE",
        title: status === "VERIFIED" ? "Sertifikasi Anda Terverifikasi!" : "Sertifikasi Ditolak",
        body: status === "VERIFIED"
          ? `Sertifikat "${cert.name}" Anda telah disetujui dan diverifikasi.`
          : `Pengajuan sertifikat "${cert.name}" ditolak oleh admin.`,
        link: "/umkm/certifications",
      },
    });

    return NextResponse.json({ cert });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
