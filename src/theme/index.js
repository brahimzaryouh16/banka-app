import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');
export const isSmallDevice = width < 375 || height < 700;

export function rf(size) {
  return isSmallDevice ? Math.round(size * 0.85) : size;
}

export const spacing = {
  xs: isSmallDevice ? 4 : 4,
  sm: isSmallDevice ? 8 : 10,
  md: isSmallDevice ? 14 : 18,
  lg: isSmallDevice ? 20 : 26,
  xl: isSmallDevice ? 26 : 34,
  xxl: isSmallDevice ? 38 : 50,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = StyleSheet.create({
  screenTitle: {
    fontSize: rf(28),
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: rf(15),
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: rf(22),
  },
  label: {
    fontSize: rf(13),
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: rf(11),
    fontWeight: '500',
    color: colors.textTertiary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: rf(20),
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  amountLarge: {
    fontSize: rf(34),
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
});

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};
