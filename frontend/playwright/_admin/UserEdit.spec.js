import { test, expect } from '../fixtures'
import { login } from '../helpers/auth'
import user from '../data/user.json' with { type: 'json' }
import userOne from '../data/user-one.json' with { type: 'json' }

test.describe('ADMIN USER EDIT', () => {

    test.beforeEach(async ({ page, selector }) => {
        await page.goto('/')
        await selector('admin-link').click()
        await expect(selector('admin-login')).toBeVisible()

        await login(page, true, user)
        
        await page.goto('/admin/user/index')
    })

    test('Should fill form with data', async ({ page }) => {
        await page.route('**/users/*', route => {
            if (route.request().method() === 'GET') {
                route.fulfill({ json: userOne })
            } else if (route.request().method() === 'PATCH') {
                route.fulfill({
                    status: 200,
                    json: { message: 'User updated' }
                })
            } else {
                route.continue()
            }
        })

        await page.goto(`/admin/user/edit/${userOne.data.id}`)

        await expect(page.locator('input[name="nom"]')).toHaveValue(userOne.data.nom)
        await expect(page.locator('input[name="prenom"]')).toHaveValue(userOne.data.prenom)
        await expect(page.locator('input[name="pseudo"]')).toHaveValue(userOne.data.pseudo)
        await expect(page.locator('input[name="email"]')).toHaveValue(userOne.data.email)

        await page.locator('input[name="email"]').clear()
        await page.locator('input[name="email"]').fill('modif@modif.modif')

        const [request] = await Promise.all([
            page.waitForRequest(req => req.method() === 'PATCH' && req.url().includes('/users')),
            //page.locator('form').evaluate(form => form.submit()) -> attention ici pour React et sa gestion
            page.locator('form button').click()
        ])

        const body = request.postDataJSON()
        expect(body).toHaveProperty('email', 'modif@modif.modif')
        expect(request.headers()['authorization']).toContain('Bearer ')

        await expect(page).toHaveURL('/admin/user/index')
    })

})