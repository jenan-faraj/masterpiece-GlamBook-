import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Search,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Scissors,
  Clock,
  Heart,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import HeroSection from "../components/HeroSection";

export default function ArabicHomePage() {
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

  const featuredSalons = [
    {
      id: 1,
      name: "سبا روز الفاخر",
      location: "وسط المدينة، الرياض",
      rating: 4.9,
      reviews: 128,
      image: "/api/placeholder/400/300",
    },
    {
      id: 2,
      name: "صالون لمسة جمال",
      location: "الحي الشرقي، جدة",
      rating: 4.8,
      reviews: 95,
      image: "/api/placeholder/400/300",
    },
    {
      id: 3,
      name: "مركز نور للتجميل",
      location: "الخالدية، دبي",
      rating: 4.7,
      reviews: 210,
      image: "/api/placeholder/400/300",
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
      <div className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#B58152" }}>
            استكشف خدماتنا
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-8"
            style={{ backgroundColor: "#a0714f" }}
          ></div>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#a0714f" }}>
            اكتشف مجموعة متنوعة من خدمات التجميل والعناية الشخصية المصممة لتناسب احتياجاتك
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
      <div style={{ backgroundColor: "#fdf6f0" }} className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: "#B58152" }}>
              كيف يعمل التطبيق
            </h2>
            <div
              className="w-24 h-1 mx-auto mb-8"
              style={{ backgroundColor: "#a0714f" }}
            ></div>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#a0714f" }}>
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
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#B58152" }}>
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
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#B58152" }}>
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
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#B58152" }}>
                3. استمتع بالخدمة
              </h3>
              <p style={{ color: "#a0714f" }}>
                اذهب إلى الصالون في الموعد المحدد واستمتع بتجربة جمالية مميزة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Salons */}
      <div className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#B58152" }}>
              صالونات مميزة
            </h2>
            <div
              className="w-24 h-1 mb-6"
              style={{ backgroundColor: "#a0714f" }}
            ></div>
            <p className="text-lg max-w-2xl" style={{ color: "#a0714f" }}>
              اكتشف أعلى الصالونات تقييماً في مدينتك
            </p>
          </div>
          <Link
            to="/salons"
            className="inline-flex items-center mt-6 md:mt-0 font-semibold"
            style={{ color: "#B58152" }}
          >
            عرض جميع الصالونات
            <ArrowRight size={20} className="mr-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSalons.map((salon) => (
            <div
              key={salon.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-56">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center">
                  <Star size={16} fill="#FFD700" stroke="#FFD700" className="ml-1" />
                  <span className="font-medium">{salon.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: "#B58152" }}>
                  {salon.name}
                </h3>
                <div className="flex items-center mb-4" style={{ color: "#a0714f" }}>
                  <MapPin size={16} className="ml-1" />
                  <span>{salon.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{salon.reviews} تقييم</span>
                  <Link
                    to={`/salon/${salon.id}`}
                    className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: "#a0714f" }}
                  >
                    حجز الآن
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ backgroundColor: "#fdf6f0" }} className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: "#B58152" }}>
              ماذا يقول عملاؤنا
            </h2>
            <div
              className="w-24 h-1 mx-auto mb-8"
              style={{ backgroundColor: "#a0714f" }}
            ></div>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#a0714f" }}>
              استمع إلى تجارب العملاء الحقيقيين مع غلام سبوت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full ml-4"
                  />
                  <div>
                    <h3 className="font-bold" style={{ color: "#B58152" }}>
                      {testimonial.name}
                    </h3>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < testimonial.rating ? "#FFD700" : "transparent"}
                          stroke={i < testimonial.rating ? "#FFD700" : "#a0714f"}
                          className="ml-1"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic" style={{ color: "#a0714f" }}>
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Download */}
      <div className="py-20 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center bg-[#703603] rounded-2xl overflow-hidden">
          <div className="lg:w-1/2 p-10 lg:p-16">
            <h2 className="text-4xl font-bold mb-6 text-white">
              احصل على تطبيق غلام سبوت
            </h2>
            <div
              className="w-24 h-1 mb-8"
              style={{ backgroundColor: "#B58152" }}
            ></div>
            <p className="text-lg mb-8 text-white">
              قم بتنزيل تطبيقنا للهواتف الذكية واحجز موعد جمالك التالي أينما كنت وفي أي وقت. استمتع بتجربة حجز سلسة وإشعارات للتذكير بمواعيدك.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-colors"
              >
                <div className="mr-3">
                  <div className="text-xs">احصل عليه من</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-colors"
              >
                <div className="mr-3">
                  <div className="text-xs">متوفر على</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <img
              src="/api/placeholder/640/480"
              alt="تطبيق غلام سبوت"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Join as Salon Partner */}
      <div style={{ backgroundColor: "#fdf6f0" }} className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#B58152" }}>
            هل أنت صاحب صالون؟
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-8"
            style={{ backgroundColor: "#a0714f" }}
          ></div>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "#a0714f" }}>
            انضم إلى شبكتنا المتنامية من صالونات التجميل وابدأ في استقبال الحجوزات عبر الإنترنت اليوم
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
                الوصول إلى آلاف العملاء المحتملين الذين يبحثون عن خدمات مثل خدماتك
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
                لوحة تحكم سهلة الاستخدام تُمكنك من إدارة الحجوزات والمواعيد بكفاءة
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
            احجز موعدك الآن واستمتع بتجربة لا مثيل لها في أفضل صالونات التجميل في مدينتك
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