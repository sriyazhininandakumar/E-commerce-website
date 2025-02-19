const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const logger = require("../logger")


const isAuthenticated = async (req, res, next) => {
    try {
        logger.debug("Checking authentication...");
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.debug(`Token decoded: ${JSON.stringify(decoded)}`);
        const user = await User.findByPk(decoded.id, {
             include:[{ model: Role }] 
            });

        if (!user) {
            logger.warn("Unauthorized: User not found");
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        logger.info(`User authenticated: ${user.id} - ${user.Role?.roleName}`);
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        return res.status(403).json({ message: 'Invalid token' });
    }
};



const isAdmin = async (req, res, next) => {
    try {
        logger.debug("Checking admin access...");
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) 
            {
                logger.warn("Unauthorized: No token provided");
                return res.status(401).json({ message: 'Unauthorized' });}

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       logger.debug(`Token decoded: ${JSON.stringify(decoded)}`);
        const user = await User.findByPk(decoded.id, { include: Role });
        if (!user || user.Role?.roleName !== 'Admin') {
            logger.warn(`Access denied: User ${user.id} is not an Admin`);
            return res.status(403).json({ message: 'Admins only' });
        }

        req.user = user;
        logger.info(`Admin access granted: ${user.id}`);
        next();
    } catch (error) {
        logger.error(`Admin authentication error: ${error.message}`);
        return res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};




const isManufacturer = (req, res, next) => {
    logger.debug("Checking manufacturer access...");
    if (req.user.Role?.roleName !== 'Manufacturer') {
        logger.warn(`Access denied: User ${req.user.id} is not a Manufacturer`);
        return res.status(403).json({ message: 'Access denied: Manufacturers only' });
    }
    logger.info(`Manufacturer access granted: ${req.user.id}`);
    next();
};



const isCustomer = (req, res, next) => {
    logger.debug("Checking customer access...");
    if (req.user.Role?.roleName !== 'Customer') {
        logger.warn(`Access denied: User ${req.user.id} is not a Customer`);
        return res.status(403).json({ message: 'Access denied: Customers only' });
    }
    logger.info(`Customer access granted: ${req.user.id}`);
    next();
};


module.exports = { isAdmin,isAuthenticated, isManufacturer, isCustomer   };
