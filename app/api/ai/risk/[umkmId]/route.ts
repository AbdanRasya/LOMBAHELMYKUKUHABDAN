import { NextResponse } from "next/server";
import { hitungRisiko } from "@/lib/ai";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ umkmId: string }> },
) {
  try {
    const { umkmId } = await params;
    return NextResponse.json(hitungRisiko(umkmId));
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Risk by id error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghitung risk score" },
      { status: 500 },
    );
  }
}
