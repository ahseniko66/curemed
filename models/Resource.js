const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true 
    },
    category: {
        type: String,
        enum: ['Medical', 'Educational', 'General'],
        default: 'General'
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Archived'],
        default: 'Active'
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Resource', ResourceSchema);