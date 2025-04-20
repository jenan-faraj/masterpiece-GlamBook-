import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera, Star } from "lucide-react";
import { toast } from "react-toastify"; // للتوست

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
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  // حالات التصفية
  const [dateFilter, setDateFilter] = useState("all"); // "all", "upcoming", "past"
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "canceled", "completed"

  // تنسيق التاريخ بشكل أكثر قابلية للقراءة
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ar-SA", options);
  };

  // تصفية الحجوزات بناءً على الفلاتر المحددة
  const filteredBookings = user.book?.filter((booking) => {
    // فلتر التاريخ
    const bookingDate = new Date(booking.date);
    const today = new Date();

    if (dateFilter === "upcoming" && bookingDate < today) return false;
    if (dateFilter === "past" && bookingDate >= today) return false;

    // فلتر الحالة
    if (
      statusFilter === "active" &&
      (booking.isCompleted || booking.isCanceled)
    )
      return false;
    if (statusFilter === "canceled" && !booking.isCanceled) return false;
    if (statusFilter === "completed" && !booking.isCompleted) return false;

    return true;
  });

  // افتراض أن بيانات المراجعة تحتوي على معلومات الصالون
  // في حالة عدم وجود بيانات الصالون في user.reviews، يجب جلبها من الخادم

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/me", {
        withCredentials: true,
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(
          `http://localhost:3000/api/bookings/cancel/${bookingId}`
        );

        if (response.data.success) {
          // Option 3: Reload data
          fetchUserData();

          // Show success message
          alert(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to cancel booking");
        alert(err.response?.data?.message || "Failed to cancel booking");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا التعليق؟")) {
      try {
        await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
        toast.success("تم حذف التعليق بنجاح");
        fetchUserData();
      } catch (err) {
        console.error("Error deleting review:", err);
        toast.error("فشل في حذف التعليق");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.put(
        `http://localhost:3000/api/users/me/${user._id}`,
        {
          username: user.username,
          email: user.email,
        },
        {
          withCredentials: true,
        }
      );
      setIsEditing(false);
      setUser((prev) => ({
        ...prev,
        username: user.username,
        email: user.email,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error("Update error details:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files[0];

    if (file && user._id) {
      // تأكد من وجود user._id
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data?.url) {
          // Update user in database
          await axios.put(
            `http://localhost:3000/api/users/me/${user._id}`,
            { [fieldName]: response.data.url },
            { withCredentials: true }
          );

          // Update local state
          setUser((prev) => ({
            ...prev,
            [fieldName]: response.data.url,
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCameraClick = (fieldName) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => handleImageUpload(e, fieldName);
    fileInput.click();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-red-500">Error fetching salon details.</p>
      </div>
    );

  const renderProfileTab = () => (
    <div className="w-full">
      {!isEditing ? (
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="bg-white rounded-full p-1 border-4 border-white shadow-lg h-32 w-32 overflow-hidden">
              <img
                src={
                  user.profileImage ||
                  "https://i.pinimg.com/736x/f1/39/dc/f139dc89e5b1ad0818f612c7f33200a5.jpg"
                }
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer transition-all duration-300 ">
              <Camera
                size={18}
                className="text-[#a0714f] hover:text-[#8a5936]"
                onClick={() => handleCameraClick("profileImage")}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-1">
            {user.username}
          </h2>
          <p className="text-gray-600 mb-1">{user.email}</p>
          <p className="text-gray-500 text-sm mb-6">
            Account type: {user.role}
          </p>

          <button
            className="bg-[#a0714f] hover:bg-[#8a5936] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow hover:shadow-md"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>

          <div className="flex justify-center gap-8 mt-8 w-full max-w-md">
            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg w-full">
              <span className="text-2xl font-bold text-[#a0714f]">
                {user.favoriteList?.length || 0}
              </span>
              <span className="text-sm text-gray-600">Favorites</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg w-full">
              <span className="text-2xl font-bold text-[#a0714f]">
                {reviews?.length || 0}
              </span>
              <span className="text-sm text-gray-600">Reviews</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg w-full">
              <span className="text-2xl font-bold text-[#a0714f]">
                {user.book?.length || 0}
              </span>
              <span className="text-sm text-gray-600">Bookings</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Edit Profile
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0714f] focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0714f] focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#a0714f] hover:bg-[#8a5936] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  const renderBookingsTab = () => {
    // Format date to a more readable format
    const formatDate = (dateString) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="py-8 px-4" dir="rtl">
        <h2 className="text-2xl font-bold mb-6 text-center text-amber-800">
          حجوزاتك
        </h2>
  
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
  
        {/* أدوات التصفية */}
        <div className="max-w-2xl mx-auto mb-6 bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h3 className="text-amber-800 font-semibold mb-3 text-center">تصفية الحجوزات</h3>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <label htmlFor="dateFilter" className="text-sm font-medium text-amber-800">التاريخ:</label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-amber-200 rounded-md text-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="all">جميع المواعيد</option>
                <option value="upcoming">المواعيد القادمة</option>
                <option value="past">المواعيد السابقة</option>
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <label htmlFor="statusFilter" className="text-sm font-medium text-amber-800">الحالة:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-amber-200 rounded-md text-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="completed">مكتمل</option>
                <option value="canceled">ملغي</option>
              </select>
            </div>
            
            {(dateFilter !== "all" || statusFilter !== "all") && (
              <button 
                onClick={() => {setDateFilter("all"); setStatusFilter("all");}} 
                className="text-sm px-4 py-2 rounded-md bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                إزالة الفلاتر
              </button>
            )}
          </div>
        </div>
  
        {user.book?.length ? (
          <div className="space-y-5 max-w-2xl mx-auto">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-amber-200 rounded-lg p-5 shadow-md bg-white"
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-amber-800">
                        {booking.services.join(", ")}
                      </h3>
                      <div className="mt-3 space-y-1 text-gray-700">
                        <p className="flex items-center">
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {formatDate(booking.date)}
                        </p>
                        <p className="flex items-center">
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {booking.time}
                        </p>
                      </div>
                    </div>
  
                    <div>
                      {booking.isCompleted && (
                        <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                          مكتمل
                        </span>
                      )}
                      {booking.isCanceled && (
                        <span className="bg-red-50 text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                          ملغي
                        </span>
                      )}
                      {!booking.isCompleted && !booking.isCanceled && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300">
                          قادم
                        </span>
                      )}
                    </div>
                  </div>
  
                  {!booking.isCompleted && !booking.isCanceled && (
                    <div className="flex justify-start mt-4 space-x-reverse space-x-3">
                      <button className="text-sm px-4 py-2 rounded-full flex items-center bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        إعادة جدولة
                      </button>
                      <button
                        className="text-sm px-4 py-2 rounded-full flex items-center bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <svg
                            className="animate-spin h-4 w-4 ml-1"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        )}
                        {loading ? "جاري الإلغاء..." : "إلغاء"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-amber-200 shadow-md">
                <svg className="w-12 h-12 mx-auto text-amber-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-600 mb-3">لا توجد حجوزات تطابق عوامل التصفية المحددة.</p>
                <button onClick={() => {setDateFilter("all"); setStatusFilter("all");}} className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md transition-colors">
                  عرض جميع الحجوزات
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg border border-amber-200 shadow-md">
            <svg className="w-12 h-12 mx-auto text-amber-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-gray-600 mb-3">ليس لديك أي حجوزات بعد.</p>
            <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md transition-colors">
              حجز خدمة جديدة
            </button>
          </div>
        )}
      </div>
    );
  };

  const reviews = user.reviews.filter((review) => !review.isDeleted);

  const renderReviewsTab = () => {
    return (
      <div dir="rtl" className="py-6 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          مراجعاتك
        </h2>

        {reviews?.length ? (
          <ul className="space-y-6">
            {reviews.map((review, index) => (
              <li
                key={index}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                    <span className="text-gray-500 text-sm mr-2">
                      ({review.rating.toFixed(1)})
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>

                <p
                  className={`text-gray-700 text-justify ${
                    expandedReviews[review._id] ? "" : "line-clamp-2"
                  }`}
                >
                  {review.text}
                </p>

                {review.text.length > 100 && (
                  <button
                    onClick={() => toggleReviewExpansion(review._id)}
                    className="text-blue-500 hover:text-blue-700 text-xs mt-1 focus:outline-none"
                  >
                    {expandedReviews[review._id] ? "عرض أقل" : "عرض المزيد"}
                  </button>
                )}

                <div className="mt-4 pt-3 flex justify-between items-center border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    <span className="font-medium">الصالون: </span>
                    {review.salonId.name || "غير معروف"}
                  </span>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">لم تقم بكتابة أي مراجعات بعد.</p>
          </div>
        )}
      </div>
    );
  };

  const renderFavoritesTab = () => (
    <div className="text-center py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Favorites</h2>
      {user.favoriteList?.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {user.favoriteList.map((fav, index) => (
            <li
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-md text-left"
            >
              {typeof fav === "string" ? fav : JSON.stringify(fav)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have no favorite items yet.</p>
      )}
    </div>
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2 rounded-l-full ${
            activeTab === "profile"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-6 py-2 ${
            activeTab === "bookings"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-2 ${
            activeTab === "reviews"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-6 py-2 rounded-r-full ${
            activeTab === "favorites"
              ? "bg-[#a0714f] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Favorites
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "bookings" && renderBookingsTab()}
        {activeTab === "reviews" && renderReviewsTab()}
        {activeTab === "favorites" && renderFavoritesTab()}
      </div>
    </div>
  );
};

export default UserProfile;
