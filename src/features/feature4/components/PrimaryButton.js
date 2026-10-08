import { Pressable, StyleSheet, Text } from "react-native";

export default function PrimaryButton({
  title,
  onPress,
  danger = false,
  outline = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        danger && styles.danger,
        outline && styles.outline,
      ]}
    >
      <Text style={[styles.text, outline && styles.outlineText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F6B4F",
    marginTop: 12,
  },
  danger: {
    backgroundColor: "#C62828",
  },
  outline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1F6B4F",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  outlineText: {
    color: "#1F6B4F",
  },
});
