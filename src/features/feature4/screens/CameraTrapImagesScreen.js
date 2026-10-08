import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import ImageCard from "../components/ImageCard";
import { getCameraTrapImages } from "../services/cameraTrapRepository";

const filters = ["ALL", "NEW", "REVIEWED", "FLAGGED"];

export default function CameraTrapImagesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getCameraTrapImages(filter);
    setImages(data);
    setLoading(false);
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const visible = images.filter((item) => {
    const term = query.trim().toLowerCase();
    if (!term) return true;

    return (
      item.cameraTrapId.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      String(item.species || "").toLowerCase().includes(term)
    );
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Camera Trap Images</Text>
        <Text style={styles.subtitle}>
          Review and classify wildlife captures.
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search camera, location or species"
          style={styles.search}
        />

        <View style={styles.filters}>
          {filters.map((item) => (
            <Pressable
              key={item}
              style={[
                styles.filter,
                filter === item && styles.filterActive,
              ]}
              onPress={() => setFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1F6B4F" />
        ) : (
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ImageCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/feature4/image-details",
                    params: { imageId: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No images found.</Text>
            }
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F3" },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 12 },
  title: { fontSize: 28, fontWeight: "900", color: "#17352C" },
  subtitle: { marginTop: 4, color: "#6B7280" },
  search: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 14,
  },
  filter: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  filterActive: {
    backgroundColor: "#1F6B4F",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 50,
  },
});
