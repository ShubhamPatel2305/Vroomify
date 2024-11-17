/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
    const { title, description, images, tags } = car;
    const navigate=useNavigate();

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-violet-300 w-full flex flex-col">
            {/* Image Section */}
            <img
                src={images[0]}
                alt={title}
                className="w-full rounded-md object-cover cursor-pointer"
                onClick={()=>navigate(`/car/${car._id.toString()}`)}
                style={{ maxHeight: '300px' }} // Optional: Set a maximum height for consistent design
            />
            
            {/* Text Section */}
            <div className="mt-4 flex-grow">
                <h2 className="text-xl font-bold cursor-pointer text-violet-600">{title}</h2>
                <p className="text-gray-700 mt-2 cursor-pointer">{description}</p>
            </div>

            {/* Tags Section */}
            <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-block bg-violet-200 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tags.car_type}
                </span>
                <span className="inline-block bg-violet-200 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tags.company}
                </span>
                <span className="inline-block bg-violet-200 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tags.variant} variant
                </span>
            </div>
        </div>


    );
};

export default CarCard;
