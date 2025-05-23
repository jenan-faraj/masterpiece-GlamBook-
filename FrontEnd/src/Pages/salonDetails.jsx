import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Phone, Mail, Camera, Heart } from "lucide-react";
import MapComponent from "../components/MapViue";
import ReviewsTab from "../components/ReviewsTab";
import AddServiceButton from "../components/ServicesTab";
import SalonSetting from "../components/SalonSetting";
import SalonInfo from "../components/SalonInfo";
import SpecialOffers from "../components/offers";
import SalonBookings from "../components/SalonBookings";
import Swal from "sweetalert2";
import ScrollToTopButton from "../components/ScrollToTopButton";
import NotFound from "../components/NotFound";

function SalonDetails() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [user, setUser] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/salons/${id}`)
      .then((response) => {
        setSalon(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/me", {
        withCredentials: true,
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching profile:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files[0];

    if (file) {
      Swal.fire({
        title: "جاري رفع الصورة...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

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

        if (response.data && response.data.url) {
          await axios.put(`http://localhost:3000/api/salons/${salon._id}`, {
            [fieldName]: response.data.url,
          });

          setSalon((prev) => ({
            ...prev,
            [fieldName]: response.data.url,
          }));

          Swal.fire({
            title: "تم!",
            text: "تم تحديث الصورة بنجاح",
            icon: "success",
            confirmButtonText: "حسناً",
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire({
          title: "خطأ!",
          text: "حدث خطأ أثناء رفع الصورة",
          icon: "error",
          confirmButtonText: "حسناً",
        });
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

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && salon) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/favorites",
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const isSalonFavorite = response.data.some(
            (favorite) =>
              favorite.salon._id === salon._id && !favorite.isDeleted
          );

          setIsFavorite(isSalonFavorite);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, salon]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:3000/api/favorites/${salon._id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setIsFavorite(false);
        setUser((prev) => ({
          ...prev,
          favoriteList:
            prev.favoriteList?.filter((id) => id !== salon._id) || [],
        }));
      } else {
        await axios.post(
          "http://localhost:3000/api/favorites",
          { salonId: salon._id },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setIsFavorite(true);
        setUser((prev) => ({
          ...prev,
          favoriteList: [...(prev.favoriteList || []), salon._id],
        }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Swal.fire({
        title: "خطأ!",
        text: error.response?.data?.message || "حدث خطأ أثناء تحديث المفضلة",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">جاري التحميل...</p>
      </div>
    );

  if (error) return <NotFound />;

  return (
    <div dir="rtl" className="bg-gray-50 min-h-screen pb-12">
      <ScrollToTopButton />
      <div className="relative h-90">
        {salon.bgImage ? (
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover bg-[var(--Logo-color)]"
              src={salon.bgImage}
              alt="خلفية"
            />
            {user && user.role === "user" && (
              <div
                className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
                onClick={handleToggleFavorite}
              >
                <Heart
                  size={20}
                  fill={isFavorite ? "red" : "white"}
                  color={isFavorite ? "red" : "gray"}
                />
              </div>
            )}
            {user && user.email === salon.email && (
              <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                <Camera
                  size={20}
                  className="text-[var(--Logo-color)]"
                  onClick={() => handleCameraClick("bgImage")}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full object-cover bg-[var(--Logo-color)] relative">
            {user && user.role === "user" && (
              <div
                className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
                onClick={handleToggleFavorite}
              >
                <Heart
                  size={20}
                  fill={isFavorite ? "red" : "white"}
                  color={isFavorite ? "red" : "gray"}
                />
              </div>
            )}
            {user && user.email === salon.email && (
              <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                <Camera
                  size={20}
                  className="text-[var(--Logo-color)]"
                  onClick={() => handleCameraClick("bgImage")}
                />
              </div>
            )}
          </div>
        )}
        <div className="absolute -bottom-16 right-10 bg-white rounded-full p-1 border-4 border-white shadow-lg h-32 w-32">
          <img
            src={
              salon.profileImage ||
              "https://i.pinimg.com/736x/f1/39/dc/f139dc89e5b1ad0818f612c7f33200a5.jpg"
            }
            alt={salon.name}
            className="w-full h-full object-cover rounded-full"
          />
          {user && user.email === salon.email && (
            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
              <Camera
                size={18}
                className="text-[var(--Logo-color)]"
                onClick={() => handleCameraClick("profileImage")}
              />
            </div>
          )}
        </div>
      </div>

      <SalonInfo salon={salon} user={user} />

      <div className="mx-6 md:mx-10 mb-4">
        <div className="flex justify-center lg:justify-start md:justify-between flex-wrap gap-1 lg:gap-2 border-b">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-6 py-3 font-medium text-xl ${
              activeTab === "services"
                ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                : "text-gray-500"
            }`}
          >
            الخدمات
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 font-medium text-xl ${
              activeTab === "reviews"
                ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                : "text-gray-500"
            }`}
          >
            التقييمات
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`px-6 py-3 font-medium text-xl ${
              activeTab === "location"
                ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                : "text-gray-500"
            }`}
          >
            الموقع
          </button>
          {user && user.email === salon.email && (
            <button
              onClick={() => setActiveTab("Bookings")}
              className={`px-6 py-3 font-medium text-xl ${
                activeTab === "Bookings"
                  ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                  : "text-gray-500"
              }`}
            >
              الحجوزات
            </button>
          )}
          {user && user.email === salon.email && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 font-medium text-xl ${
                activeTab === "settings"
                  ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                  : "text-gray-500"
              }`}
            >
              الإعدادات
            </button>
          )}
        </div>
      </div>

      <div className="mx-6 md:mx-10">
        {activeTab === "services" && (
          <AddServiceButton user={user} salon={salon} />
        )}

        {activeTab === "reviews" && <ReviewsTab />}

        {activeTab === "location" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">الموقع</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
              {<MapComponent location={salon.map} />}
            </div>
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="font-medium mb-2">العنوان</h3>
                <p className="text-gray-700">{salon.location}</p>
              </div>
              <div className="mt-6 md:mt-0">
                <h3 className="font-medium mb-2">معلومات الاتصال</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-700 mr-2" />
                    <span>{salon.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-700 mr-2" />
                    <span>{salon.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && user && user.email === salon.email && (
          <SalonSetting salon={salon} />
        )}

        {activeTab === "Bookings" && user && user.email === salon.email && (
          <SalonBookings salonId={id} />
        )}
      </div>
    </div>
  );
}

export default SalonDetails;
