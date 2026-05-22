import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, rf, isSmallDevice } from '../theme';
import TransactionItem from '../components/TransactionItem';

function parseDateDMY(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date(0);
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

export default function HistoryScreen({ accounts }) {
  const allTransactions = accounts
    .flatMap(acc =>
      acc.transactions.map(tx => ({
        ...tx,
        accountLabel: acc.label,
        accountType: acc.type,
        uniqueKey: acc.id + '-' + tx.id,
      }))
    )
    .sort((a, b) => {
      const dateA = parseDateDMY(a.date);
      const dateB = parseDateDMY(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Text style={styles.title}>Transaction History</Text>
          <Text style={styles.subtitle}>{allTransactions.length} transaction{allTransactions.length !== 1 ? 's' : ''}</Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={allTransactions}
        keyExtractor={(item) => item.uniqueKey}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.accountTag}>{item.accountLabel}</Text>
            <TransactionItem transaction={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions in history.</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safeTop: {
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: isSmallDevice ? spacing.md : spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: rf(28),
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: rf(13),
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  list: {
    paddingBottom: spacing.xl,
  },
  accountTag: {
    fontSize: rf(10),
    color: colors.textTertiary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  empty: {
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: rf(13),
  },
});
