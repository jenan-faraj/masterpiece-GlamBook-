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
  Image,
  Calendar,
  ChevronLeft,
  ChevronRight,
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [salonsPerPage, setSalonsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch salons data when component mounts
  useEffect(() => {
    fetchSalons();
  }, []);

  // Filter salons whenever search term or status filter changes
  useEffect(() => {
    filterSalons();
  }, [searchTerm, statusFilter, salons]);

  // Calculate pagination whenever filtered salons change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredSalons.length / salonsPerPage));
    // Reset to first page when filters change
    if (currentPage > Math.ceil(filteredSalons.length / salonsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredSalons, salonsPerPage]);

  const fetchSalons = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get("http://localhost:3000/api/salons");

      // Process the data to ensure all required fields exist
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

  const filterSalons = () => {
    let result = [...salons];

    // Apply search filter
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

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((salon) => salon.status === statusFilter);
    }

    setFilteredSalons(result);
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Invalid date format:", error);
      return "غير متوفر";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      case "Published":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300";
      case "Rejected":
        return "bg-rose-100 text-rose-800 border border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

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

  // Get current page salons
  const indexOfLastSalon = currentPage * salonsPerPage;
  const indexOfFirstSalon = indexOfLastSalon - salonsPerPage;
  const currentSalons = filteredSalons.slice(
    indexOfFirstSalon,
    indexOfLastSalon
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader
            size={40}
            className="animate-spin mx-auto mb-4"
            style={{ color: "#a0714f" }}
          />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

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
            onClick={fetchSalons}
            className="text-white px-4 py-2 rounded font-medium transition duration-300 hover:opacity-90"
            style={{ backgroundColor: "#a0714f" }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with logo - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color: "#8a5936" }}
            >
              إدارة الصالونات
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              مراجعة وإدارة الصالونات المسجلة في النظام
            </p>
          </div>
        </div>

        {/* Search and Filter Bar - Responsive */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search size={18} style={{ color: "#a0714f" }} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث عن اسم الصالون، المالك، الموقع..."
                className="block w-full pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:outline-none text-right"
                style={{ borderColor: "#c4a484", focusRingColor: "#8a5936" }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <Filter size={18} style={{ color: "#a0714f" }} />
                <span className="text-sm sm:text-base text-gray-700">
                  تصفية حسب:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 text-right"
                  style={{ borderColor: "#c4a484", focusRingColor: "#8a5936" }}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="Pending">معلق</option>
                  <option value="Published">مقبول</option>
                  <option value="Rejected">مرفوض</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base text-gray-700">
                  عدد العناصر:
                </span>
                <select
                  value={salonsPerPage}
                  onChange={(e) => setSalonsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 text-right"
                  style={{ borderColor: "#c4a484", focusRingColor: "#8a5936" }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Salons Listing - Responsive */}
        <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200 overflow-x-auto">
          <div
            className="p-4 sm:p-6 border-b border-gray-200"
            style={{ backgroundColor: "#f9f5f1" }}
          >
            <h2
              className="text-lg sm:text-xl font-semibold"
              style={{ color: "#8a5936" }}
            >
              قائمة الصالونات
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              عرض {indexOfFirstSalon + 1} -{" "}
              {Math.min(indexOfLastSalon, filteredSalons.length)} من أصل{" "}
              {filteredSalons.length} صالون
            </p>
          </div>

          {filteredSalons.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              لا توجد صالونات متطابقة مع معايير البحث
            </div>
          ) : (
            <>
              <div className="sm:hidden space-y-4">
                {currentSalons.map((salon) => (
                  <div
                    key={salon._id}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <h3
                        className="font-medium text-gray-800"
                        style={{ color: "#8a5936" }}
                      >
                        {salon.name || "بدون اسم"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${getStatusBadgeColor(
                          salon.status
                        )}`}
                      >
                        {getStatusText(salon.status)}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User size={14} className="ml-1" />
                        <span>{salon.ownerName || "غير متوفر"}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="ml-1" />
                        <span>{salon.location || "غير متوفر"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="ml-1" />
                        <span>{formatDate(salon.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between space-x-2">
                      <button
                        onClick={() => handleApprove(salon._id)}
                        className="flex-1 flex items-center justify-center text-white px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: "#a0714f" }}
                        disabled={salon.status === "Published"}
                      >
                        <Check size={12} className="ml-1" />
                        قبول
                      </button>
                      <button
                        onClick={() => handleReject(salon._id)}
                        className="flex-1 flex items-center justify-center text-white bg-red-600 px-2 py-1 rounded text-xs"
                        disabled={salon.status === "Rejected"}
                      >
                        <X size={12} className="ml-1" />
                        رفض
                      </button>
                      <button
                        onClick={() =>
                          setSelectedSalon(
                            selectedSalon === salon._id ? null : salon._id
                          )
                        }
                        className="flex-1 flex items-center justify-center text-gray-600 border border-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {selectedSalon === salon._id ? (
                          <ChevronUp size={12} className="ml-1" />
                        ) : (
                          <ChevronDown size={12} className="ml-1" />
                        )}
                        التفاصيل
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table (shown on medium screens and up) */}
              <div className="hidden sm:block min-w-full">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#f9f5f1" }}>
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        اسم الصالون
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        المالك
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        الموقع
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        تاريخ التقديم
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSalons.map((salon) => (
                      <tr
                        key={salon._id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="font-medium text-sm sm:text-base"
                              style={{ color: "#8a5936" }}
                            >
                              {salon.name || "بدون اسم"}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                          {salon.ownerName || "غير متوفر"}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                          {salon.location || "غير متوفر"}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                          {formatDate(salon.createdAt)}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 sm:px-3 sm:py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                              salon.status
                            )}`}
                          >
                            {getStatusText(salon.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row sm:space-x-2 space-x-reverse space-y-2 sm:space-y-0">
                            <button
                              onClick={() =>
                                setSelectedSalon(
                                  selectedSalon === salon._id ? null : salon._id
                                )
                              }
                              className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition duration-150 px-2 py-1 rounded hover:bg-gray-100 text-xs sm:text-sm"
                            >
                              {selectedSalon === salon._id ? (
                                <ChevronUp size={14} className="ml-1" />
                              ) : (
                                <ChevronDown size={14} className="ml-1" />
                              )}
                              <span>التفاصيل</span>
                            </button>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(salon._id)}
                                className="flex items-center justify-center text-white px-2 sm:px-3 py-1 rounded transition duration-150 hover:opacity-90 text-xs sm:text-sm"
                                style={{ backgroundColor: "#a0714f" }}
                                disabled={salon.status === "Published"}
                              >
                                <Check size={12} className="ml-1" />
                                قبول
                              </button>
                              <button
                                onClick={() => handleReject(salon._id)}
                                className="flex items-center justify-center text-white bg-red-600 hover:bg-red-700 px-2 sm:px-3 py-1 rounded transition duration-150 text-xs sm:text-sm"
                                disabled={salon.status === "Rejected"}
                              >
                                <X size={12} className="ml-1" />
                                رفض
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination - Responsive */}
          {filteredSalons.length > 0 && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
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
                  className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
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
                    <span className="font-medium">{indexOfFirstSalon + 1}</span>{" "}
                    إلى{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastSalon, filteredSalons.length)}
                    </span>{" "}
                    من أصل{" "}
                    <span className="font-medium">{filteredSalons.length}</span>{" "}
                    صالون
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
                      <span className="sr-only">Previous</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map((number) => {
                      if (
                        number + 1 === 1 ||
                        number + 1 === totalPages ||
                        (number + 1 >= currentPage - 1 &&
                          number + 1 <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={number + 1}
                            onClick={() => paginate(number + 1)}
                            className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium ${
                              currentPage === number + 1
                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {number + 1}
                          </button>
                        );
                      }

                      if (
                        (number + 1 === 2 && currentPage > 3) ||
                        (number + 1 === totalPages - 1 &&
                          currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={number + 1}
                            className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Salon Details Panel - Responsive */}
        {filteredSalons.map(
          (salon) =>
            selectedSalon === salon._id && (
              <div key={`details-${salon._id}`}>
                {/* Modal for enlarged image */}
                {enlargedImage && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
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

                {/* Salon Details Panel - Responsive */}
                {filteredSalons.map(
                  (salon) =>
                    selectedSalon === salon._id && (
                      <div
                        key={`details-${salon._id}`}
                        className="mt-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
                      >
                        <div className="p-4 sm:p-6 border-b border-gray-200 bg-[#f9f5f1]">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h2 className="text-xl sm:text-2xl font-bold text-[#8a5936]">
                                {salon.name || "بدون اسم"}
                              </h2>
                              <div className="mt-2">
                                <span
                                  className={`inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(
                                    salon.status
                                  )}`}
                                >
                                  {getStatusText(salon.status)}
                                </span>
                                <span className="ml-2 p-1 sm:p-2 text-xs sm:text-sm text-gray-500">
                                  تاريخ التقديم: {formatDate(salon.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleApprove(salon._id)}
                                className={`bg-[#a0714f] text-white px-3 sm:px-4 py-1 sm:py-2 rounded font-medium text-xs sm:text-sm transition duration-300 ${
                                  salon.status === "Published"
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:opacity-90"
                                }`}
                                disabled={salon.status === "Published"}
                              >
                                <Check size={14} className="inline ml-1" />
                                قبول الصالون
                              </button>
                              <button
                                onClick={() => handleReject(salon._id)}
                                className={`bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded font-medium text-xs sm:text-sm transition duration-300 ${
                                  salon.status === "Rejected"
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:bg-red-700"
                                }`}
                                disabled={salon.status === "Rejected"}
                              >
                                <X size={14} className="inline ml-1" />
                                رفض الصالون
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6">
                          <div dir="rtl" className="flex flex-col gap-6">
                            {/* Top Row - Contact, Gallery, Services */}
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Contact Info Section */}
                              <div className="flex-1 min-w-0">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-full">
                                  <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-[#a0714f]">
                                    <User size={16} className="ml-2" />
                                    معلومات الاتصال
                                  </h3>
                                  <div className="space-y-2 overflow-auto text-gray-700 text-sm sm:text-base">
                                    <p className="flex items-center">
                                      <User
                                        size={14}
                                        className="ml-2 text-[#c4a484]"
                                      />
                                      <span className="font-medium ml-1">
                                        المالك:
                                      </span>{" "}
                                      {salon.ownerName || "غير متوفر"}
                                    </p>
                                    <p className="flex items-center">
                                      <Mail
                                        size={14}
                                        className="ml-2 text-[#c4a484]"
                                      />
                                      <span className="font-medium ml-1">
                                        البريد الإلكتروني:
                                      </span>{" "}
                                      {salon.email || "غير متوفر"}
                                    </p>
                                    <p className="flex items-center">
                                      <Phone
                                        size={14}
                                        className="ml-2 text-[#c4a484]"
                                      />
                                      <span className="font-medium ml-1">
                                        الهاتف:
                                      </span>{" "}
                                      {salon.phone || "غير متوفر"}
                                    </p>
                                    <p className="flex items-center">
                                      <MapPin
                                        size={14}
                                        className="ml-2 text-[#c4a484]"
                                      />
                                      <span className="font-medium ml-1">
                                        العنوان:
                                      </span>{" "}
                                      {salon.location || "غير متوفر"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Gallery Section */}
                              <div className="flex-1 min-w-0">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-full">
                                  <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-[#a0714f]">
                                    <Image size={16} className="ml-2" />
                                    معرض الصور
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    {Array.isArray(
                                      salon.salonOwnershipImagePreview
                                    ) &&
                                    salon.salonOwnershipImagePreview.length >
                                      0 ? (
                                      salon.salonOwnershipImagePreview.map(
                                        (preview, index) => (
                                          <div
                                            key={index}
                                            className="relative group"
                                          >
                                            <img
                                              src={preview}
                                              alt={`salon-ownership-preview-${index}`}
                                              className="h-20 sm:h-24 w-full object-cover rounded-md shadow-sm transition duration-300 group-hover:opacity-90 cursor-pointer"
                                              onClick={() =>
                                                setEnlargedImage(preview)
                                              }
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 rounded-md flex items-center justify-center">
                                              <button
                                                className="text-white bg-gray-900 bg-opacity-60 px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEnlargedImage(preview);
                                                }}
                                              >
                                                عرض
                                              </button>
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <div className="col-span-2 rounded h-32 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                        لا توجد صور متاحة
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Description Section */}
                            <div className="flex-1 min-w-0 bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-[#a0714f]">
                                وصف الصالون
                              </h3>
                              <div className="text-gray-700 whitespace-pre-wrap mb-3 text-sm sm:text-base">
                                {salon.shortDescription ||
                                  "لا يوجد وصف للصالون"}
                              </div>
                              <div className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
                                {salon.longDescription || "لا يوجد وصف للصالون"}
                              </div>
                            </div>

                            {/* Services Section */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-[#a0714f]">
                                خدمات الصالون
                              </h3>
                              {salon.services && salon.services.length > 0 ? (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                  {salon.services.map((service, index) => (
                                    <div
                                      key={index}
                                      className="border border-gray-200 rounded-md p-2 sm:p-3 bg-white"
                                    >
                                      <div className="flex justify-between items-center">
                                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                                          {service.title || "خدمة بدون اسم"}
                                        </h4>
                                        <span className="font-bold text-gray-700 text-sm sm:text-base">
                                          {service.price || 0} د.أ
                                        </span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        {service.shortDescription ||
                                          "لا يوجد وصف"}
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        المدة:{" "}
                                        {service.duration
                                          ? `${service.duration} دقيقة`
                                          : "غير محدد"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm sm:text-base">
                                  لم يتم تسجيل أي خدمات لهذا الصالون
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                              <button
                                onClick={() => setSelectedSalon(null)}
                                className="px-4 py-1 sm:px-6 sm:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 text-sm sm:text-base"
                              >
                                إغلاق التفاصيل
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            )
        )}

        {/* Empty state */}
        {salons.length === 0 && !loading && !error && (
          <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <div
              className="text-5xl sm:text-6xl mb-4 mx-auto"
              style={{ color: "#c4a484" }}
            >
              🏢
            </div>
            <h3
              className="text-lg sm:text-xl font-bold mb-2"
              style={{ color: "#8a5936" }}
            >
              لا توجد صالونات مسجلة
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              لم يتم تسجيل أي صالون في النظام حتى الآن
            </p>
            <button
              onClick={fetchSalons}
              className="inline-flex items-center text-white px-4 py-2 rounded font-medium transition duration-300 hover:opacity-90 text-sm sm:text-base"
              style={{ backgroundColor: "#a0714f" }}
            >
              <Loader size={14} className="ml-2" />
              إعادة تحميل البيانات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
