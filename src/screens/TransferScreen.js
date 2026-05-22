import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { colors } from '../theme/colors';

// Tâche 2 : Implémentation complète de TransferScreen
export default function TransferScreen({ route, navigation, accounts, onTransfer }) {
  const { fromAccountId } = route.params;

  // Compte source pré-sélectionné
  const sourceAccount = accounts.find(a => a.id === fromAccountId);

  // Comptes destinataires possibles (tous sauf le source)
  const otherAccounts = accounts.filter(a => a.id !== fromAccountId);

  const [selectedDestId, setSelectedDestId] = useState(null);
  const [amount, setAmount]                 = useState('');
  const [label, setLabel]                   = useState('');

  if (!sourceAccount) {
    return <Text style={{ padding: 20 }}>Compte source introuvable.</Text>;
  }

  const handleTransfer = () => {
    const numAmount = parseFloat(amount);

    // Validations
    if (!selectedDestId) {
      Alert.alert('Destinataire manquant', 'Veuillez sélectionner un compte destinataire.');
      return;
    }
    if (!label.trim()) {
      Alert.alert('Champ manquant', 'Veuillez saisir un libellé pour le virement.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Montant invalide', 'Veuillez saisir un montant positif.');
      return;
    }
    // Règle métier : rejet si solde insuffisant
    if (numAmount > sourceAccount.balance) {
      Alert.alert(
        'Solde insuffisant',
        `Votre solde sur ${sourceAccount.label} est de ${sourceAccount.balance.toLocaleString('fr-FR')} MAD.\nLe virement de ${numAmount.toLocaleString('fr-FR')} MAD est rejeté.`
      );
      return;
    }

    const destAccount = accounts.find(a => a.id === selectedDestId);

    // Confirmation
    Alert.alert(
      '↗ Confirmer le Virement',
      `De : ${sourceAccount.label}\nVers : ${destAccount.label}\nMontant : ${numAmount.toLocaleString('fr-FR')} MAD\nLibellé : "${label}"`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            onTransfer(fromAccountId, selectedDestId, numAmount, label);
            Alert.alert('Virement effectué', `${numAmount.toLocaleString('fr-FR')} MAD transférés vers ${destAccount.label}.`);
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Source Account Banner */}
        <View style={styles.sourceBanner}>
          <Text style={styles.sourceLabel}>Compte source</Text>
          <Text style={styles.sourceName}>{sourceAccount.label}</Text>
          <Text style={styles.sourceBalance}>
            Solde : {sourceAccount.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
          </Text>
          <Text style={styles.sourceIban}>{sourceAccount.iban}</Text>
        </View>

        {/* Destination Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte destinataire</Text>
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
                    Solde : {acc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transfer Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Détails du virement</Text>
          <TextInput
            style={styles.input}
            placeholder="Libellé du virement"
            value={label}
            onChangeText={setLabel}
            placeholderTextColor={colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Montant en MAD"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholderTextColor={colors.textLight}
          />

          <TouchableOpacity
            style={styles.transferBtn}
            onPress={handleTransfer}
          >
            <Text style={styles.transferBtnText}>↗ Effectuer le virement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },

  // Source banner
  sourceBanner: {
    backgroundColor: colors.primary,
    padding:         24,
    alignItems:      'center',
  },
  sourceLabel: {
    color:    'rgba(255,255,255,0.6)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sourceName: {
    color:      '#fff',
    fontSize:   22,
    fontWeight: '800',
    marginTop:  4,
  },
  sourceBalance: {
    color:    'rgba(255,255,255,0.85)',
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
  },
  sourceIban: {
    color:    'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 4,
  },

  // Sections
  section: {
    padding: 16,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingBottom:     16,
  },
  sectionTitle: {
    fontSize:      13,
    color:         colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom:  12,
  },

  // Destination cards
  destCard: {
    backgroundColor: colors.card,
    borderRadius:    12,
    padding:         16,
    marginBottom:    10,
    borderWidth:     2,
    borderColor:     colors.border,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.05,
    shadowRadius:    3,
    elevation:       2,
  },
  destCardSelected: {
    borderColor:     colors.primary,
    backgroundColor: '#EBF0F9',
  },
  destRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  radio: {
    width:        22,
    height:       22,
    borderRadius: 11,
    borderWidth:  2,
    borderColor:  colors.border,
    justifyContent: 'center',
    alignItems:     'center',
    marginRight:    12,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width:           12,
    height:          12,
    borderRadius:    6,
    backgroundColor: colors.primary,
  },
  destInfo: {
    flex: 1,
  },
  destName: {
    fontSize:   15,
    fontWeight: '700',
    color:      colors.text,
  },
  destNameSelected: {
    color: colors.primary,
  },
  destIban: {
    fontSize: 11,
    color:    colors.textLight,
    marginTop: 2,
  },
  destBalance: {
    fontSize:   13,
    color:      colors.success,
    marginTop:  4,
    fontWeight: '600',
  },

  // Form inputs
  input: {
    borderWidth:       1,
    borderColor:       colors.border,
    borderRadius:      8,
    paddingHorizontal: 12,
    paddingVertical:   10,
    fontSize:          14,
    color:             colors.text,
    marginBottom:      10,
    backgroundColor:   colors.card,
  },

  // Transfer button
  transferBtn: {
    backgroundColor: colors.primary,
    borderRadius:    10,
    paddingVertical: 14,
    alignItems:      'center',
    marginTop:       6,
  },
  transferBtnText: {
    color:      '#fff',
    fontWeight: '700',
    fontSize:   16,
  },
});
