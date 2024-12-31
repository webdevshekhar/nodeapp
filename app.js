const express = require('express');
const connectDB = require('./src/config/db');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const Routes = require('./src/app/routes/index.route');
app.use('/api/v1', Routes.apiRoutes);

// Error Handling Middleware
const middleware = require('./src/app/middlewares/index.middleware')
app.use(middleware.errorHandler.errorHandler);

// Handle Uncaught Exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message);
    process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
