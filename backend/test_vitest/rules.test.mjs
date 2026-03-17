import request from 'supertest'
const app = require('../api/app')
const DB = require('../api/db.config')

let tokenAdmin
let cocktailID

let userID
let userToken

describe('OWNER RULES', () => {

    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@admin.admin',
                password: 'nimda'
            })
        tokenAdmin = response.body.access_token
    })

    afterAll(async () => {
        await DB.sequelize.close()
    })

    describe('CREATE USER AND COCKTAIL', () => {
        it('Should return 201 /=> new User', async () => {
            const response = await request(app)
                .put('/users')
                .set('authorization', 'Bearer '+tokenAdmin)
                .send({
                    pseudo: 'marcel',
                    email: 'marcel@roger.com',
                    password: 'roger'
                })
            expect(response.status).toBe(201)
            userID = response.body.data.id
        })

        it('Should return 201 /=> new Cocktail', async () => {
            const response = await request(app)
                .put('/cocktails')
                .set('authorization', 'Bearer '+tokenAdmin)
                .send({
                    user_id: 1,
                    nom: 'OWNER TEST',
                    description: "Il te déchire au premier verre",
                    recette: 'Tu veux veux pas savoir, tu ne dois pas savoir'
                })
            expect(response.status).toBe(201)
            cocktailID = response.body.data.id
        })
    })

    describe('SIGNIN AND MODIFY WITH BAD USER', () => {
        it('Should return 200 with token', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'marcel@roger.com',
                    password: 'roger'
                })
            userToken = response.body.access_token
        })

        it('Should return 403 /=> Modify cocktail with bad owner', async () => {
            const response = await request(app)
                .patch('/cocktails/'+cocktailID)
                .set('authorization', 'Bearer '+userToken)
                .send({
                    nom: 'roger'
                })
            expect(response.status).toBe(403)
        })
    })

    describe('DELETE WITH BAD OWNER AND CLEAR TEST', () => {
        it('Should return 403 /=> delete with bad owner', async () => {
            const response = await request(app)
                .delete('/cocktails/'+cocktailID)
                .set('authorization', 'Bearer '+userToken)
            expect(response.status).toBe(403)
        })

        it('Should return 204', async () => {
            const response = await request(app)
                .delete('/cocktails/'+cocktailID)
                .set('authorization', 'Bearer '+tokenAdmin)
            expect(response.status).toBe(204)
        })

        it('Should return 204', async () => {
            const response = await request(app)
                .delete('/users/'+userID)
                .set('authorization', 'Bearer '+tokenAdmin)
            expect(response.status).toBe(204)
        })
    })
})