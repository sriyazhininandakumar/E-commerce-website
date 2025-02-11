const express = require('express');
const { ManufacturerProduct, User, Product, Role } = require('../models');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { manufacturerEmail, productName } = req.body;

      
        const manufacturer = await User.findOne({
            where: { email: manufacturerEmail },
            include: { model: Role, where: { roleName: 'Manufacturer' } }
        });

        if (!manufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }

        
        const product = await Product.findOne({ where: { name: productName } });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        
        await ManufacturerProduct.create({
            manufacturerId: manufacturer.id,
            productId: product.id
        });

        res.status(201).json({ message: "Manufacturer-Product relation added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding Manufacturer-Product relation", error: error.message });
    }
});

module.exports = router;
