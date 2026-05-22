import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, rf, isSmallDevice } from '../theme';

const TYPE_CONFIG = {
  credit:            { label: 'Crédit',            color: colors.success, sign: '+' },
  debit:             { label: 'Débit',             color: colors.danger,  sign: '-' },
  virement_entrant:  { label: 'Virement reçu',     color: colors.success, sign: '+' },
  virement_sortant:  { label: 'Virement émis',     color: colors.danger,  sign: '-' },
};

export default function TransactionItem({ transaction }) {
  const config = TYPE_CONFIG[transaction.type] || TYPE_CONFIG.credit;

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>{transaction.label}</Text>
        <Text style={styles.meta}>{config.label} · {transaction.date}</Text>
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  dot: {
    width: isSmallDevice ? 6 : 8,
    height: isSmallDevice ? 6 : 8,
    borderRadius: 4,
    marginRight: spacing.sm,
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
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  amount: {
    fontSize: rf(14),
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
