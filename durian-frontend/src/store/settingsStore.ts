import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AudioQuality = 'low' | 'med' | 'high';
export type AppTheme = 'light' | 'dark';

interface SettingsStore {
  audioQuality: AudioQuality;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  theme: AppTheme;
  setAudioQuality: (q: AudioQuality) => void;
  setPushAlerts: (v: boolean) => void;
  setWeeklyDigest: (v: boolean) => void;
  setTheme: (t: AppTheme) => void;
  loadSettings: () => Promise<void>;
}

const SETTINGS_KEY = '@durly_settings';

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  audioQuality: 'high',
  pushAlerts: true,
  weeklyDigest: false,
  theme: 'light',

  setAudioQuality: async (audioQuality) => {
    set({ audioQuality });
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...get(), audioQuality }));
  },
  setPushAlerts: async (pushAlerts) => {
    set({ pushAlerts });
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...get(), pushAlerts }));
  },
  setWeeklyDigest: async (weeklyDigest) => {
    set({ weeklyDigest });
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...get(), weeklyDigest }));
  },
  setTheme: async (theme) => {
    set({ theme });
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...get(), theme }));
  },
  loadSettings: async () => {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          audioQuality: parsed.audioQuality ?? 'high',
          pushAlerts: parsed.pushAlerts ?? true,
          weeklyDigest: parsed.weeklyDigest ?? false,
          theme: parsed.theme ?? 'light',
        });
      }
    } catch {}
  },
}));
