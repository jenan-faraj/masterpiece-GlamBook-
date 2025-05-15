const express = require("express");
const {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
  softDeleteService,
  softDeleteOffer,
  getAllSalonsForAdmin,
} = require("../controller/SalonController");

const router = express.Router();

// Routes
router.get("/", getAllSalons);
router.get("/Admin", getAllSalonsForAdmin);
router.get("/:id", getSalonById);
router.post("/", createSalon);
router.put("/:id", updateSalon);
router.delete("/:id", deleteSalon);
router.patch("/:salonId/services/:serviceId/delete", softDeleteService);
router.patch("/:salonId/offers/:offerId/delete", softDeleteOffer);

module.exports = router;
