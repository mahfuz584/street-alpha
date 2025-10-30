const baseUrl = "http://54.210.247.12:5000" || process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper to build query string from an object
 */
export const buildQueryParams = (params = {}) => {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => {
      const val = params[k];
      if (Array.isArray(val)) {
        return val.map((v) => `${esc(k)}=${esc(v)}`).join("&");
      }
      return `${esc(k)}=${esc(val)}`;
    })
    .join("&");
};

/**
 * GET fetch helper with query params and optional Next.js caching
 * @param {string} url - Endpoint URL (will prepend NEXT_PUBLIC_API_URL)
 * @param {object} query - Query params object
 * @param {object} next - Next.js fetch caching options (optional)
 */
export const fetchGet = async (
  url,
  query = {},
  accessToken,
  customBaseUrl,
  revalidate = 60
) => {
  const base = customBaseUrl || "http://54.210.247.12:5000";

  const queryString = buildQueryParams(query);
  const fullUrl = queryString
    ? `${base}${url}?${queryString}`
    : `${base}${url}`;

  try {
    const headers = { "Content-Type": "application/json" };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    // Use dynamic revalidate value
    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
      next: { revalidate },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return {
        data: null,
        error: data || { message: `${response.status} ${response.statusText}` },
      };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Fetch error:", err);
    return { data: null, error: { message: err.message || "Unknown error" } };
  }
};

export const fetchGetById = async (url, id, query = {}, accessToken) => {
  return fetchGet(`${url}/${id}`, query, accessToken);
};
