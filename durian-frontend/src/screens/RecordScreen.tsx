import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../components/shared/AppHeader';
import { DurlyMascot } from '../components/mascot/DurlyMascot';
import { AudioWaveform } from '../components/audio/AudioWaveform';
import { useRecordStore } from '../store/recordStore';
import { useHistoryStore } from '../store/historyStore';
import { startRecording, stopRecording } from '../services/audioService';
import { mockAnalyzeAudio } from '../services/aiService';
import { useTheme } from '../theme/useTheme';
import { Typography, Spacing, Radii, Shadows } from '../theme/typography';

export function RecordScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const { recordingState, setRecordingState, setCurrentResult, setAudioUri, reset } = useRecordStore();
  const { addScan } = useHistoryStore();

  const handleRecord = useCallback(async () => {
    if (recordingState === 'idle' || recordingState === 'error') {
      try {
        setRecordingState('recording');
        await startRecording();
      } catch (e: any) {
        Alert.alert('Permission Required', e.message || 'Microphone access is needed.');
        setRecordingState('idle');
      }
    } else if (recordingState === 'recording') {
      try {
        setRecordingState('processing');
        const uri = await stopRecording();
        setAudioUri(uri);
        const result = await mockAnalyzeAudio(uri);
        setCurrentResult(result);
        await addScan(result);
        setRecordingState('done');
      } catch (e: any) {
        Alert.alert('Error', 'Recording failed. Please try again.');
        setRecordingState('error');
      }
    } else if (recordingState === 'done') {
      navigation.navigate('Result');
    }
  }, [recordingState, navigation, setRecordingState, setAudioUri, setCurrentResult, addScan]);

  const handleReset = () => reset();

  const buttonConfig = {
    idle: { label: 'Start Recording', bg: colors.primary, Icon: Mic, textColor: colors.white },
    recording: { label: 'Stop Recording', bg: '#FF3B30', Icon: MicOff, textColor: colors.white },
    processing: { label: 'Analyzing...', bg: colors.primaryLight, Icon: Mic, textColor: colors.white },
    done: { label: 'View Results 🎉', bg: colors.primaryDark, Icon: Mic, textColor: colors.white },
    error: { label: 'Try Again', bg: colors.primary, Icon: Mic, textColor: colors.white },
  };

  const btn = buttonConfig[recordingState];
  const isProcessing = recordingState === 'processing';
  const isRecording = recordingState === 'recording';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mascotSection}>
          <DurlyMascot state={recordingState} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {recordingState === 'idle' ? 'Tap to Start'
              : recordingState === 'recording' ? 'Recording...'
              : recordingState === 'processing' ? 'Analyzing Sound'
              : recordingState === 'done' ? 'Analysis Done!'
              : 'Oops!'}
          </Text>
          <Text style={styles.subtitle}>
            {recordingState === 'idle'
              ? 'Durly will help you find the perfect ripeness by sound.'
              : recordingState === 'recording'
              ? 'Tap your durian gently on its widest part.'
              : recordingState === 'processing'
              ? 'Durly is reading the sound frequencies...'
              : recordingState === 'done'
              ? 'Your ripeness result is ready!'
              : 'Something went wrong. Try recording again.'}
          </Text>
        </View>

        <View style={styles.waveformSection}>
          <AudioWaveform isActive={isRecording} isPulsing={isProcessing} />
          <Text style={styles.waveformLabel}>
            {isRecording ? 'CAPTURING FREQUENCIES' : isProcessing ? 'ANALYZING...' : 'READY TO SCAN'}
          </Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.recordBtn, { backgroundColor: btn.bg }, Shadows.button]}
            onPress={handleRecord}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <btn.Icon size={20} color={btn.textColor} />
            )}
            <Text style={[styles.recordBtnText, { color: btn.textColor }]}>
              {btn.label}
            </Text>
          </TouchableOpacity>

          {(recordingState === 'done' || recordingState === 'error') && (
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Start new scan</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgLight },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  mascotSection: {
    marginTop: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  waveformSection: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: '100%',
    paddingVertical: Spacing.md,
    backgroundColor: colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  waveformLabel: {
    ...Typography.caption,
    color: colors.textMuted,
    letterSpacing: 1,
    fontWeight: '700',
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radii.pill,
    gap: Spacing.sm,
    width: '100%',
  },
  recordBtnText: {
    ...Typography.h3,
    fontWeight: '800',
  },
  resetBtn: {
    paddingVertical: Spacing.xs,
  },
  resetText: {
    ...Typography.caption,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
