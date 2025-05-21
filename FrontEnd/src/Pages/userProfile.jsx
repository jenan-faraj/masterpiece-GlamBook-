import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ProfileTab from "./../components/ProfileTab";
import BookingsTab from "./../components/BookingsTab";
import ReviewsTab from "./../components/ProfileReviewsTab";
import FavoritesTab from "./../components/FavoritesTab";
import ScrollToTopButton from "./../components/ScrollToTopButton";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    username: "",
    email: "",
    profileImage: "",
    favoriteList: [],
    reviews: [],
    book: [],
    role: "",
  });
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchfavorites = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/favorites", {
        withCredentials: true,
      });
      const favorites = response.data.filter((favorite) => !favorite.isDeleted);
      setFavorites(favorites);
    } catch (err) {
      console.error("فشل في جلب بيانات المفضلة", err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل في جلب بيانات المفضلة",
        confirmButtonText: "حسناً",
      });
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/me", {
        withCredentials: true,
      });
      setUser(response.data);

      // إذا كان المستخدم من نوع صالون، قم بتوجيهه مباشرة إلى صفحة الصالون
      if (response.data.role === "salon") {
        try {
          const salonsResponse = await axios.get(
            "http://localhost:3000/api/salons",
            {
              withCredentials: true,
            }
          );

          const matchedSalon = salonsResponse.data.find(
            (salon) => salon.email === response.data.email
          );

          if (matchedSalon) {
            navigate(`/salonDetails/${matchedSalon._id}`);
            return; // توقف عن تنفيذ باقي الكود
          } else {
            console.error("ما تم العثور على صالون بهالإيميل");
          }
        } catch (err) {
          console.error("فشل في جلب بيانات الصالونات", err);
        }
      }

      setLoading(false);
    } catch (err) {
      setError("فشل في جلب بيانات المستخدم");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchfavorites();
    fetchUserData();
  }, []);

  const onRemoveFavorite = async (salonId) => {
    const result = await Swal.fire({
      title: "هل أنت متأكدة؟",
      text: "هل تريدين إزالة هذا الصالون من المفضلة؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a0714f",
      confirmButtonText: "نعم، احذفيه",
      cancelButtonText: "تراجع",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/favorites/${salonId}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchfavorites();
      } catch (error) {
        console.error("خطأ:", error);
        await Swal.fire("خطأ!", "حدث خطأ أثناء الحذف.", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">جاري التحميل...</p>
      </div>
    );

  if (error) {
    navigate("/login");
  }

  if (user.role === "salon") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">جاري التوجيه إلى صفحة الصالون...</p>
      </div>
    );
  } else if (user.role === "admin") {
    navigate("/admin");
  }

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
            favoriteList={favorites}
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
          <FavoritesTab
            favorites={favorites}
            onRemoveFavorite={onRemoveFavorite}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
