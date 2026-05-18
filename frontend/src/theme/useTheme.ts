import { useSettingsStore } from '../store/settingsStore';
import { LightTheme, DarkTheme } from './colors';

export function useTheme() {
  const { theme } = useSettingsStore();
  const isDark = theme === 'dark';
  const colors = isDark ? DarkTheme : LightTheme;
  
  return {
    colors,
    isDark,
  };
}
