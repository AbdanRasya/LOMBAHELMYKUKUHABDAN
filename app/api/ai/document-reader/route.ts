import { NextResponse } from "next/server";
import { bacaDokumenDenganAI, bacaDokumenDariTeks } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
      }
      const buffer = await file.arrayBuffer();
      const hasil = await bacaDokumenDenganAI(buffer, file.name);
      return NextResponse.json(hasil);
    }
    const { teks } = await req.json();
    if (!teks) {
      return NextResponse.json(
        { error: "Kirim file (multipart) atau field 'teks' (JSON) OCR hasil." },
        { status: 400 },
      );
    }
    return NextResponse.json(bacaDokumenDariTeks(teks));
  } catch (error) {
    console.error("Document reader error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membaca dokumen" },
      { status: 500 },
    );
  }
}
