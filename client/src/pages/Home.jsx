import NavbarContainer from "../components/NavbarContainer";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { getUserData } from "../utils/TokenUtils";
import { Mail, Lock, AlertTriangle } from 'lucide-react';

const Home = () => {
  let isLoggedIn = false;
  const { token, username } = getUserData();
  
  if (token && token !== '') {
    isLoggedIn = true;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavbarContainer />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoggedIn ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {username}!
              </h1>
            </div>
            <Hero />
          </>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Please log in to start using the app
              </h2>
              
              {/* Custom Alert */}
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <p className="ml-3 text-sm text-amber-700">
                    We&apos;re using SendGrid&apos;s free API for OTP delivery, which may occasionally fail while Signing Up a new Account.
                    <br />
                    <br />
                    If you experience issues, please use these credentials:
                  </p>
                </div>
              </div>

              {/* Credentials Box */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <span className="text-sm text-gray-600">shubhamcp23@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Password:</span>
                  <span className="text-sm text-gray-600">Shubham@1234</span>
                </div>
              </div>

              <Link 
                to="/signin" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200"
              >
                Sign In
              </Link>
              
              <p className="mt-4 text-center text-xs text-gray-500">
                This is a demo project for assignment purposes only
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;