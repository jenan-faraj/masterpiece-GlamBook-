import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div dir="rtl" className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="text-amber-400 fill-amber-400"
          size={18}
        />
      ))}

      {hasHalfStar && (
        <div dir="ltr" className="relative">
          <Star className="text-amber-400" size={18} />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="text-amber-400 fill-amber-400" size={18} />
          </div>
        </div>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-amber-400" size={18} />
      ))}

      <span className="ml-1 text-sm text-gray-600">{numRating.toFixed(1)}</span>
    </div>
  );
};

const FavoritesTab = ({ favorites, onRemoveFavorite }) => {
  return (
    <div className="text-center py-8 bg-amber-50 min-h-[300px]">
      <h2 className="text-2xl font-bold mb-8" style={{ color: "#8a5936" }}>
        صالوناتك المفضلة
      </h2>
      {favorites?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {favorites.map((favorite, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2"
              style={{ borderColor: "#a0714f" }}
            >
              {/* صورة الصالون */}
              <div className="h-48 overflow-hidden relative">
                {favorite.salon.profileImage ? (
                  <img
                    src={favorite.salon.profileImage}
                    alt={favorite.salon.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-gray-500"
                    style={{ backgroundColor: "#f4e5d6" }}
                  >
                    لا توجد صورة
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
                  <i
                    className="fas fa-heart text-lg"
                    style={{ color: "#a0714f" }}
                  ></i>
                </div>
              </div>

              <div className="p-5 text-right">
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "#8a5936" }}
                >
                  {favorite.salon.name}
                </h3>
                <p className="mb-2" style={{ color: "#a0714f" }}>
                  <i className="fas fa-map-marker-alt ml-2"></i>
                  {favorite.salon.location}
                </p>
                <p className="mb-4" style={{ color: "#a0714f" }}>
                  <StarRating rating={favorite.salon.rating} />
                </p>

                <div className="flex flex-col space-y-3 mt-5">
                  <Link
                    to={`/salonDetails/${favorite.salon._id}`}
                    className="px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center w-full"
                    style={{ backgroundColor: "#f4e5d6", color: "#8a5936" }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#a0714f";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#f4e5d6";
                      e.currentTarget.style.color = "#8a5936";
                    }}
                  >
                    <i className="fas fa-door-open ml-2"></i>
                    زيارة الصالون
                  </Link>
                  <button
                    onClick={() => onRemoveFavorite(favorite.salon._id)}
                    className="px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center w-full border"
                    style={{ borderColor: "#a0714f", color: "#a0714f" }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#a0714f";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#a0714f";
                    }}
                  >
                    <i className="fas fa-heart-broken ml-2"></i>
                    إزالة من المفضلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: "white", color: "#a0714f" }}
          >
            <i className="far fa-heart text-4xl"></i>
          </div>
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: "#8a5936" }}
          >
            لا توجد صالونات في قائمتك المفضلة
          </p>
          <p className="mt-2" style={{ color: "#a0714f" }}>
            اضغط على <span className="mx-1">♡</span> لإضافة صالونات إلى المفضلة
          </p>

          <Link
            to="/categories"
            className="mt-8 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            style={{ backgroundColor: "#a0714f", color: "white" }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#8a5936";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#a0714f";
            }}
          >
            <i className="fas fa-search ml-2"></i>
            تصفح الصالونات
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;
