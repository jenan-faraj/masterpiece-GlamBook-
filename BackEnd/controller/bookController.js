const Book = require("../models/book");
const mongoose = require("mongoose");

// إنشاء حجز جديد
exports.createBooking = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, services, date, time, userId, salonId } = req.body;

    // التحقق من القيم المطلوبة
    if (!fullName || !phoneNumber || !email || !services || !date || !time || !userId || !salonId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // التحقق من صحة معرفات اليوزر والصالون
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(salonId)) {
      return res.status(400).json({ message: "Invalid User ID or Salon ID" });
    }

    // التحقق من صحة البريد الإلكتروني ورقم الهاتف
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const newBooking = new Book({ fullName, phoneNumber, email, services, date, time, userId, salonId });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب كل الحجوزات مع بيانات المستخدم والصالون
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Book.find()
      .populate("user", "name phone email")
      .populate("salon", "name location services")
      .lean();

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب حجز واحد عن طريق الـ ID مع بيانات اليوزر والصالون
exports.getBookingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Book.findById(req.params.id)
      .populate("user", "name phone email")
      .populate("salon", "name location services");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحديث حجز معين
exports.updateBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const updatedBooking = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking updated successfully", updatedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف حجز
exports.deleteBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const deletedBooking = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
