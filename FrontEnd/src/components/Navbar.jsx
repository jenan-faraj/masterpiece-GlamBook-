import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // إضافة استخدام الموقع الحالي

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    fetchUserAuth();

    // إضافة مستمع لحدث التمرير
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // تنظيف المستمع عند إزالة المكون
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // دالة للحصول على التوكن من الخادم
  const fetchUserAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "GET",
        credentials: "include", // مهم للكوكيز
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        setUsername(data.username);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
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

  // دالة للتحقق ما إذا كان الرابط نشطاً
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  };

  return (
    <>
      {/* إضافة عنصر وهمي للحفاظ على مساحة التمرير عندما يكون Navbar ثابتًا */}
      <div className="h-16"></div>

      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#F9F3F1] shadow-md" : "bg-[#F9F3F1] shadow-md"
        }`}
      >
        <nav className="container xl:px-20 mx-auto px-4" dir="rtl">
          <div className="flex justify-between items-center h-16">
            {/* الشعار */}
            <img
              className=" h-14 object-cover"
              src="../../public/بيـــــــــوتي.png"
              alt="بيوتي"
            />

            {/* قائمة التنقل للشاشات الكبيرة */}
            <div className="hidden lg:flex items-center justify-between flex-1 mx-8">
              <ul className="flex items-center text-lg space-x-reverse space-x-3 text-[#B58152] font-medium">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-3 py-2 rounded transition-colors ${
                        isActive(link.path)
                          ? "bg-[#B58152] text-white font-bold" // الرابط النشط
                          : "hover:bg-[#f5e6e1]" // الروابط الأخرى
                      }`}
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
                      className={`flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-[#f5e6e1]`}
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
                      className={`px-4 py-2 rounded-md transition-colors shadow-sm ${
                        isActive("/login")
                          ? "bg-[#a37245] text-white font-bold"
                          : "bg-[#B58152] text-white hover:bg-[#a37245]"
                      }`}
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
                      className={`block py-3 px-4 transition-colors ${
                        isActive(link.path)
                          ? "bg-[#B58152] text-white font-bold"
                          : "hover:bg-[#f5e6e1]"
                      }`}
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
                        className={`flex items-center justify-between py-3 px-4 transition-colors hover:bg-[#f5e6e1]`}
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
                      className={`block w-full text-center px-4 py-2 rounded-md transition-colors shadow-sm ${
                        isActive("/login")
                          ? "bg-[#a37245] text-white font-bold"
                          : "bg-[#B58152] text-white hover:bg-[#a37245]"
                      }`}
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
    </>
  );
};

export default Navbar;
