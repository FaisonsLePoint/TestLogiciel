import { test, expect } from '../fixtures'
import { login } from '../helpers/auth'
import user from '../data/user.json' with { type: 'json' }

test.describe('Cocktail Add', () => {

    test.beforeEach(async ({ page, selector }) => {
        await page.goto('/')
        await selector('admin-link').click()
        await expect(selector('admin-login')).toBeVisible()
        await login(page, true, user)

        await page.route('**/cocktails', route => {
        if (route.request().method() === 'PUT') {
            route.fulfill({
                status: 201,
                json: { message: 'Cocktail Ajouté (playwright)' }
            })
        } else if (route.request().method() === 'GET') {
            route.fulfill({
                json: { data: [] } // liste vide après ajout
            })
        } else {
            route.continue()
        }
    })

        await page.goto('/admin/cocktail/add')
    })

    test('Should add a new cocktail', async ({ page }) => {
        await page.locator('input[name="nom"]').fill('Test')
        await page.locator('input[name="description"]').fill('Cocktail')
        await page.locator('input[name="recette"]').fill('Une recette de ce cocktail')

        const [request] = await Promise.all([
            page.waitForRequest(req => req.method() === 'PUT' && req.url().includes('/cocktails')),
            //page.locator('form').evaluate(form => form.submit()) -> attention ici pour React et sa gestion
            page.locator('form button').click()
        ])

        // Vérification du body
        const body = request.postDataJSON()
        expect(body).toMatchObject({
            nom: 'Test',
            description: 'Cocktail',
            recette: 'Une recette de ce cocktail',
        })
        expect(body).toHaveProperty('user_id')

        // Vérification du header authorization
        expect(request.headers()['authorization']).toContain('Bearer ')

        // Vérification redirection et contenu
        await expect(page).toHaveURL('/admin/cocktail/index')

        // On prend le premier car 2 fois dans la page - test strict - oui pas bien ;)
        await expect(page.getByText('Cocktail').first()).toBeVisible() 
    })

})