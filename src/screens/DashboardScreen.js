import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import AccountCard from '../components/AccountCard';

// Tâche 5 (Bonus) : onReset prop allows resetting all accounts to initial state
export default function DashboardScreen({ navigation, accounts, onReset }) {
  // Calcul du solde total
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Tâche 5 : Confirmation avant réinitialisation
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
      {/* Bandeau solde total */}
      <View style={styles.totalBanner}>
        <Text style={styles.totalLabel}>Patrimoine Total</Text>
        <Text style={styles.totalAmount}>
          {totalBalance.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
          })} MAD
        </Text>
        <Text style={styles.totalSub}>{accounts.length} compte(s) actif(s)</Text>
      </View>

      {/* Liste des comptes */}
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onPress={() =>
              navigation.navigate('AccountDetail', { accountId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Sélectionnez un compte</Text>
        }
        ListFooterComponent={
          // Tâche 5 (Bonus) : Bouton de réinitialisation
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>🔄 Réinitialiser les comptes</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.background },
  totalBanner: {
    backgroundColor: colors.primary,
    padding:         24,
    alignItems:      'center',
  },
  totalLabel:  { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  totalAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginVertical: 4 },
  totalSub:    { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  list:        { paddingBottom: 24 },
  sectionTitle:{
    fontSize:       13,
    color:          colors.textLight,
    paddingHorizontal: 16,
    paddingVertical:   12,
    textTransform:  'uppercase',
    letterSpacing:  0.8,
  },
  // Tâche 5 : Style du bouton de réinitialisation
  resetBtn: {
    marginHorizontal: 16,
    marginTop:        16,
    marginBottom:     8,
    paddingVertical:  14,
    borderRadius:     12,
    borderWidth:      1.5,
    borderColor:      colors.danger,
    alignItems:       'center',
    backgroundColor:  colors.card,
  },
  resetBtnText: {
    color:      colors.danger,
    fontSize:   14,
    fontWeight: '600',
  },
});
