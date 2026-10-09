import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../../../../../lib/supabase";

export default function ReportDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("community_conflict_reports")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching report:", error);

        setMessage("Unable to load the report.");
        setMessageType("error");

        return;
      }

      setReport(data);
    } catch (error) {
      console.error("Unexpected error:", error);

      setMessage("Something went wrong while loading the report.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const updateStatus = async (newStatus) => {
    if (!report) {
      return;
    }

    try {
      setUpdating(true);
      setMessage("");
      setMessageType("");

      console.log("Updating report:", report.id);
      console.log("New status:", newStatus);

      const { data, error } = await supabase
        .from("community_conflict_reports")
        .update({
          status: newStatus,
        })
        .eq("id", report.id)
        .select()
        .single();

      console.log("UPDATE DATA:", data);
      console.log("UPDATE ERROR:", error);

      if (error) {
        setMessage(`Update failed: ${error.message}`);
        setMessageType("error");

        return;
      }

      if (!data) {
        setMessage(
          "The report was not updated. No data was returned."
        );
        setMessageType("error");

        return;
      }

      setReport(data);

      setMessage(
        `Report status successfully changed to ${newStatus}.`
      );
      setMessageType("success");
    } catch (error) {
      console.error("Unexpected update error:", error);

      setMessage(
        `Something went wrong: ${error.message || "Unknown error"}`
      );
      setMessageType("error");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return {
          backgroundColor: "#E8F1FF",
          color: "#2563EB",
        };

      case "IN_PROGRESS":
        return {
          backgroundColor: "#FFF4D6",
          color: "#B7791F",
        };

      case "RESOLVED":
        return {
          backgroundColor: "#E8F7EE",
          color: "#218838",
        };

      default:
        return {
          backgroundColor: "#F1F1F1",
          color: "#666666",
        };
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#235A47"
        />

        <Text style={styles.loadingText}>
          Loading report...
        </Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIconWrap}>
          <Feather
            name="alert-circle"
            size={28}
            color="#235A47"
          />
        </View>

        <Text style={styles.errorText}>
          Report could not be found.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.replace(
              "/(tabs)/features/officer/dashboard"
            )
          }
        >
          <Feather
            name="arrow-left"
            size={18}
            color="#5B6B63"
          />
          <Text style={styles.backText}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusStyle = getStatusStyle(report.status);

  const inProgressDisabled =
    updating ||
    report.status === "IN_PROGRESS" ||
    report.status === "RESOLVED";

  const resolvedDisabled =
    updating || report.status === "RESOLVED";

  return (
    <View style={styles.screen}>
      {/* Green header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 14 },
        ]}
      >
        <Text style={styles.headerTitle}>
          Community{"\n"}Conflict Report
        </Text>

        <View style={styles.tab}>
          <Feather
            name="file-text"
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.tabText}>
            Report Details
          </Text>
        </View>
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>
          Report Details
        </Text>

        <View style={styles.avatar}>
          <Feather
            name="user"
            size={18}
            color="#235A47"
          />
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.replace(
              "/(tabs)/features/officer/dashboard"
            )
          }
        >
          <Feather
            name="arrow-left"
            size={18}
            color="#5B6B63"
          />
          <Text style={styles.backText}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>
          COMMUNITY REPORTING
        </Text>

        {/* Title */}
        <Text style={styles.title}>
          Report Details
        </Text>

        {/* Message */}
        {message ? (
          <View
            style={[
              styles.messageBox,
              messageType === "success"
                ? styles.successMessage
                : styles.errorMessage,
            ]}
          >
            <Feather
              name={
                messageType === "success"
                  ? "check-circle"
                  : "alert-circle"
              }
              size={18}
              color={
                messageType === "success"
                  ? "#218838"
                  : "#C62828"
              }
            />
            <Text
              style={[
                styles.messageText,
                messageType === "success"
                  ? styles.successText
                  : styles.errorMessageText,
              ]}
            >
              {message}
            </Text>
          </View>
        ) : null}

        {/* Report ID + Status */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>
                Report ID
              </Text>

              <Text style={styles.reportId}>
                {report.report_id}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    statusStyle.backgroundColor,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      statusStyle.color,
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: statusStyle.color,
                  },
                ]}
              >
                {report.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Incident Type */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Incident Type
          </Text>

          <Text style={styles.valueStrong}>
            {report.incident_type}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Location
          </Text>

          <View style={styles.iconRow}>
            <Feather
              name="map-pin"
              size={16}
              color="#5B6B63"
              style={styles.rowIcon}
            />
            <Text style={styles.valueFlex}>
              {report.manual_location
                ? report.manual_location
                : report.latitude !== null &&
                  report.longitude !== null
                ? "GPS Location Detected"
                : "Location not provided"}
            </Text>
          </View>

          {report.latitude !== null &&
          report.longitude !== null ? (
            <Text style={styles.coordinates}>
              Coordinates: {report.latitude},{" "}
              {report.longitude}
            </Text>
          ) : null}
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Description
          </Text>

          <Text style={styles.value}>
            {report.description ||
              "No description provided."}
          </Text>
        </View>

        {/* Reporting Channel */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Reporting Channel
          </Text>

          <Text style={styles.value}>
            {report.reporting_channel}
          </Text>
        </View>

        {/* Submitted */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Submitted
          </Text>

          <View style={styles.iconRow}>
            <Feather
              name="clock"
              size={15}
              color="#7A8A82"
              style={styles.rowIcon}
            />
            <Text style={styles.valueFlex}>
              {new Date(
                report.created_at
              ).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Status Actions */}
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Update Report Status
        </Text>

        {/* In Progress */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.progressButton,
            inProgressDisabled &&
              styles.disabledButton,
          ]}
          disabled={inProgressDisabled}
          onPress={() =>
            updateStatus("IN_PROGRESS")
          }
        >
          <Feather
            name="clock"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.actionButtonText}>
            {report.status === "IN_PROGRESS"
              ? "Currently In Progress"
              : report.status === "RESOLVED"
              ? "Report Already Resolved"
              : "Mark as In Progress"}
          </Text>
        </TouchableOpacity>

        {/* Resolved */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.resolveButton,
            resolvedDisabled &&
              styles.disabledButton,
          ]}
          disabled={resolvedDisabled}
          onPress={() =>
            updateStatus("RESOLVED")
          }
        >
          <Feather
            name="check-circle"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.actionButtonText}>
            {report.status === "RESOLVED"
              ? "Report Resolved"
              : "Mark as Resolved"}
          </Text>
        </TouchableOpacity>

        {updating ? (
          <View style={styles.updatingContainer}>
            <ActivityIndicator
              size="small"
              color="#235A47"
            />

            <Text style={styles.updatingText}>
              Updating report...
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F8F4",
  },

  /* Header */
  header: {
    backgroundColor: "#E3F5E8",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#235A47",
    lineHeight: 28,
    marginBottom: 14,
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: "#235A47",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Top bar */
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

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D5EBDD",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Body */
  body: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F8F4",
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    color: "#5B6B63",
  },

  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D5EBDD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  errorText: {
    fontSize: 16,
    color: "#5B6B63",
    marginBottom: 20,
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
    marginBottom: 22,
  },

  /* Message */
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },

  successMessage: {
    backgroundColor: "#E8F7EE",
    borderColor: "#B7DFC5",
  },

  errorMessage: {
    backgroundColor: "#FDECEC",
    borderColor: "#F5B5B5",
  },

  messageText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  successText: {
    color: "#218838",
  },

  errorMessageText: {
    color: "#C62828",
  },

  /* Info cards */
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1EBE5",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#235A47",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowIcon: {
    marginRight: 8,
  },

  label: {
    fontSize: 12,
    color: "#7A8A82",
    fontWeight: "600",
    marginBottom: 8,
  },

  reportId: {
    fontSize: 18,
    color: "#235A47",
    fontWeight: "800",
  },

  value: {
    fontSize: 15,
    color: "#3C4A43",
    lineHeight: 22,
  },

  valueFlex: {
    flex: 1,
    fontSize: 15,
    color: "#3C4A43",
    lineHeight: 22,
  },

  valueStrong: {
    fontSize: 20,
    fontWeight: "800",
    color: "#14231C",
  },

  coordinates: {
    fontSize: 12,
    color: "#7A8A82",
    marginTop: 10,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#DDE7E1",
    marginVertical: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#14231C",
    marginBottom: 14,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  progressButton: {
    backgroundColor: "#B7791F",
  },

  resolveButton: {
    backgroundColor: "#235A47",
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.5,
  },

  updatingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  updatingText: {
    marginLeft: 8,
    color: "#5B6B63",
    fontSize: 14,
  },
});