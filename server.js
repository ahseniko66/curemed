require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

console.log('🔧 Environment Check:');
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? 'Loaded' : 'Missing!'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'Loaded' : 'Missing!'}`);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', require('./routes/userRoutes'));
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/auth', require('./routes/authRoutes'));   
app.use('/api/resource', require('./routes/resourceRoute')); 
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});