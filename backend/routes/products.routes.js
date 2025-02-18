const express = require('express');
const { isAdmin } = require('../middlewares/auth.middleware');
const { Product } = require('../models');
const logger = require('../logger'); 

const router = express.Router();


router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;

        if (!name || price == null || price <= 0) {
            logger.warn("Invalid product input: Missing name or invalid price");
            return res.status(400).json({ message: 'Invalid input: Name and valid price are required' });
        }

        const product = await Product.create({ name, description, price, imageUrl });
        logger.info(`Product created successfully: ID ${product.id}, Name: ${name}`);
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        logger.error("Error creating product:", { error: error.message });
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        logger.info(`Fetched ${products.length} products`);
        res.status(200).json(products);
    } catch (error) {
        logger.error("Error fetching products:", { error: error.message });
        res.status(500).json({ message: 'Error fetching products' });
    }
});


router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            logger.warn(`Product not found: ID ${req.params.id}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({ name, description, price, imageUrl });

        logger.info(`Product updated: ID ${product.id}, Name: ${name}`);
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        logger.error("Error updating product:", { error: error.message });
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});



router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            logger.warn(`Product not found: ID ${req.params.id}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        logger.info(`Product deleted: ID ${product.id}, Name: ${product.name}`);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        logger.error("Error deleting product:", { error: error.message });
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
