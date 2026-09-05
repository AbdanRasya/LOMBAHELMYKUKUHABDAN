import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { procurementAssistant } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    // Support both { messages: [...] } and { message: "..." }
    let messages = body?.messages;
    if (!messages && body?.message) {
      messages = [{ role: "user", content: body.message }];
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const response = await procurementAssistant(messages, body?.context);
    return NextResponse.json({
      response,
      reply: response,
      mode: process.env.GEMINI_API_KEY ? "online_gemini" : "offline_knowledge_engine",
      user: session?.user?.email || "guest",
    });
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada AI Assistant" },
      { status: 500 }
    );
  }
}
