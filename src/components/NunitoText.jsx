import React from "react";
import {
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
} from "react-native";

const FONT_FAMILY_BY_WEIGHT = {
  normal: "Nunito_400Regular",
  400: "Nunito_400Regular",
  500: "Nunito_500Medium",
  600: "Nunito_600SemiBold",
  700: "Nunito_700Bold",
  bold: "Nunito_700Bold",
  800: "Nunito_800ExtraBold",
  900: "Nunito_800ExtraBold",
};

function withNunitoFont(style) {
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const { fontWeight, ...textStyle } = flattenedStyle;

  return {
    ...textStyle,
    fontFamily:
      FONT_FAMILY_BY_WEIGHT[String(fontWeight)] || "Nunito_400Regular",
  };
}

export const Text = React.forwardRef(function NunitoText(
  { style, ...props },
  ref,
) {
  return <NativeText ref={ref} {...props} style={withNunitoFont(style)} />;
});

export const TextInput = React.forwardRef(function NunitoTextInput(
  { style, ...props },
  ref,
) {
  return <NativeTextInput ref={ref} {...props} style={withNunitoFont(style)} />;
});
