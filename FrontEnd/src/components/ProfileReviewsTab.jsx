import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Star } from "lucide-react";

const ReviewsTab = ({ reviews, fetchUserData }) => {
  const [expandedReviews, setExpandedReviews] = useState({});

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هل تريد حقاً حذف هذا التعليق؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#a0714f",
      confirmButtonText: "نعم، احذفه",
      cancelButtonText: "تراجع",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
        fetchUserData();
      } catch (err) {
        console.error("Error deleting review:", err);
        await Swal.fire("خطأ!", "فشل في حذف التعليق", "error");
      }
    }
  };

  return (
    <div dir="rtl" className="py-6 bg-amber-50 min-h-[63vh] px-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        تقيماتك
      </h2>

      {reviews?.length ? (
        <ul className="space-y-6">
          {reviews.map((review, index) => (
            <li
              key={index}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  <span className="text-gray-500 text-sm mr-2">
                    ({review.rating.toFixed(1)})
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                </span>
              </div>

              <p
                className={`text-gray-700 text-justify ${
                  expandedReviews[review._id] ? "" : "line-clamp-2"
                }`}
              >
                {review.text}
              </p>

              {review.text.length > 100 && (
                <button
                  onClick={() => toggleReviewExpansion(review._id)}
                  className="text-blue-500 hover:text-blue-700 text-xs mt-1 focus:outline-none"
                >
                  {expandedReviews[review._id] ? "عرض أقل" : "عرض المزيد"}
                </button>
              )}

              <div className="mt-4 pt-3 flex justify-between items-center border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  <span className="font-medium">الصالون: </span>
                  {review.salonId.name || "غير معروف"}
                </span>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">لم تقم بكتابة أي تقيمات بعد.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
