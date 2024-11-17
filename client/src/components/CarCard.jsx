import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const CarCard = ({ car }) => {
    const { title, description, images, tags } = car;
    const navigate = useNavigate();
  
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] border border-violet-200 hover:border-violet-400">
        <div className="relative w-full h-0 pb-[66.67%]"> {/* Creates a 3:2 aspect ratio container */}
            <img
                src={images[0]}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                onClick={() => navigate(`/car/${car._id.toString()}`)}
            />
        </div>
        
        <div className="p-4">
          <h2 
            className="text-xl font-bold cursor-pointer text-violet-600 hover:text-violet-800 transition-colors line-clamp-1"
            onClick={() => navigate(`/car/${car._id.toString()}`)}
          >
            {title}
          </h2>
          
          <p className="text-gray-700 mt-2 cursor-pointer line-clamp-2 text-sm">
            {description}
          </p>
  
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-block bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
              {tags.car_type}
            </span>
            <span className="inline-block bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
              {tags.company}
            </span>
            <span className="inline-block bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
              {tags.variant} variant
            </span>
          </div>
        </div>
      </div>
    );
  };

  export default CarCard;