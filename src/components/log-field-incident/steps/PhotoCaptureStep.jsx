// src/components/log-field-incident/steps/PhotoCaptureStep.jsx
import { useEffect } from "react";
import { Image, View, Text, TouchableOpacity, Platform } from "react-native";
import { CameraView } from "expo-camera";

import CameraChip from "../components/CameraChip";
import ViewfinderOverlay from "../components/ViewfinderOverlay";
import CameraPermissionBlock from "../components/CameraPermissionBlock";
import { usePhotoCapture } from "../../../hooks/log-field-incident/usePhotoCapture";
import { photoCaptureStyles as styles } from "../../../styles/log-field-incident/photoCaptureStyles";
import { getIncidentType } from "../../../constants/log-field-incident/incidentTypes";

export default function PhotoCaptureStep({
  incidentType,
  locationSource,
  initialPhotoUri,
  onContinue,
  onPhotoChange,
}) {
  const {
    ready,
    setReady,
    capturedUri,
    cameraRef,
    takePicture,
    reset,
    requestPermission,
    hasPermission,
    canAskAgain,
  } = usePhotoCapture(initialPhotoUri);

  useEffect(() => {
    onPhotoChange?.({
      photoUris: capturedUri ? [capturedUri] : [],
      photoStatus: capturedUri ? "attached" : "missing_pending_upload",
    });
  }, [capturedUri, onPhotoChange]);

  // ---------- Chip labels ----------
  const typeLabel = getIncidentType(incidentType)?.label?.toUpperCase() ?? "";

  const gpsLabel =
    locationSource === "auto_gps"
      ? "GPS locked"
      : locationSource === "manual"
        ? "Manual location"
        : "No location";

  // ---------- Handlers ----------
  const handleUsePhoto = () => {
    onContinue({ photoUris: [capturedUri], photoStatus: "attached" });
  };

  const handleRetake = () => {
    reset();
  };

  const handleSkip = () => {
    onContinue({ photoUris: [], photoStatus: "missing_pending_upload" });
  };

  // ---------- Permission gate ----------
  if (!hasPermission) {
    return (
      <>
        <View style={styles.chipsRow}>
          <CameraChip label={typeLabel} variant="accent" />
          <CameraChip label={gpsLabel} />
        </View>

        <CameraPermissionBlock
          canAskAgain={canAskAgain}
          onRequestPermission={requestPermission}
          onSkip={handleSkip}
        />
      </>
    );
  }

  const isWeb = Platform.OS === "web";

  // ---------- Normal camera flow ----------
  return (
    <>
      {/* Chips */}
      <View style={styles.chipsRow}>
        <CameraChip label={typeLabel} variant="accent" />
        <CameraChip label={gpsLabel} />
      </View>

      {/* Camera / preview */}
      <View style={styles.cameraArea}>
        {capturedUri ? (
          <>
            <Image source={{ uri: capturedUri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetake}
              activeOpacity={0.85}
            >
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
          </>
        ) : isWeb ? (
          <View style={styles.permissionBlock}>
            <Text style={styles.permissionTitle}>
              Camera preview not available on web
            </Text>
            <Text style={styles.permissionText}>
              Open the app on a mobile device to capture a photo, or proceed
              without one.
            </Text>
          </View>
        ) : (
          <>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              onCameraReady={() => setReady(true)}
              onMountError={(e) => console.warn("Camera mount error:", e)}
            />
            <ViewfinderOverlay hint="Fill the frame — include surroundings for context" />
          </>
        )}
      </View>

      {/* Action area */}
      {capturedUri ? (
        <View style={styles.shutterRow}>
          <TouchableOpacity
            style={styles.shutter}
            onPress={handleUsePhoto}
            activeOpacity={0.85}
          >
            <Text style={styles.shutterUseText}>USE</Text>
          </TouchableOpacity>
        </View>
      ) : isWeb ? (
        <View style={styles.shutterRow} />
      ) : (
        <View style={styles.shutterRow}>
          <TouchableOpacity
            style={[styles.shutter, !ready && styles.shutterDisabled]}
            onPress={takePicture}
            disabled={!ready}
            activeOpacity={0.85}
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>
      )}

      {/* Skip — always visible */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipButtonText}>Skip / Proceed Without Photo</Text>
      </TouchableOpacity>
    </>
  );
}
