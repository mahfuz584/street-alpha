// app/api/news/route.js
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const quantity = searchParams.get("quantity") || 12;
  const offset = searchParams.get("offset") || 0;

  try {
    const response = await axios.get("http://54.210.247.12:5000/news", {
      params: { quantity, offset },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
