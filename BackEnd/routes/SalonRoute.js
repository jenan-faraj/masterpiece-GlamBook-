const express = require("express");
const {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
} = require("../controller/SalonController");

const router = express.Router();

// Routes
router.get("/", getAllSalons);
router.get("/:id", getSalonById);
router.post("/", createSalon);
router.put("/:id", updateSalon);
router.delete("/:id", deleteSalon);

module.exports = router;
