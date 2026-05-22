import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../theme/useTheme";
import {
  RipenessType,
  RipenessColors,
  RipenessLabels,
} from "../../theme/colors";
import { Typography, Radii, Spacing } from "../../theme/typography";

interface RipenessBadgeProps {
  ripeness: RipenessType;
  size?: "sm" | "md";
}

export function RipenessBadge({ ripeness, size = "md" }: RipenessBadgeProps) {
  const { isDark } = useTheme();
  const baseColor = RipenessColors[ripeness];
  const bgColor = baseColor + (isDark ? "44" : "22");
  const textColor = isDark
    ? ripeness === "unripe"
      ? "#FFE066"
      : baseColor
    : ripeness === "unripe"
      ? "#7A6000"
      : baseColor;

  const label = RipenessLabels[ripeness];
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bgColor, borderColor: baseColor + "44" },
        isSmall && styles.badgeSm,
      ]}
    >
      <Text
        style={[styles.text, { color: textColor }, isSmall && styles.textSm]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.md,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: {
    ...Typography.label,
    fontSize: 13,
  },
  textSm: {
    fontSize: 11,
  },
});
