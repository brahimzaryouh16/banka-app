import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { isSmallDevice } from '../theme';

const s = isSmallDevice ? 18 : 22;
const lw = isSmallDevice ? 1.8 : 2;

function WalletIcon({ focused }) {
  const c = focused ? colors.accent : colors.textTertiary;
  return (
    <View style={styles.box}>
      <View style={[styles.cardBody, { borderColor: c }]}>
        <View style={[styles.cardLine, { backgroundColor: c }]} />
        <View style={[styles.cardLine, { backgroundColor: c, width: '55%' }]} />
      </View>
    </View>
  );
}

function ClockIcon({ focused }) {
  const c = focused ? colors.accent : colors.textTertiary;
  const handLen = s * 0.5;
  return (
    <View style={styles.box}>
      <View style={[styles.clockRing, { borderColor: c, width: s, height: s, borderRadius: s / 2 }]}>
        <View
          style={[
            styles.hand,
            {
              backgroundColor: c,
              width: lw,
              height: handLen,
              borderRadius: lw / 2,
              top: (s - handLen) / 2,
              left: (s - lw) / 2,
              transform: [{ rotate: '-50deg' }],
            },
          ]}
        />
        <View
          style={[
            styles.hand,
            {
              backgroundColor: c,
              width: lw,
              height: handLen * 0.7,
              borderRadius: lw / 2,
              top: (s - handLen * 0.7) / 2,
              left: (s - lw) / 2,
              transform: [{ rotate: '30deg' }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: s + 8,
    height: s + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    width: s,
    height: s * 0.75,
    borderRadius: 3,
    borderWidth: lw,
    justifyContent: 'center',
    paddingHorizontal: 3,
    gap: 2,
  },
  cardLine: {
    height: lw,
    width: '80%',
    borderRadius: 1,
  },
  clockRing: {
    borderWidth: lw,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hand: {
    position: 'absolute',
  },
});

export { WalletIcon, ClockIcon };
