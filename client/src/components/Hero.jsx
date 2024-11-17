import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate=useNavigate();
  return (
    <div className="flex justify-center gap-4 p-4">
      {/* My Cars Button */}
      <button className="bg-violet-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-violet-600 transition duration-200" onClick={()=>navigate("/profile")}>
        My Cars
      </button>

      {/* Create New Car Button */}
      <button className="bg-white text-violet-500 border-2 border-violet-500 px-6 py-2 rounded-lg font-bold hover:bg-violet-50 transition duration-200" onClick={()=>navigate("/create-car")}>
        Create New Car
      </button>
    </div>
  );
};

export default Hero;
