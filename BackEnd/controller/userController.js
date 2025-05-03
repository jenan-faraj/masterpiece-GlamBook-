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

exports.getAllUsersForDash = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // رقم الصفحة
    const limit = parseInt(req.query.limit) || 10; // عدد المستخدمين بالصفحة

    const skip = (page - 1) * limit;

    const users = await User.find({ isDeleted: false }).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching users with pagination:", err);
    res.status(500).json({ message: "Server error" });
  }
}

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
    console.log("-------------------------------------------------------",req.user.id)
    const user = await User.findOne({
      _id: req.user.id,
      isDeleted: false,
    })
      .select("-password")
      .populate("reviews")
      .populate("book")
      .populate({
        path: "reviews",
        populate: {
          path: "salonId",
          model: "Salon",
        },
      }); // لربط بيانات المستخدم
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// تحديث بيانات المستخدم
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // إذا كان في password جديدة بدنا نعملها hash
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Server error" });
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
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }); // أو أي منطق حذف عندك
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
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
