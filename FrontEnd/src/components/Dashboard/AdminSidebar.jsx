import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardPage from "./DashboardPage";
import UsersListPage from "./UsersListPage";
import AddUserPage from "./AddUserPage";
import BookingsAllPage from "./BookingsAllPage";
import ReportsPage from "./ReportsPage";
import { useNavigate } from "react-router-dom";

// مكون الشريط الجانبي
const AdminSidebar = ({
  isCollapsed,
  setIsCollapsed,
  activeItem,
  setActiveItem,
  expandedMenus,
  toggleMenu,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserAuth();
  }, []);

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
        setUser(data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("تعذر الاتصال بالخادم للتحقق من حالة تسجيل الدخول");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user]);

  const menuItems = [
    {
      id: "dashboard",
      title: "لوحة التحكم",
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
      subItems: [
        { id: "users-list", title: "قائمة المستخدمين" },
        { id: "users-add", title: "إضافة مستخدم" },
        { id: "users-roles", title: "الأدوار والصلاحيات" },
      ],
    },
    {
      id: "bookings",
      title: "الحجوزات",
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
      subItems: [
        { id: "bookings-all", title: "جميع الحجوزات" },
        { id: "bookings-upcoming", title: "الحجوزات القادمة" },
        { id: "bookings-completed", title: "الحجوزات المكتملة" },
        { id: "bookings-canceled", title: "الحجوزات الملغاة" },
      ],
    },
    {
      id: "services",
      title: "الخدمات",
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
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      id: "reports",
      title: "التقارير",
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
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      ),
    },
    {
      id: "settings",
      title: "الإعدادات",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed top-0 right-0 h-screen bg-[#c4a484] text-white transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      dir="rtl"
    >
      {/* رأس الشريط الجانبي مع الشعار */}
      <div className="flex items-center justify-between p-4 border-b border-[#a0714f]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-[#8a5936]"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-[#a0714f] transition-colors"
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
      </div>

      {/* عناصر القائمة */}
      <nav className="mt-5 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => {
                setActiveItem(item.id);
                if (item.subItems) {
                  toggleMenu(item.id);
                }
              }}
              className={`w-full flex items-center ${
                !isCollapsed ? "justify-between" : "justify-center"
              } px-3 py-3 rounded-md transition-colors ${
                activeItem === item.id &&
                activeItem !== "users" &&
                activeItem !== "bookings"
                  ? "bg-[#8a5936] text-white"
                  : "text-white hover:bg-[#a0714f]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-white">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </div>

              {!isCollapsed && item.subItems && (
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedMenus[item.id] ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              )}
            </button>

            {/* القائمة الفرعية */}
            {!isCollapsed && item.subItems && (
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  expandedMenus[item.id]
                    ? "max-h-60 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveItem(subItem.id)}
                    className={`w-full flex items-center pr-10 py-2 mr-2 my-1 text-sm rounded-md ${
                      activeItem === subItem.id
                        ? "bg-[#8a5936] text-white"
                        : "text-white hover:bg-[#a0714f]"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white ml-2"></div>
                    {subItem.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ملف المستخدم */}
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
              أ
            </div>
          </div>

          {!isCollapsed && (
            <div>
              <p className="text-white font-medium">أحمد محمد</p>
              <p className="text-[#8a5936] text-xs">مدير النظام</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button className="mt-3 w-full flex items-center justify-center px-3 py-2 rounded-md bg-[#a0714f] hover:bg-[#8a5936] transition-colors">
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
  );
};

// المكون الرئيسي للوحة التحكم
const AdminPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const renderActivePage = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardPage />;
      case "users-list":
        return <UsersListPage />;
      case "users":
        return <UsersListPage />;
      case "users-add":
        return <AddUserPage />;
      case "bookings":
        return <BookingsAllPage />;
      case "bookings-all":
        return <BookingsAllPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
      />

      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "mr-20" : "mr-64"
        }`}
      >
        <main>{renderActivePage()}</main>
      </div>
    </div>
  );
};

export default AdminPanel;
