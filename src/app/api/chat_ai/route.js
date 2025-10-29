import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("http://54.210.247.12:5000/qa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    return NextResponse.json({ answer: data.answer || "No answer returned." });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { answer: "Failed to get response from backend." },
      { status: 500 }
    );
  }
}
