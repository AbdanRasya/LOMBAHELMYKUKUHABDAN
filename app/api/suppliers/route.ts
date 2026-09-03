import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEMO_UMKM_EXPORTED } from "@/lib/ai";

function toDemoSuppliers(search: string, province: string, verified: boolean) {
  const keyword = search.trim().toLowerCase();
  const prov = province.trim().toLowerCase();
  let list = DEMO_UMKM_EXPORTED.map((u: any) => ({
    id: u.umkm_id,
    userId: null,
    businessName: u.nama_umkm,
    logo: null,
    description: u.deskripsi_singkat,
    province: u.provinsi,
    city: u.kota,
    address: null,
    phone: null,
    website: null,
    employeeCount: u.jumlah_karyawan,
    capacity: u.kapasitas_produksi_bulanan,
    capacityUnit: u.satuan_produksi,
    readinessScore: null,
    verificationStatus: verified ? "APPROVED" : "PENDING",
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
    trustScore: {
      overall: Math.round((u.rating_rata_1_5 / 5) * 100),
      deliveryScore: u.on_time_delivery_rate_persen,
      qualityScore: Math.round(u.rating_rata_1_5 * 20),
    },
    categories: [{ id: "cat-" + u.umkm_id, name: u.kategori_utama }],
    products: [
      {
        id: "p-" + u.umkm_id + "-1",
        umkmId: u.umkm_id,
        name: u.sub_kategori,
        price: u.harga_satuan_estimasi_idr,
        isActive: true,
      },
    ],
  }));
  if (keyword) list = list.filter((s: any) => s.businessName.toLowerCase().includes(keyword));
  if (prov) list = list.filter((s: any) => s.province.toLowerCase() === prov);
  return list;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const province = searchParams.get("province") || "";
  const verified = searchParams.get("verified") === "true";
  const includeDemo = searchParams.get("demo") !== "false";

  try {
    const suppliers = await db.umkmProfile.findMany({
      where: {
        ...(verified ? { verificationStatus: "APPROVED" } : {}),
        ...(province ? { province: { equals: province, mode: "insensitive" } } : {}),
        ...(search ? { businessName: { contains: search, mode: "insensitive" } } : {}),
      },
      include: {
        trustScore: true,
        categories: true,
        products: { take: 3, where: { isActive: true } },
      },
      orderBy: { readinessScore: "desc" },
      take: 50,
    });

    if (suppliers.length === 0 && includeDemo) {
      return NextResponse.json({ suppliers: toDemoSuppliers(search, province, verified), demo: true });
    }

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("[api/suppliers] DB error:", error);
    if (includeDemo) {
      return NextResponse.json({
        suppliers: toDemoSuppliers(search, province, verified),
        demo: true,
        error:
          "Gagal terhubung ke database — pastikan DATABASE_URL Neon sudah dikonfigurasi di .env dan jalankan `npx prisma migrate dev` atau `npm run db:seed`. Sementara ini menggunakan data DEMO.",
      }, { status: 200 });
    }
    return NextResponse.json(
      {
        error: "Gagal mengambil daftar supplier. " +
          "Cek DATABASE_URL di .env atau jalankan migrate/seed. Detail: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
