import { test, expect } from '../fixtures'

const mockCocktail = {
    id: '1',
    nom: 'Mojito',
    description: 'Un délicieux cocktail rafraîchissant.',
    recette: "Mélanger le rhum, le sucre, le jus de citron vert et la menthe. Ajouter de l'eau gazeuse et de la glace.",
}

test.describe('COCKTAIL PAGE TEST', () => {

    test('Should display cocktail details', async ({page, selector}) => {
        await page.route(`**/cocktails/${mockCocktail.id}`, route => {
            route.fulfill({
                status: 200,
                json: {data: mockCocktail}
            })
        })

        await page.goto(`/cocktail/${mockCocktail.id}`)

        const img = page.locator('img')
        await expect(img).toHaveAttribute('src', `https://picsum.photos/1200/800?random=${mockCocktail.id}`)
        await expect(img).toHaveAttribute('alt', mockCocktail.nom)

        await expect(page.getByText(mockCocktail.nom)).toBeVisible()
        await expect(page.getByText(mockCocktail.description)).toBeVisible()
        await expect(page.getByText(mockCocktail.recette)).toBeVisible()
    })

    test('Display error message', async ({page, selector}) => {
        await page.route('**/cocktails/1', route => {
            route.abort()
        })

        await page.goto('/cocktail/1')

        await expect(selector('error-message')).toBeVisible()
    })
})