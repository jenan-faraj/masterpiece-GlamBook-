const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// 📋 Get All Users (except soft-deleted ones)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("🔥 GET ALL USERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("👉 Request body:", req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log("✅ User saved:", newUser);
    const token = createToken(newUser);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json(newUser);
  } catch (error) {
    console.log("🔥 REGISTER ERROR:", error); // ضيفي هذا
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      isDeleted: false,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, isDeleted: false },
      { profileImage: req.body.profileImage },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, isDeleted: false });
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.toggleFavorite(req.body.itemId);
    res.status(200).json(user.favoriteList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleComment = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, isDeleted: false });
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.toggleComment(req.body.commentId);
    res.status(200).json(user.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧼 Soft Delete User
exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found or already deleted" });

    res.status(200).json({ message: "User soft-deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ♻️ Restore Soft Deleted User
exports.restoreUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "User not found or not deleted" });

    res.status(200).json({ message: "User restored successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
