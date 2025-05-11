import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  User,
  MapPin,
  Loader,
  Search,
  Filter,
  Mail,
  Phone,
  Image as ImageIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Info,
  ArrowLeft,
  PackageX,
  FileText,
  Scissors,
  FileCheck,
} from "lucide-react";

export default function SalonDetailsDash({
  selectedSalon,
  setShowDetailsModal,
}) {
  // Color palette
  const colors = {
    primary: "#8a5936", // Dark brown
    secondary: "#a0714f", // Medium brown
    light: "#c4a484", // Light brown
    background: "#f9f5f1", // Cream
    success: "#4caf50", // Green
    danger: "#f44336", // Red
    warning: "#ff9800", // Amber
    info: "#2196f3", // Blue
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Invalid date format:", error);
      return "غير متوفر";
    }
  };

  // Handle salon approval
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/salons/${id}`, {
        status: "Published",
      });

      setSalons(
        salons.map((salon) =>
          salon._id === id ? { ...salon, status: "Published" } : salon
        )
      );
    } catch (err) {
      console.error("Error approving salon:", err);
      alert("Failed to approve salon. Please try again.");
    }
  };

  // Handle salon rejection
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/salons/${id}`, {
        status: "Rejected",
      });

      setSalons(
        salons.map((salon) =>
          salon._id === id ? { ...salon, status: "Rejected" } : salon
        )
      );
    } catch (err) {
      console.error("Error rejecting salon:", err);
      alert("Failed to reject salon. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Modal content */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fadeIn">
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition duration-200 focus:outline-none"
            onClick={() => setShowDetailsModal(false)}
          >
            <span className="sr-only">إغلاق</span>
            <X className="h-6 w-6" />
          </button>

          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold"
                style={{ color: colors.primary }}
              >
                {selectedSalon.name || "تفاصيل الصالون"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                تاريخ التسجيل: {formatDate(selectedSalon.createdAt)}
              </p>
            </div>
          </div>

          {/* Modal body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                {/* Contact info */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                  <h4
                    className="text-base font-semibold mb-4 flex items-center"
                    style={{ color: colors.secondary }}
                  >
                    <User className="ml-2" size={18} />
                    معلومات الاتصال
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center py-1 border-b border-gray-100">
                      <User
                        className="ml-3"
                        size={16}
                        style={{ color: colors.light }}
                      />
                      <span className="font-medium ml-1">المالك:</span>
                      <span className="mr-2 text-gray-700">
                        {selectedSalon.ownerName || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center py-1 border-b border-gray-100">
                      <Mail
                        className="ml-3"
                        size={16}
                        style={{ color: colors.light }}
                      />
                      <span className="font-medium ml-1">
                        البريد الإلكتروني:
                      </span>
                      <span className="mr-2 text-gray-700">
                        {selectedSalon.email || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center py-1 border-b border-gray-100">
                      <Phone
                        className="ml-3"
                        size={16}
                        style={{ color: colors.light }}
                      />
                      <span className="font-medium ml-1">الهاتف:</span>
                      <span className="mr-2 text-gray-700">
                        {selectedSalon.phone || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center py-1">
                      <MapPin
                        className="ml-3"
                        size={16}
                        style={{ color: colors.light }}
                      />
                      <span className="font-medium ml-1">الموقع:</span>
                      <span className="mr-2 text-gray-700">
                        {selectedSalon.location || "غير متوفر"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                  <h4
                    className="text-base font-semibold mb-3 flex items-center"
                    style={{ color: colors.secondary }}
                  >
                    <FileText className="ml-2" size={18} />
                    وصف الصالون
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedSalon.longDescription || "لا يوجد وصف متاح"}
                  </p>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Gallery - صور الهوية */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                  <h4
                    className="text-base font-semibold mb-3 flex items-center"
                    style={{ color: colors.secondary }}
                  >
                    <ImageIcon className="ml-2" size={18} />
                    صور الهوية
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSalon.salonOwnershipImagePreview &&
                    selectedSalon.salonOwnershipImagePreview.length > 0 ? (
                      selectedSalon.salonOwnershipImagePreview.map(
                        (image, index) => (
                          <div
                            key={index}
                            className="relative group overflow-hidden rounded-lg"
                          >
                            <img
                              src={image}
                              alt={`صورة هوية ${index + 1}`}
                              className="h-28 w-full object-cover rounded-lg transform group-hover:scale-105 transition duration-300"
                              onClick={() => setEnlargedImage(image)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition duration-300 flex items-center justify-center">
                              <button
                                className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs transform translate-y-4 group-hover:translate-y-0 transition duration-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEnlargedImage(image);
                                }}
                              >
                                عرض الصورة
                              </button>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="col-span-2 h-28 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-sm">
                        <ImageOff size={20} className="mr-2" />
                        لا توجد صور متاحة
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery - شهادة مزاولة المهنة */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                  <h4
                    className="text-base font-semibold mb-3 flex items-center"
                    style={{ color: colors.secondary }}
                  >
                    <FileCheck className="ml-2" size={18} />
                    شهادة مزاولة المهنة
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {selectedSalon.identityImagePreview &&
                    selectedSalon.identityImagePreview.length > 0 ? (
                      selectedSalon.identityImagePreview.map((image, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg"
                        >
                          <img
                            src={image}
                            alt={`صورة شهادة ${index + 1}`}
                            className="h-28 w-full object-cover rounded-lg transform group-hover:scale-105 transition duration-300"
                            onClick={() => setEnlargedImage(image)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition duration-300 flex items-center justify-center">
                            <button
                              className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs transform translate-y-4 group-hover:translate-y-0 transition duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEnlargedImage(image);
                              }}
                            >
                              عرض الصورة
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 h-28 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-sm">
                        <ImageOff size={20} className="mr-2" />
                        لا توجد صور متاحة
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              {/* Services */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                <h4
                  className="text-base font-semibold mb-3 flex items-center"
                  style={{ color: colors.secondary }}
                >
                  <Scissors className="ml-2" size={18} />
                  الخدمات
                </h4>
                {selectedSalon.services && selectedSalon.services.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
                    {selectedSalon.services.map((service, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <h5
                            className="font-medium"
                            style={{ color: colors.primary }}
                          >
                            {service.title || "خدمة بدون اسم"}
                          </h5>
                          <span
                            className="font-bold text-sm px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${colors.secondary}20`,
                            }}
                          >
                            {service.price || 0} د.أ
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Clock size={14} className="ml-1" />
                          <span>{service.duration || 0} دقيقة</span>
                        </div>
                        {service.shortDescription && (
                          <p className="text-xs text-gray-600 mt-2 border-t border-gray-100 pt-2">
                            {service.shortDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center text-gray-400">
                    <PackageX size={24} className="mb-2" />
                    <p className="text-sm">لا توجد خدمات مسجلة</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
            <div className="flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                className="flex items-center justify-center text-white px-5 py-2 rounded-lg font-medium transition duration-300 hover:opacity-90 shadow-sm"
                style={{ backgroundColor: colors.secondary }}
                onClick={() => {
                  handleApprove(selectedSalon._id);
                  setShowDetailsModal(false);
                }}
                disabled={selectedSalon.status === "Published"}
              >
                <Check className="ml-2" size={16} />
                قبول الصالون
              </button>
              <button
                type="button"
                className="flex items-center justify-center text-white px-5 py-2 rounded-lg font-medium transition duration-300 hover:opacity-90 shadow-sm"
                style={{ backgroundColor: colors.danger }}
                onClick={() => {
                  handleReject(selectedSalon._id);
                  setShowDetailsModal(false);
                }}
                disabled={selectedSalon.status === "Rejected"}
              >
                <X className="ml-2" size={16} />
                رفض الصالون
              </button>
              <button
                type="button"
                className="flex items-center justify-center text-gray-700 px-5 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition duration-300"
                onClick={() => setShowDetailsModal(false)}
              >
                <ArrowLeft className="ml-2" size={16} />
                رجوع
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
