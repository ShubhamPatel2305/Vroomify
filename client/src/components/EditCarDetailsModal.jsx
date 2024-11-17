/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { z } from 'zod';
import { getUserData } from '../utils/TokenUtils';

const EditCarDetailsModal = ({ isOpen, onClose, carId, carData, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: carData.title || '',
    description: carData.description || '',
    tags: {
      car_type: carData.tags.car_type || '',
      company: carData.tags.company || '',
      variant: carData.tags.variant || '',
      dealer: carData.tags.dealer || '',
    },
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tags: {
        ...prevData.tags,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { title, description, tags } = formData;
    const token = getUserData().token;
    const userId = getUserData().userId;

    // Zod Schema Validation
    const schema = z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        tags: z.object({
          car_type: z.string().optional(),
          company: z.string().optional(),
          variant: z.string().optional(),
          dealer: z.string().optional(),
        }).optional(),
      })
      .refine((data) => {
        return (
          data.title !== carData.title ||
          data.description !== carData.description ||
          Object.keys(data.tags || {}).some(
            (key) => data.tags[key] !== carData.tags[key]
          )
        );
      }, {
        message: 'No changes detected.',
      });

    try {
      schema.parse({ title, description, tags });

      const parsedData = {
        title: title.trim(),
        description: description.trim(),
        tags: Object.values(tags).map((value) => value.trim()),
        car_id: carData._id.toString(),
      };

      const response = await axios.put(
        `https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/car/edit-details`,
        parsedData,
        { headers: { authorization: token } }
      );

      toast.success('Car details updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      if (error.message === 'No changes detected.') {
        toast.error('No changes detected. Please modify at least one field.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid input data.');
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized access.');
      } else {
        toast.error('Please change atleast one field');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Car Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <div>
              <h3 className="font-medium mb-2">Tags:</h3>
              <div className="mb-2">
                <input
                  type="text"
                  name="car_type"
                  placeholder="Car Type"
                  value={formData.tags.car_type}
                  onChange={handleTagChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.tags.company}
                  onChange={handleTagChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-2">
                <select
                  name="variant"
                  value={formData.tags.variant}
                  onChange={handleTagChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled>
                    Select Variant
                  </option>
                  <option value="low">Low</option>
                  <option value="mid">Mid</option>
                  <option value="top">Top</option>
                </select>
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  name="dealer"
                  placeholder="Dealer"
                  value={formData.tags.dealer}
                  onChange={handleTagChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EditCarDetailsModal;
