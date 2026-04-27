import { test, expect } from '../fixtures'
import { login } from '../helpers/auth'
import user from '../data/user.json' with { type: 'json' }
import userList from '../data/user-list.json' with { type: 'json' }

test.describe('ADMIN USER INDEX', () => {

    test.beforeEach(async ({ page, selector }) => {
        await page.goto('/')
        await selector('admin-link').click()
        await expect(selector('admin-login')).toBeVisible()
        await login(page, true, user)

        await page.route('**/users', route => {
            route.fulfill({ json: userList })
        })
        await page.route('**/users/*', route => {
            route.fulfill({
                status: 204,
                json: { message: 'Utilisateur supprimé (playwright)' }
            })
        })

        await page.goto('/admin/user/index')
    })

    test('Renders user list correctly', async ({ page }) => {
        const rows = page.locator('table tbody tr')
        await expect(rows).toHaveCount(2)
        await expect(rows.first().locator('td:nth-child(2)')).toContainText('1')
        await expect(rows.first().locator('td:nth-child(3)')).toContainText('user1')
        await expect(rows.first().locator('td:nth-child(2) a')).toHaveAttribute('href', '/admin/user/edit/1')
    })

    test('Deletes a user', async ({ page }) => {
        const rows = page.locator('table tbody tr')
        await expect(rows).toHaveCount(2)
        await page.locator('.del_ubtn').nth(1).click()
        await expect(rows).toHaveCount(1)
    })

    test('Handles errors during user fetch', async ({ page, selector }) => {
        await page.route('**/users', route => { route.abort() })
        await page.goto('/admin/user/index')
        await expect(selector('error-message')).toBeVisible()
    })

    test('Handles errors during user deletion', async ({ page, selector }) => {
        await page.route('**/users/*', route => { route.abort() })
        await page.goto('/admin/user/index')
        await page.locator('.del_ubtn').nth(1).click()
        await expect(selector('error-message')).toBeVisible()
    })

})