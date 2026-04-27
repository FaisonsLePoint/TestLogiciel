# Structure des dossiers Playwright

```
playwright/
├── admin/              # specs de la partie administration
│   └── *.spec.js
├── public/             # specs de la partie publique
│   └── *.spec.js
├── data/
│   └── user.json       # données de test
├── helpers/
│   ├── auth.js         # fonctions liées à l'authentification
├── fixtures/
│   └── index.js        # extensions du framework (selector,login...)
└── reports/            # rapports générés automatiquement
```

## Le rôle de chaque dossier

**`admin/` et `public/`** — les fichiers de tests (specs) organisés par partie de l'application.

**`data/`** — les fichiers JSON contenant les données utilisées dans les tests (identifiants, contenus...).

**`helpers/`** — des fonctions JS classiques organisées par domaine fonctionnel.
Elles prennent `page` en paramètre et doivent être importées dans chaque spec.

**`fixtures/`** — les extensions du framework Playwright.
C'est ici qu'on surcharge l'objet `test` pour y injecter nos propres outils
automatiquement dans les specs (comme `selector`, `login`...).

**`reports/`** — les rapports HTML générés automatiquement après chaque run. Ne pas committer.

---

> ⚠️ Dans les specs, toujours importer `test` depuis `fixtures/index.js`
> et non depuis `@playwright/test` pour avoir accès aux extensions.

```js
// ✅ correct
import { test, expect } from '../fixtures/index.js'

// ❌ à éviter — on perd dataCy, login, etc.
import { test, expect } from '@playwright/test'
```

---
## Selecteur Type
```js
page.locator('[data-cy=email]')   // sélecteur CSS classique
page.getByRole('button', { name: 'Login' })  // par rôle ARIA
page.getByText('Bienvenue')       // par texte
page.getByPlaceholder('Email')    // par placeholder
page.getByLabel('Mot de passe')   // par label
```