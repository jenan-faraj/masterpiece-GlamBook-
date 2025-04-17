// routes/UserRoute.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { protect } = require("../middlewares/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", protect, userController.getProfile);
router.put("/update-profile-image", protect, userController.updateProfileImage);
router.put("/toggle-favorite", protect, userController.toggleFavorite);
router.put("/toggle-comment", protect, userController.toggleComment);
router.delete("/delete", protect, userController.softDeleteUser);
router.patch("/delete/restore", protect, userController.restoreUser);
// Route to get all completed bookings
router.get("/completed", getCompletedBookings);

// Route to get completed bookings by user
router.get("/completed/user/:userId", getCompletedBookingsByUser);

// Route to get completed bookings by salon
router.get("/completed/salon/:salonId", getCompletedBookingsBySalon);

module.exports = router;
