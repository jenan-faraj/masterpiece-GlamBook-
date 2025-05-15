const FavoriteList = require("../models/favoriteList");

exports.addToFavorites = async (req, res) => {
  try {
    const { salonId } = req.body;
    const userId = req.user._id;
    console.log("Add Sending request with:", {
      salonId: salonId,
      userId: userId,
    });

    let existingFavorite = await FavoriteList.findOne({
      user: userId,
      salon: salonId,
    });

    if (existingFavorite) {
      if (existingFavorite.isDeleted) {
        existingFavorite.isDeleted = false;
        await existingFavorite.save();
        return res
          .status(200)
          .json({ message: "Salon added back to favorites." });
      } else {
        return res
          .status(400)
          .json({ message: "Salon is already in favorites." });
      }
    }

    const newFavorite = await FavoriteList.create({
      user: userId,
      salon: salonId,
    });

    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { salonId } = req.params;
    const userId = req.user._id;
    console.log("Remove Sending request with:", {
      salonId: salonId,
      userId: userId,
    });

    const favorite = await FavoriteList.findOne({
      user: userId,
      salon: salonId,
    });

    if (!favorite || favorite.isDeleted) {
      return res.status(404).json({ message: "Favorite not found." });
    }

    favorite.isDeleted = true;
    await favorite.save();

    res.status(200).json({ message: "Salon removed from favorites." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await FavoriteList.find({
      user: userId,
      isDeleted: false,
    }).populate("salon");

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
