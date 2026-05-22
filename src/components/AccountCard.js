import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { rf, isSmallDevice } from '../theme';

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
        <Text style={styles.balanceLabel}>Available balance</Text>
        <Text style={[styles.balance, { color: isPositive ? colors.white : colors.danger }]}>
          {account.balance.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} MAD
        </Text>
      </View>

      <Text style={styles.txCount}>
        {account.transactions.length} transaction{account.transactions.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: isSmallDevice ? 14 : 20,
    marginHorizontal: 16,
    marginVertical: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 10 : 14,
  },
  badge: {
    width: isSmallDevice ? 34 : 40,
    height: isSmallDevice ? 34 : 40,
    borderRadius: 12,
    backgroundColor: colors.accentDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    marginTop: 1,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: isSmallDevice ? 10 : 14,
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
    marginTop: isSmallDevice ? 6 : 10,
    textAlign: 'right',
    fontWeight: '500',
  },
});
