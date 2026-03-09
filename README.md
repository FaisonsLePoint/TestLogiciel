# 🍹 Cocktail App — Base de code étudiante
<p align="center">
    <img src="https://img.shields.io/badge/React-v19.0.0-blue">
    <img src="https://img.shields.io/badge/React--Router-7.1.5-blue">
    <img src="https://img.shields.io/badge/ExpressJs-4.19.2-blue">
    <img src="https://img.shields.io/badge/license-MIT-green">
    <img src="https://img.shields.io/badge/build-passing-brightgreen">
    <img src="https://img.shields.io/badge/node--lts-20.17.0-brightgreen">
    <img src="https://img.shields.io/badge/npm-10.8.2-green">
    
</p>

Application web full-stack de gestion de cocktails, conçue comme base pédagogique pour des TP orientés **Docker**, **Tests**, **DevOps** et **DevSecOps**.

---

## 📋 Sommaire

- [📐 Architecture générale](#-architecture-générale)
- [⚙️ Stack technique](#️-stack-technique)
- [🔌 API REST — Endpoints](#-api-rest--endpoints)
- [🗂️ Modèles de données](#️-modèles-de-données)
- [🔐 Sécurité](#-sécurité)
- [🚀 Installation & lancement](#-installation--lancement)
- [🌍 Variables d'environnement](#-variables-denvironnement)
- [📦 Tableau des dépendances importantes](#-tableau-des-dépendances-importantes)
- [🗺️ Pistes pour les TP suivants](#️-pistes-pour-les-tp-suivants)

---

## 📐 Architecture générale

```
cocktail_project/
├── backend/          # API REST Node.js / Express
│   ├── api/
│   │   ├── config/       # Initialisation BDD & premier démarrage
│   │   ├── controllers/  # Logique métier (auth, user, cocktail)
│   │   ├── middleware/   # Vérification JWT
│   │   ├── models/       # Modèles Sequelize (User, Cocktail)
│   │   └── routes/       # Définition des routes Express
│   └── server.js         # Point d'entrée
│
└── frontend/         # SPA React / Vite
    └── src/
        ├── _helpers/     # AuthGuard (protection des routes)
        ├── _services/    # Services Axios (API calls)
        ├── components/   # Composants réutilisables
        └── pages/        # Pages Public / Admin / Auth

```

---

## ⚙️ Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19, React Router DOM 7, Vite 6 |
| Backend | Node.js, Express 4 |
| Base de données | MySQL 8 (via Sequelize 6) |
| Authentification | JWT (jsonwebtoken) + bcrypt |

---

## 🔌 API REST — Endpoints

### Authentification
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | ❌ | Connexion, retourne un token JWT |

### Utilisateurs (`/users`)
> Toutes les routes utilisateurs nécessitent un token JWT valide.

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/users/` | ✅ | Liste tous les utilisateurs |
| `GET` | `/users/:id` | ✅ | Récupère un utilisateur par ID |
| `PUT` | `/users/` | ✅ | Crée un nouvel utilisateur |
| `PATCH` | `/users/:id` | ✅ | Modifie un utilisateur |
| `DELETE` | `/users/:id` | ✅ | Supprime un utilisateur |

### Cocktails (`/cocktails`)
> La lecture est publique. Écriture, modification et suppression nécessitent un JWT.

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/cocktails/` | ❌ | Liste tous les cocktails |
| `GET` | `/cocktails/:id` | ❌ | Récupère un cocktail par ID |
| `PUT` | `/cocktails/` | ✅ | Crée un cocktail |
| `PATCH` | `/cocktails/:id` | ✅ | Modifie un cocktail |
| `DELETE` | `/cocktails/:id` | ✅ | Supprime un cocktail |

---

## 🗂️ Modèles de données

### User
| Champ | Type | Contrainte |
|---|---|---|
| `id` | INTEGER | PK, Auto-increment |
| `pseudo` | STRING(100) | NOT NULL |
| `email` | STRING | Validé (format email) |
| `password` | STRING(64) | Hashé via bcrypt au `beforeCreate` |

### Cocktail
| Champ | Type | Contrainte |
|---|---|---|
| `id` | INTEGER | PK, Auto-increment |
| `user_id` | INTEGER | FK → User (cascade delete) |
| `nom` | STRING(100) | NOT NULL |
| `description` | TEXT | NOT NULL |
| `recette` | TEXT | NOT NULL |

---

## 🔐 Sécurité

- Les mots de passe sont hashés avec **bcrypt** avant persistance (hook `beforeCreate`).
- L'authentification repose sur des **tokens JWT** (durée configurable via `JWT_DURING`).
- Le header `X-Powered-By` est désactivé (`app.disable("x-powered-by")`).
- Les origines CORS sont configurables via la variable `ALLOW_ORIGIN`.
- Le middleware `checkJwt` valide le token Bearer sur toutes les routes protégées.

---

## 🚀 Installation & lancement

### Prérequis
- Node.js ≥ 20
- MySQL 8 en cours d'exécution
- (Optionnel) Docker

### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Initialiser la base de données
npm run initbdd

# Peupler les données initiales (admin par défaut)
npm run populate

# Lancer en développement (avec rechargement automatique)
npm run dev

# Lancer en production
npm run start
```

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Compiler pour la production
npm run build
```

---

## 🌍 Variables d'environnement

### Backend (`.env`)

| Variable | Exemple | Description |
|---|---|---|
| `SERVER_PORT` | `12000` | Port d'écoute de l'API |
| `BDD_HOST` | `localhost` | Hôte MySQL |
| `BDD_PORT` | `3306` | Port MySQL |
| `BDD_NAME` | `bddname` | Nom de la base de données |
| `BDD_USER` | `roger` | Utilisateur MySQL |
| `BDD_PASS` | `regor` | Mot de passe MySQL |
| `FIRST_ADMIN_PASSWORD` | `nimda` | Mot de passe du premier admin créé au démarrage |
| `ALLOW_ORIGIN` | `*` | Origines CORS autorisées |
| `BCRYPT_SALT_ROUND` | `10` | Nombre de tours bcrypt |
| `JWT_SECRET` | `...` | Clé secrète de signature JWT |
| `JWT_DURING` | `1h` | Durée de validité du token |

### Frontend (`.env.development`)

| Variable | Exemple | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:12000` | URL de base de l'API |

---

## 📦 Tableau des dépendances importantes

### Backend

| Package | Version | Rôle |
|---|---|---|
| `express` | ^4.19.2 | Framework HTTP |
| `sequelize` | ^6.37.3 | ORM pour MySQL |
| `mysql2` | ^3.9.7 | Driver MySQL (requis par Sequelize) |
| `jsonwebtoken` | ^9.0.2 | Génération et vérification des JWT |
| `bcrypt` | ^5.1.1 | Hashage des mots de passe |
| `cors` | ^2.8.5 | Gestion des politiques CORS |
| `dotenv` | ^16.4.5 | Chargement des variables d'environnement |

### Frontend

| Package | Version | Rôle |
|---|---|---|
| `react` | ^19.0.0 | Bibliothèque UI |
| `react-dom` | ^19.0.0 | Rendu DOM React |
| `react-router-dom` | ^7.1.5 | Routage SPA |
| `axios` | ^1.7.9 | Client HTTP pour les appels API |
| `jwt-decode` | ^4.0.0 | Décodage du payload JWT côté client |
| `vite` | ^6.1.0 | Bundler et serveur de développement (dev) |
| `eslint` | ^9.19.0 | Linter JavaScript/JSX (dev) |

---
