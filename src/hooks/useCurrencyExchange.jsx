import { useState, useEffect } from "react";

// Custom hook for currency exchange
const useCurrencyExchange = (initialBaseCurrency = "usd") => {
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState(initialBaseCurrency);
  const [date, setDate] = useState("latest");

  const BASE_URLS = [
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api",
    "https://currency-api.pages.dev",
  ];

  const fetchWithFallback = async (endpoint) => {
    let lastError;

    for (const baseUrl of BASE_URLS) {
      try {
        const url = `${baseUrl}${endpoint}`;
        const response = await fetch(url);
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

  const fetchRates = async (currency = baseCurrency, dateParam = date) => {
    try {
      setLoading(true);
      const data = await fetchWithFallback(
        `@${dateParam}/v1/currencies/${currency}.min.json`
      );
      setRates(data[currency]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const data = await fetchWithFallback(`@latest/v1/currencies.min.json`);
      setCurrencies(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchCurrencies();
      await fetchRates();
    };

    initializeData();
  }, []);

  const changeBaseCurrency = (newCurrency) => {
    setBaseCurrency(newCurrency);
    fetchRates(newCurrency, date);
  };

  const changeDate = (newDate) => {
    setDate(newDate);
    fetchRates(baseCurrency, newDate);
  };

  const convert = (amount, targetCurrency) => {
    if (!rates[targetCurrency]) return null;
    return amount * rates[targetCurrency];
  };

  return {
    rates,
    currencies,
    loading,
    error,
    baseCurrency,
    date,
    changeBaseCurrency,
    changeDate,
    convert,
    refreshRates: () => fetchRates(baseCurrency, date),
  };
};

export default useCurrencyExchange;
