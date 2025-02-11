const express = require('express');
const { ManufacturerProduct, User, Product } = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { manufacturerId, productId } = req.body;

        
        if (!manufacturerId || !productId) {
            return res.status(400).json({ message: "Manufacturer ID and Product ID are required" });
        }

     
        const manufacturer = await User.findByPk(manufacturerId);
        if (!manufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }

       
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        await ManufacturerProduct.create({ manufacturerId, productId });

        res.status(201).json({ message: "Manufacturer-Product relation added successfully" });
    } catch (error) {
        console.error("Error assigning manufacturer:", error);
        res.status(500).json({ message: "Error adding Manufacturer-Product relation", error: error.message });
    }
});

module.exports = router;
