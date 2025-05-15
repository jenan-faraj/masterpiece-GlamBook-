const Review = require("../models/review");
const Salon = require("../models/SalonModel");
const mongoose = require("mongoose");
const User = require("../models/User");

// create new review
exports.createReview = async (req, res) => {
  try {
    const { rating, text, userId, salonId } = req.body;
    const review = new Review({ rating, text, userId, salonId });
    await review.save();

    await User.findByIdAndUpdate(userId, {
      $push: { reviews: review._id },
    }),
      res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId")
      .populate("salonId")
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get review by id
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

// update review
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

// soft delete review
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

// get reviews by salon
exports.getReviewsBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(salonId)) {
      return res.status(400).json({ message: "Invalid Salon ID" });
    }

    const reviews = await Review.find({ salonId })
      .populate("userId")
      .populate("salonId");

    res.json(reviews);
  } catch (error) {
    console.error("Fetching Reviews Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};
