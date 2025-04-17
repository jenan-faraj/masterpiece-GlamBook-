import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Import SweetAlert2
import Swal from 'sweetalert2';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      
      // Show success message with Sweet Alert
      Swal.fire({
        title: "Success!",
        text: "Registration successful! 🥳",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#a0714f"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
      
    } catch (error) {
      console.error("Error registering", error);
      
      // Show error message with Sweet Alert
      setError(error.response?.data?.message || "Registration failed");
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Registration failed, please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#a0714f"
      });
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-amber-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-medium" style={{ color: '#B58152' }}>Welcome</h2>
          <p className="mt-2" style={{ color: '#c4a484' }}>Create your account</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#c4a484' }}>
              Username
            </label>
            <input
              type="text"
              className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#c4a484' }}>
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#c4a484' }}>
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-medium shadow-md hover:opacity-90 transition duration-300"
              style={{ backgroundColor: '#a0714f' }}
            >
              Create Account
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm" style={{ color: '#c4a484' }}>
              Already have an account? <a href="/login" className="font-medium" style={{ color: '#B58152' }}>Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;