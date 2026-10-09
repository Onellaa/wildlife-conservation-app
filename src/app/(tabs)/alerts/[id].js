import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  getAlertById,
  acknowledgeAlert as acknowledgeAlertService,
} from "../../services/alertService";

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(false);

  /*
   * Load selected alert from Supabase
   */
  const loadAlert = async () => {
    try {
      setLoading(true);

      const data = await getAlertById(id);

      setAlertData(data);
    } catch (error) {
      console.log("Error loading alert:", error);

      Alert.alert(
        "Unable to Load Alert",
        "The alert details could not be loaded. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Reload whenever this screen becomes active
   */
  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadAlert();
      }
    }, [id]),
  );

  /*
   * Acknowledge alert
   */
  const handleAcknowledge = async () => {
    try {
      setAcknowledging(true);

      await acknowledgeAlertService(id);

      router.push({
        pathname: "/alerts/response",
        params: {
          id,
        },
      });
    } catch (error) {
      console.log("Error acknowledging alert:", error);

      Alert.alert(
        "Unable to Acknowledge",
        "The alert could not be acknowledged. Please try again.",
      );
    } finally {
      setAcknowledging(false);
    }
  };

  /*
   * If alert was already acknowledged,
   * don't acknowledge it again.
   */
  const handleContinueResponse = () => {
    router.push({
      pathname: "/alerts/response",
      params: {
        id,
      },
    });
  };

  /*
   * Date formatting
   */
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(dateValue).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
   * Time formatting
   */
  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(dateValue).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * Loading screen
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#176B4D" />

        <Text style={styles.loadingText}>Loading alert details...</Text>
      </View>
    );
  }

  /*
   * Alert missing
   */
  if (!alertData) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={55} color="#C62828" />

        <Text style={styles.errorTitle}>Alert Not Found</Text>

        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => router.replace("/alerts")}
        >
          <Text style={styles.returnButtonText}>RETURN TO ALERTS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const alert = alertData;

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Alert Details</Text>

          <Text style={styles.headerSubtitle}>
            Review the situation before responding
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ANIMAL HERO IMAGE */}

        <View style={styles.heroCard}>
          <Image
            source={require("../../../../assets/alerts/elephant-raja.jpg")}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.heroOverlay}>
            <View>
              <Text style={styles.heroAnimalName}>
                {alert.animals?.name || "Tracked Animal"}
              </Text>

              <Text style={styles.heroAnimalMeta}>
                {alert.animals?.species || "Unknown Species"}
                {alert.animals?.animal_code
                  ? ` · ${alert.animals.animal_code}`
                  : ""}
              </Text>
            </View>

            <View style={styles.heroRiskBadge}>
              <Ionicons name="warning" size={14} color="#FFFFFF" />

              <Text style={styles.heroRiskText}>{alert.risk_level}</Text>
            </View>
          </View>
        </View>

        {/* RISK CARD */}

        <View style={styles.riskCard}>
          <View style={styles.warningCircle}>
            <Ionicons name="warning" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.riskTitle}>{alert.risk_level}-RISK ALERT</Text>

          <Text style={styles.alertId}>
            Alert #{alert.id?.substring(0, 8).toUpperCase()}
          </Text>
        </View>

        {/* ANIMAL */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="paw-outline" size={21} color="#176B4D" />
            </View>

            <Text style={styles.sectionTitle}>Animal Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Animal ID</Text>

            <Text style={styles.value}>
              {alert.animals?.animal_code || "Unknown"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>

            <Text style={styles.value}>
              {alert.animals?.name || "Not assigned"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Species</Text>

            <Text style={styles.value}>
              {alert.animals?.species || "Unknown"}
            </Text>
          </View>

          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.label}>Collar ID</Text>

            <Text style={styles.value}>
              {alert.animals?.collar_id || "Not available"}
            </Text>
          </View>
        </View>

        {/* ALERT INFORMATION */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="alert-circle-outline" size={22} color="#176B4D" />
            </View>

            <Text style={styles.sectionTitle}>Alert Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>High-Risk Zone</Text>

            <Text style={styles.value}>
              {alert.high_risk_zones?.zone_name || "Unknown Zone"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Risk Level</Text>

            <Text style={styles.highRisk}>{alert.risk_level}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>

            <Text style={styles.value}>{formatDate(alert.alert_time)}</Text>
          </View>

          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.label}>Alert Time</Text>

            <Text style={styles.value}>{formatTime(alert.alert_time)}</Text>
          </View>
        </View>

        {/* LOCATION */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="location-outline" size={22} color="#176B4D" />
            </View>

            <Text style={styles.sectionTitle}>Current Location</Text>
          </View>

          <View style={styles.locationBox}>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={28} color="#176B4D" />
            </View>

            <View>
              <Text style={styles.coordinates}>
                Latitude: {alert.latitude ?? "Not available"}
              </Text>

              <Text style={styles.coordinates}>
                Longitude: {alert.longitude ?? "Not available"}
              </Text>
            </View>
          </View>

          <View style={styles.locationWarning}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color="#65746D"
            />

            <Text style={styles.locationWarningText}>
              GPS information should be checked before approaching the animal.
            </Text>
          </View>
        </View>

        {/* STATUS */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Current Status</Text>

          <View
            style={[
              styles.statusBadge,
              alert.status === "NEW" && styles.statusNew,
              alert.status === "ACKNOWLEDGED" && styles.statusAcknowledged,
              alert.status === "MONITORING" && styles.statusMonitoring,
              alert.status === "RESPONDING" && styles.statusResponding,
              alert.status === "ESCALATED" && styles.statusEscalated,
            ]}
          >
            <Text style={styles.statusText}>{alert.status}</Text>
          </View>
        </View>

        {/* ANIMAL PROFILE */}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => console.log("Animal profile screen next")}
        >
          <Ionicons name="paw-outline" size={20} color="#176B4D" />

          <Text style={styles.secondaryButtonText}>VIEW ANIMAL PROFILE</Text>
        </TouchableOpacity>

        {/* NEW ALERT */}

        {alert.status === "NEW" ? (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              acknowledging && styles.disabledButton,
            ]}
            onPress={handleAcknowledge}
            disabled={acknowledging}
          >
            <Text style={styles.primaryButtonText}>
              {acknowledging ? "ACKNOWLEDGING..." : "ACKNOWLEDGE ALERT"}
            </Text>

            {!acknowledging && (
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#FFFFFF"
              />
            )}
          </TouchableOpacity>
        ) : (
          /*
           * Already acknowledged/active:
           * go directly to response selection.
           */
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinueResponse}
          >
            <Text style={styles.primaryButtonText}>CONTINUE RESPONSE</Text>

            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F3",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F7F3",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#68766F",
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#293A32",
    marginTop: 12,
  },

  returnButton: {
    backgroundColor: "#176B4D",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 20,
  },

  returnButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  header: {
    backgroundColor: "#176B4D",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#CCE4D9",
    fontSize: 11,
    marginTop: 3,
  },

  content: {
    padding: 18,
    paddingBottom: 50,
  },

  riskCard: {
    backgroundColor: "#FFF3F3",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFD5D5",
  },

  warningCircle: {
    width: 46,
    height: 46,
    borderRadius: 28,
    backgroundColor: "#D83A3A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  riskTitle: {
    color: "#C62828",
    fontWeight: "900",
    fontSize: 19,
  },

  alertId: {
    color: "#777",
    marginTop: 5,
    fontSize: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: "#E9F4EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#176B4D",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  lastInfoRow: {
    marginBottom: 0,
  },

  label: {
    color: "#777",
    fontSize: 13,
  },

  value: {
    color: "#222",
    fontWeight: "600",
    fontSize: 13,
    maxWidth: "60%",
    textAlign: "right",
  },

  highRisk: {
    color: "#C62828",
    fontWeight: "800",
  },

  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF7F2",
    padding: 16,
    borderRadius: 13,
  },

  locationIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DCEDE4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  coordinates: {
    fontSize: 13,
    marginBottom: 4,
    color: "#333",
    fontWeight: "500",
  },

  locationWarning: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  locationWarningText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: "#65746D",
    marginLeft: 7,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E7F4ED",
  },

  statusNew: {
    backgroundColor: "#FFF3CD",
  },

  statusAcknowledged: {
    backgroundColor: "#DCEEFE",
  },

  statusMonitoring: {
    backgroundColor: "#E1F3E6",
  },

  statusResponding: {
    backgroundColor: "#FFE8C7",
  },

  statusEscalated: {
    backgroundColor: "#F1E3FA",
  },

  statusText: {
    color: "#176B4D",
    fontWeight: "800",
    fontSize: 12,
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#176B4D",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    flexDirection: "row",
  },

  secondaryButtonText: {
    color: "#176B4D",
    fontWeight: "800",
    marginLeft: 7,
  },

  primaryButton: {
    backgroundColor: "#176B4D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    flexDirection: "row",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
    marginRight: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },
  heroCard: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 16,
    paddingVertical: 14,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    backgroundColor: "rgba(0,0,0,0.38)",
  },

  heroAnimalName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  heroAnimalMeta: {
    color: "#E7EEE9",
    fontSize: 12,
    marginTop: 2,
  },

  heroRiskBadge: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#C62828",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 15,
  },

  heroRiskText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 4,
  },
});
