
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createCommunityConflictReport } from "../../../services/reportService";
import { useAuth } from "../../../context/AuthContext";

import {
  saveReportOffline,
  startOfflineReportListener,
} from "../../../services/offlineReportService";

const ROUTES = {
  home: "/(tabs)/features/community-report",
  form: "/(tabs)/features/community-report/report-form",
  mine: "/(tabs)/features/community-report/my-reports",
};

const TABS = [
  { key: "home", label: "Community Report", icon: "home" },
  { key: "form", label: "Submit a Report", icon: "file-plus" },
  { key: "mine", label: "My Reports", icon: "copy" },
];

export default function ReportForm() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [manualLocation, setManualLocation] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [submittedReport, setSubmittedReport] = useState(null);
  const [savedOffline, setSavedOffline] = useState(false);

  const incidentTypes = [
    "Elephant Sighting",
    "Crop Raiding",
    "Other",
  ];

  // Listen for internet connection changes
  useEffect(() => {
    const unsubscribe = startOfflineReportListener();

    return () => {
      unsubscribe();
    };
  }, []);

  const goToCommunityReport = () => {
    router.replace(ROUTES.home);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "Please try again.");
    }
  };

  // Get current GPS location
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationDetected(false);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please allow location access to automatically detect your current location. You can also enter the location manually."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentLatitude = location.coords.latitude;
      const currentLongitude = location.coords.longitude;

      setLatitude(currentLatitude);
      setLongitude(currentLongitude);
      setLocationDetected(true);

      console.log("GPS Location:");
      console.log("Latitude:", currentLatitude);
      console.log("Longitude:", currentLongitude);
    } catch (error) {
      console.error("Location error:", error);

      Alert.alert(
        "Location Unavailable",
        "Unable to detect your current location. Please enter the location manually."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // Submit report
  const handleSubmit = async () => {
    if (!incidentType) {
      Alert.alert("Required", "Please select an incident type.");
      return;
    }

    // Require GPS or manual location
    if (!locationDetected && !manualLocation.trim()) {
      Alert.alert(
        "Required",
        "Please use your current location or enter the location manually."
      );
      return;
    }

    if (!user?.id) {
      Alert.alert(
        "Error",
        "You must be logged in to submit a report."
      );
      return;
    }

    try {
      setLoading(true);

      const reportData = {
        userId: user.id,
        incidentType,
        description,
        latitude,
        longitude,
        manualLocation: manualLocation.trim() || null,
      };

      // Check internet connection
      const networkState = await NetInfo.fetch();

      // Save locally if offline
      if (!networkState.isConnected) {
        await saveReportOffline(reportData);

        console.log(
          "Report saved locally because the device is offline."
        );

        setSavedOffline(true);
        return;
      }

      // Submit directly to Supabase if online
      const report = await createCommunityConflictReport(reportData);

      console.log("Report submitted successfully:", report);
      setSubmittedReport(report);
    } catch (error) {
      console.error("Report submission error:", error);

      Alert.alert(
        "Submission Failed",
        error?.message ||
          "Unable to submit your report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Offline success screen
  if (savedOffline) {
    return (
      <View style={styles.successScreen}>
        <View style={styles.successCard}>
          <View style={styles.offlineIconContainer}>
            <Feather name="check" size={34} color="#B7791F" />
          </View>

          <Text style={styles.successTitle}>
            Report Saved Offline
          </Text>

          <Text style={styles.successMessage}>
            There is currently no internet connection. Your report has
            been safely saved on this device.
          </Text>

          <View style={styles.offlineBox}>
            <Text style={styles.offlineTitle}>
              What happens next?
            </Text>

            <Text style={styles.offlineText}>
              The report will be automatically submitted to the system
              when the internet connection is restored.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.successButton}
            onPress={goToCommunityReport}
          >
            <Text style={styles.successButtonText}>
              Back to Community Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Online success screen
  if (submittedReport) {
    return (
      <View style={styles.successScreen}>
        <View style={styles.successCard}>
          <View style={styles.successIconContainer}>
            <Feather name="check" size={34} color="#218838" />
          </View>

          <Text style={styles.successTitle}>
            Report Submitted Successfully
          </Text>

          <Text style={styles.successMessage}>
            Your wildlife conflict report has been successfully
            submitted to the system.
          </Text>

          <View style={styles.reportIdBox}>
            <Text style={styles.reportIdLabel}>Report ID</Text>
            <Text style={styles.reportId}>
              {submittedReport.report_id}
            </Text>
          </View>

          <Text style={styles.successNote}>
            You can view this report and its current status under My
            Reports.
          </Text>

          <TouchableOpacity
            style={styles.successButton}
            onPress={goToCommunityReport}
          >
            <Text style={styles.successButtonText}>
              Back to Community Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Tab header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 14 },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map((tab) => {
            const active = tab.key === "form";

            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  active && styles.tabActive,
                ]}
                onPress={() =>
                  !active && router.replace(ROUTES[tab.key])
                }
              >
                <Feather
                  name={tab.icon}
                  size={16}
                  color={active ? "#FFFFFF" : "#5B6B63"}
                />

                <Text
                  style={[
                    styles.tabText,
                    active && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Submit a Report</Text>

        <View style={styles.topBarRight}>
          <View style={styles.avatar}>
            <Feather name="user" size={18} color="#235A47" />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={18} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={goToCommunityReport}
        >
          <Feather name="arrow-left" size={18} color="#5B6B63" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>COMMUNITY REPORTING</Text>

        <Text style={styles.title}>Submit a Report</Text>

        <Text style={styles.subtitle}>
          Report a wildlife incident in your community.
        </Text>

        {/* Incident Type: simple options without icons */}
        <Text style={styles.label}>Incident Type *</Text>

        <View style={styles.typeContainer}>
          {incidentTypes.map((type) => {
            const selected = incidentType === type;

            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selected && styles.selectedType,
                ]}
                activeOpacity={0.8}
                onPress={() => setIncidentType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selected && styles.selectedTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Location */}
        <Text style={styles.label}>Location *</Text>

        <TouchableOpacity
          style={[
            styles.locationButton,
            locationDetected && styles.locationDetectedButton,
          ]}
          onPress={getCurrentLocation}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <>
              <ActivityIndicator size="small" color="#235A47" />
              <Text style={styles.locationButtonText}>
                Detecting Location...
              </Text>
            </>
          ) : (
            <>
              <Feather
                name="map-pin"
                size={18}
                color={locationDetected ? "#218838" : "#14231C"}
              />

              <Text
                style={[
                  styles.locationButtonText,
                  locationDetected && { color: "#218838" },
                ]}
              >
                Use My Current Location
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* GPS result */}
        {locationDetected && (
          <View style={styles.gpsBox}>
            <Text style={styles.gpsTitle}>
              ✓ Location Detected
            </Text>

            <Text style={styles.gpsText}>
              Latitude: {latitude}
            </Text>

            <Text style={styles.gpsText}>
              Longitude: {longitude}
            </Text>
          </View>
        )}

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>
            OR enter location manually
          </Text>
          <View style={styles.orLine} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter village, landmark or location"
          placeholderTextColor="#8A9A92"
          value={manualLocation}
          onChangeText={setManualLocation}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Describe what happened..."
          placeholderTextColor="#8A9A92"
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Submitting..." : "Submit Report"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F8F4",
  },

  header: {
    backgroundColor: "#E3F5E8",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  tabRow: {
    gap: 8,
    paddingRight: 10,
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  tabActive: {
    backgroundColor: "#235A47",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5B6B63",
  },

  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E4EAE6",
  },

  topBarTitle: {
    fontSize: 14,
    color: "#5B6B63",
  },

  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D5EBDD",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#235A47",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  body: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 18,
  },

  backText: {
    fontSize: 15,
    color: "#5B6B63",
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#235A47",
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#14231C",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#5B6B63",
    marginBottom: 28,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14231C",
    marginBottom: 12,
    marginTop: 8,
  },

  /* Simple incident type options */
  typeContainer: {
    gap: 10,
    marginBottom: 20,
  },

  typeButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1EBE5",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },

  selectedType: {
    backgroundColor: "#E8F3EE",
    borderColor: "#235A47",
  },

  typeText: {
    fontSize: 15,
    color: "#5B6B63",
  },

  selectedTypeText: {
    color: "#235A47",
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#DDE7E1",
    marginVertical: 14,
  },

  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1EBE5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#235A47",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  locationDetectedButton: {
    backgroundColor: "#E8F7EE",
    borderColor: "#B7DFC5",
  },

  locationButtonText: {
    color: "#14231C",
    fontSize: 15,
    fontWeight: "600",
  },

  gpsBox: {
    backgroundColor: "#E8F7EE",
    borderWidth: 1,
    borderColor: "#B7DFC5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  gpsTitle: {
    color: "#218838",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
  },

  gpsText: {
    color: "#555555",
    fontSize: 13,
    marginTop: 3,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDE7E1",
  },

  orText: {
    marginHorizontal: 12,
    color: "#7A8A82",
    fontSize: 12,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1EBE5",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#14231C",
    marginBottom: 14,
  },

  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },

  submitButton: {
    backgroundColor: "#235A47",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Success screens */
  successScreen: {
    flex: 1,
    backgroundColor: "#F1F8F4",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  successCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1EBE5",
  },

  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F7EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  offlineIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF4D6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  offlineBox: {
    width: "100%",
    backgroundColor: "#FFF9E8",
    borderWidth: 1,
    borderColor: "#F0D98A",
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
  },

  offlineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8A6500",
    marginBottom: 7,
  },

  offlineText: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 19,
  },

  successTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#235A47",
    textAlign: "center",
    marginBottom: 12,
  },

  successMessage: {
    fontSize: 15,
    color: "#5B6B63",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },

  reportIdBox: {
    width: "100%",
    backgroundColor: "#E3F5E8",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 18,
  },

  reportIdLabel: {
    fontSize: 12,
    color: "#7A8A82",
    marginBottom: 5,
  },

  reportId: {
    fontSize: 18,
    fontWeight: "800",
    color: "#235A47",
  },

  successNote: {
    fontSize: 13,
    color: "#7A8A82",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },

  successButton: {
    width: "100%",
    backgroundColor: "#235A47",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  successButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});