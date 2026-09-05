import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

type SessionUserWithRole = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const sessionUser = session.user as SessionUserWithRole;
  const role = sessionUser.role;

  try {
    let enriched = [];
    if (role === 'COMPANY') {
      const conversations = await db.conversation.findMany({
        where: { companyUserId: userId },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { lastMessageAt: 'desc' },
      });
      enriched = await Promise.all(
        conversations.map(async (c) => {
          let umkm = await db.umkmProfile.findFirst({
            where: { OR: [{ userId: c.umkmUserId }, { id: c.umkmUserId }] },
            select: { businessName: true, logo: true, id: true },
          });

          if (!umkm) {
            const u = await db.user.findUnique({
              where: { id: c.umkmUserId },
              select: { name: true, image: true, id: true, umkmProfile: { select: { businessName: true } } },
            });
            if (u) {
              umkm = { businessName: u.umkmProfile?.businessName || u.name || "Supplier UMKM", logo: u.image, id: u.id };
            }
          }

          if (!umkm) {
            const fallbackUmkm = await db.umkmProfile.findFirst({
              select: { businessName: true, logo: true, id: true },
            });
            if (fallbackUmkm) {
              umkm = fallbackUmkm;
            }
          }

          return {
            ...c,
            otherUser: umkm || { businessName: "Supplier UMKM", logo: null, id: c.umkmUserId },
          };
        }),
      );
    } else {
      const conversations = await db.conversation.findMany({
        where: { umkmUserId: userId },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { lastMessageAt: 'desc' },
      });
      enriched = await Promise.all(
        conversations.map(async (c) => {
          let company = await db.companyProfile.findFirst({
            where: { OR: [{ userId: c.companyUserId }, { id: c.companyUserId }] },
            select: { companyName: true, logo: true, id: true },
          });

          if (!company) {
            const u = await db.user.findUnique({
              where: { id: c.companyUserId },
              select: { name: true, image: true, id: true, companyProfile: { select: { companyName: true } } },
            });
            if (u) {
              company = { companyName: u.companyProfile?.companyName || u.name || "Perusahaan Buyer", logo: u.image, id: u.id };
            }
          }

          if (!company) {
            const fallbackComp = await db.companyProfile.findFirst({
              select: { companyName: true, logo: true, id: true },
            });
            if (fallbackComp) {
              company = fallbackComp;
            }
          }

          return {
            ...c,
            otherUser: company || { companyName: "Perusahaan Buyer", logo: null, id: c.companyUserId },
          };
        }),
      );
    }

    const unreadMessagesCount = await db.message.count({
      where: {
        conversation: {
          OR: [{ companyUserId: userId }, { umkmUserId: userId }],
        },
        senderId: { not: userId },
        read: false,
      },
    });

    return NextResponse.json({ conversations: enriched, unreadCount: unreadMessagesCount });
  } catch (e) {
    console.error('[api/conversations GET] DB error:', e);
    return NextResponse.json(
      {
        conversations: [],
        unreadCount: 0,
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
    const sessionUser = session.user as SessionUserWithRole;
    const role = sessionUser.role;

    let companyUserId: string;
    let umkmUserId: string;

    if (role === 'COMPANY') {
      companyUserId = session.user.id;
      const umkmProf = await db.umkmProfile.findFirst({
        where: { OR: [{ id: otherUserId }, { userId: otherUserId }] },
        select: { userId: true },
      });
      umkmUserId = umkmProf?.userId || otherUserId;
    } else {
      umkmUserId = session.user.id;
      const compProf = await db.companyProfile.findFirst({
        where: { OR: [{ id: otherUserId }, { userId: otherUserId }] },
        select: { userId: true },
      });
      companyUserId = compProf?.userId || otherUserId;
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
