import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { initialAccounts } from './src/data/accounts';
import { colors } from './src/theme/colors';

import DashboardScreen    from './src/screens/DashboardScreen';
import AccountDetailScreen from './src/screens/AccountDetailScreen';
import TransferScreen     from './src/screens/TransferScreen';
import HistoryScreen      from './src/screens/HistoryScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack imbriqué dans l'onglet "Comptes"
function AccountsStack({ accounts, onDebit, onCredit, onTransfer, onReset }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:      { backgroundColor: colors.primary },
        headerTintColor:  '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Dashboard" options={{ title: 'Mes Comptes' }}>
        {(props) => (
          <DashboardScreen {...props} accounts={accounts} onReset={onReset} />
        )}
      </Stack.Screen>

      <Stack.Screen name="AccountDetail" options={{ title: 'Détail du Compte' }}>
        {(props) => (
          <AccountDetailScreen
            {...props}
            accounts={accounts}
            onDebit={onDebit}
            onCredit={onCredit}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Transfer" options={{ title: 'Virement' }}>
        {(props) => (
          <TransferScreen
            {...props}
            accounts={accounts}
            onTransfer={onTransfer}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  // ─── État global des comptes ────────────────────────────────────────────────
  const [accounts, setAccounts] = useState(initialAccounts);

  // ─── Tâche 1 : Correction du bug handleDebit ───────────────────────────────
  // L'ancienne version utilisait .filter(Boolean) qui supprimait le compte en cas
  // de solde insuffisant. La correction : on retourne simplement le compte inchangé
  // au lieu de null. La vérification du solde est déjà faite côté écran
  // (AccountDetailScreen), mais on la fait aussi ici par sécurité (double validation).
  const handleDebit = (accountId, amount, label) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id !== accountId) return acc;

        // Règle métier : rejet si solde insuffisant — on retourne le compte INCHANGÉ
        if (acc.balance < amount) return acc;

        const newTransaction = {
          id:     'T' + Date.now(),
          type:   'debit',
          amount,
          label,
          date:   new Date().toLocaleDateString('fr-FR'),
        };
        return {
          ...acc,
          balance:      acc.balance - amount,
          transactions: [newTransaction, ...acc.transactions],
        };
      })
    );
  };

  // ─── Opération : Crédit ─────────────────────────────────────────────────────
  const handleCredit = (accountId, amount, label) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id !== accountId) return acc;
        const newTransaction = {
          id:     'T' + Date.now(),
          type:   'credit',
          amount,
          label,
          date:   new Date().toLocaleDateString('fr-FR'),
        };
        return {
          ...acc,
          balance:      acc.balance + amount,
          transactions: [newTransaction, ...acc.transactions],
        };
      })
    );
  };

  // ─── Tâche 2 : Implémentation complète du virement ─────────────────────────
  // Crée deux transactions : virement_sortant sur le compte source
  // et virement_entrant sur le compte destinataire.
  // Le solde est vérifié côté écran (TransferScreen) ET ici par sécurité.
  const handleTransfer = (fromId, toId, amount, label) => {
    setAccounts(prev =>
      prev.map(acc => {
        // Compte source : débiter
        if (acc.id === fromId) {
          // Sécurité : rejet si solde insuffisant
          if (acc.balance < amount) return acc;

          const outTransaction = {
            id:     'T' + Date.now() + '_out',
            type:   'virement_sortant',
            amount,
            label:  label || `Virement vers ${prev.find(a => a.id === toId)?.label || 'compte'}`,
            date:   new Date().toLocaleDateString('fr-FR'),
          };
          return {
            ...acc,
            balance:      acc.balance - amount,
            transactions: [outTransaction, ...acc.transactions],
          };
        }

        // Compte destinataire : créditer
        if (acc.id === toId) {
          const inTransaction = {
            id:     'T' + Date.now() + '_in',
            type:   'virement_entrant',
            amount,
            label:  label || `Virement de ${prev.find(a => a.id === fromId)?.label || 'compte'}`,
            date:   new Date().toLocaleDateString('fr-FR'),
          };
          return {
            ...acc,
            balance:      acc.balance + amount,
            transactions: [inTransaction, ...acc.transactions],
          };
        }

        // Autres comptes : inchangés
        return acc;
      })
    );
  };

  // ─── Tâche 5 (Bonus) : Réinitialisation ────────────────────────────────────
  const handleReset = () => {
    setAccounts(initialAccounts);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor:   colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            borderTopColor: colors.border,
            height:         60,
            paddingBottom:  6,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="AccountsTab"
          options={{
            tabBarLabel: 'Comptes',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏦</Text>,
          }}
        >
          {() => (
            <AccountsStack
              accounts={accounts}
              onDebit={handleDebit}
              onCredit={handleCredit}
              onTransfer={handleTransfer}
              onReset={handleReset}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="HistoryTab"
          options={{
            tabBarLabel: 'Historique',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
            headerShown: true,
            headerStyle:      { backgroundColor: colors.primary },
            headerTintColor:  '#fff',
            headerTitleStyle: { fontWeight: '700' },
            title: 'Historique',
          }}
        >
          {() => <HistoryScreen accounts={accounts} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
