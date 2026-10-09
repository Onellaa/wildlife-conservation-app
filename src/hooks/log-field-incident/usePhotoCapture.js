// src/hooks/log-field-incident/usePhotoCapture.js
import { useCallback, useEffect, useRef, useState } from "react";
import { useCameraPermissions } from "expo-camera";

export function usePhotoCapture(initialPhotoUri = null) {
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const [capturedUri, setCapturedUri] = useState(initialPhotoUri);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);

  // Auto-request permission on mount
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || !ready) return null;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });
      setCapturedUri(photo.uri);
      setError(null);
      return photo.uri;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [ready]);

  const reset = useCallback(() => {
    setCapturedUri(null);
    setError(null);
  }, []);

  return {
    permission,
    ready,
    setReady,
    capturedUri,
    error,
    cameraRef,
    takePicture,
    reset,
    requestPermission, // ← NEW: exposed for retry after denial
    hasPermission: permission?.granted ?? false,
    canAskAgain: permission?.canAskAgain ?? true,
  };
}
