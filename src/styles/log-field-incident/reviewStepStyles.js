// src/styles/log-field-incident/reviewStepStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "./activePatrolStyles";

const FONTS = {
  regular: "Nunito_400Regular",
  medium: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  extrabold: "Nunito_800ExtraBold",
};

export const reviewStepStyles = StyleSheet.create({
  // ---------- Layout ----------
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    marginTop: "auto",
    gap: 12,
  },

  // ---------- Photo card ----------
  photoCard: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#9CA3AF",
  },
  photoChip: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
  },
  photoChipText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  // ---------- Summary ----------
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
    gap: 4,
  },
  summaryLabel: {
    fontFamily: FONTS.extrabold,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  summaryValue: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 21,
  },

  // ---------- Buttons ----------
  editButton: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  editButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
  },
  submitButton: {
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
