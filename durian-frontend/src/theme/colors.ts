export const Palette = {
  primary: '#6DBE45',
  primaryDark: '#4A9A28',
  primaryLight: '#A8D97A',
  accentYellow: '#F5E27A',
  accentGold: '#D4A017',
  error: '#FF5252',
  white: '#FFFFFF',
  black: '#000000',
  ripe: '#6DBE45',
  underRipe: '#FF8B8B',
  overRipe: '#FFCC00',
  undetected: '#C0C0C0',
};

export const LightTheme = {
  ...Palette,
  bgLight: '#F7F9F2',
  bgSubtle: '#EEF4E6',
  surface: '#FFFFFF',
  surfaceCard: '#FAFDF6',
  textPrimary: '#1C2B0E',
  textSecondary: '#6B7C5A',
  textMuted: '#9BAD8A',
  border: '#E2EDCC',
  shadow: 'rgba(109, 190, 69, 0.15)',
  overlay: 'rgba(28, 43, 14, 0.4)',
};

export const DarkTheme = {
  ...Palette,
  bgLight: '#12140F',
  bgSubtle: '#1A1D16',
  surface: '#1E2319',
  surfaceCard: '#242B1F',
  textPrimary: '#F1F5EB',
  textSecondary: '#BDC7B3',
  textMuted: '#848E7A',
  border: '#2C3526',
  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  white: '#F1F5EB',
  black: '#000000',
};

// Default export for backward compatibility where possible, 
// but we'll prefer dynamic theme in components.
export const Colors = LightTheme;

export type RipenessType = 'ripe' | 'under_ripe' | 'over_ripe' | 'undetected';

export const RipenessColors: Record<RipenessType, string> = {
  ripe: Palette.ripe,
  under_ripe: Palette.underRipe,
  over_ripe: Palette.overRipe,
  undetected: Palette.undetected,
};

export const RipenessLabels: Record<RipenessType, string> = {
  ripe: 'Perfectly Ripe',
  under_ripe: 'Under-ripe',
  over_ripe: 'Over-ripe',
  undetected: 'Undetected',
};
