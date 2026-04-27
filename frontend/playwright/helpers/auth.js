import { expect } from '@playwright/test'
import { selector } from './selector'

export const login = async (page, type, user) => {
    const email = selector(page, 'email')
    await email.clear()
    await email.fill(type ? user.goodEmail : user.badEmail)

    const password = selector(page, 'password')
    await password.clear()
    await password.fill(type ? user.goodPass : user.badPass)

    await selector(page, 'admin-login').click()

    // Debug en one shot
    // await page.waitForTimeout(2000)
    // await page.screenshot({path: 'denbug.png'})

    if(type){
        await expect(selector(page, 'admin-header')).toBeVisible()
    }
}