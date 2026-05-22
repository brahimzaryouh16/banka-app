# BankaApp — Simulation de Gestion Bancaire

Application mobile de simulation bancaire développée avec **React Native / Expo**. Elle permet de consulter plusieurs comptes, d'effectuer des opérations de débit, crédit et virement, avec rejet automatique si le solde est insuffisant.

---

## Fonctionnalités

- Consultation du patrimoine total et de la liste des comptes
- Opérations de **débit** et **crédit** avec confirmation
- **Virement** entre comptes avec sélection du destinataire
- Rejet automatique si solde insuffisant
- **Historique** complet de toutes les transactions trié par date
- Indicateur visuel de solde bas (< 1000 MAD)
- Désactivation du bouton Débit si solde nul
- Bouton **Réinitialiser** pour remettre les comptes à l'état initial
- Interface sombre **Neo-Minimaliste Fintech**
- Icônes de navigation personnalisées (Wallet, Clock)
- Design responsive (supports iPhone 8 et écrans plus grands)

---

## Prérequis

- Node.js ≥ 18
- Compte Expo sur [expo.dev](https://expo.dev/)
- Application **Expo Go** sur votre smartphone
- (Optionnel) Simulateur iOS/Android

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/banka-app.git
cd banka-app

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npx expo start
```

Scannez le QR code avec **Expo Go** (Android) ou l'appareil photo (iOS) pour voir l'application en direct.

---

## Structure du Projet

```
banka-app/
├── App.js                          # Point d'entrée + navigation + état global
├── src/
│   ├── data/
│   │   └── accounts.js             # Données initiales des 3 comptes
│   ├── screens/
│   │   ├── DashboardScreen.js      # Liste des comptes + patrimoine total
│   │   ├── AccountDetailScreen.js  # Détail d'un compte + débit/crédit
│   │   ├── TransferScreen.js       # Formulaire de virement
│   │   └── HistoryScreen.js        # Historique des opérations
│   ├── components/
│   │   ├── AccountCard.js          # Carte de compte réutilisable
│   │   ├── TransactionItem.js      # Ligne d'historique réutilisable
│   │   └── TabBarIcons.js          # Icônes de navigation (Wallet, Clock)
│   └── theme/
│       ├── colors.js               # Palette de couleurs
│       └── index.js                # Espacements, typographie, responsive
├── assets/                         # Icônes et images
├── app.json                        # Configuration Expo
├── README.md
└── rapport.md                      # Rapport de projet
```

---

## Navigation

```
NavigationContainer
  └── BottomTabNavigator
        ├── Tab "Comptes"
        │     └── Stack Navigator
        │           ├── DashboardScreen
        │           ├── AccountDetailScreen
        │           └── TransferScreen
        └── Tab "Historique"
              └── HistoryScreen
```

---

## Technologies Utilisées

| Technologie | Version |
|---|---|
| React Native | 0.81.6 |
| Expo | ~54.0.0 |
| React Navigation (Stack) | ^7.15.1 |
| React Navigation (Bottom Tabs) | ^7.16.1 |
| React Native Screens | 4.24.0 |
| React Native Safe Area Context | ~5.7.0 |

---

## Auteur

Projet réalisé dans le cadre du TP React Native — **Prof. Zili**  
Université Abdelmalek Essaâdi, Tanger — Cycle Ingénieur 2025-2026
