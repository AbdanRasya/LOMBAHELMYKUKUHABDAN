import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { Order } from '@prisma/client';

type SessionUserWithRole = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const sessionUser = session.user as SessionUserWithRole;
  const rawRole = sessionUser.role || '';
  const role = String(rawRole).toUpperCase();

  try {
    const [companyProfile, umkmProfile] = await Promise.all([
      db.companyProfile.findUnique({ where: { userId } }),
      db.umkmProfile.findUnique({ where: { userId } }),
    ]);

    let ordersList: Order[] = [];

    if (role === 'COMPANY' || companyProfile) {
      const companyId = companyProfile?.id;
      if (companyId) {
        ordersList = await db.order.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
        });
      }
    } else if (role === 'UMKM' || umkmProfile) {
      const umkmId = umkmProfile?.id;
      if (umkmId) {
        ordersList = await db.order.findMany({
          where: { umkmId },
          orderBy: { createdAt: 'desc' },
        });
      }
    }

    const rfqIds = [...new Set(ordersList.map(o => o.rfqId))];
    const companyIds = [...new Set(ordersList.map(o => o.companyId))];
    const umkmIds = [...new Set(ordersList.map(o => o.umkmId))];

    const [rfqs, companies, umkms] = await Promise.all([
      db.rFQ.findMany({ where: { id: { in: rfqIds } }, select: { id: true, title: true } }),
      db.companyProfile.findMany({ where: { id: { in: companyIds } }, select: { id: true, companyName: true } }),
      db.umkmProfile.findMany({ where: { id: { in: umkmIds } }, select: { id: true, businessName: true } }),
    ]);

    const rfqMap = new Map(rfqs.map(r => [r.id, r]));
    const companyMap = new Map(companies.map(c => [c.id, c]));
    const umkmMap = new Map(umkms.map(u => [u.id, u]));

    const enriched = ordersList.map(o => ({
      ...o,
      rfq: rfqMap.get(o.rfqId) || null,
      company: companyMap.get(o.companyId) || null,
      umkm: umkmMap.get(o.umkmId) || null,
    }));

    return NextResponse.json({ orders: enriched });
  } catch (e) {
    console.error('[api/orders GET] DB error:', e);
    return NextResponse.json(
      {
        orders: [],
        error: 'Gagal mengambil orders. Detail: ' + (e instanceof Error ? e.message : String(e)),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { quotationId } = body;
    if (!quotationId) return NextResponse.json({ error: 'quotationId wajib diisi' }, { status: 400 });

    const quotation = await db.quotation.findUnique({
      where: { id: quotationId },
      include: {
        rfq: { include: { companyProfile: { select: { userId: true, companyName: true, id: true } } } },
        umkmProfile: { select: { userId: true, businessName: true, id: true } },
      },
    });
    if (!quotation) return NextResponse.json({ error: 'Quotation tidak ditemukan' }, { status: 404 });

    if (quotation.rfq.companyProfile?.userId !== userId) {
      return NextResponse.json(
        { error: 'Hanya pemilik RFQ yang dapat menerima penawaran dan membuat pesanan' },
        { status: 403 },
      );
    }

    if (quotation.status !== 'ACCEPTED') {
      await db.quotation.update({
        where: { id: quotationId },
        data: { status: 'ACCEPTED' },
      });
    }

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

    // Notify UMKM user about new order
    if (quotation.umkmProfile?.userId) {
      await db.notification.create({
        data: {
          userId: quotation.umkmProfile.userId,
          type: 'ORDER_CREATED',
          title: 'Pesanan Baru Masuk!',
          body: `Order baru dari ${quotation.rfq.companyProfile?.companyName || 'Perusahaan'} senilai Rp ${quotation.price.toLocaleString('id-ID')}`,
          link: `/umkm/orders`,
        },
      }).catch(() => {});
    }

    // Notify Company user
    if (quotation.rfq.companyProfile?.userId) {
      await db.notification.create({
        data: {
          userId: quotation.rfq.companyProfile.userId,
          type: 'ORDER_CREATED',
          title: 'Pesanan Diterbitkan!',
          body: `Pesanan baru untuk "${quotation.rfq.title}" senilai Rp ${quotation.price.toLocaleString('id-ID')} telah diterbitkan.`,
          link: `/company/orders`,
        },
      }).catch(() => {});
    }

    return NextResponse.json({ order });
  } catch (e) {
    console.error('[api/orders POST] DB error:', e);
    return NextResponse.json(
      { error: 'Gagal membuat pesanan. Detail: ' + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}
