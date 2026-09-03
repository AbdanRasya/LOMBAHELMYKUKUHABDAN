import { NextResponse } from "next/server";
import { getAllReadinessScores } from "@/lib/ai";

export async function GET() {
  try {
    const hasil = getAllReadinessScores();
    return NextResponse.json(hasil);
  } catch (error) {
    console.error("Get all readiness error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data readiness score" },
      { status: 500 },
    );
  }
}
