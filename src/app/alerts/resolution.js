import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  getAlertById,
  getAlertResponses,
  resolveAlert,
} from "../services/alertService";

export default function ResolutionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [alertData, setAlertData] = useState(null);

  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const [resolving, setResolving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [currentAlert, responseHistory] = await Promise.all([
        getAlertById(id),
        getAlertResponses(id),
      ]);

      setAlertData(currentAlert);
      setResponses(responseHistory || []);
    } catch (error) {
      console.log("Error loading response summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadData();
      }
    }, [id]),
  );

  const latestResponse =
    responses.length > 0 ? responses[responses.length - 1] : null;

  const getActionName = (responseType) => {
    switch (responseType) {
      case "MONITOR":
        return "Monitor Animal";

      case "INTERVENE":
        return "Immediate Intervention";

      case "COORDINATE":
        return "Coordinate Response";

      case "RESOLVE":
        return "Resolve Alert";

      default:
        return "Response";
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(dateValue).toLocaleString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#176B4D" />

        <Text style={styles.loadingText}>Loading response...</Text>
      </View>
    );
  }

  if (!alertData) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={55} color="#C62828" />

        <Text style={styles.errorTitle}>Response Not Available</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/alerts")}
        >
          <Text style={styles.primaryButtonText}>RETURN TO ALERTS</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const handleResolveAlert = async () => {
    if (!resolutionNotes.trim()) {
      Alert.alert(
        "Resolution note required",
        "Please enter a final note explaining why the alert can be resolved.",
      );

      return;
    }

    try {
      setResolving(true);

      await resolveAlert(id, resolutionNotes.trim());

      Alert.alert(
        "Alert Resolved",
        "The high-risk alert has been successfully resolved.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/alerts"),
          },
        ],
      );
    } catch (error) {
      console.log("Error resolving alert:", error);

      Alert.alert(
        "Unable to Resolve",
        "The alert could not be resolved. Please try again.",
      );
    } finally {
      setResolving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* SUCCESS */}

        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={50} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Response Recorded</Text>

        <Text style={styles.subtitle}>
          Your field response has been successfully recorded.
        </Text>

        {/* SUMMARY */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Response Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Alert</Text>

            <Text style={styles.value}>
              #{alertData.id?.substring(0, 8).toUpperCase()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Animal</Text>

            <Text style={styles.value}>
              {alertData.animals?.species || ""}{" "}
              {alertData.animals?.animal_code || "Unknown"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Response</Text>

            <Text style={styles.value}>
              {latestResponse
                ? getActionName(latestResponse.response_type)
                : "Not available"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Current Status</Text>

            <Text style={styles.status}>{alertData.status}</Text>
          </View>
        </View>

        {/* OFFICER NOTES */}

        <View style={styles.notesCard}>
          <Text style={styles.cardTitle}>Officer Notes</Text>

          <Text style={styles.notes}>
            {latestResponse?.notes || "No response notes available."}
          </Text>

          {latestResponse?.created_at && (
            <Text style={styles.noteTime}>
              Recorded: {formatDateTime(latestResponse.created_at)}
            </Text>
          )}
        </View>

        {/* RESPONSE HISTORY */}

        <Text style={styles.timelineTitle}>Response Timeline</Text>

        <View style={styles.timeline}>
          <TimelineItem
            title="Alert generated"
            subtitle={formatDateTime(alertData.alert_time)}
            completed
          />

          <TimelineItem
            title="Alert acknowledged"
            subtitle={
              alertData.acknowledged_at
                ? formatDateTime(alertData.acknowledged_at)
                : "Not recorded"
            }
            completed={!!alertData.acknowledged_at}
          />

          {responses.map((response, index) => (
            <TimelineItem
              key={response.id}
              title={getActionName(response.response_type)}
              subtitle={formatDateTime(response.created_at)}
              completed
              last={index === responses.length - 1}
            />
          ))}
        </View>

        {/* ACTIVE ALERT NOTICE */}

        {alertData.status !== "RESOLVED" && (
          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#796411"
            />

            <Text style={styles.noticeText}>
              The alert remains active. Continue monitoring or responding until
              the risk has been fully managed.
            </Text>
          </View>
        )}

        {alertData.status !== "RESOLVED" && (
          <View style={styles.resolveCard}>
            <View style={styles.resolveHeader}>
              <View style={styles.resolveIcon}>
                <Ionicons
                  name="checkmark-done-outline"
                  size={25}
                  color="#176B4D"
                />
              </View>

              <View style={styles.resolveHeaderText}>
                <Text style={styles.resolveTitle}>Resolve Alert</Text>

                <Text style={styles.resolveDescription}>
                  Only resolve this alert when the immediate risk has been fully
                  managed.
                </Text>
              </View>
            </View>

            <Text style={styles.resolveLabel}>Final Resolution Note</Text>

            <TextInput
              style={styles.resolveInput}
              value={resolutionNotes}
              onChangeText={setResolutionNotes}
              placeholder="Example: Animal moved safely back towards the forest and no further risk was observed."
              placeholderTextColor="#999999"
              multiline
              maxLength={500}
              textAlignVertical="top"
            />

            <Text style={styles.characterCount}>
              {resolutionNotes.length}/500
            </Text>

            <TouchableOpacity
              style={[
                styles.resolveButton,
                resolving && styles.resolveButtonDisabled,
              ]}
              onPress={handleResolveAlert}
              disabled={resolving}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.resolveButtonText}>
                {resolving ? "RESOLVING..." : "RESOLVE ALERT"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* RESOLVED MESSAGE */}

        {alertData.status === "RESOLVED" && (
          <View style={styles.resolvedNotice}>
            <Ionicons name="checkmark-circle" size={23} color="#176B4D" />

            <Text style={styles.resolvedNoticeText}>
              This alert has been resolved.
            </Text>
          </View>
        )}

        {/* RETURN */}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/alerts")}
        >
          <Text style={styles.primaryButtonText}>RETURN TO ALERTS</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function TimelineItem({ title, subtitle, completed, last }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeft}>
        <View
          style={[styles.timelineDot, completed && styles.timelineDotCompleted]}
        >
          {completed && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
        </View>

        {!last && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.timelineContent}>
        <Text style={styles.timelineText}>{title}</Text>

        {subtitle ? (
          <Text style={styles.timelineSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F5",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8F5",
    padding: 25,
  },

  loadingText: {
    marginTop: 10,
    color: "#68766F",
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    color: "#293A32",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  successCircle: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#176B4D",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
    color: "#1E332A",
    marginTop: 18,
  },
  resolveCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 18,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  resolveHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  resolveIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#E5F4EB",
    justifyContent: "center",
    alignItems: "center",
  },

  resolveHeaderText: {
    flex: 1,
    marginLeft: 12,
  },

  resolveTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#174B37",
  },

  resolveDescription: {
    fontSize: 11,
    color: "#758079",
    lineHeight: 16,
    marginTop: 3,
  },

  resolveLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#34473E",
    marginBottom: 8,
  },

  resolveInput: {
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: "#DDE3DF",
    backgroundColor: "#FAFBFA",
    borderRadius: 14,
    padding: 14,
    fontSize: 13,
    color: "#26362F",
  },

  characterCount: {
    textAlign: "right",
    color: "#939B97",
    fontSize: 10,
    marginTop: 5,
  },

  resolveButton: {
    backgroundColor: "#176B4D",
    height: 54,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  resolveButtonDisabled: {
    opacity: 0.6,
  },

  resolveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 8,
  },

  subtitle: {
    textAlign: "center",
    color: "#77817C",
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  notesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#174B37",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },

  label: {
    color: "#7C8781",
    fontSize: 13,
  },

  value: {
    maxWidth: "60%",
    textAlign: "right",
    fontWeight: "700",
    color: "#293831",
  },

  status: {
    fontWeight: "900",
    color: "#176B4D",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF0EF",
    marginVertical: 6,
  },

  notes: {
    color: "#53605A",
    lineHeight: 21,
  },

  noteTime: {
    color: "#929B96",
    fontSize: 10,
    marginTop: 13,
  },

  timelineTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#21352C",
    marginBottom: 15,
  },

  timeline: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 5,
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 65,
  },

  timelineLeft: {
    width: 35,
    alignItems: "center",
  },

  timelineDot: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#BAC4BF",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  timelineDotCompleted: {
    backgroundColor: "#176B4D",
    borderColor: "#176B4D",
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#CDE0D7",
  },

  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },

  timelineText: {
    color: "#394940",
    fontWeight: "700",
  },

  timelineSubtitle: {
    color: "#8A948F",
    fontSize: 10,
    marginTop: 4,
  },

  notice: {
    backgroundColor: "#FFF7D9",
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    marginTop: 18,
  },

  noticeText: {
    flex: 1,
    marginLeft: 9,
    color: "#74621A",
    fontSize: 12,
    lineHeight: 18,
  },

  resolvedNotice: {
    backgroundColor: "#E5F4EB",
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  resolvedNoticeText: {
    marginLeft: 9,
    color: "#176B4D",
    fontSize: 12,
    fontWeight: "700",
  },

  primaryButton: {
    minHeight: 56,
    marginTop: 25,
    borderRadius: 14,
    backgroundColor: "#176B4D",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
});
