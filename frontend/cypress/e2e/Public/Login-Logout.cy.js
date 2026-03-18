describe('LOGIN LOGOUT', () => {
    beforeEach(() => {
        // cy.visit('http://localhost:5173')
        cy.visit('/')
    })

    it('Should display admin dashboard /=> good credentials', () => {
        cy.getDataCy('admin-link').click()
        cy.getDataCy('admin-login').should("be.visible")

        cy.fixture('user').then(user => {
            cy.login(true, user)
        })
        
        cy.getDataCy("admin-logout").click()
        cy.getDataCy("home-page").should('be.visible')
    })

    it('Should display error message /=> bad credentials', () => {
        cy.getDataCy('admin-link').click()
        cy.getDataCy('admin-login').should("be.visible")

        cy.fixture('user').then(user => {
            cy.login(false, user)
        })

        cy.getDataCy('error-message').should("be.visible")
    })
})