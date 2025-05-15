const express = require("express");
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} = require("../controller/favoriteListController.js");
const { protect } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/", protect, addToFavorites);
router.delete("/:salonId", protect, removeFromFavorites);
router.get("/", protect, getFavorites);

module.exports = router;

