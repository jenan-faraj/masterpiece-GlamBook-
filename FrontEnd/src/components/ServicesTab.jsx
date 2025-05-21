import { useEffect, useState } from "react";
import axios from "axios";
import ServicePopup from "../components/ServicesPopup";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const ServicesTab = ({ user, salon }) => {
  const [showModal, setShowModal] = useState(false);
  const [service, setService] = useState({
    title: "",
    images: [],
    category: "",
    duration: "",
    shortDescription: "",
    longDescription: "",
    price: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [services, setServices] = useState(salon.services || []);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);

    const currentFiles = [...service.images, ...files];
    setService({ ...service, images: currentFiles });
  };

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedImages = [...service.images];

    URL.revokeObjectURL(previewImages[index]);

    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);

    setPreviewImages(updatedPreviews);
    setService({ ...service, images: updatedImages });
  };

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
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

        uploadedUrls.push(response.data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setUploading(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrls = await uploadImages(service.images);
      const newService = { ...service, images: imageUrls };
      const updatedServices = [...services, newService];
      const response = await axios.put(
        `http://localhost:3000/api/salons/${salon._id}`,
        { services: updatedServices }
      );

      setShowModal(false);
      setService({
        title: "",
        images: [],
        category: "",
        duration: "",
        shortDescription: "",
        longDescription: "",
        price: "",
      });
      setPreviewImages([]);
      setServices(updatedServices);
    } catch (error) {
      console.error("Error adding service:", error);

      Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء إضافة الخدمة",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#825c41",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsPopupOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استرجاع هذه الخدمة!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#825c41",
      confirmButtonText: "نعم، قم بالحذف!",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: "swal-rtl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/salons/${salon._id}/services/${serviceId}/delete`,
            {
              method: "PATCH",
            }
          );

          if (response.ok) {
            setServices(
              services.filter((service) => service._id !== serviceId)
            );

            Swal.fire({
              title: "تم الحذف!",
              text: "تم حذف الخدمة بنجاح",
              icon: "success",
              confirmButtonText: "حسناً",
              confirmButtonColor: "#825c41",
              customClass: {
                popup: "swal-rtl",
              },
            });
          }
        } catch (error) {
          console.error("Error deleting service:", error);

          Swal.fire({
            title: "خطأ!",
            text: "حدث خطأ أثناء حذف الخدمة",
            icon: "error",
            confirmButtonText: "حسناً",
            confirmButtonColor: "#825c41",
            customClass: {
              popup: "swal-rtl",
            },
          });
        }
      }
    });
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .swal-rtl {
        direction: rtl;
        text-align: right;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div dir="rtl">
      {" "}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000b9] bg-opacity-50 z-50 overflow-y-auto p-4">
          <div className="bg-[#f4e5d6]  max-h-[90vh] overflow-auto p-6 rounded-lg w-full max-w-lg shadow-xl border border-[#a0714f]">
            <div className="border-b border-[#a0714f] pb-3 mb-4">
              <h2 className="text-xl font-semibold text-[#8a5936] text-right">
                إضافة خدمة جديدة
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="عنوان الخدمة"
                  className="w-full p-3 border border-[#a0714f] rounded-lg bg-white text-[#8a5936] placeholder-[#a0714f] focus:outline-none focus:ring-1 focus:ring-[#8a5936]"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="border border-[#a0714f] rounded-lg p-4 bg-white">
                <label className="block text-sm font-medium text-[#8a5936] mb-2 text-right">
                  صور الخدمة
                </label>
                <div className="border-2 border-dashed border-[#a0714f] rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    <div className="text-[#8a5936] mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#a0714f"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="block mt-1">اضغط لرفع الصور</span>
                    </div>
                  </label>
                </div>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt={`معاينة ${index}`}
                          className="w-full h-24 object-cover rounded-lg border border-[#a0714f]"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-[#8a5936] text-[#f4e5d6] rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="category"
                    placeholder="الفئة"
                    className="w-full p-3 border border-[#a0714f] rounded-lg bg-white text-[#8a5936] placeholder-[#a0714f] focus:outline-none focus:ring-1 focus:ring-[#8a5936]"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="duration"
                    placeholder="المدة"
                    className="w-full p-3 border border-[#a0714f] rounded-lg bg-white text-[#8a5936] placeholder-[#a0714f] focus:outline-none focus:ring-1 focus:ring-[#8a5936]"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <textarea
                name="shortDescription"
                placeholder="وصف مختصر"
                className="w-full p-3 border border-[#a0714f] rounded-lg bg-white text-[#8a5936] placeholder-[#a0714f] focus:outline-none focus:ring-1 focus:ring-[#8a5936]"
                onChange={handleChange}
                required
              />

              <textarea
                name="longDescription"
                placeholder="وصف مفصل"
                className="w-full p-3 border border-[#a0714f] rounded-lg bg-white text-[#8a5936] placeholder-[#a0714f] focus:outline-none focus:ring-1 focus:ring-[#8a5936]"
                rows="4"
                onChange={handleChange}
                required
              />

              <div>
                <input
                  type="number"
                  name="price"
                  placeholder="السعر"
                  className="w-full p-3 border border-[#a0714f] rounded-lg bg-white text-[#8a5936] placeholder-[#a0714f] focus:outline-none focus:ring-1 focus:ring-[#8a5936]"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg border border-[#8a5936] text-[#8a5936] hover:bg-[#8a5936] hover:text-[#f4e5d6] transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-6 py-2 rounded-lg ${
                    uploading
                      ? "bg-[#a0714f]"
                      : "bg-[#8a5936] hover:bg-[#a0714f]"
                  } text-[#f4e5d6] transition-colors flex items-center`}
                >
                  {uploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
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
                      جاري الإضافة...
                    </>
                  ) : (
                    "إضافة الخدمة"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="bg-white flex justify-between m-5 items-center">
          <h2 className="text-4xl font-bold text-[#825c41] mb-3">خدماتنا</h2>
          {user.email === salon.email && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#825c41] hover:cursor-pointer hover:bg-[#a0714f] text-white px-4 py-2 rounded-md"
            >
              + إضافة خدمة
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services &&
            services
              .filter((service) => !service.isDeleted)
              .map((service, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
                >
                  {user.email === salon.email && (
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="absolute top-2 left-2 hover:cursor-pointer p-1 bg-red-600 rounded-2xl text-white hover:bg-red-700"
                      title="حذف الخدمة"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}

                  <div className="h-55 overflow-hidden rounded-md mb-4">
                    <img
                      onError={(e) => {
                        e.target.src =
                          "https://i.pinimg.com/736x/06/f1/e8/06f1e85337e93c10936339de6a38a922.jpg";
                      }}
                      onClick={() => handleServiceClick(service)}
                      src={service.images[0]}
                      alt={service.name}
                      className="w-full hover:cursor-pointer h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">
                    {service.title || "اسم الخدمة"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {service.shortDescription || "وصف الخدمة"}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-[var(--Logo-color)]">
                      د.أ {service.price || 100}
                    </span>
                  </div>
                </div>
              ))}

          {(!services ||
            services.filter((service) => !service.isDeleted).length === 0) && (
            <p className="text-gray-500 col-span-3 text-center py-10">
              لا توجد خدمات متاحة
            </p>
          )}
          <ServicePopup
            isOpen={isPopupOpen}
            onClose={closePopup}
            service={selectedService}
          />
        </div>
      </div>
    </div>
  );
};
export default ServicesTab;
