import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

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
          const response = await axios.post('http://localhost:3001/api/v1/user/verify', {
            email: localStorage.getItem('email'),
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
    const response = await axios.put('http://localhost:3001/api/v1/user/verify', {
      email: localStorage.getItem('email'),
      registerOtp: otp,
    });

    if (response.status === 200) {
      toast.success('OTP verified successfully');
      localStorage.setItem('token', response.data.token);
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


const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpview, setOtpview]=useState(false)

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:3001/api/v1/user/signup', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success('Signup successful! Check your email for the OTP.');
        localStorage.setItem('email', email);
        setIsLoading(false);
        navigateToOTPForm();
      }
    } catch (error) {
      console.error(error);
      if (error.status === 400) {
        toast.error('Email already exists');
      } else if (error.status === 401) {
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

  return (<>
    {otpview?<OTPVerification />:  
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
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-violet-400 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-violet-600 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-violet-400 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-violet-600 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-violet-400 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          />
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
      </div>
      <ToastContainer />
    </div>
    }
    </>
  );
};

export default Signup;