import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { DEMO_QUOTATIONS_EXPORTED, DEMO_UMKM_EXPORTED, DEMO_RFQ_EXPORTED } from "@/lib/ai";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const umkm = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
    if (!umkm) {
      return NextResponse.json({
        quotations: DEMO_QUOTATIONS_EXPORTED.map((q: any) => {
          const rfq = (DEMO_RFQ_EXPORTED as any[]).find((r) => r.rfq_id === q.rfq_id);
          return {
            id: q.quotation_id,
            rfqId: q.rfq_id,
            umkmId: q.umkm_id,
            price: q.total_harga_idr,
            leadTimeDays: q.lead_time_ditawarkan_hari,
            notes: null,
            status: q.status_penawaran,
            createdAt: null,
            rfq: {
              id: q.rfq_id,
              title: rfq ? `RFQ ${rfq.kategori_dibutuhkan}` : q.rfq_id,
              companyProfile: rfq
                ? { id: "demo-company", companyName: rfq.nama_perusahaan }
                : { id: "demo-company", companyName: "Perusahaan Demo" },
              category: rfq ? { id: "cat", name: rfq.kategori_dibutuhkan } : null,
            },
          };
        }),
        demo: true,
      });
    }
    const quotations = await db.quotation.findMany({
      where: { umkmId: umkm.id },
      include: { rfq: { include: { companyProfile: true, category: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ quotations });
  } catch (error) {
    console.error("[api/quotations GET] DB error:", error);
    return NextResponse.json(
      {
        quotations: (DEMO_QUOTATIONS_EXPORTED as any[]).slice(0, 5).map((q: any) => ({
          id: q.quotation_id,
          rfqId: q.rfq_id,
          umkmId: q.umkm_id,
          price: q.total_harga_idr,
          leadTimeDays: q.lead_time_ditawarkan_hari,
          status: q.status_penawaran,
        })),
        demo: true,
        error: "Gagal mengambil quotations. Detail: " + (error instanceof Error ? error.message : String(error)),
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
    const umkm = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
    if (!umkm) return NextResponse.json({ error: "Profil UMKM belum dibuat" }, { status: 400 });

    if (!body.rfqId) return NextResponse.json({ error: "rfqId wajib diisi" }, { status: 400 });
    if (!body.price || isNaN(parseFloat(body.price)))
      return NextResponse.json({ error: "Harga penawaran wajib diisi angka yang valid" }, { status: 400 });

    const quotation = await db.quotation.create({
      data: {
        rfqId: body.rfqId,
        umkmId: umkm.id,
        price: parseFloat(body.price),
        leadTimeDays: body.leadTimeDays ? parseInt(body.leadTimeDays) : null,
        notes: body.notes || null,
        status: "PENDING",
      },
    });

    const rfq = await db.rFQ.findUnique({ where: { id: body.rfqId }, include: { companyProfile: true } });
    if (rfq?.companyProfile?.userId) {
      await db.notification.create({
        data: {
          userId: rfq.companyProfile.userId,
          type: "NEW_QUOTATION",
          title: "Penawaran baru masuk!",
          body: `${umkm.businessName} telah mengirimkan penawaran untuk RFQ "${rfq.title}"`,
          link: `/company/rfq/${rfq.id}`,
        },
      });
    }

    return NextResponse.json({ quotation });
  } catch (error) {
    console.error("[api/quotations POST] DB error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengirimkan penawaran. Cek koneksi database. Detail: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
