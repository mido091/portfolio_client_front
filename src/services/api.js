// Use environment variable if available, otherwise fallback to production URL
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://portfolio-client-server.vercel.app/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  // Construct full URL safely
  let url;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    // If endpoint is already a full URL, use it directly
    url = endpoint;
  } else {
    // Join base URL with endpoint, ensuring no double slashes
    const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    url = `${cleanBase}${cleanEndpoint}`;
  }

  // Don't set Content-Type for FormData - browser will set multipart/form-data with boundary
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  // Remove undefined headers
  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined) delete headers[key];
  });

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add timeout using AbortController (15 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const config = {
    ...options,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (response.status === 401) {
      // Global logout on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `API request failed`;
      let errorDetails = {};

      try {
        errorDetails = await response.json();
        errorMessage =
          errorDetails.message || errorDetails.error || errorMessage;
      } catch {
        // If JSON parsing fails, try to get text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch {
          // If all else fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
      }

      // Create detailed error message
      const detailedError = `${errorMessage} (Status: ${response.status} ${response.statusText})`;
      throw new Error(detailedError);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout errors
    if (error.name === "AbortError") {
      const timeoutError = new Error(
        "Request timeout - server took too long to respond"
      );
      console.error("API Timeout:", timeoutError);
      throw timeoutError;
    }

    // Handle network errors
    if (error.message === "Failed to fetch") {
      const networkError = new Error(
        "Network error - please check your connection"
      );
      console.error("API Network Error:", networkError);
      throw networkError;
    }

    console.error("API Error:", error);
    throw error;
  }
};

export default api;
