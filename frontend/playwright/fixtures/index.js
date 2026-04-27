import { test as base } from '@playwright/test'
import { selector } from '../helpers/selector'

export const test = base.extend({
    selector: async ({page}, use) => {
        await use(elem => selector(page, elem))
    }
})

export { expect } from '@playwright/test'
