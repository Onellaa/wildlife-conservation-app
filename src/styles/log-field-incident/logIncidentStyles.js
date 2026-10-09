// src/styles/log-field-incident/logIncidentStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "./activePatrolStyles";

const FONTS = {
  regular: "Nunito_400Regular",
  medium: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  extrabold: "Nunito_800ExtraBold",
};

export const logIncidentStyles = StyleSheet.create({
  // ---------- Layout ----------
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },

  // ---------- Header ----------
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBack: { padding: 4 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerForward: { padding: 4 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  headerStep: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },

  // ---------- Step subtitle ----------
  stepSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  // ---------- Map area (GPS step) ----------
  mapArea: {
    height: 320,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#2A2A2A",
    position: "relative",
  },
  mapDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2A2A2A",
  },
  gpsPulse: {
    position: "absolute",
    alignSelf: "center",
    top: "42%",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.6,
  },
  gpsMarker: {
    position: "absolute",
    alignSelf: "center",
    top: "42%",
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  mapInstruction: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  mapInstructionText: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  gpsStatus: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: "#FFFFFF",
  },

  // ---------- Coordinates card ----------
  coordCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coordLabel: {
    fontFamily: FONTS.extrabold,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  coordValue: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  coordHint: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
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

  // ---------- Outlined button ----------
  outlinedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
  },
  outlinedButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.primary,
  },

  // ---------- Link button ----------
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  linkButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },

  // ---------- Fallback group ----------
  fallbackGroup: {
    gap: 10,
    marginTop: 4,
  },

  // ---------- Override button ----------
  overrideButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F0F7F4",
    borderWidth: 1,
    borderColor: "#D0E6DC",
  },
  overrideButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.primary,
  },

  // ---------- Error banner ----------
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorBannerText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.danger,
    lineHeight: 18,
  },

  // ---------- Type grid ----------
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  typeCard: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  typeCardActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  typeCardIconWrap: {
    marginBottom: 4,
  },
  typeCardLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.text,
    textAlign: "center",
  },
  typeCardLabelActive: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
