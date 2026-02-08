const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                error: "No authentication token provided" 
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: "User no longer exists" 
            });
        }

        req.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                error: "Invalid authentication token" 
            });
        }
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                error: "Authentication token expired" 
            });
        }
        
        res.status(401).json({ 
            success: false,
            error: "Authentication failed" 
        });
    }
};