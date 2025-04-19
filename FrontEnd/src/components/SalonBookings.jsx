import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, User, Scissors, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";

const SalonBookings = ({ salonId }) => {
  const [bookings, setBookings] = useState([]);
  const [completedFilter, setCompletedFilter] = useState("");
  const [canceledFilter, setCanceledFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first (desc)

  const fetchBookings = async () => {
    try {
      let url = `http://localhost:3000/api/bookings/salon/${salonId}?`;

      if (completedFilter) url += `isCompleted=${completedFilter}&`;
      if (canceledFilter) url += `isCanceled=${canceledFilter}`;

      const res = await axios.get(url);
      
      // Sort bookings based on date
      const sortedBookings = [...res.data].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
      
      setBookings(sortedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
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
    if (booking.isCanceled) return "Canceled";
    if (booking.isCompleted) return "Completed";
    return "Upcoming";
  };

  const getStatusIcon = (booking) => {
    if (booking.isCanceled) return <XCircle className="w-4 h-4" />;
    if (booking.isCompleted) return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className=" min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#8a5936] flex items-center">
          <Scissors className="mr-2" /> Salon Bookings
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-[#8a5936]">Filter Bookings</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion Status</label>
              <select
                value={completedFilter}
                onChange={(e) => setCompletedFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a0714f]"
              >
                <option value="">All</option>
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Status</label>
              <select
                value={canceledFilter}
                onChange={(e) => setCanceledFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a0714f]"
              >
                <option value="">All</option>
                <option value="true">Canceled</option>
                <option value="false">Not Canceled</option>
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By Date</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a0714f]"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No bookings found
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden transition-transform hover:shadow-lg"
              >
                <div className="bg-[#a0714f] p-3 text-white flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{booking.time}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start mb-3">
                    <Scissors className="w-4 h-4 mr-2 mt-1 text-[#8a5936]" />
                    <div>
                      <div className="text-sm text-gray-500">Services</div>
                      <div className="font-medium">{booking.services.join(", ")}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-3">
                    <User className="w-4 h-4 mr-2 mt-1 text-[#8a5936]" />
                    <div>
                      <div className="text-sm text-gray-500">Client</div>
                      <div className="font-medium">{booking.userId?.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking)}`}>
                      {getStatusIcon(booking)}
                      <span className="ml-1">{getStatusText(booking)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonBookings;