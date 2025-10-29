import axios from "axios";

export async function POST(req) {
  try {
    const { tickers } = await req.json();

    // console.log("Processing tickers:", tickers);

    const responses = await Promise.all(
      tickers?.map(async (ticker) => {
        try {
          const res = await axios.get(
            `http://54.210.247.12:5000/ticker/${ticker}/ai-feedback`,
            {
              timeout: 10000, // 10 second timeout
              validateStatus: function (status) {
                // Only reject for network errors, not HTTP error status codes
                return status < 600;
              },
            }
          );

          // Check if the response was successful
          if (res.status !== 200) {
            console.warn(
              `API returned status ${res.status} for ${ticker}:`,
              res.data
            );
            return null;
          }

          const data = res.data;
          return {
            id: data.symbol,
            ticker: data.symbol,
            positives: data.positive || [],
            risks: data.potential || [],
            prediction: data.prediction || [],
          };
        } catch (err) {
          // Log more detailed error information
          console.error(`Error fetching data for ${ticker}:`, {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            code: err.code,
          });

          // Return null for failed requests
          return null;
        }
      })
    );

    // Filter out null results
    const result = responses.filter(Boolean);

    // console.log(
    //   `Successfully processed ${result.length} out of ${tickers.length} tickers`
    // );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response("Error fetching analytics", { status: 500 });
  }
}
