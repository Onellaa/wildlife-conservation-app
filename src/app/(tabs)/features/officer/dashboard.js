import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";

import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";

export default function OfficerDashboard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("community_conflict_reports")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Error fetching officer reports:", error);
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
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

  const renderReport = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          router.push(`/(tabs)/features/officer/report-details?id=${item.id}`)
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.reportId}>{item.report_id}</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.backgroundColor,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: statusStyle.color,
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
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.type}>{item.incident_type}</Text>

        <View style={styles.locationRow}>
          <Feather
            name="map-pin"
            size={16}
            color="#5B6B63"
            style={styles.locationIcon}
          />
          <Text style={styles.location}>
            {item.manual_location
              ? item.manual_location
              : item.latitude !== null && item.longitude !== null
                ? `GPS Location (${item.latitude.toFixed(
                    6,
                  )}, ${item.longitude.toFixed(6)})`
                : "Location unavailable"}
          </Text>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <Feather name="clock" size={13} color="#7A8A82" />
            <Text style={styles.date}>
              Submitted: {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>

          <Feather name="arrow-up-right" size={18} color="#235A47" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderPageHeader = () => (
    <View style={styles.pageHeader}>
      <Text style={styles.eyebrow}>COMMUNITY REPORTING</Text>

      <Text style={styles.title}>Officer Dashboard</Text>

      <Text style={styles.subtitle}>Community Conflict Reports</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Feather name="copy" size={22} color="#FFFFFF" />
        </View>

        <View>
          <Text style={styles.summaryLabel}>Total Reports</Text>

          <Text style={styles.summaryNumber}>{reports.length}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#235A47" />

        <Text style={styles.loadingText}>Loading community reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Green header */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.tab}>
          <Feather name="shield" size={16} color="#FFFFFF" />
          <Text style={styles.tabText}>Officer Dashboard</Text>
        </View>
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Officer Dashboard</Text>

        <View style={styles.topBarRight}>
          <View style={styles.avatar}>
            <Feather name="user" size={18} color="#235A47" />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={18} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyScroll}>
          {renderPageHeader()}

          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Feather name="clipboard" size={28} color="#235A47" />
            </View>

            <Text style={styles.emptyTitle}>No Reports</Text>

            <Text style={styles.emptyText}>
              There are currently no community conflict reports.
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          ListHeaderComponent={renderPageHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8F4",
  },

  /* Header */
  header: {
    backgroundColor: "#E3F5E8",
    paddingHorizontal: 16,
    paddingBottom: 14,
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

  /* Page header */
  pageHeader: {
    marginBottom: 6,
    paddingTop: 20,
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
  },

  subtitle: {
    fontSize: 15,
    color: "#5B6B63",
    marginTop: 8,
    marginBottom: 22,
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#D6F0E0",
    borderLeftWidth: 3,
    borderLeftColor: "#235A47",
    borderRadius: 6,
    padding: 18,
    marginBottom: 22,
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#235A47",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryLabel: {
    fontSize: 14,
    color: "#5B6B63",
    marginBottom: 2,
  },

  summaryNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#235A47",
  },

  list: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 40,
  },

  /* Report card */
  card: {
    backgroundColor: "#E4F4EA",
    borderWidth: 1,
    borderColor: "#BFDECB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: "#235A47",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  reportId: {
    fontSize: 13,
    color: "#5B6B63",
    fontWeight: "500",
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

  type: {
    fontSize: 22,
    fontWeight: "800",
    color: "#14231C",
    marginBottom: 14,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  locationIcon: {
    marginRight: 8,
  },

  location: {
    flex: 1,
    fontSize: 14,
    color: "#5B6B63",
  },

  description: {
    fontSize: 15,
    color: "#5B6B63",
    lineHeight: 22,
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#C3DFCF",
    marginTop: 20,
    marginBottom: 14,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  date: {
    fontSize: 12,
    color: "#7A8A82",
  },

  /* Loading */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F8F4",
  },

  loadingText: {
    marginTop: 10,
    color: "#5B6B63",
  },

  /* Empty state */
  emptyScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#14231C",
    marginBottom: 7,
  },

  emptyText: {
    color: "#5B6B63",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
