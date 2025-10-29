import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return new Response(JSON.stringify({ error: "Ticker is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await axios.get(
      `http://54.210.247.12:5000/financial_summary/${ticker}`
    );

    // If response data is missing or empty, return default empty structure
    const data = response.data;
    if (!data || !data.fundamentals) {
      return new Response(
        JSON.stringify({
          symbol: ticker && ticker,
          latestDate: null,
          fundamentals: {},
          ratios: {},
          perShare: {},
          margins: {},
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Optional: handle specific error messages from external API
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data.detail === "string" &&
      error.response.data.detail.includes("404")
    ) {
      return new Response(
        JSON.stringify({
          symbol: ticker,
          latestDate: null,
          fundamentals: {},
          ratios: {},
          perShare: {},
          margins: {},
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Error fetching financial summary:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch financial summary" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
