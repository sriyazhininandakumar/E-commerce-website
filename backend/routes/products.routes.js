const express = require('express');
const { isAdmin } = require('../middlewares/auth.middleware');
const { Product } = require('../models');

const router = express.Router();

// Only admin can create products
router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;

        if (!name || price == null || price <= 0) {
            return res.status(400).json({ message: 'Invalid input: Name and valid price are required' });
        }

        const product = await Product.create({ name, description, price, imageUrl });
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Update product including image URL
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({ name, description, price, imageUrl });

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});



// Delete a product
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
