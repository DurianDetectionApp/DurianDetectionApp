import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Switch, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Volume2, Bell, Palette, Sun, Moon, 
  User, LogOut, Shield, History as HistoryIcon,
} from 'lucide-react-native';
import { AppHeader } from '../components/shared/AppHeader';
import { useSettingsStore, AudioQuality } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme/useTheme';
import { Typography, Spacing, Radii, Shadows } from '../theme/typography';

const QUALITY_OPTIONS: { label: string; value: AudioQuality }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Med', value: 'med' },
  { label: 'High', value: 'high' },
];

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  colors: any;
}

function SettingsCard({ icon, title, children, colors }: SettingsCardProps) {
  const styles = getStyles(colors);
  return (
    <View style={[styles.card, Shadows.card]}>
      <View style={styles.cardHeader}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

interface ToggleRowProps {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: any;
}

function ToggleRow({ label, subtitle, value, onToggle, colors }: ToggleRowProps) {
  const styles = getStyles(colors);
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
}

export function SettingsScreen() {
  const {
    audioQuality, setAudioQuality,
    pushAlerts, setPushAlerts,
    weeklyDigest, setWeeklyDigest,
    theme, setTheme,
  } = useSettingsStore();
  const { user, logout } = useAuthStore();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* User Profile Section */}
        <View style={[styles.profileCard, Shadows.card]}>
          <View style={styles.profileTop}>
            <View style={styles.avatarBg}>
              <Text style={{ fontSize: 24 }}>🧔</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.username || 'Durian Lover'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@durly.ai'}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileDivider} />
          
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <HistoryIcon size={14} color={colors.primary} />
              <Text style={styles.statLabel}>Status:</Text>
              <Text style={styles.statValue}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Shield size={14} color={colors.primary} />
              <Text style={styles.statLabel}>Password:</Text>
              <Text style={styles.statValue}>********</Text>
            </View>
          </View>
        </View>

        <SettingsCard colors={colors} icon={<Volume2 size={18} color={colors.primaryDark} />} title="Audio Quality">
          <View style={styles.qualityRow}>
            <Text style={styles.qualityLabel}>Playback Bitrate</Text>
            <Text style={[styles.qualityValue, { color: colors.primary }]}>
              {QUALITY_OPTIONS.find((q) => q.value === audioQuality)?.label ?? 'High'}
            </Text>
          </View>
          <View style={styles.segmentedControl}>
            {QUALITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.segmentBtn,
                  audioQuality === opt.value && { backgroundColor: colors.primary },
                ]}
                onPress={() => setAudioQuality(opt.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    audioQuality === opt.value && { color: colors.white },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingsCard>

        <SettingsCard colors={colors} icon={<Bell size={18} color={colors.primaryDark} />} title="Notifications">
          <ToggleRow
            label="Push Alerts"
            subtitle="Real-time ripening alerts"
            value={pushAlerts}
            onToggle={setPushAlerts}
            colors={colors}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Weekly Digest"
            subtitle="Durian season summaries"
            value={weeklyDigest}
            onToggle={setWeeklyDigest}
            colors={colors}
          />
        </SettingsCard>

        <SettingsCard colors={colors} icon={<Palette size={18} color={colors.primaryDark} />} title="Theme Preference">
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'light' && { backgroundColor: colors.primary }]}
              onPress={() => setTheme('light')}
              activeOpacity={0.8}
            >
              <Sun size={18} color={theme === 'light' ? colors.white : colors.textMuted} />
              <Text style={[styles.themeBtnText, theme === 'light' && { color: colors.white }]}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'dark' && { backgroundColor: colors.primary }]}
              onPress={() => setTheme('dark')}
              activeOpacity={0.8}
            >
              <Moon size={18} color={theme === 'dark' ? colors.white : colors.textMuted} />
              <Text style={[styles.themeBtnText, theme === 'dark' && { color: colors.white }]}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </SettingsCard>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutBtn, Shadows.card]} 
          onPress={logout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footerInfo}>
          <Text style={styles.footerVersion}>Durly v2.4.1 (Thorny)</Text>
          <Text style={styles.footerCopyright}>© 2026 Durly AI Team</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgLight },
  scroll: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  pageTitle: { ...Typography.h1, color: colors.textPrimary },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primaryLight + '44',
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    ...Typography.h3,
    color: colors.textPrimary,
  },
  profileEmail: {
    ...Typography.caption,
    color: colors.textMuted,
  },
  editBtn: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: Radii.sm,
    backgroundColor: colors.bgSubtle,
  },
  editBtnText: {
    ...Typography.label,
    color: colors.primaryDark,
    fontSize: 11,
  },
  profileDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: Spacing.md,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    ...Typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  statValue: {
    ...Typography.caption,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardTitle: { ...Typography.h3, color: colors.textPrimary, fontSize: 13 },
  qualityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qualityLabel: { ...Typography.body, color: colors.textSecondary, fontSize: 12 },
  qualityValue: { ...Typography.label, fontSize: 12 },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.bgSubtle,
    borderRadius: Radii.md,
    padding: 3,
    gap: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radii.sm,
    alignItems: 'center',
  },
  segmentText: { ...Typography.label, color: colors.textMuted, fontSize: 11 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggleInfo: { flex: 1, gap: 1 },
  toggleLabel: { ...Typography.label, color: colors.textPrimary, fontSize: 13 },
  toggleSub: { ...Typography.caption, color: colors.textMuted, fontSize: 11 },
  divider: { height: 1, backgroundColor: colors.border },
  themeRow: { flexDirection: 'row', gap: Spacing.sm },
  themeBtn: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
    borderRadius: Radii.md,
    padding: Spacing.md - 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  themeBtnText: { ...Typography.label, color: colors.textMuted, fontSize: 12 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FF3B3044',
  },
  logoutText: {
    ...Typography.h3,
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '800',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 2,
  },
  footerVersion: { ...Typography.caption, color: colors.textMuted },
  footerCopyright: { ...Typography.caption, color: colors.textMuted, fontSize: 10 },
});
