import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  try {
    const conversation = await db.conversation.findUnique({
      where: { id },
      select: { companyUserId: true, umkmUserId: true },
    });
    if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

    if (conversation.companyUserId !== userId && conversation.umkmUserId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await db.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    await db.message.updateMany({
      where: { conversationId: id, senderId: { not: userId }, read: false },
      data: { read: true },
    });

    return NextResponse.json({ messages });
  } catch (e) {
    console.error('[api/conversations/[id]/messages GET] DB error:', e);
    return NextResponse.json(
      { error: 'Gagal mengambil pesan. Detail: ' + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  try {
    const conversation = await db.conversation.findUnique({
      where: { id },
      select: { companyUserId: true, umkmUserId: true },
    });
    if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

    if (conversation.companyUserId !== userId && conversation.umkmUserId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { content } = body as { content?: string };
    if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 });

    const message = await db.message.create({
      data: {
        conversationId: id,
        senderId: userId,
        content: content.trim(),
      },
    });

    await db.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });

    const otherUserId =
      conversation.companyUserId === userId ? conversation.umkmUserId : conversation.companyUserId;
    if (otherUserId) {
      await db.notification
        .create({
          data: {
            userId: otherUserId,
            type: 'MESSAGE_RECEIVED',
            title: 'Pesan Baru',
            body: `Anda menerima pesan baru dari ${session.user.name || 'Pengguna'}`,
            link:
              conversation.companyUserId === userId
                ? `/umkm/messages?conversation=${id}`
                : `/company/messages?conversation=${id}`,
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({ message });
  } catch (e) {
    console.error('[api/conversations/[id]/messages POST] DB error:', e);
    return NextResponse.json(
      { error: 'Gagal mengirim pesan. Detail: ' + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}
