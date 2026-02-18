# Mon Trello - Application Kanban

Une application Kanban complète inspirée de Trello, construite avec une architecture professionnelle.

## 🚀 Stack Technique

### Backend (API)
- **Express.js** - Framework web Node.js
- **Prisma** - ORM moderne pour PostgreSQL
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification par token
- **bcryptjs** - Hashage des mots de passe
- **express-validator** - Validation des données

### Frontend (Client)
- **React 18** - Bibliothèque UI
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Headless UI** - Composants accessibles
- **TanStack Query** - Gestion de l'état serveur
- **dnd-kit** - Drag & drop moderne
- **React Router** - Navigation
- **Zustand** - Gestion de l'état client
- **Axios** - Client HTTP

## 📁 Structure du Projet

```
mon-trello/
├── api/                    # Backend Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma de la base de données
│   │   └── seed.js         # Données de test
│   └── src/
│       ├── config/         # Configuration (DB, Auth)
│       ├── controllers/    # Logique métier
│       ├── middlewares/    # Auth, validation, erreurs
│       ├── routes/         # Définition des routes
│       ├── validators/     # Règles de validation
│       └── server.js       # Point d'entrée
│
└── client/                 # Frontend React + Vite
    └── src/
        ├── components/     # Composants réutilisables
        ├── hooks/          # Hooks personnalisés (TanStack Query)
        ├── layouts/        # Layouts de pages
        ├── pages/          # Pages de l'application
        ├── services/       # Appels API
        └── stores/         # État global (Zustand)
```

## 🛠️ Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Configurer la base de données

Créer une base de données PostgreSQL :
```sql
CREATE DATABASE mon_trello;
```

### 2. Configurer l'API

```bash
cd api

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres de base de données

# Générer le client Prisma et créer les tables
npx prisma generate
npx prisma migrate dev --name init

# (Optionnel) Peupler la base avec des données de test
npm run prisma:seed

# Démarrer le serveur de développement
npm run dev
```

### 3. Configurer le Client

```bash
cd client

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### 4. Accéder à l'application

- **Frontend** : http://localhost:5173
- **API** : http://localhost:3001
- **Prisma Studio** : `npm run prisma:studio` (http://localhost:5555)

## 🔐 Compte de démonstration

Si vous avez exécuté le seed :
- **Email** : demo@example.com
- **Mot de passe** : password123

## 📚 API Endpoints

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/profile` | Profil utilisateur |
| PUT | `/api/auth/profile` | Modifier le profil |
| PUT | `/api/auth/password` | Changer le mot de passe |

### Boards
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/boards` | Liste des boards |
| POST | `/api/boards` | Créer un board |
| GET | `/api/boards/:id` | Détail d'un board |
| PUT | `/api/boards/:id` | Modifier un board |
| DELETE | `/api/boards/:id` | Supprimer un board |
| POST | `/api/boards/:id/members` | Ajouter un membre |
| DELETE | `/api/boards/:id/members/:memberId` | Retirer un membre |

### Lists
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/boards/:boardId/lists` | Listes d'un board |
| POST | `/api/boards/:boardId/lists` | Créer une liste |
| PUT | `/api/boards/:boardId/lists/:id` | Modifier une liste |
| DELETE | `/api/boards/:boardId/lists/:id` | Supprimer une liste |
| PUT | `/api/boards/:boardId/lists/reorder` | Réordonner les listes |

### Cards
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/lists/:listId/cards` | Créer une carte |
| GET | `/api/cards/:id` | Détail d'une carte |
| PUT | `/api/cards/:id` | Modifier une carte |
| DELETE | `/api/cards/:id` | Supprimer une carte |
| PUT | `/api/cards/:id/move` | Déplacer une carte |
| PUT | `/api/cards/reorder` | Réordonner les cartes |

## ✨ Fonctionnalités

- [x] **Authentification** : Inscription, connexion, déconnexion
- [x] **Boards** : Création, modification, suppression, couleurs personnalisées
- [x] **Lists** : Création, modification, suppression, réordonnancement
- [x] **Cards** : Création, modification, suppression, labels, dates d'échéance
- [x] **Drag & Drop** : Déplacement des cartes entre colonnes
- [x] **Persistance** : Toutes les données sont stockées dans PostgreSQL
- [x] **UI Moderne** : Design responsive avec Tailwind CSS
- [x] **Optimistic Updates** : Mises à jour instantanées de l'UI

## 🔮 Améliorations futures

- [ ] Système de membres et partage de boards
- [ ] Commentaires sur les cartes
- [ ] Pièces jointes
- [ ] Historique des activités
- [ ] Notifications en temps réel (WebSocket)
- [ ] Recherche et filtres
- [ ] Mode sombre
- [ ] Export/Import de données

## 📄 Licence

MIT
