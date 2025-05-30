import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  CalendarCheck,
  Filter,
} from "lucide-react";
const BookingsAllPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/bookings");

        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setBookings(response.data.data);
        } else if (response.data && typeof response.data === "object") {
          const possibleDataArray = Object.values(response.data).find((val) =>
            Array.isArray(val)
          );
          if (possibleDataArray) {
            setBookings(possibleDataArray);
          } else {
            console.warn(
              "Response data is not an array, converting to array:",
              response.data
            );
            setBookings([response.data]);
          }
        } else {
          console.error(
            "Could not find array data in response:",
            response.data
          );
          setBookings([]);
        }

        setLoading(false);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل البيانات");
        setLoading(false);
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    console.log("Bookings data:", bookings);
  }, [bookings]);

  // Format date to Arabic format
  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getBookingStatus = (booking) => {
    if (!booking)
      return { text: "غير معروف", className: "bg-gray-100 text-gray-800" };

    if (booking.isCanceled) {
      return {
        text: "ملغي",
        className: "bg-red-100 text-red-800",
      };
    } else if (booking.isCompleted) {
      return {
        text: "مكتمل",
        className: "bg-green-100 text-green-800",
      };
    } else {
      return {
        text: "غير مكتمل",
        className: "bg-blue-100 text-blue-800",
      };
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getFilteredBookings = () => {
    if (!Array.isArray(bookings)) return [];

    return bookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      const hasSearchMatch =
        (booking.salonId &&
          booking.salonId.name &&
          booking.salonId.name.toLowerCase().includes(searchLower)) ||
        (booking._id && booking._id.toLowerCase().includes(searchLower)) ||
        (booking.time && booking.time.toLowerCase().includes(searchLower)) ||
        (booking.userId &&
          booking.userId.username &&
          booking.userId.username.toLowerCase().includes(searchLower));

      let statusMatch = true;
      if (statusFilter !== "all") {
        if (statusFilter === "canceled" && !booking.isCanceled)
          statusMatch = false;
        if (statusFilter === "completed" && !booking.isCompleted)
          statusMatch = false;
        if (
          statusFilter === "confirmed" &&
          (booking.isCanceled || booking.isCompleted)
        )
          statusMatch = false;
      }

      return hasSearchMatch && statusMatch;
    });
  };

  const getSortedBookings = (filteredBookings) => {
    if (!sortConfig.key) return filteredBookings;

    return [...filteredBookings].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === "salon") {
        aValue = a.salonId && a.salonId.name ? a.salonId.name : "";
        bValue = b.salonId && b.salonId.name ? b.salonId.name : "";
      } else if (sortConfig.key === "price") {
        aValue =
          a.services && a.services.length > 0
            ? a.services.reduce(
                (total, service) => total + service.servicePrice,
                0
              )
            : 0;
        bValue =
          b.services && b.services.length > 0
            ? b.services.reduce(
                (total, service) => total + service.servicePrice,
                0
              )
            : 0;
      } else if (sortConfig.key === "date") {
        aValue = a.date ? new Date(a.date).getTime() : 0;
        bValue = b.date ? new Date(b.date).getTime() : 0;
      } else if (sortConfig.key === "username") {
        aValue = a.userId && a.userId.username ? a.userId.username : "";
        bValue = b.userId && b.userId.username ? b.userId.username : "";
      } else {
        aValue = a[sortConfig.key] || "";
        bValue = b[sortConfig.key] || "";
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredBookings = getFilteredBookings();
  const sortedBookings = getSortedBookings(filteredBookings);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = sortedBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };
  const renderBookingCards = () => {
    if (!Array.isArray(currentBookings) || currentBookings.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          لا توجد حجوزات متاحة
        </div>
      );
    }

    return currentBookings.map((booking, index) => {
      const bookingId = booking._id || `temp-${index}`;
      const displayId = booking._id
        ? `#${booking._id.substring(booking._id.length - 5)}`
        : `#${index + 1}`;
      const status = getBookingStatus(booking);
      const totalPrice =
        booking.services && booking.services.length > 0
          ? booking.services.reduce(
              (total, service) => total + service.servicePrice,
              0
            )
          : 0;

      return (
        <div
          key={bookingId}
          className="bg-white rounded-lg shadow-md p-4 mb-4 border-r-4 hover:bg-[#f4e5d6]/50 transition-colors"
          style={{
            borderRightColor: "#8a5936",
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-lg">{displayId}</span>
            <span
              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}
            >
              {status.text}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs text-gray-500">الصالون</p>
              <p className="font-medium">
                {booking.salonId && booking.salonId.name
                  ? booking.salonId.name
                  : " صالون طلة عروس"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">العميل</p>
              <p className="font-medium">
                {booking.userId && booking.userId.username
                  ? booking.userId.username
                  : "تالا احمد"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs text-gray-500">التاريخ</p>
              <p>{formatDate(booking.date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">الوقت</p>
              <p>{booking.time || "غير متوفر"}</p>
            </div>
          </div>

          <div className="mt-2 text-left">
            <p className="text-sm font-bold text-[#8a5936]">
              المبلغ: {totalPrice} د.أ
            </p>
          </div>
        </div>
      );
    });
  };

  const renderBookingsTable = () => {
    if (!Array.isArray(currentBookings) || currentBookings.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center">
            لا توجد حجوزات متاحة
          </td>
        </tr>
      );
    }

    return currentBookings.map((booking, index) => {
      const bookingId = booking._id || `temp-${index}`;
      const displayId = booking._id
        ? `#${booking._id.substring(booking._id.length - 5)}`
        : `#${index + 1}`;
      const status = getBookingStatus(booking);

      const rowBgColor = index % 2 === 0 ? "bg-white" : "bg-[#f5eee6]";

      return (
        <tr
          key={bookingId}
          className={`hover:bg-[#f4e5d6] transition-colors ${rowBgColor}`}
        >
          <td className="px-6 py-4 whitespace-nowrap">{displayId}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {booking.salonId && booking.salonId.name
              ? booking.salonId.name
              : "صالون طلة عروس "}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {booking.userId && booking.userId.username
              ? booking.userId.username
              : "تالا احمد"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {formatDate(booking.date)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {booking.time || "غير متوفر"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}
            >
              {status.text}
            </span>
          </td>
          {booking.services && booking.services.length > 0 ? (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {booking.services.reduce(
                (total, service) => total + service.servicePrice,
                0
              )}{" "}
              د.أ
            </td>
          ) : (
            <td className="px-6 py-4 whitespace-nowrap">غير متوفر</td>
          )}
        </tr>
      );
    });
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const pagesAround = window.innerWidth < 640 ? 1 : 2;
    let startPage = Math.max(1, currentPage - pagesAround);
    let endPage = Math.min(totalPages, startPage + pagesAround * 2);

    if (endPage - startPage < pagesAround * 2) {
      startPage = Math.max(1, endPage - pagesAround * 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px rtl:space-x-reverse"
          aria-label="ترقيم الصفحات"
        >
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-[#8a5936] hover:bg-[#f4e5d6]"
            } text-sm font-medium`}
          >
            <span className="sr-only">السابق</span>
            {/* رمز السهم اليمين للعربية */}
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                currentPage === number
                  ? "bg-[#8a5936] text-white"
                  : "bg-white text-gray-700 hover:bg-[#f4e5d6]"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-[#8a5936] hover:bg-[#f4e5d6]"
            } text-sm font-medium`}
          >
            <span className="sr-only">التالي</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-6" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div>
          <div className="container mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 flex items-center gap-2">
              <CalendarCheck className="w-6 h-6" />
              جميع الحجوزات
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto mt-6">
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                تصفية وبحث
              </h2>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative col-span-1 sm:col-span-2 xl:col-span-2">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pr-10 p-2.5 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="بحث عن صالون أو رقم حجز أو عميل"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-amber-500 focus:border-amber-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="completed">مكتمل</option>
                    <option value="canceled">ملغي</option>
                  </select>
                </div>

                {/* Items Per Page */}
                <div>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-amber-500 focus:border-amber-500"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5 حجوزات في الصفحة</option>
                    <option value="10">10 حجوزات في الصفحة</option>
                    <option value="25">25 حجز في الصفحة</option>
                    <option value="50">50 حجز في الصفحة</option>
                  </select>
                </div>
              </div>

              {/* Total Bookings Info */}
              <div className="mt-4 text-sm text-gray-600">
                إجمالي الحجوزات: {filteredBookings.length} | تم عرض{" "}
                {Math.min(indexOfLastItem, filteredBookings.length) -
                  indexOfFirstItem}{" "}
                من {filteredBookings.length}
              </div>
            </div>
          </div>
        </div>

        {/* Table / Cards Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-10">
              <div
                className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent text-[#8a5936]"
                role="status"
              >
                <span className="sr-only">جاري التحميل...</span>
              </div>
              <p className="mt-2 text-[#8a5936]">جاري تحميل البيانات...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg m-4 sm:m-6">
              {error}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#a0714f]">
                    <tr>
                      {[
                        { label: "رقم الحجز", key: "_id" },
                        { label: "الصالون", key: "salon" },
                        { label: "العميل", key: "username" },
                        { label: "التاريخ", key: "date" },
                        { label: "الوقت", key: "time" },
                        { label: "الحالة", key: "isCompleted" },
                        { label: "المبلغ", key: "price" },
                      ].map(({ label, key }) => (
                        <th
                          key={key}
                          className="px-6 py-5 text-right text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-[#a0714f]/20"
                          onClick={() => requestSort(key)}
                        >
                          {label} {getSortIndicator(key)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {renderBookingsTable()}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4">{renderBookingCards()}</div>
            </>
          )}

          {/* Pagination */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
              {renderPagination()}
              <div className="mt-3 text-sm text-center text-gray-600">
                الصفحة {currentPage} من {totalPages}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsAllPage;
