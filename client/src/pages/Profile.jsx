import { useEffect, useState } from 'react';
import axios from 'axios';
import { clearUserData, getUserData } from '../utils/TokenUtils';
import NavbarContainer from '../components/NavbarContainer';
import CarCard from '../components/CarCard';
import { Loader2, Search } from 'lucide-react';

const Profile = () => {
    const [username, setUsername] = useState("U N");
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const { username } = getUserData();
      setUsername(username);
  
      const fetchCars = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const { token } = getUserData();
          const response = await axios.get('https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/car/my-cars', {
            headers: {
              authorization: token,
            },
          });
          setCars(response.data);
          setFilteredCars(response.data);
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

    useEffect(() => {
      const filterCars = () => {
        const query = searchQuery.toLowerCase();
        const filtered = cars.filter(car => {
          const titleMatch = car.title?.toLowerCase().includes(query);
          const descriptionMatch = car.description?.toLowerCase().includes(query);
          const tagMatches = Object.values(car.tags || {}).some(tagValue => 
            tagValue.toLowerCase().includes(query)
          );

          return titleMatch || descriptionMatch || tagMatches;
        });
        setFilteredCars(filtered);
      };

      filterCars();
    }, [searchQuery, cars]);
  
    const handleLogout = () => {
      clearUserData();
      window.location.href = "/";
    };

    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
    };
  
    return (
      <>
        <NavbarContainer />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row">
              {/* Main Content Area */}
              <div className="flex-1 pt-8 lg:pr-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-violet-600" size={32} />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    {error}
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Your Cars</h2>
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search by title, description, or tags..."
                          value={searchQuery}
                          onChange={handleSearch}
                          className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                      {filteredCars.map((car) => (
                        <CarCard key={car._id} car={car} />
                      ))}
                    </div>
                    {filteredCars.length === 0 && searchQuery && (
                      <div className="text-center text-gray-500 py-8">
                        No cars found matching your search criteria
                      </div>
                    )}
                  </div>
                )}
              </div>
  
              {/* Profile Sidebar - Only visible on desktop */}
              <div className="hidden lg:block w-72 pt-8 pl-8 border-l border-gray-200">
                <div className="sticky top-24">
                  <div className="flex flex-col items-center">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 overflow-hidden rounded-full bg-violet-200">
                      <span className="font-medium text-violet-800 text-2xl">
                        {username.split(' ').map((item) => item[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-800 font-medium text-lg mt-4">{username}</div>
                    <button
                      className="mt-4 px-6 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Profile;