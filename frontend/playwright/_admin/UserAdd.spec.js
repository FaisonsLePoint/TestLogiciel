import { test, expect } from '../fixtures'
import { login } from '../helpers/auth'
import user from '../data/user.json' with { type: 'json' }

test.describe('UserAdd Component', () => {

    test.beforeEach(async ({ page, selector }) => {
        await page.goto('/')
        await selector('admin-link').click()
        await expect(selector('admin-login')).toBeVisible()
        await login(page, true, user)

        await page.route('**/users', route => {
            route.fulfill({
                status: 201,
                json: { message: 'Utilisateur ajouté (playwright)' }
            })
        })

        await page.goto('/admin/user/add')
    })

    test('Should add a new user', async ({ page }) => {
        await page.locator('input[name="nom"]').fill('Test')
        await page.locator('input[name="prenom"]').fill('User')
        await page.locator('input[name="pseudo"]').fill('testuser')
        await page.locator('input[name="email"]').fill('test@example.com')
        await page.locator('input[name="password"]').fill('password123')

        const [request] = await Promise.all([
            page.waitForRequest(req => req.method() === 'PUT' && req.url().includes('/users')),
            //page.locator('form').evaluate(form => form.submit()) -> attention ici pour React et sa gestion
            page.locator('form button').click()
        ])

        const body = request.postDataJSON()
        expect(body).toEqual({
            nom: 'Test',
            prenom: 'User',
            pseudo: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        })
        expect(request.headers()['authorization']).toContain('Bearer ')

        await expect(page).toHaveURL('/admin/user/index')
    })

})