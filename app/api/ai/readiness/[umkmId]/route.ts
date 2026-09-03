import { NextResponse } from "next/server";
import { getReadinessScore } from "@/lib/ai";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ umkmId: string }> },
) {
  try {
    const { umkmId } = await params;
    const hasil = getReadinessScore(umkmId);
    return NextResponse.json(hasil);
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Get readiness by id error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil readiness score" },
      { status: 500 },
    );
  }
}
