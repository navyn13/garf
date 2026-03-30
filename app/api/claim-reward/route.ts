import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, name, address, phone, rank } = body;

    if (!wallet_address || !name || !address || !phone || !rank) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rank > 50) {
      return NextResponse.json(
        { error: "Only top 50 can claim rewards" },
        { status: 403 }
      );
    }

    const db = await getDatabase();
    const rewardsCollection = db.collection("rewards");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingClaim = await rewardsCollection.findOne({
      wallet_address,
      date: today,
    });

    if (existingClaim) {
      return NextResponse.json(
        { error: "Reward already claimed for today" },
        { status: 400 }
      );
    }

    await rewardsCollection.insertOne({
      wallet_address,
      name,
      address,
      phone,
      rank,
      date: today,
      claimed_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
