import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const role = (session.user as any).role;

  try {
    let conversations;
    if (role === 'COMPANY') {
      conversations = await db.conversation.findMany({
        where: { companyUserId: userId },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { lastMessageAt: 'desc' },
      });
      const enriched = await Promise.all(
        conversations.map(async (c) => {
          const umkm = await db.umkmProfile.findUnique({
            where: { userId: c.umkmUserId },
            select: { businessName: true, logo: true, id: true },
          });
          return { ...c, otherUser: umkm };
        }),
      );
      return NextResponse.json({ conversations: enriched });
    } else {
      conversations = await db.conversation.findMany({
        where: { umkmUserId: userId },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { lastMessageAt: 'desc' },
      });
      const enriched = await Promise.all(
        conversations.map(async (c) => {
          const company = await db.companyProfile.findUnique({
            where: { userId: c.companyUserId },
            select: { companyName: true, logo: true, id: true },
          });
          return { ...c, otherUser: company };
        }),
      );
      return NextResponse.json({ conversations: enriched });
    }
  } catch (e) {
    console.error('[api/conversations GET] DB error:', e);
    return NextResponse.json(
      {
        conversations: [],
        demo: true,
        error: 'Gagal mengambil percakapan. Detail: ' + (e instanceof Error ? e.message : String(e)),
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
    const { otherUserId, rfqId } = body;
    if (!otherUserId) return NextResponse.json({ error: 'otherUserId wajib diisi' }, { status: 400 });
    const role = (session.user as any).role;

    let companyUserId: string;
    let umkmUserId: string;

    if (role === 'COMPANY') {
      companyUserId = session.user.id;
      umkmUserId = otherUserId;
    } else {
      umkmUserId = session.user.id;
      companyUserId = otherUserId;
    }

    const conversation = await db.conversation.upsert({
      where: { companyUserId_umkmUserId: { companyUserId, umkmUserId } },
      create: { companyUserId, umkmUserId, rfqId },
      update: {},
    });

    return NextResponse.json({ conversation });
  } catch (e) {
    console.error('[api/conversations POST] DB error:', e);
    return NextResponse.json(
      {
        error: 'Gagal membuat/mengambil percakapan. Detail: ' +
          (e instanceof Error ? e.message : String(e)),
      },
      { status: 500 },
    );
  }
}
