// src/styles/log-field-incident/descriptionStepStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "./activePatrolStyles";

const FONTS = {
  regular: "Nunito_400Regular",
  medium: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  extrabold: "Nunito_800ExtraBold",
};

export const descriptionStepStyles = StyleSheet.create({
  // ---------- Layout ----------
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    marginTop: "auto",
  },

  // ---------- Prompt / label ----------
  prompt: {
    fontFamily: FONTS.extrabold,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },

  // ---------- Text area ----------
  input: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    minHeight: 180,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    textAlignVertical: "top",
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },

  // ---------- Character count ----------
  hint: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSubtle,
    alignSelf: "flex-end",
    marginTop: -4,
  },

  // ---------- Primary button ----------
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: "#F9B77D",
  },
  primaryButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
