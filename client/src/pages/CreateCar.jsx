import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getUserData } from '../utils/TokenUtils';

const CreateCar = () => {
  const navigate = useNavigate();
  let isLoggedIn=false;
  const {token}=getUserData();
  if(token && token!=''){
    isLoggedIn=true;
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);


  return <div>
    <Navbar />
    
  </div>;
};

export default CreateCar;
