import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, borderRadius, rf, isSmallDevice } from '../theme';

export default function TransferScreen({ route, navigation, accounts, onTransfer }) {
  const { fromAccountId } = route.params;
  const sourceAccount = accounts.find(a => a.id === fromAccountId);
  const otherAccounts = accounts.filter(a => a.id !== fromAccountId);

  const [selectedDestId, setSelectedDestId] = useState(null);
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');

  if (!sourceAccount) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>Source account not found.</Text>
      </View>
    );
  }

  const handleTransfer = () => {
    const numAmount = parseFloat(amount);

    if (!selectedDestId) {
      Alert.alert('Missing destination', 'Please select a destination account.');
      return;
    }
    if (!label.trim()) {
      Alert.alert('Missing field', 'Please enter a transfer label.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a positive amount.');
      return;
    }
    if (numAmount > sourceAccount.balance) {
      Alert.alert(
        'Insufficient balance',
        `Your ${sourceAccount.label} balance is ${sourceAccount.balance.toLocaleString('fr-FR')} MAD. Transfer rejected.`
      );
      return;
    }

    const destAccount = accounts.find(a => a.id === selectedDestId);

    Alert.alert(
      'Confirm Transfer',
      `From: ${sourceAccount.label}\nTo: ${destAccount.label}\nAmount: ${numAmount.toLocaleString('fr-FR')} MAD\nLabel: "${label}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            onTransfer(fromAccountId, selectedDestId, numAmount, label);
            Alert.alert('Transfer complete', `${numAmount.toLocaleString('fr-FR')} MAD sent to ${destAccount.label}.`);
            setAmount('');
            setLabel('');
            setSelectedDestId(null);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Transfer</Text>
          <View style={[styles.backBtn, { opacity: 0 }]} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sourceCard}>
          <Text style={styles.sourceLabel}>From</Text>
          <View style={styles.sourceRow}>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceBadgeText}>
                {sourceAccount.type === 'courant' ? 'C' : sourceAccount.type === 'epargne' ? 'E' : 'P'}
              </Text>
            </View>
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceName}>{sourceAccount.label}</Text>
              <Text style={styles.sourceBalance}>
                {sourceAccount.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destination Account</Text>
          {otherAccounts.map(acc => (
            <TouchableOpacity
              key={acc.id}
              style={[
                styles.destCard,
                selectedDestId === acc.id && styles.destCardSelected,
              ]}
              onPress={() => setSelectedDestId(acc.id)}
              activeOpacity={0.7}
            >
              <View style={styles.destRow}>
                <View style={[
                  styles.radio,
                  selectedDestId === acc.id && styles.radioSelected,
                ]}>
                  {selectedDestId === acc.id && <View style={styles.radioDot} />}
                </View>
                <View style={styles.destInfo}>
                  <Text style={[
                    styles.destName,
                    selectedDestId === acc.id && styles.destNameSelected,
                  ]}>
                    {acc.label}
                  </Text>
                  <Text style={styles.destIban}>{acc.iban}</Text>
                  <Text style={styles.destBalance}>
                    {acc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Transfer Details</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Transfer label"
              placeholderTextColor={colors.textTertiary}
              value={label}
              onChangeText={setLabel}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Amount in MAD"
              placeholderTextColor={colors.textTertiary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity style={styles.transferBtn} onPress={handleTransfer}>
            <Text style={styles.transferBtnText}>Send Transfer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: isSmallDevice ? spacing.xs : spacing.sm,
  },
  backBtn: {
    width: isSmallDevice ? 34 : 40,
    height: isSmallDevice ? 34 : 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: rf(18),
    color: colors.white,
    fontWeight: '300',
  },
  topBarTitle: {
    fontSize: rf(17),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  sourceCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 16,
    padding: isSmallDevice ? 14 : spacing.lg,
  },
  sourceLabel: {
    fontSize: rf(10),
    color: colors.textTertiary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceBadge: {
    width: isSmallDevice ? 38 : 44,
    height: isSmallDevice ? 38 : 44,
    borderRadius: 14,
    backgroundColor: colors.accentDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sourceBadgeText: {
    fontSize: rf(17),
    fontWeight: '800',
    color: colors.accent,
  },
  sourceInfo: {
    flex: 1,
  },
  sourceName: {
    fontSize: rf(16),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.2,
  },
  sourceBalance: {
    fontSize: rf(14),
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 1,
  },
  section: {
    padding: spacing.md,
  },
  formSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: rf(12),
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  destCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  destCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceLight,
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: isSmallDevice ? 20 : 22,
    height: isSmallDevice ? 20 : 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: isSmallDevice ? 10 : 12,
    height: isSmallDevice ? 10 : 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  destInfo: {
    flex: 1,
  },
  destName: {
    fontSize: rf(14),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.1,
  },
  destNameSelected: {
    color: colors.accent,
  },
  destIban: {
    fontSize: rf(10),
    color: colors.textSecondary,
    marginTop: 1,
    letterSpacing: 0.3,
  },
  destBalance: {
    fontSize: rf(12),
    color: colors.textTertiary,
    marginTop: 3,
    fontWeight: '500',
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: isSmallDevice ? 10 : 12,
    fontSize: rf(14),
    color: colors.white,
    fontWeight: '500',
  },
  transferBtn: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.pill,
    paddingVertical: isSmallDevice ? 14 : 16,
    alignItems: 'center',
    marginTop: 4,
  },
  transferBtnText: {
    color: colors.bg,
    fontWeight: '800',
    fontSize: rf(15),
    letterSpacing: -0.2,
  },
});
