const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');



const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, { include: Role });

        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};



const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, { include: Role });
        if (!user || user.Role?.roleName !== 'Admin') {
            return res.status(403).json({ message: 'Admins only' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};




const isManufacturer = (req, res, next) => {
    if (req.user.Role?.roleName !== 'Manufacturer') {
        return res.status(403).json({ message: 'Access denied: Manufacturers only' });
    }
    next();
};



const isCustomer = (req, res, next) => {
    
    if (req.user.Role?.roleName !== 'Customer') {
        return res.status(403).json({ message: 'Access denied: Customers only' });
    }
    next();
};


module.exports = { isAdmin,isAuthenticated, isManufacturer, isCustomer   };
