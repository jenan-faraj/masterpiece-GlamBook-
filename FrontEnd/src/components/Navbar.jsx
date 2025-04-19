import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    fetchUserAuth();
  }, []);

  // دالة للحصول على التوكن من الخادم
  const fetchUserAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/get_token", {
        method: "GET",
        credentials: "include", // مهم للكوكيز
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          try {
            // فك تشفير التوكن للحصول على معلومات المستخدم
            const payload = data.token.split(".")[1];
            const decodedToken = JSON.parse(atob(payload));

            if (decodedToken && decodedToken.userId) {
              setUserId(decodedToken.userId);
              setIsLoggedIn(true);
              // استخدام اسم المستخدم من التوكن إذا كان متاحًا
              setUsername(decodedToken.username);
              console.log(decodedToken);
            } else {
              setIsLoggedIn(false);
            }
          } catch (tokenError) {
            // معالجة أخطاء فك تشفير التوكن بهدوء
            console.log("تنسيق التوكن غير صالح");
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } else {
        // لا يوجد حاجة للإبلاغ عن خطأ، فقط تعيين حالة تسجيل الدخول إلى false
        setIsLoggedIn(false);
      }
    } catch (error) {
      // تسجيل خطأ بشكل هادئ دون إظهار رسائل خطأ للمستخدم
      console.log("تعذر الاتصال بالخادم للتحقق من حالة تسجيل الدخول");
      setIsLoggedIn(false);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      // استدعاء نقطة نهاية تسجيل الخروج
      const response = await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include", // إرسال الكوكيز مع الطلب
        headers: {
          "Content-Type": "application/json",
        },
      });

      // بغض النظر عن الاستجابة، نقوم بتسجيل الخروج محليًا
      setIsLoggedIn(false);
      setUserId("");
      setUsername("");

      // إغلاق القائمة في حالة الشاشات الصغيرة
      if (isOpen) {
        setIsOpen(false);
      }

      // إعلام المستخدم بنجاح تسجيل الخروج
      if (response.ok) {
        // يمكنك إضافة إشعار نجاح هنا إذا كنت تستخدم مكتبة إشعارات
      } else {
        console.log("تم تسجيل الخروج محليًا، ولكن هناك مشكلة في الخادم");
      }
    } catch (error) {
      // تسجيل الخروج محليًا حتى في حالة حدوث خطأ
      setIsLoggedIn(false);
      setUserId("");
      setUsername("");
      console.log("تم تسجيل الخروج محليًا، ولكن تعذر الاتصال بالخادم");
      navigate("/");
    }
  };

  // قائمة الروابط الرئيسية
  const navLinks = [
    { title: "الرئيسية", path: "/" },
    { title: "الصالونات", path: "/categories" },
    { title: "من نحن", path: "/aboutUs" },
    { title: "اتصل بنا", path: "/contactUs" },
    { title: "انضم إلينا", path: "/RegisterSalon" },
  ];

  return (
    <header className="w-full bg-[#F9F3F1] shadow-md">
      <nav className="container mx-auto px-4" dir="rtl">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <Link to="/" className="text-[#B58152] text-2xl md:text-3xl font-bold">
            GlamBook
          </Link>

          {/* قائمة التنقل للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center justify-between flex-1 mx-8">
            <ul className="flex items-center text-lg space-x-reverse space-x-3 text-[#B58152] font-medium">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="px-3 py-2 rounded hover:bg-[#f5e6e1] transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* أزرار تسجيل الدخول/الخروج للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center space-x-reverse space-x-4">
            {isLoggedIn ? (
              <ul className="flex items-center text-lg space-x-reverse space-x-3 text-[#B58152] font-medium">
                <li>
                  <Link
                    to="/userProfile"
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#f5e6e1] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{username}</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-[#B58152] hover:bg-[#a37245] transition-colors text-white"
                  >
                    <span>تسجيل خروج</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="flex items-center text-lg space-x-reverse space-x-3 text-[#B58152] font-medium">
                <li>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-[#B58152] text-white rounded-md hover:bg-[#a37245] transition-colors shadow-sm"
                  >
                    تسجيل الدخول
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* زر القائمة للشاشات الصغيرة */}
          <button
            className="lg:hidden text-[#B58152] text-2xl p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* قائمة التنقل للشاشات الصغيرة */}
        {isOpen && (
          <div className="lg:hidden bg-[#F9F3F1] border-t border-[#e6d8d3] py-2">
            <ul className="text-[#B58152]">
              {navLinks.map((link) => (
                <li key={link.path} className="border-b border-[#e6d8d3]">
                  <Link
                    to={link.path}
                    className="block py-3 px-4 hover:bg-[#f5e6e1] transition-colors"
                    onClick={toggleMenu}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}

              {isLoggedIn ? (
                <>
                  <li className="border-b border-[#e6d8d3]">
                    <Link
                      to="/userProfile"
                      className="flex items-center justify-between py-3 px-4 hover:bg-[#f5e6e1] transition-colors"
                      onClick={toggleMenu}
                    >
                      <span>{username}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </li>
                  <li className="py-3 px-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#B58152] hover:bg-[#a37245] transition-colors text-white rounded-md"
                    >
                      <span>تسجيل خروج</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </li>
                </>
              ) : (
                <li className="py-3 px-4">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 bg-[#B58152] text-white rounded-md hover:bg-[#a37245] transition-colors shadow-sm"
                    onClick={toggleMenu}
                  >
                    تسجيل الدخول
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;