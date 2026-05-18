import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { Typography, Spacing } from '../../theme/typography';

interface AppHeaderProps {
  onBellPress?: () => void;
}

export function AppHeader({ onBellPress }: AppHeaderProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🌵</Text>
        </View>
        <Text style={styles.logoText}>Durly</Text>
      </View>
      <TouchableOpacity style={styles.bellButton} onPress={onBellPress} activeOpacity={0.7}>
        <Bell size={18} color={colors.primaryDark} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: colors.bgLight,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentYellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  logoEmoji: {
    fontSize: 14,
  },
  logoText: {
    ...Typography.h2,
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
