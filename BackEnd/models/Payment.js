const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "cliq"],
    required: true,
  },
  customer: {
    name: String,
    email: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
