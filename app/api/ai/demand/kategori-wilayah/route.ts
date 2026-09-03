import { NextResponse } from "next/server";
import { getDemandByCategoryRegion } from "@/lib/ai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topN = parseInt(searchParams.get("top_n") || "10", 10);
    return NextResponse.json(getDemandByCategoryRegion(topN));
  } catch (error) {
    console.error("Demand by category-region error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil demand kategori x wilayah" },
      { status: 500 },
    );
  }
}
