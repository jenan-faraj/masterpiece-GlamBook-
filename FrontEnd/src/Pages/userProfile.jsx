// UserProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ProfileTab from "./../components/ProfileTab";
import BookingsTab from "./../components/BookingsTab";
import ReviewsTab from "./../components/ProfileReviewsTab";
import FavoritesTab from "./../components/FavoritesTab";
import ScrollToTopButton from "./../components/ScrollToTopButton";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    username: "",
    email: "",
    profileImage: "",
    favoriteList: [],
    reviews: [],
    book: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/me", {
        withCredentials: true,
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError("فشل في جلب بيانات المستخدم");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">جاري التحميل...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-red-500">
          حدث خطأ أثناء جلب بيانات المستخدم.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <ScrollToTopButton />
      <div dir="rtl" className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2 rounded-r-full hover:cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 hover:bg-[#eaceb6] text-gray-700"
          }`}
        >
          الملف الشخصي
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-6 py-2 hover:cursor-pointer ${
            activeTab === "bookings"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 hover:bg-[#eaceb6] text-gray-700"
          }`}
        >
          الحجوزات
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-2 hover:cursor-pointer ${
            activeTab === "reviews"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 hover:bg-[#eaceb6] text-gray-700"
          }`}
        >
          التقييمات
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-6 py-2 rounded-l-full hover:cursor-pointer ${
            activeTab === "favorites"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 hover:bg-[#eaceb6] text-gray-700"
          }`}
        >
          المفضلة
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            setUser={setUser}
            fetchUserData={fetchUserData}
          />
        )}
        {activeTab === "bookings" && (
          <BookingsTab
            bookings={user.book}
            fetchUserData={fetchUserData}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        )}
        {activeTab === "reviews" && (
          <ReviewsTab
            reviews={user.reviews.filter((review) => !review.isDeleted)}
            fetchUserData={fetchUserData}
          />
        )}
        {activeTab === "favorites" && (
          <FavoritesTab favorites={user.favoriteList} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
