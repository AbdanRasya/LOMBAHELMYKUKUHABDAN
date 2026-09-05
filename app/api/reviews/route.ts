import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const umkmId = searchParams.get("umkmId");

    const reviews = await db.review.findMany({
      where: umkmId ? { umkmId } : undefined,
      include: {
        umkmProfile: {
          select: {
            id: true,
            businessName: true,
            logo: true,
            province: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    let summary = null;
    if (umkmId) {
      const agg = await db.review.aggregate({
        where: { umkmId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      summary = {
        averageRating: agg._avg.rating ? Number(agg._avg.rating.toFixed(1)) : 5.0,
        totalReviews: agg._count.rating || 0,
      };
    }

    return NextResponse.json({ reviews, summary });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { umkmId, rating, comment, projectId } = body;

    if (!umkmId || !rating) {
      return NextResponse.json({ error: "umkmId dan rating wajib diisi" }, { status: 400 });
    }

    const company = await db.companyProfile.findUnique({
      where: { userId: session.user.id },
    });

    const companyId = company?.id || session.user.id;

    const review = await db.review.create({
      data: {
        umkmId,
        companyId,
        projectId: projectId || null,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        comment: comment || null,
      },
    });

    const agg = await db.review.aggregate({
      where: { umkmId },
      _avg: { rating: true },
    });
    const avgRating = agg._avg.rating || 5;
    const newQualityScore = Math.min(100, Math.round(avgRating * 20));

    await db.trustScore.upsert({
      where: { umkmId },
      create: {
        umkmId,
        overall: Math.round(avgRating * 20),
        qualityScore: newQualityScore,
        deliveryScore: 92,
        responsivenessScore: 90,
      },
      update: {
        qualityScore: newQualityScore,
        overall: Math.min(100, Math.round((newQualityScore + 92 + 90) / 3)),
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
