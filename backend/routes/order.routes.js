const express = require('express');
const { Order, OrderDetails, Product, User, sequelize } = require('../models'); 
const router = express.Router();

router.post('/place-order', async (req, res) => {
    const transaction = await sequelize.transaction(); 
    try {
        const { userId, cartItems } = req.body;  // Change from userEmail to userId

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const newOrder = await Order.create(
            { userId: user.id, dateOfOrder: new Date() },
            { transaction }
        );

        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId); // Use productId instead of productName

            if (!product) {
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
        }

        await transaction.commit(); 
        res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id });

    } catch (error) {
        await transaction.rollback(); 
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

module.exports = router;
