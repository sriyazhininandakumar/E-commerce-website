const express = require('express');
const { Order, OrderDetails, Product, ManufacturerProduct, User } = require('../models');
const { isAuthenticated, isManufacturer } = require('../middlewares/auth.middleware'); 

const router = express.Router();



router.put('/orders/update-status', isAuthenticated, isManufacturer, async (req, res) => {
    try {
        const { orderDetailId, newStatus } = req.body;  
        const manufacturerId = req.user.id;  

        
        const orderDetail = await OrderDetails.findByPk(orderDetailId);
        if (!orderDetail) {
            return res.status(404).json({ message: "Order detail not found" });
        }

        //if manufacturer owns the product
        const manufacturerProduct = await ManufacturerProduct.findOne({
            where: { 
                manufacturerId: manufacturerId, 
                productId: orderDetail.productId 
            }
        });

        if (!manufacturerProduct) {
            return res.status(403).json({ message: "You are not authorized to update this order" });
        }

        // update the status
        orderDetail.status = newStatus;
        await orderDetail.save();

        return res.status(200).json({ message: "Order status updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
});









router.get('/orders', isAuthenticated, isManufacturer, async (req, res) => {
    try {
        const manufacturerId = req.user.id; 

       
        const manufacturerProducts = await ManufacturerProduct.findAll({
            where: { manufacturerId },
            attributes: ['productId']
        });

        if (manufacturerProducts.length === 0) {
            return res.status(404).json({ message: "You have no products linked to any orders" });
        }

        const productIds = manufacturerProducts.map(mp => mp.productId);

       
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderDetails, 
                    required: true, 
                    include: [
                        {
                            model: Product,
                            where: { id: productIds }, 
                            attributes: ['name']
                        }
                    ]
                },
                { model: User, attributes: ['name', 'email'] } 
            ],
            order: [['dateOfOrder', 'DESC']]
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for your products" });
        }

        return res.status(200).json({ orders });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching manufacturer orders", error: error.message });
    }
});

module.exports = router;
