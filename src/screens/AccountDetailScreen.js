import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, borderRadius, rf, isSmallDevice } from '../theme';
import TransactionItem from '../components/TransactionItem';

export default function AccountDetailScreen({ route, navigation, accounts, onDebit, onCredit }) {
  const { accountId } = route.params;
  const account = accounts.find(a => a.id === accountId);

  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState(null);

  if (!account) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>Compte introuvable.</Text>
      </View>
    );
  }

  const isLowBalance = account.balance < 1000;
  const isZeroBalance = account.balance === 0;

  const handleOperation = () => {
    const numAmount = parseFloat(amount);

    if (!label.trim()) {
      Alert.alert('Champ manquant', 'Veuillez saisir un libellé.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Montant invalide', 'Veuillez saisir un montant positif.');
      return;
    }

    const confirmTitle = mode === 'debit' ? 'Confirmer le Débit' : 'Confirmer le Crédit';
    const confirmMessage = mode === 'debit'
      ? `Vous allez débiter ${numAmount.toLocaleString('fr-FR')} MAD.\nLibellé : "${label}"`
      : `Vous allez créditer ${numAmount.toLocaleString('fr-FR')} MAD.\nLibellé : "${label}"`;

    Alert.alert(confirmTitle, confirmMessage, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: () => {
          if (mode === 'debit') {
            const success = onDebit(accountId, numAmount, label);
            if (!success) {
              Alert.alert(
                'Solde insuffisant',
                `Votre solde est de ${account.balance.toLocaleString('fr-FR')} MAD. Opération rejetée.`
              );
              return;
            }
          } else {
            onCredit(accountId, numAmount, label);
          }
          setAmount('');
          setLabel('');
          setMode(null);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={account.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListHeaderComponent={
          <View>
            <SafeAreaView edges={['top']}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                  <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                  <Text style={styles.accountName}>{account.label}</Text>
                  <Text style={styles.accountType}>
                    {account.type === 'courant' ? 'Compte Courant' : account.type === 'epargne' ? 'Épargne' : 'Professionnel'}
                  </Text>
                </View>
              </View>
            </SafeAreaView>

            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Solde actuel</Text>
              <Text style={styles.balance}>
                {account.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
              </Text>
              {isLowBalance && (
                <View style={styles.warningBadge}>
                  <Text style={styles.warningText}>Solde bas</Text>
                </View>
              )}
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, isZeroBalance && styles.actionBtnDisabled]}
                onPress={() => {
                  if (isZeroBalance) {
                    Alert.alert('Solde nul', 'Votre solde est à 0 MAD. Impossible d\'effectuer un débit.');
                    return;
                  }
                  setMode(mode === 'debit' ? null : 'debit');
                }}
                disabled={isZeroBalance}
              >
                <Text style={styles.actionIcon}>−</Text>
                <Text style={styles.actionLabel}>Débit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.success }]}
                onPress={() => setMode(mode === 'credit' ? null : 'credit')}
              >
                <Text style={[styles.actionIcon, { color: colors.success }]}>+</Text>
                <Text style={[styles.actionLabel, { color: colors.success }]}>Crédit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.accent }]}
                onPress={() => navigation.navigate('Transfer', { fromAccountId: accountId })}
              >
                <Text style={[styles.actionIcon, { color: colors.accent }]}>→</Text>
                <Text style={[styles.actionLabel, { color: colors.accent }]}>Virement</Text>
              </TouchableOpacity>
            </View>

            {mode && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  {mode === 'debit' ? 'Nouveau Débit' : 'Nouveau Crédit'}
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Libellé de l'opération"
                    placeholderTextColor={colors.textTertiary}
                    value={label}
                    onChangeText={setLabel}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Montant en MAD"
                    placeholderTextColor={colors.textTertiary}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    { backgroundColor: mode === 'debit' ? colors.danger : colors.success },
                  ]}
                  onPress={handleOperation}
                >
                  <Text style={styles.submitBtnText}>Valider</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.historyTitle}>Historique des opérations</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune opération enregistrée.</Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: isSmallDevice ? 36 : 42,
    height: isSmallDevice ? 36 : 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  backArrow: {
    fontSize: rf(18),
    color: colors.white,
    fontWeight: '300',
  },
  headerInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: rf(20),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },
  accountType: {
    fontSize: rf(12),
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  balanceCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: rf(12),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  balance: {
    fontSize: rf(36),
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    marginTop: spacing.xs,
  },
  warningBadge: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.accentDim,
    borderRadius: borderRadius.pill,
  },
  warningText: {
    fontSize: rf(11),
    color: colors.accent,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: isSmallDevice ? 10 : 14,
    borderRadius: borderRadius.pill,
    borderWidth: 1.5,
    borderColor: colors.danger,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  actionBtnDisabled: {
    opacity: 0.35,
  },
  actionIcon: {
    fontSize: rf(18),
    fontWeight: '700',
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: rf(11),
    fontWeight: '600',
    color: colors.danger,
  },
  form: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  formTitle: {
    fontSize: rf(16),
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.md,
    letterSpacing: -0.2,
  },
  inputWrapper: {
    backgroundColor: colors.bg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: isSmallDevice ? 10 : 12,
    fontSize: rf(14),
    color: colors.white,
    fontWeight: '500',
  },
  submitBtn: {
    borderRadius: borderRadius.pill,
    paddingVertical: isSmallDevice ? 12 : 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: rf(15),
  },
  historyTitle: {
    fontSize: rf(12),
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
