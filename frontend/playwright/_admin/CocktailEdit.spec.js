import { test, expect } from '../fixtures'
import { login } from '../helpers/auth'
import user from '../data/user.json' with { type: 'json' }
import oneCocktail from '../data/one_cocktail.json' with { type: 'json'}


test.describe('ADMIN COCKTAIL EDIT', () => {

    test.beforeEach(async ({ page, selector}) => {
        await page.goto('/')
        await selector('admin-link').click()
        await expect(selector('admin-login')).toBeVisible()

        await login(page, true, user)

        await page.goto('/admin/cocktail/index')
    })

    test('Should fill form with data', async ({ page }) => {
        await page.route('**/cocktails/*', route => {
            if (route.request().method() === 'GET') {
                route.fulfill({ json: oneCocktail })
            } else if (route.request().method() === 'PATCH') {
                route.fulfill({
                    status: 200,
                    json: { message: 'Cocktail updated' }
                })
            } else {
                route.continue()
            }
        })

        await page.goto(`/admin/cocktail/edit/${oneCocktail.data.id}`)

        // Vérification du pré-remplissage du formulaire
        await expect(page.locator('input[name="nom"]')).toHaveValue(oneCocktail.data.nom)
        await expect(page.locator('input[name="description"]')).toHaveValue(oneCocktail.data.description)
        await expect(page.locator('input[name="recette"]')).toHaveValue(oneCocktail.data.recette)

        // Modification et soumission
        await page.locator('input[name="nom"]').clear()
        await page.locator('input[name="nom"]').fill('modifCKT')

        const [request] = await Promise.all([
            page.waitForRequest(req => req.method() === 'PATCH' && req.url().includes('/cocktails')),
            //page.locator('form').evaluate(form => form.submit()) -> attention ici pour React et sa gestion
            page.locator('form button').click()
        ])

        // Vérification du body et headers
        const body = request.postDataJSON()
        expect(body).toHaveProperty('nom', 'modifCKT')
        expect(request.headers()['authorization']).toContain('Bearer ')

        // Vérification redirection
        await expect(page).toHaveURL('/admin/cocktail/index')
    })

})