const mongoose = require('mongoose');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

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
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
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
    images: {
        type: [String],
        required: true,
        validate: [
          {
            validator: function(images) {
              // Validate array length
              return images.length <= 10;
            },
            message: 'A car cannot have more than 10 images.'
          },
          {
            validator: function(images) {
              // Validate each URL is either a valid image URL or IPFS URL
              return images.every(url => 
                // Match traditional image URLs
                url.match(/\.(jpg|jpeg|png|gif)$/i) ||
                // Match Pinata IPFS URLs
                url.match(/^https:\/\/gateway\.pinata\.cloud\/ipfs\/[a-zA-Z0-9]+/)
              );
            },
            message: 'One or more image URLs are invalid.'
          }
        ]
      },
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
    },
    creator_name:{
        type:String,
        required:true
    },
    creator_email:{
        type:String,
        required:true
    }
});

// Index for search functionality
CarSchema.index({ title: 'text', description: 'text', 'tags.car_type': 'text', 'tags.company': 'text', 'tags.dealer': 'text' });

// Models
const User = mongoose.model('User', UserSchema);
const Car = mongoose.model('Car', CarSchema);

//export
module.exports = { User, Car, connectDB };