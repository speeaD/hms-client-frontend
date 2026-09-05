import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validate required fields
    const requiredFields = [
      "roomId",
      "checkInDate",
      "checkOutDate",
      "firstName",
      "lastName",
      "email",
      "phone",
      "totalAmount",
      "numberOfGuests",
    ];

    for (const field of requiredFields) {
      if (!payload[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      console.error("BACKEND_URL environment variable is not set");
      return NextResponse.json(
        { 
          error: "Backend service not configured. Please set BACKEND_URL environment variable.",
          debug: process.env.NODE_ENV === "development" ? "Missing BACKEND_URL" : undefined
        },
        { status: 500 }
      );
    }

    const url = `${backendUrl}${backendUrl.endsWith("/") ? "" : "/"}reservation/pay-reservation`;
    console.log(`[Reserve API] Forwarding request to: ${url}`);

    // Forward the request to the backend with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data?.error || data?.message || "Failed to initialize payment";
        return NextResponse.json({ error: msg }, { status: response.status });
      }

      // Return the backend response to the frontend
      return NextResponse.json(data, { status: 200 });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    console.error("Reservation endpoint error:", {
      message: error?.message,
      code: error?.code,
      cause: error?.cause?.message,
    });
    
    const errorMsg = error?.name === "AbortError" 
      ? "Request to backend timed out. Backend service may be unavailable."
      : error?.message || "Internal server error";

    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
