// src/app/(tabs)/features/log-field-incident/ActivePatrolScreen.jsx
import { useCallback, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Text } from "../../../../components/NunitoText";
import { useFocusEffect, useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";

import PatrolHeader from "../../../../components/log-field-incident/PatrolHeader";
import PatrolStatusCard from "../../../../components/log-field-incident/PatrolStatusCard";
import LogIncidentButton from "../../../../components/log-field-incident/LogIncidentButton";
import TodayIncidentsList from "../../../../components/log-field-incident/TodayIncidentsList";
import PatrolMap from "../../../../components/log-field-incident/PatrolMap";

import { activePatrolStyles as styles } from "../../../../styles/log-field-incident/activePatrolStyles";
import { COLORS } from "../../../../styles/log-field-incident/activePatrolStyles";
import { useActivePatrolScreen } from "../../../../hooks/log-field-incident/useActivePatrolScreen";
import { usePatrol } from "../../../../context/log-field-incident/PatrolContext";
import { extractParkLocation } from "../../../../utils/geojson";

export default function ActivePatrolScreen() {
  const router = useRouter();
  const { activePatrol, incidents, syncStatus, elapsed, loading } =
    useActivePatrolScreen();
  const { endPatrol, refreshPatrolIncidents } = usePatrol();

  useFocusEffect(
    useCallback(() => {
      refreshPatrolIncidents().catch((err) => {
        console.error("Could not refresh patrol incidents:", err);
      });
    }, [refreshPatrolIncidents]),
  );

  // Redirect if no patrol
  useEffect(() => {
    if (!loading && !activePatrol) {
      router.navigate("/(tabs)/features/log-field-incident/StartPatrolScreen");
    }
  }, [loading, activePatrol, router]);

  const handleEndPatrol = () => {
    Alert.alert("End this patrol?", "You can start a new patrol later.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Patrol",
        style: "destructive",
        onPress: async () => {
          try {
            await endPatrol();
            // activePatrol becomes null → redirect effect fires
          } catch (err) {
            Alert.alert("Failed to end patrol", err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading patrol…</Text>
      </View>
    );
  }

  if (!activePatrol) return null;

  const parkLocation = extractParkLocation(
    activePatrol.parks?.boundary_geojson,
  );
  const parkName = activePatrol.parks?.name || "Unknown Park";

  return (
    <View style={styles.container}>
      <PatrolHeader
        parkName={parkName}
        sector="Sector 4"
        syncStatus={syncStatus}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PatrolMap parkLocation={parkLocation} parkName={parkName} />

        <View style={styles.body}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>Park location</Text>
          </View>

          <PatrolStatusCard
            elapsed={elapsed}
            rangerLabel={activePatrol.route_name || "Ranger patrol"}
            coverageKm="5.2"
          />

          <LogIncidentButton
            onPress={() =>
              router.push(
                "/(tabs)/features/log-field-incident/LogIncidentFormScreen",
              )
            }
          />
          <Text style={styles.ctaHint}>
            Snare · Carcass · Campsite · Species sighting
          </Text>

          <TodayIncidentsList incidents={incidents} />

          {/* End Patrol — secondary action, clearly separated */}
          <TouchableOpacity
            style={styles.endPatrolLink}
            onPress={handleEndPatrol}
            activeOpacity={0.7}
          >
            <LogOut size={16} color={COLORS.danger} strokeWidth={2.5} />
            <Text style={styles.endPatrolText}>End Patrol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
