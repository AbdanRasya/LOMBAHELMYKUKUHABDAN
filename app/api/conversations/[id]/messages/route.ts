import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const messages = await db.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
    
    // Mark messages from other user as read
    await db.message.updateMany({
      where: { conversationId: id, senderId: { not: session.user.id }, read: false },
      data: { read: true },
    });
    
    return NextResponse.json({ messages });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await request.json();
    const { content } = body;
    if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 });
    
    const message = await db.message.create({
      data: {
        conversationId: id,
        senderId: session.user.id,
        content: content.trim(),
      }
    });
    
    // Update lastMessageAt on conversation
    await db.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });
    
    return NextResponse.json({ message });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
