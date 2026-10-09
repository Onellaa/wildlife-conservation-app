// src/hooks/log-field-incident/useGpsCaptureValidation.js
import { useMemo } from "react";

/**
 * Determines whether the GPS step can advance, and why not if it can't.
 * Pure logic — no side effects, no state. Easy to test.
 */
export function useGpsCaptureValidation({
  isLocating,
  isUnavailable,
  hasFix,
  manualMode,
  manualCoord,
}) {
  return useMemo(() => {
    // 1. Still locating (not manual) → can't continue
    if (isLocating && !manualMode) {
      return {
        canContinue: false,
        showContinue: false,
        errorMessage: null, // not an error, just in progress
      };
    }

    // 2. Manual mode but no pin dropped
    if (manualMode && !manualCoord) {
      return {
        canContinue: false,
        showContinue: true,
        errorMessage: "Tap the map to place a pin, or cancel manual marking.",
      };
    }

    // 3. Manual mode, pin placed → OK
    if (manualMode && manualCoord) {
      return {
        canContinue: true,
        showContinue: true,
        errorMessage: null,
      };
    }

    // 4. GPS found → OK
    if (hasFix) {
      return {
        canContinue: true,
        showContinue: true,
        errorMessage: null,
      };
    }

    // 5. GPS unavailable, no manual mode → hide Continue; show fallbacks
    return {
      canContinue: false,
      showContinue: false,
      errorMessage: null,
    };
  }, [isLocating, isUnavailable, hasFix, manualMode, manualCoord]);
}
