const request = require('supertest');
const app = require('../index');
const db = require('../models');
const bcrypt = require('bcryptjs');

describe('Auth API', () => {
    beforeAll(async () => {
        await db.User.destroy({ where: {} });
        await db.Role.destroy({ where: {} });

        await db.Role.bulkCreate([
            { id: 1, roleName: 'Admin' },
            { id: 2, roleName: 'Customer' },
            { id: 3, roleName: 'Manufacturer' },
        ]);

        await db.User.create({
            name: 'smrithi',
            email: 'smrithi@gmail.com',
            password: await bcrypt.hash('password123', 10),
            roleId: 2,
        });
    });
    afterAll(async () => {
        await db.sequelize.close();
    });    
    it('should sign up a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
            name: 'Alice',
                email: 'alice@gmail.com',
                password: 'password123',
                roleId: 2
            });

        expect(res.statusCode).toBe(200);
    });

   
    it('should fail to sign up if email already exists', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'smrithi',
                email: 'smrithi@gmail.com',
                password: 'password123',
                roleId: 2
            });

        expect(res.statusCode).toBe(400);
    });

    
    it('should log in a user with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'smrithi@gmail.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
    });

   
    it('should fail to log in with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'smrithi@gmail.com', password: 'wrongpassword' });

        expect(res.statusCode).toBe(400);
    });
});


