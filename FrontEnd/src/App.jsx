import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/LogIn";
import Register from "./components/Register";
import Home from "./components/Home";
import Logout from "./components/Logout";
import RegisterSalon from "./Pages/RegisterSalon";

function App() {
  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/RegisterSalon" element={<RegisterSalon />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
