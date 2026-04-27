import { test, expect } from '../fixtures'

test.describe('LOGIN LOGOUT', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/')
    })

    test('Should display admin dashboard /=> good credentials', async ({page, selector}) => {
        // await page.locator('[data-cy=admin-link]').click()
        // await expect(page.locator('[data-cy=admin-login]')).toBeVisible()

        // await selector(page, 'admin-link').click()
        // await expect(selector(page, 'admin-login')).toBeVisible()

        await selector('admin-link').click()
        await expect(selector('admin-login')).toBeVisible()


        await page.locator('[data-cy=email]').clear()
        await page.locator('[data-cy=email]').fill('admin@admin.admin')
        await page.locator('[data-cy=password]').clear()
        await page.locator('[data-cy=password]').fill('nimda')
        await page.locator('[data-cy=admin-login]').click()
    })

    // test('Should display error message /=> bad credentials', async ({page}) => {

    // })
})