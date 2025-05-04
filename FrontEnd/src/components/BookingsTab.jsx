// BookingsTab.jsx
import React, { useState } from "react";
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

  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد حقاً إلغاء هذا الحجز؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a0714f",
      cancelButtonColor: "#d33",
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

  return (
    <div className="py-8 px-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-center text-amber-800">
        حجوزاتك
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto mb-6 bg-amber-50 rounded-lg p-4 border border-amber-100">
        <h3 className="text-amber-800 font-semibold mb-3 text-center">
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
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-amber-200 rounded-md text-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-amber-200 rounded-md text-sm px-4 py-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
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
              }}
              className="text-sm px-4 py-2 rounded-md bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors flex items-center"
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

      {bookings?.length ? (
        <div className="space-y-5 max-w-2xl mx-auto">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="border border-amber-200 rounded-lg p-5 shadow-md bg-white"
              >
                <div className="flex justify-between items-start flex-wrap">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg text-amber-800">
                      {booking.services
                        .map((service) => service.serviceName)
                        .join(", ")}
                    </h3>
                    <div className="mt-3 space-y-1 text-gray-700">
                      <p className="flex items-center">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {formatDate(booking.date)}
                      </p>
                      <p className="flex items-center">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        {booking.time}
                      </p>
                    </div>
                  </div>

                  <div>
                    {booking.isCompleted && (
                      <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                        مكتمل
                      </span>
                    )}
                    {booking.isCanceled && (
                      <span className="bg-red-50 text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-200">
                        ملغي
                      </span>
                    )}
                    {!booking.isCompleted && !booking.isCanceled && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300">
                        قادم
                      </span>
                    )}
                  </div>
                </div>

                {!booking.isCompleted && !booking.isCanceled && (
                  <div className="flex justify-start mt-4 space-x-reverse space-x-3">
                    <button className="text-sm px-4 py-2 rounded-full flex items-center bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      إعادة جدولة
                    </button>
                    <button
                      className="text-sm px-4 py-2 rounded-full flex items-center bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-4 w-4 ml-1"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      )}
                      {loading ? "جاري الإلغاء..." : "إلغاء"}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-amber-200 shadow-md">
              <svg
                className="w-12 h-12 mx-auto text-amber-300 mb-3"
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
              <p className="text-gray-600 mb-3">
                لا توجد حجوزات تطابق عوامل التصفية المحددة.
              </p>
              <button
                onClick={() => {
                  setDateFilter("all");
                  setStatusFilter("all");
                }}
                className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md transition-colors"
              >
                عرض جميع الحجوزات
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg border border-amber-200 shadow-md">
          <svg
            className="w-12 h-12 mx-auto text-amber-300 mb-3"
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
          <p className="text-gray-600 mb-3">ليس لديك أي حجوزات بعد.</p>
          <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md transition-colors">
            حجز خدمة جديدة
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
