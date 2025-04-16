const Salon = require("../models/SalonModel");

// Get all salons
const getAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find({ isDeleted: false });
    res.status(200).json(salons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single salon by ID
const getSalonById = async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ message: "Salon not found" });
    res.status(200).json(salon);
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

// Update salon
const updateSalon = async (req, res) => {
  try {
    const updated = await Salon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Soft delete salon
const deleteSalon = async (req, res) => {
  try {
    const deleted = await Salon.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json({ message: "Salon soft deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon,
};
