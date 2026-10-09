// src/styles/log-field-incident/photoCaptureStyles.js
import { StyleSheet } from "react-native";
import { COLORS } from "./activePatrolStyles";

const FONTS = {
  regular: "Nunito_400Regular",
  medium: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
};

export const photoCaptureStyles = StyleSheet.create({
  // ---------- Chips row ----------
  chipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  chipAccent: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // ---------- Camera area ----------
  cameraArea: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },

  // ---------- Viewfinder ----------
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#FFFFFF",
  },
  cornerTL: {
    top: 24,
    left: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 24,
    right: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 24,
    left: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 24,
    right: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  viewfinderHint: {
    position: "absolute",
    bottom: 44,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.85,
  },

  // ---------- Preview (after capture) ----------
  previewImage: {
    ...StyleSheet.absoluteFillObject,
  },
  retakeButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  retakeButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: "#FFFFFF",
  },

  // ---------- Shutter ----------
  shutterRow: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.accent,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  shutterDisabled: {
    opacity: 0.5,
  },
  shutterInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    opacity: 0.15,
  },
  shutterUseText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // ---------- Skip button ----------
  skipButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  skipButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
  },

  // ---------- Permission / error ----------
  permissionBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 14,
  },
  permissionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.text,
    textAlign: "center",
  },
  permissionText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 19,
  },
  permissionPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    marginTop: 8,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionPrimaryText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
