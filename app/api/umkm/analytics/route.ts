import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await db.umkmProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        trustScore: true,
        categories: true,
      },
    });

    if (!profile) {
      return NextResponse.json({
        hasProfile: false,
        stats: [
          { label: "Total Penawaran", value: "0", trend: "Belum ada penawaran" },
          { label: "Tingkat Diterima", value: "0%", trend: "dari 0 penawaran" },
          { label: "Pesanan Aktif", value: "0", trend: "sedang berjalan" },
          { label: "Skor Kesiapan", value: "0/100", trend: "Lengkapi profil" },
        ],
        monthlyQuotations: MONTH_NAMES.map((m) => ({ bulan: m, penawaran: 0 })),
        categoryData: [],
        statusData: [
          { name: "Diterima", value: 0 },
          { name: "Pending", value: 0 },
          { name: "Ditolak", value: 0 },
          { name: "Negosiasi", value: 0 },
        ],
        readinessData: [
          { bulan: "Jan", skor: 0 },
          { bulan: "Jun", skor: 0 },
          { bulan: "Des", skor: 0 },
        ],
      });
    }

    // Fetch this UMKM's quotations only
    const quotations = await db.quotation.findMany({
      where: { umkmId: profile.id },
      include: {
        rfq: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Fetch this UMKM's orders only
    const orders = await db.order.findMany({
      where: { umkmId: profile.id },
    });

    // 1. Calculate Monthly Quotations
    const monthlyMap = new Map<number, number>();
    for (let i = 0; i < 12; i++) monthlyMap.set(i, 0);

    const now = new Date();
    const currentYear = now.getFullYear();

    quotations.forEach((q) => {
      const qDate = new Date(q.createdAt);
      if (qDate.getFullYear() === currentYear) {
        const m = qDate.getMonth();
        monthlyMap.set(m, (monthlyMap.get(m) || 0) + 1);
      }
    });

    const monthlyQuotations = MONTH_NAMES.map((name, idx) => ({
      bulan: name,
      penawaran: monthlyMap.get(idx) || 0,
    }));

    // 2. Status Distribution
    const statusCounts = {
      ACCEPTED: 0,
      PENDING: 0,
      REJECTED: 0,
      NEGOTIATING: 0,
      WITHDRAWN: 0,
    };

    quotations.forEach((q) => {
      if (q.status in statusCounts) {
        statusCounts[q.status as keyof typeof statusCounts]++;
      }
    });

    const statusData = [
      { name: "Diterima", value: statusCounts.ACCEPTED },
      { name: "Pending", value: statusCounts.PENDING },
      { name: "Ditolak", value: statusCounts.REJECTED },
      { name: "Negosiasi", value: statusCounts.NEGOTIATING },
    ];

    // 3. Category Distribution
    const categoryMap = new Map<string, number>();
    quotations.forEach((q) => {
      const catName = q.rfq?.category?.name || "Lainnya";
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + 1);
    });

    // If no quotations yet, populate with user's registered categories
    if (categoryMap.size === 0 && profile.categories?.length > 0) {
      profile.categories.forEach((c) => {
        categoryMap.set(c.name, 0);
      });
    }

    const categoryData = Array.from(categoryMap.entries()).map(([name, val]) => ({
      name,
      val,
    }));

    // 4. Summary Stats
    const totalQuotations = quotations.length;
    const acceptedCount = statusCounts.ACCEPTED;
    const acceptRate = totalQuotations > 0 ? Math.round((acceptedCount / totalQuotations) * 100) : 0;
    const activeOrders = orders.filter((o) =>
      ["PENDING_PAYMENT", "CONFIRMED", "IN_PRODUCTION", "SHIPPED"].includes(o.status)
    ).length;

    const readinessScore = profile.readinessScore || profile.trustScore?.overall || 0;

    const readinessData = [
      { bulan: "Kuartal 1", skor: Math.max(0, readinessScore - 20) },
      { bulan: "Kuartal 2", skor: Math.max(0, readinessScore - 10) },
      { bulan: "Kuartal 3", skor: Math.max(0, readinessScore - 5) },
      { bulan: "Terkini", skor: readinessScore },
    ];

    return NextResponse.json({
      hasProfile: true,
      businessName: profile.businessName,
      stats: [
        {
          label: "Total Penawaran",
          value: totalQuotations.toString(),
          trend: `${quotations.filter((q) => new Date(q.createdAt).getMonth() === now.getMonth()).length} bulan ini`,
        },
        {
          label: "Tingkat Diterima",
          value: `${acceptRate}%`,
          trend: totalQuotations > 0 ? `dari ${totalQuotations} penawaran` : "Belum ada transaksi",
        },
        {
          label: "Pesanan Berjalan",
          value: activeOrders.toString(),
          trend: `${orders.filter((o) => o.status === "COMPLETED").length} selesai`,
        },
        {
          label: "Skor Kesiapan",
          value: `${readinessScore}/100`,
          trend: readinessScore >= 75 ? "Kesiapan Tinggi" : "Perlu ditingkatkan",
        },
      ],
      monthlyQuotations,
      categoryData: categoryData.length > 0 ? categoryData : [{ name: "Belum Ada", val: 0 }],
      statusData,
      readinessData,
    });
  } catch (error) {
    console.error("[api/umkm/analytics GET] Error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengambil data analitik",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
