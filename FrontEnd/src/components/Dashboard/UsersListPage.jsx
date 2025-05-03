import { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [roles] = useState(["admin", "user", "salon"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // فلترات جديدة
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Color theme variables
  const logoColor = "#8a5936";
  const buttonColor = "#a0714f";
  const textColor = "#c4a484";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/dash?page=${currentPage}&limit=10`
        );
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
        setError("فشل في تحميل المستخدمين");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);
  
  // تطبيق الفلترة عند تغيير search query أو role filter
  useEffect(() => {
    let result = [...users];
    
    // فلترة حسب الدور
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // فلترة حسب البحث (الاسم أو البريد الإلكتروني)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.username.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  // حذف مستخدم
  const handleDeleteUser = async (userId) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المستخدم؟")) {
      try {
        await axios.patch(
          `http://localhost:3000/api/users/delete/${userId}`,
          {},
          {
            withCredentials: true,
          }
        );
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
      } catch (err) {
        setError("حدث خطأ أثناء حذف المستخدم");
        console.error(err);
      }
    }
  };

  // حفظ تعديل دور المستخدم
  const saveRoleChange = async (userId) => {
    try {
      await axios.put(`http://localhost:3000/api/users/me/${userId}`, {
        role: editRole,
      });
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: editRole } : user
      );
      setUsers(updatedUsers);
      setEditingUserId(null);
    } catch (err) {
      setError("حدث خطأ أثناء تحديث دور المستخدم");
      console.error(err);
    }
  };

  // إلغاء تعديل دور المستخدم
  const cancelEdit = () => {
    setEditingUserId(null);
  };

  const startEditRole = (user) => {
    setEditingUserId(user._id);
    setEditRole(user.role);
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
  };

  if (error)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-md border border-red-200">
          {error}
        </div>
      </div>
    );

  return (
    <div className="p-6 min-h-screen" style={{ direction: "rtl" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: logoColor }}>
            إدارة المستخدمين
          </h1>
          <div className="flex gap-2">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: textColor, color: "white" }}
            >
              {filteredUsers.length} مستخدم
            </span>
          </div>
        </div>
        
        {/* فلاتر البحث الجديدة */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-[#f4e5d6]">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" style={{ color: logoColor }}>
                البحث
              </label>
              <input
                type="text"
                placeholder="بحث بالاسم أو البريد الإلكتروني"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2"
                style={{ borderColor: textColor, direction: "rtl" }}
              />
            </div>
            
            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium mb-1" style={{ color: logoColor }}>
                فلترة حسب الدور
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2"
                style={{ borderColor: textColor, direction: "rtl" }}
              >
                <option value="all">جميع الأدوار</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded text-white w-full lg:w-auto transition-all duration-300 hover:opacity-80"
                style={{ backgroundColor: buttonColor }}
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-pulse flex space-x-4">
              <div
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: textColor }}
              ></div>
              <div className="flex-1 space-y-4 py-1">
                <div
                  className="h-4 rounded w-3/4"
                  style={{ backgroundColor: textColor }}
                ></div>
                <div className="space-y-2">
                  <div
                    className="h-4 rounded"
                    style={{ backgroundColor: textColor }}
                  ></div>
                  <div
                    className="h-4 rounded w-5/6"
                    style={{ backgroundColor: textColor }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* عرض للشاشات المتوسطة والكبيرة */}
            <div className="hidden lg:block overflow-hidden shadow-md rounded-lg bg-white border border-[#f4e5d6]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead>
                    <tr
                      className="text-right"
                      style={{ backgroundColor: logoColor }}
                    >
                      <th className="px-6 py-4 text-sm font-medium text-white uppercase tracking-wider">
                        الاسم
                      </th>
                      <th className="px-6 py-4 text-sm font-medium text-white uppercase tracking-wider">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-4 text-sm font-medium text-white uppercase tracking-wider">
                        الدور
                      </th>
                      <th className="px-6 py-4 text-sm font-medium text-white uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#f4e5d6]">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className={
                          index % 2 === 0
                            ? "bg-[#f9f5f1] hover:bg-[#f4e5d6]"
                            : "bg-white hover:bg-[#f9f5f1]"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUserId === user._id ? (
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-300"
                              style={{ borderColor: textColor }}
                              dir="rtl"
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                              style={{
                                backgroundColor:
                                  user.role === "admin"
                                    ? logoColor
                                    : user.role === "salon"
                                    ? buttonColor
                                    : textColor,
                                color: "white",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              }}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex justify-end space-x-2">
                            {editingUserId === user._id ? (
                              <>
                                <button
                                  onClick={cancelEdit}
                                  className="ml-2 px-3 py-1 rounded text-white transition-all duration-300 hover:opacity-80 focus:ring-2 focus:outline-none"
                                  style={{ backgroundColor: "#9CA3AF" }}
                                >
                                  إلغاء
                                </button>
                                <button
                                  onClick={() => saveRoleChange(user._id)}
                                  className="px-3 py-1 rounded text-white transition-all duration-300 hover:opacity-80 focus:ring-2 focus:outline-none"
                                  style={{ backgroundColor: logoColor }}
                                >
                                  حفظ
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="ml-2 px-3 py-1 rounded text-white transition-all duration-300 hover:opacity-80 focus:ring-2 focus:outline-none"
                                  style={{
                                    backgroundColor: "#EF4444",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  حذف
                                </button>
                                <button
                                  onClick={() => startEditRole(user)}
                                  className="px-3 py-1 rounded text-white transition-all duration-300 hover:opacity-80 focus:ring-2 focus:outline-none"
                                  style={{
                                    backgroundColor: buttonColor,
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  تعديل
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* عرض للشاشات الصغيرة */}
            <div className="lg:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow-md p-4 border-r-4"
                  style={{ borderRightColor: logoColor }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{user.username}</h3>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                    <span
                      className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                      style={{
                        backgroundColor:
                          user.role === "admin"
                            ? logoColor
                            : user.role === "salon"
                            ? buttonColor
                            : textColor,
                      }}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {editingUserId === user._id ? (
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-gray-700 font-medium ml-2">
                            الدور:
                          </span>
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="border rounded px-2 py-1 text-sm flex-grow"
                            style={{ borderColor: textColor }}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelEdit}
                            className="ml-2 px-3 py-2 rounded text-white w-24 transition-all duration-300 hover:opacity-80"
                            style={{ backgroundColor: "#9CA3AF" }}
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={() => saveRoleChange(user._id)}
                            className="px-3 py-2 rounded text-white w-24 transition-all duration-300 hover:opacity-80"
                            style={{ backgroundColor: logoColor }}
                          >
                            حفظ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="ml-2 px-3 py-2 rounded text-white w-24 transition-all duration-300 hover:opacity-80"
                          style={{ backgroundColor: "#EF4444" }}
                        >
                          حذف
                        </button>
                        <button
                          onClick={() => startEditRole(user)}
                          className="px-3 py-2 rounded text-white w-24 transition-all duration-300 hover:opacity-80"
                          style={{ backgroundColor: buttonColor }}
                        >
                          تعديل
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && !isLoading && (
              <div className="bg-white p-8 text-center rounded-lg shadow-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3
                  className="text-xl font-medium mb-2"
                  style={{ color: logoColor }}
                >
                  لا يوجد مستخدمين
                </h3>
                <p className="text-gray-500">
                  {searchQuery || roleFilter !== "all" 
                    ? "لم يتم العثور على مستخدمين مطابقين للفلترة" 
                    : "لم يتم العثور على بيانات للعرض"}
                </p>
                {(searchQuery || roleFilter !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 rounded text-white transition-all duration-300 hover:opacity-80"
                    style={{ backgroundColor: buttonColor }}
                  >
                    إعادة ضبط الفلاتر
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && filteredUsers.length > 0 && (
              <div className="flex justify-center mt-6 mb-2">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-r-md disabled:opacity-50 text-white"
                    style={{ backgroundColor: buttonColor }}
                  >
                    السابق
                  </button>

                  <div className="flex">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 ${
                          currentPage === i + 1
                            ? "text-white"
                            : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                        style={
                          currentPage === i + 1
                            ? { backgroundColor: logoColor }
                            : {}
                        }
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-l-md disabled:opacity-50 text-white"
                    style={{ backgroundColor: buttonColor }}
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersPage;