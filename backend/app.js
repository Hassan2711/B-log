require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerJsDoc = require('./config/swagger')
const swaggerUi = require('swagger-ui-express')

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

// Use routes
app.use('/', authRoutes);
app.use('/', blogRoutes);


app.use(
    "/api-doc",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsDoc)
)

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
