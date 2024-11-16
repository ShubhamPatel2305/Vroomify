import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';

const CreateCar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return <div>Loading...</div>; // Show a loading state while verifying auth
  }

  return <div>
    <Navbar />
    
  </div>;
};

export default CreateCar;
