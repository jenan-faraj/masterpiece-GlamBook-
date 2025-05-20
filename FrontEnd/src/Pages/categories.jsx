import { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";

const StarRating = ({ rating }) => {
  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
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

function Categories() {
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salonsPerPage] = useState(8);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/salons")
      .then((response) => {
        const fetchedSalons = [];
        for (let key in response.data) {
          fetchedSalons.push({
            id: key,
            ...response.data[key],
          });
        }
        setSalons(fetchedSalons);
        setFilteredSalons(fetchedSalons);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = salons.filter((salon) => {
      const nameMatch = salon.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const ratingMatch =
        ratingFilter === "" ||
        (parseFloat(salon.rating) >= parseFloat(ratingFilter) &&
          parseFloat(salon.rating) < parseFloat(ratingFilter) + 1);

      return nameMatch && ratingMatch;
    });

    setFilteredSalons(filtered);
    setCurrentPage(1);
  }, [searchTerm, ratingFilter, salons]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  async function visitorsCount(salon) {
    if (!salon || !salon._id) {
      console.error("بيانات الصالون غير صالحة");
      return;
    }

    const updatedData = { visitors: (salon.visitors || 0) + 1 };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/salons/${salon._id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "خطأ في تحديث الصالون:",
        error.response?.data || error.message
      );
    }
  }

  const handleRatingFilter = (e) => {
    setRatingFilter(e.target.value);
  };

  const indexOfLastSalon = currentPage * salonsPerPage;
  const indexOfFirstSalon = indexOfLastSalon - salonsPerPage;
  const currentSalons = filteredSalons.slice(
    indexOfFirstSalon,
    indexOfLastSalon
  );
  const totalPages = Math.ceil(filteredSalons.length / salonsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getServiceCount = (salon) => {
    if (!salon.services) return 0;
    return salon.services.filter((service) => !service.isDeleted).length;
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-10">
      <ScrollToTopButton />
      <div dir="rtl">
        <div className="bg-gradient-to-r from-[#8a5936] to-[#a0714f] text-white py-12 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">اكتشف أفضل الصالونات</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90 mb-8">
            استعرض مجموعة متنوعة من أرقى صالونات التجميل وخدمات العناية الشخصية
          </p>

          {/* Search bar integrated within the gradient section */}
          <div className="max-w-xl mx-auto w-full px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-[#8a5936]" />
              </div>
              <input
                type="text"
                className="bg-white border border-stone-200 text-gray-900 text-sm rounded-lg focus:ring-[#a0714f] focus:border-[#a0714f] block w-full pl-10 p-3"
                placeholder="ابحث عن الصالونات بالاسم..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-20 lg:px-12 mb-6">
        <h2 className="text-xl font-bold text-gray-800 text-right" dir="rtl">
          النتائج ({filteredSalons.length} صالون)
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4 lg:px-12">
        {loading ? (
          <div className="w-full py-32 flex justify-center items-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#8a5936] border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="w-full text-center py-12 text-red-500 bg-red-50 rounded-lg">
            <p className="font-medium">خطأ في تحميل الصالونات</p>
            <p className="text-sm mt-2">يرجى المحاولة مرة أخرى لاحقًا</p>
          </div>
        ) : currentSalons.length === 0 ? (
          <div className="w-full text-center py-12 bg-stone-100 rounded-lg">
            <p className="font-medium text-gray-700">
              لم يتم العثور على صالونات
            </p>
            <p className="text-sm mt-2 text-gray-500">
              جرب تعديل معايير البحث الخاصة بك
            </p>
          </div>
        ) : (
          currentSalons.map((salon) => (
            <div
              key={salon._id}
              className="w-full sm:w-80 bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={
                    salon.bgImage ||
                    "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"
                  }
                  alt={`صورة صالون ${salon.name}`}
                  className="w-full h-full object-cover"
                />

                {salon.rating && salon.rating >= 4.5 && (
                  <div className="absolute top-3 right-3 bg-[#8a5936] text-white px-3 py-1 rounded-full text-xs font-bold">
                    صالون مميز
                  </div>
                )}
              </div>

              <div className="relative px-5 pt-12 pb-5" dir="rtl">
                <div className="absolute w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden -top-10 right-5">
                  <img
                    src={
                      salon.profileImage ||
                      "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"
                    }
                    alt={`شعار صالون ${salon.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {salon.name}
                  </h3>
                  <div className="mb-2">
                    <StarRating rating={salon.rating} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {salon.shortDescription ||
                      "صالون متميز يقدم خدمات عالية الجودة لعملائه"}
                  </p>

                  <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#a0714f]" />
                      <span className="truncate">
                        {salon.location || "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#a0714f]" />
                      <span>
                        {salon.openingYear
                          ? `تأسس في ${salon.openingYear}`
                          : "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#a0714f]" />
                      <span>{getServiceCount(salon)} خدمة متوفرة</span>
                    </div>
                  </div>

                  <Link
                    onClick={() => visitorsCount(salon)}
                    className="block w-full text-center bg-[#8a5936] hover:bg-[#a0714f] text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-300"
                    to={`/salonDetails/${salon._id}`}
                  >
                    زيارة الصالون
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredSalons.length > salonsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-md border ${
              currentPage === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                currentPage === number
                  ? "bg-[#8a5936] text-white"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-md border ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Categories;
