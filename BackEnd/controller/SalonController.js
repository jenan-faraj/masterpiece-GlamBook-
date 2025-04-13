const Salon = require("../models/SalonModel");

exports.createSalon = async (req, res) => {
  try {
    const newSalon = new Salon(req.body);
    console.log(newSalon)
    await newSalon.save();
    res.status(201).json(newSalon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSalons = async (req, res) => {
  try {
    const salons = await Salon.find({ isDeleted: false });
    res.json(salons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalonById = async (req, res) => {
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
exports.updateSalon = async (req, res) => {
  try {
    const updatedSalon = await Salon.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,  // إرجاع المستند المحدث
        runValidators: true,  // التحقق من صحة البيانات حسب المخطط
        context: 'query'  // تشغيل المتحققات قبل التحديث
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

exports.deleteSalon = async (req, res) => {
  try {
    await Salon.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.json({ message: "Salon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.softDeleteService = async (req, res) => {
  const { salonId, serviceId } = req.params;

  try {
    const result = await Salon.updateOne(
      { _id: salonId, "services._id": serviceId },
      { $set: { "services.$.isDeleted": true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Service not found or already deleted" });
    }

    res.status(200).json({ message: "Service soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting service:", error);
    res.status(500).json({ message: "Server error" });
  }
};