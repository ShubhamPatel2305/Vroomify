/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tag, Clock, User, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { getUserData } from '../utils/TokenUtils';
import NavbarContainer from "../components/NavbarContainer"
import EditCarDetailsModal from "../components/EditCarDetailsModal"
import EditCarImagesModal from '../components/EditCarImagesModal';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this car? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen,setDetailsModalOpen]=useState(false);
  const [imagesModalOpen,setImagesModalOpen]=useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const {token} = getUserData();
        const response = await axios.get(`https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/car/${id}`, {
          headers: {
            authorization: token
          }
        });
        setCar(response.data);
      } catch (error) {
        switch (error.response?.status) {
          case 401:
            toast.error('Unauthorized access. Please login again.');
            break;
          case 403:
            toast.error('You do not have permission to view this car.');
            break;
          case 405:
            toast.error('Invalid car ID.');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            toast.error('An error occurred while fetching car details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const openModal = () => {
    setModalOpen(true);
  };
  
  const openDetailModal=()=>{
    setDetailsModalOpen(true);
  }

  const openImagesModal=()=>{
    setImagesModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeDetailModal=()=>{
    setDetailsModalOpen(false);
  }

  const closeImagesModal=()=>{
    setImagesModalOpen(false);
  }

  const handleCarUpdate = () => {
    setCar((prevCar) => ({
      ...prevCar,
      title: prevCar.title, // Use updated values if necessary
      description: prevCar.description,
      tags: prevCar.tags,
    }));
    window.location.reload();
  };


  const confirmDelete = async () => {
    setModalOpen(false);
    setIsDeleting(true);
    try {
      const { token } = getUserData();
      await axios.delete(
        `https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/car/delete/${car._id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      toast.success("Car deleted successfully");
      setTimeout(() => {
        navigate("/profile");
        window.location.reload();
      }, 1500);
    } catch (error) {
      switch (error.response?.status) {
        case 401:
          toast.error("Unauthorized access. Please login again.");
          break;
        case 403:
          toast.error("Car not found.");
          break;
        case 405:
          toast.error("You do not have permission to delete this car.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error("An error occurred while deleting the car.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (car?.images.length - 1) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car?.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-500"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Car details not found</p>
      </div>
    );
  }

  return (
    <>
    <NavbarContainer />
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-16">
      <ToastContainer position="top-right" autoClose={5000} />
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
      <EditCarDetailsModal
          isOpen={detailsModalOpen}
          onClose={closeDetailModal}
          carId={car._id}
          carData={car}
          onUpdate={handleCarUpdate}
        />
        
      <EditCarImagesModal 
      isOpen={imagesModalOpen}
      onClose={closeImagesModal}
      carId={car._id}
      carData={car}
      />

      
      {/* Card Container */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          {/* Image Carousel */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden group">
              <img
                src={car.images[currentImageIndex]}
                alt={car.title}
                className="w-full h-full object-contain bg-gray-100 cursor-pointer"
                onClick={() => setIsFullScreen(true)}
              />
              {car.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full 
                             hover:bg-violet-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6 text-violet-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full 
                             hover:bg-violet-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6 text-violet-600" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {car.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden 
                              ${currentImageIndex === index ? 'ring-2 ring-violet-500' : 'opacity-70'}`}
                  >
                    <img
                      src={image}
                      alt={`${car.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6 mt-6">
            {/* Title and Description */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.title}</h1>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(car.tags).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm 
                           bg-violet-100 text-violet-800 hover:bg-violet-200 transition-colors"
                >
                  <Tag className="w-4 h-4 mr-1.5" />
                  {key==="variant"?`Variant: ${value}`:`${value}`}
                </span>
              ))}
            </div>

            {/* Metadata */}
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-violet-500" />
                  <span>Created: {new Date(car.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-violet-500" />
                  <span>Creator : {car.creator_name}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 justify-between items-center">
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 
                                 transition-colors flex items-center" onClick={()=>openDetailModal()}>
                  Edit Details
                </button>
                <button className="px-4 py-2 border border-violet-600 text-violet-600 rounded-lg 
                                 hover:bg-violet-50 transition-colors flex items-center" onClick={()=>openImagesModal()}>
                  Edit Images
                </button>
              </div>
              
              {/* Delete Button */}
              <button
              onClick={openModal}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 
                         transition-colors flex items-center gap-2 ml-auto"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setIsFullScreen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={car.images[currentImageIndex]}
              alt={car.title}
              className="max-w-full max-h-full object-contain"
            />
            
            {car.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 
                           p-3 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 
                           p-3 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
            
            {/* Close button */}
            <button
              onClick={() => setIsFullScreen(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Image counter in full screen */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                          bg-white/10 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {car.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default CarDetail;