
// export default ExpressNailsBooking;
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Phone, Mail, Scissors, Calendar } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const MultiStepBookingForm = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    services: [],
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({});

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
      }
    };

    fetchToken();
  }, []);

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 2:
        if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب";
        if (!formData.phoneNumber) newErrors.phoneNumber = "رقم الهاتف مطلوب";
        if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب";
        break;
      case 3:
        if (formData.services.length === 0) {
          newErrors.services = "يرجى اختيار خدمة واحدة على الأقل";
        }
        break;
      case 4:
        if (!formData.date) newErrors.date = "يرجى اختيار التاريخ";
        if (!formData.time) newErrors.time = "يرجى اختيار الوقت";
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
    if (!userId) {
      alert("يرجى تسجيل الدخول لاكمال الحجز");
      return;
    }

    const bookingData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      salonId: id,
      userId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setCurrentStep(5);
      } else {
        const errorData = await response.json();
        alert(`فشل الحجز: ${errorData.message || "يرجى المحاولة مرة أخرى"}`);
      }
    } catch (error) {
      console.error("خطأ في حجز الموعد:", error);
      alert("حدث خطأ أثناء حجز الموعد");
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="relative">
            <div className="relative">
              <img
                src={salon.profileImage}
                alt="Salon"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white overflow-hidden">
                <img
                  src={salon.profileImage}
                  alt="Circular Salon Image"
                  className="w-48 h-48 object-cover"
                />
              </div>
            </div>

            <div className="p-4 bg-white rounded-b-lg">
              <div className="flex justify-between items-center mb-5">
                <span className="text-sm uppercase px-2 text-gray-500">
                  صالون
                </span>
                <span className="text-sm uppercase text-gray-500">
                  {salon.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                <span className="text-[var(--Logo-color)]">📍</span>
                <span>{salon.location}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                <span className="text-[var(--Logo-color)]">🕒</span>
                <span>
                  {salon.openingHours.open}AM - {salon.openingHours.close}PM
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                <span className="text-[var(--Logo-color)]">📞</span>
                <span>{salon.phone}</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-[var(--Logo-color)]">
              المعلومات الأساسية
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "fullName",
                  placeholder: "الاسم الكامل",
                  icon: User,
                  type: "text",
                },
                {
                  name: "phoneNumber",
                  placeholder: "رقم الهاتف",
                  icon: Phone,
                  type: "tel",
                },
                {
                  name: "email",
                  placeholder: "البريد الإلكتروني",
                  icon: Mail,
                  type: "email",
                },
              ].map(({ name, placeholder, icon: Icon, type }) => (
                <div key={name} className="relative">
                  <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Logo-color)]" />
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`w-full p-3 pr-10 border-2 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]
                      ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-[var(--Logo-color)]">
              اختر الخدمات
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {salon.services.map((service) => {
                const isChecked = formData.services.includes(service.name);
                return (
                  <label
                    key={service._id}
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition
                      ${
                        isChecked
                          ? "bg-[#fffaf5] border-[var(--Logo-color)]"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      name="services"
                      value={service.name}
                      checked={isChecked}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div>
                      <span
                        className={`block font-medium ${
                          isChecked
                            ? "text-[var(--Logo-color)]"
                            : "text-gray-700"
                        }`}
                      >
                        {service.name}
                      </span>
                      <span
                        className={`block text-sm ${
                          isChecked
                            ? "text-[var(--Logo-color)]"
                            : "text-gray-500"
                        }`}
                      >
                        {service.price} د.أ
                      </span>
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
              <p className="text-red-500 text-sm mt-2 text-center">
                {errors.services}
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-[var(--Logo-color)]">
              التاريخ والوقت
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-right mb-2 text-gray-700">
                  اختر التاريخ
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  className={`w-full p-3 border-2 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]
                    ${errors.date ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-right mb-2 text-gray-700">
                  اختر الوقت
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full p-3 border-2 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]
                    ${errors.time ? "border-red-500" : "border-gray-300"}`}
                >
                  <option>اختر الوقت</option>
                  <option value="10:00 صباحاً">10:00 صباحاً</option>
                  <option value="11:00 صباحاً">11:00 صباحاً</option>
                  <option value="12:00 ظهراً">12:00 ظهراً</option>
                  <option value="2:00 مساءً">2:00 مساءً</option>
                  <option value="3:00 مساءً">3:00 مساءً</option>
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="p-6 text-center">
            <div className="bg-[#fffaf5] border-2 border-[var(--button-color)] rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold mb-4 text-[var(--button-color)]">
                شكراً لحجزك!
              </h2>
              <p className="text-[var(--Logo-color)] mb-4 text-lg">
                تم تأكيد الموعد بنجاح
              </p>
              <div className="flex justify-center mb-4">
                <Calendar className="w-16 h-16 text-[var(--Logo-color)]" />
              </div>
              <div className="bg-white border border-[var(--button-color)] p-4 rounded-lg">
                <p className="text-[var(--Logo-color)]">
                  <strong>الموعد:</strong> {formData.date} - {formData.time}
                </p>
                <p className="text-[var(--Logo-color)]">
                  <strong>الخدمات:</strong> {formData.services.join(", ")}
                </p>
              </div>
              <Link to={"/"}>
                <button
                  onClick={currentStep === 4 ? handleSubmit : handleNextStep}
                  className="px-4 mt-5 hover:cursor-pointer hover:bg-[var(--button-color)] py-2 bg-[var(--Logo-color)] text-white rounded-lg"
                >
                  العود للصفحه الرئيسيه
                </button>
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderNavigation = () => {
    if (currentStep === 5) return null;

    return (
      <div className="flex justify-between p-4">
        {currentStep > 1 && (
          <button
            onClick={handlePrevStep}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
          >
            السابق
          </button>
        )}
        <button
          onClick={currentStep === 4 ? handleSubmit : handleNextStep}
          className="px-4 py-2 bg-[var(--Logo-color)] text-white rounded-lg"
        >
          {currentStep === 4 ? "تأكيد الحجز" : "التالي"}
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-screen h-screen flex justify-center items-center mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="w-200 mx-10 bg-white shadow-lg rounded-lg overflow-hidden">
        {renderStepContent()}
        {renderNavigation()}
      </div>
    </div>
  );
};

export default MultiStepBookingForm;
