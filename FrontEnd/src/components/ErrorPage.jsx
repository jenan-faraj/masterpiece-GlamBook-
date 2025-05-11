import { useEffect } from "react";

export default function ErrorPage({ navigate, userRole }) {
  useEffect(() => {
    if (userRole !== "salon") {
      navigate("/");
    }
  }, [userRole, navigate]);

  const handleGoBack = () => {
    navigate(-1); // للعودة للصفحة السابقة
  };

  if (userRole !== "salon") {
    return null; // لا تعرض شيئًا إذا لم يكن المستخدم صالون
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          لا يمكنك حجز موعد كصالون
        </h1>
        <p className="text-gray-600 mb-6">
          عذراً، لا يمكن للصالونات حجز مواعيد. يرجى العودة للصفحة السابقة.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
        >
          العودة للصفحة السابقة
        </button>
      </div>
    </div>
  );
}
