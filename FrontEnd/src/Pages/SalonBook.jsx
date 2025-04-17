import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Scissors,
  Calendar,
  Check,
  Clock,
  Trash,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    services: [],
    date: "",
    time: "",
    userId: "",
    salonId: id,
    isCanceled: false,
    isCompleted: false,
    isDeleted: false,
  });
  const [errors, setErrors] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Fetch salon details
    const fetchSalon = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/salons/${id}`
        );
        setSalon(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    // Fetch user authentication
    const fetchUserAuth = async () => {
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
              setFormData((prev) => ({ ...prev, userId: decodedToken.userId }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchSalon();
    fetchUserAuth();
  }, [id]);

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Skip validation for salon info page
        break;
      case 2: // User info validation - handled by server through userId
        if (!userId) {
          newErrors.user = "يرجى تسجيل الدخول لإكمال الحجز";
        }
        break;
      case 3:
        if (formData.services.length === 0) {
          newErrors.services = "يرجى اختيار خدمة واحدة على الأقل";
        }
        break;
      case 4:
        if (!formData.date) {
          newErrors.date = "يرجى اختيار التاريخ";
        }
        if (!formData.time) {
          newErrors.time = "يرجى اختيار الوقت";
        } else if (!/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(formData.time)) {
          newErrors.time = "يجب أن يكون الوقت بتنسيق HH:MM AM/PM";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter((service) => service !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    if (!userId) {
      alert("يرجى تسجيل الدخول لإكمال الحجز");
      return;
    }

    // Format time to match schema requirements
    const formattedTime = formData.time.replace(" ", ""); // Remove space if any

    // Format date to ISO string
    const bookingDate = new Date(formData.date);

    const bookingData = {
      ...formData,
      date: bookingDate.toISOString(),
      time: formattedTime,
      salonId: id,
      userId: userId,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/bookings",
        bookingData
      );
      console.log("Booking response:", bookingData);
      if (response.status === 201 || response.status === 200) {
        setBookingSuccess(true);
        setCurrentStep(5);
        console.log("Booking successful:", response.data);
      }
    } catch (error) {
      console.error("خطأ في حجز الموعد:", error);
      alert(error.response?.data?.message || "حدث خطأ أثناء حجز الموعد");
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const formatTimeForDisplay = (time) => {
    // Time comes in as "10:00AM" and we want to display as "10:00 صباحاً"
    if (!time) return "";

    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = timeRegex.exec(time);

    if (!match) return time;

    const [_, hours, minutes, period] = match;
    const arabicPeriod = period.toLowerCase() === "am" ? "صباحاً" : "مساءً";

    return `${hours}:${minutes} ${arabicPeriod}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[var(--Logo-color)] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <Trash className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">
            لم نتمكن من تحميل بيانات الصالون. يرجى المحاولة مرة أخرى.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[var(--Logo-color)] text-white rounded-lg hover:bg-[var(--button-color)] transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              <img
                src={salon.profileImage}
                alt={salon.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
              <div className="absolute bottom-4 right-4 text-white">
                <h2 className="text-2xl font-bold">{salon.name}</h2>
                <p className="text-sm opacity-90">{salon.location}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-[var(--Logo-color)] text-center border-b pb-2">
                معلومات الصالون
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-[var(--Logo-color)]/10 rounded-full mr-3">
                    <Clock className="w-5 h-5 text-[var(--Logo-color)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ساعات العمل</p>
                    <p className="font-medium">
                      {salon.openingHours.open}AM - {salon.openingHours.close}PM
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-[var(--Logo-color)]/10 rounded-full mr-3">
                    <Phone className="w-5 h-5 text-[var(--Logo-color)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-medium dir-ltr">{salon.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--Logo-color)]/5 p-4 rounded-lg">
                <p className="text-sm text-center">
                  لحجز موعد في هذا الصالون، يرجى النقر على زر "التالي" للمتابعة
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--Logo-color)]">
              التحقق من الحساب
            </h2>

            {userId ? (
              <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg">
                <Check className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-lg font-medium text-green-700">
                  تم تسجيل الدخول بنجاح
                </p>
                <p className="text-sm text-green-600 mt-2">
                  يمكنك المتابعة لاختيار الخدمات
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-lg">
                  <User className="w-12 h-12 text-yellow-500 mb-4" />
                  <p className="text-lg font-medium text-yellow-700">
                    يرجى تسجيل الدخول لإكمال الحجز
                  </p>
                  <p className="text-sm text-yellow-600 mt-2">
                    لا يمكن إكمال الحجز بدون تسجيل الدخول
                  </p>
                </div>

                <div className="flex justify-center mt-4">
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-[var(--Logo-color)] text-white rounded-lg hover:bg-[var(--button-color)] transition-colors"
                  >
                    انتقل لتسجيل الدخول
                  </Link>
                </div>
              </div>
            )}

            {errors.user && (
              <p className="text-red-500 text-sm mt-4 text-center">
                {errors.user}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--Logo-color)]">
              اختر الخدمات
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {salon.services.map((service) => {
                const isChecked = formData.services.includes(service.title);
                return (
                  <label
                    key={service._id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition
                      ${
                        isChecked
                          ? "bg-[var(--Logo-color)]/10 border-[var(--Logo-color)]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <input
                      type="checkbox"
                      name="services"
                      value={service.title}
                      checked={isChecked}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 mr-3 rounded flex items-center justify-center
                        ${
                          isChecked
                            ? "bg-[var(--Logo-color)] text-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800">
                          {service.title}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {service.price} د.أ
                        </span>
                      </div>
                    </div>
                    <Scissors
                      className={`w-5 h-5 ${
                        isChecked ? "text-[var(--Logo-color)]" : "text-gray-400"
                      }`}
                    />
                  </label>
                );
              })}
            </div>

            {errors.services && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-red-600 text-sm text-center">
                  {errors.services}
                </p>
              </div>
            )}

            {formData.services.length > 0 && (
              <div className="bg-[var(--Logo-color)]/5 p-4 rounded-lg mt-4">
                <h3 className="font-medium text-center mb-2">
                  الخدمات المختارة
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {formData.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-white px-3 py-1 rounded-full text-sm border border-[var(--Logo-color)]/30 text-[var(--Logo-color)]"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--Logo-color)]">
              اختر التاريخ والوقت
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  التاريخ
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Logo-color)]" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    className={`w-full p-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]
                      ${errors.date ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">الوقت</label>
                <div className="relative">
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Logo-color)]" />
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full p-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]
                      ${errors.time ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">اختر الوقت</option>
                    <option value="10:00AM">10:00 صباحاً</option>
                    <option value="11:00AM">11:00 صباحاً</option>
                    <option value="12:00PM">12:00 ظهراً</option>
                    <option value="2:00PM">2:00 مساءً</option>
                    <option value="3:00PM">3:00 مساءً</option>
                    <option value="4:00PM">4:00 مساءً</option>
                  </select>
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm">{errors.time}</p>
                )}
              </div>
            </div>

            {formData.date && formData.time && (
              <div className="mt-6 p-4 bg-[var(--Logo-color)]/5 rounded-lg">
                <h3 className="font-medium text-center mb-3">ملخص الحجز</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-md border border-[var(--Logo-color)]/20">
                    <p className="text-sm text-gray-500">التاريخ</p>
                    <p className="font-medium">
                      {new Date(formData.date).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-[var(--Logo-color)]/20">
                    <p className="text-sm text-gray-500">الوقت</p>
                    <p className="font-medium">
                      {formatTimeForDisplay(formData.time)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-[var(--Logo-color)]">
              تم تأكيد حجزك بنجاح!
            </h2>

            <p className="text-gray-600 mb-6">
              سيتم إرسال تفاصيل الموعد إلى بريدك الإلكتروني
            </p>

            <div className="bg-[var(--Logo-color)]/5 p-6 rounded-lg mb-6">
              <h3 className="font-medium mb-4 text-lg">تفاصيل الحجز</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[var(--Logo-color)]/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500">الصالون</span>
                    <span className="font-medium">{salon.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500">التاريخ</span>
                    <span className="font-medium">
                      {new Date(formData.date).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500">الوقت</span>
                    <span className="font-medium">
                      {formatTimeForDisplay(formData.time)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-500 mb-2">الخدمات</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service, index) => (
                        <span
                          key={index}
                          className="bg-[var(--Logo-color)]/10 px-3 py-1 rounded-full text-sm text-[var(--Logo-color)]"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <Link
                to="/"
                className="px-6 py-3 bg-[var(--Logo-color)] text-white rounded-lg hover:bg-[var(--button-color)] transition-colors"
              >
                العودة للصفحة الرئيسية
              </Link>
              <Link
                to="/bookings"
                className="px-6 py-3 bg-white border border-[var(--Logo-color)] text-[var(--Logo-color)] rounded-lg hover:bg-gray-50 transition-colors"
              >
                عرض الحجوزات
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: "معلومات الصالون" },
      { number: 2, label: "التحقق" },
      { number: 3, label: "الخدمات" },
      { number: 4, label: "الموعد" },
      { number: 5, label: "التأكيد" },
    ];

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${
                    currentStep >= step.number
                      ? "bg-[var(--Logo-color)] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  currentStep >= step.number
                    ? "text-[var(--Logo-color)]"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 h-1 bg-[var(--Logo-color)]"
            style={{ width: `${(currentStep - 1) * 25}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    if (currentStep === 5) return null;

    return (
      <div className="flex justify-between p-4 mt-6">
        {currentStep > 1 && (
          <button
            onClick={handlePrevStep}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            السابق
          </button>
        )}
        <button
          onClick={currentStep === 4 ? handleSubmit : handleNextStep}
          disabled={currentStep === 2 && !userId}
          className={`px-6 py-2 bg-[var(--Logo-color)] text-white rounded-lg hover:bg-[var(--button-color)] transition-colors
            ${
              currentStep === 2 && !userId
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        >
          {currentStep === 4 ? "تأكيد الحجز" : "التالي"}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {renderProgressBar()}
        {renderStepContent()}
        {renderNavigation()}
      </div>
    </div>
  );
};

export default BookingForm;
