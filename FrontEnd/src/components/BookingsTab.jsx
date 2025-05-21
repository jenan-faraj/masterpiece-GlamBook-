import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BookingsTab = ({
  bookings,
  fetchUserData,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ar", options);
  };

  const filteredBookings = bookings?.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();

    if (dateFilter === "upcoming" && bookingDate < today) return false;
    if (dateFilter === "past" && bookingDate >= today) return false;

    if (
      statusFilter === "active" &&
      (booking.isCompleted || booking.isCanceled)
    )
      return false;
    if (statusFilter === "canceled" && !booking.isCanceled) return false;
    if (statusFilter === "completed" && !booking.isCompleted) return false;

    return true;
  });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings?.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const totalPages = Math.ceil(
    (filteredBookings?.length || 0) / bookingsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of bookings section
    document
      .getElementById("bookings-container")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelBooking = async (bookingId) => {
    const bookingToCancel = bookings.find(
      (booking) => booking._id === bookingId
    );

    if (!bookingToCancel) {
      await Swal.fire("خطأ!", "لم يتم العثور على الحجز", "error");
      return;
    }

    // تحويل الوقت من 12 ساعة إلى 24 ساعة
    function convertTo24Hour(timeStr) {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      const hoursStr = hours.toString().padStart(2, "0");
      return { hours: hoursStr, minutes };
    }

    // استخلاص الوقت بصيغة 24 ساعة
    const { hours, minutes } = convertTo24Hour(bookingToCancel.time);

    // بناء التاريخ والوقت بشكل صحيح
    const originalDate = new Date(bookingToCancel.date);
    const bookingDateTime = new Date(originalDate);

    bookingDateTime.setUTCHours(parseInt(hours));
    bookingDateTime.setUTCMinutes(parseInt(minutes));
    bookingDateTime.setUTCSeconds(0);
    bookingDateTime.setUTCMilliseconds(0);

    const now = new Date();
    console.log("bookingDateTime", bookingDateTime);

    const hoursDifference = (bookingDateTime - now) / (1000 * 60 * 60);

    if (hoursDifference < 4) {
      await Swal.fire(
        "غير مسموح!",
        "لا يمكن إلغاء الحجز قبل 4 ساعات من الموعد المحدد",
        "warning"
      );
      return;
    }

    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد حقاً إلغاء هذا الحجز؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a0714f",
      confirmButtonText: "نعم، ألغِ الحجز",
      cancelButtonText: "تراجع",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(
          `http://localhost:3000/api/bookings/cancel/${bookingId}`
        );

        if (response.data.success) {
          fetchUserData();
        }
      } catch (err) {
        setError(err.response?.data?.message || "فشل في إلغاء الحجز");
        await Swal.fire(
          "خطأ!",
          err.response?.data?.message || "فشل في إلغاء الحجز",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pageNumbers = [];

      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);

        if (currentPage <= 3) {
          pageNumbers.push(2, 3, 4, "...");
        } else if (currentPage >= totalPages - 2) {
          pageNumbers.push(
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1
          );
        } else {
          pageNumbers.push(
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "..."
          );
        }

        pageNumbers.push(totalPages);
      }

      return pageNumbers;
    };

    return (
      <div className="flex justify-center mt-8 space-x-reverse space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${
            currentPage === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "border-amber-300 text-amber-700 hover:bg-amber-50"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>

        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center px-3 py-1 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${pageNumber}`}
              onClick={() => handlePageChange(pageNumber)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === pageNumber
                  ? "bg-amber-700 text-white"
                  : "border border-amber-300 text-amber-700 hover:bg-amber-50"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "border-amber-300 text-amber-700 hover:bg-amber-50"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="py-8 px-4 bg-amber-50" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-center text-amber-800">
            حجوزاتك
          </h2>
          <div className="h-1 w-24 bg-amber-600 mx-auto rounded"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-md shadow-sm">
            <div className="flex">
              <svg
                className="w-5 h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mb-8 bg-white rounded-xl p-6 shadow-md border border-amber-200">
          <h3 className="text-amber-800 font-semibold mb-4 text-lg text-center">
            تصفية الحجوزات
          </h3>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <label
                htmlFor="dateFilter"
                className="text-sm font-medium text-amber-800"
              >
                التاريخ:
              </label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-amber-200 rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
              >
                <option value="all">جميع المواعيد</option>
                <option value="upcoming">المواعيد القادمة</option>
                <option value="past">المواعيد السابقة</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <label
                htmlFor="statusFilter"
                className="text-sm font-medium text-amber-800"
              >
                الحالة:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-amber-200 rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="completed">مكتمل</option>
                <option value="canceled">ملغي</option>
              </select>
            </div>

            {(dateFilter !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setDateFilter("all");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="text-sm px-4 py-2 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors flex items-center shadow-sm"
              >
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                إزالة الفلاتر
              </button>
            )}
          </div>
        </div>

        <div id="bookings-container" className="space-y-5">
          {bookings?.length ? (
            <>
              {currentBookings?.length > 0 ? (
                <>
                  {currentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-amber-200 rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start flex-wrap">
                        <div className="mb-3">
                          <h3 className="font-semibold text-lg text-amber-800">
                            {booking.services
                              .map((service) => service.serviceName)
                              .join(", ")}
                          </h3>
                          <div className="mt-3 space-y-2 text-gray-700">
                            <p className="flex items-center">
                              <svg
                                className="w-5 h-5 ml-2 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                              {formatDate(booking.date)}
                            </p>
                            <p className="flex items-center">
                              <svg
                                className="w-5 h-5 ml-2 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                              {booking.time}
                            </p>
                          </div>
                        </div>

                        <div>
                          {booking.isCompleted && (
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full border border-green-200 inline-flex items-center">
                              <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                              مكتمل
                            </span>
                          )}
                          {booking.isCanceled && (
                            <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-1.5 rounded-full border border-red-200 inline-flex items-center">
                              <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                              ملغي
                            </span>
                          )}
                          {!booking.isCompleted && !booking.isCanceled && (
                            <span className="bg-amber-100 text-amber-800 text-sm font-medium px-4 py-1.5 rounded-full border border-amber-300 inline-flex items-center">
                              <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                              قادم
                            </span>
                          )}
                        </div>
                      </div>

                      {!booking.isCompleted && !booking.isCanceled && (
                        <div className="flex justify-start mt-5 space-x-reverse space-x-3">
                          <button
                            className="text-sm px-5 py-2 rounded-lg flex items-center bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200 shadow-sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={loading}
                          >
                            {loading ? (
                              <svg
                                className="animate-spin h-4 w-4 ml-2"
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
                            ) : (
                              <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                            )}
                            {loading ? "جاري الإلغاء..." : "إلغاء الحجز"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <Pagination />
                </>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-amber-200 shadow-md">
                  <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-4 text-lg">
                    لا توجد حجوزات تطابق عوامل التصفية المحددة.
                  </p>
                  <button
                    onClick={() => {
                      setDateFilter("all");
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
                  >
                    عرض جميع الحجوزات
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-amber-200 shadow-md">
              <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-700 mb-4 text-lg">
                ليس لديك أي حجوزات بعد.
              </p>
              <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg transition-colors shadow-md">
                حجز خدمة جديدة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsTab;
