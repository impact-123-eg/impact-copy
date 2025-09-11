import { useState, useEffect } from "react";

function useClientLocation() {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        const geoResponse = await fetch(`https://ipwho.is/${ip}`);
        const geoData = await geoResponse.json();

        setGeoData(geoData);
        setError(null);
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError(err.message);
        setGeoData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  return { geoData, loading, error };
}

export default useClientLocation;
