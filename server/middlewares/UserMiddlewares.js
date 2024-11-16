const { z } = require('zod');
const {User} = require("../db/index"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignupSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({ message: "Invalid email format." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
    
});

const userSigninSchema = z.object({
    email: z.string().email({ message: "Invalid email format." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long." })
});

const userVerifySchema=z.object({
    email: z.string().email({ message: "Invalid email format." }),
    registerOtp: z.string().length(6, { message: "Register OTP must be 6-digit ." }),
})

// Middleware function for input validation and email uniqueness check
const validateUserSignup = async (req, res, next) => {
    try {
        // Validate the incoming request body against the Zod schema
        const result = userSignupSchema.safeParse(req.body);
        if (!result.success) {
            // Throw an error with the specific validation messages
            throw new Error(result.error.errors.map(err => err.message).join(', '));
        }

        // Check if a user with the same email already exists
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                errors: ["A user with this email already exists."],
            });
        }

        // If validation passes and email is unique, call the next middleware
        next();
    } catch (error) {
        // If validation or email check fails, respond with the errors
        return res.status(401).json({
            errors: [error.message], // Ensure to return a single error message for clarity
        });
    }
};

//user sign in check middleware that validates input then checks if userwith given username and pasword hash matches a user in db if yes then next
const validateUserSignin = async (req, res, next) => {
    try {
        // Validate the incoming request body against the Zod schema
        const result = userSigninSchema.safeParse(req.body);
        if (!result.success) {
            // Throw an error with the specific validation messages
            throw new Error(result.error.errors.map(err => err.message).join(', '));
        }

        const { email, password } = req.body;

        // Check if a user with the same email exists
        const existingUser = await User.findOne({ email:email.trim() });
        if (!existingUser) {
            return res.status(400).json({
                errors: ["invalid credentials"],
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, existingUser.password_hash);
        if (!passwordMatch) {
            return res.status(400).json({
                errors: ["invalid credentials"],
            });
        }
        
        //if pending
        if (existingUser.state === 'pending') {
            return res.status(402).json({
                errors: ["This account has not been verified. Please verify your account."],
            });
        }

        req.user_id=existingUser.id;
        req.user=existingUser;  
        next();
    } catch (error) {
        return res.status(403).json({
            errors: [error.message],
        });
    }
};

async function validateUserVerify(req,res,next){
    //check schema of request
    //extract email and otp from req body and check with schema of zod, dont do anything else
    try {
        const result = userVerifySchema.safeParse(req.body);
        if (!result.success) {
            // Throw an error with the specific validation messages
            throw new Error(result.error.errors.map(err => err.message).join(', '));
        }
        next();
    } catch (error) {
        // If validation or email check fails, respond with the errors
        return res.status(403).json({
            errors: [error.message], // Ensure to return a single error message for clarity
        });
    }
}

async function tokenValidation(req,res,next){
    //get user token from headers authorization and extract email then use req body having resetOtp match it with reset otp of given user in db if match then generate a new random 6 digit otp of numbers convert to string andstore it in db then make updated
    //user object and call next
    try {
        
        const token = req.headers.authorization;
        if(!token){
            return res.status(400).json({
                errors: ["token missing"],
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        //verify if user with that email exists in db if yes extract his reset_otp and save it 
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                errors: ["Enter a valid token"],
            });
        }

        // If validation passes and email is unique, call the next middleware
        req.user_id=existingUser.id;
        req.user=existingUser;
        next();
    } catch (error) {
        return res.status(402).json({
            errors: [error.message],
        });
    }
}

module.exports = {
    validateUserSignup,
    validateUserSignin,
    validateUserVerify,
    tokenValidation
};