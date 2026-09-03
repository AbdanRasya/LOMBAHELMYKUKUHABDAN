import { NextResponse } from "next/server";
import { cariSupplierDariTeks } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { teks, top_n: topN } = await req.json();
    if (!teks) {
      return NextResponse.json({ error: "Field 'teks' wajib diisi" }, { status: 400 });
    }
    const hasil = cariSupplierDariTeks(teks, topN ?? 5);
    return NextResponse.json(hasil);
  } catch (error) {
    console.error("Matching dari teks error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat melakukan matching supplier" },
      { status: 500 },
    );
  }
}
