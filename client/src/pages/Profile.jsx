import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserData } from '../utils/TokenUtils';
import NavbarContainer from '../components/NavbarContainer';
import CarCard from '../components/CarCard';

const Profile = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("U N");
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const { username } = getUserData();
        setUsername(username);

        const fetchCars = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const {token} = getUserData();
                const response = await axios.get('https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/car/my-cars', {
                    headers: {
                        authorization: token,
                    },
                });
                setCars(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Unauthorized: Please log in again.');
                } else if (err.response?.status === 403) {
                    setError('No cars created yet.');
                } else {
                    setError('Failed to fetch cars. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCars();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <>
            <NavbarContainer />
            <div className="mt-16 px-1/5 grid grid-cols-10 h-screen">
                <div className="col-span-8 border-gray-200 border-e-2 pt-28 pr-16">
                    <div className="text-4xl text-black font-bold border-b-2 pb-10">{username}</div>
                    <div className="pt-8">
                        {isLoading ? (
                            <div className="text-center text-indigo-600 text-lg">Loading your cars...</div>
                        ) : error ? (
                            <div className="text-red-500 text-lg">{error}</div>
                        ) : (
                            <>
                            <h1 className="text-2xl font-bold mb-8">Your created cars</h1>
                            <div className="flex flex-col gap-6">
                                {cars.map((car) => (
                                    <CarCard key={car._id} car={car} />
                                ))}
                            </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="pt-16 pl-10">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 overflow-hidden rounded-full bg-indigo-300">
                            <span className="font-medium text-black">
                                {username.split(' ').map((item) => item[0]).join('').toUpperCase()}
                            </span>
                        </div>
                        <div className="text-black font-medium text-md pl-1 pt-5">{username}</div>
                        <button
                            className="underline text-red-400 pl-1 py-1 rounded-md mt-3"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
