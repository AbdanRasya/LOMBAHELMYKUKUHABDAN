import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatBudgetShort(amount: number) {
  if (amount >= 1e9) return `Rp ${(amount / 1e9).toFixed(1)}M`;
  if (amount >= 1e6) return `Rp ${(amount / 1e6).toFixed(1)}Jt`;
  if (amount > 0) return `Rp ${amount.toLocaleString("id-ID")}`;
  return "Rp 0";
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await db.companyProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({
        hasProfile: false,
        stats: [
          { label: "Total RFQ", value: "0", trend: "Belum membuat RFQ" },
          { label: "Total Penawaran Masuk", value: "0", trend: "0 penawaran diterima" },
          { label: "Supplier Tersimpan", value: "0", trend: "Favorit" },
          { label: "Estimasi Budget", value: "Rp 0", trend: "Total pengadaan" },
        ],
        monthlyRfq: MONTH_NAMES.map((m) => ({ bulan: m, rfq: 0 })),
        categoryData: [],
        statusData: [
          { name: "Terbuka", value: 0 },
          { name: "Selesai", value: 0 },
          { name: "Ditinjau", value: 0 },
          { name: "Dibatalkan", value: 0 },
        ],
        responseRateData: MONTH_NAMES.slice(0, 6).map((m) => ({ bulan: m, respons: 0 })),
      });
    }

    // Fetch this Company's RFQs only
    const rfqs = await db.rFQ.findMany({
      where: { companyId: profile.id, deletedAt: null },
      include: {
        category: true,
        quotations: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Fetch saved suppliers count
    const savedCount = await db.savedSupplier.count({
      where: { userId: session.user.id },
    });

    // 1. Monthly RFQ trend
    const monthlyMap = new Map<number, number>();
    for (let i = 0; i < 12; i++) monthlyMap.set(i, 0);

    const now = new Date();
    const currentYear = now.getFullYear();

    let totalQuotationsReceived = 0;
    let totalBudgetSum = 0;

    rfqs.forEach((rfq) => {
      const date = new Date(rfq.createdAt);
      if (date.getFullYear() === currentYear) {
        const m = date.getMonth();
        monthlyMap.set(m, (monthlyMap.get(m) || 0) + 1);
      }
      totalQuotationsReceived += rfq.quotations.length;
      totalBudgetSum += rfq.budgetMax || rfq.budgetMin || 0;
    });

    const monthlyRfq = MONTH_NAMES.map((name, idx) => ({
      bulan: name,
      rfq: monthlyMap.get(idx) || 0,
    }));

    // 2. Status Distribution
    const statusCounts = {
      OPEN: 0,
      COMPLETED: 0,
      IN_REVIEW: 0,
      CANCELLED: 0,
      DRAFT: 0,
      AWARDED: 0,
    };

    rfqs.forEach((rfq) => {
      if (rfq.status in statusCounts) {
        statusCounts[rfq.status as keyof typeof statusCounts]++;
      }
    });

    const statusData = [
      { name: "Terbuka", value: statusCounts.OPEN },
      { name: "Selesai", value: statusCounts.COMPLETED + statusCounts.AWARDED },
      { name: "Ditinjau", value: statusCounts.IN_REVIEW },
      { name: "Draft/Batal", value: statusCounts.DRAFT + statusCounts.CANCELLED },
    ];

    // 3. Categories
    const catMap = new Map<string, number>();
    rfqs.forEach((rfq) => {
      const name = rfq.category?.name || "Kategori Umum";
      catMap.set(name, (catMap.get(name) || 0) + rfq.quotations.length);
    });

    const categoryData = Array.from(catMap.entries()).map(([name, penawaran]) => ({
      name,
      penawaran,
    }));

    // 4. Response rate
    const rfqsWithQuotations = rfqs.filter((r) => r.quotations.length > 0).length;
    const responseRate = rfqs.length > 0 ? Math.round((rfqsWithQuotations / rfqs.length) * 100) : 0;

    const responseRateData = MONTH_NAMES.slice(Math.max(0, now.getMonth() - 5), now.getMonth() + 1).map((m) => ({
      bulan: m,
      respons: responseRate > 0 ? responseRate : 0,
    }));

    return NextResponse.json({
      hasProfile: true,
      companyName: profile.companyName,
      stats: [
        {
          label: "Total RFQ Dibuat",
          value: rfqs.length.toString(),
          trend: `${rfqs.filter((r) => r.status === "OPEN").length} sedang aktif`,
        },
        {
          label: "Total Penawaran Masuk",
          value: totalQuotationsReceived.toString(),
          trend: `${rfqs.filter((r) => new Date(r.createdAt).getMonth() === now.getMonth()).length} RFQ bulan ini`,
        },
        {
          label: "Supplier Tersimpan",
          value: savedCount.toString(),
          trend: "Supplier favorit",
        },
        {
          label: "Estimasi Budget",
          value: formatBudgetShort(totalBudgetSum),
          trend: "Total procurement",
        },
      ],
      monthlyRfq,
      categoryData: categoryData.length > 0 ? categoryData : [{ name: "Belum Ada", penawaran: 0 }],
      statusData,
      responseRateData: responseRateData.length > 0 ? responseRateData : [{ bulan: MONTH_NAMES[now.getMonth()], respons: 0 }],
    });
  } catch (error) {
    console.error("[api/company/analytics GET] Error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengambil data analitik",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
