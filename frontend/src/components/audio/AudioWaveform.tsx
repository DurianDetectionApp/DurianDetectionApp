import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Radii, Spacing } from '../../theme/typography';

interface AudioWaveformProps {
  isActive: boolean;
  isPulsing?: boolean;
  barCount?: number;
}

export function AudioWaveform({ isActive, isPulsing = false, barCount = 12 }: AudioWaveformProps) {
  const { colors } = useTheme();
  const animations = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    if (isActive) {
      const anims = animations.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 60),
            Animated.timing(anim, {
              toValue: 0.3 + Math.random() * 0.7,
              duration: 300 + Math.random() * 300,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0.15 + Math.random() * 0.3,
              duration: 300 + Math.random() * 300,
              useNativeDriver: false,
            }),
          ])
        )
      );
      anims.forEach((a) => a.start());
      return () => anims.forEach((a) => a.stop());
    } else if (isPulsing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(animations[Math.floor(barCount / 2)], {
            toValue: 0.6,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(animations[Math.floor(barCount / 2)], {
            toValue: 0.2,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      animations.forEach((anim) => anim.setValue(0.2));
    }
  }, [isActive, isPulsing, barCount, animations]);

  return (
    <View style={styles.container}>
      {animations.map((anim, i) => {
        const isCenter = i >= barCount / 2 - 2 && i <= barCount / 2 + 2;
        return (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              {
                height: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, isCenter ? 32 : 22],
                }),
                backgroundColor: isActive
                  ? isCenter
                    ? colors.primary
                    : colors.primaryLight
                  : colors.border,
                borderRadius: Radii.sm,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 36,
    paddingHorizontal: Spacing.md,
  },
  bar: {
    width: 5,
    borderRadius: 4,
  },
});
