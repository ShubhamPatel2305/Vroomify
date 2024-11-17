import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // New state
  const [username, setUsername] = useState('');

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (token && storedUsername) {
      try {
        const response = await axios.get('/api/verifytoken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsLoggedIn(true);
          setUsername(storedUsername);
        } else {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsLoggedIn(false);
        setUsername('');
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }

    setIsAuthLoading(false); // Set loading to false after verification
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return { isLoggedIn, isAuthLoading, username, checkAuthStatus };
};


  export {
    useAuth
  }