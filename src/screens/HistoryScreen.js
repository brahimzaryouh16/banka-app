import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import TransactionItem from '../components/TransactionItem';

// Tâche 4 : Helper function to parse DD/MM/YYYY date strings into Date objects
function parseDateDMY(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date(0);
  const day   = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
  const year  = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

export default function HistoryScreen({ accounts }) {
  // Agréger toutes les transactions de tous les comptes
  const allTransactions = accounts
    .flatMap(acc =>
      acc.transactions.map(tx => ({
        ...tx,
        accountLabel: acc.label,
        uniqueKey: acc.id + '-' + tx.id,
      }))
    )
    // Tâche 4 : Tri chronologique décroissant en parsant les dates DD/MM/YYYY
    .sort((a, b) => {
      const dateA = parseDateDMY(a.date);
      const dateB = parseDateDMY(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <View style={styles.container}>
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
          <Text style={styles.empty}>Aucune opération dans l'historique.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.background },
  accountTag: {
    fontSize:         11,
    color:            colors.textLight,
    paddingHorizontal:16,
    paddingTop:       10,
    paddingBottom:    2,
    textTransform:    'uppercase',
    letterSpacing:    0.6,
  },
  empty: { padding: 30, textAlign: 'center', color: colors.textLight },
});
