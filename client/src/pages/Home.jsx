import { useAuth } from "../hooks/index";
import NavbarContainer from "../components/NavbarContainer";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn, username } = useAuth();

  return (
    <div>
      {/* Navbar */}
      <NavbarContainer />
      
      {/* Main Content */}
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        {isLoggedIn ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome back, {username}!
            </h1>
            {/* Call the Hero component for logged-in users */}
            <Hero />
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Please log in to start using the app.
            </h1>
            <Link
              to="/signin"
              className="text-violet-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
