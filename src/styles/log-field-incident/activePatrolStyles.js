// src/styles/log-field-incident/activePatrolStyles.js
import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#1A5C4A",
  primaryLight: "#2E7A63",
  accent: "#EA7B2C",
  accentDark: "#D96A1E",
  background: "#F4F5F2",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAF8",
  text: "#0F172A",
  textMuted: "#6B7280",
  textSubtle: "#9CA3AF",
  border: "#EAECEF",
  success: "#16A34A",
  successLight: "#DCFCE7",
  warning: "#EA580C",
  warningLight: "#FFEDD5",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  dangerBorder: "#FECACA",
  patrolGreen: "#8FAE8B",
  mapBg: "#E8EDE6",
};

export const activePatrolStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // -------- Map placeholder --------
  mapArea: {
    height: 240,
    backgroundColor: COLORS.mapBg,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  mapRow: {
    flexDirection: "row",
    gap: 18,
    marginVertical: 10,
  },
  mapBlob: {
    width: 96,
    height: 64,
    borderRadius: 44,
    backgroundColor: COLORS.patrolGreen,
    opacity: 0.7,
  },
  mapMarker: {
    position: "absolute",
    top: 106,
    alignSelf: "center",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  // -------- Body wrapper --------
  body: {
    paddingHorizontal: 18,
    marginTop: -24,
    gap: 16,
  },

  // -------- Status pill --------
  statusPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statusPillText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },

  // -------- Patrol card --------
  patrolCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  patrolLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  patrolTime: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  patrolMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // -------- CTA button --------
  ctaButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  ctaHint: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: -6,
    letterSpacing: 0.2,
  },

  // -------- End Patrol --------
  endPatrolLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    backgroundColor: COLORS.dangerLight,
    marginTop: 8,
  },
  endPatrolText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.danger,
  },

  // -------- Today's incidents --------
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 4,
  },
  incidentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  incidentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  incidentInfo: {
    flex: 1,
    gap: 3,
  },
  incidentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  incidentMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSubtle,
    paddingVertical: 8,
  },
});
