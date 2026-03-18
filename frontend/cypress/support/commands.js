// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getDataCy", (selector, ...args) => {
    if(/\s/.test(selector)){
        let sels = selector.split(" ")

        return cy.get(`[data-cy=${sels[0]}] ${sels[1]}`, ...args).then(element => {
            return element
        })
    }else{
        return cy.get(`[data-cy=${selector}]`, ...args).then(element => {
            return element
        })
    }
})

Cypress.Commands.add('login', (type, user) => {
    cy.getDataCy("email").clear().type(type ? user.goodEmail : user.badEmail)
    cy.getDataCy("password").clear().type(type ? user.goodPass : user.badPass)
    cy.getDataCy("admin-login").click()

    if(type){
        cy.getDataCy("admin-header").should("be.visible")
    }
})