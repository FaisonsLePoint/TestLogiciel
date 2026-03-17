const request = require('supertest')
const app = require('../api/app')
const DB = require('../api/db.config')


let userID
let tokenAdmin

describe('USER ROUTE', () => {

    beforeAll( async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@admin.admin',
                password: 'nimda'
            })
        tokenAdmin = response.body.access_token
    })

    afterAll( async () => {
        await DB.sequelize.close()
    })

    describe('TRY PUT', () => {
        it('Should return 400 /=> missing data', async () => {
            const response = await request(app)
                .put('/users')
                .set('authorization', 'Bearer '+tokenAdmin)
                .send({
                    pseudo: 'marcel',
                    //email: 'marcel@roger.com',
                    password: 'roger'
                })
            expect(response.status).toBe(400)
        })

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
    })

    describe('TRY GET', () => {
        it('Sould return 200 /=> Get All Users', async () => {
            const response = await request(app).get(`/users`).set('authorization', 'Bearer '+tokenAdmin)
            expect(response.status).toBe(200)
        })
        it('Should return 200 /=> Get user', async () => {
            const response = await request(app).get(`/users/${userID}`).set('authorization', 'Bearer '+tokenAdmin)
            expect(response.status).toBe(200)
        })
        it('Should return 404 /=> Get bad user di (int)', async () => {
            const response = await request(app).get(`/users/11111111111111111111`).set('authorization', 'Bearer '+tokenAdmin)
            expect(response.status).toBe(404)
        })
    })

    describe('TRY PATCH', () => {
        it("Sould return 409 /=> Modify bad user", async () => {
            const response = await request(app)
                .patch('/users/111111111111111111111')
                .set('authorization', 'Bearer '+tokenAdmin)
                .send({
                    pseudo: 'roger'
                })
            expect(response.status).toBe(409)
        })
        it("Sould return 200 /=> Modify user", async () => {
            const response = await request(app)
                .patch(`/users/${userID}`)
                .set('authorization', 'Bearer '+tokenAdmin)
                .send({
                    pseudo: 'roger'
                })
            expect(response.status).toBe(200)
        })
    })

    describe('TRY DELETE', () => {
        it('Sould return 204', async () => {
            const response = await request(app)
                .delete(`/users/${userID}`)
                .set('authorization', 'Bearer '+tokenAdmin)
            expect(response.status).toBe(204)
        })
    })
})