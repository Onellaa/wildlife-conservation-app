// src/hooks/log-field-incident/useNetworkStatus.js
import { useEffect, useState } from "react";
import * as Network from "expo-network";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) setIsOnline(!!state.isConnected);
      } catch {
        if (mounted) setIsOnline(false);
      }
    };

    check();
    const interval = setInterval(check, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isOnline };
}
