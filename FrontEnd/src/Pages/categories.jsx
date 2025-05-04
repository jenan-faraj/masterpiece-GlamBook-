import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";

// مكون تقييم النجوم لعرض النجوم بناءً على التقييم
const StarRating = ({ rating }) => {
  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex justify-center">
      {/* نجوم كاملة */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="text-yellow-400 fill-yellow-400"
          size={16}
        />
      ))}

      {/* نصف نجمة */}
      {hasHalfStar && (
        <div className="relative">
          <Star className="text-yellow-400" size={16} />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
          </div>
        </div>
      )}

      {/* نجوم فارغة */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-yellow-400" size={16} />
      ))}
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

  // حالة الترقيم الصفحي
  const [currentPage, setCurrentPage] = useState(1);
  const [salonsPerPage] = useState(8); // عدد البطاقات في كل صفحة

  // جلب البيانات من Firebase باستخدام Axios
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

  // تطبيق البحث والتصفية عند تغيير أي منهما
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
    setCurrentPage(1); // إعادة تعيين الصفحة إلى 1 عند تغيير البحث أو التصفية
  }, [searchTerm, ratingFilter, salons]);

  // معالج حقل البحث
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

  // معالج فلتر التقييم
  const handleRatingFilter = (e) => {
    setRatingFilter(e.target.value);
  };

  // حساب البطاقات للصفحة الحالية
  const indexOfLastSalon = currentPage * salonsPerPage;
  const indexOfFirstSalon = indexOfLastSalon - salonsPerPage;
  const currentSalons = filteredSalons.slice(
    indexOfFirstSalon,
    indexOfLastSalon
  );
  const totalPages = Math.ceil(filteredSalons.length / salonsPerPage);

  // تغيير الصفحة
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // الصفحة التالية
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // الصفحة السابقة
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <ScrollToTopButton />
      {/* قسم البحث والتصفية */}
      <div
        dir="rtl"
        className="flex lg:px-20 flex-col md:flex-row justify-between items-center mb-8 px-4 py-4 bg-white shadow-sm"
      >
        {/* شريط البحث */}
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="ابحث عن الصالونات بالاسم..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* تصفية التقييم */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <label
            htmlFor="rating-filter"
            className="text-sm font-medium text-gray-700"
          >
            تصفية حسب التقييم:
          </label>
          <select
            id="rating-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            value={ratingFilter}
            onChange={handleRatingFilter}
          >
            <option value="">كل التقييمات</option>
            <option value="5">5 نجوم</option>
            <option value="4">4 نجوم</option>
            <option value="3">3 نجوم</option>
            <option value="2">2 نجوم</option>
            <option value="1">1 نجمة</option>
          </select>
        </div>
      </div>

      {/* بطاقات الصالونات */}
      <div className="flex flex-wrap justify-center gap-5 my-10">
        {loading ? (
          <div className="w-full text-center py-8">جاري تحميل الصالونات...</div>
        ) : error ? (
          <div className="w-full text-center py-8 text-red-500">
            خطأ في تحميل الصالونات. يرجى المحاولة مرة أخرى لاحقًا.
          </div>
        ) : currentSalons.length === 0 ? (
          <div className="w-full text-center py-8">
            لم يتم العثور على صالونات تطابق معايير البحث الخاصة بك.
          </div>
        ) : (
          currentSalons.map((salon) => {
            return (
              <div
                key={salon._id}
                className="group relative w-80 h-72 bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden shadow-md"
              >
                <div className="absolute top-0 w-80 h-24 rounded-t-2xl overflow-hidden transition-all duration-500 group-hover:h-72 group-hover:w-80 group-hover:rounded-b-2xl">
                  <img
                    src={
                      salon.bgImage ||
                      "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"
                    }
                    alt="خلفية الملف الشخصي"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 overflow-hidden group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500">
                  <img
                    src={
                      salon.profileImage ||
                      "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"
                    }
                    alt="جورج جونسون"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="z-10 group-hover:-translate-y-10 bg-[#ffffff74] p-2 rounded-2xl transition-all duration-500">
                  <span className="text-2xl font-semibold">{salon.name}</span>
                  <div className="flex flex-col items-center">
                    <StarRating rating={salon.rating} />
                  </div>
                </div>

                <Link
                  onClick={() => visitorsCount(salon)}
                  className="bg-[var(--Logo-color)] px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-[var(--button-color)]"
                  to={`/salonDetails/${salon._id}`}
                >
                  زيارة
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* ترقيم الصفحات */}
      {filteredSalons.length > salonsPerPage && (
        <div className="flex justify-center items-center gap-2 my-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-10 h-10 rounded-full ${
                currentPage === number
                  ? "bg-[var(--Logo-color)] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
}

export default Categories;
