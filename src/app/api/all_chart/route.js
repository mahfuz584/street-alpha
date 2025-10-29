import axios from "axios";

export async function POST(req) {
  try {
    const { tickers } = await req.json();

    // if (!tickers || tickers.length === 0) {
    //   return new Response(JSON.stringify({ error: "Tickers are required" }), {
    //     status: 400,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    const requests = tickers.map((ticker) =>
      axios
        .get(`http://54.210.247.12:5000/ticker/${ticker}`)
        .then((res) => ({ ticker, data: res.data }))
        .catch((err) => ({ ticker, error: true, message: err.message }))
    );

    const results = await Promise.all(requests);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching batch data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch batch revenue/income data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
