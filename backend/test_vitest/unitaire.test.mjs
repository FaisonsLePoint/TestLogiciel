describe("Hash User Model", () => {
    let User
    let sequelizeMock

    beforeEach(() => {
        vi.clearAllMocks()

        sequelizeMock = {
            define: vi.fn()
        }

        sequelizeMock.define.mockImplementation(() => {
            const hooks = {}
            const ModelMock = {
                beforeCreate: vi.fn(truc => { hooks['beforeCreate'] = truc}),
                _hooks: hooks
            }
            return ModelMock
        })

        User = require('../api/models/user_m')(sequelizeMock)
    })

    it("Hash le mot de passe et le check", async () => {
        const plainPassword = 'monMotDePasse123'
        const userInstance = { password: plainPassword}

        await User._hooks['beforeCreate'](userInstance, {})

        // Mot de passe en hash
        expect(userInstance.password).not.toBe(plainPassword)

        // Check password pour valider
        const isValid = await User.checkPassword(plainPassword, userInstance.password)
        expect(isValid).toBe(true)
    })

    it("Rejete un mauvais mot de passe", async () => {
        const userInstance = {password: 'monMotDePasse123'}

        await User._hooks['beforeCreate'](userInstance, {})

        // test avec mauvais mot de passe
        const isValid = await User.checkPassword('untrucbidon', userInstance.password)
        expect(isValid).toBe(false)
    })

    it("Check si les hash sont bien différents", async () => {
        const plainPassword = 'monMotDePasse123'
        const user1 = { password: plainPassword}
        const user2 = { password: plainPassword}

        await User._hooks['beforeCreate'](user1, {})
        await User._hooks['beforeCreate'](user2, {})

        expect(user1.password).not.toBe(user2.password)

        expect(await User.checkPassword(plainPassword, user1.password)).toBe(true)
        expect(await User.checkPassword(plainPassword, user2.password)).toBe(true)

    })
})