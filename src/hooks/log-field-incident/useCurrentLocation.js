// src/hooks/log-field-incident/useCurrentLocation.js
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        console.warn("Location error:", err);
        setError(err.message);
      }
    })();
  }, []);

  return { location, error };
}
