import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Calendar,
  Award,
  MapPin,
  Scissors,
  Star,
  Phone,
  Heart,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function EnhancedAboutPage() {
  const [salons, setSalons] = useState([]);
  const [users, setUsers] = useState([]);
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/salons"),
          axios.get("http://localhost:3000/api/users/all"),
          axios.get("http://localhost:3000/api/bookings"),
        ]);

        const fetchedSalons = Object.entries(salonsRes.data).map(
          ([key, value]) => ({
            id: key,
            ...value,
          })
        );

        const fetchedUsers = Object.entries(usersRes.data).map(
          ([key, value]) => ({
            id: key,
            ...value,
          })
        );

        const fetchedBooking = Object.entries(bookingsRes.data.data).map(
          ([key, value]) => ({
            id: key,
            ...value,
          })
        );

        setSalons(fetchedSalons);
        setUsers(fetchedUsers);
        setBooking(fetchedBooking);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <ScrollToTopButton />

      <div className="relative bg-[#B58152] py-24">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1
              dir="rtl"
              className="text-5xl md:text-6xl font-bold mb-4 text-white"
            >
              حول <span style={{ color: "#B58152" }}>بيوتي</span>
            </h1>
            <div
              className="w-24 h-1 mx-auto my-6"
              style={{ backgroundColor: "#a0714f" }}
            ></div>
            <p className="text-2xl md:text-3xl mb-8 text-white">
              الطريقة الذكية لحجز صالونات التجميل
            </p>
            <p className="text-lg max-w-2xl mx-auto text-white">
              اكتشف أفضل تجارب الجمال والعناية في منطقتك بنقرات قليلة.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row justify-center items-center">
          <div dir="rtl" className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-16">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: "#B58152" }}
            >
              رحلة جمالك تبدأ هنا
            </h2>
            <div
              className="w-32 h-1 mb-8"
              style={{ backgroundColor: "#a0714f" }}
            ></div>
            <p dir="rtl" className="text-lg mb-6" style={{ color: "#a0714f" }}>
              بيوتي يحدث ثورة في طريقة اكتشافك وحجزك لخدمات التجميل. تربطك
              منصتنا المنسقة بأفضل الصالونات والمنتجعات، مقدمةً تجربة حجز سلسة
              تضع الجمال في متناول يديك.
            </p>
            <p className="text-lg" style={{ color: "#a0714f" }}>
              من قص الشعر إلى العناية بالوجه، ومن العناية بالأظافر إلى جلسات
              المكياج، ابحث عن الخدمة والمحترف المثالي لمساعدتك على الظهور
              والشعور بأفضل حالاتك.
            </p>
          </div>
          <div className="lg:w-1/3">
            <div className="relative flex">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="../../public/logoo.png"
                  alt="تجربة الصالون"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#fdf6f0" }} className="py-20">
        <div className="container mx-auto px-25">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: "#B58152" }}
            >
              مهمتنا
            </h2>
            <div
              className="w-24 h-1 mx-auto mb-8"
              style={{ backgroundColor: "#a0714f" }}
            ></div>
            <p dir="rtl" className="text-lg" style={{ color: "#a0714f" }}>
              في بيوتي، نؤمن بأن خدمات التجميل يجب أن تكون متاحة وشفافة
              واستثنائية. نحن ملتزمون بإنشاء منصة يمكن للعملاء من خلالها العثور
              على وجهتهم المثالية للجمال، ويمكن للصالونات عرض مواهبهم الفريدة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
              <div className="h-48 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white p-5">
                    <Heart size={32} style={{ color: "#B58152" }} />
                  </div>
                </div>
              </div>
              <div
                className="p-6 text-center"
                style={{ backgroundColor: "#fbeee6" }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#B58152" }}
                >
                  تجربة العميل
                </h3>
                <p style={{ color: "#a0714f" }}>
                  خلق تجارب استثنائية من خلال الحجز البديهي والتوصيات الشخصية
                  ومعلومات الخدمة الشفافة.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
              <div className="h-48 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white p-5">
                    <Award size={32} style={{ color: "#B58152" }} />
                  </div>
                </div>
              </div>
              <div
                className="p-6 text-center"
                style={{ backgroundColor: "#fbeee6" }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#B58152" }}
                >
                  تميز الصالونات
                </h3>
                <p style={{ color: "#a0714f" }}>
                  الشراكة مع محترفين موهوبين يقدمون خدمات استثنائية ويحافظون على
                  أعلى معايير الجودة.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
              <div className="h-48 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white p-5">
                    <Shield size={32} style={{ color: "#B58152" }} />
                  </div>
                </div>
              </div>
              <div
                className="p-6 text-center"
                style={{ backgroundColor: "#fbeee6" }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#B58152" }}
                >
                  ابتكارات الجمال
                </h3>
                <p style={{ color: "#a0714f" }}>
                  استخدام التكنولوجيا لتغيير عمليات صناعة الجمال وإنشاء روابط
                  سلسة بين العملاء والمحترفين.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2
            dir="rtl"
            className="text-4xl font-bold mb-6"
            style={{ color: "#B58152" }}
          >
            كيف يعمل بيوتي
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-8"
            style={{ backgroundColor: "#a0714f" }}
          ></div>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#a0714f" }}>
            البحث وحجز موعد جمالك القادم لم يكن أسهل من قبل.
          </p>
        </div>

        <div
          dir="rtl"
          className="flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex flex-col items-center mb-10 md:mb-0 md:w-1/3 px-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#fbeee6" }}
            >
              <MapPin size={40} style={{ color: "#B58152" }} />
            </div>
            <div className="text-center">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                1. اكتشف
              </h3>
              <p style={{ color: "#a0714f" }}>
                تصفح الصالونات حسب الموقع، واقرأ التقييمات، واستكشف الخدمات
                بأسعار شفافة.
              </p>
            </div>
          </div>

          <div
            className="hidden md:block w-16 h-1"
            style={{ backgroundColor: "#B58152" }}
          ></div>

          <div className="flex flex-col items-center mb-10 md:mb-0 md:w-1/3 px-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#fbeee6" }}
            >
              <Scissors size={40} style={{ color: "#B58152" }} />
            </div>
            <div className="text-center">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                2. اختر
              </h3>
              <p style={{ color: "#a0714f" }}>
                اختر الخدمة المرغوبة ومصفف الشعر أو خبير التجميل المفضل لديك.
              </p>
            </div>
          </div>

          <div
            className="hidden md:block w-16 h-1"
            style={{ backgroundColor: "#B58152" }}
          ></div>

          <div className="flex flex-col items-center md:w-1/3 px-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#fbeee6" }}
            >
              <Calendar size={40} style={{ color: "#B58152" }} />
            </div>
            <div className="text-center">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#B58152" }}
              >
                3. احجز
              </h3>
              <p style={{ color: "#a0714f" }}>
                اختر التاريخ والوقت المناسبين، وقم بتأكيد الحجز، واحصل على تأكيد
                فوري.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-cover bg-center relative">
        <div className="absolute inset-0 bg-[#753600] opacity-70 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div dir="rtl" className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">مجتمع بيوتي</h2>
            <div
              className="w-24 h-1 mx-auto mb-8"
              style={{ backgroundColor: "#B58152" }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            >
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: "#B58152" }}
              >
                +{salons.length}
              </div>
              <div className="text-xl" style={{ color: "#a0714f" }}>
                صالون شريك
              </div>
            </div>

            <div
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            >
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: "#B58152" }}
              >
                +{booking.length}
              </div>
              <div className="text-xl" style={{ color: "#a0714f" }}>
                حجز يومي
              </div>
            </div>

            <div
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            >
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: "#B58152" }}
              >
                +{users.length}
              </div>
              <div className="text-xl" style={{ color: "#a0714f" }}>
                عميل سعيد
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#fdf6f0" }} className="py-20">
        <div className=" mx-auto px-6">
          <div className="flex flex-col mx-20 lg:flex-row justify-between items-center">
            <div dir="rtl" className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-16">
              <h2
                className="text-4xl font-bold mb-6"
                style={{ color: "#B58152" }}
              >
                تواصل معنا
              </h2>
              <div
                className="w-32 h-1 mb-8"
                style={{ backgroundColor: "#a0714f" }}
              ></div>
              <p className="text-lg mb-10" style={{ color: "#a0714f" }}>
                لديك أسئلة حول بيوتي ؟ يسرنا الاستماع إليك! فريقنا مستعد
                لمساعدتك في البدء، سواء كنت عميلاً تريد الحجز أو صالوناً مهتماً
                بالانضمام إلى منصتنا.
              </p>

              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: "#fbeee6" }}
                >
                  <Phone size={24} style={{ color: "#B58152" }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: "#B58152" }}
                  >
                    اتصل بنا
                  </h3>
                  <p style={{ color: "#a0714f" }}>+962 780798572</p>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: "#fbeee6" }}
                >
                  <MapPin size={24} style={{ color: "#B58152" }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: "#B58152" }}
                  >
                    زرنا
                  </h3>
                  <p style={{ color: "#a0714f" }}>الأردن, عمان</p>
                </div>
              </div>

              <Link
                to="/ContactUs"
                className="px-6 m-5 py-4 mt-6 rounded-lg text-white font-medium text-lg transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: "#a0714f" }}
              >
                اتصل بفريقنا
              </Link>
            </div>

            <div className=" lg:ml-auto">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://i.pinimg.com/474x/57/9b/33/579b33d1580c02b027730670f9bf779a.jpg"
                  alt="اتصل بنا"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
