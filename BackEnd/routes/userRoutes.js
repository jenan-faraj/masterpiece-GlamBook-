// routes/UserRoute.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { protect } = require("../middlewares/auth");

router.get("/all", userController.getAllUsers);
router.get("/dash", userController.getAllUsersForDash);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", protect, userController.getProfile);
router.put("/me/:id", userController.updateUser);
router.put("/toggle-comment", protect, userController.toggleComment);
router.patch("/delete/:id", userController.softDeleteUser);
router.patch("/delete/restore/:id", protect, userController.restoreUser);

module.exports = router;
