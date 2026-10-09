import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  getAlertById,
  saveAlertResponse,
} from "../../../services/alertService";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

export default function ActionScreen() {
  const router = useRouter();

  const { id, action } = useLocalSearchParams();

  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAlert = async () => {
    try {
      const data = await getAlertById(id);
      setAlertData(data);
    } catch (error) {
      console.log("Error loading alert:", error);

      Alert.alert(
        "Unable to load alert",
        "The alert information could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadAlert();
      }
    }, [id]),
  );

  const actionConfig = useMemo(() => {
    switch (action) {
      case "INTERVENE":
        return {
          title: "Immediate Intervention",
          subtitle:
            "Proceed to the affected area and record your field response.",
          icon: "navigate",
          color: "#C0392B",
          background: "#FDEDEC",
          status: "RESPONDING",
          button: "START INTERVENTION",
          placeholder:
            "Describe the situation, actions taken, animal movement, safety concerns...",
        };

      case "MONITOR":
        return {
          title: "Monitor Animal",
          subtitle:
            "Observe the animal and record changes in movement or behaviour.",
          icon: "eye",
          color: "#176B4D",
          background: "#E8F5EE",
          status: "MONITORING",
          button: "SAVE MONITORING UPDATE",
          placeholder:
            "Example: Animal moving away from farmland towards forest boundary...",
        };

      case "COORDINATE":
        return {
          title: "Coordinate Response",
          subtitle:
            "Request support from field staff or community response teams.",
          icon: "people",
          color: "#6C4AA0",
          background: "#F0EAF8",
          status: "ESCALATED",
          button: "RECORD COORDINATION",
          placeholder:
            "Enter who was contacted, assistance requested, response team details...",
        };

      default:
        return {
          title: "Response",
          subtitle: "Record the response to this alert.",
          icon: "alert-circle",
          color: "#176B4D",
          background: "#E8F5EE",
          status: "RESPONDING",
          button: "SAVE RESPONSE",
          placeholder: "Enter response notes...",
        };
    }
  }, [action]);

  const handleSave = async () => {
    if (!notes.trim()) {
      Alert.alert(
        "Response notes required",
        "Please enter a short observation or response note before continuing.",
      );

      return;
    }

    try {
      setSaving(true);

      await saveAlertResponse({
        alertId: id,
        responseType: action,
        status: actionConfig.status,
        notes: notes.trim(),
      });

      router.push({
        pathname: "/alerts/resolution",
        params: {
          id,
        },
      });
    } catch (error) {
      console.log("Error saving response:", error);

      Alert.alert(
        "Unable to save",
        "The response could not be recorded. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#176B4D" />

        <Text style={styles.loadingText}>Loading alert...</Text>
      </View>
    );
  }

  if (!alertData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Alert could not be loaded.</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Field Response</Text>

          <Text style={styles.headerSubtitle}>Alert {id}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* SELECTED RESPONSE */}

        <View style={styles.actionCard}>
          <View
            style={[
              styles.actionIcon,
              {
                backgroundColor: actionConfig.background,
              },
            ]}
          >
            <Ionicons
              name={actionConfig.icon}
              size={32}
              color={actionConfig.color}
            />
          </View>

          <View style={styles.actionText}>
            <Text style={styles.actionLabel}>SELECTED RESPONSE</Text>

            <Text style={styles.actionTitle}>{actionConfig.title}</Text>

            <Text style={styles.actionDescription}>
              {actionConfig.subtitle}
            </Text>
          </View>
        </View>

        {/* ALERT SUMMARY */}

        <Text style={styles.sectionTitle}>Alert Summary</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Ionicons name="paw-outline" size={21} color="#176B4D" />
            </View>

            <View>
              <Text style={styles.summaryLabel}>Animal</Text>

              <Text style={styles.summaryValue}>
                {alertData.animals?.species} {alertData.animals?.animal_code}
              </Text>
            </View>
          </View>

          <View style={styles.line} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Ionicons name="location-outline" size={21} color="#176B4D" />
            </View>

            <View style={styles.flex}>
              <Text style={styles.summaryLabel}>High-Risk Zone</Text>

              <Text style={styles.summaryValue}>
                {alertData.high_risk_zones?.zone_name}
              </Text>
            </View>
          </View>

          <View style={styles.line} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time-outline" size={21} color="#176B4D" />
            </View>

            <View>
              <Text style={styles.summaryLabel}>Last GPS Update</Text>

              <Text style={styles.summaryValue}>
                {new Date(alertData.alert_time).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* GPS WARNING */}

        <View style={styles.locationCard}>
          <View style={styles.locationTop}>
            <View>
              <Text style={styles.locationTitle}>Current Animal Location</Text>

              <Text style={styles.coordinates}>
                {alertData.latitude}, {alertData.longitude}
              </Text>
            </View>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color="#63736B"
            />

            <Text style={styles.locationInfoText}>
              Location data was updated recently. Always assess field conditions
              before approaching the animal.
            </Text>
          </View>
        </View>

        {/* NOTES */}

        <Text style={styles.sectionTitle}>Response Notes</Text>

        <Text style={styles.notesHelper}>
          Record observations and actions taken. These notes will become part of
          the alert response history.
        </Text>

        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder={actionConfig.placeholder}
          placeholderTextColor="#999999"
          multiline
          maxLength={500}
          textAlignVertical="top"
        />

        <Text style={styles.characterCount}>{notes.length}/500</Text>

        {/* CURRENT STATUS */}

        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Status after submission</Text>

            <Text style={styles.statusValue}>{actionConfig.status}</Text>
          </View>

          <Ionicons
            name="arrow-forward-circle"
            size={30}
            color={actionConfig.color}
          />
        </View>

        {/* SAVE */}

        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.disabledButton]}
          disabled={saving}
          onPress={handleSave}
        >
          {saving ? (
            <Text style={styles.primaryButtonText}>SAVING...</Text>
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                {actionConfig.button}
              </Text>

              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F5",
  },

  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8F5",
  },

  loadingText: {
    marginTop: 10,
    color: "#66736D",
  },
  header: {
    backgroundColor: "#176B4D",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 21,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#CDE2D9",
    fontSize: 12,
    marginTop: 2,
  },

  content: {
    padding: 18,
    paddingBottom: 50,
  },

  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  actionIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: {
    flex: 1,
    marginLeft: 15,
  },

  actionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#8A9690",
    letterSpacing: 0.7,
  },

  actionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#20332B",
    marginTop: 3,
  },

  actionDescription: {
    color: "#6A7771",
    lineHeight: 18,
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#20332B",
    marginBottom: 11,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    paddingHorizontal: 16,
    marginBottom: 17,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  summaryRow: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#EBF5F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryLabel: {
    fontSize: 11,
    color: "#87918C",
  },

  summaryValue: {
    fontSize: 14,
    color: "#273731",
    fontWeight: "700",
    marginTop: 2,
  },

  line: {
    height: 1,
    backgroundColor: "#EEF0EF",
  },

  locationCard: {
    backgroundColor: "#EEF5F1",
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },

  locationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#294438",
  },

  coordinates: {
    color: "#607169",
    marginTop: 4,
    fontSize: 12,
  },

  liveBadge: {
    backgroundColor: "#DDF1E4",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#25A55F",
    marginRight: 5,
  },

  liveText: {
    color: "#1B8150",
    fontSize: 10,
    fontWeight: "900",
  },

  locationInfo: {
    flexDirection: "row",
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#DCE8E1",
    paddingTop: 12,
  },

  locationInfoText: {
    flex: 1,
    marginLeft: 8,
    color: "#63736B",
    fontSize: 11,
    lineHeight: 16,
  },

  notesHelper: {
    color: "#748079",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },

  notesInput: {
    minHeight: 145,
    borderWidth: 1.5,
    borderColor: "#DDE3DF",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
    color: "#26362F",
  },

  characterCount: {
    textAlign: "right",
    color: "#939B97",
    fontSize: 11,
    marginTop: 5,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E7EBE8",
  },

  statusLabel: {
    color: "#7A8680",
    fontSize: 11,
  },

  statusValue: {
    fontSize: 15,
    color: "#26372F",
    fontWeight: "900",
    marginTop: 3,
  },

  primaryButton: {
    marginTop: 25,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#176B4D",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
    marginRight: 9,
  },
});
