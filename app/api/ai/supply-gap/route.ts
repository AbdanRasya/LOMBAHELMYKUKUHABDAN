import { NextResponse } from "next/server";
import { getSupplyGap } from "@/lib/ai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provinsi = searchParams.get("provinsi");
    const topN = parseInt(searchParams.get("top_n") || "20", 10);
    return NextResponse.json(getSupplyGap(provinsi, topN));
  } catch (error) {
    console.error("Supply gap error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil supply gap" },
      { status: 500 },
    );
  }
}
