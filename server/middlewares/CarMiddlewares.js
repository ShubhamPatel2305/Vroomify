const { z } = require('zod');
const multer = require('multer');

// Set up multer storage for images (you can adjust settings as needed)
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 1 * 1024 * 1024 }, // Maximum file size of 1MB
  fileFilter: (req, file, cb) => {
    // Only allow image file types (jpg, jpeg, png, gif)
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format'), false);
    }
  }
});

// Define Zod schema for validating the request body (form data)
const carSchema = z.object({
  title: z.string().min(1, 'Title is required and must be at least 1 character long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  // Validate images as an array of file objects (multer stores them in req.files)
  images: z.array(
    z.object({
      originalname: z.string().regex(/\.(jpg|jpeg|png|gif)$/i, 'Invalid image format'), // Image format check
      buffer: z.instanceof(Buffer).refine(buf => buf.length > 0, 'Image is required'),
    })
  ).min(1, 'At least one image is required'),
  tags: z.object({
    car_type: z.string().min(1, 'Car type is required'),
    company: z.string().min(1, 'Company is required'),
    variant: z.enum(['low', 'mid', 'top'], 'Variant is required and must be one of "low", "mid", "top"'),
    dealer: z.string().min(1, 'Dealer is required'),
  }),
  created_by: z.string().min(1, 'User ID (created_by) is required'), // Ensure it is a string (ID)
});

// Middleware to validate the request body against the Zod schema
const validateCarInput = (req, res, next) => {
  try {
    // Parse and validate the body using the Zod schema
    // req.body contains the text fields
    // req.files contains the uploaded files (images)
    const validatedData = carSchema.parse({
      ...req.body,
      images: req.files, // Attach the images to the schema for validation
    });

    // If no errors, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If validation fails, respond with a 400 error and the validation message
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    // Handle unexpected errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export multer upload and validation middleware together
module.exports = { validateCarInput, upload };
