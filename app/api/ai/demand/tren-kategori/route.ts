import { NextResponse } from "next/server";
import { getDemandTrend } from "@/lib/ai";

export async function GET() {
  try {
    return NextResponse.json(getDemandTrend());
  } catch (error) {
    console.error("Demand trend error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil tren permintaan" },
      { status: 500 },
    );
  }
}
