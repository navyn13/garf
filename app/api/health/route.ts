import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  // Lightweight health check for uptime + dependency readiness.
  // If Mongo is unreachable, return 503 so you can debug deployment issues quickly.
  const uri = process.env.MONGODB_URI;

  // Extract connection metadata without exposing secrets.
  const mongodbMeta = (() => {
    if (!uri) return null;
    const looksSrv = uri.startsWith("mongodb+srv://");
    const looksLocal = uri.startsWith("mongodb://localhost") || uri.includes("127.0.0.1");

    const afterProtocol = uri.replace(/^mongodb\+srv:\/\//, "").replace(/^mongodb:\/\//, "");
    const atIndex = afterProtocol.lastIndexOf("@");
    const credsPart = atIndex >= 0 ? afterProtocol.slice(0, atIndex) : "";
    const hostPart = atIndex >= 0 ? afterProtocol.slice(atIndex + 1) : afterProtocol;

    const username = credsPart ? credsPart.split(":")[0] : undefined;
    const host = hostPart.split(/[\/?]/)[0];

    const pathIndex = hostPart.indexOf("/");
    const queryIndex = hostPart.indexOf("?");
    const db =
      pathIndex >= 0
        ? hostPart.slice(pathIndex + 1, queryIndex >= 0 ? queryIndex : hostPart.length)
        : undefined;

    let authSource: string | undefined;
    if (queryIndex >= 0) {
      const query = hostPart.slice(queryIndex + 1);
      const params = new URLSearchParams(query);
      authSource = params.get("authSource") || undefined;
    }

    return {
      protocol: looksSrv ? "mongodb+srv" : "mongodb",
      looksLocal,
      host,
      username,
      db,
      authSource,
    };
  })();

  try {
    const db = await getDatabase();

    // Ping the configured database, not `admin`.
    // This avoids cases where the Atlas user does not have `admin` privileges.
    await db.command({ ping: 1 });

    return NextResponse.json({
      status: "ok",
      mongo: "ok",
      service: "garfield-website",
      mongodbUriConfigured: Boolean(uri),
      mongodbUriLooksLikeAtlas: Boolean(uri?.startsWith("mongodb+srv://")),
      mongodbMeta,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    const anyErr = typeof error === "object" && error !== null ? (error as any) : null;
    return NextResponse.json(
      {
        status: "error",
        mongo: "unreachable",
        service: "garfield-website",
        mongodbUriConfigured: Boolean(uri),
        mongodbUriLooksLikeAtlas: Boolean(uri?.startsWith("mongodb+srv://")),
        // Helpful for debugging in production; message typically won't include secrets.
        details: {
          message,
          name: anyErr?.name,
          code: anyErr?.code,
        },
        mongodbMeta,
      },
      { status: 503 }
    );
  }
}

