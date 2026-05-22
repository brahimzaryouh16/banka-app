import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, rf, isSmallDevice } from '../theme';

export default function AccountCard({ account, onPress }) {
  const isPositive = account.balance > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {account.type === 'courant' ? 'C' : account.type === 'epargne' ? 'E' : 'P'}
          </Text>
        </View>
        <View style={styles.topText}>
          <Text style={styles.label}>{account.label}</Text>
          <Text style={styles.iban}>{account.iban}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={[styles.balance, { color: isPositive ? colors.white : colors.danger }]}>
          {account.balance.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} MAD
        </Text>
      </View>

      <Text style={styles.txCount}>
        {account.transactions.length} opération{account.transactions.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    width: isSmallDevice ? 34 : 40,
    height: isSmallDevice ? 34 : 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accentDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  badgeText: {
    fontSize: rf(15),
    fontWeight: '800',
    color: colors.accent,
  },
  topText: {
    flex: 1,
  },
  label: {
    fontSize: rf(15),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.2,
  },
  iban: {
    fontSize: rf(10),
    color: colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: rf(12),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  balance: {
    fontSize: rf(20),
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  txCount: {
    fontSize: rf(10),
    color: colors.textTertiary,
    marginTop: spacing.sm,
    textAlign: 'right',
    fontWeight: '500',
  },
});
