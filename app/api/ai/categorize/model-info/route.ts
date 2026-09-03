import { NextResponse } from "next/server";
import { getModelInfo } from "@/lib/ai";

export async function GET() {
  try {
    return NextResponse.json(getModelInfo());
  } catch (error) {
    console.error("Model info error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil info model" },
      { status: 500 },
    );
  }
}
