const Review = require("../models/review");
const Salon = require("../models/SalonModel");
const mongoose = require("mongoose");
const User = require("../models/User");

// إنشاء تقييم جديد
exports.createReview = async (req, res) => {
  try {
    const { rating, text, userId, salonId } = req.body;
    const review = new Review({ rating, text, userId, salonId });
    await review.save();

    await User.findByIdAndUpdate(userId, {
      $push: { reviews: review._id },
    }), // إضافة التقييم إلى قائمة التقييمات الخاصة بالمستخدم
      res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب جميع التقييمات
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId") // لربط بيانات المستخدم
      .populate("salonId") // لربط بيانات الصالون
      .then((reviews) => {
        res.json(reviews); // ستظهر المراجعات مع بيانات المستخدمين والصالونات
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
    res.status(200).json(reviews); // حطينا 200 معناها تم الاستعلام بنجاح
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب تقييم واحد حسب ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.find()
      .populate("userId", "name")
      .populate("salonId", "name");
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
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
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
    const reviews = await Review.find({ salonId })
      .populate("userId") // لربط بيانات المستخدم
      .populate("salonId"); // لربط بيانات الصالون;

    // ✅ إرجاع البيانات
    res.json(reviews);
  } catch (error) {
    console.error("Fetching Reviews Error:", error); // ✅ طباعة الخطأ الحقيقي
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};
