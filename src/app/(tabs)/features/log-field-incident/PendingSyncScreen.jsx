// src/app/(tabs)/features/log-field-incident/PendingSyncScreen.jsx
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, UploadCloud } from "lucide-react-native";

import { getAllIncidents } from "../../../../services/log-field-incident/incidentService";
import { syncPending } from "../../../../services/log-field-incident/syncService";
import { useNetworkStatus } from "../../../../hooks/log-field-incident/useNetworkStatus";
import { COLORS } from "../../../../styles/log-field-incident/activePatrolStyles";

export default function PendingSyncScreen() {
  const router = useRouter();
  const { isOnline } = useNetworkStatus();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getAllIncidents();
      setIncidents(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncPending();
      await load();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.text} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Pending Sync</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: COLORS.textMuted }}>
                No incidents logged yet.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>
                  {item.incident_type.replace(/_/g, " ").toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.badge,
                    item.sync_status === "synced"
                      ? styles.badgeSynced
                      : styles.badgePending,
                  ]}
                >
                  {item.sync_status === "synced" ? "Synced" : "Pending"}
                </Text>
              </View>
              <Text style={styles.cardMeta} numberOfLines={2}>
                {item.description || "(no note)"}
              </Text>
              <Text style={styles.cardTime}>
                {new Date(item.captured_at).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.syncButton,
            (!isOnline || syncing) && { opacity: 0.5 },
          ]}
          onPress={handleSync}
          disabled={!isOnline || syncing}
        >
          <UploadCloud size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.syncButtonText}>
            {syncing
              ? "Syncing…"
              : isOnline
                ? "Sync Now"
                : "Offline — will sync later"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: COLORS.text,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardType: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  badge: {
    fontFamily: "Nunito_700Bold",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
  },
  badgeSynced: { backgroundColor: "#DCFCE7", color: "#16A34A" },
  badgePending: { backgroundColor: "#FFEDD5", color: "#EA580C" },
  cardMeta: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: COLORS.text,
  },
  cardTime: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    color: COLORS.textMuted,
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
  },
  syncButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
};
