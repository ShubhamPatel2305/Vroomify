const {Car}= require('../db/index');
const express = require("express");
const router = express.Router();
const { IncomingForm } = require('formidable');
const FormData = require('form-data');
const { z } = require('zod');
const axios = require('axios');
const busboy = require('busboy');

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
      created_by: formFields.created_by
    });

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

// Express route
router.post('/add-car', validateCarInput, addCar);

module.exports = router;