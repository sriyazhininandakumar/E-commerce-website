const express = require('express');
const { Order, OrderDetails, Product, User, sequelize } = require('../models'); 
const router = express.Router();
const logger = require('../logger');

router.post('/place-order', async (req, res) => {
    const transaction = await sequelize.transaction(); 
    try {
        const { userId, cartItems } = req.body;  
        logger.info(`New order request received for user ID: ${userId}`);



        const user = await User.findByPk(userId);
        if (!user) {
            logger.warn(`User with ID ${userId} not found`);
            return res.status(404).json({ message: "User not found" });
        }
        const newOrder = await Order.create(
            { userId: user.id, dateOfOrder: new Date() },
            { transaction }
        );
        logger.info(`Order created successfully with ID: ${newOrder.id}`);

        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId); 

            if (!product) {
                logger.error(`Product not found: ${item.productId}`);
                throw new Error(`Product not found: ${item.productId}`);
            }

            await OrderDetails.create(
                {
                    orderId: newOrder.id,
                    productId: product.id,
                    quantity: item.quantity,
                    pricePerItem: product.price,
                    status: "Pending"
                },
                { transaction }
            );
            logger.info(`Added product ID ${product.id} to order ID ${newOrder.id}`);
        }

        await transaction.commit(); 
        logger.info(`Order ID ${newOrder.id} placed successfully`);
        res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id });

    } catch (error) {
        await transaction.rollback(); 
        logger.error(`Error placing order: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

module.exports = router;
