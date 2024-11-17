/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'lucide-react';
import NavbarContainer from '../components/NavbarContainer';

const CreateCar = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    car_type: '',
    company: '',
    variant: 'mid',
    dealer: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else {
          delete newErrors.title;
        }
        break;
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        } else {
          delete newErrors.description;
        }
        break;
      case 'car_type':
        if (!value.trim()) {
          newErrors.car_type = 'Car type is required';
        } else {
          delete newErrors.car_type;
        }
        break;
      case 'company':
        if (!value.trim()) {
          newErrors.company = 'Company is required';
        } else {
          delete newErrors.company;
        }
        break;
      case 'dealer':
        if (!value.trim()) {
          newErrors.dealer = 'Dealer information is required';
        } else {
          delete newErrors.dealer;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (selectedFiles.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        toast.error(`${file.name} is not a valid image file`);
      }
      return isValid;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    // Validate files
    if (selectedFiles.length === 0) {
      newErrors.files = 'At least one image is required';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append created_by (assuming you have the user's ID from context/auth)
      formDataToSend.append('created_by', '67397c737fb3d61e7da12be4'); // Replace with actual user ID

      // Append files
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await axios.post('https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/car/add-car', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Car details added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        car_type: '',
        company: '',
        variant: 'mid',
        dealer: ''
      });
      setSelectedFiles([]);
      setErrors({});

    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add car details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><NavbarContainer />
    <div className="flex justify-center items-center min-h-screen bg-white p-4 mt-24">
      <div className="bg-violet-50 p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-violet-600">Add New Car</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-violet-600 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.title ? 'border-red-500' : 'border-violet-400'
              } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-violet-600 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-violet-400'
              } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Car Type */}
          <div className="mb-4">
            <label htmlFor="car_type" className="block text-violet-600 font-medium mb-2">
              Car Type
            </label>
            <input
              type="text"
              id="car_type"
              name="car_type"
              value={formData.car_type}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.car_type ? 'border-red-500' : 'border-violet-400'
              } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
            />
            {errors.car_type && <p className="text-red-500 text-sm mt-1">{errors.car_type}</p>}
          </div>

          {/* Company */}
          <div className="mb-4">
            <label htmlFor="company" className="block text-violet-600 font-medium mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.company ? 'border-red-500' : 'border-violet-400'
              } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>

          {/* Variant */}
          <div className="mb-4">
            <label htmlFor="variant" className="block text-violet-600 font-medium mb-2">
              Variant
            </label>
            <select
              id="variant"
              name="variant"
              value={formData.variant}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md border-violet-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="top">Top</option>
            </select>
          </div>

          {/* Dealer */}
          <div className="mb-4">
            <label htmlFor="dealer" className="block text-violet-600 font-medium mb-2">
              Dealer
            </label>
            <input
              type="text"
              id="dealer"
              name="dealer"
              value={formData.dealer}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.dealer ? 'border-red-500' : 'border-violet-400'
              } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
            />
            {errors.dealer && <p className="text-red-500 text-sm mt-1">{errors.dealer}</p>}
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-violet-600 font-medium mb-2">
              Images (Max 10)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md border-violet-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500"
            />
            {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}
            
            {/* Selected Files List */}
            <div className="mt-4 space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-violet-500 focus:ring-2 w-full ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Adding Car...' : 'Add Car'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default CreateCar;