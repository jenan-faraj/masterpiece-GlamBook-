import { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SalonBookings = ({ salonId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedFilter, setCompletedFilter] = useState("");
  const [canceledFilter, setCanceledFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first (desc)

  // إضافة ترقيم الصفحات
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/bookings/salon/${salonId}?`;

      if (completedFilter) url += `isCompleted=${completedFilter}&`;
      if (canceledFilter) url += `isCanceled=${canceledFilter}`;

      const res = await axios.get(url);

      // التأكد من أن الخدمات تظهر بشكل صحيح
      const processedBookings = res.data.map((booking) => ({
        ...booking,
        services: Array.isArray(booking.services)
          ? booking.services
          : typeof booking.services === "object" && booking.services !== null
          ? [booking.services.name || JSON.stringify(booking.services)]
          : ["خدمة غير معروفة"],
      }));

      // Sort bookings based on date
      const sortedBookings = [...processedBookings].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      setBookings(sortedBookings);
    } catch (err) {
      console.error("خطأ في جلب الحجوزات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salonId) fetchBookings();
  }, [salonId, completedFilter, canceledFilter, sortOrder]);

  const getStatusColor = (booking) => {
    if (booking.isCanceled) return "bg-red-100 text-red-800";
    if (booking.isCompleted) return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = (booking) => {
    if (booking.isCanceled) return "ملغي";
    if (booking.isCompleted) return "مكتمل";
    return "قادم";
  };

  const getStatusIcon = (booking) => {
    if (booking.isCanceled) return <XCircle className="w-4 h-4" />;
    if (booking.isCompleted) return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  // تعديل حالة الإكمال
  const toggleCompletedStatus = async (bookingId, currentStatus) => {
    try {
      console.log(`محاولة تحديث الحجز رقم: ${bookingId}`);

      const response = await axios.put(
        `http://localhost:3000/api/bookings/completed/${bookingId}`,
        {
          isCompleted: !currentStatus,
        }
      );

      console.log("استجابة التحديث:", response.data);

      if (response.data.success) {
        // تحديث حالة الحجز محليًا
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, isCompleted: !currentStatus }
              : booking
          )
        );
      } else {
        console.error("فشل تحديث الحجز:", response.data.message);
      }
    } catch (err) {
      console.error("خطأ في تحديث حالة الحجز:", err);
      alert("حدث خطأ أثناء تحديث حالة الحجز. الرجاء المحاولة مرة أخرى.");
    }
  };

  // حساب الصفحات للترقيم
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // التنقل للصفحة التالية والسابقة
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#8a5936] flex items-center">
          <Scissors className="mr-2 ml-2" /> حجوزات الصالون
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-[#8a5936]">
            تصفية الحجوزات
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حالة الإكمال
              </label>
              <select
                value={completedFilter}
                onChange={(e) => setCompletedFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a0714f]"
              >
                <option value="">الكل</option>
                <option value="true">مكتمل</option>
                <option value="false">غير مكتمل</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حالة الإلغاء
              </label>
              <select
                value={canceledFilter}
                onChange={(e) => setCanceledFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a0714f]"
              >
                <option value="">الكل</option>
                <option value="true">ملغي</option>
                <option value="false">غير ملغي</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ترتيب حسب التاريخ
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a0714f]"
              >
                <option value="desc">الأحدث أولاً</option>
                <option value="asc">الأقدم أولاً</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            جاري تحميل الحجوزات...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            لا توجد حجوزات
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {currentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden transition-transform hover:shadow-lg"
                >
                  <div className="bg-[#a0714f] p-3 text-white flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2" />
                      <span>
                        {new Date(booking.date).toLocaleDateString("AR")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{booking.time}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start mb-3">
                      <Scissors className="w-4 h-4 ml-2 mt-1 text-[#8a5936]" />
                      <div>
                        <div className="text-sm text-gray-500">الخدمات</div>
                        <div className="font-medium text-[#8a5936]">
                          {booking.services.map((service, index) => (
                            <span key={index}>
                              {service.serviceName || service.name}
                              {index < booking.services.length - 1 && (
                                <span className="text-gray-400">، </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start mb-3">
                      <User className="w-4 h-4 ml-2 mt-1 text-[#8a5936]" />
                      <div>
                        <div className="text-sm text-gray-500">العميل</div>
                        <div className="font-medium">
                          {booking.userId?.email || "غير معروف"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(
                          booking
                        )}`}
                      >
                        {getStatusIcon(booking)}
                        <span className="mr-1">{getStatusText(booking)}</span>
                      </span>

                      {!booking.isCanceled && (
                        <button
                          onClick={() =>
                            toggleCompletedStatus(
                              booking._id,
                              booking.isCompleted
                            )
                          }
                          className={`px-3 py-1 rounded-md text-xs hover:cursor-pointer font-medium ${
                            booking.isCompleted
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {booking.isCompleted
                            ? "تراجع عن الإكمال"
                            : "تحديد كمكتمل"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ترقيم الصفحات */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 bg-white rounded-lg shadow-md p-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`mx-1 p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#8a5936] hover:bg-[#8a5936] hover:text-white"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="flex mx-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`mx-1 px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-[#8a5936] text-white"
                          : "text-[#8a5936] hover:bg-[#8a5936] hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`mx-1 p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#8a5936] hover:bg-[#8a5936] hover:text-white"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SalonBookings;
