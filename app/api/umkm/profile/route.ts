import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { DEMO_UMKM_EXPORTED } from "@/lib/ai";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const profile = await db.umkmProfile.findUnique({
      where: { userId: session.user.id },
      include: { categories: true, trustScore: true },
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[api/umkm/profile GET] DB error:", error);
    const firstDemo = (DEMO_UMKM_EXPORTED as any[])[0];
    return NextResponse.json(
      {
        profile: firstDemo
          ? {
              id: firstDemo.umkm_id,
              userId: session.user.id,
              businessName: firstDemo.nama_umkm,
              province: firstDemo.provinsi,
              city: firstDemo.kota,
              description: firstDemo.deskripsi_singkat,
              employeeCount: firstDemo.jumlah_karyawan,
              categories: [{ id: "cat-demo", name: firstDemo.kategori_utama }],
              trustScore: {
                overall: Math.round((firstDemo.rating_rata_1_5 / 5) * 100),
                deliveryScore: firstDemo.on_time_delivery_rate_persen,
                qualityScore: Math.round(firstDemo.rating_rata_1_5 * 20),
              },
            }
          : null,
        demo: true,
        error: "Gagal mengambil profil UMKM. Detail: " + (error instanceof Error ? error.message : String(error)),
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
    const { categories, ...data } = body;
    if (categories && !Array.isArray(categories)) {
      return NextResponse.json({ error: "Format categories harus berupa array" }, { status: 400 });
    }
    const profile = await db.umkmProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, businessName: data.businessName || "My Business", ...data },
      update: data,
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[api/umkm/profile PATCH] DB error:", error);
    return NextResponse.json(
      {
        error: "Gagal menyimpan profil UMKM. Cek koneksi database. Detail: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
