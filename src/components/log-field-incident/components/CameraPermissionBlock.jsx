// src/components/log-field-incident/CameraPermissionBlock.jsx
import { View, Text, TouchableOpacity, Platform, Linking } from "react-native";
import { CameraOff, Settings as SettingsIcon } from "lucide-react-native";
import { photoCaptureStyles as styles } from "../../../styles/log-field-incident/photoCaptureStyles";
import { COLORS } from "../../../styles/log-field-incident/activePatrolStyles";

export default function CameraPermissionBlock({
  canAskAgain,
  onRequestPermission,
  onSkip,
}) {
  const handleOpenSettings = () => {
    if (Platform.OS === "ios") Linking.openURL("app-settings:");
    else if (Platform.OS === "android") Linking.openSettings();
  };

  return (
    <>
      <View style={styles.permissionBlock}>
        <CameraOff size={56} color={COLORS.textMuted} strokeWidth={1.5} />
        <Text style={styles.permissionTitle}>Camera access denied</Text>
        <Text style={styles.permissionText}>
          {canAskAgain
            ? "Please allow camera access to capture the incident photo. Or proceed without a photo — the incident will be flagged for follow-up."
            : "Camera access was denied. Enable it in your device settings, or proceed without a photo."}
        </Text>

        {canAskAgain ? (
          <TouchableOpacity
            style={styles.permissionPrimary}
            onPress={onRequestPermission}
            activeOpacity={0.85}
          >
            <Text style={styles.permissionPrimaryText}>
              Allow camera access
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.permissionPrimary}
            onPress={handleOpenSettings}
            activeOpacity={0.85}
          >
            <SettingsIcon size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.permissionPrimaryText}>
              Open device settings
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Skip is ALWAYS available — the ranger is never blocked */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={onSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipButtonText}>Skip / Proceed Without Photo</Text>
      </TouchableOpacity>
    </>
  );
}
