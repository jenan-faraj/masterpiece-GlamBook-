// routes/UserRoute.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { protect } = require("../middlewares/auth");

router.get("/all", userController.getAllUsers); // حطي protect إذا بدك تكون محمية
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", protect, userController.getProfile);
// تحديث بيانات مستخدم
router.put("/me/:id", userController.updateUser);
router.put("/toggle-favorite", protect, userController.toggleFavorite);
router.put("/toggle-comment", protect, userController.toggleComment);
router.delete("/delete", protect, userController.softDeleteUser);
router.patch("/delete/restore", protect, userController.restoreUser);

module.exports = router;
