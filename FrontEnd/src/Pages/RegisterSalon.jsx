import { useState, useEffect } from "react";

export default function SalonRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    salonOwnershipImages: [],
    identityImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  // Preview images for UI display
  const [previewImages, setPreviewImages] = useState({
    salonOwnershipImages: [],
    identityImages: [],
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all preview URLs
      Object.values(previewImages)
        .flat()
        .forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });
    };
  }, [previewImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      // Create preview URLs for the images
      const newPreviewImages = files.map((file) => URL.createObjectURL(file));

      // Update preview images for UI display
      setPreviewImages((prevPreviews) => ({
        ...prevPreviews,
        [name]: [...prevPreviews[name], ...newPreviewImages],
      }));

      // Store the file objects for upload
      setFormData((prevData) => ({
        ...prevData,
        [name]: [...prevData[name], ...files],
      }));
    }
  };

  const removeImage = (type, index) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[type][index]);

    // Remove the image from previews and formData
    setPreviewImages((prevPreviews) => ({
      ...prevPreviews,
      [type]: prevPreviews[type].filter((_, i) => i !== index),
    }));

    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index),
    }));
  };

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error("خطأ في رفع الصورة:", error);
      }
    }

    setUploading(false);
    return uploadedUrls;
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const goToHomePage = () => {
    // Replace with your actual homepage navigation logic
    window.location.href = "/";
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.name.trim() !== "" &&
        formData.ownerName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== ""
      );
    } else if (currentStep === 2) {
      return formData.phone.trim() !== "" && formData.location.trim() !== "";
    } else if (currentStep === 3) {
      return (
        formData.salonOwnershipImages.length > 0 &&
        formData.identityImages.length > 0
      );
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // التحقق من وجود الصور المطلوبة
    if (formData.salonOwnershipImages.length === 0) {
      setMessage({
        text: "يجب إرفاق صور إثبات ملكية الصالون",
        type: "error",
      });
      setLoading(false);
      return;
    }

    if (formData.identityImages.length === 0) {
      setMessage({
        text: "يجب إرفاق صور إثبات الهوية",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      setUploading(true);
      // أولا: رفع جميع الصور
      const salonOwnershipUrls = await uploadImages(
        formData.salonOwnershipImages
      );
      const identityImageUrls = await uploadImages(formData.identityImages);
      setUploading(false);

      // التحقق من نجاح رفع الصور
      if (salonOwnershipUrls.length === 0 || identityImageUrls.length === 0) {
        setMessage({
          text: "حدث خطأ أثناء رفع الصور، يرجى المحاولة مرة أخرى",
          type: "error",
        });
        setLoading(false);
        return;
      }

      // تجهيز بيانات النموذج مع روابط الصور المرفوعة
      const submitData = {
        name: formData.name,
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        salonOwnershipImagePreview: salonOwnershipUrls,
        identityImagePreview: identityImageUrls,
      };

      console.log("تقديم بيانات النموذج", submitData);

      // إرسال البيانات للخادم
      const response = await fetch("http://localhost:3000/api/salons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setMessage({ text: "تم تسجيل الصالون بنجاح!", type: "success" });
        setRegistrationCompleted(true);

        // إعادة تعيين النموذج بعد التقديم الناجح
        setFormData({
          name: "",
          ownerName: "",
          email: "",
          password: "",
          phone: "",
          location: "",
          salonOwnershipImages: [],
          identityImages: [],
        });

        setPreviewImages({
          salonOwnershipImages: [],
          identityImages: [],
        });
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || "فشل في التسجيل",
          type: "error",
        });
      }
    } catch (error) {
      console.error("خطأ:", error);
      setMessage({
        text: "حدث خطأ أثناء التسجيل",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show success message and home button if registration completed
  if (registrationCompleted) {
    return (
      <div
        className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8"
        dir="rtl"
      >
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              تم إرسال طلب التسجيل بنجاح!
            </h2>
            <p className="text-gray-600 mb-6">
              تم إرسال معلومات الصالون الخاص بك وهي الآن بانتظار موافقة مدير
              الموقع. سنقوم بإعلامك فور الموافقة على طلبك.
            </p>
            <button
              onClick={goToHomePage}
              className="w-full py-2 px-4 bg-[var(--button-color)] text-white font-semibold rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
            >
              العودة إلى الصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4 text-right">
              معلومات الصالون الأساسية
            </h3>
            {/* Salon Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
              >
                اسم الصالون
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--button-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                placeholder="أدخل اسم الصالون"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label
                htmlFor="ownerName"
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
              >
                اسم المالك
              </label>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                value={formData.ownerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--button-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                placeholder="أدخل الاسم الكامل للمالك"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--button-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                placeholder="example@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
              >
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--button-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                placeholder="أدخل كلمة مرور آمنة"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={nextStep}
                disabled={!isCurrentStepValid()}
                className={`w-full py-2 px-4 rounded-md font-semibold shadow-sm focus:outline-none focus:ring-2 ${
                  isCurrentStepValid()
                    ? "bg-[var(--button-color)] text-white hover:bg-opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4 text-right">
              معلومات الاتصال والموقع
            </h3>
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
              >
                رقم الهاتف
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--button-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1 text-right"
              >
                موقع الصالون
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--button-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                placeholder="أدخل موقع الصالون"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 border border-[var(--button-color)] rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-[var(--button-color)] text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
              >
                التالي
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4 text-right">
              المستندات والإثباتات
            </h3>
            {/* Image Uploads */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                صور إثبات مزاولة المهنة<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                name="salonOwnershipImages"
                onChange={handleFileChange}
                className="w-full text-sm text-right"
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                مطلوب: يرجى إرفاق مستندات تثبت ملكية الصالون
              </p>
              {previewImages.salonOwnershipImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 justify-end">
                  {previewImages.salonOwnershipImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`salon-ownership-preview-${index}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeImage("salonOwnershipImages", index)
                        }
                        className="absolute top-0 right-0 text-red-500 bg-white p-1 rounded-full"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                صور إثبات الهوية <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                name="identityImages"
                onChange={handleFileChange}
                className="w-full text-sm text-right"
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                مطلوب: يرجى إرفاق صورة هوية سارية المفعول
              </p>
              {previewImages.identityImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 justify-end">
                  {previewImages.identityImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`identity-image-preview-${index}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("identityImages", index)}
                        className="absolute top-0 right-0 text-red-500 bg-white p-1 rounded-full"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 border border-[var(--button-color)] rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
              >
                السابق
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="py-2 px-4 bg-[var(--button-color)] text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
              >
                {loading || uploading ? (
                  <div className="flex items-center justify-center">
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
                    {uploading ? "جاري رفع الصور..." : "جاري المعالجة..."}
                  </div>
                ) : (
                  "تسجيل الصالون"
                )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--button-color)]">
              تسجيل صالون جديد
            </h2>
            <p className="mt-2 text-gray-600">
              أدخل بيانات صالونك للتسجيل على منصتنا
            </p>
          </div>

          {message.text && (
            <div
              className={`p-4 mb-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      currentStep >= step
                        ? "bg-[var(--button-color)] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs mt-1">
                    {step === 1
                      ? "المعلومات الأساسية"
                      : step === 2
                      ? "الاتصال"
                      : "المستندات"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <div className="h-1 w-full bg-gray-200 rounded">
                <div
                  className="h-1 bg-[var(--button-color)] rounded"
                  style={{
                    width: `${((currentStep - 1) / 2) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>{renderStep()}</form>
        </div>
      </div>
    </div>
  );
}
