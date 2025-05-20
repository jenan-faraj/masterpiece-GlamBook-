const Salon = require("../models/SalonModel");

// Get all salons
const getAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find({ isDeleted: false, status: "Published" });
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSalonsForAdmin = async (req, res) => {
  try {
    const salons = await Salon.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new salon
const createSalon = async (req, res) => {
  try {
    const newSalon = new Salon(req.body);
    console.log(newSalon);
    const savedSalon = await newSalon.save();
    res.status(201).json(savedSalon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSalonById = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon || salon.isDeleted) {
      return res.status(404).json({ message: "Salon not found" });
    }
    res.json(salon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateSalon = async (req, res) => {
  try {
    const updatedSalon = await Salon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedSalon) {
      return res.status(404).json({ message: "الصالون غير موجود" });
    }

    res.json(updatedSalon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSalon = async (req, res) => {
  try {
    await Salon.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.json({ message: "Salon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const softDeleteService = async (req, res) => {
  const { salonId, serviceId } = req.params;

  try {
    const result = await Salon.updateOne(
      { _id: salonId, "services._id": serviceId },
      { $set: { "services.$.isDeleted": true } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Service not found or already deleted" });
    }

    res.status(200).json({ message: "Service soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete an offer (mark as deleted without removing from database)
const softDeleteOffer = async (req, res) => {
  const { salonId, offerId } = req.params;

  try {
    const result = await Salon.updateOne(
      { _id: salonId, "offers._id": offerId },
      { $set: { "offers.$.isDeleted": true } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Offer not found or already deleted" });
    }

    res.status(200).json({ message: "Offer soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting offer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
  softDeleteService,
  softDeleteOffer,
  getAllSalonsForAdmin,
};
