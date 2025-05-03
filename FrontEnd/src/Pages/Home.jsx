import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Calendar,
  Search,
  Users,
  Star,
  ArrowRight,
  Scissors,
  Heart,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import HeroSection from "../components/HeroSection";

// StarRating component to display stars based on rating
const StarRating = ({ rating }) => {
  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex justify-center">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="text-yellow-400 fill-yellow-400"
          size={16}
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className="text-yellow-400" size={16} />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-yellow-400" size={16} />
      ))}
    </div>
  );
};

export default function ArabicHomePage() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [topRatedSalons, setTopRatedSalons] = useState([]);

  // Fetch data from Firebase using Axios
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/salons")
      .then((response) => {
        // Convert Firebase data to array (as it comes as an object)
        const fetchedSalons = [];
        for (let key in response.data) {
          fetchedSalons.push({
            id: key,
            ...response.data[key],
          });
        }

        // ترتيب حسب التقييم من الأعلى للأقل
        const sortedByRating = [...fetchedSalons].sort(
          (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
        );

        // نأخذ أعلى 4 صالونات
        const topFour = sortedByRating.slice(0, 4);

        setSalons(fetchedSalons);
        setFilteredSalons(fetchedSalons);
        setTopRatedSalons(topFour);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Apply search and filter whenever either changes
  useEffect(() => {
    const filtered = salons.filter((salon) => {
      // Check if salon name includes search term (case insensitive)
      const nameMatch = salon.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Check if salon rating matches the filter (if set)
      const ratingMatch =
        ratingFilter === "" ||
        (parseFloat(salon.rating) >= parseFloat(ratingFilter) &&
          parseFloat(salon.rating) < parseFloat(ratingFilter) + 1);

      return nameMatch && ratingMatch;
    });

    setFilteredSalons(filtered);
  }, [searchTerm, ratingFilter, salons]);

  // Handler for search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  async function visitorsCount(salon) {
    if (!salon || !salon._id) {
      console.error("Invalid salon data");
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

      console.log("Salon updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating salon:",
        error.response?.data || error.message
      );
    }
  }

  // Handler for rating filter
  const handleRatingFilter = (e) => {
    setRatingFilter(e.target.value);
  };
  const categories = [
    {
      name: "تصفيف الشعر",
      icon: <Scissors size={32} />,
      bgColor: "#fbeee6",
      iconColor: "#B58152",
    },
    {
      name: "العناية بالوجه",
      icon: <Sparkles size={32} />,
      bgColor: "#fbeee6",
      iconColor: "#B58152",
    },
    {
      name: "العناية بالأظافر",
      icon: <Star size={32} />,
      bgColor: "#fbeee6",
      iconColor: "#B58152",
    },
    {
      name: "المكياج",
      icon: <Heart size={32} />,
      bgColor: "#fbeee6",
      iconColor: "#B58152",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "سارة أحمد",
      text: "غلام سبوت غيّر طريقة حجزي لمواعيد التجميل. سهل الاستخدام ويوفر العديد من الخيارات الرائعة!",
      image: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      id: 2,
      name: "ليلى محمد",
      text: "وجدت صالون أحلامي من خلال هذا التطبيق. الحجز كان سهلاً والنتائج كانت رائعة.",
      image: "/api/placeholder/64/64",
      rating: 4,
    },
    {
      id: 3,
      name: "نور الهاشمي",
      text: "تطبيق رائع! أحب كيف يمكنني رؤية أعمال المصففين قبل الحجز. توفير للوقت والجهد.",
      image: "/api/placeholder/64/64",
      rating: 5,
    },
  ];

  return (
    <div className="bg-white min-h-screen" dir="rtl" lang="ar">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <div className="py-20 container mx-auto lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#B58152" }}>
            استكشف خدماتنا
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-8"
            style={{ backgroundColor: "#a0714f" }}
          ></div>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#a0714f" }}>
            اكتشف مجموعة متنوعة من خدمات التجميل والعناية الشخصية المصممة لتناسب
            احتياجاتك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div
                className="h-40 flex items-center justify-center"
                style={{ backgroundColor: category.bgColor }}
              >
                <div className="p-4 rounded-full bg-white">
                  {React.cloneElement(category.icon, {
                    style: { color: category.iconColor },
                  })}
                </div>
              </div>
              <div className="p-6 text-center">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#B58152" }}
                >
                  {category.name}
                </h3>
                <Link
                  to={`/category/${category.name}`}
                  className="inline-flex items-center font-medium"
                  style={{ color: "#a0714f" }}
                >
                  عرض الصالونات
                  <ArrowRight size={16} className="mr-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ backgroundColor: "#fdf6f0" }} className="py-20 lg:px-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: "#B58152" }}
            >
              كيف يعمل التطبيق
            </h2>
            <div
              className="w-24 h-1 mx-auto mb-8"
              style={{ backgroundColor: "#a0714f" }}
            ></div>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#a0714f" }}
            >
              عملية سهلة وسريعة تمكنك من حجز موعدك في صالون التجميل المفضل لديك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#fbeee6" }}
              >
                <Search size={32} style={{ color: "#B58152" }} />
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                1. اختر الخدمة
              </h3>
              <p style={{ color: "#a0714f" }}>
                تصفح مجموعة واسعة من الخدمات والصالونات واقرأ التقييمات
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#fbeee6" }}
              >
                <Calendar size={32} style={{ color: "#B58152" }} />
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                2. احجز موعدك
              </h3>
              <p style={{ color: "#a0714f" }}>
                اختر التاريخ والوقت المناسبين وأكد حجزك بنقرة واحدة
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#fbeee6" }}
              >
                <Sparkles size={32} style={{ color: "#B58152" }} />
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                3. استمتع بالخدمة
              </h3>
              <p style={{ color: "#a0714f" }}>
                اذهب إلى الصالون في الموعد المحدد واستمتع بتجربة جمالية مميزة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Salon Cards */}
      <h2 className="text-2xl font-bold text-[var(--Logo-color)] mt-20 flex justify-center items-center  my-4 text-center">
        أفضل ٤ صالونات
      </h2>
      <div className="flex lg:px-20 flex-wrap justify-evenly gap-5 mb-20 my-10">
        {loading ? (
          <div className="w-full text-center py-8">Loading salons...</div>
        ) : error ? (
          <div className="w-full text-center py-8 text-red-500">
            Error loading salons. Please try again later.
          </div>
        ) : topRatedSalons.length === 0 ? (
          <div className="w-full text-center py-8">
            No salons found matching your search criteria.
          </div>
        ) : (
          topRatedSalons.map((salon) => {
            return (
              <div
                key={salon._id}
                className="group relative w-80 h-72 bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden shadow-md"
              >
                {/* Background image instead of gradient div */}
                <div className="absolute top-0 w-80 h-24 rounded-t-2xl overflow-hidden transition-all duration-500 group-hover:h-72 group-hover:w-80 group-hover:rounded-b-2xl">
                  <img
                    src={
                      salon.bgImage ||
                      "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"
                    }
                    alt="Profile background"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile picture instead of blue circle */}
                <div className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 overflow-hidden group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500">
                  <img
                    src={
                      salon.profileImage ||
                      "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"
                    }
                    alt="George Johnson"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="z-10 group-hover:-translate-y-10 bg-[#ffffff74] p-2 rounded-2xl transition-all duration-500">
                  <span className="text-2xl font-semibold">{salon.name}</span>
                  {/* Replace the plain rating text with star rating component */}
                  <div className="flex flex-col items-center">
                    <StarRating rating={salon.rating} />
                  </div>
                </div>

                <Link
                  onClick={() => visitorsCount(salon)}
                  className="bg-[var(--Logo-color)] px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-[var(--button-color)]"
                  to={`/salonDetails/${salon._id}`}
                >
                  visit
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* Join as Salon Partner */}
      <div style={{ backgroundColor: "#fdf6f0" }} className="py-20 lg:px-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#B58152" }}>
            هل أنت صاحب صالون؟
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-8"
            style={{ backgroundColor: "#a0714f" }}
          ></div>
          <p
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: "#a0714f" }}
          >
            انضم إلى شبكتنا المتنامية من صالونات التجميل وابدأ في استقبال
            الحجوزات عبر الإنترنت اليوم
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: "#fbeee6" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "white" }}
              >
                <Users size={28} style={{ color: "#B58152" }} />
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                زيادة قاعدة عملائك
              </h3>
              <p style={{ color: "#a0714f" }}>
                الوصول إلى آلاف العملاء المحتملين الذين يبحثون عن خدمات مثل
                خدماتك
              </p>
            </div>

            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: "#fbeee6" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "white" }}
              >
                <Calendar size={28} style={{ color: "#B58152" }} />
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                إدارة سهلة للمواعيد
              </h3>
              <p style={{ color: "#a0714f" }}>
                لوحة تحكم سهلة الاستخدام تُمكنك من إدارة الحجوزات والمواعيد
                بكفاءة
              </p>
            </div>

            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: "#fbeee6" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "white" }}
              >
                <MessageSquare size={28} style={{ color: "#B58152" }} />
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                تعزيز سمعتك
              </h3>
              <p style={{ color: "#a0714f" }}>
                اجمع تقييمات العملاء وأبرز جودة خدماتك للعملاء المحتملين
              </p>
            </div>
          </div>

          <Link
            to="/RegisterSalon"
            className="inline-block px-8 py-4 rounded-lg text-white font-medium text-lg transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: "#a0714f" }}
          >
            انضم إلى شركائنا الآن
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#703603] py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            جاهز لتجربة جمالية مميزة؟
          </h2>
          <p className="text-xl mb-10 text-white max-w-2xl mx-auto">
            احجز موعدك الآن واستمتع بتجربة لا مثيل لها في أفضل صالونات التجميل
            في مدينتك
          </p>
          <Link
            to="/explore"
            className="inline-block px-8 py-4 rounded-lg text-[#703603] font-medium text-lg bg-white transition-all duration-300 hover:shadow-lg"
          >
            اكتشف الصالونات
          </Link>
        </div>
      </div>
    </div>
  );
}
