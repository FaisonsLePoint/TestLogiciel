import { test as base } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'fs'
import { selector } from '../helpers/selector'

export const test = base.extend({
    selector: async ({ page }, use) => {
        await use(elem => selector(page, elem))
    },
    // Collecte automatique après chaque test
    autoCollectCoverage: [async ({ page }, use) => {
        await use()
        const coverage = await page.evaluate(() => window.__coverage__)
        if (coverage) {
            mkdirSync('.nyc_output', { recursive: true })
            writeFileSync(
                `.nyc_output/coverage-${Date.now()}.json`,
                JSON.stringify(coverage)
            )
        }
    }, { auto: true }] // Exécution sans import obligatoire
})

export { expect } from '@playwright/test'
