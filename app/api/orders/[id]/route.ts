import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { status, trackingInfo, notes } = body;
    
    const now = new Date();
    const dateFields: Record<string, Date> = {};
    if (status === 'CONFIRMED') dateFields.confirmedAt = now;
    if (status === 'SHIPPED') dateFields.shippedAt = now;
    if (status === 'DELIVERED') dateFields.deliveredAt = now;
    if (status === 'COMPLETED') dateFields.completedAt = now;
    if (status === 'PENDING_PAYMENT') dateFields.paidAt = now; // simulate payment
    
    const order = await db.order.update({
      where: { id },
      data: { status, trackingInfo, notes, ...dateFields }
    });
    
    // Create notification for the other party
    const statusLabels: Record<string, string> = {
      CONFIRMED: 'Pesanan dikonfirmasi',
      IN_PRODUCTION: 'Pesanan sedang diproduksi',
      SHIPPED: 'Pesanan telah dikirim',
      DELIVERED: 'Pesanan telah diterima',
      COMPLETED: 'Pesanan selesai',
      CANCELLED: 'Pesanan dibatalkan',
    };
    
    // Create notification for the correct party
    if (statusLabels[status]) {
      if (['IN_PRODUCTION', 'SHIPPED'].includes(status)) {
        // UMKM updated status -> notify company
        const company = await db.companyProfile.findUnique({ where: { id: order.companyId }, select: { userId: true } });
        if (company) {
          await db.notification.create({
            data: {
              userId: company.userId,
              type: 'ORDER_UPDATE',
              title: `Update Pesanan: ${statusLabels[status]}`,
              body: `Status pesanan Anda telah diperbarui: ${statusLabels[status]}`,
              link: `/company/orders`,
            }
          });
        }
      } else {
        // Company updated status -> notify UMKM
        const umkm = await db.umkmProfile.findUnique({ where: { id: order.umkmId }, select: { userId: true } });
        if (umkm) {
          await db.notification.create({
            data: {
              userId: umkm.userId,
              type: 'ORDER_UPDATE',
              title: `Update Pesanan: ${statusLabels[status]}`,
              body: `Status pesanan Anda telah diperbarui: ${statusLabels[status]}`,
              link: `/umkm/orders`,
            }
          });
        }
      }
    }
    
    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
