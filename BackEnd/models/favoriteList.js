import mongoose from 'mongoose';

const favoriteListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // بضيف createdAt و updatedAt تلقائياً
  }
);

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);
export default FavoriteList;
