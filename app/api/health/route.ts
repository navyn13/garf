import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  // Lightweight health check for uptime + dependency readiness.
  // If Mongo is unreachable, return 503 so you can debug deployment issues quickly.
  try {
    const db = await getDatabase();

    // `admin` ping is the most reliable check for Mongo connectivity.
    await db.admin().ping();

    return NextResponse.json({
      status: "ok",
      mongo: "ok",
      service: "garfield-website",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        mongo: "unreachable",
        service: "garfield-website",
      },
      { status: 503 }
    );
  }
}

