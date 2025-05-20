import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import DashboardPage from "./DashboardPage";
import UsersControllerPage from "./UsersControllerPage";
import SalonsControlerPage from "./SalonsControlerPage";
import BookingsAllPage from "./BookingsAllPage";
import ContactUsPage from "./ContactUsPage";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserAuth();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUserAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);

        if (data.role !== "admin") {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("تعذر الاتصال بالخادم للتحقق من حالة تسجيل الدخول");
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "لوحة التحكم",
      path: "/admin",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          ></path>
        </svg>
      ),
    },
    {
      id: "users",
      title: "المستخدمين",
      path: "/admin/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          ></path>
        </svg>
      ),
    },
    {
      id: "salons",
      title: "الصالونات",
      path: "/admin/salons",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          ></path>
        </svg>
      ),
    },
    {
      id: "bookings",
      title: "الحجوزات",
      path: "/admin/bookings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      id: "contact",
      title: "اتصل بنا",
      path: "/admin/contact",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-[#8a5936] text-white shadow-lg hover:bg-[#a0714f] transition-colors"
          aria-label="فتح القائمة"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      )}

      <aside
        className={`fixed top-0 right-0 h-screen bg-[#c4a484] text-white transition-all duration-300 ${
          isCollapsed ? (isMobile ? "hidden" : "w-20") : "w-64"
        } z-40 shadow-xl`}
        dir="rtl"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#a0714f]">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src="../../../public/admin-logo.png" className=" w-[150px] text-white" />
            </div>
          )}

          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md hover:bg-[#a0714f] transition-colors"
              aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
            >
              {isCollapsed ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  ></path>
                </svg>
              )}
            </button>
          )}

          {isMobile && !isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-md hover:bg-[#a0714f] transition-colors"
              aria-label="إغلاق القائمة"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>

        <nav className="mt-5 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center ${
                !isCollapsed ? "justify-start" : "justify-center"
              } px-3 py-3 rounded-md transition-colors mb-1 ${
                location.pathname === item.path
                  ? "bg-[#8a5936] text-white"
                  : "text-white hover:bg-[#a0714f]"
              }`}
            >
              <span className="text-white">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium mr-3">{item.title}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 right-0 w-full border-t border-[#a0714f] p-4">
          <div
            className={`flex ${
              isCollapsed
                ? "justify-center"
                : "items-center space-x-reverse space-x-3"
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#8a5936] flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0) || "أ"}
              </div>
            </div>

            {!isCollapsed && (
              <div className="mx-3">
                <p className="text-white font-medium">
                  {user?.username || "أحمد محمد"}
                </p>
                <p className="text-[#f0e0d0] text-xs">
                  {user?.role === "admin" ? "مدير النظام" : "مستخدم"}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center px-3 py-2 rounded-md bg-[#a0714f] hover:bg-[#8a5936] transition-colors"
            >
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span className="text-sm">تسجيل الخروج</span>
            </button>
          )}
        </div>
      </aside>

      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.role === "admin") {
            setIsAdmin(true);
          } else {
            navigate("/");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("خطأ في التحقق من صلاحيات المستخدم:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a5936]"></div>
      </div>
    );
  }

  return isAdmin ? children : null;
};

const AdminPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "mr-0 md:mr-20" : "mr-0 md:mr-64"
        } pt-4 px-6`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <AdminProtectedRoute>
                <DashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminProtectedRoute>
                <UsersControllerPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/salons"
            element={
              <AdminProtectedRoute>
                <SalonsControlerPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <AdminProtectedRoute>
                <BookingsAllPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <AdminProtectedRoute>
                <ContactUsPage />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
