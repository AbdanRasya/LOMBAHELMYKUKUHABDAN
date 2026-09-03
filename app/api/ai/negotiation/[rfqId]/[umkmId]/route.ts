import { NextResponse } from "next/server";
import { rekomendasiNegosiasi } from "@/lib/ai";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ rfqId: string; umkmId: string }> },
) {
  try {
    const { rfqId, umkmId } = await params;
    return NextResponse.json(rekomendasiNegosiasi(rfqId, umkmId));
  } catch (error) {
    if (error instanceof Error && error.message.includes("tidak ditemukan")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Negotiation error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat rekomendasi negosiasi" },
      { status: 500 },
    );
  }
}
