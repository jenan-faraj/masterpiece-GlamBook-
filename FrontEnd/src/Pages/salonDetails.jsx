import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Phone, Mail, Calendar, Camera } from "lucide-react";
import MapComponent from "../components/MapViue";
import ReviewsTab from "../components/ReviewsTab";
import AddServiceButton from "../components/ServicesTab";
import SalonSetting from "../components/SalonSetting";
import SalonInfo from "../components/SalonInfo";
import SpecialOffers from "../components/offers";
import SalonBookings from "../components/SalonBookings";
import Swal from "sweetalert2";

function SalonDetails() {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState(null);
  const [uploading, setUploading] = useState(false);

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
        Swal.fire({
          title: "خطأ!",
          text: "حدث خطأ أثناء جلب بيانات الصالون",
          icon: "error",
          confirmButtonText: "حسناً",
        });
      });
  }, [id]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("http://localhost:3000/get_token", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
            if (decodedToken.userId) {
              setUserId(decodedToken.userId);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        Swal.fire({
          title: "خطأ!",
          text: "حدث خطأ أثناء جلب بيانات المستخدم",
          icon: "error",
          confirmButtonText: "حسناً",
        });
      }
    };

    fetchToken();
  }, []);

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
      setUploading(true);
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
          // تحديث الصالون في قاعدة البيانات
          await axios.put(`http://localhost:3000/api/salons/${salon._id}`, {
            [fieldName]: response.data.url,
          });

          // تحديث الحالة المحلية
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
        <p className="text-2xl">جاري التحميل...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-red-500">
          حدث خطأ أثناء جلب تفاصيل الصالون.
        </p>
      </div>
    );

  return (
    <div dir="rtl" className="bg-gray-50 min-h-screen pb-12">
      {/* رأس الصفحة مع صورة الملف الشخصي */}
      <div className="relative h-90">
        {salon.bgImage ? (
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover bg-[var(--Logo-color)]"
              src={salon.bgImage}
              alt="خلفية"
            />
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

      {/* تبويب التنقل */}
      <div className="mx-6 md:mx-10 mb-4">
        <div className="flex justify-center lg:justify-start md:justify-between flex-wrap gap-1 lg:gap-2 border-b">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-6 py-3 font-medium ${
              activeTab === "services"
                ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                : "text-gray-500"
            }`}
          >
            الخدمات
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-6 py-3 font-medium ${
              activeTab === "offers"
                ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                : "text-gray-500"
            }`}
          >
            العروض الخاصة
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 font-medium ${
              activeTab === "reviews"
                ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                : "text-gray-500"
            }`}
          >
            التقييمات
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`px-6 py-3 font-medium ${
              activeTab === "location"
                ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                : "text-gray-500"
            }`}
          >
            الموقع
          </button>
          {user && user.email === salon.email && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 font-medium ${
                activeTab === "settings"
                  ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                  : "text-gray-500"
              }`}
            >
              الإعدادات
            </button>
          )}
          {user && user.email === salon.email && (
            <button
              onClick={() => setActiveTab("Bookings")}
              className={`px-6 py-3 font-medium ${
                activeTab === "Bookings"
                  ? "text-[var(--Logo-color)] border-b-2 border-[var(--Logo-color)]"
                  : "text-gray-500"
              }`}
            >
              الحجوزات
            </button>
          )}
        </div>
      </div>

      {/* محتوى التبويب */}
      <div className="mx-6 md:mx-10">
        {activeTab === "services" && (
          <AddServiceButton user={user} salon={salon} />
        )}

        {activeTab === "offers" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <SpecialOffers salon={salon} user={user} />
          </div>
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
                <div className="mt-4">
                  <h3 className="font-medium mb-2">ساعات العمل</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-700">الأحد - السبت</p>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        {salon.openingHours.open || "9:00"} صباحاً -{" "}
                        {salon.openingHours.close || "8:00 مساءً"}
                      </p>
                    </div>
                  </div>
                </div>
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
