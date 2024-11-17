/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index';

import { z } from 'zod';
import { getUserData, setUserData } from '../utils/TokenUtils';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingAttempted, setIsSendingAttempted] = useState(false); // New flag
  const navigate=useNavigate();

  useEffect(() => {
    if (!isSendingAttempted) {
      const sendOtp = async () => {
        setIsSendingAttempted(true); // Set the flag to true
        try {
          const {email}=getUserData();
          const response = await axios.post('https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/user/verify', {
            email,
          });

          if (response.status === 200) {
            toast.success('OTP sent successfully. Please check your email.');
            setIsOtpSent(true);
          }
        } catch (error) {
          if (error.status === 400) {
            toast.error('Email is required.');
          } else if (error.status === 401) {
            toast.error('No user found with this email.');
          } else if (error.status === 402) {
            toast.error('User already verified.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      sendOtp();
    }
  }, [isSendingAttempted]); // Dependency ensures it doesn't retrigger unnecessarily

const verifyOTP = async () => {
  setIsLoading(true);
  try {
    const {email}=getUserData();
    const response = await axios.put('https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/user/verify', {
      email,
      registerOtp: otp,
    });

    if (response.status === 200) {
      toast.success('OTP verified successfully');
      setUserData(email,response.data.name,response.data.token);  
      navigate("/");
    }
  } catch (error) {
    console.error(error);
    if (error.status === 400) {
      toast.error('No user found with this email');
    } else if (error.status === 401) {
      toast.error('User already verified');
    } else if (error.status === 402) {
      toast.error('Invalid OTP');
    }else if(error.status===403){
      toast.error('Enter a valid 6 digit otp')
    } else {
      toast.error('An error occurred while verifying the OTP');
    }
  } finally {
    setIsLoading(false);
    }
};

return (
  <div className="flex justify-center items-center h-screen bg-white">
    <div className="bg-violet-50 p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-3xl font-bold mb-4 text-violet-600">Verify OTP</h1>
      {isLoading ? (
        <p className="text-center text-violet-600 font-medium">Sending OTP...</p>
      ) : (
        <>
          {isOtpSent && (
            <>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-violet-600 font-medium mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-violet-400 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
              <button
                onClick={verifyOTP}
                disabled={isLoading}
                className={`bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-violet-500 focus:ring-2 w-full ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </>
          )}
        </>
      )}
    </div>
    <ToastContainer />
  </div>
);
};

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email format.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpview, setOtpview] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // Use the isLoggedIn state from useAuth

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // Redirect to Home page if already logged in
    }
  }, [isLoggedIn, navigate]);


  const validateField = (field, value) => {
    try {
      validationSchema.pick({ [field]: true }).parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: '' })); // Clear error if valid
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
    }
  };

  const handleSignup = async () => {
    try {
      const formData = { name, email, password };
      validationSchema.parse(formData); // Validate entire form before submitting

      setIsLoading(true);
      const response = await axios.post('https://vroomify-shubhampatel2305s-projects.vercel.app/api/v1/user/signup', formData);

      if (response.status === 201) {
        toast.success('Signup successful! Check your email for the OTP.');
        setUserData(email,'','')
        setIsLoading(false);
        navigateToOTPForm();
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        toast.error('Email already exists');
      } else if (error.response?.status === 401) {
        toast.error('Invalid request body');
      } else {
        toast.error('Internal server error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToOTPForm = () => {
    setOtpview(true);
  };

  return (
    <>
      {otpview ? (
        <OTPVerification />
      ) : (
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="bg-violet-50 p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-violet-600">Sign Up</h1>
            <div className="mb-4">
              <label htmlFor="name" className="block text-violet-600 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateField('name', e.target.value);
                }}
                onBlur={(e) => validateField('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.name ? 'border-red-500' : 'border-violet-400'
                } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-violet-600 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField('email', e.target.value);
                }}
                onBlur={(e) => validateField('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.email ? 'border-red-500' : 'border-violet-400'
                } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-violet-600 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField('password', e.target.value);
                }}
                onBlur={(e) => validateField('password', e.target.value)}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.password ? 'border-red-500' : 'border-violet-400'
                } focus:outline-none focus:ring-violet-500 focus:border-violet-500`}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className={`bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-violet-500 focus:ring-2 w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Loading...' : 'Sign Up'}
            </button>
            <p className="mt-4 text-sm text-center">
              Already signed up?{' '}
              <Link to="/signin" className="text-violet-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Signup;
