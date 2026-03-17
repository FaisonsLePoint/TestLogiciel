import request from 'supertest'
const app = require('../api/app')
const DB = require('../api/db.config')

describe('AUTH ROUTER', () => {
    afterAll(async () => {
        await DB.sequelize.close()
    })

    describe('TRY SIGNIN WITH BAD DATA', () => {
        it('Sould return 400 /=> missing param', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    //email: 'admin@admin.admin',
                    password: 'nimda'
                })
            expect(response.status).toBe(400)
        })

        it('Should return 401 /=> bad email', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'admin@truc.admin',
                    password: 'nimda'
                })
            expect(response.status).toBe(401)
        })

        it('Should return 401 /=> bad password', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'admin@admin.admin',
                    password: 'truc'
                })
            expect(response.status).toBe(401)
        })
    })

    describe('TRY SIGNIN AND GET TOKEN', () => {
        it('Shoutld return 200 with token', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'admin@admin.admin',
                    password: 'nimda'
                })
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('access_token')
        })
    })
})