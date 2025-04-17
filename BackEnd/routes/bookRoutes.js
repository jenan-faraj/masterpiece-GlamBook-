const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  deleteBooking,
  getBookingsByUser,
  cancelBooking,
  getCompletedBookings,
  getCompletedBookingsByUser,
  getCompletedBookingsBySalon,
} = require("../controller/bookController");

// Route to create a booking
router.post("/", createBooking);
router.get("/", getAllBookings); // جلب كل الحجوزات
router.delete("/:id", deleteBooking); // حذف حجز معيّن
router.get("/user/:userId", getBookingsByUser);
router.put("/cancel/:id", cancelBooking);
// Route to get all completed bookings
router.get("/completed", getCompletedBookings);

// Route to get completed bookings by user
router.get("/completed/user/:userId", getCompletedBookingsByUser);

// Route to get completed bookings by salon
router.get("/completed/salon/:salonId", getCompletedBookingsBySalon);

module.exports = router;
