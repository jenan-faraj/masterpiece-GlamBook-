import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "فشل تسجيل الدخول");
        return;
      }

      // توجيه المستخدم للمكان اللي كان فيه
      navigate(-1, { replace: true });
      location.reload(); // إذا بدك يتحدث تلقائياً بعد تسجيل الدخول
    } catch (err) {
      setError("حدث خطأ ما، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-amber-100">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-serif font-medium"
            style={{ color: "#B58152" }}
          >
            أهلاً بعودتك
          </h2>
          <p className="mt-2" style={{ color: "#c4a484" }}>
            سجّلي الدخول إلى حساب الصالون
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="أدخلي بريدك الإلكتروني"
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
              placeholder="أدخلي كلمة المرور"
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
              تسجيل الدخول
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm" style={{ color: "#c4a484" }}>
              ما عندِك حساب؟{" "}
              <a
                href="/register"
                className="font-medium"
                style={{ color: "#B58152" }}
              >
                أنشئي حساب جديد
              </a>
            </p>
            <a
              href="/forgot-password"
              className="block mt-2 text-sm font-medium"
              style={{ color: "#B58152" }}
            >
              نسيتي كلمة المرور؟
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
