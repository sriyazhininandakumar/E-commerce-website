const request = require('supertest');
const app = require('../index');
const db = require('../models');

describe('Manufacturer Order API', () => {
    let manufacturerUser, customerUser, testProduct, testOrder, testOrderDetail, manufacturerProduct;
    let manufacturerToken, customerToken; 

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });

      
        await db.Role.bulkCreate([
            { roleName: 'Admin', createdAt: new Date(), updatedAt: new Date() },
            { roleName: 'Customer', createdAt: new Date(), updatedAt: new Date() },
            { roleName: 'Manufacturer', createdAt: new Date(), updatedAt: new Date() }
        ]);

       
        manufacturerUser = await db.User.create({
            name: "Manufacturer",
            email: "manufacturer@example.com",
            password: "hashedpassword", 
            roleId: 3,
            createdAt: new Date(),
            updatedAt: new Date()
        });

      
        customerUser = await db.User.create({
            name: "Customer",
            email: "customer@example.com",
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

      
        manufacturerProduct = await db.ManufacturerProduct.create({
            manufacturerId: manufacturerUser.id,
            productId: testProduct.id
        });

      
        testOrder = await db.Order.create({
            userId: customerUser.id,
            dateOfOrder: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

       
        testOrderDetail = await db.OrderDetails.create({
            orderId: testOrder.id,
            productId: testProduct.id,
            quantity: 2,
            status: "Pending",
            pricePerItem: testProduct.price, 
            createdAt: new Date(),
            updatedAt: new Date()
        });

      
        const manufacturerRes = await request(app).post('/api/auth/login').send({
            email: manufacturerUser.email,
            password: "hashedpassword" 
        });
        manufacturerToken = manufacturerRes.body.token;

        const customerRes = await request(app).post('/api/auth/login').send({
            email: customerUser.email,
            password: "hashedpassword" 
        });
        customerToken = customerRes.body.token;
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    test(" Should successfully update order status", async () => {
        const res = await request(app)
            .put('/api/manufacturers/orders/update-status')
            .set('Authorization', `Bearer ${manufacturerToken}`) 
            .set('Content-Type', 'application/json')
            .send({
                orderDetailId: testOrderDetail.id,
                newStatus: "Shipped"
            });

        expect(res.statusCode).toBe(403);
        
    });

    test(" Should fail to update order status without manufacturer authorization", async () => {
        const res = await request(app)
            .put('/api/manufacturers/orders/update-status')
            .set('Authorization', `Bearer ${customerToken}`) 
            .set('Content-Type', 'application/json')
            .send({
                orderDetailId: testOrderDetail.id,
                newStatus: "Shipped"
            });

        expect(res.statusCode).toBe(403); 
    });
});
