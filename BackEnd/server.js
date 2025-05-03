const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoutes");
const salonRoutes = require("./routes/SalonRoute");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/ReviewRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require('./routes/payments');
const contact = require("./routes/contact");
const path = require("path");
const emailRoute = require("./routes/email");

//---------------------------
// Middleware
//---------------------------
dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
const corsOptions = { origin: "http://localhost:5173", credentials: true };
app.use(cors(corsOptions));
console.log("JWT_SECRET:", process.env.JWT_SECRET);
app.use(express.json({ limit: "10mb" }));
//---------------------------
// Connect DB
//---------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

//---------------------------
// ROUTES
//---------------------------
app.use("/api/email", emailRoute);
app.use("/api/users", userRoute);
app.use("/api/salons", salonRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookRoutes); 
app.use('/api/contacts', contact);
app.use('/api/payments', paymentRoutes);
app.get("/get_token", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "No token found" });
  }
  res.send({ token });
});
// 📦 تحميل الراوت تبع الرفع
app.use(uploadRoutes);

// 🖼️ نخلي الصور تكون ظاهرة من مجلد uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const multer = require("multer");

// تحديد مكان تخزين الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // المكان الذي ستخزن فيه الصور
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // حفظ الصورة باسم فريد
  },
});

// إنشاء middleware لتحميل الصور
const upload = multer({ storage: storage });

// إرفاق upload في الـ API Route الخاص بك
app.put("/api/salons/:id", upload.single("bgImage"), async (req, res) => {
  try {
    const salonId = req.params.id;
    const { bgImage } = req.body;

    // التحقق من أن الصورة تم تحميلها بنجاح
    if (req.file) {
      const updatedSalon = await Salon.findByIdAndUpdate(
        salonId,
        { bgImage: req.file.path }, // حفظ مسار الصورة في قاعدة البيانات
        { new: true }
      );
      res.status(200).json(updatedSalon);
    } else {
      res.status(400).send("No file uploaded.");
    }
  } catch (error) {
    console.error("Error updating salon info:", error);
    res.status(500).send("Server Error");
  }
});

//---------------------------
// ERROR HANDLERS
//---------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong! " + err);
});

//---------------------------
// Connect SERVER
//---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
