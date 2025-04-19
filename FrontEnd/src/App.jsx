import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/LogIn";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import Categories from "./Pages/categories";
import SalonRegistrationForm from "./Pages/RegisterSalon";
import SalonDetails from "./Pages/salonDetails";
import Book from "./Pages/SalonBook";
import Payment from "./Pages/Payment";
import AboutPage from "./Pages/About";
import ContactUs from "./Pages/Contact";

// هاد الكمبوننت بنفصل فيه النافبار بناءً على المسار
const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/salonDetails/:id" element={<SalonDetails />} />
        <Route path="/RegisterSalon" element={<SalonRegistrationForm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/ContactUs" element={<ContactUs />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
