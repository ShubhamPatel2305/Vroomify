import { useEffect, useCallback, useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearUserData, getUserData } from '../utils/TokenUtils';

const NavbarContainer = () => {
  const { checkAuthStatus } = useAuth();  
  let isLoggedIn=false;
  const {token, username}=getUserData();
  if(token && token!=''){
    isLoggedIn=true;
  }
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(() => {
    clearUserData();
    window.location.reload();
  }, [checkAuthStatus, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };

    checkAuth();
  }, [checkAuthStatus, location.pathname]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <Navbar
      isLoggedIn={isLoggedIn}
      username={username}
      onLogout={handleLogout}
    />
  );
};

export default NavbarContainer;