import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import StatusBadge from "./StatusBadge";

export default function ImageCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.camera}>{item.cameraTrapId}</Text>
          <StatusBadge status={item.reviewStatus} />
        </View>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.meta}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: 210,
    backgroundColor: "#E5E7EB",
  },
  content: {
    padding: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  camera: {
    fontSize: 16,
    fontWeight: "800",
    color: "#17352C",
  },
  location: {
    marginTop: 8,
    fontSize: 14,
    color: "#374151",
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
});
