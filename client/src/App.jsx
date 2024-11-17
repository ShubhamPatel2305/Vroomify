import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import CreateCar from "./pages/CreateCar";
import Profile from "./pages/Profile";
import CarDetail from "./pages/CarDetail";

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/create-car" element={<CreateCar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/car/:id" element={<CarDetail />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
