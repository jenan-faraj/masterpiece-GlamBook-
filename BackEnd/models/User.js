const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "default-profile.png",
    },
    role: {
      type: String,
      enum: ["user", "salon", "admin"],
      default: "user",
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],

    book: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  this.setOptions({ runValidators: true, new: true });
  next();
});

userSchema.methods.toggleFavorite = function (itemId) {
  const index = this.favoriteList.findIndex(
    (fav) => fav.toString() === itemId.toString()
  );
  if (index === -1) {
    this.favoriteList.push(itemId);
  } else {
    this.favoriteList.splice(index, 1);
  }
  return this.save();
};

userSchema.methods.toggleComment = function (commentId) {
  const index = this.comments.findIndex(
    (comment) => comment.toString() === commentId.toString()
  );
  if (index === -1) {
    this.comments.push(commentId);
  } else {
    this.comments.splice(index, 1);
  }
  return this.save();
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
