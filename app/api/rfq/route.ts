import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { DEMO_RFQ_EXPORTED } from "@/lib/ai";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const company = await db.companyProfile.findUnique({ where: { userId: session.user.id } });
    if (!company) {
      return NextResponse.json({
        rfqs: DEMO_RFQ_EXPORTED.map((r: any) => ({
          id: r.rfq_id,
          companyId: "demo-company",
          title: `RFQ ${r.kategori_dibutuhkan} - ${r.nama_perusahaan}`,
          description: `${r.kuantitas} ${r.satuan} ${r.sub_kategori_dibutuhkan} di ${r.provinsi_lokasi_diinginkan}`,
          quantity: r.kuantitas,
          unit: r.satuan,
          budgetMin: null,
          budgetMax: null,
          deadline: null,
          specifications: null,
          status: "OPEN",
          category: { id: "cat-demo", name: r.kategori_dibutuhkan },
          _count: { quotations: 0 },
          createdAt: new Date(r.tanggal_dibuat),
          deletedAt: null,
        })),
        demo: true,
      });
    }
    const rfqs = await db.rFQ.findMany({
      where: { companyId: company.id, deletedAt: null },
      include: { category: true, _count: { select: { quotations: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ rfqs });
  } catch (error) {
    console.error("[api/rfq GET] DB error:", error);
    return NextResponse.json(
      {
        rfqs: DEMO_RFQ_EXPORTED.map((r: any) => ({
          id: r.rfq_id,
          companyId: "demo-company",
          title: `RFQ ${r.kategori_dibutuhkan} - ${r.nama_perusahaan}`,
          description: `${r.kuantitas} ${r.satuan} ${r.sub_kategori_dibutuhkan} di ${r.provinsi_lokasi_diinginkan}`,
          quantity: r.kuantitas,
          unit: r.satuan,
          status: "OPEN",
          category: { id: "cat-demo", name: r.kategori_dibutuhkan },
          _count: { quotations: 0 },
          createdAt: new Date(r.tanggal_dibuat),
        })),
        demo: true,
        error: "DB gagal — detail: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 200 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const company = await db.companyProfile.findUnique({ where: { userId: session.user.id } });
    if (!company) return NextResponse.json({ error: "Profil perusahaan belum dibuat" }, { status: 400 });
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
      {
        error:
          "Gagal membuat RFQ. Cek koneksi database/DATABASE_URL. " +
          "Detail: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
