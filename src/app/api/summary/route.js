export async function GET() {
  try {
    const res = await fetch("http://54.210.247.12:5000/summary/SPY/1D", {
      headers: {
        accept: "application/json",
      },
      cache: "no-store", // Optional: avoid caching for fresh data
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch summary data" }),
        {
          status: 500,
        }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
