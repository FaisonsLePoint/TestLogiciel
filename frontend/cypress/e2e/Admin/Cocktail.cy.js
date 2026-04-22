describe('ADMIN COCKTAIL INDEX', () => {
    beforeEach(() => {
        cy.visit('/')

        cy.getDataCy('admin-link').click()
        cy.getDataCy('admin-login').should("be.visible") // limitun smoke test

        cy.fixture('user').then(user => {
            cy.login(true, user)
        })

        cy.visit('/admin/cocktail/index')

        // Interceptors
        cy.intercept('GET', '**/cocktails', {fixture: 'cocktail-list.json'}).as('getCocktails')
        cy.intercept('DELETE', '**/cocktails/*', {statusCode: 204}).as('deleteCocktail')        
    })

    it('Renders cocktail list', () => {
        cy.wait('@getCocktails')
        cy.get('table tbody tr').should('have.length', 2)

        // Check contain
        cy.get('table tbody tr:first-child td:nth-child(2').should('contain', '1')
        cy.get('table tbody tr:first-child td:nth-child(3').should('contain', 'Mojito')

        // Check edit link (smoke)
        cy.get('table tbody tr:first-child td:nth-child(2) a').should('have.attr', 'href', '/admin/cocktail/edit/1')
    })

    it('handler error', () => {
        cy.intercept('GET', '**/cocktails', {forceNetworkError: true}).as('getCocktailsWithError')

        cy.visit('/admin/cocktail/index')

        cy.wait('@getCocktailsWithError').then(() => {
            cy.getDataCy('error-message').should('be.visible')
        })
    })

    it('Delete Cocktail', () => {
        cy.wait('@getCocktails');
        cy.get('table tbody tr').should('have.length', 2);

        // Delete first element
        cy.get('.del_ubtn').first().click() 

        // Wait for request end
        cy.wait('@deleteCocktail').then(intercept => {
            console.log(intercept)
            expect(intercept.request.method).to.eq('DELETE')
            expect(intercept.response.statusCode).to.eq(204)
        })

        // Check the rest of element
        cy.get('table tbody tr').should('have.length', 1)
    })
})