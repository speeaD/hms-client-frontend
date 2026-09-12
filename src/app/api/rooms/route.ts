import { NextResponse } from "next/server";
import { ROOMS } from "@/data/rooms";

export async function GET() {
  try {
    return NextResponse.json(await ROOMS());
  } catch (error) {
    console.error("Rooms endpoint error:", error);

    return NextResponse.json(
      { error: "Rooms are temporarily unavailable." },
      { status: 503 }
    );
  }
}