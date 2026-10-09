import React, { useCallback, useState } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  getActiveAlerts,
} from "../../services/alertService";

export default function AlertScreen() {
  const router = useRouter();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setError("");

      const data = await getActiveAlerts();

      setAlerts(data || []);
    } catch (err) {
      console.log("Error loading alerts:", err);

      setError("Unable to load high-risk alerts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAlerts();
  };

  const formatAlertTime = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#176B4D"
        />

        <Text style={styles.loadingText}>
          Loading alerts...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/")}
          >
            <Ionicons
              name="chevron-back"
              color="#FFFFFF"
              size={24}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Field Operations
          </Text>
        </View>

        <Text style={styles.headerSubtitle}>
          High-Risk Alerts
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#176B4D"
          />
        }
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Active Alerts
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {alerts.length}
            </Text>
          </View>
        </View>

        {/* ERROR */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color="#B42318"
            />

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              onPress={loadAlerts}
            >
              <Text style={styles.retryText}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* NO ALERTS */}
        {!error && alerts.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={42}
                color="#176B4D"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Active Alerts
            </Text>

            <Text style={styles.emptyText}>
              There are currently no unresolved
              high-risk zone alerts.
            </Text>
          </View>
        )}

        {/* ALERTS */}
        {alerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push(`/alerts/${alert.id}`)
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.animalSection}>
                <Text style={styles.alertId}>
                  ALERT #
                  {alert.id
                    ?.substring(0, 8)
                    .toUpperCase()}
                </Text>

                <Text style={styles.animalName}>
                  {alert.animals?.species ||
                    "Unknown Animal"}{" "}
                  {alert.animals?.animal_code || ""}
                </Text>
              </View>

              <View style={styles.riskBadge}>
                <Ionicons
                  name="warning"
                  size={13}
                  color="#C92A2A"
                />

                <Text style={styles.riskText}>
                  {alert.risk_level || "HIGH"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* ZONE */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#176B4D"
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>
                  High-Risk Zone
                </Text>

                <Text style={styles.value}>
                  {alert.high_risk_zones
                    ?.zone_name || "Unknown Zone"}
                </Text>
              </View>
            </View>

            {/* TIME + STATUS */}
            <View style={styles.bottomRow}>
              <View style={styles.bottomItem}>
                <Text style={styles.label}>
                  Alert Time
                </Text>

                <Text style={styles.value}>
                  {formatAlertTime(
                    alert.alert_time
                  )}
                </Text>
              </View>

              <View style={styles.bottomItem}>
                <Text style={styles.label}>
                  Status
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    alert.status === "NEW" &&
                      styles.statusNew,
                    alert.status ===
                      "ACKNOWLEDGED" &&
                      styles.statusAcknowledged,
                    alert.status ===
                      "MONITORING" &&
                      styles.statusMonitoring,
                    alert.status ===
                      "RESPONDING" &&
                      styles.statusResponding,
                    alert.status ===
                      "ESCALATED" &&
                      styles.statusEscalated,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {alert.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.openButton}>
              <Text style={styles.openButtonText}>
                VIEW ALERT
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F4",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F4",
  },

  loadingText: {
    marginTop: 12,
    color: "#66736D",
    fontSize: 14,
  },

  header: {
    backgroundColor: "#176B4D",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },

  headerSubtitle: {
    color: "#D8EFE5",
    fontSize: 15,
    marginTop: 6,
    marginLeft: 50,
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },

  countBadge: {
    backgroundColor: "#E2F1E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 9,
  },

  countText: {
    color: "#176B4D",
    fontWeight: "800",
  },

  errorBox: {
    backgroundColor: "#FFF1F0",
    borderRadius: 14,
    padding: 15,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  errorText: {
    flex: 1,
    marginHorizontal: 9,
    color: "#B42318",
    fontSize: 12,
  },

  retryText: {
    color: "#176B4D",
    fontWeight: "800",
  },

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 35,
    alignItems: "center",
    marginTop: 30,
  },

  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#E7F4ED",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#244036",
    marginTop: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#78847E",
    marginTop: 7,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  animalSection: {
    flex: 1,
    paddingRight: 10,
  },

  alertId: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8A948F",
    marginBottom: 4,
    letterSpacing: 0.4,
  },

  animalName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
  },

  riskBadge: {
    backgroundColor: "#FFE3E3",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  riskText: {
    color: "#C92A2A",
    fontWeight: "bold",
    fontSize: 11,
    marginLeft: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 15,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDF6F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  infoContent: {
    flex: 1,
  },

  label: {
    color: "#7E8984",
    fontSize: 11,
    marginBottom: 3,
  },

  value: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  bottomItem: {
    flex: 1,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#E7F4ED",
  },

  statusNew: {
    backgroundColor: "#FFF3CD",
  },

  statusAcknowledged: {
    backgroundColor: "#DCEEFE",
  },

  statusMonitoring: {
    backgroundColor: "#E7F4ED",
  },

  statusResponding: {
    backgroundColor: "#FDEBD0",
  },

  statusEscalated: {
    backgroundColor: "#F4E4FA",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#176B4D",
  },

  openButton: {
    backgroundColor: "#176B4D",
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  openButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 7,
  },
});