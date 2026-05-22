import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initialAccounts } from './src/data/accounts';
import { colors } from './src/theme/colors';
import { isSmallDevice } from './src/theme';
import { WalletIcon, ClockIcon } from './src/components/TabBarIcons';

import DashboardScreen from './src/screens/DashboardScreen';
import AccountDetailScreen from './src/screens/AccountDetailScreen';
import TransferScreen from './src/screens/TransferScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.surface,
    text: colors.white,
    border: colors.border,
    notification: colors.accent,
  },
};

const tabHeight = isSmallDevice ? 56 : 62;

function AccountsStack({ accounts, onDebit, onCredit, onTransfer, onReset }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Dashboard">
        {(props) => (
          <DashboardScreen {...props} accounts={accounts} onReset={onReset} />
        )}
      </Stack.Screen>

      <Stack.Screen name="AccountDetail">
        {(props) => (
          <AccountDetailScreen
            {...props}
            accounts={accounts}
            onDebit={onDebit}
            onCredit={onCredit}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Transfer">
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
  const [accounts, setAccounts] = useState(initialAccounts);

  const handleDebit = (accountId, amount, label) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account || account.balance < amount) return false;

    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id !== accountId) return acc;
        const newTransaction = {
          id: 'T' + Date.now(),
          type: 'debit',
          amount,
          label,
          date: new Date().toLocaleDateString('fr-FR'),
        };
        return {
          ...acc,
          balance: acc.balance - amount,
          transactions: [newTransaction, ...acc.transactions],
        };
      })
    );
    return true;
  };

  const handleCredit = (accountId, amount, label) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id !== accountId) return acc;
        const newTransaction = {
          id: 'T' + Date.now(),
          type: 'credit',
          amount,
          label,
          date: new Date().toLocaleDateString('fr-FR'),
        };
        return {
          ...acc,
          balance: acc.balance + amount,
          transactions: [newTransaction, ...acc.transactions],
        };
      })
    );
  };

  const handleTransfer = (fromId, toId, amount, label) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === fromId) {
          if (acc.balance < amount) return acc;
          const outTransaction = {
            id: 'T' + Date.now() + '_out',
            type: 'virement_sortant',
            amount,
            label: label || `Virement vers ${prev.find(a => a.id === toId)?.label || 'compte'}`,
            date: new Date().toLocaleDateString('fr-FR'),
          };
          return {
            ...acc,
            balance: acc.balance - amount,
            transactions: [outTransaction, ...acc.transactions],
          };
        }
        if (acc.id === toId) {
          const inTransaction = {
            id: 'T' + Date.now() + '_in',
            type: 'virement_entrant',
            amount,
            label: label || `Virement de ${prev.find(a => a.id === fromId)?.label || 'compte'}`,
            date: new Date().toLocaleDateString('fr-FR'),
          };
          return {
            ...acc,
            balance: acc.balance + amount,
            transactions: [inTransaction, ...acc.transactions],
          };
        }
        return acc;
      })
    );
  };

  const handleReset = () => {
    setAccounts(initialAccounts);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: tabHeight,
              paddingBottom: isSmallDevice ? 6 : 8,
              paddingTop: isSmallDevice ? 4 : 6,
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textTertiary,
            tabBarLabelStyle: {
              fontSize: isSmallDevice ? 9 : 10,
              fontWeight: '700',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            },
          }}
        >
          <Tab.Screen
            name="AccountsTab"
            options={{
              tabBarLabel: 'Comptes',
              tabBarIcon: ({ focused }) => <WalletIcon focused={focused} />,
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
              tabBarIcon: ({ focused }) => <ClockIcon focused={focused} />,
            }}
          >
            {() => <HistoryScreen accounts={accounts} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
