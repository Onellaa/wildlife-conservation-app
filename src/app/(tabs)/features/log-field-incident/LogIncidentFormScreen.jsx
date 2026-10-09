// src/app/(tabs)/features/log-field-incident/LogIncidentFormScreen.jsx
import { useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import * as Crypto from "expo-crypto";

import LogIncidentHeader from "../../../../components/log-field-incident/LogIncidentHeader";
import GpsCaptureStep from "../../../../components/log-field-incident/steps/GpsCaptureStep";
import TypeSelectionStep from "../../../../components/log-field-incident/steps/TypeSelectionStep";
import PhotoCaptureStep from "../../../../components/log-field-incident/steps/PhotoCaptureStep";
import DescriptionStep from "../../../../components/log-field-incident/steps/DescriptionStep";
import ReviewStep from "../../../../components/log-field-incident/steps/ReviewStep";
import { logIncidentStyles as styles } from "../../../../styles/log-field-incident/logIncidentStyles";

import { useAuth } from "../../../../context/AuthContext";
import { usePatrol } from "../../../../context/log-field-incident/PatrolContext";
import { useNetworkStatus } from "../../../../hooks/log-field-incident/useNetworkStatus";
import { saveLocally } from "../../../../services/log-field-incident/incidentService";
import { syncPending } from "../../../../services/log-field-incident/syncService";

const TOTAL_STEPS = 4;

const createInitialFormData = () => ({
  latitude: null,
  longitude: null,
  locationSource: null,
  incidentType: null,
  photoUris: [],
  photoStatus: "attached",
  description: "",
});

export default function LogIncidentFormScreen() {
  const router = useRouter();
  const { user, profile, isRanger } = useAuth();
  const { activePatrol, refreshPatrolIncidents } = usePatrol();
  const { isOnline } = useNetworkStatus();

  const [step, setStep] = useState(1);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [capturedAt, setCapturedAt] = useState(() => new Date().toISOString());

  const [formData, setFormData] = useState(createInitialFormData);

  useFocusEffect(
    useCallback(() => {
      setStep(1);
      setShowReview(false);
      setSubmitting(false);
      setCapturedAt(new Date().toISOString());
      setFormData(createInitialFormData());
    }, []),
  );

  const handleBack = () => {
    if (showReview) {
      setShowReview(false);
      return;
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleForward = () => {
    if (step === 4) {
      setShowReview(true);
      return;
    }

    if (step === 3 && formData.photoUris.length === 0) {
      setFormData((prev) => ({
        ...prev,
        photoStatus: "missing_pending_upload",
      }));
    }

    setStep(step + 1);
  };

  const canGoForward =
    step === 1
      ? formData.latitude != null && formData.longitude != null
      : step === 2
        ? Boolean(formData.incidentType)
        : true;

  const initialGpsLocation = useMemo(() => {
    if (formData.latitude == null || formData.longitude == null) return null;
    return { latitude: formData.latitude, longitude: formData.longitude };
  }, [formData.latitude, formData.longitude]);

  const handleGpsLocationChange = useCallback((location) => {
    setFormData((prev) => {
      if (
        prev.latitude === location.latitude &&
        prev.longitude === location.longitude &&
        prev.locationSource === location.locationSource
      ) {
        return prev;
      }
      return { ...prev, ...location };
    });
  }, []);

  const handlePhotoChange = useCallback((photo) => {
    setFormData((prev) => ({
      ...prev,
      photoUris: photo.photoUris,
      photoStatus: photo.photoStatus,
    }));
  }, []);

  const handleGpsContinue = ({ latitude, longitude, locationSource }) => {
    setFormData((prev) => ({ ...prev, latitude, longitude, locationSource }));
    setStep(2);
  };

  const handleTypeContinue = ({ incidentType }) => {
    setFormData((prev) => ({ ...prev, incidentType }));
    setStep(3);
  };

  const handlePhotoContinue = ({ photoUris, photoStatus }) => {
    setFormData((prev) => ({ ...prev, photoUris, photoStatus }));
    setStep(4);
  };

  const handleDescriptionContinue = ({ description }) => {
    setFormData((prev) => ({ ...prev, description }));
    setShowReview(true);
  };

  const handleEdit = () => {
    setShowReview(false);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to log an incident.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Build the incident record
      const incident = {
        id: Crypto.randomUUID(),
        clientId: Crypto.randomUUID(),
        rangerId: user.id,
        patrolId: activePatrol?.id ?? null,
        parkId: profile?.assigned_park_id ?? null,
        incidentType: formData.incidentType,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        locationSource: formData.locationSource ?? "missing_requires_follow_up",
        photoStatus: formData.photoStatus ?? "missing_pending_upload",
        photoUris: formData.photoUris,
        capturedAt,
      };

      // 2. Save locally — always (this is the offline-first guarantee)
      await saveLocally(incident);
      refreshPatrolIncidents().catch((err) => {
        console.error("Could not refresh patrol incidents:", err);
      });

      // 3. If online, trigger sync in the background (don't block navigation)
      if (isOnline) {
        syncPending()
          .then(() => refreshPatrolIncidents())
          .catch((err) =>
            console.warn("Background sync or incident refresh failed:", err),
          );
      }

      // 4. Navigate to success screen with online/offline state
      router.replace({
        pathname:
          "/(tabs)/features/log-field-incident/LogIncidentSuccessScreen",
        params: {
          pending: isOnline ? "0" : "1",
          type: formData.incidentType ?? "",
        },
      });
    } catch (err) {
      console.error("Submit failed:", err);
      Alert.alert(
        "Could not save incident",
        err.message || "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const headerStep = showReview ? 4 : step;
  const headerTitle = showReview ? "Review Incident" : "Log Incident";

  if (!isRanger) return <Redirect href="/(tabs)" />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LogIncidentHeader
        step={headerStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        canGoBack={showReview || step > 1}
        onForward={showReview ? undefined : handleForward}
        canGoForward={canGoForward}
        syncStatus={isOnline ? "synced" : "offline"}
        title={headerTitle}
      />

      {!showReview && step === 1 && (
        <GpsCaptureStep
          initialLocation={initialGpsLocation}
          initialLocationSource={formData.locationSource}
          onLocationChange={handleGpsLocationChange}
          onContinue={handleGpsContinue}
        />
      )}
      {!showReview && step === 2 && (
        <TypeSelectionStep
          initialValue={formData.incidentType}
          onSelectionChange={(incidentType) =>
            setFormData((prev) => ({ ...prev, incidentType }))
          }
          onContinue={handleTypeContinue}
        />
      )}
      {!showReview && step === 3 && (
        <PhotoCaptureStep
          incidentType={formData.incidentType}
          locationSource={formData.locationSource}
          initialPhotoUri={formData.photoUris[0] ?? null}
          onPhotoChange={handlePhotoChange}
          onContinue={handlePhotoContinue}
        />
      )}
      {!showReview && step === 4 && (
        <DescriptionStep
          initialValue={formData.description}
          onChange={(description) =>
            setFormData((prev) => ({ ...prev, description }))
          }
          onContinue={handleDescriptionContinue}
        />
      )}
      {showReview && (
        <ReviewStep
          formData={formData}
          capturedAt={capturedAt}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </KeyboardAvoidingView>
  );
}
