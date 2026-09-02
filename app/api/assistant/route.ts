import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { procurementAssistant } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const response = await procurementAssistant(messages);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada AI Assistant" },
      { status: 500 }
    );
  }
}
