const express = require("express");
const router = express.Router();
const bookController = require("../controller/bookController");

router.post("/", bookController.createBooking); // إنشاء حجز جديد
router.get("/", bookController.getAllBookings); // جلب كل الحجوزات
router.get("/:id", bookController.getBookingById); // جلب حجز حسب الـ ID
router.put("/:id", bookController.updateBooking); // تحديث الحجز
router.delete("/:id", bookController.deleteBooking); // حذف الحجز

module.exports = router;
