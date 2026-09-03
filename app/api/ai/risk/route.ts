import { NextResponse } from "next/server";
import { getAllRiskScores } from "@/lib/ai";

export async function GET() {
  try {
    return NextResponse.json(getAllRiskScores());
  } catch (error) {
    console.error("Get all risk error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data risk score" },
      { status: 500 },
    );
  }
}
