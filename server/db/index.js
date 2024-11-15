const mongoose = require('mongoose');
require('dotenv').config();

// Create a function to connect to MongoDB
const connectDB = async () => {
    if (!process.env.DB_CONNECTION_STRING) {
        console.error("DB_CONNECTION_STRING is not defined in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error; // Propagate the error
    }
};

const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit random number
};

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    },
    registration_otp: {
        type: String,
        default: generateRandomOTP
    },
    reset_otp: {
        type: String,
        default: generateRandomOTP
    },
    state: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'pending'
    }
});

// Car Schema
const CarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    images: [{
        type: String,
        validate: {
            validator: function(v) {
                return v.match(/\.(jpg|jpeg|png|gif)$/);
            },
            message: props => `${props.value} is not a valid image format!`
        },
        required: true,
        validate: [function(images) { return images.length <= 10; }, 'A car cannot have more than 10 images.']
    }],
    tags: {
        car_type: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        variant:{
            type: String,
            enum: ['low','mid','top'],
            required: true
        },
        dealer: {
            type: String,
            required: true
        }
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Index for search functionality
CarSchema.index({ title: 'text', description: 'text', 'tags.car_type': 'text', 'tags.company': 'text', 'tags.dealer': 'text' });

// Models
const User = mongoose.model('User', UserSchema);
const Car = mongoose.model('Car', CarSchema);

//export
module.exports = { User, Car };