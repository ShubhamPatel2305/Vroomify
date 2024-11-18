/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { z } from 'zod';
import { getUserData } from '../utils/TokenUtils';
import { X, Upload, Trash2 } from 'lucide-react';

const MAX_TOTAL_IMAGES = 10;

const EditCarImagesModal = ({ isOpen, onClose, carId, carData }) => {
  const [formData, setFormData] = useState({
    title: carData.title || '',
    description: carData.description || '',
    tags: {
      car_type: carData.tags.car_type || '',
      company: carData.tags.company || '',
      variant: carData.tags.variant || '',
      dealer: carData.tags.dealer || '',
    }
  });
  
  const [existingImages, setExistingImages] = useState(carData.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const resetModalState = () => {
    setFormData({
      title: carData.title || '',
      description: carData.description || '',
      tags: {
        car_type: carData.tags.car_type || '',
        company: carData.tags.company || '',
        variant: carData.tags.variant || '',
        dealer: carData.tags.dealer || '',
      }
    });
    setExistingImages(carData.images || []);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setNewImages([]);
  };

  const handleModalClose = () => {
    resetModalState();
    onClose();
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (isOpen) {
      resetModalState();
    }
  }, [carData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding new files would exceed the maximum
    const totalImagesAfterAdd = existingImages.length + newImages.length + files.length;
    if (totalImagesAfterAdd > MAX_TOTAL_IMAGES) {
      toast.error(`Cannot add more images. Maximum limit is ${MAX_TOTAL_IMAGES} images.`);
      return;
    }
    
    // Filter for image files and size limit (5MB)
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
      if (!isValid) {
        toast.error(`${file.name} is invalid. Must be an image under 5MB.`);
      }
      return isValid;
    });

    // Create preview URLs for valid files
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setNewImages(prev => [...prev, ...validFiles]);
  };

  const removeExistingImage = (indexToRemove) => {
    // Check if removing this image would leave no images
    if (existingImages.length + newImages.length <= 1) {
      toast.error('At least one image is required. Cannot remove the last image.');
      return;
    }
    
    setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeNewImage = (indexToRemove) => {
    // Check if removing this image would leave no images
    if (existingImages.length + newImages.length <= 1) {
      toast.error('At least one image is required. Cannot remove the last image.');
      return;
    }
    
    setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateChanges = () => {
    // Check if any changes were made
    const isImagesChanged = 
      existingImages.length !== carData.images.length || 
      !existingImages.every((url, index) => url === carData.images[index]) ||
      newImages.length > 0;

    if (!isImagesChanged) {
      toast.error('No changes detected. Please modify the images before submitting.');
      return false;
    }

    // Check minimum image requirement
    if (existingImages.length + newImages.length < 1) {
      toast.error('At least one image is required.');
      return false;
    }

    // Check maximum image limit
    if (existingImages.length + newImages.length > MAX_TOTAL_IMAGES) {
      toast.error(`Maximum ${MAX_TOTAL_IMAGES} images allowed. Please remove some images.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before proceeding
    if (!validateChanges()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('car_id', carId);
      formDataToSend.append('existing_images', JSON.stringify(existingImages));
      
      newImages.forEach((file, index) => {
        formDataToSend.append('images', file);
      });

      const token = getUserData().token;
      
      const response = await axios.put(
        `https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/car/edit-images`,
        formDataToSend,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Car images updated successfully!');
      handleModalClose();
    } catch (error) {
      console.error('Error updating car images:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update car images';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleModalClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Car Images</h2>
          <button onClick={handleModalClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Count Indicator */}
        <div className="mb-4 text-sm">
          <span className={`font-medium ${existingImages.length + newImages.length >= MAX_TOTAL_IMAGES ? 'text-red-500' : 'text-gray-600'}`}>
            {existingImages.length + newImages.length} / {MAX_TOTAL_IMAGES} images used
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing Images Section */}
          <div>
            <h3 className="font-medium mb-2">Current Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img 
                    src={url} 
                    alt={`Car ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* New Images Section */}
          <div>
            <h3 className="font-medium mb-2">Add New Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img 
                    src={url} 
                    alt={`New ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Upload Button - Hidden if max images reached */}
              {existingImages.length + newImages.length < MAX_TOTAL_IMAGES && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors disabled:bg-violet-300"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Images'}
            </button>
          </div>    
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EditCarImagesModal;