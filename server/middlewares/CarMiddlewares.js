const {Car, User}= require('../db/index');
const FormData = require('form-data');
const { z } = require('zod');
const axios = require('axios');
const busboy = require('busboy');
const jwt=require('jsonwebtoken');

// Zod schema for validation
const CarValidationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  car_type: z.string(),
  company: z.string(),
  variant: z.enum(['low', 'mid', 'top']),
  dealer: z.string(),
  created_by: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});

const editCarDetailSchema = z.object({
  title: z.string().min(1).optional(), // title can be changed (non-empty string)
  description: z.string().min(1).optional(), // description can be changed (non-empty string)
  tags: z.array(z.string()).min(1).optional(), // tags can be changed (array of non-empty strings)
  car_id:z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
}).refine((data) => {
  // Ensure at least one field is provided for modification
  return data.title || data.description || data.tags?.length > 0;
}, {
  message: "At least one field (title, description, or tags) must be changed.",
  path: ["title", "description", "tags"], // Path where the validation error should be placed
});

// Helper function to parse multipart form data
const parseFormData = async (req) => {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = [];
    
    const bb = busboy({ 
      headers: req.headers,
      limits: {
        files: 10,
        fileSize: 5 * 1024 * 1024 // 5MB limit per file
      }
    });

    bb.on('field', (name, value) => {
      fields[name] = value;
    });

    bb.on('file', async (name, file, info) => {
      if (!info.mimeType.startsWith('image/')) {
        return;
      }

      const chunks = [];
      file.on('data', (chunk) => chunks.push(chunk));
      
      file.on('end', () => {
        files.push({
          fieldname: name,
          buffer: Buffer.concat(chunks),
          mimetype: info.mimeType,
          originalname: info.filename
        });
      });
    });

    bb.on('finish', () => {
      resolve({ fields, files });
    });

    bb.on('error', reject);
    req.pipe(bb);
  });
};

// Middleware for input validation
const validateCarInput = async (req, res, next) => {
  try {
    // Parse multipart form data
    const { fields, files } = await parseFormData(req);

    try {
      // Validate fields using Zod
      await CarValidationSchema.parseAsync(fields);

      // Attach parsed data to request
      req.formFields = fields;
      req.formFiles = files;
      next();
    } catch (validationError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationError.errors || validationError.message 
      });
    }
  } catch (error) {
    console.error('Form processing error:', error);
    res.status(500).json({ 
      error: 'Form processing failed', 
      details: error.message 
    });
  }
};

// Helper function to upload file to Pinata
const uploadToPinata = async (file) => {
  try {
    const formData = new FormData();
    
    // Append the file buffer directly
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'pinata_api_key': process.env.PINATA_API_KEY,
          'pinata_secret_api_key': process.env.PINATA_API_SECRET
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error(`Failed to upload to Pinata: ${error.message}`);
  }
};

// Main route handler
const addCar = async (req, res) => {
  try {
    const { formFields, formFiles } = req;

    // Check if any images were uploaded
    if (!formFiles || formFiles.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // Upload all images to Pinata
    const imageUrls = await Promise.all(
      formFiles.map(file => uploadToPinata(file))
    );

    // Create new car document
    const newCar = new Car({
      title: formFields.title,
      description: formFields.description,
      images: imageUrls,
      tags: {
        car_type: formFields.car_type,
        company: formFields.company,
        variant: formFields.variant,
        dealer: formFields.dealer
      },
      created_by: formFields.created_by,
      creator_name: formFields.creator_name,
      creator_email:formFields.creator_email
    });

    console.log()

    await newCar.save();

    res.status(201).json({
      message: 'Car added successfully',
      car: newCar
    });

  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ 
      error: 'Failed to add car', 
      details: error.message 
    });
  }
};

const validateToken= async (req,res,next)=>{
  try {
    //get token from authorization in header if not erro then verify it then decode it and extract user_id from it
    const token = req.header('authorization');
    if(!token){
        return res.status(401).send({message:"Token not found."});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if(!userId){
        return res.status(401).send({message:"Invalid token."});
    }
    //checl if user exists
    const user = await User.findById(userId);
    if(!user){
        return res.status(401).send({message:"User not found."});
    }
    req.user=user;
    req.userId=user._id;
    req.userName=user.name;
    req.userEmail=user.email;
    next();
  } catch (error) {
    return res.status(500).send({
      message: 'Error validating token'
    })
  }
}

const getCarMiddleware= async (req,res,next)=>{
  try {
    const carId = req.params.id;
    const car = await Car.findById(carId);
    if(!car){
      return res.status(405).json({message: 'Car not found'});
    }
    if(car.created_by.toString() === req.userId.toString()){
      car.created_by=req.userName;
      req.car=car;
      next();
    }
    else{
      return res.status(403).json({message: 'You are not the owner of this car'});
    }
  } catch (error) {
    return res.status(500).json({message: 'Error getting car', details: error.message});
  }
}

const editCarDetails= async (req,res,next)=>{
  try {
    // Validate incoming data based on the Zod schema
    editCarDetailSchema.parse(req.body);  
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }

  const carId=req.body.car_id;
  let car;
  try {
    car = await Car.findById(carId);
    if (!car) {
      return res.status(402).json({ error: "Car not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching car details' });
  }

  const updatedFields = {
    title:req.body.title,
    description:req.body.description
  };


  // Handle the tags array
  if (req.body.tags) {
    const updatedTags = {};
    const tagKeys = Object.keys(car.tags); // Get the keys from the existing tags

    // Ensure we update all tags in order based on the received array
    tagKeys.forEach((key, index) => {
      updatedTags[key] = req.body.tags[index]; // Map values from array to keys
    });

    updatedFields.tags = updatedTags;
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(carId, updatedFields, { new: true });
    return res.status(200).json({ message: 'Car details updated successfully', car: updatedCar });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating car details' });
  }
}

// Backend route handler for updating images
const updateCarImages = async (req, res) => {
  try {
    const { fields, files } = await parseFormData(req);
    const { car_id, existing_images } = fields;
    
    // Parse existing images from JSON string
    const existingImageUrls = JSON.parse(existing_images);
    
    // Upload new images to Pinata if any
    const newImageUrls = files.length > 0 
      ? await Promise.all(files.map(file => uploadToPinata(file)))
      : [];
    
    // Combine existing and new image URLs
    const updatedImageUrls = [...existingImageUrls, ...newImageUrls];
    
    // Update car document
    await Car.findByIdAndUpdate(car_id, {
      images: updatedImageUrls
    });
    
    res.status(200).json({
      message: 'Car images updated successfully',
      images: updatedImageUrls
    });
    
  } catch (error) {
    console.error('Error updating car images:', error);
    res.status(500).json({
      error: 'Failed to update car images',
      details: error.message
    });
  }
};

module.exports={
  addCar,
  validateCarInput,
  validateToken,
  getCarMiddleware,
  editCarDetails,
  updateCarImages
}