import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <Router>
      <Navbar />
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
      </Routes>
    </Router>
  );
};

export default App;
