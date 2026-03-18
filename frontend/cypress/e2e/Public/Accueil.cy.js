describe('HOME PAGE TEST', () => {
    // const mockCocktails = {
    //     data: [
    //         { id: 1, nom: 'Mojito' },
    //         { id: 2, nom: 'Cosmopolitan' },
    //         { id: 3, nom: 'Margarita' },
    //     ]
    // };


    it('Try display cocktail', () => {
        // cy.intercept('GET', '**/cocktails', { body: mockCocktails}).as('getAllCocktails')
        cy.intercept('GET', '**/cocktails', { fixture: 'cocktails.js'}).as('getAllCocktails')

        cy.visit('/')
        
        cy.getDataCy('home-page').should('exist')
        cy.getDataCy('home-page p').should('exist')

        cy.wait('@getAllCocktails').then(() => {
            cy.getDataCy('home-page .card_link').should('have.length', 3)
        })
    })

    it('Display error message', () => {
        cy.intercept('GET', '**/cocktails', {forceNetworkError: true}).as('failed')

        cy.visit('/')

        cy.wait('@failed').then(() => {
            cy.getDataCy('error-message').should("be.visible")
            cy.get('[data-cy="home-page"] .card_link').should('have.length', 0)
        })
    })
})