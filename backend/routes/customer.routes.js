const express = require('express');
const { isAuthenticated, isCustomer } = require('../middlewares/auth.middleware');
const { Order, OrderDetails, Product } = require('../models');
const logger = require('../logger');

const router = express.Router();

router.get('/orders', isAuthenticated, isCustomer, async (req, res) => {
    try {
        const customerId = req.user.id;
        logger.debug(`Fetching orders for customer ID: ${customerId}`);

        const orders = await Order.findAll({
            where: { userId: customerId },
            include: [
                {
                    model: OrderDetails,
                    attributes: ['productId', 'status'], 
                    include: [{ model: Product, attributes: ['name'] }]
                }
            ],
            order: [['dateOfOrder', 'DESC']]
        });

        if (!orders.length) {
            logger.info(`No orders found for customer with ID: ${customerId}`);
            return res.status(200).json({ message: "No orders found" });
        }
        logger.debug(`Fetched ${orders.length} orders for customer ID: ${customerId}`);
        logger.info(`Successfully fetched orders for customer with ID: ${customerId}`);
        
        return res.status(200).json({
            orders: orders.map(order => ({
                orderId: order.id,
                products: order.OrderDetails.map(detail => ({
                    productId: detail.productId,   
                    productName: detail.Product?.name, 
                    status: detail.status  
                }))
            }))
        });

    } catch (error) {
        logger.error(`Error fetching orders for customer with ID: ${req.user.id}. Error: ${error.message}`);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

module.exports = router;
