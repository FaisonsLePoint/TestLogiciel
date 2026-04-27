import { test, expect } from '../fixtures'
import { login } from '../helpers/auth'
import user from '../data/user.json' with { type: 'json'}
import cocktailList from '../data/cocktail-list.json' with {type: 'json'}

test.describe('ADMIN COCKTAIL INDEX', () => {

    test.beforeEach( async ({page, selector}) => {
        await page.goto('/')
        await selector('admin-link').click()
        await expect(selector('admin-login')).toBeVisible()

        await login(page, true, user)

        // API cocktail list
        await page.route('**/cocktails', route => {
            route.fulfill({json: cocktailList})
        })

        // API cocktail delete
        await page.route('**/cocktails/*', route => {
            route.fulfill({status: 204})
        })

        await page.goto('/admin/cocktail/index')
    })

    test('Render cocktail list', async ({page}) => {
        const rows = page.locator('table tbody tr')

        await expect(rows).toHaveCount(2)
        await expect(rows.first().locator('td:nth-child(2)')).toContainText('1')
        await expect(rows.first().locator('td:nth-child(3)')).toContainText('Mojito')
        await expect(rows.first().locator('td:nth-child(2) a')).toHaveAttribute('href', '/admin/cocktail/edit/1')
    })

    test('Handle error', async ({page, selector}) => {
        await page.route('**/cocktails', route => {
            route.abort()
        })

        await expect(selector('error-message')).toBeVisible()
    })

    test('Delete Cocktail', async ({page}) => {
        const rows = page.locator('table tbody tr')
        await expect(rows).toHaveCount(2)

        await page.locator('.del_ubtn').first().click()

        // Check front method
        // const [request] = await Promise.all([
        //     page.waitForRequest(req => req.method() === 'DELETE')
        // ])
        // expect(request.method()).toBe('DELETE')

        await expect(rows).toHaveCount(1)
    })
})