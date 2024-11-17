/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Stay
          </button>
          <button
            className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded hover:bg-blue-600 transition-colors"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate("/signin");
  };

  return (
    <>
      <nav 
        className={`fixed top-0 md:p-3 w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-violet-600 shadow-lg' : 'bg-violet-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div 
              className="text-3xl text-white font-bold cursor-pointer flex-shrink-0 transition-transform hover:scale-105"
              onClick={() => navigate("/")}
            >
              Vroomify
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {location.pathname !== '/create-car' && (
                    <button
                      className="px-4 py-2 bg-white text-gray-800 font-semibold rounded-md
                                hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
                      onClick={() => navigate('/create-car')}
                    >
                      Create New Car
                    </button>
                  )}
                  <div 
                    className="relative inline-flex items-center justify-center w-10 h-10 
                              bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => navigate("/profile")}
                  >
                    <span className="font-medium text-gray-600">
                      {getInitials(username)}
                    </span>
                  </div>
                  <button 
                    className="text-white p-2 rounded-full hover:bg-violet-700 transition-colors"
                    onClick={handleLogoutClick}
                    aria-label="Logout"
                  >
                    <LogOut size={24} />
                  </button>
                </>
              ) : (
                <button 
                  className="px-5 py-2 bg-white text-gray-800 font-semibold rounded-md
                            hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={handleSignupClick}
                >
                  Join now
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="text-white p-2 rounded-full hover:bg-violet-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-4 pt-2 pb-4 bg-violet-600 space-y-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-600">
                      {getInitials(username)}
                    </span>
                  </div>
                  <span className="text-white font-medium">{username}</span>
                </div>
                {location.pathname !== '/create-car' && (
                  <button
                    className="w-full px-4 py-2 bg-white text-gray-800 font-semibold rounded-md
                              hover:bg-gray-100 transition-colors text-left"
                    onClick={() => navigate('/create-car')}
                  >
                    Create New Car
                  </button>
                )}
                <button
                  className="w-full px-4 py-2 text-white hover:bg-violet-700 rounded-md 
                            transition-colors flex items-center space-x-2"
                  onClick={() => navigate('/profile')}
                >
                  <span>Profile</span>
                </button>
                <button
                  className="w-full px-4 py-2 text-white hover:bg-violet-700 rounded-md 
                            transition-colors flex items-center space-x-2"
                  onClick={handleLogoutClick}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button 
                className="w-full px-4 py-2 bg-white text-gray-800 font-semibold rounded-md
                          hover:bg-gray-100 transition-colors"
                onClick={handleSignupClick}
              >
                Join now
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16" />

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Navbar;