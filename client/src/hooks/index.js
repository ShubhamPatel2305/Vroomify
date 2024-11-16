import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
  
    const checkAuthStatus = useCallback(async () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
  
      if (token && storedUsername) {
        try {
          const response = await axios.get('/api/verifytoken', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
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
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    }, []);
  
    useEffect(() => {
      checkAuthStatus();
    }, [checkAuthStatus]);
  
    return { isLoggedIn, username, checkAuthStatus };
  };

  export {
    useAuth
  }