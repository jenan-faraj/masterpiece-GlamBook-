const Review = require("../models/review");
const Salon = require("../models/SalonModel")
const mongoose = require("mongoose");

// إنشاء تقييم جديد
exports.createReview = async (req, res) => {
  try {
    const { rating, text, userId, salonId } = req.body;
    const review = new Review({ rating, text, userId, salonId });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب جميع التقييمات
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isDeleted: false }).populate("userId salonId");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب تقييم واحد حسب ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("userId salonId");
    if (!review || review.isDeleted) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث التقييم
exports.updateReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, text },
      { new: true }
    );
    if (!review || review.isDeleted) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// حذف التقييم (Soft Delete)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// دالة لجلب التقييمات الخاصة بصالون معين
exports.getReviewsBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;

    // ✅ تحقق إذا كان الـ ID صالح
    if (!mongoose.Types.ObjectId.isValid(salonId)) {
      return res.status(400).json({ message: "Invalid Salon ID" });
    }

    // ✅ جلب التقييمات من قاعدة البيانات
    const reviews = await Review.find({ salonId });

    // ✅ إرجاع البيانات
    res.json(reviews);
  } catch (error) {
    console.error("Fetching Reviews Error:", error); // ✅ طباعة الخطأ الحقيقي
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};
