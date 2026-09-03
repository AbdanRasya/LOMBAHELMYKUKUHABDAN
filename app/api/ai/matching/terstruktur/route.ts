import { NextResponse } from "next/server";
import { cariSupplier, type KebutuhanTersusun } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { top_n: topN, ...rest } = body;
    const kebutuhan: KebutuhanTersusun = {
      kategori: rest.kategori ?? null,
      sub_kategori: rest.sub_kategori ?? null,
      provinsi: rest.provinsi ?? null,
      kuantitas: rest.kuantitas ?? null,
      satuan: rest.satuan ?? null,
      sertifikasi_wajib: rest.sertifikasi_wajib ?? [],
    };
    const hasil = cariSupplier(kebutuhan, topN ?? 5);
    return NextResponse.json({ hasil });
  } catch (error) {
    console.error("Matching terstruktur error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat melakukan matching supplier" },
      { status: 500 },
    );
  }
}
