const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    hospitalName: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    gender: { 
        type: String, 
        required: true,
        enum: ['Male', 'Female']
    },
    symptoms: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    appointmentTime: {
        type: String,
        required: true,
        default: "09:00 AM"
    },
    status: { 
        type: String, 
        default: 'Waiting',
        enum: ['Waiting', 'Confirmed', 'Completed', 'Cancelled']
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Appointment', AppointmentSchema);