import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";

import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";

// 👉 Put your elephant photo here, e.g.
// const HERO_IMAGE = require("../../../../assets/elephant.jpg");
// If left as null, a dark green banner is shown instead.
const HERO_IMAGE = require("../../../../../assets/elephant.jpg");;

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

export default function CommunityReportHome() {
  const router = useRouter();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const Banner = HERO_IMAGE ? ImageBackground : View;
  const bannerProps = HERO_IMAGE
    ? { source: HERO_IMAGE, resizeMode: "cover" }
    : {};

  return (
    <View style={styles.screen}>
      {/* Tab header */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.headerTitle}>
          Community{"\n"}Conflict Report
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map((tab) => {
            const active = tab.key === "home";
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => !active && router.push(ROUTES[tab.key])}
              >
                <Feather
                  name={tab.icon}
                  size={16}
                  color={active ? "#FFFFFF" : "#5B6B63"}
                />
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}
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
        <Text style={styles.topBarTitle}>Community Report</Text>

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
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <Banner {...bannerProps} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <View style={styles.heroLine} />
            <Text style={styles.heroEyebrow}>COMMUNITY REPORTING</Text>
            <Text style={styles.heroTitle}>
              Community{"\n"}Conflict Report
            </Text>
            <Text style={styles.heroSubtitle}>
              Report wildlife incidents and conflicts in your community.
            </Text>
          </View>
        </Banner>

        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        {/* Submit a Report */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.85}
          onPress={() => router.push(ROUTES.form)}
        >
          <View style={styles.actionTop}>
            <View style={styles.actionIcon}>
              <Feather name="file-plus" size={22} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.actionBottom}>
            <Text style={styles.actionLabel}>Submit a Report</Text>
            <Feather name="arrow-up-right" size={18} color="#235A47" />
          </View>
        </TouchableOpacity>

        {/* View My Reports */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.85}
          onPress={() => router.push(ROUTES.mine)}
        >
          <View style={styles.actionTop}>
            <View style={styles.actionIcon}>
              <Feather name="copy" size={22} color="#FFFFFF" />
            </View>
            
          </View>

          <View style={styles.actionBottom}>
            <Text style={styles.actionLabel}>View My Reports</Text>
            <Feather name="arrow-up-right" size={18} color="#235A47" />
          </View>
        </TouchableOpacity>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Feather
            name="shield"
            size={22}
            color="#235A47"
            style={styles.infoIcon}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Report Wildlife Incidents</Text>
            <Text style={styles.infoText}>
              You can report elephant sightings, crop raiding, dangerous
              wildlife, and other community incidents.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F8F4",
  },

  /* Header with tabs */
  header: {
    backgroundColor: "#E3F5E8",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#235A47",
    lineHeight: 28,
    marginBottom: 14,
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
    paddingHorizontal: 20,
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

  /* Body */
  body: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Hero */
  hero: {
    height: 230,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0F3D2E",
    marginBottom: 28,
  },

  heroImage: {
    borderRadius: 16,
  },

  heroOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  heroLine: {
    width: 48,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    marginBottom: 18,
  },

  heroEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#E6F2EB",
    marginBottom: 10,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 34,
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 14,
    color: "#E6F2EB",
    lineHeight: 21,
    maxWidth: "70%",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#14231C",
    marginBottom: 16,
  },

  /* Action cards */
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E1EBE5",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#235A47",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  actionTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#235A47",
    alignItems: "center",
    justifyContent: "center",
  },

  actionNumber: {
    fontSize: 13,
    color: "#7A8A82",
  },

  actionBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },

  actionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14231C",
  },

  /* Info card */
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#D6F0E0",
    borderLeftWidth: 3,
    borderLeftColor: "#235A47",
    borderRadius: 4,
    padding: 18,
    marginTop: 8,
  },

  infoIcon: {
    marginRight: 14,
    marginTop: 2,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#235A47",
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: "#5B6B63",
    lineHeight: 21,
  },
});
