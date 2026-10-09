// src/hooks/log-field-incident/useGpsCapture.js
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";

const GPS_STATUS = {
  LOCATING: "locating",
  FOUND: "found",
  UNAVAILABLE: "unavailable",
};

export function useGpsCapture({
  initialLocation = null,
  autoAcquire = true,
} = {}) {
  const [location, setLocation] = useState(initialLocation);
  const [status, setStatus] = useState(
    initialLocation ? GPS_STATUS.FOUND : GPS_STATUS.LOCATING,
  );
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  // -------- One-shot fetch attempt (permission + services + position) --------
  const tryFetchLocation = useCallback(async () => {
    if (mountedRef.current) {
      setStatus(GPS_STATUS.LOCATING);
      setError(null);
    }

    try {
      const { status: permStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permStatus !== "granted") {
        if (mountedRef.current) {
          setStatus(GPS_STATUS.UNAVAILABLE);
          setError("Location permission denied");
        }
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (mountedRef.current) {
          setStatus(GPS_STATUS.UNAVAILABLE);
          setError("Location services disabled");
        }
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (mountedRef.current) {
        setLocation(loc.coords);
        setStatus(GPS_STATUS.FOUND);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setStatus(GPS_STATUS.UNAVAILABLE);
        setError(err.message);
      }
    }
  }, []);

  // -------- Initial fetch on mount --------
  useEffect(() => {
    mountedRef.current = true;
    if (autoAcquire) tryFetchLocation();

    return () => {
      mountedRef.current = false;
    };
  }, [autoAcquire, tryFetchLocation]);

  // -------- Watch for position changes (detects GPS turning on) --------
  useEffect(() => {
    let subscription = null;

    (async () => {
      if (!autoAcquire) return;

      try {
        const { status: permStatus } =
          await Location.getForegroundPermissionsAsync();

        if (permStatus !== "granted") return;

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (loc) => {
            if (!mountedRef.current) return;
            setLocation(loc.coords);
            setStatus(GPS_STATUS.FOUND);
            setError(null);
          },
        );
      } catch {
        // silent — tryFetchLocation already handles error reporting
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, [autoAcquire]);

  // -------- Re-check when app returns to foreground --------
  useEffect(() => {
    if (!autoAcquire) return;

    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        tryFetchLocation();
      }
    });
    return () => sub.remove();
  }, [autoAcquire, tryFetchLocation]);

  // -------- Build result payload for parent --------
  const buildResult = useCallback(
    (manualCoord = null) => {
      if (manualCoord) {
        return {
          latitude: manualCoord.latitude,
          longitude: manualCoord.longitude,
          locationSource: "manual",
        };
      }
      if (location) {
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          locationSource: "auto_gps",
        };
      }
      return {
        latitude: null,
        longitude: null,
        locationSource: "missing_requires_follow_up",
      };
    },
    [location],
  );

  return {
    location,
    error,
    isLocating: status === GPS_STATUS.LOCATING,
    isUnavailable: status === GPS_STATUS.UNAVAILABLE,
    hasFix: status === GPS_STATUS.FOUND,
    buildResult,
    retry: tryFetchLocation,
  };
}

export { GPS_STATUS };
