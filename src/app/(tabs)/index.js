
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wildlife Conservation</Text>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={() =>
          router.push("/(tabs)/features/community-report")
        }
      >
        <Text style={styles.reportButtonText}>
          Community Conflict Report
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
  },

  reportButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  reportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

