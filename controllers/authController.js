const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: "User with this email already exists" 
            });
        }
        const user = await User.create({ 
            username, 
            email, 
            password 
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            username: user.username,
            userId: user._id
        });

    } catch (err) {
        next(err); 
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide email and password"
            });
        }
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid email or password" 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid email or password" 
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "Login successful",
            token,
            username: user.username,
            userId: user._id
        });

    } catch (err) {
        next(err); 
    }
};