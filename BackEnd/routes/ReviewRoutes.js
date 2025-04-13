const express = require("express");
const router = express.Router();
const reviewController = require("../controller/ReviewController");

router.post("/", reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.get("/reviews/:salonId", reviewController.getReviewsBySalon);

module.exports = router;
