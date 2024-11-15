const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter=require("./routes/User");
const cors = require("cors");
const { connectDB } = require('./db');


// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRouter);

const PORT = 3001;

// Start server only after connecting to MongoDB
const startBackend = async () => {
    try {
        await connectDB(); // Wait for database connection and try again and again

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start backend:', error);
        process.exit(1);
    }
};

startBackend();