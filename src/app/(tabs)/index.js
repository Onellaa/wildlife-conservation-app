import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getDashboardStats } from "../services/dashboardService";
import { authService } from "../services/authService";

import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
require("../../../assets/home/hero-elephant.jpg");
require("../../../assets/home/high-risk.jpg");
require("../../../assets/home/log-incident.jpg");
require("../../../assets/home/camera-trap.jpg");
require("../../../assets/home/community-report.jpg");

import { getActiveAlerts } from "../services/alertService";

export default function HomeScreen() {
  const router = useRouter();

  const [stats, setStats] = useState({
    activeAlerts: 0,
    trackedAnimals: 0,
    highRiskZones: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recentAlert, setRecentAlert] = useState(null);

  const loadRecentActivity = async () => {
    try {
      const alerts = await getActiveAlerts();

      setRecentAlert(alerts && alerts.length > 0 ? alerts[0] : null);
    } catch (error) {
      console.log("Error loading recent activity:", error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);

      const data = await getDashboardStats();

      setStats(data);
    } catch (error) {
      console.log("Dashboard stats error:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile();

      setProfile(data);
    } catch (error) {
      console.log("Error loading profile:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadDashboardStats();
      loadRecentActivity();
    }, []),
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO IMAGE */}
        <ImageBackground
          source={require("../../../assets/home/hero-elephant.jpg")}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <Text style={styles.helloText}>
              Welcome, {profile?.full_name || "Ranger"}!🌿
            </Text>

            <Text style={styles.heroSubtitle}>
              Together for a safer{"\n"}wildlife tomorrow
            </Text>
          </View>

          {/* STATISTICS */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="shield-checkmark" size={25} color="#D6F5DB" />

              <Text style={styles.statNumber}>
                {loadingStats ? "..." : stats.activeAlerts}
              </Text>

              <Text style={styles.statLabel}>Active Alerts</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Ionicons name="paw" size={26} color="#D6F5DB" />

              <Text style={styles.statNumber}>
                {loadingStats ? "..." : stats.trackedAnimals}
              </Text>

              <Text style={styles.statLabel}>Tracked Animals</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Ionicons name="location" size={26} color="#D6F5DB" />

              <Text style={styles.statNumber}>
                {loadingStats ? "..." : stats.highRiskZones}
              </Text>

              <Text style={styles.statLabel}>High-Risk Zones</Text>
            </View>
          </View>
        </ImageBackground>

        {/* CORE FEATURES TITLE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Core Features</Text>
        </View>

        {/* FEATURE GRID */}
        <View style={styles.grid}>
          {/* HIGH-RISK ALERT - WORKING */}
          <TouchableOpacity
            style={styles.featureCard}
            activeOpacity={0.85}
            onPress={() => router.push("/alerts")}
          >
            <ImageBackground
              source={require("../../../assets/home/high-risk.jpg")}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
            >
              <View style={styles.imageGradient} />

              <View style={styles.cardIconRed}>
                <Ionicons name="warning" size={25} color="#FFFFFF" />
              </View>
            </ImageBackground>

            <View style={styles.greenContent}>
              <Text style={styles.featureTitle}>
                Respond to High-Risk Zone Alert
              </Text>

              <Text style={styles.featureDescription}>
                View and respond to alerts from tracked animals.
              </Text>

              <View style={styles.greenArrow}>
                <Ionicons name="chevron-forward" color="#FFFFFF" size={22} />
              </View>
            </View>
          </TouchableOpacity>

          {/* LOG INCIDENT */}
          <View style={styles.featureCard}>
            <ImageBackground
              source={require("../../../assets/home/log-incident.jpg")}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
            >
              <View style={styles.imageGradient} />

              <View style={styles.cardIconBlue}>
                <Ionicons name="document-text" size={25} color="#FFFFFF" />
              </View>
            </ImageBackground>

            <View style={styles.blueContent}>
              <Text style={styles.featureTitle}>Log Field Incident</Text>

              <Text style={styles.featureDescription}>
                Record snares, carcasses or illegal activities.
              </Text>
            </View>
          </View>

          {/* CAMERA TRAPS */}
          <View style={styles.featureCard}>
            <ImageBackground
              source={require("../../../assets/home/camera-trap.jpg")}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
            >
              <View style={styles.imageGradient} />

              <View style={styles.cardIconOrange}>
                <Ionicons name="camera" size={25} color="#FFFFFF" />
              </View>
            </ImageBackground>

            <View style={styles.orangeContent}>
              <Text style={styles.featureTitle}>Review Camera Trap Images</Text>

              <Text style={styles.featureDescription}>
                View and analyze camera trap images from field locations.
              </Text>
            </View>
          </View>

          {/* COMMUNITY REPORT */}
          <View style={styles.featureCard}>
            <ImageBackground
              source={require("../../../assets/home/community-report.jpg")}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
            >
              <View style={styles.imageGradient} />

              <View style={styles.cardIconPurple}>
                <Ionicons name="people" size={25} color="#FFFFFF" />
              </View>
            </ImageBackground>

            <View style={styles.purpleContent}>
              <Text style={styles.featureTitle}>
                Submit Community Conflict Report
              </Text>

              <Text style={styles.featureDescription}>
                Report human-wildlife conflict incidents.
              </Text>
            </View>
          </View>
        </View>

        {/* RECENT ACTIVITY */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <TouchableOpacity onPress={() => router.push("/alerts")}>
            <Text style={styles.quickActions}>View All ›</Text>
          </TouchableOpacity>
        </View>

        {recentAlert ? (
          <TouchableOpacity
            style={styles.activityCard}
            onPress={() => router.push(`/alerts/${recentAlert.id}`)}
          >
            <View style={styles.activityIcon}>
              <Ionicons name="warning" size={23} color="#FFFFFF" />
            </View>

            <View style={styles.activityMiddle}>
              <Text style={styles.activityTitle}>High-Risk Alert</Text>

              <Text style={styles.activityDescription}>
                {recentAlert.animals?.species || "Animal"}{" "}
                {recentAlert.animals?.animal_code || ""}
                {" entered "}
                {recentAlert.high_risk_zones?.zone_name || "High-Risk Zone"}
              </Text>
            </View>

            <Text style={styles.activityTime}>
              {new Date(recentAlert.alert_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.noActivityCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={26}
              color="#176B4D"
            />

            <Text style={styles.noActivityText}>No recent active alerts</Text>
          </View>
        )}

        <View style={{ height: 25 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9F5",
  },

  scrollContent: {
    paddingBottom: 15,
  },

  /* HERO */

  hero: {
    borderRadius: 28,
    resizeMode: "cover",
  },

  heroImage: {
    borderRadius: 28,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 45, 30, 0.18)",
  },

  heroContent: {
    paddingHorizontal: 24,
    paddingTop: 35,
  },

  helloText: {
    fontSize: 33,
    fontWeight: "900",
    color: "#083D2D",
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 20,
    lineHeight: 27,
    color: "#124A38",
    fontWeight: "500",
  },

  statsContainer: {
    margin: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 22,
    backgroundColor: "rgba(1, 68, 45, 0.90)",
    flexDirection: "row",
    alignItems: "center",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 3,
  },

  statLabel: {
    fontSize: 10,
    color: "#FFFFFF",
    marginTop: 2,
    textAlign: "center",
  },

  divider: {
    height: 57,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#0E3529",
  },

  quickActions: {
    fontSize: 14,
    fontWeight: "700",
    color: "#167345",
  },

  /* GRID */

  grid: {
    paddingHorizontal: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  featureCard: {
    width: "46%",
    margin: "2%",
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  cardImage: {
    height: 125,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  cardImageStyle: {
    resizeMode: "cover",
  },

  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  cardIconRed: {
    margin: 12,
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: "#E53F3F",
    justifyContent: "center",
    alignItems: "center",
  },

  cardIconBlue: {
    margin: 12,
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: "#1F5D99",
    justifyContent: "center",
    alignItems: "center",
  },

  cardIconOrange: {
    margin: 12,
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: "#A55D05",
    justifyContent: "center",
    alignItems: "center",
  },

  cardIconPurple: {
    margin: 12,
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: "#704092",
    justifyContent: "center",
    alignItems: "center",
  },

  greenContent: {
    backgroundColor: "#E1F3DF",
    padding: 14,
    minHeight: 160,
  },

  blueContent: {
    backgroundColor: "#DCEEFF",
    padding: 14,
    minHeight: 160,
  },

  orangeContent: {
    backgroundColor: "#FFF0D7",
    padding: 14,
    minHeight: 160,
  },

  purpleContent: {
    backgroundColor: "#EDE2FA",
    padding: 14,
    minHeight: 160,
  },

  featureTitle: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "900",
    color: "#12372B",
  },

  featureDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17,
    color: "#4C5853",
  },

  greenArrow: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#06663F",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ACTIVITY */

  activityCard: {
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F13D3D",
    justifyContent: "center",
    alignItems: "center",
  },

  activityMiddle: {
    flex: 1,
    marginLeft: 12,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#124633",
  },

  activityDescription: {
    fontSize: 11,
    marginTop: 4,
    color: "#777",
  },

  activityTime: {
    fontSize: 11,
    color: "#777",
  },
  noActivityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  noActivityText: {
    marginLeft: 10,
    color: "#607067",
    fontSize: 13,
    fontWeight: "600",
  },
});
