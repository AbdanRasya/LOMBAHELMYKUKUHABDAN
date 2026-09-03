import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const role = (session.user as any).role;

  try {
    let orders;
    if (role === 'COMPANY') {
      const company = await db.companyProfile.findUnique({ where: { userId: session.user.id } });
      if (!company) return NextResponse.json({ orders: [], demo: true });
      orders = await db.order.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: 'desc' },
      });
    } else if (role === 'UMKM') {
      const umkm = await db.umkmProfile.findUnique({ where: { userId: session.user.id } });
      if (!umkm) return NextResponse.json({ orders: [], demo: true });
      orders = await db.order.findMany({
        where: { umkmId: umkm.id },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    }
    return NextResponse.json({ orders });
  } catch (e) {
    console.error('[api/orders GET] DB error:', e);
    return NextResponse.json(
      {
        orders: [],
        demo: true,
        error: 'Gagal mengambil orders. Detail: ' + (e instanceof Error ? e.message : String(e)),
      },
      { status: 200 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { quotationId } = body;
    if (!quotationId) return NextResponse.json({ error: 'quotationId wajib diisi' }, { status: 400 });

    const quotation = await db.quotation.findUnique({
      where: { id: quotationId },
      include: { rfq: { include: { companyProfile: true } } },
    });
    if (!quotation) return NextResponse.json({ error: 'Quotation tidak ditemukan' }, { status: 404 });
    if (quotation.status !== 'ACCEPTED')
      return NextResponse.json({ error: 'Quotation harus diterima terlebih dahulu (status ACCEPTED)' }, { status: 400 });

    const existing = await db.order.findUnique({ where: { quotationId } });
    if (existing) return NextResponse.json({ order: existing });

    const order = await db.order.create({
      data: {
        quotationId,
        rfqId: quotation.rfqId,
        companyId: quotation.rfq.companyId,
        umkmId: quotation.umkmId,
        totalAmount: quotation.price,
        status: 'PENDING_PAYMENT',
      },
    });

    const umkmUser = await db.umkmProfile.findUnique({ where: { id: quotation.umkmId }, select: { userId: true } });
    if (umkmUser) {
      await db.notification.create({
        data: {
          userId: umkmUser.userId,
          type: 'ORDER_CREATED',
          title: 'Pesanan Baru Masuk!',
          body: `Order baru dari ${quotation.rfq.companyProfile.companyName} senilai Rp ${quotation.price.toLocaleString('id-ID')}`,
          link: `/umkm/orders`,
        },
      });
    }

    return NextResponse.json({ order });
  } catch (e) {
    console.error('[api/orders POST] DB error:', e);
    return NextResponse.json(
      {
        error: 'Gagal membuat order. Cek koneksi database. Detail: ' +
          (e instanceof Error ? e.message : String(e)),
      },
      { status: 500 },
    );
  }
}
