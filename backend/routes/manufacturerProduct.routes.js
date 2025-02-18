const express = require('express');
const { ManufacturerProduct, User, Product } = require('../models');
const router = express.Router();
const logger = require('../logger');  

router.post('/', async (req, res) => {
    try {
        const { manufacturerId, productId } = req.body;

        
        if (!manufacturerId || !productId) {
            logger.warn("Manufacturer ID and Product ID are required");  
            return res.status(400).json({ message: "Manufacturer ID and Product ID are required" });
        }

     
        const manufacturer = await User.findByPk(manufacturerId);
        if (!manufacturer) {
            logger.warn(`Manufacturer with ID ${manufacturerId} not found`);  
            return res.status(404).json({ message: "Manufacturer not found" });
        }

       
        const product = await Product.findByPk(productId);
        if (!product) {
            logger.warn(`Product with ID ${productId} not found`);
            return res.status(404).json({ message: "Product not found" });
        }


        await ManufacturerProduct.create({ manufacturerId, productId });
        logger.info(`Manufacturer-Product relation added: Manufacturer ID ${manufacturerId}, Product ID ${productId}`);


        res.status(201).json({ message: "Manufacturer-Product relation added successfully" });
    } catch (error) {
        logger.error("Error assigning manufacturer:", { error: error.message, stack: error.stack });
        res.status(500).json({ message: "Error adding Manufacturer-Product relation", error: error.message });
    }
});

module.exports = router;
