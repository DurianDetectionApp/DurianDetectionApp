import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { RecordingState } from '../../store/recordStore';
import { useTheme } from '../../theme/useTheme';
import { Radii, Shadows, Spacing } from '../../theme/typography';

interface DurlyMascotProps {
  state: RecordingState;
}

const STATE_IMAGES = {
  idle: require('../../../assets/images/durly_idle.png'),
  recording: require('../../../assets/images/durly_recording.png'),
  processing: require('../../../assets/images/durly_processing.png'),
  done: require('../../../assets/images/durly_done.png'),
  error: require('../../../assets/images/durly_error.png'),
};

export function DurlyMascot({ state }: DurlyMascotProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const STATE_CONFIG = {
    idle: { bg: colors.accentYellow, label: 'Ready!', border: colors.primaryLight },
    recording: { bg: '#FFE08A', label: "I'm listening! 🔴", border: colors.primary },
    processing: { bg: colors.bgSubtle, label: 'Analyzing...', border: colors.primaryLight },
    done: { bg: '#D6F0C0', label: 'Done!', border: colors.primary },
    error: { bg: '#FFEDED', label: 'Try again!', border: colors.underRipe },
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [state]);

  useEffect(() => {
    if (state === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.03, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state]);

  const config = STATE_CONFIG[state];
  const mascotImg = STATE_IMAGES[state];

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.mascotCard,
          { backgroundColor: config.bg, borderColor: config.border },
          Shadows.card,
        ]}
      >
        <Animated.Image
          source={mascotImg}
          style={[
            styles.mascotImage,
            { transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] },
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Speech bubble */}
      <View style={[styles.speechBubble, { borderColor: config.border }]}>
        <Text style={styles.speechText}>{config.label}</Text>
        {state === 'recording' && <View style={styles.recordingDot} />}
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  mascotCard: {
    width: 180,
    height: 180,
    borderRadius: Radii.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mascotImage: {
    width: 160,
    height: 160,
  },
  speechBubble: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: colors.surface,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...Shadows.card,
  },
  speechText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
});
