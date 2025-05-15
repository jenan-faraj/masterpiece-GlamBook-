import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    fetchUserAuth();
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        navigate(-2, { replace: true });
        location.reload();
      }
    } catch (error) {
      console.error("Error registering", error);

      setError(error.response?.data?.message || "فشل التسجيل");
      Swal.fire({
        title: "خطأ!",
        text:
          error.response?.data?.message ||
          "فشل التسجيل، يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#a0714f",
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-amber-100">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-serif font-medium"
            style={{ color: "#B58152" }}
          >
            مرحباً بك
          </h2>
          <p className="mt-2" style={{ color: "#c4a484" }}>
            أنشئ حسابك الجديد
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#c4a484" }}
            >
              اسم المستخدم
            </label>
            <input
              type="text"
              className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#c4a484" }}
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#c4a484" }}
            >
              كلمة المرور
            </label>
            <input
              type="password"
              className="w-full p-3 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="أنشئ كلمة مرور"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-medium shadow-md hover:opacity-90 transition duration-300"
              style={{ backgroundColor: "#a0714f" }}
            >
              إنشاء حساب
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm" style={{ color: "#c4a484" }}>
              لديك حساب بالفعل؟{" "}
              <a
                href="/login"
                className="font-medium"
                style={{ color: "#B58152" }}
              >
                تسجيل الدخول
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
