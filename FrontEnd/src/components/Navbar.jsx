import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <ul className="flex space-x-4">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/logout">Logout</Link></li>
        <li><Link to="/RegisterSalon">RegisterSalon</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
