const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ 
            success: false,
            error: "Server error fetching profile" 
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!username && !email) {
            return res.status(400).json({ 
                success: false,
                error: "No data provided for update" 
            });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Update profile error:", err);
        
        if (err.code === 11000) {
            return res.status(400).json({ 
                success: false,
                error: "Email already exists" 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Server error updating profile" 
        });
    }
};