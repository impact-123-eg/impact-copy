const BASE_URLS = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api",
  "https://currency-api.pages.dev",
];

const fetchWithFallback = async (endpoint) => {
  let lastError;

  for (const baseUrl of BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      console.warn(`Failed to fetch from ${baseUrl}, trying fallback...`);
    }
  }

  throw lastError || new Error("All API endpoints failed");
};

export const getCurrenciesList = (date = "latest") =>
  fetchWithFallback(`@${date}/v1/currencies.min.json`);

export const getCurrencyRates = (currencyCode, date = "latest") =>
  fetchWithFallback(`@${date}/v1/currencies/${currencyCode}.min.json`);
