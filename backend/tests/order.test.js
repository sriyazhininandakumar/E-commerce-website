const request = require('supertest');
const app = require('../index'); 
const db = require('../models'); 
const { sequelize } = db;
const { QueryTypes } = require('sequelize');

describe('Order API', () => {
    let testUser;
    let testProduct;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        console.log("Database synced successfully.");

        
        await sequelize.query(
            `INSERT INTO "Roles" ("roleName", "createdAt", "updatedAt") VALUES 
            ('Admin', NOW(), NOW()), 
            ('Customer', NOW(), NOW()), 
            ('Manufacturer', NOW(), NOW())`,
            { type: QueryTypes.INSERT }
        );

        testUser = await db.User.create({
            name: "John Doe",
            email: "john@example.com",
            password: "hashedpassword",
            roleId: 2,  
            createdAt: new Date(),  
            updatedAt: new Date()
        });

        console.log("Created test user:", testUser);

        testProduct = await db.Product.create({
            name: "Test Product",
            description: "Sample product",
            price: 100,
            imageUrl: "http://example.com/image.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("Created test product:", testProduct);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    test("Should place an order successfully", async () => {
        const res = await request(app)
            .post('/api/orders/place-order')
            .send({
                userId: testUser.id,
                cartItems: [{ productId: testProduct.id, quantity: 2 }]
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("orderId");
    });

    test("Should fail to place an order with missing cartItems", async () => {
        const res = await request(app)
            .post('/api/orders/place-order')
            .send({
                userId: testUser.id 
            });

        expect(res.statusCode).toBe(500); 
        expect(res.body).toHaveProperty("error"); 
    });

});
