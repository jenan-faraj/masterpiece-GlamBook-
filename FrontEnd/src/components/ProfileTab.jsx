import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Camera } from "lucide-react";

const ProfileTab = ({ user, setUser, favoriteList }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err) {
      console.error("Update error details:", err);
      setError(err.response?.data?.message || "فشل في تحديث الملف الشخصي");
      await Swal.fire(
        "خطأ!",
        err.response?.data?.message || "فشل في تحديث الملف الشخصي",
        "error"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files[0];

    if (file && user._id) {
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
          await axios.put(
            `http://localhost:3000/api/users/me/${user._id}`,
            { [fieldName]: response.data.url },
            { withCredentials: true }
          );

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

  if (uploading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="loader"></div>
          <p className="mt-4 text-gray-700">جاري تحميل الصورة...</p>
        </div>
      </div>
    );
  }

  return (
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
                onError={(e) => {
                  e.target.src =
                    "https://i.pinimg.com/736x/0f/0d/cf/0f0dcf270ec5184cdfdb9d424a1f8b43.jpg";
                }}
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

          <button
            className="bg-[#a0714f] hover:bg-[#8a5936] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow hover:shadow-md"
            onClick={() => setIsEditing(true)}
          >
            تعديل الملف الشخصي
          </button>

          <div className="flex justify-center gap-8 mt-8 w-full max-w-md">
            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg w-full">
              <span className="text-2xl font-bold text-[#a0714f]">
                {favoriteList?.length || 0}
              </span>
              <span className="text-sm text-gray-600">المفضلة</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg w-full">
              <span className="text-2xl font-bold text-[#a0714f]">
                {user.reviews?.filter((r) => !r.isDeleted).length || 0}
              </span>
              <span className="text-sm text-gray-600">التعليقات</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg w-full">
              <span className="text-2xl font-bold text-[#a0714f]">
                {user.book?.length || 0}
              </span>
              <span className="text-sm text-gray-600">الحجوزات</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            تعديل الملف الشخصي
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
                اسم المستخدم
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
                البريد الإلكتروني
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
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#a0714f] hover:bg-[#8a5936] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
