const Book = require("../models/book");

// ✅ Create Booking
exports.createBooking = async (req, res) => {
  try {
    const newBooking = await Book.create(req.body);
    console.log("ddddaaattttaaaa :" + newBooking);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Book.find({ isDeleted: false, isCanceled: false })
      .populate("userId", "name email") // عرض بيانات المستخدم (اختياري)
      .populate("salonId", "name location"); // عرض بيانات الصالون (اختياري)

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Bookings by User ID
exports.getBookingsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await Book.find({ userId, isDeleted: false })
      .populate("salonId", "name location") // إذا بتحبي تعرضي بيانات الصالون
      .sort({ date: 1 }); // ترتيب حسب التاريخ

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Book.findByIdAndUpdate(
      req.params.id,
      { isCanceled: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking has been canceled",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get All Completed Bookings
exports.getCompletedBookings = async (req, res) => {
  try {
    const completedBookings = await Book.find({ isCompleted: true })
      .populate("salonId", "name location")
      .populate("userId", "name email")
      .sort({ date: 1 });

    if (completedBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No completed bookings found",
      });
    }

    res.status(200).json({
      success: true,
      count: completedBookings.length,
      data: completedBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Completed Bookings by User ID
exports.getCompletedBookingsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const completedBookings = await Book.find({ userId, isCompleted: true })
      .populate("salonId", "name location")
      .populate("userId", "name email")
      .sort({ date: 1 });

    if (completedBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No completed bookings found for this user",
      });
    }

    res.status(200).json({
      success: true,
      count: completedBookings.length,
      data: completedBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Completed Bookings by Salon ID
exports.getCompletedBookingsBySalon = async (req, res) => {
  const salonId = req.params.salonId;

  try {
    const completedBookings = await Book.find({ salonId, isCompleted: true })
      .populate("salonId", "name location")
      .populate("userId", "name email")
      .sort({ date: 1 });

    if (completedBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No completed bookings found for this salon",
      });
    }

    res.status(200).json({
      success: true,
      count: completedBookings.length,
      data: completedBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Soft Delete Booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Book.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking marked as deleted (soft delete)",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
