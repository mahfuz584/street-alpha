import axios from "axios";
import React from "react";

export async function POST(req) {
  try {
    const { ticker } = await req.json();

    if (!ticker) {
      return new Response(JSON.stringify({ error: "Ticker is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await axios.get(
      `http://54.210.247.12:5000/ratios/${ticker}`
    );
    const ratios = response.data;
    // console.log(ratios);
    return new Response(JSON.stringify(ratios), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching radar data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch radar data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
