import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg w-80 p-6">
        <h2 className="text-2xl mb-4 text-center">الملف الشخصي</h2>
        <div className="mb-4">
          <p><strong>الاسم:</strong> {user.username}</p>
          <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
          <p><strong>الدور:</strong> {user.role}</p>
        </div>
        <button
          className="w-full bg-red-500 text-white p-2 rounded-md"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Profile;
