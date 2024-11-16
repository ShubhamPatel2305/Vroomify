import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import CreateCar from "./pages/CreateCar";

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/create-car" element={<CreateCar />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
