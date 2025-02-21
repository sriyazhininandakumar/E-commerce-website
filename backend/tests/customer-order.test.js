const request = require('supertest');
const app = require('../index'); 
const db = require('../models'); 
const { sequelize } = db;  
const { QueryTypes } = require('sequelize');  
const jwt = require('jsonwebtoken');  
require('dotenv').config();

describe('Customer Order Tracking API', () => {
    let testUser;
    let testProduct;
    let testOrder;
    let authToken;

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

        testProduct = await db.Product.create({
            name: "Test Product",
            description: "Sample product",
            price: 100,
            imageUrl: "http://example.com/image.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        testOrder = await db.Order.create({
            userId: testUser.id,
            dateOfOrder: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await db.OrderDetails.create({
            orderId: testOrder.id,
            productId: testProduct.id,
            quantity: 2,
            pricePerItem: testProduct.price,  
            status: "Processing",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        
        authToken = jwt.sign({ id: testUser.id, roleId: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });

    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    test(" Should fetch customer orders successfully", async () => {
        const res = await request(app)
            .get('/api/customer/orders')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.orders).toBeInstanceOf(Array);
        expect(res.body.orders.length).toBeGreaterThan(0);
        expect(res.body.orders[0]).toHaveProperty("orderId");
        expect(res.body.orders[0].products[0]).toHaveProperty("productName", testProduct.name);
    });

    test("Should fail to fetch orders without authentication", async () => {
        const res = await request(app)
            .get('/api/customer/orders');

        expect(res.statusCode).toBe(401); // Unauthorized
        expect(res.body).toHaveProperty("message", "Unauthorized");
    });

    test("Should return 'No orders found' for a new customer", async () => {
        const newUser = await db.User.create({
            name: "Jane Doe",
            email: "jane@example.com",
            password: "hashedpassword",
            roleId: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const newToken = jwt.sign({ id: newUser.id, roleId: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .get('/api/customer/orders')
            .set('Authorization', `Bearer ${newToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "No orders found");
    });

});
