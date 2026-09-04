import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

type ValidOrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

const COMPANY_ALLOWED_STATUSES: ValidOrderStatus[] = [
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'DISPUTED',
];
const UMKM_ALLOWED_STATUSES: ValidOrderStatus[] = [
  'IN_PRODUCTION',
  'SHIPPED',
  'CANCELLED',
  'DISPUTED',
];

const STATUS_LABELS: Record<ValidOrderStatus, string> = {
  CONFIRMED: 'Pesanan dikonfirmasi',
  IN_PRODUCTION: 'Pesanan sedang diproduksi',
  SHIPPED: 'Pesanan telah dikirim',
  DELIVERED: 'Pesanan telah diterima',
  COMPLETED: 'Pesanan selesai',
  CANCELLED: 'Pesanan dibatalkan',
  DISPUTED: 'Pesanan bermasalah',
  PENDING_PAYMENT: 'Menunggu pembayaran',
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  try {
    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [companyProfile, umkmProfile] = await Promise.all([
      db.companyProfile.findUnique({
        where: { id: order.companyId },
        select: { userId: true, companyName: true },
      }),
      db.umkmProfile.findUnique({
        where: { id: order.umkmId },
        select: { userId: true, businessName: true },
      }),
    ]);

    const isCompanyOwner = companyProfile?.userId === userId;
    const isUmkmOwner = umkmProfile?.userId === userId;
    if (!isCompanyOwner && !isUmkmOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      order: {
        ...order,
        company: companyProfile ? { id: order.companyId, companyName: companyProfile.companyName } : null,
        umkm: umkmProfile ? { id: order.umkmId, businessName: umkmProfile.businessName } : null,
      },
    });
  } catch (e) {
    console.error('[api/orders/[id] GET] DB error:', e);
    return NextResponse.json(
      { error: 'Gagal mengambil pesanan. Detail: ' + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { status, trackingInfo, notes } = body as {
      status?: string;
      trackingInfo?: string;
      notes?: string;
    };

    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const [companyProfile, umkmProfile] = await Promise.all([
      db.companyProfile.findUnique({
        where: { id: existing.companyId },
        select: { userId: true, companyName: true },
      }),
      db.umkmProfile.findUnique({
        where: { id: existing.umkmId },
        select: { userId: true, businessName: true },
      }),
    ]);

    const isCompanyOwner = companyProfile?.userId === userId;
    const isUmkmOwner = umkmProfile?.userId === userId;
    if (!isCompanyOwner && !isUmkmOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let targetStatus: ValidOrderStatus | undefined;
    if (status) {
      targetStatus = status as ValidOrderStatus;

      if (isCompanyOwner && !COMPANY_ALLOWED_STATUSES.includes(targetStatus)) {
        return NextResponse.json(
          { error: `Perusahaan tidak diizinkan mengubah status menjadi ${targetStatus}` },
          { status: 403 },
        );
      }
      if (isUmkmOwner && !UMKM_ALLOWED_STATUSES.includes(targetStatus)) {
        return NextResponse.json(
          { error: `UMKM tidak diizinkan mengubah status menjadi ${targetStatus}` },
          { status: 403 },
        );
      }
    }

    const now = new Date();
    const dateFields: Record<string, Date> = {};
    if (targetStatus === 'CONFIRMED') dateFields.confirmedAt = now;
    if (targetStatus === 'SHIPPED') dateFields.shippedAt = now;
    if (targetStatus === 'DELIVERED') dateFields.deliveredAt = now;
    if (targetStatus === 'COMPLETED') dateFields.completedAt = now;
    if (targetStatus === 'PENDING_PAYMENT') dateFields.paidAt = now;

    const updateData: Record<string, unknown> = { trackingInfo, notes, ...dateFields };
    if (targetStatus) updateData.status = targetStatus;

    const order = await db.order.update({
      where: { id },
      data: updateData,
    });

    if (targetStatus && STATUS_LABELS[targetStatus]) {
      if (isCompanyOwner) {
        const umkmUserId = umkmProfile?.userId;
        if (umkmUserId) {
          await db.notification
            .create({
              data: {
                userId: umkmUserId,
                type: 'ORDER_UPDATE',
                title: `Update Pesanan: ${STATUS_LABELS[targetStatus]}`,
                body: `Pembeli ${companyProfile?.companyName || ''} memperbarui status pesanan Anda menjadi: ${STATUS_LABELS[targetStatus]}`,
                link: `/umkm/orders`,
              },
            })
            .catch(() => {});
        }
      } else if (isUmkmOwner) {
        const companyUserId = companyProfile?.userId;
        if (companyUserId) {
          await db.notification
            .create({
              data: {
                userId: companyUserId,
                type: 'ORDER_UPDATE',
                title: `Update Pesanan: ${STATUS_LABELS[targetStatus]}`,
                body: `Supplier ${umkmProfile?.businessName || ''} memperbarui status pesanan Anda menjadi: ${STATUS_LABELS[targetStatus]}`,
                link: `/company/orders`,
              },
            })
            .catch(() => {});
        }
      }
    }

    return NextResponse.json({ order });
  } catch (e) {
    console.error('[api/orders/[id] PATCH] DB error:', e);
    return NextResponse.json(
      { error: 'Gagal memperbarui pesanan. Detail: ' + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}
