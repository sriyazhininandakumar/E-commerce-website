const express = require('express');
const cors = require('cors');
const logger = require("./logger");
const dotenv = require('dotenv');
const { sequelize } = require('./models');
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
const productRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.route');
const manufacturerProductRoutes = require('./routes/manufacturerProduct.routes');
const orderRoutes = require('./routes/order.routes');
const manufacturerRoutes = require('./routes/manufacturer.routes');
const customerRoutes = require('./routes/customer.routes');

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/manufacturerproduct', manufacturerProductRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/customer', customerRoutes);


app.listen(PORT, () => {
    logger.info(`Server running on port number ${PORT}`);

});
