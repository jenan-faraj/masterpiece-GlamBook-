import { useState, useEffect } from "react";
import axios from "axios";
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

export default function SalonDashboard() {
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [salonsPerPage, setSalonsPerPage] = useState(10);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

  // Fetch salons data
  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("http://localhost:3000/api/salons");

        const processedSalons = response.data.map((salon) => ({
          ...salon,
          services: salon.services || [],
          daysOpen: salon.daysOpen || [],
          images: salon.images || [],
          status: salon.status || "Pending",
          createdAt: salon.createdAt || new Date().toISOString(),
        }));

        setSalons(processedSalons);
        setFilteredSalons(processedSalons);
        setError(null);
      } catch (err) {
        console.error("Error fetching salons:", err);
        setError("Failed to load salons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  // Filter salons
  useEffect(() => {
    let result = [...salons];

    if (searchTerm) {
      result = result.filter(
        (salon) =>
          (salon.name &&
            salon.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (salon.ownerName &&
            salon.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (salon.location &&
            salon.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (salon.email &&
            salon.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (salon.phone &&
            salon.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((salon) => salon.status === statusFilter);
    }

    setFilteredSalons(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, salons]);

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

  // Get status badge styling
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return `bg-amber-100 text-amber-800 border border-amber-300`;
      case "Published":
        return `bg-emerald-100 text-emerald-800 border border-emerald-300`;
      case "Rejected":
        return `bg-rose-100 text-rose-800 border border-rose-300`;
      default:
        return `bg-gray-100 text-gray-800 border border-gray-300`;
    }
  };

  // Get status text in Arabic
  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "معلق";
      case "Published":
        return "مقبول";
      case "Rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredSalons.length / salonsPerPage);
  const indexOfLastSalon = currentPage * salonsPerPage;
  const indexOfFirstSalon = indexOfLastSalon - salonsPerPage;
  const currentSalons = filteredSalons.slice(
    indexOfFirstSalon,
    indexOfLastSalon
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader
            size={40}
            className="animate-spin mx-auto mb-4"
            style={{ color: colors.secondary }}
          />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <X size={40} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-white px-4 py-2 rounded font-medium transition duration-300 hover:opacity-90"
            style={{ backgroundColor: colors.secondary }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              لوحة تحكم الصالونات
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              إدارة ومراجعة طلبات الصالونات المسجلة
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search size={18} style={{ color: colors.secondary }} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن صالون..."
                className="block w-full pr-10 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:outline-none text-right"
                style={{
                  borderColor: colors.light,
                  focusRingColor: colors.primary,
                }}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} style={{ color: colors.secondary }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 text-right"
                style={{
                  borderColor: colors.light,
                  focusRingColor: colors.primary,
                }}
              >
                <option value="all">جميع الحالات</option>
                <option value="Pending">معلق</option>
                <option value="Published">مقبول</option>
                <option value="Rejected">مرفوض</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="flex items-center gap-2">
              <select
                value={salonsPerPage}
                onChange={(e) => setSalonsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 text-right"
                style={{
                  borderColor: colors.light,
                  focusRingColor: colors.primary,
                }}
              >
                <option value={5}>5 لكل صفحة</option>
                <option value={10}>10 لكل صفحة</option>
                <option value={20}>20 لكل صفحة</option>
                <option value={50}>50 لكل صفحة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div
            className="p-4 border-b border-gray-200"
            style={{ backgroundColor: colors.background }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2
                className="text-lg md:text-xl font-semibold"
                style={{ color: colors.primary }}
              >
                قائمة الصالونات
              </h2>
              <p className="text-sm md:text-base text-gray-500">
                عرض {indexOfFirstSalon + 1} -{" "}
                {Math.min(indexOfLastSalon, filteredSalons.length)} من{" "}
                {filteredSalons.length} صالون
              </p>
            </div>
          </div>

          {/* Empty State */}
          {filteredSalons.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-4" style={{ color: colors.light }}>
                🏢
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: colors.primary }}
              >
                لا توجد صالونات
              </h3>
              <p className="text-gray-600 mb-4">
                لم يتم العثور على صالونات تطابق معايير البحث
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-white px-4 py-2 rounded-lg font-medium transition duration-300 hover:opacity-90"
                style={{ backgroundColor: colors.secondary }}
              >
                عرض جميع الصالونات
              </button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden space-y-3 p-4">
                {currentSalons.map((salon) => (
                  <div
                    key={salon._id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: colors.primary }}
                        >
                          {salon.name || "بدون اسم"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {salon.ownerName || "غير متوفر"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                          salon.status
                        )}`}
                      >
                        {getStatusText(salon.status)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="ml-1" />
                      <span className="truncate">
                        {salon.location || "غير متوفر"}
                      </span>
                    </div>

                    <div className="mt-4 flex justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedSalon(salon);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 flex items-center justify-center text-gray-700 border border-gray-300 px-2 py-1.5 rounded-lg text-xs"
                      >
                        <Info size={14} className="ml-1" />
                        التفاصيل
                      </button>
                      <button
                        onClick={() => handleApprove(salon._id)}
                        disabled={salon.status === "Published"}
                        className={`flex-1 flex items-center justify-center text-white px-2 py-1.5 rounded-lg text-xs ${
                          salon.status === "Published"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        style={{ backgroundColor: colors.secondary }}
                      >
                        <Check size={14} className="ml-1" />
                        قبول
                      </button>
                      <button
                        onClick={() => handleReject(salon._id)}
                        disabled={salon.status === "Rejected"}
                        className={`flex-1 flex items-center justify-center text-white px-2 py-1.5 rounded-lg text-xs ${
                          salon.status === "Rejected"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        style={{ backgroundColor: colors.danger }}
                      >
                        <X size={14} className="ml-1" />
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead style={{ backgroundColor: colors.background }}>
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        اسم الصالون
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المالك
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الموقع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ التسجيل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSalons.map((salon) => (
                      <tr key={salon._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="text-sm font-medium"
                              style={{ color: colors.primary }}
                            >
                              {salon.name || "بدون اسم"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {salon.ownerName || "غير متوفر"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin size={14} className="ml-1" />
                            <span className="truncate max-w-xs">
                              {salon.location || "غير متوفر"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(salon.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                              salon.status
                            )}`}
                          >
                            {getStatusText(salon.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => {
                                setSelectedSalon(salon);
                                setShowDetailsModal(true);
                              }}
                              className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400"
                            >
                              <Info size={14} className="ml-1" />
                              التفاصيل
                            </button>
                            <button
                              onClick={() => handleApprove(salon._id)}
                              disabled={salon.status === "Published"}
                              className={`flex items-center text-white px-3 py-1.5 rounded-lg ${
                                salon.status === "Published"
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:opacity-90"
                              }`}
                              style={{ backgroundColor: colors.secondary }}
                            >
                              <Check size={14} className="ml-1" />
                              قبول
                            </button>
                            <button
                              onClick={() => handleReject(salon._id)}
                              disabled={salon.status === "Rejected"}
                              className={`flex items-center text-white px-3 py-1.5 rounded-lg ${
                                salon.status === "Rejected"
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:opacity-90"
                              }`}
                              style={{ backgroundColor: colors.danger }}
                            >
                              <X size={14} className="ml-1" />
                              رفض
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredSalons.length > salonsPerPage && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      السابق
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      التالي
                    </button>
                  </div>

                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        عرض{" "}
                        <span className="font-medium">
                          {indexOfFirstSalon + 1}
                        </span>{" "}
                        إلى{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastSalon, filteredSalons.length)}
                        </span>{" "}
                        من{" "}
                        <span className="font-medium">
                          {filteredSalons.length}
                        </span>{" "}
                        نتائج
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">السابق</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? `z-10 bg-indigo-50 border-indigo-500 text-indigo-600`
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">التالي</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Salon Details Modal */}
      {showDetailsModal && selectedSalon && (
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
                          selectedSalon.identityImagePreview.map(
                            (image, index) => (
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
                    {selectedSalon.services &&
                    selectedSalon.services.length > 0 ? (
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
      )}

      {/* Image Preview Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setEnlargedImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={enlargedImage}
              alt="صورة مكبرة"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={enlargedImage}
              alt="Enlarged salon preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X size={24} className="text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
