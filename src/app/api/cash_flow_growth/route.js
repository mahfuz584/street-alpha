import axios from "axios";

export async function POST(req) {
  try {
    const { ticker, period = "FY", limit = 10 } = await req.json();

    if (!ticker) {
      return new Response(JSON.stringify({ error: "Ticker is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await axios.get(
      `http://54.210.247.12:5000/cash_flow_growth/${ticker}?period=${period}&limit=${limit}`
    );

    const cashFlowGrowth = response.data;

    return new Response(JSON.stringify(cashFlowGrowth), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Check if error response exists and matches the "data not found" message
    if (
      error.response &&
      error.response.status === 500 &&
      error.response.data &&
      typeof error.response.data.detail === "string" &&
      error.response.data.detail.includes(
        "404: Cash flow growth data not found"
      )
    ) {
      // Return an empty data array instead of error
      return new Response(
        JSON.stringify({
          symbol: ticker,
          period: period,
          count: 0,
          data: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // For other errors, log and return 500
    console.error("Error fetching cash flow growth data:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cash flow growth data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
