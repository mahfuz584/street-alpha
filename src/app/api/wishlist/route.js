import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await axios.post(
      "http://54.210.247.12:5000/watchlist/",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Watchlist API error:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch watchlist data" }),
      {
        status: 500,
      }
    );
  }
}
