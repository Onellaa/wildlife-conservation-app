import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import StatusBadge from "./StatusBadge";
import { feature4Theme as t } from "../theme";

export default function ImageCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: item.imageUrl }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <View style={styles.overlay}>
          <StatusBadge status={item.reviewStatus} />
          <View style={styles.bottom}>
            <Text style={styles.camera}>{item.cameraTrapId}</Text>
            <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
            <Text style={styles.meta}>
              {new Date(item.timestamp).toLocaleDateString()} ·{" "}
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
  },
  image: { height: 245, justifyContent: "space-between" },
  imageRadius: { borderRadius: 22 },
  overlay: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    backgroundColor: "rgba(5, 12, 4, 0.18)",
  },
  bottom: {
    backgroundColor: "rgba(8, 16, 6, 0.78)",
    borderRadius: 16,
    padding: 12,
  },
  camera: { color: t.text, fontSize: 16, fontWeight: "900" },
  location: { color: t.accent, fontSize: 13, fontWeight: "700", marginTop: 4 },
  meta: { color: t.muted, fontSize: 11, marginTop: 5 },
});
