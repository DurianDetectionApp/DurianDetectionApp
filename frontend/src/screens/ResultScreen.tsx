import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Share2, Star, Clock, RefreshCw } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppHeader } from "../components/shared/AppHeader";
import { useRecordStore, AIResult } from "../store/recordStore";
import { useTheme } from "../theme/useTheme";
import { RipenessType, RipenessColors, RipenessLabels } from "../theme/colors";
import { Typography, Spacing, Radii, Shadows } from "../theme/typography";

const RESULT_IMAGES = {
  ripe: require("../../assets/images/durly_done.jpg"),
  unripe: require("../../assets/images/durly_idle.jpg"),
};

const MOCK_REVIEWS = [
  {
    id: "1",
    name: "Aiman R.",
    text: "Durly was spot on! The bitterness level was exactly what I look for in an old tree Musang King.",
    time: "2h ago",
    stars: 5,
  },
  {
    id: "2",
    name: "Sarah Tan",
    text: "The tactile feedback while recording was so fun. Best durian app ever!",
    time: "Yesterday",
    stars: 5,
  },
];

export function ResultScreen() {
  const { currentResult, reset } = useRecordStore();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const result: AIResult | null = route.params?.result ?? currentResult;

  if (!result) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <AppHeader />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🤔</Text>
          <Text style={styles.emptyText}>No result to display.</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { ripeness, confidence, variety, texture, description } = result;
  // Normalize backend ripeness strings so the UI only shows ripe or unripe.
  const normalizeRipeness = (r: any) => {
    if (!r || typeof r !== "string") return "unripe" as RipenessType;
    const s = r.trim().toLowerCase();
    if (s === "ripe") return "ripe" as RipenessType;
    if (s === "unripe" || s === "under_ripe") return "unripe" as RipenessType;
    return "unripe" as RipenessType;
  };

  const resolvedRipeness = normalizeRipeness(ripeness, confidence);
  const confidencePct = Math.round(confidence * 100);
  const badgeColor = RipenessColors[resolvedRipeness as RipenessType];
  const mascotImg = RESULT_IMAGES[resolvedRipeness as RipenessType];

  const displayLabel = RipenessLabels[resolvedRipeness as RipenessType];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌵 Durly says: ${variety} is ${displayLabel}! (${confidencePct}% confidence)\n\nCheck it out with the Durly app!`,
        title: "My Durian Ripeness Result",
      });
    } catch {}
  };

  const handleRecordAgain = () => {
    reset();
    navigation.navigate("Record");
  };

  const handleViewHistory = () => {
    navigation.navigate("History");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.confidenceWrapper}>
          <View
            style={[styles.confidenceBadge, { backgroundColor: badgeColor }]}
          >
            <Text style={styles.confidenceText}>{confidencePct}% Match</Text>
          </View>
        </View>

        <View style={[styles.heroCard, Shadows.card]}>
          <View
            style={[styles.mascotBg, { backgroundColor: colors.accentYellow }]}
          >
            <Image
              source={mascotImg}
              style={styles.heroMascot}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.ripenessLabel, { color: badgeColor }]}>
            {displayLabel}!
          </Text>
          <Text style={styles.ripenessDesc}>{description}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaLabel}>VARIETY</Text>
            <Text style={styles.metaValue}>{variety}</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaLabel}>TEXTURE</Text>
            <Text style={styles.metaValue}>{texture}</Text>
          </View>
        </View>

        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>User Reviews</Text>
            <Text style={styles.reviewsAvg}>4.9/5</Text>
          </View>
          {MOCK_REVIEWS.map((review) => (
            <View key={review.id} style={[styles.reviewCard, Shadows.card]}>
              <View style={styles.reviewTop}>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      color={
                        i < review.stars ? colors.accentGold : colors.border
                      }
                      fill={
                        i < review.stars ? colors.accentGold : "transparent"
                      }
                    />
                  ))}
                </View>
                <Text style={styles.reviewTime}>{review.time}</Text>
              </View>
              <Text style={styles.reviewText}>"{review.text}"</Text>
              <View style={styles.reviewAuthorRow}>
                <View style={styles.reviewAvatar}>
                  <Text style={{ fontSize: 12 }}>👤</Text>
                </View>
                <Text style={styles.reviewAuthor}>{review.name}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.shareBtn, Shadows.button]}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Share2 size={18} color={colors.white} />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.historyBtn]}
              onPress={handleViewHistory}
            >
              <Clock size={16} color={colors.textPrimary} />
              <Text style={styles.actionBtnText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.recordBtn]}
              onPress={handleRecordAgain}
            >
              <RefreshCw size={16} color={colors.white} />
              <Text style={[styles.actionBtnText, { color: colors.white }]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.bgLight },
    scroll: {
      flexGrow: 1,
      padding: Spacing.md,
      gap: Spacing.md,
      paddingBottom: Spacing.xl,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.md,
    },
    emptyEmoji: { fontSize: 60 },
    emptyText: { ...Typography.h3, color: colors.textSecondary },
    backBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.sm,
      borderRadius: Radii.pill,
    },
    backBtnText: { ...Typography.label, color: colors.white },
    confidenceWrapper: { alignItems: "flex-end" },
    confidenceBadge: {
      paddingHorizontal: Spacing.sm + 4,
      paddingVertical: 4,
      borderRadius: Radii.md,
    },
    confidenceText: { ...Typography.label, color: colors.white, fontSize: 12 },
    heroCard: {
      backgroundColor: colors.surface,
      borderRadius: Radii.lg,
      overflow: "hidden",
      alignItems: "center",
      paddingBottom: Spacing.md,
    },
    mascotBg: {
      width: "100%",
      height: 160,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    heroMascot: { width: 140, height: 140 },
    ripenessLabel: { ...Typography.h2, marginTop: Spacing.sm },
    ripenessDesc: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: "center",
      paddingHorizontal: Spacing.md,
      marginTop: 4,
    },
    metaRow: { flexDirection: "row", gap: Spacing.sm },
    metaChip: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: Radii.md,
      padding: Spacing.md,
      gap: 4,
      ...Shadows.card,
    },
    metaLabel: {
      ...Typography.caption,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    metaValue: { ...Typography.h3, color: colors.textPrimary },
    reviewsSection: { gap: Spacing.sm },
    reviewsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    reviewsTitle: { ...Typography.h3, color: colors.textPrimary },
    reviewsAvg: {
      ...Typography.caption,
      color: colors.primaryDark,
      fontWeight: "700",
    },
    reviewCard: {
      backgroundColor:
        colors.bgLight === "#12140F"
          ? colors.surfaceCard
          : colors.accentYellow + "22",
      borderRadius: Radii.md,
      padding: Spacing.md,
      gap: 6,
    },
    reviewTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    starsRow: { flexDirection: "row", gap: 2 },
    reviewTime: { ...Typography.caption, color: colors.textMuted },
    reviewText: {
      ...Typography.body,
      color: colors.textPrimary,
      fontStyle: "italic",
      fontSize: 12,
    },
    reviewAuthorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    reviewAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.bgSubtle,
      alignItems: "center",
      justifyContent: "center",
    },
    reviewAuthor: { ...Typography.caption, color: colors.textSecondary },
    actionsSection: {
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    shareBtn: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: Spacing.md,
      borderRadius: Radii.pill,
    },
    shareBtnText: { ...Typography.h3, color: colors.white, fontWeight: "800" },
    secondaryActions: {
      flexDirection: "row",
      gap: Spacing.sm,
    },
    actionBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: Spacing.md - 2,
      borderRadius: Radii.pill,
    },
    historyBtn: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    recordBtn: {
      backgroundColor: colors.primaryDark,
    },
    actionBtnText: {
      ...Typography.label,
      fontSize: 12,
    },
  });
