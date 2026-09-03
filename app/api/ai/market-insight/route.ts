import { NextResponse } from "next/server";
import { getMarketInsight } from "@/lib/ai";

export async function GET() {
  try {
    return NextResponse.json(getMarketInsight());
  } catch (error) {
    console.error("Market insight error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil market insight" },
      { status: 500 },
    );
  }
}
