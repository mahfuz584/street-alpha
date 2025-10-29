import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tickers = searchParams.getAll("tickers");
  const quantity = parseInt(searchParams.get("quantity")) || 3;
  const offset = parseInt(searchParams.get("offset")) || 0;

  const baseUrl = "http://54.210.247.12:5000/news_by_symbols";

  try {
    const params = new URLSearchParams();
    tickers.forEach((ticker) => params.append("tickers", ticker));
    params.append("quantity", quantity);
    params.append("offset", offset);

    const response = await axios.get(`${baseUrl}?${params.toString()}`);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy API error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: 500,
    });
  }
}
