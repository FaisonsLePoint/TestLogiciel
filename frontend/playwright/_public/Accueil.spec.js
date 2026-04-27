import { test, expect } from '../fixtures'
import cocktails from '../data/cocktail.json' with { type: 'json'}

test.describe('HOME PAGE TEST', () => {
    test('Try display cocktail', async ({page, selector}) => {
        await page.route('**/cocktails', route => {
            route.fulfill({json: cocktails})
        })

        await page.goto('/')
        await expect(selector('home-page')).toBeVisible()
        await expect(selector('home-page .card_link')).toHaveCount(3)
    })

    test('Display error message', async ({page, selector}) => {
        await page.route('**/cocktails', route => {
            route.abort()
        })

        await page.goto('/')
        await expect(selector('error-message')).toBeVisible()
        await expect(selector('home-page .card_link')).toHaveCount(0)  
    })
})