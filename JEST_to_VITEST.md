# Migration Jest → Vitest

## Pourquoi Vitest ?

| Contexte | Jest | Vitest |
|---|---|---|
| Projet Vite / frontend | ⚠️ Friction | ✅ Natif |
| Backend Node pur | ✅ Natif | ➖ Sans gain majeur |
| Tests CPU-intensifs | ➖ Correct | ✅ Plus rapide |
| Tests I/O — API, DB | ✅ Équivalent | ✅ Équivalent |
| Migration depuis Jest | — | ✅ Très facile |
| Maturité | ✅ Élevée | ⚠️ Bonne, plus récente |

> Pour un backend Node pur + Supertest, les deux sont équivalents. Vitest brille surtout sur les projets Vite/frontend ou les suites CPU-intensives.

---

## Installation

```bash
npm install -D vitest
```

---

## Structure des dossiers

Garder Jest et Vitest dans des dossiers séparés pour plus de clarté :

```
backend/
├── test/                          ← Jest (existant, intact)
│   └── cocktail_route.test.js
├── test_vitest/                   ← Vitest
│   └── user_route.test.mjs        # .mjs obligatoire en projet CJS
└── vitest.config.js
```

---

## Configuration Vitest

```js
// vitest.config.js
const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'forks',
    isolate: false,
    setupFiles: ['dotenv/config'],                      // équivalent de --setupFiles dotenv/config
    include: ['test_vitest/**/*.test.{mjs,js,ts}']
  }
})
```

> `setupFiles: ['dotenv/config']` est l'équivalent exact du `--setupFiles dotenv/config` de Jest — indispensable pour charger les variables d'environnement.

---

## Configuration Jest

Empêcher Jest de fouiller dans `test_vitest/` :

```json
// package.json
{
  "scripts": {
    "test":   "jest --setupFiles dotenv/config --runInBand",
    "vitest": "vitest run"
  },
  "jest": {
    "testMatch": ["**/test/**/*.test.js"]
  }
}
```

---

## Écrire les fichiers de test Vitest

### Pourquoi `.mjs` ?

Le projet est en CommonJS. Vitest ne peut pas être importé avec `require()` — il faut de l'ESM. Renommer les fichiers en `.mjs` force l'ESM sans toucher au reste du projet.

### Template de base

```js
// test_vitest/user_route.test.mjs
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import request from 'supertest'
import { createRequire } from 'module'

// Pont ESM → CJS pour charger app et DB qui sont en CommonJS
const require = createRequire(import.meta.url)
const app = require('../../api/app')
const DB  = require('../../api/db.config')

let userID
let tokenAdmin

describe('USER ROUTE', () => {

    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@admin.admin',
                password: 'nimda'
            })
        tokenAdmin = response.body.access_token
    })

    afterAll(async () => {
        await DB.sequelize.close()
    })

    // ... tests identiques à Jest
})
```

### Différences avec Jest

| Jest | Vitest |
|---|---|
| `jest.fn()` | `vi.fn()` |
| `jest.clearAllMocks()` | `vi.clearAllMocks()` |
| `jest.mock()` | `vi.mock()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `describe / it / expect` | identiques (globals avec `globals: true`) |
| `require()` | `createRequire(import.meta.url)` en `.mjs` |
| `import` | `import` natif |

> Avec `globals: true` dans la config, `describe`, `it`, `expect`, `beforeAll`, `afterAll` sont disponibles sans import.

---

## Couverture de code

Installer le provider :

```bash
npm install -D @vitest/coverage-istanbul
```

Ajouter à la config :

```js
module.exports = defineConfig({
  test: {
    // ...config existante...
    coverage: {
      provider: 'v8',            // ← v8 à la place d'istanbul
      include: ['api/**/*.js'],
      exclude: ['api/db.config.js', 'api/config'],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      }
    }
  }
})
```

Scripts :

```json
{
  "scripts": {
    "test":             "jest --setupFiles dotenv/config --runInBand",
    "vitest":           "vitest run",
    "vitest:coverage":  "vitest run --coverage"
  }
}
```

Le rapport terminal (`reporter: 'text'`) affiche le même tableau que Jest :

```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   92.31 |    68.42 |     100 |   55.00 |
----------|---------|----------|---------|---------|
```

---

## Pièges rencontrés

### 1. `vitest is not defined`
Le fichier de config utilise `export default` (ESM) dans un projet CJS.
→ Utiliser `module.exports = defineConfig(...)` ou renommer en `.mjs`.

### 2. `Cannot find module 'vitest/config'`
Vitest installé dans `backend/` mais `vitest.config.js` à la racine.
→ Le config doit être au même niveau que le `node_modules` qui contient Vitest.

### 3. `ReferenceError: node is not defined`
`environment: node` sans guillemets dans la config.
→ `environment: 'node'`

### 4. Variables d'environnement vides → `Database Error 500`
Vitest ne charge pas le `.env` automatiquement contrairement à Jest avec `--setupFiles`.
→ Ajouter `setupFiles: ['dotenv/config']` dans la config Vitest.

### 5. `Vitest cannot be imported with require()`
Tentative de `require('vitest')` dans un fichier `.test.js` CJS.
→ Renommer le fichier en `.mjs` et utiliser `import` + `createRequire` pour les modules CJS.

### 6. `poolOptions` deprecated
Vitest 4 a supprimé `test.poolOptions`.
→ Supprimer le bloc `poolOptions`, `pool: 'forks'` suffit.
