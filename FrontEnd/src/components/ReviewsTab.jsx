import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Star, X, Plus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const [salonId, setSalonId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setSalonId(id);
      fetchReviews(id);
      fetchSalon(id);
    }
  }, [id]);

  const fetchReviews = async (salonId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/reviews/reviews/${salonId}`
      );
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchSalon = async (salonId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/salons/${salonId}`
      );
      setSalon(response.data);
    } catch (err) {
      console.error("Error fetching salon:", err);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });
        if (response.data) {
          setUserId(response.data._id);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleRatingClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !salonId || rating === 0) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }

    setSubmitLoading(true);

    try {
      const reviewData = { rating, text, userId, salonId };
      await axios.post("http://localhost:3000/api/reviews", reviewData);
      toast.success("تم إرسال التعليق بنجاح!");

      fetchReviews(salonId);
      fetchSalon(salonId);

      setRating(0);
      setText("");
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("فشل في إرسال التعليق");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا التعليق؟")) {
      try {
        await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
        toast.success("تم حذف التعليق بنجاح");
        fetchReviews(salonId);
        fetchSalon(salonId);
      } catch (err) {
        console.error("Error deleting review:", err);
        toast.error("فشل في حذف التعليق");
      }
    }
  };

  const setFilteredReviews = reviews.filter((review) => {
    return !review.isDeleted;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-red-500">حدث خطأ أثناء تحميل التعليقات.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#5d4037]">تعليقات العملاء</h2>
          {salon?.rating && (
            <div className="flex items-center mt-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className="text-yellow-400"
                    fill={
                      Math.round(salon.rating) >= star ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {salon.rating.toFixed(1)} ({reviews.length} تقييم)
              </span>
            </div>
          )}
        </div>

        {userId && (
          <button
            onClick={toggleForm}
            className="bg-[#8d6e63] hover:bg-[#6d4c41] text-white font-medium py-2 px-6 rounded-lg transition duration-300 flex items-center mt-4 md:mt-0"
          >
            {showForm ? (
              <>
                <X size={18} className="ml-1" />
                إغلاق النموذج
              </>
            ) : (
              <>
                <Plus size={18} className="ml-1" />
                أضف تقييمك
              </>
            )}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-[#f5f5f5] rounded-xl p-6 mb-8 border border-[#e0e0e0] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                تقييمك
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="focus:outline-none"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      size={32}
                      className={`mx-1 ${
                        (hoveredRating || rating) >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      fill={
                        (hoveredRating || rating) >= star
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                ))}
                <span className="mr-3 text-gray-700 font-medium">
                  {rating > 0 ? `${rating} من 5` : "اختر تقييماً"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                تعليقك
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-[#8d6e63]"
                placeholder="ما هو انطباعك عن الخدمة؟ شاركنا تجربتك..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#8d6e63] hover:bg-[#6d4c41] text-white font-medium py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitLoading || rating === 0}
              >
                {submitLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2" size={18} />
                    جاري الإرسال...
                  </span>
                ) : (
                  "نشر التقييم"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6" dir="rtl">
        {setFilteredReviews.length > 0 ? (
          setFilteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {review.userId?.username
                      ? review.userId.username.charAt(0)
                      : "؟"}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-800 text-lg">
                      {review.userId?.username}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className="ml-1"
                            fill={
                              review.rating >= star ? "currentColor" : "none"
                            }
                            color={
                              review.rating >= star ? "#facc15" : "#e5e7eb"
                            }
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>

                      {review.userId._id === userId && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          حذف
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">لا توجد تعليقات بعد.</p>
            <p className="text-gray-400 text-sm mt-1">كن أول من يضيف تعليقاً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
