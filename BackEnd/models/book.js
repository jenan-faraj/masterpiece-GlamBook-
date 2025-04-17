const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    services: [
      {
        type: String,
        required: [true, "Service is required"],
        trim: true,
        minlength: [2, "Service name must be at least 2 characters long"],
      },
    ],
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Date must be today or in the future",
      },
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      match: [
        /^\d{1,2}:\d{2}\s?(AM|PM)$/i,
        "Time must be in format HH:MM AM/PM",
      ],
    },
    OTP: {
      type: String,
      maxlength: [6, "OTP must be at most 6 characters"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: [true, "Salon ID is required"],
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
