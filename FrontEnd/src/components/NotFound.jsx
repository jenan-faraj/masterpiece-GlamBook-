import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  // عد تنازلي للعودة للصفحة الرئيسية
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 10000); // توجيه تلقائي بعد 10 ثواني

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-[#f4e5d6] flex flex-col items-center justify-center px-4 py-16"
      dir="rtl"
    >
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
        {/* شريط علوي بلون داكن */}
        <div className="h-2 bg-[#8a5936]"></div>

        {/* محتوى الصفحة */}
        <div className="p-8">
          {/* رمز الخطأ */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="text-[240px] font-bold text-[#a0714f]">404</div>
            </div>

            <div className="relative flex flex-col items-center">
              {/* أيقونة الحزن */}
              <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-[#f4e5d6] text-[#8a5936]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-14 h-14"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* عنوان الخطأ */}
              <h1 className="text-4xl font-bold text-[#8a5936] mb-2">
                الصفحة غير موجودة
              </h1>

              {/* رسالة الخطأ */}
              <p className="text-center text-[#a0714f] text-lg mb-8">
                عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
              </p>

              {/* أزرار التنقل */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <Link
                  to="/"
                  className="flex-1 py-3 px-6 bg-[#8a5936] hover:bg-[#754c2e] text-white text-center rounded-md transition-colors duration-300 font-medium shadow-md"
                >
                  الصفحة الرئيسية
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 px-6 bg-[#a0714f] hover:bg-[#956a4a] text-white text-center rounded-md transition-colors duration-300 font-medium shadow-md"
                >
                  العودة للخلف
                </button>
              </div>

              {/* رسالة التوجيه التلقائي */}
              <p className="mt-8 text-sm text-[#a0714f] text-center">
                سيتم توجيهك تلقائياً إلى الصفحة الرئيسية خلال 10 ثوانٍ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
