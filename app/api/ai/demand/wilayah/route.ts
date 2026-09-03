import { NextResponse } from "next/server";
import { getDemandByRegion } from "@/lib/ai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topN = parseInt(searchParams.get("top_n") || "10", 10);
    return NextResponse.json(getDemandByRegion(topN));
  } catch (error) {
    console.error("Demand by region error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil demand per wilayah" },
      { status: 500 },
    );
  }
}
