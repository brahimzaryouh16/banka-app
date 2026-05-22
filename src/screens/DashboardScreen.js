import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography, spacing, borderRadius, rf, isSmallDevice } from '../theme';
import AccountCard from '../components/AccountCard';

export default function DashboardScreen({ navigation, accounts, onReset }) {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser',
      'Êtes-vous sûr de vouloir réinitialiser tous les comptes à leur état initial ? Toutes les opérations seront perdues.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            onReset();
            Alert.alert('Succès', 'Tous les comptes ont été réinitialisés.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour</Text>
          <Text style={styles.title}>Amira Benali</Text>
        </View>
      </SafeAreaView>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Patrimoine Total</Text>
        <Text style={styles.totalAmount}>
          {totalBalance.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
          })} MAD
        </Text>
        <Text style={styles.totalSub}>{accounts.length} compte{accounts.length !== 1 ? 's' : ''} actif{accounts.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onPress={() => navigation.navigate('AccountDetail', { accountId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Sélectionnez un compte</Text>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Réinitialiser les comptes</Text>
          </TouchableOpacity>
        }
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
    paddingBottom: spacing.xs,
  },
  greeting: {
    fontSize: rf(14),
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: rf(30),
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  totalCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: rf(12),
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: rf(36),
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    marginVertical: spacing.xs,
  },
  totalSub: {
    fontSize: rf(11),
    color: colors.textTertiary,
    fontWeight: '500',
  },
  list: {
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: rf(12),
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  resetBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: isSmallDevice ? 10 : 14,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  resetBtnText: {
    color: colors.danger,
    fontSize: rf(13),
    fontWeight: '600',
  },
});
