import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { colors } from '../theme/colors';
import TransactionItem from '../components/TransactionItem';

export default function AccountDetailScreen({ route, navigation, accounts, onDebit, onCredit }) {
  const { accountId } = route.params;

  // Récupérer le compte depuis la prop accounts (pas les params — pourquoi ?)
  // Réponse : car les params sont un snapshot statique au moment de la navigation.
  // Si le solde change (après débit/crédit), les params ne se mettent pas à jour
  // mais accounts (venant de useState dans App.js) oui.
  const account = accounts.find(a => a.id === accountId);

  const [amount, setAmount]   = useState('');
  const [label,  setLabel]    = useState('');
  const [mode,   setMode]     = useState(null); // 'debit' | 'credit' | null

  if (!account) {
    return <Text style={{ padding: 20 }}>Compte introuvable.</Text>;
  }

  // Tâche 3 : Indicateur visuel si solde < 1000 MAD
  const isLowBalance = account.balance < 1000;
  // Tâche 3 : Désactivation du bouton débit si solde = 0
  const isZeroBalance = account.balance === 0;

  const handleOperation = () => {
    const numAmount = parseFloat(amount);

    // Validations
    if (!label.trim()) {
      Alert.alert('Champ manquant', 'Veuillez saisir un libellé.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Montant invalide', 'Veuillez saisir un montant positif.');
      return;
    }
    if (mode === 'debit' && numAmount > account.balance) {
      Alert.alert(
        'Solde insuffisant',
        `Votre solde est de ${account.balance.toLocaleString('fr-FR')} MAD. Opération rejetée.`
      );
      return;
    }

    // Tâche 3 : Message de confirmation différent selon le type d'opération
    const confirmTitle = mode === 'debit'
      ? '⚠️ Confirmer le Débit'
      : '✅ Confirmer le Crédit';

    const confirmMessage = mode === 'debit'
      ? `Vous allez débiter ${numAmount.toLocaleString('fr-FR')} MAD de votre compte.\nLibellé : "${label}"\n\nVotre nouveau solde sera de ${(account.balance - numAmount).toLocaleString('fr-FR')} MAD.`
      : `Vous allez créditer ${numAmount.toLocaleString('fr-FR')} MAD sur votre compte.\nLibellé : "${label}"\n\nVotre nouveau solde sera de ${(account.balance + numAmount).toLocaleString('fr-FR')} MAD.`;

    // Confirmation avant exécution
    Alert.alert(
      confirmTitle,
      confirmMessage,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            if (mode === 'debit') onDebit(accountId, numAmount, label);
            else                  onCredit(accountId, numAmount, label);
            setAmount('');
            setLabel('');
            setMode(null);
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
      <FlatList
        data={account.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListHeaderComponent={
          <View>
            {/* Solde du compte */}
            <View style={[
              styles.balanceBanner,
              // Tâche 3 : Couleur du bandeau change si solde bas
              isLowBalance && styles.balanceBannerLow
            ]}>
              <Text style={styles.accountName}>{account.label}</Text>
              <Text style={styles.balance}>
                {account.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
              </Text>
              {/* Tâche 3 : Indicateur visuel de solde bas */}
              {isLowBalance && (
                <View style={styles.lowBalanceWarning}>
                  <Text style={styles.lowBalanceText}>
                    ⚠️ Solde inférieur à 1 000 MAD
                  </Text>
                </View>
              )}
            </View>

            {/* Boutons d'action */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: isZeroBalance ? '#ccc' : colors.danger }
                ]}
                onPress={() => {
                  if (isZeroBalance) {
                    // Tâche 3 : Message si solde = 0
                    Alert.alert('Solde nul', 'Votre solde est à 0 MAD. Impossible d\'effectuer un débit.');
                    return;
                  }
                  setMode(mode === 'debit' ? null : 'debit');
                }}
                disabled={isZeroBalance}
              >
                <Text style={styles.actionBtnText}>↓ Débit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.success }]}
                onPress={() => setMode(mode === 'credit' ? null : 'credit')}
              >
                <Text style={styles.actionBtnText}>↑ Crédit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Transfer', { fromAccountId: accountId })}
              >
                <Text style={styles.actionBtnText}>↗ Virement</Text>
              </TouchableOpacity>
            </View>

            {/* Formulaire inline débit/crédit */}
            {mode && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  {mode === 'debit' ? '↓ Nouveau Débit' : '↑ Nouveau Crédit'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Libellé de l'opération"
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
                  style={[
                    styles.submitBtn,
                    { backgroundColor: mode === 'debit' ? colors.danger : colors.success }
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
  container:    { flex: 1, backgroundColor: colors.background },
  balanceBanner:{
    backgroundColor: colors.primary,
    padding:         24,
    alignItems:      'center',
  },
  // Tâche 3 : Style du bandeau quand solde bas
  balanceBannerLow: {
    backgroundColor: '#8B3A3A',
  },
  accountName:  { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  balance:      { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4 },
  // Tâche 3 : Style de l'avertissement solde bas
  lowBalanceWarning: {
    marginTop:       10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius:    20,
  },
  lowBalanceText: {
    color:    '#FFD93D',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow:   {
    flexDirection:  'row',
    justifyContent: 'space-between',
    padding:        16,
    gap:            8,
  },
  actionBtn:    {
    flex:           1,
    paddingVertical: 12,
    borderRadius:   10,
    alignItems:     'center',
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  form: {
    backgroundColor: colors.card,
    margin:          16,
    borderRadius:    12,
    padding:         16,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.08,
    shadowRadius:    4,
    elevation:       3,
  },
  formTitle:    { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  input: {
    borderWidth:   1,
    borderColor:   colors.border,
    borderRadius:  8,
    paddingHorizontal: 12,
    paddingVertical:   10,
    fontSize:      14,
    color:         colors.text,
    marginBottom:  10,
    backgroundColor: colors.background,
  },
  submitBtn:    { borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  submitBtnText:{ color: '#fff', fontWeight: '700', fontSize: 15 },
  historyTitle: {
    fontSize:         13,
    color:            colors.textLight,
    paddingHorizontal:16,
    paddingVertical:  12,
    textTransform:    'uppercase',
    letterSpacing:    0.8,
  },
  empty: { padding: 20, textAlign: 'center', color: colors.textLight },
});
