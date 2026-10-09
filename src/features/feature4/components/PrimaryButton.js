import { Pressable, StyleSheet, Text } from "react-native";
import { feature4Theme as t } from "../theme";

export default function PrimaryButton({ title, onPress, danger = false, outline = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, danger && styles.danger, outline && styles.outline]}
    >
      <Text style={[styles.text, outline && styles.outlineText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.accent,
    marginTop: 14,
  },
  danger: { backgroundColor: t.danger },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: t.accent,
  },
  text: {
    color: t.black,
    fontSize: 15,
    fontWeight: "900",
  },
  outlineText: { color: t.accent },
});
