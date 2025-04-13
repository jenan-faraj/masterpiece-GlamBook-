const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    services: [{ type: String, required: true }],
    date: { type: Date, required: true },
    time: { type: String, required: true },
    OTP: { type: String, required: false }, // إن كان مطلوبًا
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // مرجع للمستخدم
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    }, // مرجع للصالون
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
