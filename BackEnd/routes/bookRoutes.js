const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  deleteBooking,
  getBookingsByUser,
  cancelBooking,
} = require("../controllers/bookController");

router.post("/", createBooking); // إضافة حجز جديد
router.get("/", getAllBookings); // جلب كل الحجوزات
router.delete("/:id", deleteBooking); // حذف حجز معيّن
router.get("/user/:userId", getBookingsByUser);
router.put("/cancel/:id", cancelBooking);

module.exports = router;
