import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const scoresCollection = db.collection("scores");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const topScores = await scoresCollection
      .aggregate([
        { $match: { date: today } },
        {
          $group: {
            _id: "$wallet_address",
            maxScore: { $max: "$score" },
            latestDate: { $max: "$created_at" },
          },
        },
        { $sort: { maxScore: -1, latestDate: 1 } },
        { $limit: 100 },
      ])
      .toArray();

    const leaderboard = topScores.map((entry, index) => ({
      wallet_address: entry._id,
      score: entry.maxScore,
      date: entry.latestDate,
      rank: index + 1,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error", leaderboard: [] },
      { status: 500 }
    );
  }
}
