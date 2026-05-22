import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { rf, isSmallDevice } from '../theme';

const TYPE_CONFIG = {
  credit:            { label: 'Credit',           color: colors.success, sign: '+' },
  debit:             { label: 'Debit',             color: colors.danger,  sign: '-' },
  virement_entrant:  { label: 'Incoming Transfer', color: colors.success, sign: '+' },
  virement_sortant:  { label: 'Outgoing Transfer', color: colors.danger,  sign: '-' },
};

export default function TransactionItem({ transaction }) {
  const config = TYPE_CONFIG[transaction.type] || TYPE_CONFIG.credit;

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>{transaction.label}</Text>
        <Text style={styles.meta}>{config.label} &middot; {transaction.date}</Text>
      </View>
      <Text style={[styles.amount, { color: config.color }]}>
        {config.sign}{transaction.amount.toLocaleString('fr-FR')} MAD
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isSmallDevice ? 10 : 14,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
  },
  dot: {
    width: isSmallDevice ? 6 : 8,
    height: isSmallDevice ? 6 : 8,
    borderRadius: 4,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: rf(13),
    fontWeight: '600',
    color: colors.white,
    letterSpacing: -0.1,
  },
  meta: {
    fontSize: rf(11),
    color: colors.textSecondary,
    marginTop: 1,
    fontWeight: '500',
  },
  amount: {
    fontSize: rf(14),
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
