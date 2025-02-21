const request = require('supertest');
const app = require('../index');
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let adminToken; 
let customerToken;
let productId;

beforeAll(async () => {
    await db.sequelize.sync({ force: true });

  
    const adminRole = await db.Role.create({ id: 1, roleName: 'Admin' });
    const customerRole = await db.Role.create({ id: 2, roleName: 'Customer' });

  
    const adminUser = await db.User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('password123', 10),
        roleId: adminRole.id,
    });

    const customerUser = await db.User.create({
        name: 'Customer User',
        email: 'customer@gmail.com',
        password: await bcrypt.hash('password123', 10),
        roleId: customerRole.id,
    });

    adminToken = jwt.sign(
        { id: adminUser.id, role: adminRole.roleName },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    customerToken = jwt.sign(
        { id: customerUser.id, role: customerRole.roleName },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
});

afterAll(async () => {
    await db.sequelize.close();
});

it('should allow an admin to create a product', async () => {
    const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Test Product',
            description: 'A great product',
            price: 100,
            imageUrl: 'http://example.com/image.jpg',
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.product).toHaveProperty('id');
    expect(res.body.message).toBe('Product created successfully');
    productId = res.body.product.id;
});

it('should NOT allow a customer to create a product', async () => {
    const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
            name: 'Unauthorized Product',
            description: 'A bad request',
            price: 50,
            imageUrl: 'http://example.com/image.jpg',
        });

    expect(res.statusCode).toBe(403);
});

it('should return 400 if product details are invalid', async () => {
    const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: '',
            price: 0,
        });

    expect(res.statusCode).toBe(400);
});

it('should fetch all products', async () => {
    const res = await request(app)
        .get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
});

it('should allow an admin to update a product', async () => {
    const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Updated Product',
            description: 'Updated description',
            price: 120,
            imageUrl: 'http://example.com/newimage.jpg',
        });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product updated successfully');
});

it('should NOT allow a customer to update a product', async () => {
    const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
            name: 'Customer Update Attempt',
            price: 500,
        });

    expect(res.statusCode).toBe(403);
});

it('should return 404 when updating a non-existing product', async () => {
    const res = await request(app)
        .put('/api/products/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            name: 'Non-Existent Product',
            price: 200,
        });

    expect(res.statusCode).toBe(404);
});

it('should allow an admin to delete a product', async () => {
    const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
});

it('should NOT allow a customer to delete a product', async () => {
    const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(403);
});

it('should return 404 when deleting a non-existing product', async () => {
    const res = await request(app)
        .delete('/api/products/99999')
        .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
});
