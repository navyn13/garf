import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const scoresCollection = db.collection("scores");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [uniquePlayers, topScoreDoc] = await Promise.all([
      scoresCollection.distinct("wallet_address", { date: today }),
      scoresCollection.findOne({ date: today }, { sort: { score: -1 } }),
    ]);

    return NextResponse.json({
      playersToday: uniquePlayers.length,
      topScore: topScoreDoc?.score || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { playersToday: 0, topScore: 0 },
      { status: 500 }
    );
  }
}
