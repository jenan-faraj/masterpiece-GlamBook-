"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // مهم عشان الكوكي تنحفظ بالمتصفح
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      Swal.fire({
        title: "Success!",
        text: "Login successful! 🥳",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#a0714f",
      }).then((result) => {
        // سيتم تنفيذ هذه الكتلة فقط بعد أن يضغط المستخدم على زر التأكيد
        if (result.isConfirmed && res.ok) {
          navigate("/"); // Redirect to the home page or dashboard
          location.reload();
        }
      });
    } catch (err) {
      setError("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-amber-100">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-serif font-medium"
            style={{ color: "#B58152" }}
          >
            Welcome Back
          </h2>
          <p className="mt-2" style={{ color: "#c4a484" }}>
            Sign in to your salon account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#c4a484" }}
            >
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
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#c4a484" }}
            >
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
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
              style={{ backgroundColor: "#a0714f" }}
            >
              Sign In
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm" style={{ color: "#c4a484" }}>
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium"
                style={{ color: "#B58152" }}
              >
                Create account
              </a>
            </p>
            <a
              href="/forgot-password"
              className="block mt-2 text-sm font-medium"
              style={{ color: "#B58152" }}
            >
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
