import { NextResponse } from "next/server";
import { prediksiProduk } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { deskripsi } = await req.json();
    if (!deskripsi) {
      return NextResponse.json({ error: "Field 'deskripsi' wajib diisi" }, { status: 400 });
    }
    return NextResponse.json(prediksiProduk(deskripsi));
  } catch (error) {
    console.error("Categorize error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat melakukan kategorisasi produk" },
      { status: 500 },
    );
  }
}
