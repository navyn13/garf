import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { validateScore, checkDuplicateSubmission } from "@/lib/antiCheat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, score, duration, timestamp } = body;

    if (!wallet_address || score === undefined || !duration || !timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validation = validateScore(score, duration, timestamp);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Invalid score", reason: validation.reason },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const scoresCollection = db.collection("scores");

    const recentScores = await scoresCollection
      .find({
        wallet_address,
        timestamp: { $gte: timestamp - 10000 },
      })
      .toArray();

    const duplicateCheck = await checkDuplicateSubmission(
      wallet_address,
      score,
      timestamp,
      recentScores.map((s) => ({
        wallet_address: s.wallet_address,
        score: s.score,
        timestamp: s.timestamp,
      }))
    );

    if (!duplicateCheck.isValid) {
      return NextResponse.json(
        { error: "Duplicate submission", reason: duplicateCheck.reason },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await scoresCollection.insertOne({
      wallet_address,
      score,
      duration,
      timestamp,
      date: today,
      created_at: new Date(),
    });

    const todayScores = await scoresCollection
      .find({ date: today })
      .sort({ score: -1 })
      .toArray();

    const rank = todayScores.findIndex((s) => s.wallet_address === wallet_address) + 1;

    return NextResponse.json({
      success: true,
      score,
      rank,
      isTopFifty: rank <= 50,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
