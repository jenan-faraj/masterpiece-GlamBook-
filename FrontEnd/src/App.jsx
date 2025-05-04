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
import UserProfile from "./Pages/userProfile";
import AdminSidebar from "./components/Dashboard/AdminSidebar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
// هاد الكمبوننت بنفصل فيه النافبار بناءً على المسار
const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/dashboard"];
  const hideFooterRoutes = ["/login", "/signup", "/dashboard"];

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
        <Route path="/aboutUs" element={<AboutPage />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/dashboard" element={<AdminSidebar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
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
