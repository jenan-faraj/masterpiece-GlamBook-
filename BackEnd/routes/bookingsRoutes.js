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
  getSalonBookings,
  updateBookingStatus,
} = require("../controller/bookingsController");

router.post("/", createBooking);
router.get("/", getAllBookings); 
router.delete("/:id", deleteBooking);
router.get("/user/:userId", getBookingsByUser);
router.put("/cancel/:id", cancelBooking);
router.put("/completed/:bookingId", updateBookingStatus);
router.get("/completed", getCompletedBookings);
router.get("/salon/:salonId", getSalonBookings);
router.get("/completed/salon/:salonId", getCompletedBookingsBySalon);

module.exports = router;
