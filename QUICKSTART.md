# ⚡ Quick Start — Cocktail App

---

## ✅ Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Node.js | ≥ 20 | `node -v` |
| npm | ≥ 10 | `npm -v` |
| MySQL | ≥ 8 | `mysql --version` |
| Git | toute version récente | `git --version` |

> MySQL doit être **démarré et accessible** avant de lancer le backend.

---

## 🗃️ 1. Cloner le projet

```bash
git clone <url-du-repo>
cd cocktail_project
```

---

## 🔧 2. Configurer la base de données

Connectez-vous à MySQL et créez la base :

```sql
CREATE DATABASE bddname;
CREATE USER 'roger'@'localhost' IDENTIFIED BY 'regor';
GRANT ALL PRIVILEGES ON bddname.* TO 'roger'@'localhost';
FLUSH PRIVILEGES;
```

> 💡 Ces valeurs correspondent aux défauts du fichier `backend/.env`.  
> Adaptez-les si vous changez la configuration.

> 💡Le plus simple au possible est d'avoir un docker avec une base de données

---

## ⚙️ 3. Configurer l'environnement backend

Le fichier `backend/.env` est déjà présent. Vérifiez et adaptez si nécessaire :

```env
SERVER_PORT=12000

BDD_HOST=localhost
BDD_PORT=3306
BDD_NAME=bddname
BDD_USER=roger
BDD_PASS=regor

FIRST_ADMIN_PASSWORD=nimda

ALLOW_ORIGIN=*

BCRYPT_SALT_ROUND=10

JWT_SECRET=changez-cette-valeur-en-production
JWT_DURING=1h
```

---

## 📦 4. Installer & lancer le backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer les tables en base de données
npm run initbdd

# Lancer le serveur
npm run dev
```

Au premier démarrage, un compte administrateur est créé automatiquement :

```
email    : admin@admin.admin
password : nimda  (valeur de FIRST_ADMIN_PASSWORD)
```

> ⚠️ Pensez à changer ce mot de passe après la première connexion.

Le backend est disponible sur **http://localhost:12000**  
Vérifiez avec : `curl http://localhost:12000` → `I'm online. All is OK !....`

---

## 🎨 5. Installer & lancer le frontend

Dans un **nouveau terminal** :

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend est disponible sur **http://localhost:5173**

---

## 🧪 6. Lancer les tests (optionnel)

### Tests backend

```bash
cd backend
npm run test          # tous les tests
npm run test:cov      # avec rapport de couverture
```

### Tests frontend (E2E Cypress)

> Le frontend doit être lancé avant d'exécuter Cypress.

```bash
cd frontend
npm run cypress:open  # interface graphique
npm run cypress:run   # mode headless (CI)
```

---

## 🗺️ Résumé des URLs

| Service | URL |
|---|---|
| Frontend (dev) | http://localhost:5173 |
| Backend (API) | http://localhost:12000 |
| Sanity check API | http://localhost:12000 → `I'm online` |
| Interface admin | http://localhost:5173/admin |
| Login | http://localhost:5173/auth/login |