import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";

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

export default function MyReports() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("community_conflict_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
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

  // Fetch every time My Reports screen becomes active
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [user?.id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
  };

  const goToCommunityReport = () => {
    router.replace("/(tabs)/features/community-report");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
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

  const renderReport = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.reportId}>
            {item.report_id}
          </Text>

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
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.type}>
          {item.incident_type}
        </Text>

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
              : item.latitude !== null &&
                item.longitude !== null
              ? `GPS Location (${item.latitude.toFixed(
                  6
                )}, ${item.longitude.toFixed(6)})`
              : "Location unavailable"}
          </Text>
        </View>

        {item.description ? (
          <Text style={styles.description}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.cardDivider} />

        <View style={styles.dateRow}>
          <Feather
            name="clock"
            size={13}
            color="#7A8A82"
          />
          <Text style={styles.date}>
            Submitted:{" "}
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  // Shared page header (tabs + top bar)
  const renderChrome = () => (
    <>
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
            const active = tab.key === "mine";
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  active && styles.tabActive,
                ]}
                onPress={() =>
                  !active &&
                  router.replace(ROUTES[tab.key])
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

      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>
          My Reports
        </Text>

        <View style={styles.topBarRight}>
          <View style={styles.avatar}>
            <Feather
              name="user"
              size={18}
              color="#235A47"
            />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Feather
              name="log-out"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.logoutButtonText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // Title block shown above the list
  const renderPageHeader = () => (
    <View style={styles.pageHeader}>
      {/* Always go directly to your feature index page */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={goToCommunityReport}
      >
        <Feather
          name="arrow-left"
          size={18}
          color="#5B6B63"
        />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>
        COMMUNITY REPORTING
      </Text>

      <Text style={styles.title}>
        My Reports
      </Text>

      <Text style={styles.subtitle}>
        View the wildlife incidents you have submitted.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#235A47"
        />

        <Text style={styles.loadingText}>
          Loading reports...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderChrome()}

      {reports.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyScroll}
        >
          {renderPageHeader()}

          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Feather
                name="clipboard"
                size={28}
                color="#235A47"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Reports Yet
            </Text>

            <Text style={styles.emptyText}>
              You haven't submitted any community
              conflict reports yet.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() =>
                router.push(
                  "/(tabs)/features/community-report/report-form"
                )
              }
            >
              <Text style={styles.emptyButtonText}>
                Submit a Report
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          ListHeaderComponent={renderPageHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
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

  /* Header with tabs */
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
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 15,
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
  },

  subtitle: {
    fontSize: 15,
    color: "#5B6B63",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 22,
  },

  list: {
    padding: 16,
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
    flexGrow: 1,
    padding: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: "#235A47",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});