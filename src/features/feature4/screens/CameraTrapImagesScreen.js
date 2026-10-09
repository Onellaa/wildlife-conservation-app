import { useCallback, useMemo, useState } from "react";
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
import { feature4Theme as t } from "../theme";

const filters = ["ALL", "NEW", "REVIEWED", "INCONCLUSIVE", "FLAGGED"];

export default function CameraTrapImagesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      setImages(await getCameraTrapImages(filter));
    } catch (error) {
      setImages([]);
      setLoadError("Unable to load the camera-trap queue. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return images.filter((item) => {
      if (!term) return true;

      return (
        item.cameraTrapId.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        String(item.species || "").toLowerCase().includes(term)
      );
    });
  }, [images, query]);

  const newCount = images.filter((x) => x.reviewStatus === "NEW").length;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>WILDLIFE MONITORING</Text>
                <Text style={styles.title}>Camera Trap Review</Text>
                <Text style={styles.subtitle}>
                  Review unreviewed captures, classify species and flag poacher evidence.
                </Text>
              </View>

              <View style={styles.counterCard}>
                <Text style={styles.counterNumber}>{newCount}</Text>
                <Text style={styles.counterLabel}>unreviewed</Text>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search camera, location or species"
                placeholderTextColor={t.muted}
                style={styles.search}
              />
            </View>

            <View style={styles.filters}>
              {filters.map((item) => {
                const active = filter === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setFilter(item)}
                    style={[styles.filter, active && styles.filterActive]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Review queue</Text>
              <Text style={styles.sectionHint}>{visible.length} images</Text>
            </View>

            {loadError ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>Queue could not be loaded</Text>
                <Text style={styles.errorText}>{loadError}</Text>
                <Pressable onPress={load} style={styles.retryButton}>
                  <Text style={styles.retryText}>TRY AGAIN</Text>
                </Pressable>
              </View>
            ) : null}

            {loading ? (
              <View style={styles.loaderWrap}>
                <ActivityIndicator size="large" color={t.accent} />
              </View>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.cardCell}>
            <ImageCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/feature4/image-details",
                  params: { imageId: item.id },
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          !loading && !loadError ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>◌</Text>
              <Text style={styles.emptyTitle}>No captures found</Text>
              <Text style={styles.emptyText}>
                There are no images for this filter.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: t.bg },
  content: { padding: 18, paddingBottom: 120 },
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    marginTop: 8,
  },
  eyebrow: {
    color: t.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  title: {
    color: t.text,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 6,
  },
  subtitle: {
    color: t.muted,
    marginTop: 7,
    maxWidth: 330,
    lineHeight: 20,
  },
  counterCard: {
    minWidth: 84,
    backgroundColor: t.cardAlt,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
  },
  counterNumber: {
    color: t.accent,
    fontSize: 24,
    fontWeight: "900",
  },
  counterLabel: {
    color: t.muted,
    fontSize: 10,
    marginTop: 2,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.card,
    borderColor: t.border,
    borderWidth: 1,
    borderRadius: 18,
    marginTop: 22,
    paddingHorizontal: 14,
  },
  searchIcon: {
    color: t.accent,
    fontSize: 22,
    marginRight: 8,
  },
  search: {
    flex: 1,
    color: t.text,
    minHeight: 52,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
  },
  filterActive: {
    backgroundColor: t.accent,
    borderColor: t.accent,
  },
  filterText: {
    color: t.muted,
    fontSize: 11,
    fontWeight: "900",
  },
  filterTextActive: {
    color: t.black,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    color: t.text,
    fontSize: 18,
    fontWeight: "900",
  },
  sectionHint: {
    color: t.muted,
    fontSize: 12,
  },
  row: { gap: 12 },
  cardCell: {
    flex: 1,
    marginBottom: 12,
  },
  loaderWrap: {
    paddingVertical: 40,
  },
  errorCard: {
    backgroundColor: "#281516",
    borderWidth: 1,
    borderColor: "#5B2A2D",
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
  },
  errorTitle: {
    color: "#FFD0D0",
    fontWeight: "900",
  },
  errorText: {
    color: "#D7BABA",
    marginTop: 5,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: t.danger,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryText: {
    color: t.white,
    fontWeight: "900",
    fontSize: 11,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
  },
  emptyIcon: {
    color: t.accent,
    fontSize: 44,
  },
  emptyTitle: {
    color: t.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  emptyText: {
    color: t.muted,
    marginTop: 5,
  },
});
