import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Clock,
  Trash2,
  ChevronRight,
  Globe,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { AppHeader } from "../components/shared/AppHeader";
import { RipenessBadge } from "../components/shared/RipenessBadge";
import { useHistoryStore, ScanRecord } from "../store/historyStore";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../theme/useTheme";
import { RipenessType } from "../theme/colors";
import { Typography, Spacing, Radii, Shadows } from "../theme/typography";

const VARIETY_EMOJI: Record<string, string> = {
  "Musang King": "👑",
  "D24 Sultan": "🌿",
  "Black Thorn": "🌵",
  "Golden Phoenix": "⚡",
  "Red Prawn": "🦐",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;

  return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`;
}

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { scans, globalScans, isLoaded, loadHistory, deleteScan } =
    useHistoryStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"personal" | "global">(
    user?.role === "admin" ? "global" : "personal",
  );

  useEffect(() => {
    if (!isLoaded) loadHistory();
  }, [isLoaded, loadHistory]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Scan", "Remove this scan from your history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteScan(id) },
    ]);
  };

  const renderItem = ({ item, index }: { item: ScanRecord; index: number }) => (
    <Animated.View style={[styles.historyItem, Shadows.card]}>
      <View style={styles.itemIconWrapper}>
        <Text style={styles.itemIcon}>
          {VARIETY_EMOJI[item.variety] ?? "🍈"}
        </Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeaderRow}>
          <Text style={styles.itemVariety}>{item.variety}</Text>
          {activeTab === "global" && (
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>{item.username}</Text>
            </View>
          )}
        </View>
        <View style={styles.itemDateRow}>
          <Clock size={10} color={colors.textMuted} />
          <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>
      <RipenessBadge ripeness={item.ripeness as RipenessType} size="sm" />
      {activeTab === "personal" && (
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteBtn}
          hitSlop={12}
        >
          <Trash2 size={14} color={colors.textMuted} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("Result", { result: item })}
        style={styles.detailBtn}
      >
        <ChevronRight size={14} color={colors.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <AppHeader />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "personal" && styles.activeTab]}
          onPress={() => setActiveTab("personal")}
        >
          <UserIcon
            size={16}
            color={activeTab === "personal" ? colors.white : colors.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "personal" && styles.activeTabText,
            ]}
          >
            My Scans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "global" && styles.activeTab]}
          onPress={() => setActiveTab("global")}
        >
          <Globe
            size={16}
            color={activeTab === "global" ? colors.white : colors.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "global" && styles.activeTabText,
            ]}
          >
            Community
          </Text>
          {user?.role === "admin" && (
            <ShieldCheck
              size={12}
              color={activeTab === "global" ? colors.white : colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === "personal" ? scans : globalScans}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.pageTitle}>
              {activeTab === "personal" ? "My History" : "Live Activity"}
            </Text>
            <Text style={styles.pageSubtitle}>
              {activeTab === "personal"
                ? "Review your past ripeness recordings."
                : "Latest scans from the community."}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>
              {activeTab === "personal" ? "🍈" : "🌍"}
            </Text>
            <Text style={styles.emptyTitle}>Nothing here yet!</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "personal"
                ? "Start recording to build your history."
                : "No community scans available yet."}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.bgLight },
    tabContainer: {
      flexDirection: "row",
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: Radii.pill,
      backgroundColor: colors.surface,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeTab: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tabText: {
      ...Typography.label,
      color: colors.textMuted,
      fontSize: 12,
    },
    activeTabText: {
      color: colors.white,
    },
    list: {
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.xl,
    },
    header: { gap: 4, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
    pageTitle: { ...Typography.h1, color: colors.textPrimary },
    pageSubtitle: { ...Typography.body, color: colors.textSecondary },
    historyItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: Radii.md,
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    itemIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor:
        colors.accentYellow + (colors.bgLight === "#12140F" ? "33" : "66"),
      alignItems: "center",
      justifyContent: "center",
    },
    itemIcon: { fontSize: 18 },
    itemContent: { flex: 1, gap: 2 },
    itemHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    itemVariety: { ...Typography.h3, color: colors.textPrimary, fontSize: 14 },
    userBadge: {
      backgroundColor: colors.bgSubtle,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    userBadgeText: {
      ...Typography.caption,
      fontSize: 9,
      color: colors.primaryDark,
      fontWeight: "800",
    },
    itemDateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    itemDate: { ...Typography.caption, color: colors.textMuted, fontSize: 10 },
    deleteBtn: { padding: 4 },
    detailBtn: { padding: 4 },
    emptyState: {
      alignItems: "center",
      gap: Spacing.xs,
      paddingVertical: Spacing.xxl,
    },
    emptyEmoji: { fontSize: 48 },
    emptyTitle: { ...Typography.h2, color: colors.textPrimary },
    emptySubtitle: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
