const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, roleId } = req.body;
        
        console.log("Received Data:", req.body);

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Convert password to string if it's a number
        const passwordStr = String(password);

        const userExists = await db.User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).send('Email is already associated with an account');
        }

        const roleExists = await db.Role.findByPk(roleId);
        if (!roleExists) {
            return res.status(400).json({ message: "Invalid roleId selected" });
        }

        const hashedPassword = await bcrypt.hash(passwordStr, 10);

        const newUser = await db.User.create({
            name,
            email,
            password: hashedPassword, 
            roleId, 
        });

        return res.status(200).send('Registration successful');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error in registering user');
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.User.findOne({
            where: { email },
            include: db.Role, 
        });

        if (!user) {
            return res.status(404).json('Email not found');
        }

        // Convert password to string before comparing
        const passwordStr = String(password);

        const passwordValid = await bcrypt.compare(passwordStr, user.password);
        if (!passwordValid) {
            return res.status(400).json('Incorrect email and password combination');
        }

        const token = jwt.sign(
            { id: user.id, role: user.Role.roleName }, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "1d" }
        );
        console.log(token);

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.Role.roleName,
            accessToken: token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Sign in error');
    }
}

module.exports = {
    registerUser,
    signInUser,
};
