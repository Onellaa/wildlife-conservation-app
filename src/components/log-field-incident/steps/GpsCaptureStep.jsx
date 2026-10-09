// src/components/log-field-incident/steps/GpsCaptureStep.jsx
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  MapPin,
  Map as MapIcon,
  SkipForward,
  AlertCircle,
  Edit3,
} from "lucide-react-native";
import MapView, { Marker } from "react-native-maps";

import { useGpsCapture } from "../../../hooks/log-field-incident/useGpsCapture";
import { useGpsCaptureValidation } from "../../../hooks/log-field-incident/useGpsCaptureValidation";
import { logIncidentStyles as styles } from "../../../styles/log-field-incident/logIncidentStyles";
import { COLORS } from "../../../styles/log-field-incident/activePatrolStyles";

export default function GpsCaptureStep({
  initialLocation,
  initialLocationSource,
  onLocationChange,
  onContinue,
}) {
  const initialLocationRef = useRef(initialLocation);
  const initialLocationSourceRef = useRef(initialLocationSource);
  const hasSavedLocation =
    initialLocationRef.current?.latitude != null &&
    initialLocationRef.current?.longitude != null;
  const { location, isLocating, isUnavailable, hasFix, buildResult, retry } =
    useGpsCapture({
      initialLocation: hasSavedLocation ? initialLocationRef.current : null,
      autoAcquire: !hasSavedLocation,
    });

  const [manualMode, setManualMode] = useState(false);
  const [manualCoord, setManualCoord] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!location) return;
    onLocationChange?.({
      latitude: location.latitude,
      longitude: location.longitude,
      locationSource:
        location === initialLocationRef.current
          ? (initialLocationSourceRef.current ?? "auto_gps")
          : "auto_gps",
    });
  }, [location, onLocationChange]);

  // Validation is one job, one file (SRP).
  const { canContinue, showContinue, errorMessage } = useGpsCaptureValidation({
    isLocating,
    isUnavailable,
    hasFix,
    manualMode,
    manualCoord,
  });

  // ---------- Handlers ----------
  const handleMapPress = (e) => {
    if (!manualMode) return;
    const coordinate = e.nativeEvent.coordinate;
    setManualCoord(coordinate);
    onLocationChange?.({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      locationSource: "manual",
    });
    setShowError(false);
  };

  const handleContinue = () => {
    if (!canContinue) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onContinue(buildResult(manualCoord));
  };

  const handleManualToggle = () => {
    setManualMode(true);
    setManualCoord(null);
    setShowError(false);
  };

  const handleManualCancel = () => {
    setManualMode(false);
    setManualCoord(null);
    if (location) {
      onLocationChange?.({
        latitude: location.latitude,
        longitude: location.longitude,
        locationSource:
          location === initialLocationRef.current
            ? (initialLocationSourceRef.current ?? "auto_gps")
            : "auto_gps",
      });
    }
    setShowError(false);
  };

  const handleReacquire = () => {
    retry();
  };

  const handleProceedWithout = () => {
    setShowError(false);
    onContinue(buildResult(null));
  };

  // ---------- Map region ----------
  const region = manualMode
    ? location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : {
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }
    : location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      : {
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 1,
          longitudeDelta: 1,
        };

  // ---------- Status message ----------
  const statusMessage = manualMode
    ? "Tap the map to mark the incident location"
    : isLocating
      ? "Locating your position…"
      : isUnavailable
        ? "Location unavailable"
        : "Position found";

  const displayCoord = manualCoord || location;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        {/* Map */}
        <View style={styles.mapArea}>
          {Platform.OS !== "web" ? (
            <MapView
              style={StyleSheet.absoluteFillObject}
              region={region}
              onPress={manualMode ? handleMapPress : undefined}
              showsUserLocation={false}
              showsMyLocationButton={false}
              scrollEnabled={manualMode}
              zoomEnabled={manualMode}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              {hasFix && !manualMode && (
                <Marker coordinate={location} pinColor={COLORS.accent} />
              )}
              {manualCoord && (
                <Marker
                  coordinate={manualCoord}
                  pinColor={COLORS.primary}
                  title="Manually marked"
                />
              )}
            </MapView>
          ) : (
            <>
              <View style={styles.mapDark} />
              <View style={styles.gpsPulse} />
              <View style={styles.gpsMarker}>
                <MapPin size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </>
          )}

          <View style={styles.mapInstruction}>
            <Text style={styles.mapInstructionText}>{statusMessage}</Text>
          </View>
        </View>

        {/* Coordinates card */}
        <View style={styles.coordCard}>
          <Text style={styles.coordLabel}>
            {manualCoord ? "MANUALLY MARKED" : "COORDINATES"}
          </Text>
          <Text style={styles.coordValue}>
            {displayCoord
              ? `${displayCoord.latitude.toFixed(5)}°N, ${displayCoord.longitude.toFixed(5)}°E`
              : isLocating
                ? "Acquiring…"
                : "—"}
          </Text>
          <Text style={styles.coordHint}>
            {manualMode
              ? "Tap the map to drop a pin. Adjust before continuing."
              : hasFix
                ? "Make sure this is where the incident occurred."
                : "You can mark the location manually or proceed without."}
          </Text>
        </View>

        {hasSavedLocation && !manualMode && (
          <TouchableOpacity
            style={styles.outlinedButton}
            onPress={handleReacquire}
            disabled={isLocating}
            activeOpacity={0.7}
          >
            {isLocating ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <MapPin size={18} color={COLORS.primary} strokeWidth={2.5} />
            )}
            <Text style={styles.outlinedButtonText}>
              {isLocating ? "Reacquiring location…" : "Reacquire location"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Override — shown when GPS works and not in manual mode */}
        {hasFix && !manualMode && (
          <TouchableOpacity
            style={styles.overrideButton}
            onPress={handleManualToggle}
            activeOpacity={0.7}
          >
            <Edit3 size={16} color={COLORS.primary} strokeWidth={2.5} />
            <Text style={styles.overrideButtonText}>
              Not where it happened? Mark manually
            </Text>
          </TouchableOpacity>
        )}

        {/* Manual fallback — shown when GPS unavailable and not in manual mode */}
        {isUnavailable && !manualMode && (
          <TouchableOpacity
            style={styles.outlinedButton}
            onPress={handleManualToggle}
            activeOpacity={0.7}
          >
            <MapIcon size={18} color={COLORS.primary} strokeWidth={2.5} />
            <Text style={styles.outlinedButtonText}>
              Mark location manually
            </Text>
          </TouchableOpacity>
        )}

        {/* Inline validation error */}
        {showError && errorMessage && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={COLORS.danger} strokeWidth={2.5} />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        )}

        {/* Primary Continue */}
        {showContinue && (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !canContinue && styles.primaryButtonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            {isLocating && !manualMode ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Cancel manual mode */}
        {manualMode && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleManualCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.linkButtonText}>Cancel manual marking</Text>
          </TouchableOpacity>
        )}

        {/* ALWAYS-VISIBLE fallback: proceed without location */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleProceedWithout}
          activeOpacity={0.7}
        >
          <SkipForward size={14} color={COLORS.textMuted} strokeWidth={2.5} />
          <Text style={styles.linkButtonText}>Proceed without location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
