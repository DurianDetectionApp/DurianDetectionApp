import { StyleSheet } from 'react-native';

export const Typography = {
  display: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 30,
    lineHeight: 38,
  },
  h1: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    lineHeight: 32,
  },
  h2: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    lineHeight: 28,
  },
  h3: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
  },
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    lineHeight: 18,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const Radii = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 100,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#6DBE45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
};
